import { create } from "zustand";

interface WordleState {
  solution: string;

  guesses: string[];

  currentGuess: string;

  status:
    | "PLAYING"
    | "WON"
    | "LOST";

  setState: (
    state: Partial<WordleState>
  ) => void;
}

export const useWordleStore =
  create<WordleState>(
    (set) => ({
      solution: "",

      guesses: [],

      currentGuess: "",

      status:
        "PLAYING",

      setState: (
        state
      ) =>
        set((prev) => ({
          ...prev,
          ...state,
        })),
    })
  );