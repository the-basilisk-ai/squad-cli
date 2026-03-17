import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { output, outputJson } from "../lib/output.js";

export function registerKnowledgeCommands(program: Command) {
  const knowledge = program
    .command("knowledge")
    .description("Manage knowledge items");

  knowledge
    .command("list")
    .description("List all knowledge items")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.listKnowledge({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        const items = result.data.map(k => ({
          id: k.id,
          title: k.title,
        }));

        output(items, opts.format, ["id", "title"]);
      } catch (error) {
        await handleError(error);
      }
    });

  knowledge
    .command("get")
    .description("Get knowledge item details")
    .argument("<id>", "Knowledge item ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getKnowledge({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          knowledgeId: id,
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });

  knowledge
    .command("create")
    .description("Create a knowledge item")
    .requiredOption("--title <title>", "Knowledge item title")
    .requiredOption("--description <description>", "Short summary of the knowledge")
    .requiredOption("--content <content>", "Knowledge content")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.createKnowledge({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          createKnowledgePayload: {
            title: localOpts.title,
            description: localOpts.description,
            content: localOpts.content,
          },
        });

        outputJson({
          id: result.data.id,
          title: result.data.title,
          message: "Knowledge created",
        });
      } catch (error) {
        await handleError(error);
      }
    });

  knowledge
    .command("delete")
    .description("Delete a knowledge item")
    .argument("<id>", "Knowledge item ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        await client.deleteKnowledge({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          knowledgeId: id,
        });

        outputJson({ id, message: "Knowledge deleted" });
      } catch (error) {
        await handleError(error);
      }
    });
}
