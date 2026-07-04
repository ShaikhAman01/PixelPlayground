import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRoutes } from "./routes/auth.routes";
import { leaderboardRoutes } from "./routes/leaderboard.routes";
import { scoresRoutes, statsRoutes } from "./routes/scores.routes";
import { usersRoutes } from "./routes/users.routes";
import type { AuthVariables, Env } from "./types";

import { errorMiddleware } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

app.use("*", async (c, next) => {
  const handler = cors({
    origin: c.env.ALLOWED_ORIGIN ?? "http://localhost:3000",
    allowHeaders: ["Content-Type", "Authorization"],
  });
  return handler(c, next);
});

app.use("*", errorMiddleware);

app.use("*", loggerMiddleware);

app.use("*", requestIdMiddleware);

app.get("/", (c) => {
  return c.json({
    success: true,
    message: "PixelPlayground API running",
  });
});

app.route("/api/v1/auth", authRoutes);

app.route("/api/v1/users", usersRoutes);

app.route("/api/v1/scores", scoresRoutes);

app.route("/api/v1/stats", statsRoutes);

app.route("/api/v1/leaderboard", leaderboardRoutes);

export default app;
