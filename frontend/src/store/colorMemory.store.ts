import { create } from "zustand";

interface ColorMemoryState {
  sequence: number[];

  playerSequence: number[];

  level: number;

  status:
    | "WATCHING"
    | "PLAYING"
    | "FAILED";

  activeTile:
    | number
    | null;

  setState: (
    state: Partial<ColorMemoryState>
  ) => void;
}

export const useColorMemoryStore =
  create<ColorMemoryState>(
    (set) => ({
      sequence: [],

      playerSequence: [],

      level: 1,

      status:
        "WATCHING",

      activeTile:
        null,

      setState: (
        state
      ) =>
        set((prev) => ({
          ...prev,
          ...state,
        })),
    })
  );