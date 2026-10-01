import { create } from "zustand";
import { persist } from "zustand/middleware";

type GridType = number[][];

interface Game2048State {
  board: GridType;
  score: number;
  gameOver: boolean;
  bestScore: number;
  setState: (state: Partial<Game2048State>) => void;
  resetGame: () => void;
}

const emptyBoard = (): GridType => Array.from({ length: 4 }, () => Array(4).fill(0));

const generateInitialBoard = (): GridType => {
  const grid = Array.from({ length: 4 }, () => Array(4).fill(0));
  let spawned = 0;
  while (spawned < 2) {
    const r = Math.floor(Math.random() * 4);
    const c = Math.floor(Math.random() * 4);
    if (grid[r][c] === 0) {
      grid[r][c] = Math.random() > 0.1 ? 2 : 4;
      spawned++;
    }
  }
  return grid;
};

export const useGame2048Store = create<Game2048State>()(
  persist(
    (set) => ({
      // Tiles are placed on mount: random tiles here would differ between server and client.
      board: emptyBoard(),
      score: 0,
      gameOver: false,
      bestScore: 0,

      setState: (state) =>
        set((prev) => {
          const updated = { ...prev, ...state };
          if (updated.score > updated.bestScore) {
            updated.bestScore = updated.score;
          }
          return updated;
        }),

      resetGame: () =>
        set({
          board: generateInitialBoard(),
          score: 0,
          gameOver: false,
        }),
    }),
    {
      name: "pixel-playground-2048",
      // Only the personal best survives refreshes; the live board is per-session
      partialize: (state) => ({ bestScore: state.bestScore }),
    }
  )
);