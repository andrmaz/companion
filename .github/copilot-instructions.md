# Copilot instructions for Companion

## Big picture

- This repo is a Mastra backend demo focused on agent runtime + MCP tools. The main entry is `src/mastra/index.ts`, which wires a `Mastra` instance, server port `4750`, and the `/chat/:agentId` route.
- The only agent is the Personal Assistant in `src/mastra/agents/personal-assistant.ts`. It composes:
  - MCP tools from Zapier via `MCPClient` (Gmail/Calendar/Linear).
  - Memory with LibSQL storage + vector store and FastEmbed.
- Environment variables are typed in `src/mastra/env.d.ts` and are required for runtime: `ANTHROPIC_API_KEY`, `ZAPIER_MCP_URL`, `MEMORY_DB_URL`, `VECTOR_DB_URL`.

## Key data flows / integrations

- Chat requests hit `/chat/:agentId` (Mastra’s `chatRoute`) and are routed to the agent named `personal` in `src/mastra/index.ts`.
- MCP tool discovery happens at startup via `await mcpClient.getTools()` and is spread into the agent `tools` object.
- Memory is configured with LibSQL backing stores; local `memory.db` / `vector.db` are already present in the repo root (used by LibSQL URLs).

## Project-specific patterns

- ESM project (`"type": "module"`) and Node >= 20.9.0. Prefer top‑level `await` as used in the agent file.
- Keep agent instructions + working memory template concise; see the `workingMemory.template` in `src/mastra/agents/personal-assistant.ts` for the canonical profile structure.
- When adding new agents, register them in the `agents` map in `src/mastra/index.ts` and expose via the chat route.

## Developer workflows

- Dev/build/start are Mastra CLI scripts (no Vite app in this repo):
  - `pnpm run mastra:dev`
  - `pnpm run mastra:build`
  - `pnpm run mastra:start`
- Lint/format:
  - `pnpm run lint`
  - `pnpm run format`
