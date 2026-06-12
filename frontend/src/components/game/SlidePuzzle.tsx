"use client";

import { useEffect, useCallback } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { GameShell } from "./GameShell";
import { useSlidePuzzleStore } from "@/store/slidePuzzle.store";
import { useTimer } from "@/hooks/useTimer";

const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export const SlidePuzzle = () => {
  const { board, moves, won, setState } = useSlidePuzzleStore();
  const { formattedTime, reset, start, pause } = useTimer({ autoStart: true });

  const isSolvable = useCallback((arr: number[]) => {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  }, []);

  const shuffleBoard = useCallback(() => {
    let shuffled: number[] = [];
    do {
      shuffled = [...solvedBoard].sort(() => Math.random() - 0.5);
    } while (shuffled.every((v, i) => v === solvedBoard[i]) || !isSolvable(shuffled));

    setState({ board: shuffled, moves: 0, won: false });
    reset();
    start();
  }, [isSolvable, reset, start, setState]);

  useEffect(() => {
    const hasItems = useSlidePuzzleStore.getState().board.length > 0;
    if (!hasItems) shuffleBoard();
  }, [shuffleBoard]);

  useEffect(() => {
    if (board.length === 0 || won) return;
    const isSolved = board.every((val, idx) => val === solvedBoard[idx]);
    if (isSolved) {
      queueMicrotask(() => {
        pause();
        setState({ won: true });
      });
    }
  }, [board, won, pause, setState]);

  const moveTile = (index: number) => {
    if (won) return;

    const emptyIndex = board.indexOf(0);
    const sameRow = Math.floor(index / 3) === Math.floor(emptyIndex / 3);
    const sameCol = (index % 3) === (emptyIndex % 3);
    const isAdjacent = (sameRow && Math.abs(index - emptyIndex) === 1) || (sameCol && Math.abs(index - emptyIndex) === 3);

    if (!isAdjacent) return;

    const newBoard = [...board];
    [newBoard[emptyIndex], newBoard[index]] = [newBoard[index], newBoard[emptyIndex]];
    setState({ board: newBoard, moves: moves + 1 });
  };

  return (
    <GameShell title="Slide Puzzle" timer={formattedTime} onRestart={shuffleBoard}>
      <div className="flex flex-col items-center justify-center w-full max-w-md px-2 select-none pb-2">
        
        <div className="rounded-[28px] bg-white/90 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 p-4 shadow-sm backdrop-blur-md w-full">
          <div className="grid grid-cols-3 gap-3">
            <LayoutGroup>
              {board.map((tile, index) => {
                const isCorrectPosition = tile !== 0 && tile === solvedBoard[index];
                return (
                  <motion.button
                    key={tile}
                    layout
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                    whileHover={tile !== 0 && !won ? { scale: 1.02 } : {}}
                    whileTap={tile !== 0 && !won ? { scale: 0.98 } : {}}
                    onClick={() => moveTile(index)}
                    disabled={tile === 0 || won}
                    className={`flex w-full h-24 sm:h-28 items-center justify-center rounded-2xl border text-2xl font-black shadow-sm transition-colors duration-200 select-none ${
                      tile === 0
                        ? "border-transparent bg-transparent shadow-none pointer-events-none"
                        : isCorrectPosition
                          ? "bg-violet-100 border-violet-300 text-violet-700 dark:bg-violet-950/40 dark:border-violet-800 dark:text-violet-300 scale-[1.01] z-10 shadow-sm"
                          : "bg-zinc-50/60 border-zinc-200 text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900"
                    }`}
                  >
                    {tile !== 0 && tile}
                  </motion.button>
                );
              })}
            </LayoutGroup>
          </div>
        </div>

      </div>
    </GameShell>
  );
};