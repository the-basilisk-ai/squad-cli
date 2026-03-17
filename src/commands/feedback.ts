import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { output, outputJson } from "../lib/output.js";

export function registerFeedbackCommands(program: Command) {
  const feedback = program.command("feedback").description("Manage feedback");

  feedback
    .command("list")
    .description("List all feedback")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.listFeedback({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        const items = result.data.map(f => ({
          id: f.id,
          title: f.title,
        }));

        output(items, opts.format, ["id", "title"]);
      } catch (error) {
        await handleError(error);
      }
    });

  feedback
    .command("get")
    .description("Get feedback details")
    .argument("<id>", "Feedback ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getFeedback({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          feedbackId: id,
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });

  feedback
    .command("create")
    .description("Create feedback")
    .requiredOption("--title <title>", "Feedback title")
    .requiredOption("--content <content>", "Feedback content")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.createFeedback({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          createFeedbackPayload: {
            title: localOpts.title,
            content: localOpts.content,
          },
        });

        outputJson({
          id: result.id,
          title: result.title,
          message: "Feedback created",
        });
      } catch (error) {
        await handleError(error);
      }
    });

  feedback
    .command("delete")
    .description("Delete feedback")
    .argument("<id>", "Feedback ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        await client.deleteFeedback({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          feedbackId: id,
        });

        outputJson({ id, message: "Feedback deleted" });
      } catch (error) {
        await handleError(error);
      }
    });
}
