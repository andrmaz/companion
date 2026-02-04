# Agent Instructions for Companion

## Project Overview

This repository is a Mastra backend demo focused on agent runtime with Model Context Protocol (MCP) tools integration.

### Architecture

- **Main Entry Point**: [src/mastra/index.ts](../src/mastra/index.ts)
  - Wires the `Mastra` instance
  - Configures server on port `4750`
  - Exposes `/chat/:agentId` route

### Current Agents

- **Personal Assistant** ([src/mastra/agents/personal-assistant.ts](../src/mastra/agents/personal-assistant.ts))
  - Integrates MCP tools from Zapier via `MCPClient` (Gmail, Calendar, Linear)
  - Memory system using LibSQL storage with vector store and FastEmbed
  - Agent ID: `personal` (used in routing)

## Environment Configuration

Required environment variables (typed in [src/mastra/env.d.ts](../src/mastra/env.d.ts)):

```
ANTHROPIC_API_KEY       # API key for Anthropic Claude
ZAPIER_MCP_URL          # MCP server URL for Zapier tools
MEMORY_DB_URL           # LibSQL database URL for memory storage
VECTOR_DB_URL           # LibSQL database URL for vector storage
```

Local databases `memory.db` and `vector.db` are present in the repository root.

## Key Integration Points

### Chat Request Flow

1. HTTP requests to `/chat/:agentId` handled by Mastra's `chatRoute`
2. Requests routed to agent by ID (currently `personal`)
3. Agent processes with MCP tools and memory context
4. Response returned to client

### MCP Tool Discovery

- Tools discovered at startup via `await mcpClient.getTools()`
- Tool definitions spread into agent's `tools` configuration
- Currently integrates Zapier MCP tools (Gmail, Calendar, Linear)

### Memory System

- LibSQL backing stores for persistence and vector storage
- FastEmbed for vector embeddings
- Working memory template defines user profile structure (see `workingMemory.template` in personal-assistant.ts)

## Development Guidelines

### Tech Stack

- **Runtime**: Node.js >= 20.9.0
- **Module System**: ESM (`"type": "module"`)
- **Language**: TypeScript
- **Coding Style**: Top-level `await` supported and preferred

### Code Patterns

1. **Keep agent instructions concise**: Follow the pattern in `personal-assistant.ts`
2. **Working memory template**: Use the canonical profile structure for user context
3. **Adding new agents**:
   - Create agent file in `src/mastra/agents/`
   - Register in the `agents` map in `src/mastra/index.ts`
   - Agent will be available via `/chat/:agentId` route

### Available Commands

```bash
# Development
pnpm run mastra:dev      # Start development server with hot reload

# Production
pnpm run mastra:build    # Build for production
pnpm run mastra:start    # Start production server

# Code Quality
pnpm run lint            # Run ESLint
pnpm run format          # Format code with Prettier
```

## File Structure

```
companion/
├── src/
│   └── mastra/
│       ├── index.ts                    # Main Mastra instance and routing
│       ├── env.d.ts                    # Environment variable types
│       └── agents/
│           └── personal-assistant.ts   # Personal assistant agent
├── memory.db                           # LibSQL memory storage
├── vector.db                           # LibSQL vector storage
└── package.json                        # Project dependencies and scripts
```

## Notes for AI Agents

- When suggesting changes, respect the ESM module system
- Maintain the existing memory template structure for consistency
- New MCP tool integrations should follow the `mcpClient.getTools()` pattern
- Test environment variables are properly defined before suggesting runtime code
- The Mastra framework handles routing and agent lifecycle; avoid reimplementing these
