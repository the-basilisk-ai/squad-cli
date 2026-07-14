import type { Environment } from "./config.js";
import { getSquadAppUrl } from "./config.js";

/**
 * Build a deep link into the Squad web app for the current workspace,
 * mirroring the MCP's slug-based links so both surfaces point users to the
 * same place.
 */
export function appLink(
  env: Environment,
  orgSlug: string,
  workspaceSlug: string,
  path?: string,
): string | undefined {
  if (!orgSlug || !workspaceSlug) return undefined;
  const base = `${getSquadAppUrl(env)}/${orgSlug}/${workspaceSlug}`;
  return path ? `${base}/${path}` : base;
}
