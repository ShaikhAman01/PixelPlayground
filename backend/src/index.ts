import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRoutes } from "./routes/auth.routes";
import type { Env } from "./types";

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

app.route(
  "/api/v1/auth",
  authRoutes
);

export default app;
