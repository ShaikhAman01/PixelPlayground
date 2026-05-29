import { create } from "zustand";

interface SudokuState {
  board: number[][];

  initialBoard: number[][];

  won: boolean;

  setState: (
    state: Partial<SudokuState>
  ) => void;
}

export const useSudokuStore =
  create<SudokuState>(
    (set) => ({
      board: [],

      initialBoard: [],

      won: false,

      setState: (
        state
      ) =>
        set((prev) => ({
          ...prev,
          ...state,
        })),
    })
  );