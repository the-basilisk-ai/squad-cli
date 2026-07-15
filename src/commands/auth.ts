import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { login } from "../lib/auth/oauth.js";
import {
  clearAuth,
  getOAuthSession,
  isExpired,
} from "../lib/auth/token-store.js";
import {
  autoSelectWorkspace,
  clearWorkspaceSelection,
} from "../lib/context.js";
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

        // Authentication succeeded and the session is persisted. Picking a
        // workspace is a separate, best-effort step — never fail login if it
        // can't complete (e.g. a transient directory error).
        let result: Awaited<ReturnType<typeof autoSelectWorkspace>>;
        try {
          result = await autoSelectWorkspace(env);
        } catch {
          outputJson({
            message:
              "Login successful. Run 'squad workspace list' to choose a workspace.",
            env,
            next: "squad workspace list",
          });
          return;
        }

        if (result.selected) {
          outputJson({
            message: "Login successful",
            env,
            workspace: {
              orgId: result.selected.orgId,
              workspaceId: result.selected.workspaceId,
            },
          });
          return;
        }

        outputJson({
          message: "Login successful. Select a workspace to continue.",
          env,
          next: "squad workspace select <orgId> <workspaceId>",
          available: result.directory.workspaces.map(ws => ({
            orgId: ws.orgId,
            orgName: ws.orgName,
            workspaceId: ws.id,
            workspaceName: ws.name,
          })),
        });
      } catch (error) {
        handleError(error);
      }
    });

  auth
    .command("logout")
    .description("Log out and clear stored credentials")
    .action(async function (this: Command) {
      try {
        const { env } = getGlobalOptions(this);
        clearAuth(env);
        clearWorkspaceSelection(env);
        outputJson({ message: "Logged out", env });
      } catch (error) {
        handleError(error);
      }
    });

  auth
    .command("status")
    .description("Show current authentication status")
    .action(async function (this: Command) {
      try {
        const { env } = getGlobalOptions(this);
        const session = getOAuthSession(env);
        if (!session) {
          outputJson({ authenticated: false, env });
          return;
        }
        outputJson({
          authenticated: true,
          env,
          sessionExpired: isExpired(session.expiresAt),
          expiresAt: new Date(session.expiresAt * 1000).toISOString(),
        });
      } catch (error) {
        handleError(error);
      }
    });
}
