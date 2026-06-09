"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./GameShell";
import { useGame2048Store } from "@/store/game2048.store";

type GridType = number[][];

export const Game2048 = () => {
  const { board, score, gameOver, setState, resetGame } = useGame2048Store();

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

  const slideRowLeft = (row: number[]) => {
    const filtered = row.filter((val) => val !== 0);
    const nextRow = Array(4).fill(0);
    let targetIdx = 0;
    let addedScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        nextRow[targetIdx] = filtered[i] * 2;
        addedScore += filtered[i] * 2;
        i++;
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

    let finalBoard = processingBoard;
    for (let i = 0; i < boardRotations; i++) finalBoard = rotateMatrix(finalBoard);

    if (altered) {
      const boardWithSpawn = spawnRandomTile(finalBoard);
      let isGameOver = false;

      const hasEmptyCells = boardWithSpawn.some(row => row.includes(0));
      if (!hasEmptyCells) {
        let movesPossible = false;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
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

  const getTileBg = (val: number) => {
    switch (val) {
      case 2: return "bg-orange-100 text-slate-800 dark:bg-orange-950/40 dark:text-orange-200 border-orange-200/40";
      case 4: return "bg-orange-200 text-slate-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300/40";
      case 8: return "bg-amber-400 text-white dark:bg-amber-600 shadow-sm border-transparent animate-pulse";
      case 16: return "bg-orange-500 text-white dark:bg-orange-700 border-transparent";
      case 32: return "bg-rose-500 text-white dark:bg-rose-600 border-transparent";
      case 64: return "bg-red-500 text-white dark:bg-red-700 border-transparent";
      case 128: return "bg-yellow-400 text-slate-900 dark:bg-yellow-500 font-extrabold border-transparent";
      case 256: return "bg-yellow-500 text-white font-extrabold border-transparent";
      case 512: return "bg-emerald-500 text-white font-extrabold border-transparent";
      case 1024: return "bg-blue-600 text-white font-extrabold border-transparent";
      case 2048: return "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white font-black border-transparent scale-105 ring-4 ring-fuchsia-400/20";
      default: return "bg-slate-900 text-white";
    }
  };

  return (
    <GameShell title="Game 2048" onRestart={resetGame}>
      <div className="relative rounded-3xl bg-slate-100/40 dark:bg-slate-950/20 p-3 shadow-inner size-[280px] sm:size-[320px] grid grid-cols-4 grid-rows-4 gap-2.5">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className="relative w-full h-full bg-slate-200/40 dark:bg-slate-900/40 rounded-xl">
              <AnimatePresence>
                {cell > 0 && (
                  <motion.div
                    key={`${rIdx}-${cIdx}-${cell}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 22 }}
                    className={`absolute inset-0 flex items-center justify-center font-black rounded-xl text-lg border shadow-sm select-none ${getTileBg(cell)}`}
                  >
                    {cell}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}

        <AnimatePresence>
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 z-20"
            >
              <div className="text-center">
                <p className="text-white text-xl font-black uppercase tracking-wider">Game Over</p>
                <p className="text-slate-400 text-xs mt-1">Final: {score} points</p>
              </div>
              <button 
                onClick={resetGame}
                className="rounded-xl bg-white text-slate-950 font-bold px-5 py-2 text-xs uppercase tracking-wide shadow-md hover:bg-slate-100 transition-all active:scale-95"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  );
};