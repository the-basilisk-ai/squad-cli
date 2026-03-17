import { ResponseError } from "./openapi/squad/runtime.js";

export const EXIT_SUCCESS = 0;
export const EXIT_ERROR = 1;
export const EXIT_AUTH_ERROR = 2;
export const EXIT_VALIDATION_ERROR = 3;

export class SquadError extends Error {
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

export class ValidationError extends SquadError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", EXIT_VALIDATION_ERROR);
    this.name = "ValidationError";
  }
}

export async function formatApiError(error: unknown): Promise<string> {
  if (!(error instanceof ResponseError)) {
    return error instanceof Error ? error.message : "Unknown error";
  }

  const { status } = error.response;

  if (status === 402) {
    return "Your workspace has run out of AI credits. Please purchase flex credits or upgrade your plan.";
  }

  if (status === 401 || status === 403) {
    return "Authentication failed. Please run: squad auth login";
  }

  try {
    const body: unknown = await error.response.json();
    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof (body as Record<string, unknown>).error === "object"
    ) {
      const apiError = (body as { error: Record<string, unknown> }).error;
      if (typeof apiError.description === "string") {
        return `${apiError.description} (HTTP ${status})`;
      }
    }
  } catch {
    // Body wasn't JSON or already consumed
  }

  return `API request failed (HTTP ${status})`;
}

export async function handleError(error: unknown): Promise<never> {
  if (error instanceof SquadError) {
    outputError(error.code, error.message);
    process.exit(error.exitCode);
  }

  const message = await formatApiError(error);
  const isAuth =
    error instanceof ResponseError &&
    (error.response.status === 401 || error.response.status === 403);

  outputError(isAuth ? "AUTH_ERROR" : "API_ERROR", message);
  process.exit(isAuth ? EXIT_AUTH_ERROR : EXIT_ERROR);
}

function outputError(code: string, message: string): void {
  console.error(JSON.stringify({ error: { code, message } }));
}
