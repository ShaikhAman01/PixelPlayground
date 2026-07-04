import { Hono } from "hono";
import {
  createGuestSession,
  login,
  me,
  signup,
  upgrade,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rateLimit.middleware";
import type { AuthVariables, Env } from "../types";

export const authRoutes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// Frictionless entry for zero-onboarding sessions
authRoutes.post("/guest", rateLimit(10), createGuestSession);

// Credential flows
authRoutes.post("/signup", rateLimit(10), signup);
authRoutes.post("/login", rateLimit(15), login);

// Guest → registered account (keeps stats)
authRoutes.post("/upgrade", authMiddleware, upgrade);

authRoutes.get("/me", authMiddleware, me);
