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
      <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-white/10 dark:bg-slate-900/10 border border-white/20">
        <LayoutGroup>
          {board.map((tile, index) => {
            const isCorrectPosition = tile !== 0 && tile === solvedBoard[index];
            return (
              <motion.button
                key={tile}
                layout
                transition={{ type: "spring", stiffness: 230, damping: 23 }}
                whileTap={tile !== 0 ? { scale: 0.96 } : {}}
                onClick={() => moveTile(index)}
                className={`flex size-[clamp(4.2rem,20vw,5.8rem)] items-center justify-center rounded-2xl border text-xl font-black shadow-sm transition-colors duration-200 ${
                  tile === 0
                    ? "border-transparent bg-transparent shadow-none pointer-events-none"
                    : isCorrectPosition
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/10 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "border-slate-200/60 bg-white text-slate-700 dark:border-white/5 dark:bg-slate-900/90 dark:text-slate-200"
                }`}
              >
                {tile !== 0 && tile}
              </motion.button>
            );
          })}
        </LayoutGroup>
      </div>
    </GameShell>
  );
};