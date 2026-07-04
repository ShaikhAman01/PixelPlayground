import type { Context } from "hono";
import { getDb } from "../db/client";
import {
  GuestSessionSchema,
  LoginSchema,
  SignupSchema,
} from "../schemas/auth.schema";
import * as authService from "../services/auth.service";
import { errorResponse, successResponse } from "../utils/helpers";
import type { AuthVariables, Env } from "../types";

type AuthContext = Context<{ Bindings: Env; Variables: AuthVariables }>;

const sessionResponse = async (c: AuthContext, user: Parameters<typeof authService.toPublicUser>[0]) => {
  const publicUser = authService.toPublicUser(user);
  const token = await authService.signToken(publicUser, c.env.JWT_SECRET);
  return c.json(successResponse({ token, user: publicUser }));
};

export const createGuestSession = async (c: AuthContext) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = GuestSessionSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(errorResponse("Invalid guest payload", parsed.error.issues), 400);
  }

  const user = await authService.createGuest(getDb(c.env.DB), parsed.data.username);
  return sessionResponse(c, user);
};

export const signup = async (c: AuthContext) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(errorResponse("Invalid signup payload", parsed.error.issues), 400);
  }

  const result = await authService.signup(
    getDb(c.env.DB),
    parsed.data.username,
    parsed.data.password
  );
  if (!result.ok) return c.json(errorResponse(result.message), 409);
  return sessionResponse(c, result.user);
};

export const login = async (c: AuthContext) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(errorResponse("Invalid login payload", parsed.error.issues), 400);
  }

  const result = await authService.login(
    getDb(c.env.DB),
    parsed.data.username,
    parsed.data.password
  );
  if (!result.ok) return c.json(errorResponse(result.message), 401);
  return sessionResponse(c, result.user);
};

/** Guest → registered account, keeping all scores and stats. */
export const upgrade = async (c: AuthContext) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(errorResponse("Invalid signup payload", parsed.error.issues), 400);
  }

  const payload = c.get("jwtPayload");
  const result = await authService.upgradeGuest(
    getDb(c.env.DB),
    payload.sub,
    parsed.data.username,
    parsed.data.password
  );
  if (!result.ok) return c.json(errorResponse(result.message), 409);
  return sessionResponse(c, result.user);
};

export const me = async (c: AuthContext) => {
  const payload = c.get("jwtPayload");
  const user = await authService.findById(getDb(c.env.DB), payload.sub);
  if (!user) return c.json(errorResponse("Account not found"), 404);
  return c.json(successResponse({ user: authService.toPublicUser(user) }));
};
