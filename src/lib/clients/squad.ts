import type { Environment } from "../config.js";
import { getSquadApiUrl } from "../config.js";
import * as SquadApi from "../openapi/squad/index.js";
import { withAuth } from "./middleware/with-auth.js";

export function squadClient(
  token: string,
  env?: Environment,
): SquadApi.SquadApi {
  const basePath = getSquadApiUrl(env);

  return new SquadApi.SquadApi(
    new SquadApi.Configuration({
      basePath,
      middleware: [withAuth(token)],
    }),
  );
}
