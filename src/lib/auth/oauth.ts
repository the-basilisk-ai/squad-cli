import crypto from "node:crypto";
import http from "node:http";
import { URL } from "node:url";
import type { Environment } from "../config.js";
import { getOAuthResource, getPropelAuthUrl } from "../config.js";
import { AuthError } from "../errors.js";
import {
  getOAuthSession,
  getStoredClient,
  type OAuthSession,
  saveClient,
  saveOAuthSession,
} from "./token-store.js";

const SCOPE = "read:workspace write:workspace openid email";

function base64url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateCodeVerifier(): string {
  return base64url(crypto.randomBytes(32));
}

function generateCodeChallenge(verifier: string): string {
  return base64url(crypto.createHash("sha256").update(verifier).digest());
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

function toSession(data: TokenResponse): OAuthSession {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
  };
}

/**
 * Register the CLI as a public OAuth client via dynamic client registration
 * (RFC 7591) for the exact loopback redirect URI we will use. PropelAuth
 * validates the redirect URI strictly, so the registered URI must match the
 * one sent on the authorize request (port included) — we therefore register
 * per login once the loopback port is known. The client id is persisted for
 * later refreshes.
 */
async function registerPublicClient(
  env: Environment,
  redirectUri: string,
): Promise<string> {
  const authUrl = getPropelAuthUrl(env);
  const response = await fetch(`${authUrl}/oauth/2.1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Squad CLI",
      redirect_uris: [redirectUri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      scope: SCOPE,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new AuthError(
      `Client registration failed (HTTP ${response.status}): ${body}`,
    );
  }

  const data = (await response.json()) as { client_id: string };
  saveClient(env, { clientId: data.client_id });
  return data.client_id;
}

async function requestToken(
  authUrl: string,
  params: Record<string, string>,
): Promise<TokenResponse> {
  const response = await fetch(`${authUrl}/oauth/2.1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new AuthError(
      `Token request failed (HTTP ${response.status}): ${body}`,
    );
  }

  return response.json() as Promise<TokenResponse>;
}

/**
 * Refresh the opaque OAuth session using its refresh token. Throws when no
 * refresh token or client is available, prompting re-login.
 */
export async function refreshOAuthSession(
  env: Environment,
): Promise<OAuthSession> {
  const current = getOAuthSession(env);
  const client = getStoredClient(env);
  if (!current?.refreshToken || !client) {
    throw new AuthError("Session expired. Please run: squad auth login");
  }

  let data: TokenResponse;
  try {
    data = await requestToken(getPropelAuthUrl(env), {
      grant_type: "refresh_token",
      client_id: client.clientId,
      refresh_token: current.refreshToken,
    });
  } catch {
    throw new AuthError("Session expired. Please run: squad auth login");
  }

  const session = toSession({
    ...data,
    refresh_token: data.refresh_token ?? current.refreshToken,
  });
  saveOAuthSession(env, session);
  return session;
}

/**
 * Run the OAuth2 PKCE login flow against PropelAuth: bind a loopback server,
 * register a public client for that exact redirect URI, open the browser to
 * the authorization URL, exchange the returned code for tokens, and store the
 * opaque OAuth session. The service JWT used for API calls is minted later
 * from this session by the token-exchange endpoint.
 */
export async function login(env: Environment): Promise<OAuthSession> {
  const authUrl = getPropelAuthUrl(env);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = base64url(crypto.randomBytes(16));

  return new Promise<OAuthSession>((resolve, reject) => {
    let timeout: NodeJS.Timeout;
    let clientId = "";
    let redirectUri = "";

    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://localhost");
        if (url.pathname !== "/callback") {
          res.writeHead(404);
          res.end();
          return;
        }

        const error = url.searchParams.get("error");
        if (error) {
          const description =
            url.searchParams.get("error_description") || error;
          const safe = description
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(
            `<html><body><h1>Login failed</h1><p>${safe}</p></body></html>`,
          );
          clearTimeout(timeout);
          server.close();
          reject(new AuthError(`Login failed: ${description}`));
          return;
        }

        const code = url.searchParams.get("code");
        const returnedState = url.searchParams.get("state");
        if (!code || returnedState !== state) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<html><body><h1>Invalid callback</h1></body></html>");
          clearTimeout(timeout);
          server.close();
          reject(new AuthError("Invalid OAuth callback"));
          return;
        }

        const data = await requestToken(authUrl, {
          grant_type: "authorization_code",
          client_id: clientId,
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        });

        const session = toSession(data);
        saveOAuthSession(env, session);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<html><body><h1>Logged in to Squad</h1><p>You can close this window.</p></body></html>",
        );
        clearTimeout(timeout);
        server.close();
        resolve(session);
      } catch (err) {
        clearTimeout(timeout);
        server.close();
        reject(err);
      }
    });

    server.listen(0, "127.0.0.1", async () => {
      try {
        const port = (server.address() as { port: number }).port;
        redirectUri = `http://localhost:${port}/callback`;
        clientId = await registerPublicClient(env, redirectUri);

        const authorizeUrl = new URL(`${authUrl}/oauth/2.1/authorize`);
        authorizeUrl.searchParams.set("response_type", "code");
        authorizeUrl.searchParams.set("client_id", clientId);
        authorizeUrl.searchParams.set("redirect_uri", redirectUri);
        authorizeUrl.searchParams.set("code_challenge", codeChallenge);
        authorizeUrl.searchParams.set("code_challenge_method", "S256");
        authorizeUrl.searchParams.set("state", state);
        authorizeUrl.searchParams.set("scope", SCOPE);
        authorizeUrl.searchParams.set("resource", getOAuthResource(env));

        const waiting = (message: string) =>
          console.error(
            JSON.stringify(
              { status: "waiting", message, url: authorizeUrl.toString() },
              null,
              2,
            ),
          );

        try {
          const open = (await import("open")).default;
          await open(authorizeUrl.toString());
          waiting("Opening browser for login");
        } catch {
          waiting("Open this URL in your browser to log in");
        }
      } catch (err) {
        clearTimeout(timeout);
        server.close();
        reject(err);
      }
    });

    timeout = setTimeout(() => {
      server.close();
      reject(new AuthError("Login timed out after 5 minutes"));
    }, 300_000);
  });
}
