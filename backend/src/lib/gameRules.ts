// Single source of truth for which games exist and how each one is
// ranked on the leaderboard. Must stay in sync with the frontend
// catalog in frontend/src/data/games.ts.
export const GAME_IDS = [
  "tictactoe",
  "connect4",
  "wordle",
  "colormemory",
  "slidepuzzle",
  "game2048",
] as const;

export type GameId = (typeof GAME_IDS)[number];

export type LeaderboardMetric =
  | { column: "bestScore"; direction: "desc" }
  | { column: "bestTimeSecs"; direction: "asc" }
  | { column: "bestStreak"; direction: "desc" }
  | { column: "wins"; direction: "desc" };

export const LEADERBOARD_METRICS: Record<GameId, LeaderboardMetric> = {
  game2048: { column: "bestScore", direction: "desc" },
  colormemory: { column: "bestScore", direction: "desc" },
  slidepuzzle: { column: "bestTimeSecs", direction: "asc" },
  wordle: { column: "bestStreak", direction: "desc" },
  tictactoe: { column: "wins", direction: "desc" },
  connect4: { column: "wins", direction: "desc" },
};
