import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { fastembed } from '@mastra/fastembed';
import { MastraMCPServerDefinition, MCPClient } from '@mastra/mcp';
import { anthropic } from '@ai-sdk/anthropic';
import path from 'path';

const mcpServers: Record<string, MastraMCPServerDefinition> = {};

// Zapier MCP (Gmail, Notion)
if (process.env.ZAPIER_MCP_URL) {
    mcpServers.zapier = {
        url: new URL(process.env.ZAPIER_MCP_URL),
    };
}

const mcpClient = new MCPClient({ servers: mcpServers });

let mcpTools = {};
try {
    mcpTools = await mcpClient.getTools();
    console.log("MCP tools loaded:", Object.keys(mcpTools));
} catch (err: any) {
    console.error("Failed loading MCP tools:", err?.message || err);
}

// Resolve project root robustly even when running from compiled output
const projectRoot =
    __dirname.includes(".mastra/output")
        ? path.resolve(__dirname, "..", "..")
        : process.cwd();

const memoryDbPath = path.join(projectRoot, "memory.db");

const vectorDbPath = path.join(projectRoot, "vector.db");

// Enhanced memory configuration
const memory = new Memory({
    storage: new LibSQLStore({
        url: `file:${memoryDbPath}`,
    }),
    vector: new LibSQLVector({
        connectionUrl: `file:${vectorDbPath}`,
    }),
    embedder: fastembed,
    options: {
        lastMessages: 20,
        semanticRecall: {
            topK: 3,
            messageRange: {
                before: 2,
                after: 1,
            },
        },
        workingMemory: {
            enabled: true,
            template: `
        <user>
           <first_name></first_name>
           <username></username>
           <preferences></preferences>
           <interests></interests>
           <conversation_style></conversation_style>
         </user>`,
        },
    },
});

export const agent = new Agent({
    name: 'Personal Assistant',
    instructions: `
      You are a multi-capability assistant with enhanced memory. Core roles:
      - Use Zapier for email/productivity/memo/activities management
      - Remember user preferences and personalize responses

      Memory capabilities:
      - You have access to conversation history (last 20 messages)
      - You can search past conversations semantically
      - You can remember user information (name, preferences, interests, conversation style)
      - When you learn something about the user, update their working memory
      - Use stored information to provide personalized responses

      Capabilities detail:
      1. Email (Zapier): Summarize, send, categorize
      2. Memory: Personalized responses based on learned preferences
      3. Memo (Zapier): Write, plan and organize memos, projects, activities

      Guidelines:
      - Maintain helpful, professional tone
      - Use tools only when they add value
      - Remember user preferences and apply them
      - Be concise but thorough when needed
    `,
    model: anthropic('claude-3-5-haiku-20241022'),
    memory,
    tools: {
        ...mcpTools
    },
});
