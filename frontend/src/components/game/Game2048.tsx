"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
      case 2: return "bg-orange-50/90 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700";
      case 4: return "bg-orange-100 text-zinc-800 dark:bg-zinc-700/80 dark:text-zinc-100 border-zinc-200/60 dark:border-zinc-600";
      case 8: return "bg-amber-100 text-amber-900 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/40 font-bold";
      case 16: return "bg-amber-200 text-amber-950 border-transparent dark:bg-amber-900/60 dark:text-amber-100 font-bold shadow-sm";
      case 32: return "bg-orange-200 text-orange-950 border-transparent dark:bg-orange-950/50 dark:text-orange-200 font-bold shadow-sm";
      case 64: return "bg-orange-300 text-orange-950 border-transparent dark:bg-orange-900/80 dark:text-orange-100 font-black";
      case 128: return "bg-rose-200 text-rose-950 border-transparent dark:bg-rose-950/50 dark:text-rose-200 font-black";
      case 256: return "bg-rose-300 text-rose-950 border-transparent dark:bg-rose-900/80 dark:text-rose-100 font-black shadow-sm";
      case 512: return "bg-emerald-200 text-emerald-950 border-transparent dark:bg-emerald-950/40 dark:text-emerald-300 font-black";
      case 1024: return "bg-zinc-800 text-white border-transparent dark:bg-zinc-100 dark:text-zinc-950 font-black ring-2 ring-zinc-500/20";
      case 2048: return "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-black tracking-wide border-transparent scale-[1.03] shadow-[0_0_24px_rgba(24,24,27,0.15)] dark:shadow-[0_0_24px_rgba(255,255,255,0.15)] ring-2 ring-zinc-500";
      default: return "bg-white/40 dark:bg-zinc-900/30 border-zinc-200/40 dark:border-zinc-800/40";
    }
  };

  return (
    <GameShell title="2048" onRestart={resetGame}>
      <div className="relative rounded-[28px] bg-white/60 dark:bg-zinc-950/40 p-3.5 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md w-full max-w-[380px] sm:max-w-[420px] aspect-square grid grid-cols-4 grid-rows-4 gap-2.5 select-none">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className="relative w-full h-full bg-zinc-200/40 dark:bg-zinc-900/30 rounded-xl border border-zinc-200/20 dark:border-zinc-800/20">
              <AnimatePresence>
                {cell > 0 && (
                  <motion.div
                    key={`${rIdx}-${cIdx}-${cell}`}
                    initial={{ scale: 0.82, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.82, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className={`absolute inset-0 flex items-center justify-center font-black rounded-xl text-base sm:text-lg border select-none ${getTileBg(cell)}`}
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
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md rounded-[26px] flex flex-col items-center justify-center gap-2 z-20"
            >
              <p className="text-zinc-950 dark:text-white text-lg font-black uppercase tracking-wider bg-white/90 dark:bg-zinc-900/90 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                No Moves Left
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  );
};