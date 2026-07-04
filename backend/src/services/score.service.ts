import { and, desc, eq, gt, isNotNull, lt, asc, sql } from "drizzle-orm";
import type { Database } from "../db/client";
import { gameStats, scores, users, type GameStatsRow } from "../db/schema";
import { LEADERBOARD_METRICS, type GameId } from "../lib/gameRules";
import type { SubmitScorePayload } from "../schemas/score.schema";

const METRIC_COLUMNS = {
  bestScore: gameStats.bestScore,
  bestTimeSecs: gameStats.bestTimeSecs,
  bestStreak: gameStats.bestStreak,
  wins: gameStats.wins,
} as const;

const emptyStats = (userId: string, gameId: string): GameStatsRow => ({
  userId,
  gameId,
  plays: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  bestScore: null,
  bestTimeSecs: null,
  bestMoves: null,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDay: null,
  updatedAt: 0,
});

const previousDay = (day: string) => {
  const ms = Date.parse(`${day}T00:00:00Z`) - 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
};

export interface SubmitResult {
  stats: GameStatsRow;
  newBest: boolean;
}

export const submitScore = async (
  db: Database,
  userId: string,
  payload: SubmitScorePayload
): Promise<SubmitResult> => {
  const now = Date.now();

  const existingRows = await db
    .select()
    .from(gameStats)
    .where(and(eq(gameStats.userId, userId), eq(gameStats.gameId, payload.gameId)))
    .limit(1);

  const prev = existingRows[0] ?? emptyStats(userId, payload.gameId);
  const next: GameStatsRow = { ...prev, plays: prev.plays + 1, updatedAt: now };

  let newBest = false;
  let scoreValue = 0;
  let timeSecs: number | null = null;
  let moves: number | null = null;
  let difficulty: string | null = null;

  switch (payload.gameId) {
    case "tictactoe":
    case "connect4": {
      difficulty = payload.difficulty;
      moves = payload.moves ?? null;
      if (payload.outcome === "win") next.wins++;
      else if (payload.outcome === "loss") next.losses++;
      else next.draws++;
      break;
    }
    case "game2048": {
      scoreValue = payload.score;
      if (payload.score > (prev.bestScore ?? 0)) {
        next.bestScore = payload.score;
        newBest = true;
      }
      break;
    }
    case "colormemory": {
      scoreValue = payload.level;
      if (payload.level > (prev.bestScore ?? 0)) {
        next.bestScore = payload.level;
        newBest = true;
      }
      break;
    }
    case "slidepuzzle": {
      scoreValue = payload.timeSecs;
      timeSecs = payload.timeSecs;
      moves = payload.moves;
      next.wins++;
      if (prev.bestTimeSecs === null || payload.timeSecs < prev.bestTimeSecs) {
        next.bestTimeSecs = payload.timeSecs;
        newBest = true;
      }
      if (prev.bestMoves === null || payload.moves < prev.bestMoves) {
        next.bestMoves = payload.moves;
      }
      break;
    }
    case "wordle": {
      scoreValue = payload.guesses;

      if (prev.lastPlayedDay === payload.day) {
        // Already recorded today's puzzle: keep history but leave
        // plays/streak untouched so refresh-resubmits can't farm streaks.
        next.plays = prev.plays;
        break;
      }

      next.lastPlayedDay = payload.day;
      if (payload.outcome === "win") {
        next.wins++;
        next.currentStreak =
          prev.lastPlayedDay === previousDay(payload.day) ? prev.currentStreak + 1 : 1;
        if (next.currentStreak > prev.bestStreak) {
          next.bestStreak = next.currentStreak;
          newBest = true;
        }
      } else {
        next.losses++;
        next.currentStreak = 0;
      }
      break;
    }
  }

  await db.insert(scores).values({
    userId,
    gameId: payload.gameId,
    outcome: payload.outcome,
    score: scoreValue,
    timeSecs,
    moves,
    difficulty,
    createdAt: now,
  });

  await db
    .insert(gameStats)
    .values(next)
    .onConflictDoUpdate({
      target: [gameStats.userId, gameStats.gameId],
      set: {
        plays: next.plays,
        wins: next.wins,
        losses: next.losses,
        draws: next.draws,
        bestScore: next.bestScore,
        bestTimeSecs: next.bestTimeSecs,
        bestMoves: next.bestMoves,
        currentStreak: next.currentStreak,
        bestStreak: next.bestStreak,
        lastPlayedDay: next.lastPlayedDay,
        updatedAt: next.updatedAt,
      },
    });

  return { stats: next, newBest };
};

export const getStatsForUser = async (db: Database, userId: string) =>
  db.select().from(gameStats).where(eq(gameStats.userId, userId));

export const getRecentScores = async (
  db: Database,
  userId: string,
  gameId: GameId | undefined,
  limit: number
) =>
  db
    .select()
    .from(scores)
    .where(
      gameId
        ? and(eq(scores.userId, userId), eq(scores.gameId, gameId))
        : eq(scores.userId, userId)
    )
    .orderBy(desc(scores.createdAt))
    .limit(limit);

export interface LeaderboardEntry {
  username: string;
  isGuest: boolean;
  value: number;
  rank: number;
}

export const getLeaderboard = async (
  db: Database,
  gameId: GameId,
  limit: number,
  userId?: string
): Promise<{ entries: LeaderboardEntry[]; me: LeaderboardEntry | null }> => {
  const metric = LEADERBOARD_METRICS[gameId];
  const column = METRIC_COLUMNS[metric.column];

  // Zero wins / null bests are "hasn't set a score yet", not rank material
  const qualifies =
    metric.column === "wins" || metric.column === "bestStreak"
      ? gt(column, 0)
      : isNotNull(column);

  const order = metric.direction === "asc" ? asc(column) : desc(column);

  const rows = await db
    .select({
      username: users.username,
      isGuest: users.isGuest,
      value: column,
      userId: gameStats.userId,
    })
    .from(gameStats)
    .innerJoin(users, eq(users.id, gameStats.userId))
    .where(and(eq(gameStats.gameId, gameId), qualifies))
    .orderBy(order, asc(gameStats.updatedAt))
    .limit(limit);

  const entries = rows.map((row, i) => ({
    username: row.username,
    isGuest: row.isGuest,
    value: row.value ?? 0,
    rank: i + 1,
  }));

  let me: LeaderboardEntry | null = null;
  if (userId) {
    const inTop = rows.findIndex((r) => r.userId === userId);
    if (inTop >= 0) {
      me = entries[inTop];
    } else {
      const mine = await db
        .select({ username: users.username, isGuest: users.isGuest, value: column })
        .from(gameStats)
        .innerJoin(users, eq(users.id, gameStats.userId))
        .where(and(eq(gameStats.gameId, gameId), eq(gameStats.userId, userId), qualifies))
        .limit(1);

      if (mine[0]) {
        const myValue = mine[0].value ?? 0;
        const better =
          metric.direction === "asc" ? lt(column, myValue) : gt(column, myValue);
        const ahead = await db
          .select({ count: sql<number>`count(*)` })
          .from(gameStats)
          .where(and(eq(gameStats.gameId, gameId), qualifies, better));

        me = {
          username: mine[0].username,
          isGuest: mine[0].isGuest,
          value: myValue,
          rank: (ahead[0]?.count ?? 0) + 1,
        };
      }
    }
  }

  return { entries, me };
};
