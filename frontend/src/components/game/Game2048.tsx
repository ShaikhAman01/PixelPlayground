"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./GameShell";
import { useGame2048Store } from "@/store/game2048.store";

type GridType = number[][];

export const Game2048 = () => {
  const { board, score, gameOver, bestScore, setState, resetGame } = useGame2048Store();

  const spawnRandomTile = useCallback((currentBoard: GridType): GridType => {
    const emptyCells: { r: number; c: number }[] = [];
    currentBoard.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push({ r, c });
      });
    });

    if (emptyCells.length === 0) return currentBoard;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const nextBoard = structuredClone(currentBoard);
    nextBoard[r][c] = Math.random() > 0.1 ? 2 : 4;
    return nextBoard;
  }, []);

  // Slide and compress a single row row to the left
  const slideRowLeft = (row: number[]) => {
    const filtered = row.filter((val) => val !== 0);
    const nextRow = Array(4).fill(0);
    let targetIdx = 0;
    let addedScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        nextRow[targetIdx] = filtered[i] * 2;
        addedScore += filtered[i] * 2;
        i++; // Skip the paired element
      } else {
        nextRow[targetIdx] = filtered[i];
      }
      targetIdx++;
    }
    return { nextRow, addedScore };
  };

  const executeMove = useCallback((direction: "LEFT" | "RIGHT" | "UP" | "DOWN") => {
    if (gameOver) return;

    let currentBoard = structuredClone(board);
    let scoreGain = 0;
    let boardRotations = 0;

    const rotateMatrix = (matrix: GridType) => {
      return matrix[0].map((_, idx) => matrix.map((row) => row[idx]).reverse());
    };

    // Rotate board to treat all slide variants as a standard left-slide
    if (direction === "UP") { currentBoard = rotateMatrix(rotateMatrix(rotateMatrix(currentBoard))); boardRotations = 1; }
    if (direction === "RIGHT") { currentBoard = rotateMatrix(rotateMatrix(currentBoard)); boardRotations = 2; }
    if (direction === "DOWN") { currentBoard = rotateMatrix(currentBoard); boardRotations = 3; }

    let altered = false;
    const processingBoard = currentBoard.map((row) => {
      const { nextRow, addedScore } = slideRowLeft(row);
      scoreGain += addedScore;
      if (JSON.stringify(nextRow) !== JSON.stringify(row)) altered = true;
      return nextRow;
    });

    // Revert back to original orientation
    let finalBoard = processingBoard;
    for (let i = 0; i < boardRotations; i++) {
      finalBoard = rotateMatrix(finalBoard);
    }

    if (altered) {
      const boardWithSpawn = spawnRandomTile(finalBoard);
      let isGameOver = false;

      // Check if board is fully jammed
      const hasEmptyCells = boardWithSpawn.some(row => row.includes(0));
      if (!hasEmptyCells) {
        let movesPossible = false;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) { // ✅ FIXED: Correctly increments "c" now!
            if (r < 3 && boardWithSpawn[r][c] === boardWithSpawn[r + 1][c]) movesPossible = true;
            if (c < 3 && boardWithSpawn[r][c] === boardWithSpawn[r][c + 1]) movesPossible = true;
          }
        }
        if (!movesPossible) isGameOver = true;
      }

      setState({
        board: boardWithSpawn,
        score: score + scoreGain,
        gameOver: isGameOver
      });
    }
  }, [board, gameOver, score, spawnRandomTile, setState]);

  useEffect(() => {
    const handleSwipeInput = (e: KeyboardEvent) => {
      if (["ArrowLeft", "KeyA"].includes(e.code)) executeMove("LEFT");
      if (["ArrowRight", "KeyD"].includes(e.code)) executeMove("RIGHT");
      if (["ArrowUp", "KeyW"].includes(e.code)) executeMove("UP");
      if (["ArrowDown", "KeyS"].includes(e.code)) executeMove("DOWN");
    };
    window.addEventListener("keydown", handleSwipeInput);
    return () => window.removeEventListener("keydown", handleSwipeInput);
  }, [executeMove]);

  // Dynamic aesthetic class generator
  const getTileBg = (val: number) => {
    switch (val) {
      case 2: return "bg-orange-100 text-slate-800 dark:bg-orange-950/40 dark:text-orange-200 border-orange-200/40";
      case 4: return "bg-orange-200 text-slate-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300/40";
      case 8: return "bg-amber-400 text-white dark:bg-amber-600 shadow-md border-transparent animate-pulse";
      case 16: return "bg-orange-500 text-white dark:bg-orange-700 shadow-md border-transparent";
      case 32: return "bg-rose-500 text-white dark:bg-rose-600 shadow-md border-transparent";
      case 64: return "bg-red-500 text-white dark:bg-red-700 shadow-md border-transparent";
      case 128: return "bg-yellow-400 text-slate-900 dark:bg-yellow-500 font-extrabold shadow-lg border-transparent";
      case 256: return "bg-yellow-500 text-white font-extrabold shadow-xl border-transparent";
      case 512: return "bg-emerald-500 text-white font-extrabold shadow-xl border-transparent";
      case 1024: return "bg-blue-600 text-white font-extrabold shadow-2xl border-transparent";
      case 2048: return "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-black shadow-2xl border-transparent scale-105 ring-4 ring-fuchsia-400/40";
      default: return "bg-slate-900 text-white";
    }
  };

  return (
    <GameShell title="Game 2048" onRestart={resetGame} info="Slide tiles using arrow keys or WASD to merge matching pairs and reach 2048.">
      <div className="flex flex-col items-center max-w-full px-4">
        
        {/* SCORE PANELS */}
        <div className="mb-6 flex gap-4 w-full justify-center max-w-[320px]">
          <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-center flex-1 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score</p>
            <p className="text-xl font-bold text-violet-500 dark:text-violet-400">{score}</p>
          </div>
          <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-center flex-1 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Best</p>
            <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{bestScore}</p>
          </div>
        </div>

        {/* GAME ARENA DECK */}
        <div className="relative rounded-[32px] border border-slate-200/60 bg-slate-100/50 p-4 dark:border-white/5 dark:bg-slate-950/30 shadow-inner size-[290px] sm:size-[340px] grid grid-cols-4 grid-rows-4 gap-3">
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} className="relative w-full h-full bg-slate-200/40 dark:bg-slate-900/40 rounded-xl border border-slate-300/10">
                <AnimatePresence>
                  {cell > 0 && (
                    <motion.div
                      key={`${rIdx}-${cIdx}-${cell}`}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 240, damping: 20 }}
                      className={`absolute inset-0 flex items-center justify-center font-black rounded-xl text-xl border shadow-sm select-none ${getTileBg(cell)}`}
                    >
                      {cell}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}

          {/* GAME OVER SCREEN OVERLAY */}
          <AnimatePresence>
            {gameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center gap-4 z-20"
              >
                <div className="text-center animate-bounce">
                  <p className="text-white text-2xl font-black uppercase tracking-wider">No Moves Left!</p>
                  <p className="text-slate-400 text-xs">Final Score: {score}</p>
                </div>
                <button 
                  onClick={resetGame}
                  className="rounded-full bg-white text-slate-950 font-bold px-6 py-2 text-xs uppercase tracking-wide shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM HELPER CAPTION */}
        <div className="mt-6 rounded-full border border-white/60 bg-white/70 px-5 py-2 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {gameOver ? "🕹️ Simulation Finished" : "🎮 Keyboard Input Enabled"}
          </p>
        </div>

      </div>
    </GameShell>
  );
};