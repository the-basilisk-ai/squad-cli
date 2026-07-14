import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";
import type { Environment } from "../config.js";
import { getSquadGraphqlUrl } from "../config.js";
import { SquadApiError } from "../errors.js";

export interface ApiContext {
  token: string;
  workspaceId: string;
  env: Environment;
}

function statusMessage(status: number): string {
  if (status === 402) {
    return "Your workspace has run out of AI credits. Please purchase flex credits or upgrade your plan.";
  }
  if (status === 401 || status === 403) {
    return "Authentication failed. Please run: squad auth login";
  }
  return `API request failed (HTTP ${status})`;
}

/**
 * Execute a typed GraphQL operation against the Squad platform API.
 *
 * Attaches the minted service JWT and the selected workspace header, then
 * surfaces GraphQL and HTTP errors as SquadApiError.
 */
export async function execute<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
  ctx: ApiContext,
): Promise<TResult> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    authorization: `Bearer ${ctx.token}`,
  };
  if (ctx.workspaceId) {
    headers["x-workspace-id"] = ctx.workspaceId;
  }

  const response = await fetch(getSquadGraphqlUrl(ctx.env), {
    method: "POST",
    headers,
    body: JSON.stringify({ query: print(document), variables }),
  });

  if (!response.ok) {
    throw new SquadApiError(statusMessage(response.status), response.status);
  }

  const body = (await response.json()) as {
    data?: TResult;
    errors?: Array<{ message: string }>;
  };

  if (body.errors?.length) {
    throw new SquadApiError(body.errors.map(e => e.message).join("; "));
  }

  if (body.data === undefined || body.data === null) {
    throw new SquadApiError("Squad API returned an empty response.");
  }

  return body.data;
}
