"use client";

import { useEffect, useState, useCallback } from "react";
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
    if (!hasItems) {
      shuffleBoard();
    }
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
    <GameShell title="Slide Puzzle" timer={formattedTime} onRestart={shuffleBoard} info="Arrange tiles in numerical order.">
      <div className="flex flex-col items-center max-w-full px-2">
        
        {/* COUNTER STATUS BADGE */}
        <div className="mb-6 rounded-full px-5 py-1.5 shadow-sm bg-white/70 dark:bg-slate-900/60 border border-white/60 dark:border-white/10">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Total Moves: <span className="text-violet-500 font-extrabold">{moves}</span>
          </p>
        </div>

        {/* RE-ARCHITECTED BOARD LAYOUT WRAPPER */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 rounded-[32px] border border-white/60 bg-white/30 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/30">
          {/* LayoutGroup captures internal shifts across indices seamlessly */}
          <LayoutGroup>
            {board.map((tile, index) => {
              const isCorrectPosition = tile !== 0 && tile === solvedBoard[index];
              
              return (
                <motion.button
                  key={tile} // Crucial! Using tile value as key allows layout morph tracking
                  layout
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  whileTap={tile !== 0 ? { scale: 0.95 } : {}}
                  onClick={() => moveTile(index)}
                  className={`flex size-[clamp(4.5rem,22vw,6.2rem)] items-center justify-center rounded-2xl border text-2xl font-black shadow-sm transition-colors duration-200 ${
                    tile === 0
                      ? "border-transparent bg-transparent shadow-none pointer-events-none"
                      : isCorrectPosition
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/10 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "border-slate-200/60 bg-white text-slate-700 dark:border-white/5 dark:bg-slate-900/90 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-500/30"
                  }`}
                >
                  {tile !== 0 && tile}
                </motion.button>
              );
            })}
          </LayoutGroup>
        </div>

        {/* BANNER REACTION NOTIFIER */}
        <div className="mt-8 min-h-[56px]">
          {won ? (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-8 py-2.5 shadow-md animate-in fade-in zoom-in-95 duration-300">
              <p className="text-sm font-bold uppercase tracking-widest">
                Puzzle Solved Successfully! ✨
              </p>
            </div>
          ) : (
            <div className="rounded-full bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-white/5 px-5 py-2 shadow-inner">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Shift matching numeric neighbors
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};