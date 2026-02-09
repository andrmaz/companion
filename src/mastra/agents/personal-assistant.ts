import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { fastembed } from '@mastra/fastembed';
import { MastraMCPServerDefinition, MCPClient } from '@mastra/mcp';
import { anthropic } from '@ai-sdk/anthropic';

const mcpServers: Record<string, MastraMCPServerDefinition> = {};

// Zapier MCP (Gmail, Google Calendar, Linear, Buffer)
if (process.env.ZAPIER_MCP_URL) {
    mcpServers.zapier = {
        url: new URL(process.env.ZAPIER_MCP_URL),
    };
}

const mcpClient = new MCPClient({ servers: mcpServers });

let mcpTools = {};
try {
    mcpTools = await mcpClient.getTools();
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
<preferences>
    <email_tone></email_tone>
    <response_length></response_length>
</preferences>
<work_context>
    <role></role>
    <active_projects></active_projects>
</work_context>
<followups>
    <pending_followups></pending_followups>
    <important_dates></important_dates>
</followups>
<recent_topics></recent_topics>
</user_profile>`,
        },
    },
});

export const agent = new Agent({
    name: 'Personal Assistant',
    instructions: `You are an intelligent personal assistant with access to Gmail, Google Calendar, Linear, and Buffer via MCP tools. You have memory capabilities to personalize your assistance.

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

## Google Calendar (via Zapier)
- Schedule, update, and cancel meetings
- Suggest optimal times based on user's availability
- Send calendar invites and reminders

## Linear (via Zapier)
- Manage GitHub projects and issues
- Create/update/track issues with clear descriptions
- Set realistic deadlines and monitor milestones
- Follow up on pending code reviews

## Buffer (via Zapier)
- Create social media post drafts (Twitter, LinkedIn, Facebook, Instagram)
- Always show preview before confirming draft creation
- Validate content against platform-specific character limits
- Suggest optimal posting times based on platform best practices
- Support scheduling and media attachments

# RESPONSE GUIDELINES
- Be concise by default - use bullet points and clear formatting
- End with actionable next steps when appropriate
- If uncertain, ask clarifying questions
- Respect user's time - be efficient and direct

# WORKFLOW EXAMPLES
**Morning Check-in**: Offer email summary, check urgent Linear issues, provide daily overview
**Task Management**: Clarify details, suggest Linear issue creation, break down large tasks
**Email Help**: Understand need (summarize/draft/send), show drafts before sending, group by importance
**Social Media**: Draft posts, check character limits, suggest hashtags, schedule for optimal times`,
    model: anthropic('claude-haiku-4-5'),
    memory,
    tools: {
        ...mcpTools,
    },
});