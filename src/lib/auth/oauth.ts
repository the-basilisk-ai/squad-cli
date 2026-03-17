import crypto from "node:crypto";
import http from "node:http";
import { URL } from "node:url";
import type { Environment } from "../config.js";
import { getPropelAuthUrl, getSquadApiUrl } from "../config.js";
import { AuthError } from "../errors.js";
import {
  getStoredClient,
  type StoredTokens,
  saveClient,
  saveTokens,
} from "./token-store.js";

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
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface JwtExchangeResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function exchangeOpaqueForJwt(
  apiUrl: string,
  opaqueToken: string,
): Promise<JwtExchangeResponse> {
  const response = await fetch(`${apiUrl}/v1/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opaqueToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new AuthError(
      `JWT exchange failed (HTTP ${response.status}): ${body}`,
    );
  }

  return response.json() as Promise<JwtExchangeResponse>;
}

async function ensureClientRegistered(env: Environment): Promise<string> {
  const stored = getStoredClient(env);
  if (stored) return stored.clientId;

  const authUrl = getPropelAuthUrl(env);
  const response = await fetch(`${authUrl}/oauth/2.1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "Squad CLI",
      redirect_uris: ["http://localhost/callback"],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
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

async function exchangeCodeForTokens(
  authUrl: string,
  clientId: string,
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const tokenUrl = `${authUrl}/oauth/2.1/token`;
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new AuthError(
      `Token exchange failed (HTTP ${response.status}): ${body}`,
    );
  }

  return response.json() as Promise<TokenResponse>;
}

export async function refreshAccessToken(
  env: Environment,
  refreshToken: string,
): Promise<StoredTokens> {
  const authUrl = getPropelAuthUrl(env);
  const clientId = await ensureClientRegistered(env);
  const tokenUrl = `${authUrl}/oauth/2.1/token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new AuthError("Session expired. Please run: squad auth login");
  }

  const data = (await response.json()) as TokenResponse;

  const apiUrl = getSquadApiUrl(env);
  const jwt = await exchangeOpaqueForJwt(apiUrl, data.access_token);

  const tokens: StoredTokens = {
    accessToken: jwt.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + jwt.expires_in,
  };

  saveTokens(env, tokens);
  return tokens;
}

/**
 * Run the OAuth2 PKCE login flow:
 * 1. Register the CLI as a public OAuth client (if not already registered)
 * 2. Start a local HTTP server on a random port
 * 3. Open the browser to the authorization URL
 * 4. Wait for the callback with the authorization code
 * 5. Exchange the code for tokens (PKCE, no client secret)
 * 6. Store the tokens
 */
export async function login(env: Environment): Promise<StoredTokens> {
  const authUrl = getPropelAuthUrl(env);
  const clientId = await ensureClientRegistered(env);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = base64url(crypto.randomBytes(16));

  return new Promise((resolve, reject) => {
    let timeout: NodeJS.Timeout;
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

        const port = (server.address() as { port: number }).port;
        const redirectUri = `http://localhost:${port}/callback`;
        const data = await exchangeCodeForTokens(
          authUrl,
          clientId,
          code,
          codeVerifier,
          redirectUri,
        );

        const apiUrl = getSquadApiUrl(env);
        const jwt = await exchangeOpaqueForJwt(apiUrl, data.access_token);

        const tokens: StoredTokens = {
          accessToken: jwt.access_token,
          refreshToken: data.refresh_token,
          expiresAt: Math.floor(Date.now() / 1000) + jwt.expires_in,
        };

        saveTokens(env, tokens);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<html><body><h1>Logged in to Squad</h1><p>You can close this window.</p></body></html>",
        );
        clearTimeout(timeout);
        server.close();
        resolve(tokens);
      } catch (err) {
        clearTimeout(timeout);
        server.close();
        reject(err);
      }
    });

    server.listen(0, "127.0.0.1", async () => {
      const port = (server.address() as { port: number }).port;
      const redirectUri = `http://localhost:${port}/callback`;

      const authorizeUrl = new URL(`${authUrl}/oauth/2.1/authorize`);
      authorizeUrl.searchParams.set("response_type", "code");
      authorizeUrl.searchParams.set("client_id", clientId);
      authorizeUrl.searchParams.set("redirect_uri", redirectUri);
      authorizeUrl.searchParams.set("code_challenge", codeChallenge);
      authorizeUrl.searchParams.set("code_challenge_method", "S256");
      authorizeUrl.searchParams.set("state", state);
      authorizeUrl.searchParams.set("resource", getSquadApiUrl(env));

      try {
        const open = (await import("open")).default;
        await open(authorizeUrl.toString());
        console.error(
          JSON.stringify(
            {
              status: "waiting",
              message: "Opening browser for login",
              url: authorizeUrl.toString(),
            },
            null,
            2,
          ),
        );
      } catch {
        console.error(
          JSON.stringify(
            {
              status: "waiting",
              message: "Open this URL in your browser to log in",
              url: authorizeUrl.toString(),
            },
            null,
            2,
          ),
        );
      }
    });

    // Timeout after 2 minutes
    timeout = setTimeout(() => {
      server.close();
      reject(new AuthError("Login timed out after 2 minutes"));
    }, 120_000);
  });
}
