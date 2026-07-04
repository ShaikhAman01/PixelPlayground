import { z } from "zod";

const difficulty = z.enum(["EASY", "MEDIUM", "HARD"]);
const versusOutcome = z.enum(["win", "loss", "draw"]);

// Per-game payloads with plausibility bounds. These are sanity gates,
// not anti-cheat — the client is trusted the way any offline game is.
export const SubmitScoreSchema = z.discriminatedUnion("gameId", [
  z.object({
    gameId: z.literal("tictactoe"),
    outcome: versusOutcome,
    moves: z.number().int().min(3).max(9),
    difficulty,
  }),
  z.object({
    gameId: z.literal("connect4"),
    outcome: versusOutcome,
    moves: z.number().int().min(7).max(42).optional(),
    difficulty,
  }),
  z.object({
    gameId: z.literal("game2048"),
    outcome: z.literal("completed"),
    score: z.number().int().min(4).max(4_000_000),
  }),
  z.object({
    gameId: z.literal("wordle"),
    outcome: z.enum(["win", "loss"]),
    guesses: z.number().int().min(1).max(6),
    // Client-local calendar day, used for daily streak accounting
    day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  z.object({
    gameId: z.literal("colormemory"),
    outcome: z.literal("completed"),
    level: z.number().int().min(1).max(200),
  }),
  z.object({
    gameId: z.literal("slidepuzzle"),
    outcome: z.literal("win"),
    timeSecs: z.number().int().min(1).max(86_400),
    moves: z.number().int().min(1).max(10_000),
  }),
]);

export type SubmitScorePayload = z.infer<typeof SubmitScoreSchema>;
