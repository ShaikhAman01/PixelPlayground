import { create } from "zustand";

type GridType = number[][];

interface Game2048State {
  board: GridType;
  score: number;
  gameOver: boolean;
  bestScore: number;
  setState: (state: Partial<Game2048State>) => void;
  resetGame: () => void;
}

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

export const useGame2048Store = create<Game2048State>((set) => ({
  board: generateInitialBoard(),
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
    set((prev) => ({
      board: generateInitialBoard(),
      score: 0,
      gameOver: false,
    })),
}));