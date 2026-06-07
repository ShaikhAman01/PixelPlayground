import { create } from "zustand";
import { Cell } from "@/games/tictactoe.engine";

interface SoloState {
  // BOARD
  board: Cell[];

  // TURN
  currentTurn: "X" | "O";

  // ROUND WINNER
  winner: "X" | "O" | "DRAW" | null;

  // MATCH WINNER
  matchWinner: "PLAYER" | "CPU" | null;

  // GAME STATUS
  status: "PLAYING" | "FINISHED";

  // SCORES
  playerScore: number;
  cpuScore: number;

  // ROUND
  round: number;

  // DIFFICULTY SETTINGS
  difficulty: "EASY" | "MEDIUM" | "HARD";

  // ACTIONS
  setState: (state: Partial<SoloState>) => void;
  resetScores: () => void;
}

export const useSoloStore = create<SoloState>((set) => ({
  // BOARD
  board: Array(9).fill(null),

  // TURN
  currentTurn: "X",

  // ROUND WINNER
  winner: null,

  // MATCH WINNER
  matchWinner: null,

  // STATUS
  status: "PLAYING",

  // SCORES
  playerScore: 0,
  cpuScore: 0,

  // ROUND
  round: 1,

  // DIFFICULTY DEFAULT
  difficulty: "MEDIUM",

  // UPDATE STATE
  setState: (state) =>
    set((prev) => ({
      ...prev,
      ...state,
    })),

  // RESET MATCH
  resetScores: () =>
    set({
      playerScore: 0,
      cpuScore: 0,
      round: 1,
      matchWinner: null,
    }),
}));