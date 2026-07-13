export type Environment = "dev" | "staging" | "production";

export function getPropelAuthUrl(env?: Environment): string {
  const squadEnv =
    env || (process.env.SQUAD_ENV as Environment) || "production";

  if (squadEnv === "dev") {
    return "https://26904088430.propelauthtest.com";
  }
  if (squadEnv === "staging") {
    return "https://auth.uat.v1.meetsquad.ai";
  }
  return "https://auth.v1.meetsquad.ai";
}

export function getSquadApiUrl(env?: Environment): string {
  const squadEnv =
    env || (process.env.SQUAD_ENV as Environment) || "production";

  if (squadEnv === "dev") {
    return "https://dev.api.v1.meetsquad.ai";
  }
  if (squadEnv === "staging") {
    return "https://uat.api.v1.meetsquad.ai";
  }
  return "https://api.v1.meetsquad.ai";
}
