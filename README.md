# @squadai/cli

Command-line interface for [Squad AI](https://meetsquad.ai) — work the evidence
chain (signals, insights, actions, goals, decision briefs) from your terminal or
AI agent workflows. The command surface mirrors the Squad MCP server's tools, so
the workflow is the same whichever you use.

See the [full documentation](https://docs.meetsquad.ai/guides/squad-cli) for
detailed usage guides and examples.

## Install

```bash
npm install -g @squadai/cli
```

Requires Node.js 22+.

## Platform compatibility

This CLI targets the **new Squad platform (v2)**. It is not compatible with the
legacy Squad v1 platform. If your workspace is still on Squad v1, stay on the
previous CLI release:

```bash
npm install -g @squadai/cli@0.3.x
```

## Quick start

```bash
squad auth login          # Opens browser for OAuth2 login
squad workspace list      # List available workspaces
squad workspace select <orgId> <workspaceId>
squad workspace overview  # Orient: mission, goals, activity, open work
```

## Commands

| Command | Description |
|---------|-------------|
| `squad auth login\|logout\|status` | Authenticate via OAuth2 PKCE |
| `squad workspace list\|select\|overview\|update\|members` | Manage and orient in workspaces |
| `squad signal list\|similar\|ingest\|dismiss` | Browse and capture feedback signals |
| `squad cluster list\|get` | Recurring themes across signals |
| `squad insight list\|update` | Distilled insights (AI-derived) |
| `squad action list\|context\|status\|update` | Work the action queue |
| `squad goal list\|create\|update` | Strategic goals |
| `squad research list\|create` | Research questions (knowledge gaps) |
| `squad document list\|create\|update` | Knowledge documents |
| `squad brief list\|generate\|status` | Decision briefs (one-pagers) |
| `squad integration list` | Connected feedback sources |
| `squad activity` | Workspace change feed |
| `squad search <query>` | Keyword search across the workspace |
| `squad get <id>` | Fetch any entity by display ID (e.g. `AC-12`) or UUID |

Entities are addressed by display ID: `SI` signal, `IN` insight, `AC` action,
`GL` goal, `OP` decision brief, `DC` document, `RQ` research question, `CL`
cluster. All commands support `--format json|table` and `--env dev|production`.

## Configuration

Config is stored in `~/.config/squad/` (respects `XDG_CONFIG_HOME`):

- `auth.json` — OAuth session and cached service JWTs
- `client.json` — Registered OAuth client IDs
- `workspace.json` — Selected workspace per environment

`squad auth login` runs an OAuth 2.1 PKCE flow against PropelAuth. The resulting
opaque token is exchanged with the platform for a short-lived service JWT (scoped
to the selected org), which is sent with every GraphQL request together with an
`x-workspace-id` header.

Override auth with `SQUAD_TOKEN` (a service JWT). Select environment with
`SQUAD_ENV` (`dev` or `production`) or `--env`. `SQUAD_GRAPHQL_URL` overrides the
GraphQL endpoint.

## Development

```bash
yarn install
yarn build        # Build to dist/cli.js (tsup)
yarn dev          # Watch mode
yarn typecheck    # tsc --noEmit
yarn test         # vitest
```

Lint and format:

```bash
yarn format       # Check (Biome)
yarn format:fix   # Auto-fix
yarn knip         # Dead code detection (Knip)
```

The typed GraphQL client is generated from `schema.graphql` (a committed
snapshot of the platform schema) and the operations in `src/graphql/**/*.graphql`:

```bash
yarn codegen       # Regenerate src/gql/
yarn codegen:check # Fail if src/gql/ is stale (run in CI)
```

Refresh `schema.graphql` from the platform API, or point `SQUAD_GRAPHQL_URL` at a
live endpoint, then rerun `yarn codegen`.

### Smoke test

```bash
./scripts/smoke-test.sh <org-id> <workspace-id>
```

## Architecture

```
src/
├── cli.ts              # Entry point (Commander.js)
├── commands/           # One module per entity (signal, insight, action, ...)
├── graphql/            # Named GraphQL operations (*.graphql)
├── gql/                # Generated typed documents (do not edit)
└── lib/
    ├── auth/           # OAuth2 PKCE flow, token store, JWT exchange
    ├── graphql/        # execute() transport (Bearer + x-workspace-id)
    ├── config.ts       # Environment config
    ├── context.ts      # Workspace directory, selection, JWT resolution
    ├── display-id.ts   # Display-ID parsing/formatting
    ├── errors.ts       # Error handling
    ├── format.ts       # Deep links into the app
    ├── ingest.ts       # REST signal ingest client
    └── output.ts       # JSON/table formatting
```

## License

MIT
