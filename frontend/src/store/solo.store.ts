import { create } from "zustand";

import { Cell } from "@/games/tictactoe.engine";

interface SoloState {
  board: Cell[];

  currentTurn:
    | "X"
    | "O";

  winner:
    | "X"
    | "O"
    | "DRAW"
    | null;

  status:
    | "PLAYING"
    | "FINISHED";

  playerScore: number;

  cpuScore: number;

  round: number;

  setState: (
    state: Partial<SoloState>
  ) => void;

  resetScores: () => void;
}

export const useSoloStore =
  create<SoloState>(
    (set) => ({
      board:
        Array(9).fill(
          null
        ),

      currentTurn: "X",

      winner: null,

      status: "PLAYING",

      playerScore: 0,

      cpuScore: 0,

      round: 1,

      setState: (
        state
      ) =>
        set((prev) => ({
          ...prev,
          ...state,
        })),

      resetScores: () =>
        set({
          playerScore: 0,

          cpuScore: 0,

          round: 1,
        }),
    })
  );