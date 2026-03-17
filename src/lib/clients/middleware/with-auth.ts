import type {
  FetchParams,
  Middleware,
  RequestContext,
} from "../../openapi/squad/index.js";

export function withAuth(token: string): Middleware {
  return {
    pre: async (ctx: RequestContext): Promise<undefined | FetchParams> => {
      if (!ctx.init.headers) ctx.init.headers = {};

      ctx.init.headers = {
        ...ctx.init.headers,
        authorization: `Bearer ${token}`,
      };
    },
  };
}
