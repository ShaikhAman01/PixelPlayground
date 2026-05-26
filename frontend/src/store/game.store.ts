import { create } from "zustand";

type Cell =
  | "X"
  | "O"
  | null;

interface GameState {
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
    | "WAITING"
    | "PLAYING"
    | "FINISHED";

  players: unknown[];

  setGameState: (
    state: Partial<GameState>
  ) => void;
}

export const useGameStore =
  create<GameState>(
    (set) => ({
      board: Array(9).fill(
        null
      ),

      currentTurn: "X",

      winner: null,

      status: "WAITING",

      players: [],

      setGameState: (
        state
      ) =>
        set((prev) => ({
          ...prev,
          ...state,
        })),
    })
  );