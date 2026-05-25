import { Hono } from "hono";

export const roomsRoutes = new Hono();

roomsRoutes.get("/", (c) => {
  return c.json({
    success: true,
    rooms: [],
  });
});