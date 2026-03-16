import { Command } from "commander";
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

const program = new Command();

program
  .name("squad")
  .description("Squad AI CLI - Product strategy management")
  .version("0.1.0")
  .option("--format <format>", "Output format (json, table)", "json")
  .option("--env <env>", "Environment (dev, staging, production)", "production")
  .option("--token <token>", "API access token (overrides stored auth)")
  .option("--verbose", "Enable verbose output");

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
  verbose?: boolean;
}

export function getGlobalOptions(cmd: Command): GlobalOptions {
  const root = cmd.optsWithGlobals();
  return {
    format: root.format ?? "json",
    env: root.env ?? "production",
    token: root.token,
    verbose: root.verbose,
  };
}

program.parseAsync().catch(handleError);
