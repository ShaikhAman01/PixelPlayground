import { Hono } from "hono";

export const gamesRoutes = new Hono();

gamesRoutes.get("/", (c) => {
  return c.json({
    success: true,
    games: [],
  });
});