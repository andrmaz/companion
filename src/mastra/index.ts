
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { MCPClient } from "@mastra/mcp";
import path from 'path';
import fs from "fs";

import { createEmailAssistant } from './agents/email-assistant';

// Resolve notes directory relative to project root
const projectRoot =
  __dirname.includes(".mastra/output")
    ? path.resolve(__dirname, "..", "..")
    : process.cwd();
const notesDir = path.join(projectRoot, "notes");
if (!fs.existsSync(notesDir)) {
  console.warn(`⚠ notes directory not found at ${notesDir}. Created it with: mkdir -p notes`);
}

const mcpServers: any = {};

// Zapier MCP (Gmail)
if (process.env.ZAPIER_MCP_URL) {
  mcpServers.zapier = {
    url: new URL(process.env.ZAPIER_MCP_URL),
  };
}

// Filesystem MCP (text editor / notes)
mcpServers.textEditor = {
  command: "pnpx",
  args: [
    "@modelcontextprotocol/server-filesystem",
    notesDir,
  ],
};

const mcp = new MCPClient({ servers: mcpServers });

let mcpTools = {};
try {
  mcpTools = await mcp.getTools();
  console.log("MCP tools loaded:", Object.keys(mcpTools));
} catch (err: any) {
  console.error("Failed loading MCP tools:", err?.message || err);
}

export const mastra = new Mastra({
  workflows: {},
  agents: {
    'email': await createEmailAssistant(mcpTools)
  },
  scorers: {},
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false,
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
});
