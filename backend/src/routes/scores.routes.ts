import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware";
import { GameService } from "../services/game.service";
import type { Env } from "../types";

// Explicitly type context parameters to pass layout audits
const scoresRouter = new Hono<{
  Bindings: Env;
  Variables: {
    jwtPayload: { username: string; sub: string };
  };
}>();

scoresRouter.post("/submit", authMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const body = await c.req.json().catch(() => ({}));

  const isValid = GameService.verifySessionAuthenticity({
    movesCount: body.movesCount,
    gameType: body.gameType,
    boardSnapshot: body.boardSnapshot
  });

  if (!isValid) {
    return c.json({ error: "Malicious payload transaction detected" }, 400);
  }

  return c.json({ success: true, message: `Score registered for ${payload.username}` });
});

export { scoresRouter };