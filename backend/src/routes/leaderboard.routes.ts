import { Hono } from "hono";

export const leaderboardRoutes = new Hono();

leaderboardRoutes.get("/", (c) => {
  return c.json({
    success: true,
    leaderboard: [],
  });
});