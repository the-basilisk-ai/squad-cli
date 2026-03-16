export type Environment = "dev" | "staging" | "production";

export function getPropelAuthUrl(env?: Environment): string {
  const squadEnv =
    env || (process.env.SQUAD_ENV as Environment) || "production";

  if (squadEnv === "dev") {
    return "https://26904088430.propelauthtest.com";
  }
  if (squadEnv === "staging") {
    return "https://auth.app.meetsquad.ai";
  }
  return "https://auth.meetsquad.ai";
}

export function getSquadApiUrl(env?: Environment): string {
  const squadEnv =
    env || (process.env.SQUAD_ENV as Environment) || "production";

  if (squadEnv === "dev") {
    return "https://dev.api.meetsquad.ai";
  }
  if (squadEnv === "staging") {
    return "https://uat.api.meetsquad.ai";
  }
  return "https://api.meetsquad.ai";
}

export function getSquadAppUrl(env?: Environment): string {
  const squadEnv =
    env || (process.env.SQUAD_ENV as Environment) || "production";

  if (squadEnv === "dev") {
    return "https://dev.meetsquad.ai";
  }
  if (squadEnv === "staging") {
    return "https://uat.meetsquad.ai";
  }
  return "https://app.meetsquad.ai";
}

