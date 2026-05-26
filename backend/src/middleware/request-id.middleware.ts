import { Context, Next } from "hono";

export const requestIdMiddleware =
  async (
    c: Context,
    next: Next
  ) => {
    const requestId =
      crypto.randomUUID();

    c.set("requestId", requestId);

    c.header(
      "X-Request-ID",
      requestId
    );

    await next();
  };