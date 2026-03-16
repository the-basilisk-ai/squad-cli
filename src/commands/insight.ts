import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { output, outputJson } from "../lib/output.js";

export function registerInsightCommands(program: Command) {
  const insight = program.command("insight").description("Manage insights");

  insight
    .command("list")
    .description("List all insights")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.listInsights({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        const items = result.data.map(i => ({
          id: i.id,
          title: i.title,
          type: i.type,
        }));

        output(items, opts.format, ["id", "title", "type"]);
      } catch (error) {
        handleError(error);
      }
    });

  insight
    .command("get")
    .description("Get insight details")
    .argument("<id>", "Insight ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getInsight({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          insightId: id,
        });

        outputJson(result);
      } catch (error) {
        handleError(error);
      }
    });

  insight
    .command("create")
    .description("Create an insight")
    .requiredOption("--title <title>", "Insight title")
    .requiredOption("--content <content>", "Insight content")
    .option("--type <type>", "Insight type")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.createInsight({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          createInsightPayload: {
            title: localOpts.title,
            content: localOpts.content,
            type: localOpts.type,
          },
        });

        outputJson({
          id: result.id,
          title: result.title,
          message: "Insight created",
        });
      } catch (error) {
        handleError(error);
      }
    });

  insight
    .command("delete")
    .description("Delete an insight")
    .argument("<id>", "Insight ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        await client.deleteInsight({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          insightId: id,
        });

        outputJson({ id, message: "Insight deleted" });
      } catch (error) {
        handleError(error);
      }
    });
}
