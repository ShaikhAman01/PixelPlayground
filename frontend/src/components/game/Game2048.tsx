"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./GameShell";

type GridType = number[][];

export const Game2048 = () => {
  const generateInitialBoard = () => {
    const initialGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
    
    // Spawn two starter numbers cleanly
    for (let i = 0; i < 2; i++) {
      const emptyCells: { r: number; c: number }[] = [];
      initialGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === 0) emptyCells.push({ r, c });
        });
      });
      if (emptyCells.length > 0) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        initialGrid[r][c] = Math.random() > 0.1 ? 2 : 4;
      }
    }
    return initialGrid;
  };

  const [board, setBoard] = useState<GridType>(() => generateInitialBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const spawnRandomTile = useCallback((currentBoard: GridType) => {
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

  const initializeGame = useCallback(() => {
    const freshBoard = generateInitialBoard();
    setBoard(freshBoard);
    setScore(0);
    setGameOver(false);
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

    // Helper method to rotate matrix arrays gracefully 90deg clockwise
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
    for (let i = 0; i < boardRotations; i++) {
      finalBoard = rotateMatrix(finalBoard);
    }

    if (altered) {
      const boardWithSpawn = spawnRandomTile(finalBoard);
      setBoard(boardWithSpawn);
      setScore((prev) => prev + scoreGain);
      
      // Evaluate game over conditions
      const operationalCells = boardWithSpawn.flatMap((r) => r).filter((c) => c === 0).length;
      if (operationalCells === 0) {
        // Double check adjacent combinations before triggering game over states
        let movesPossible = false;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; r++) {
            if (r < 3 && boardWithSpawn[r][c] === boardWithSpawn[r + 1][c]) movesPossible = true;
            if (c < 3 && boardWithSpawn[r][c] === boardWithSpawn[r][c + 1]) movesPossible = true;
          }
        }
        if (!movesPossible) setGameOver(true);
      }
    }
  }, [board, gameOver, spawnRandomTile]);

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
      case 2: return "bg-orange-100 text-slate-700 dark:bg-orange-950/40 dark:text-orange-200";
      case 4: return "bg-orange-200 text-slate-700 dark:bg-orange-900/40 dark:text-orange-300";
      case 8: return "bg-amber-300 text-white dark:bg-amber-700";
      case 16: return "bg-amber-400 text-white dark:bg-amber-600";
      case 32: return "bg-rose-400 text-white dark:bg-rose-600";
      case 64: return "bg-rose-500 text-white dark:bg-rose-700";
      case 128: return "bg-violet-400 text-white dark:bg-violet-600 shadow-lg";
      case 256: return "bg-violet-500 text-white dark:bg-violet-700 shadow-xl";
      default: return "bg-indigo-400 text-white";
    }
  };

  return (
    <GameShell title="2048 Master" onRestart={initializeGame} info="Slide tiles to merge matching pairs and reach 2048.">
      <div className="flex flex-col items-center max-w-full px-2">
        <div className="pp-glass mb-6 flex items-center justify-between gap-12 rounded-full px-6 py-2.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Score</span>
          <span className="font-[family:var(--font-pixel)] text-2xl text-violet-500 dark:text-violet-400">{score}</span>
        </div>

        <div className="pp-glass grid grid-cols-4 gap-3 p-4 rounded-3xl relative overflow-hidden size-[clamp(16rem,85vw,22rem)]">
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div key={`${rIdx}-${cIdx}`} className="relative w-full h-full bg-slate-200/50 dark:bg-slate-950/40 rounded-xl overflow-hidden">
                <AnimatePresence>
                  {cell > 0 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className={`absolute inset-0 flex items-center justify-center font-bold text-lg rounded-xl shadow-sm ${getTileBg(cell)}`}
                    >
                      {cell}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </GameShell>
  );
};