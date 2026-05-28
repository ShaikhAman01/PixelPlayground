import { create } from "zustand";

export type Cell =
  | "X"
  | "O"
  | null;

export interface Player {
  id: string;

  username: string;

  symbol: "X" | "O";
}

export interface MoveHistory {
  player: string;

  position: number;

  timestamp: number;
}

interface GameState {
  // BOARD
  board: Cell[];

  // TURN
  currentTurn:
    | "X"
    | "O";

  // WINNER
  winner:
    | "X"
    | "O"
    | "DRAW"
    | null;

  // STATUS
  status:
    | "WAITING"
    | "PLAYING"
    | "FINISHED";

  // PLAYERS
  players: Player[];

  // HISTORY
  moveHistory: MoveHistory[];

  // ACTIONS
  setGameState: (
    state: Partial<GameState>
  ) => void;
}

export const useGameStore =
  create<GameState>(
    (set) => ({
      // INITIAL BOARD
      board:
        Array(9).fill(
          null
        ),

      // INITIAL TURN
      currentTurn: "X",

      // WINNER
      winner: null,

      // STATUS
      status: "WAITING",

      // PLAYERS
      players: [],

      // MOVE HISTORY
      moveHistory: [],

      // UPDATE STATE
      setGameState: (
        state
      ) =>
        set((prev) => ({
          ...prev,

          ...state,
        })),
    })
  );