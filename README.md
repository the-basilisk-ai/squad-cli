# @squadai/cli

Command-line interface for [Squad AI](https://meetsquad.ai) — manage product strategy (goals, opportunities, solutions, feedback, insights) from your terminal or AI agent workflows.

## Install

```bash
npm install -g @squadai/cli
```

Requires Node.js 22+.

## Quick start

```bash
squad auth login          # Opens browser for OAuth2 login
squad workspace list      # List available workspaces
squad workspace select <orgId> <workspaceId>
```

## Commands

| Command | Description |
|---------|-------------|
| `squad auth login\|logout\|status` | Authenticate via OAuth2 PKCE |
| `squad workspace list\|select\|get\|update` | Manage workspaces |
| `squad opportunity list\|get\|create\|update\|delete` | Track problem statements |
| `squad solution list\|get\|create\|update\|delete` | Define and manage solutions |
| `squad goal list\|get\|create\|update\|delete` | Set business objectives |
| `squad feedback list\|get\|create\|delete` | Capture customer feedback |
| `squad insight list\|get\|create\|delete` | Record insights |
| `squad knowledge list\|get\|create\|delete` | Manage knowledge base |
| `squad search <query>` | Semantic search across workspace |
| `squad view strategy-context` | Full strategy context |
| `squad view roadmap` | Solutions by horizon (Now/Next/Later) |
| `squad opportunity generate-solutions <id>` | AI-generated solutions |
| `squad solution prioritise --solution-ids <ids>` | AI-powered prioritisation |

All commands support `--format json|table`, `--env dev|staging|production`, and `--verbose`.

## Configuration

Config is stored in `~/.config/squad/` (respects `XDG_CONFIG_HOME`):

- `auth.json` — OAuth tokens (file mode `0600`)
- `client.json` — Registered OAuth client IDs
- `workspace.json` — Selected workspace per environment

Override auth with `SQUAD_TOKEN` env var. Select environment with `SQUAD_ENV`.

## Development

```bash
yarn install --frozen-lockfile
yarn build    # Build to dist/cli.js
yarn dev      # Watch mode
```

Lint and format:

```bash
yarn format       # Check
yarn format:fix   # Auto-fix
```

Regenerate the API client from the OpenAPI spec:

```bash
yarn openapi:squad
```

### Smoke tests

```bash
./scripts/smoke-test.sh <org-id> <workspace-id>
```

## Architecture

```
src/
├── cli.ts              # Entry point (Commander.js)
├── commands/           # Command modules (auth, workspace, opportunity, etc.)
└── lib/
    ├── auth/           # OAuth2 PKCE flow + token storage
    ├── clients/        # API client with auth middleware
    ├── openapi/        # Generated TypeScript Fetch client
    ├── config.ts       # Environment config
    ├── context.ts      # Auth + workspace context resolution
    ├── errors.ts       # Error handling
    └── output.ts       # JSON/table formatting
```

## License

MIT
