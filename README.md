# Companion

Companion is a tiny demo that shows how Mastra can power an agent runtime with MCP tools.

## Why this exists

- **Mastra** provides the agent runtime and tool orchestration.

## What you’ll see

- A Mastra server with a chat route and a single Personal Assistant agent.

## Where things live

- Mastra backend entry: [src/mastra/index.ts](src/mastra/index.ts)
- Personal Assistant agent: [src/mastra/agents/personal-assistant.ts](src/mastra/agents/personal-assistant.ts)

## Run it locally

1. Set environment variables (see [.env.example](.env.example)).
2. Start the dev server:

- `pnpm run mastra:dev`
