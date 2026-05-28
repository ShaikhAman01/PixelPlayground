import { create } from "zustand";

interface SlidePuzzleState {
  board: number[];

  moves: number;

  won: boolean;

  setState: (
    state: Partial<SlidePuzzleState>
  ) => void;
}

export const useSlidePuzzleStore =
  create<SlidePuzzleState>(
    (set) => ({
      board: [],

      moves: 0,

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