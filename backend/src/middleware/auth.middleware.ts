import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import type { AuthTokenPayload } from "../types";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await verify(token, c.env.JWT_SECRET, "HS256");
    c.set("jwtPayload", decoded as AuthTokenPayload);
    await next();
  } catch {
    return c.json({ success: false, message: "Invalid or expired session token" }, 401);
  }
};

/**
 * Like authMiddleware but lets unauthenticated requests through with no
 * jwtPayload set — used by the leaderboard to include "your rank" only
 * for signed-in callers.
 */
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const decoded = await verify(authHeader.split(" ")[1], c.env.JWT_SECRET, "HS256");
      c.set("jwtPayload", decoded as AuthTokenPayload);
    } catch {
      // Invalid token on an optional route: treat as anonymous
    }
  }
  await next();
};
