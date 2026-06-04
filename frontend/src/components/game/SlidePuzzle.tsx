"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
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

// Replace your old setup initialization effect with this clean trigger:
useEffect(() => {
  // Direct lazy checks avoid firing duplicate rendering updates to the screen threads
  const hasItems = useSlidePuzzleStore.getState().board.length > 0;
  if (!hasItems) {
    shuffleBoard();
  }
}, [shuffleBoard]);

  useEffect(() => {
    if (board.length === 0 || won) return;
    const isSolved = board.every((val, idx) => val === solvedBoard[idx]);
    
    if (isSolved) {
      // Isolate loop boundaries from the concurrent render stack thread
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
    <GameShell title="Slide Puzzle" timer={formattedTime} onRestart={shuffleBoard} info="Arrange tiles in numerical order.">
      <div className="flex flex-col items-center max-w-full px-2">
        <div className="pp-glass mb-6 rounded-full px-5 py-2 shadow-sm bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-white/10">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">
            Moves: {moves}
          </p>
        </div>

        <div className="pp-glass grid grid-cols-3 gap-3 md:gap-4 p-4 rounded-[28px]">
          {board.map((tile, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.96 }}
              onClick={() => moveTile(index)}
              className={`flex size-[clamp(4.5rem,22vw,6.5rem)] items-center justify-center rounded-2xl border text-2xl font-bold shadow-md transition-all duration-300 ${
                tile === 0
                  ? "border-transparent bg-transparent shadow-none pointer-events-none"
                  : "border-white/60 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-900/90 dark:text-slate-200"
              }`}
            >
              {tile !== 0 && tile}
            </motion.button>
          ))}
        </div>

        <div className="mt-8 min-h-[56px]">
          {won ? (
            <div className="pp-glass bg-green-100/80 rounded-full px-6 py-2">
              <p className="font-[family:var(--font-pixel)] text-xl text-violet-500 dark:text-violet-400">
                Puzzle Solved ✨
              </p>
            </div>
          ) : (
            <div className="pp-glass rounded-full px-5 py-2">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Arrange tiles in numerical order
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};