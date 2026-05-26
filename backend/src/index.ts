import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRoutes } from "./routes/auth.routes";
import { gamesRoutes } from "./routes/games.routes";
import { roomsRoutes } from "./routes/rooms.routes";
import { leaderboardRoutes } from "./routes/leaderboard.routes";

import {
  errorMiddleware,
} from "./middleware/error.middleware";

import {
  loggerMiddleware,
} from "./middleware/logger.middleware";

import {
  requestIdMiddleware,
} from "./middleware/request-id.middleware";

import type { Env } from "./types";

const app =
  new Hono<{
    Bindings: Env;
  }>();


app.use("*", cors());

app.use("*", errorMiddleware);

app.use("*", loggerMiddleware);

app.use("*", requestIdMiddleware);


app.get("/", (c) => {
  return c.json({
    success: true,
    message:
      "PixelPlayground API running",
  });
});


app.route(
  "/api/v1/auth",
  authRoutes
);

app.route(
  "/api/v1/games",
  gamesRoutes
);

app.route(
  "/api/v1/rooms",
  roomsRoutes
);

app.route(
  "/api/v1/leaderboard",
  leaderboardRoutes
);


export default app;