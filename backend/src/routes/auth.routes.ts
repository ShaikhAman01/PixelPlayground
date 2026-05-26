import { Hono } from "hono";

import {
  login,
  signup,
} from "../controllers/auth.controller";

import { createAuthMiddleware } from "../middleware/auth.middleware";

import {
  successResponse,
} from "../utils/helpers";

import type { Env } from "../types";

export const authRoutes =
  new Hono<{ Bindings: Env }>();


authRoutes.post(
  "/signup",
  signup
);

authRoutes.post(
  "/login",
  login
);


authRoutes.get(
  "/me",
  async (c, next) => {
    const middleware =
      createAuthMiddleware(
        c.env.JWT_SECRET
      );

    return middleware(c, next);
  },

  async (c) => {
    const payload =
      c.get("jwtPayload");

    return c.json(
      successResponse(payload)
    );
  }
);