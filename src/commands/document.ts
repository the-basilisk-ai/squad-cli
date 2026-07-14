import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliAddDocumentTagDocument,
  CliCreateDocumentDocument,
  CliDocumentListDocument,
  CliDocumentTextSearchDocument,
  CliGetDocumentMetaDocument,
  CliRemoveDocumentTagDocument,
  CliUpdateDocumentDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import {
  clampLimit,
  omitUndefined,
  output,
  outputJson,
  parseOffset,
} from "../lib/output.js";

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const docDisplayId = (kind?: string | null, displayId?: number | null) =>
  formatDisplayId(kind === "one_pager" ? "one_pager" : "document", displayId);

export function registerDocumentCommands(program: Command) {
  const document = program
    .command("document")
    .description("Manage knowledge documents");

  document
    .command("list")
    .description("Browse workspace knowledge documents with paths and tags")
    .option("--tag <tag>", "Filter to documents carrying this tag")
    .option("--limit <n>", "Max results (default 25, max 100)")
    .option("--offset <n>", "Pagination offset")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliDocumentListDocument,
          { limit: clampLimit(o.limit), offset: parseOffset(o.offset) },
          ctx,
        );
        let docs = data.documentList ?? [];
        if (o.tag) docs = docs.filter(d => (d.tags ?? []).includes(o.tag));

        output(
          docs.map(d => ({
            displayId: docDisplayId(d.kind, d.displayId) ?? d.id,
            title: d.title,
            kind: d.kind,
            path: d.path,
            tags: (d.tags ?? []).join(","),
          })),
          opts.format,
          ["displayId", "title", "kind", "path"],
        );
      } catch (error) {
        handleError(error);
      }
    });

  document
    .command("create")
    .description("Create a knowledge document from markdown (dedupes by title)")
    .requiredOption("--title <title>", "Document title")
    .requiredOption("--markdown <markdown>", "Markdown body")
    .option("--directory <directoryId>", "Directory to place the document in")
    .option("--tags <tags>", "Comma-separated tags")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const existing = await execute(
          CliDocumentTextSearchDocument,
          { search: o.title, limit: 10 },
          ctx,
        );
        const dup = (existing.documentSearch ?? []).find(
          d => d.title && normalize(d.title) === normalize(o.title),
        );
        if (dup) {
          outputJson({
            deduplicated: true,
            message: "A document with this title already exists.",
            document: {
              displayId: docDisplayId(dup.kind, dup.displayId) ?? dup.id,
              title: dup.title,
            },
          });
          return;
        }

        const created = await execute(
          CliCreateDocumentDocument,
          {
            input: {
              title: o.title,
              content: o.markdown,
              directoryId: o.directory,
            },
          },
          ctx,
        );
        const doc = created.createDocument;
        const tags: string[] = o.tags
          ? o.tags
              .split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : [];
        if (doc?.id) {
          for (const tag of tags) {
            await execute(CliAddDocumentTagDocument, { id: doc.id, tag }, ctx);
          }
        }
        outputJson({ message: "Document created", document: doc });
      } catch (error) {
        handleError(error);
      }
    });

  document
    .command("update")
    .description("Replace a document's markdown and/or title, and manage tags")
    .argument("<documentId>", "Document display ID (DC-N) or UUID")
    .option("--markdown <markdown>", "Replace the markdown body")
    .option("--title <title>", "Replace the title")
    .option("--add-tags <tags>", "Comma-separated tags to add")
    .option("--remove-tags <tags>", "Comma-separated tags to remove")
    .action(async function (this: Command, documentId: string) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        if (!o.markdown && !o.title && !o.addTags && !o.removeTags) {
          throw new Error(
            "Provide at least one of --markdown, --title, --add-tags, --remove-tags",
          );
        }
        const ctx = await resolveContext(opts.env, opts.token);

        const found = await execute(
          CliGetDocumentMetaDocument,
          { id: documentId },
          ctx,
        );
        const docUuid = found.document?.id;
        if (!docUuid) throw new Error(`Document "${documentId}" not found.`);

        if (o.markdown || o.title) {
          await execute(
            CliUpdateDocumentDocument,
            {
              id: docUuid,
              input: omitUndefined({
                content: o.markdown,
                title: o.title,
                createVersion: true,
              }),
            },
            ctx,
          );
        }
        const split = (v?: string) =>
          v
            ? v
                .split(",")
                .map(t => t.trim())
                .filter(Boolean)
            : [];
        for (const tag of split(o.addTags)) {
          await execute(CliAddDocumentTagDocument, { id: docUuid, tag }, ctx);
        }
        for (const tag of split(o.removeTags)) {
          await execute(
            CliRemoveDocumentTagDocument,
            { id: docUuid, tag },
            ctx,
          );
        }

        outputJson({
          message: "Document updated",
          displayId:
            docDisplayId(found.document?.kind, found.document?.displayId) ??
            documentId,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
