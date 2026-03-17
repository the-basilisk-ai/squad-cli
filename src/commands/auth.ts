import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { login } from "../lib/auth/oauth.js";
import {
  clearTokens,
  getTokens,
  isTokenExpired,
} from "../lib/auth/token-store.js";
import { clearWorkspaceSelection } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { outputJson } from "../lib/output.js";

export function registerAuthCommands(program: Command) {
  const auth = program.command("auth").description("Authentication commands");

  auth
    .command("login")
    .description("Log in to Squad via browser (OAuth2 PKCE)")
    .action(async function (this: Command) {
      try {
        const { env } = getGlobalOptions(this);
        await login(env);
        outputJson({ message: "Login successful", env });
      } catch (error) {
        await handleError(error);
      }
    });

  auth
    .command("logout")
    .description("Log out and clear stored credentials")
    .action(async function (this: Command) {
      try {
        const { env } = getGlobalOptions(this);
        clearTokens(env);
        clearWorkspaceSelection(env);
        outputJson({ message: "Logged out", env });
      } catch (error) {
        await handleError(error);
      }
    });

  auth
    .command("status")
    .description("Show current authentication status")
    .action(async function (this: Command) {
      try {
        const { env } = getGlobalOptions(this);
        const tokens = getTokens(env);

        if (!tokens) {
          outputJson({ authenticated: false, env });
          return;
        }

        outputJson({
          authenticated: true,
          env,
          expired: isTokenExpired(tokens),
          expiresAt: new Date(tokens.expiresAt * 1000).toISOString(),
        });
      } catch (error) {
        await handleError(error);
      }
    });
}
