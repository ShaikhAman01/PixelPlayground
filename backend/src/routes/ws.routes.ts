import { Hono } from "hono";

import type { Env } from "../types";

export const wsRoutes = new Hono<{
  Bindings: Env;
}>();


wsRoutes.get(
  "/:roomId",

  async (c) => {
    try {
      const roomId =
        c.req.param("roomId");

      console.log(
        `[WS_ROUTE] Connecting to room: ${roomId}`
      );

      // Create/get Durable Object instance
      const id =
        c.env.GAME_ROOM.idFromName(
          roomId
        );

      const stub =
        c.env.GAME_ROOM.get(id);

      // Forward websocket request
      return await stub.fetch(
        c.req.raw
      );
    } catch (error) {
      console.error(
        "[WS_ROUTE_ERROR]",
        error
      );

      return c.json(
        {
          success: false,
          message:
            "Websocket connection failed",
        },
        500
      );
    }
  }
);