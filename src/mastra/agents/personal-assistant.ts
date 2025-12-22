import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { fastembed } from '@mastra/fastembed';
import { MastraMCPServerDefinition, MCPClient } from '@mastra/mcp';
import { anthropic } from '@ai-sdk/anthropic';

const mcpServers: Record<string, MastraMCPServerDefinition> = {};

// Zapier MCP (Gmail,, Linear)
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
};

// Enhanced memory configuration
const memory = new Memory({
    storage: new LibSQLStore({
        url: process.env.MEMORY_DB_URL,
    }),
    vector: new LibSQLVector({
        connectionUrl: process.env.VECTOR_DB_URL,
    }),
    embedder: fastembed,
    options: {
        lastMessages: 10,
        semanticRecall: {
            topK: 2,
            messageRange: {
                before: 1,
                after: 0,
            },
        },
        workingMemory: {
            enabled: true,
            template: `<user_profile>
<name></name>
<timezone></timezone>
<communication_style></communication_style>
<work_context>
  <role></role>
  <active_projects></active_projects>
  <team_members></team_members>
</work_context>
<preferences>
  <email_tone></email_tone>
  <response_length></response_length>
  <notification_level></notification_level>
</preferences>
<patterns>
  <recurring_tasks></recurring_tasks>
  <peak_hours></peak_hours>
</patterns>
<context>
  <recent_topics></recent_topics>
  <pending_followups></pending_followups>
  <important_dates></important_dates>
</context>
<learning_notes></learning_notes>
</user_profile>`,
        },
    },
});

export const agent = new Agent({
    name: 'Personal Assistant',
    instructions: `You are an intelligent personal assistant with access to Gmail and Linear via MCP tools. You have memory capabilities to personalize your assistance.

# CORE PRINCIPLES
- Be concise, proactive, and adapt to user's communication style
- Always confirm before sending emails or making destructive changes
- Use memory to personalize responses and anticipate needs
- Update user profile when you learn new preferences or patterns

# TOOL ACCESS

## Gmail (via Zapier)
- Summarize, retrieve, categorize, draft, and send emails
- Always confirm before sending
- Provide summaries in bullet points
- Flag urgent emails prominently

## Linear (via Zapier)
- Manage GitHub projects and issues
- Create/update/track issues with clear descriptions
- Set realistic deadlines and monitor milestones
- Follow up on pending code reviews

# RESPONSE GUIDELINES
- Be concise by default - use bullet points and clear formatting
- End with actionable next steps when appropriate
- If uncertain, ask clarifying questions
- Respect user's time - be efficient and direct

# WORKFLOW EXAMPLES

**Morning Check-in**: Offer email summary, check urgent Linear issues, provide daily overview
**Task Management**: Clarify details, suggest Linear issue creation, break down large tasks
**Email Help**: Understand need (summarize/draft/send), show drafts before sending, group by importance`,
    model: anthropic('claude-3-5-haiku-20241022'),
    memory,
    tools: {
        ...mcpTools
    },
});