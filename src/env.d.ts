/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MASTRA_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VITE_MASTRA_BASE_URL: string;
    readonly ANTHROPIC_API_KEY: string;
    readonly ZAPIER_MCP_URL: string;
    readonly MEMORY_DB_URL: string;
    readonly VECTOR_DB_URL: string;
  }
}