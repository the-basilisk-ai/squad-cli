import { readFileSync } from "node:fs";
import { Command, Option } from "commander";
import { registerActionCommands } from "./commands/action.js";
import { registerActivityCommands } from "./commands/activity.js";
import { registerAuthCommands } from "./commands/auth.js";
import { registerBriefCommands } from "./commands/brief.js";
import { registerClusterCommands } from "./commands/cluster.js";
import { registerDocumentCommands } from "./commands/document.js";
import { registerGetCommand } from "./commands/get.js";
import { registerGoalCommands } from "./commands/goal.js";
import { registerInsightCommands } from "./commands/insight.js";
import { registerIntegrationCommands } from "./commands/integration.js";
import { registerResearchCommands } from "./commands/research.js";
import { registerSearchCommands } from "./commands/search.js";
import { registerSignalCommands } from "./commands/signal.js";
import { registerWorkspaceCommands } from "./commands/workspace.js";
import type { Environment } from "./lib/config.js";
import { handleError } from "./lib/errors.js";

// Read the version from package.json (shipped alongside the bundled CLI) so it
// stays in sync with the published package instead of drifting from a literal.
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

const program = new Command();

program
  .name("squad")
  .description("Squad AI CLI - Product strategy for AI agents and humans")
  .version(version)
  .option("--format <format>", "Output format (json, table)", "json")
  // Internal-only: point the CLI at dev. Hidden from --help; production users
  // never need it. Kept as an explicit per-invocation flag rather than an env
  // var so it can't linger in a shell and silently target the wrong platform.
  .addOption(
    new Option("--env <env>", "Environment (internal)")
      .choices(["dev", "production"])
      .default("production")
      .hideHelp(),
  )
  .option("--token <token>", "Service JWT (overrides stored auth)");

registerAuthCommands(program);
registerWorkspaceCommands(program);
registerSignalCommands(program);
registerClusterCommands(program);
registerInsightCommands(program);
registerActionCommands(program);
registerGoalCommands(program);
registerResearchCommands(program);
registerDocumentCommands(program);
registerBriefCommands(program);
registerIntegrationCommands(program);
registerActivityCommands(program);
registerSearchCommands(program);
registerGetCommand(program);

export interface GlobalOptions {
  format: string;
  env: Environment;
  token?: string;
}

export function getGlobalOptions(cmd: Command): GlobalOptions {
  const root = cmd.optsWithGlobals();
  return {
    format: root.format ?? "json",
    env: root.env ?? "production",
    token: root.token,
  };
}

program.parseAsync().catch(handleError);
