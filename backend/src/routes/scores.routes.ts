import { Hono } from "hono";
import { getDb } from "../db/client";
import { GAME_IDS, type GameId } from "../lib/gameRules";
import { authMiddleware } from "../middleware/auth.middleware";
import { rateLimit } from "../middleware/rateLimit.middleware";
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

// Drizzle wraps the D1 error, so the constraint text lives on .cause.
const isForeignKeyViolation = (error: unknown): boolean => {
  let current: unknown = error;
  for (let depth = 0; current && depth < 5; depth++) {
    if (String((current as Error).message ?? current).includes("FOREIGN KEY")) return true;
    current = (current as { cause?: unknown }).cause;
  }
  return false;
};

const utcDay = (offsetDays: number) =>
  new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);

scoresRoutes.post("/", rateLimit(30), async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = SubmitScoreSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(errorResponse("Invalid score payload", parsed.error.issues), 400);
  }

  // A client's local day is always within one day of UTC.
  if (parsed.data.gameId === "wordle" && ![utcDay(-1), utcDay(0), utcDay(1)].includes(parsed.data.day)) {
    return c.json(errorResponse("That puzzle day is not playable right now"), 400);
  }

  const payload = c.get("jwtPayload");
  try {
    const result = await submitScore(getDb(c.env.DB), payload.sub, parsed.data);
    return c.json(successResponse(result));
  } catch (error) {
    if (isForeignKeyViolation(error)) {
      return c.json(errorResponse("This session is no longer valid"), 401);
    }
    throw error;
  }
});

scoresRoutes.get("/me", async (c) => {
  const payload = c.get("jwtPayload");
  const gameIdRaw = c.req.query("gameId");
  if (gameIdRaw && !GAME_IDS.includes(gameIdRaw as GameId)) {
    return c.json(errorResponse("Unknown game"), 400);
  }
  const limit = Math.min(Math.max(Math.trunc(Number(c.req.query("limit"))) || 20, 1), 50);

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
