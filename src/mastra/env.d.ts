declare namespace NodeJS {
    interface ProcessEnv {
        readonly ANTHROPIC_API_KEY: string;
        readonly ZAPIER_MCP_URL: string;
        readonly MEMORY_DB_URL: string;
        readonly VECTOR_DB_URL: string;
    }
}