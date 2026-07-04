import { Hono } from "hono";
import { getDb } from "../db/client";
import { GAME_IDS, type GameId } from "../lib/gameRules";
import { authMiddleware } from "../middleware/auth.middleware";
import { SubmitScoreSchema } from "../schemas/score.schema";
import {
  getRecentScores,
  getStatsForUser,
  submitScore,
} from "../services/score.service";
import { errorResponse, successResponse } from "../utils/helpers";
import type { AuthVariables, Env } from "../types";

export const scoresRoutes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

scoresRoutes.use("*", authMiddleware);

scoresRoutes.post("/", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = SubmitScoreSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(errorResponse("Invalid score payload", parsed.error.issues), 400);
  }

  const payload = c.get("jwtPayload");
  const result = await submitScore(getDb(c.env.DB), payload.sub, parsed.data);
  return c.json(successResponse(result));
});

scoresRoutes.get("/me", async (c) => {
  const payload = c.get("jwtPayload");
  const gameIdRaw = c.req.query("gameId");
  if (gameIdRaw && !GAME_IDS.includes(gameIdRaw as GameId)) {
    return c.json(errorResponse("Unknown game"), 400);
  }
  const limit = Math.min(Number(c.req.query("limit")) || 20, 50);

  const history = await getRecentScores(
    getDb(c.env.DB),
    payload.sub,
    gameIdRaw as GameId | undefined,
    limit
  );
  return c.json(successResponse({ history }));
});

export const statsRoutes = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

statsRoutes.get("/me", authMiddleware, async (c) => {
  const payload = c.get("jwtPayload");
  const stats = await getStatsForUser(getDb(c.env.DB), payload.sub);
  return c.json(successResponse({ stats }));
});
