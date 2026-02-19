import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { agent } from './agents/personal-assistant';
import { createBufferDraftWorkflow } from './workflows/create-buffer-draft';

export const mastra = new Mastra({
  workflows: {
    'create-buffer-draft': createBufferDraftWorkflow,
  },
  agents: {
    'personal': agent
  },
  scorers: {},
  storage: new LibSQLStore({
    id: 'mastra-storage',
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
    apiRoutes: [],
  },
});
