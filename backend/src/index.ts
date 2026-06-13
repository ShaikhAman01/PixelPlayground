import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRoutes } from "./routes/auth.routes";
import { gamesRoutes } from "./routes/games.routes";
import { roomsRoutes } from "./routes/rooms.routes";
import { leaderboardRoutes } from "./routes/leaderboard.routes";
import { wsRoutes } from "./routes/ws.routes";

import { createGuestSession } from "./controllers/auth.controller";
import { scoresRouter } from "./routes/scores.routes";
import type { Env } from "./types";

import { GameRoom } from "./durable-objects/GameRoom";

import {
  errorMiddleware,
} from "./middleware/error.middleware";

import {
  loggerMiddleware,
} from "./middleware/logger.middleware";

import {
  requestIdMiddleware,
} from "./middleware/request-id.middleware";


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

app.post("/api/auth/guest", createGuestSession);

app.route("/api/scores", scoresRouter);

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

app.route("/ws", wsRoutes);

export default app;
export { GameRoom };