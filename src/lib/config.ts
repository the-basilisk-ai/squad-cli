/**
 * Environment switching for the Squad platform.
 *
 * The platform has two environments: dev and production. The environment is
 * chosen by the internal `--env` flag (production by default) and threaded
 * through as an explicit `env` argument; each URL getter falls back to
 * production when none is given.
 */

export type Environment = "dev" | "production";

function resolveEnv(env?: Environment): Environment {
  return env ?? "production";
}

/** PropelAuth issuer for the OAuth 2.1 login flow. */
export function getPropelAuthUrl(env?: Environment): string {
  if (resolveEnv(env) === "dev") {
    return "https://48820142.propelauthtest.com";
  }
  return "https://auth.meetsquad.ai";
}

/** Base URL of the Squad platform API (GraphQL + REST ingest live under it). */
export function getSquadApiUrl(env?: Environment): string {
  if (resolveEnv(env) === "dev") {
    return "https://dev.api.v2.meetsquad.ai";
  }
  return "https://api.meetsquad.ai";
}

/**
 * GraphQL endpoint of the Squad platform API.
 * SQUAD_GRAPHQL_URL overrides (also used by codegen introspection).
 */
export function getSquadGraphqlUrl(env?: Environment): string {
  return process.env.SQUAD_GRAPHQL_URL || `${getSquadApiUrl(env)}/graphql`;
}

/**
 * OAuth resource indicator (RFC 8707) sent on the authorize request. The
 * PropelAuth project requires it to name a resource it recognizes. Overridable
 * via SQUAD_OAUTH_RESOURCE; defaults to the platform API URL.
 */
export function getOAuthResource(env?: Environment): string {
  return process.env.SQUAD_OAUTH_RESOURCE || getSquadApiUrl(env);
}

/** Web app base URL, used to build deep links back into Squad. */
export function getSquadAppUrl(env?: Environment): string {
  if (resolveEnv(env) === "dev") {
    return "https://dev.v2.meetsquad.ai";
  }
  return "https://app.meetsquad.ai";
}
