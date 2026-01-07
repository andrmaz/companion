import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { chatRoute } from '@mastra/ai-sdk';
import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { agent } from './agents/personal-assistant';

export const mastra = new Mastra({
  workflows: {},
  agents: {
    'personal': agent
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
  /* observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: false },
  }, */
  server: {
    // Use a non-default port to avoid conflicts with other Mastra servers running locally
    port: 4750,
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      chatRoute({
        path: "/chat/:agentId",
      }),
      registerCopilotKit({
        path: "/chat",
        resourceId: "personalAssistant",
      }),
    ],
  },
});
