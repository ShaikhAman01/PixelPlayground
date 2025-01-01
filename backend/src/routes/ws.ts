import { Hono } from "hono";
import { serveStatic } from "hono/serve-static.module";

export const wsRouter = new Hono();

wsRouter.get("/", async (c) => {
  if (c.req.headers.get("upgrade") !== "websocket") {
    return c.text("Expected a WebSocket request", 426);
  }

  const [client, server] = Object.values(new WebSocketPair());

  server.accept();

  server.addEventListener("message", (event) => {
    console.log("Message received from client:", event.data);
    server.send(`Server says: ${event.data}`);
  });

  server.addEventListener("close", () => {
    console.log("WebSocket connection closed");
  });

  return c.json(client);
});
