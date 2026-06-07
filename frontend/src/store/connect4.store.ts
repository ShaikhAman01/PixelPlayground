import { create } from "zustand";
import { Cell } from "@/games/connect4.engine";

interface Connect4State {
  board: Cell[][];

  currentTurn: "X" | "O";

  winner: "X" | "O" | "DRAW" | null;

  status: "PLAYING" | "FINISHED";

  playerScore: number;

  cpuScore: number;

  round: number;

  matchWinner: "PLAYER" | "CPU" | null;

  // DIFFICULTY SETTING
  difficulty: "EASY" | "MEDIUM" | "HARD";

  setState: (state: Partial<Connect4State>) => void;
}

export const useConnect4Store = create<Connect4State>((set) => ({
  board: Array.from({ length: 6 }).map(() => Array(7).fill(null)),

  currentTurn: "X",

  winner: null,

  status: "PLAYING",

  playerScore: 0,

  cpuScore: 0,

  round: 1,

  matchWinner: null,

  // DEFAULT SETTING
  difficulty: "MEDIUM",

  setState: (state) =>
    set((prev) => ({
      ...prev,
      ...state,
    })),
}));