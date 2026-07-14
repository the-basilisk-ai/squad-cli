const EXIT_ERROR = 1;
const EXIT_AUTH_ERROR = 2;

class SquadError extends Error {
  constructor(
    message: string,
    public code: string,
    public exitCode: number = EXIT_ERROR,
  ) {
    super(message);
    this.name = "SquadError";
  }
}

export class AuthError extends SquadError {
  constructor(message: string) {
    super(message, "AUTH_ERROR", EXIT_AUTH_ERROR);
    this.name = "AuthError";
  }
}

/** Error raised by the GraphQL/REST transport when a request fails. */
export class SquadApiError extends SquadError {
  constructor(
    message: string,
    public status?: number,
  ) {
    const isAuth = status === 401 || status === 403;
    super(message, isAuth ? "AUTH_ERROR" : "API_ERROR", isAuth ? 2 : 1);
    this.name = "SquadApiError";
  }
}

export function handleError(error: unknown): never {
  if (error instanceof SquadError) {
    outputError(error.code, error.message);
    process.exit(error.exitCode);
  }

  const message = error instanceof Error ? error.message : "Unknown error";
  outputError("ERROR", message);
  process.exit(EXIT_ERROR);
}

function outputError(code: string, message: string): void {
  console.error(JSON.stringify({ error: { code, message } }, null, 2));
}
