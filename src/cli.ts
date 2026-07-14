import { readFileSync } from "node:fs";
import { Command, Option } from "commander";
import { registerAuthCommands } from "./commands/auth.js";
import { registerFeedbackCommands } from "./commands/feedback.js";
import { registerGoalCommands } from "./commands/goal.js";
import { registerInsightCommands } from "./commands/insight.js";
import { registerKnowledgeCommands } from "./commands/knowledge.js";
import { registerOpportunityCommands } from "./commands/opportunity.js";
import { registerSearchCommands } from "./commands/search.js";
import { registerSolutionCommands } from "./commands/solution.js";
import { registerViewCommands } from "./commands/view.js";
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
  .description("Squad AI CLI - Product strategy management")
  .version(version)
  .option("--format <format>", "Output format (json, table)", "json")
  .addOption(
    new Option("--env <env>", "Environment")
      .choices(["dev", "staging", "production"])
      .default("production"),
  )
  .option("--token <token>", "API access token (overrides stored auth)");

registerAuthCommands(program);
registerWorkspaceCommands(program);
registerOpportunityCommands(program);
registerSolutionCommands(program);
registerGoalCommands(program);
registerKnowledgeCommands(program);
registerFeedbackCommands(program);
registerInsightCommands(program);
registerSearchCommands(program);
registerViewCommands(program);

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
