import { Hono } from "hono";
import { getDb } from "../db/client";
import { GAME_IDS, LEADERBOARD_METRICS, type GameId } from "../lib/gameRules";
import { optionalAuthMiddleware } from "../middleware/auth.middleware";
import { getLeaderboard } from "../services/score.service";
import { errorResponse, successResponse } from "../utils/helpers";
import type { AuthVariables, Env } from "../types";

export const leaderboardRoutes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

leaderboardRoutes.get("/:gameId", optionalAuthMiddleware, async (c) => {
  const gameId = c.req.param("gameId") as GameId;
  if (!GAME_IDS.includes(gameId)) {
    return c.json(errorResponse("Unknown game"), 400);
  }

  const limit = Math.min(Number(c.req.query("limit")) || 10, 50);
  const userId = c.get("jwtPayload")?.sub;

  const { entries, me } = await getLeaderboard(getDb(c.env.DB), gameId, limit, userId);
  return c.json(
    successResponse({ entries, me, metric: LEADERBOARD_METRICS[gameId] })
  );
});
