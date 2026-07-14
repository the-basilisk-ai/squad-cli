import type { Environment } from "../config.js";
import { getSquadApiUrl } from "../config.js";
import { AuthError } from "../errors.js";

export interface TokenExchangeResult {
  /** The minted PropelAuth service JWT accepted by the GraphQL API. */
  accessToken: string;
  /** Unix seconds when the minted JWT expires. */
  expiresAt: number;
  /** PropelAuth org ID the JWT is scoped to. */
  activeOrgId: string;
}

interface TokenExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  active_org_id: string;
}

/**
 * Exchange the opaque OAuth 2.1 access token for a minted service JWT via the
 * platform's token-exchange endpoint. The endpoint introspects the opaque
 * token, resolves the active org (the supplied one, else the user's sole org)
 * and mints a JWT the GraphQL API accepts.
 */
export async function exchangeToken(
  env: Environment,
  opaqueToken: string,
  orgId?: string,
): Promise<TokenExchangeResult> {
  const response = await fetch(`${getSquadApiUrl(env)}/api/v1/auth/token`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${opaqueToken}`,
    },
    body: JSON.stringify(orgId ? { org_id: orgId } : {}),
  });

  const body = (await response.json().catch(() => undefined)) as
    | (TokenExchangeResponse & { error?: string })
    | undefined;

  if (!response.ok || !body?.access_token) {
    throw new AuthError(
      body?.error ?? `Token exchange failed (HTTP ${response.status})`,
    );
  }

  return {
    accessToken: body.access_token,
    expiresAt: Math.floor(Date.now() / 1000) + body.expires_in,
    activeOrgId: body.active_org_id,
  };
}
