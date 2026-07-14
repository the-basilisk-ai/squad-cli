import { getSquadApiUrl } from "./config.js";
import { SquadApiError } from "./errors.js";
import type { ApiContext } from "./graphql/execute.js";

export interface IngestItem {
  content: string;
  title?: string;
  source?: string;
  strength?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface IngestResult {
  success: boolean;
  created: number;
  ids: string[];
  errors?: string[];
}

/**
 * POST feedback signals to the REST ingest route with the minted service JWT
 * and the selected workspace. Batch endpoint (1-50 items), deduped and
 * processed asynchronously.
 */
export async function ingestSignals(
  items: IngestItem[],
  ctx: ApiContext,
): Promise<IngestResult> {
  const response = await fetch(`${getSquadApiUrl(ctx.env)}/api/v1/signals`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ctx.token}`,
      "x-workspace-id": ctx.workspaceId,
    },
    body: JSON.stringify({ signals: items }),
  });

  const body = (await response.json().catch(() => undefined)) as
    | (IngestResult & { error?: string })
    | undefined;

  if (!response.ok) {
    throw new SquadApiError(
      body?.error ?? `Signal ingest failed (HTTP ${response.status})`,
      response.status,
    );
  }
  if (!body) {
    throw new SquadApiError("Signal ingest returned an empty response.");
  }
  return body;
}
