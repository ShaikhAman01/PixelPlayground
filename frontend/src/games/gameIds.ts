// Server-safe list of playable game slugs (no component imports).
export const GAME_IDS = [
  "tictactoe",
  "connect4",
  "wordle",
  "colormemory",
  "slidepuzzle",
  "game2048",
] as const;

export type GameId = (typeof GAME_IDS)[number];

export const isGameId = (value: string): value is GameId =>
  (GAME_IDS as readonly string[]).includes(value);
