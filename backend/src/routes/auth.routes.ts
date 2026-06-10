import { Hono } from "hono";
import { login, signup, createGuestSession } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { successResponse } from "../utils/helpers";
import type { Env } from "../types";

export const authRoutes = new Hono<{ Bindings: Env }>();

// Frictionless entry for zero-onboarding session generation
authRoutes.post("/guest", createGuestSession);

// Credentials-based entry for persistent storage/streaks
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);

authRoutes.get("/me", authMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  return c.json(successResponse(payload));
});