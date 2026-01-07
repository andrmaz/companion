## Project Snapshot

- Frontend is a Vite + React 19 SPA rooted at [src/app/App.tsx](src/app/App.tsx) and rendered via [src/app/main.tsx](src/app/main.tsx); it wraps all routes in `MastraReactProvider` so Copilot agents can call the Mastra backend without extra wiring.
- The only route today is the dashboard chat surface in [src/app/pages/dashboard.tsx](src/app/pages/dashboard.tsx) where `CopilotKit` talks to the backend agent defined below.
- Styles are globally applied through [src/app/styles/globals.css](src/app/styles/globals.css); keep chat layouts full-height (`copilot-kit-chat(-container)`) unless the design brief says otherwise.
- Shared config (e.g. base URLs) lives in [src/app/meta.ts](src/app/meta.ts) and [src/app/env.d.ts](src/app/env.d.ts); add new client-side env vars there before use.

## Mastra Backend

- Mastra is bootstrapped in [src/mastra/index.ts](src/mastra/index.ts); it exposes `/chat/:agentId` plus `/personal-assistant` for CopilotKit via `registerCopilotKit`.
- The single agent registered under the `personal` key comes from [src/mastra/agents/personal-assistant.ts](src/mastra/agents/personal-assistant.ts); extend this file when changing model, tools, or memory behavior.
- Memory uses LibSQL for both storage and vectors plus `fastembed`; it requires `MEMORY_DB_URL` and `VECTOR_DB_URL` to be set at runtime, otherwise persistence fails.
- Optional Zapier MCP tools (Gmail, Calendar, Linear) are injected when `ZAPIER_MCP_URL` is present; guard new tool usages accordingly so the app still runs without Zapier.
- The agent currently runs `anthropic('claude-3-5-haiku-20241022')` and expects `ANTHROPIC_API_KEY`; choose compatible models unless you also update downstream prompt expectations.

## Frontend → Backend Contract

- `MASTRA_BASE_URL` (defined in both env files) must point to the Mastra server origin; Vite injects it as `import.meta.env.VITE_MASTRA_BASE_URL` while Mastra reads the same value from `process.env`.
- Dashboard connects to the agent through `<CopilotKit runtimeUrl={`${MASTRA_BASE_URL}/personal-assistant`} agent="personal" />`; if you change the path or agent slug, update both sides to stay in sync.
- Chat copy, instructions, and UI affordances are configured inline in [src/app/pages/dashboard.tsx](src/app/pages/dashboard.tsx); keep this tiny and push shared logic into future components under `src/app/components/`.

## Dev & Build Workflow

- Use `pnpm run dev` to launch both `mastra dev` (port 4750) and `vite` (default 5173) via `concurrently`; logs are interleaved, so prefix-aware tools help.
- Individual scripts exist for `mastra:dev`, `mastra:build`, `mastra:start`, `vite:dev`, and `vite:build`; backfilled builds should run `pnpm run vite:build` so TypeScript (`tsc -b`) runs before Vite bundles.
- Preview the static client with `pnpm run preview`, but remember it still expects a live Mastra server.
- `pnpm run lint` (eslint) and `pnpm run format` (prettier) cover the whole repo; there are no bespoke test commands yet.

## Conventions & Gotchas

- TypeScript operates in strict mode with `allowImportingTsExtensions`; keep file extensions on relative imports (see [vite.config.ts](vite.config.ts)).
- The alias `@/` resolves to `src/`; prefer it for deep imports to avoid brittle `../../..` paths.
- Mastra storage defaults to `:memory:` in [src/mastra/index.ts](src/mastra/index.ts); switch to a file or remote LibSQL URL before expecting persistence between restarts.
- When adding new UI, stick to CSS modules or global styles as needed, but keep chat layout full height so CopilotKit keeps scroll anchoring.
- No README exists yet; document new features inside `docs/` (currently empty) or update this file so future AI agents have discoverable context.
