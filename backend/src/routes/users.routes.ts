import { Hono } from "hono";
import { getDb } from "../db/client";
import { authMiddleware } from "../middleware/auth.middleware";
import { RenameSchema } from "../schemas/auth.schema";
import { renameUser, signToken, toPublicUser } from "../services/auth.service";
import { errorResponse, successResponse } from "../utils/helpers";
import type { AuthVariables, Env } from "../types";

export const usersRoutes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

usersRoutes.patch("/me", authMiddleware, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = RenameSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(errorResponse("Invalid username", parsed.error.issues), 400);
  }

  const payload = c.get("jwtPayload");
  const result = await renameUser(getDb(c.env.DB), payload.sub, parsed.data.username);
  if (!result.ok) return c.json(errorResponse(result.message), 409);

  // Re-issue the token so its embedded username stays accurate
  const publicUser = toPublicUser(result.user);
  const token = await signToken(publicUser, c.env.JWT_SECRET);
  return c.json(successResponse({ token, user: publicUser }));
});
