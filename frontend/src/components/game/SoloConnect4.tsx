"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./GameShell";
import { Connect4Engine } from "@/games/connect4.engine";
import { Connect4AI } from "@/games/connect4.ai";
import { useConnect4Store } from "@/store/connect4.store";
import { useTimer } from "@/hooks/useTimer";

export const SoloConnect4 = () => {
  const engineRef = useRef(new Connect4Engine());
  const aiRef = useRef(new Connect4AI());
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const {
    board,
    currentTurn,
    winner,
    playerScore,
    cpuScore,
    round,
    matchWinner,
    difficulty,
    setState,
  } = useConnect4Store();

  const { formattedTime, pause, reset, start } = useTimer({
    autoStart: true,
  });

  const syncState = useCallback(() => {
    setState({
      board: JSON.parse(JSON.stringify(engineRef.current.board)),
      currentTurn: engineRef.current.currentTurn,
      winner: engineRef.current.winner,
      status: engineRef.current.status,
    });
  }, [setState]);

  const makeMove = (col: number) => {
    if (currentTurn !== "X" || winner) return;
    const success = engineRef.current.makeMove(col);
    if (!success) return;
    syncState();
  };

  // CPU ENGINE LOGIC PIPELINE
  useEffect(() => {
    if (currentTurn !== "O" || winner) return;

    const timeout = setTimeout(() => {
      const move = aiRef.current.getMove(engineRef.current.board, difficulty);
      if (move === null) return;
      engineRef.current.makeMove(move);
      syncState();
    }, 600);

    return () => clearTimeout(timeout);
  }, [currentTurn, winner, difficulty, syncState]);

// SCORE & MATCH EVALUATION TRACKING
useEffect(() => {
  if (!winner) return;
  
  // Call pause safely inside the effect execution path
  pause();

  // Perform store state updates cleanly isolated
  useConnect4Store.setState((prev) => {
    let nextPlayerScore = prev.playerScore;
    let nextCpuScore = prev.cpuScore;
    let nextMatchWinner = prev.matchWinner;

    if (winner === "X") nextPlayerScore += 1;
    if (winner === "O") nextCpuScore += 1;

    if (nextPlayerScore >= 2) nextMatchWinner = "PLAYER";
    if (nextCpuScore >= 2) nextMatchWinner = "CPU";

    return {
      playerScore: nextPlayerScore,
      cpuScore: nextCpuScore,
      round: prev.round + 1,
      matchWinner: nextMatchWinner,
    };
  });
  
}, [winner]);

  const nextRound = () => {
    if (matchWinner) {
      setState({ playerScore: 0, cpuScore: 0, round: 1, matchWinner: null });
    }
    engineRef.current.reset();
    syncState();
    reset();
    start();
  };

  return (
    <GameShell
      title="Connect 4"
      timer={formattedTime}
      onRestart={nextRound}
      info="Connect 4 discs lineally before the CPU can block you."
    >
      <div className="flex flex-col items-center max-w-full px-4">
        
        {/* SEGMENTED DIFFICULTY PANEL */}
        <div className="mb-6 flex gap-1 rounded-2xl bg-slate-100/80 p-1.5 backdrop-blur-md dark:bg-slate-900/60 border border-slate-200/50 dark:border-white/5">
          {(["EASY", "MEDIUM", "HARD"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setState({ difficulty: mode })}
              className={`relative rounded-xl px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                difficulty === mode
                  ? "bg-white text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-400"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* ROUND OVERVIEW HEADER */}
        <div className="mb-4 rounded-full border border-white/60 bg-white/70 px-5 py-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Round {Math.min(round, 3)} / 3
          </p>
        </div>

        {/* GAME STATS DISPLAY DECK */}
        <div className="mb-6 flex items-center gap-8 rounded-3xl border border-white/60 bg-white/70 px-10 py-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">You</p>
            <p className="text-3xl font-extrabold text-pink-500 dark:text-pink-400">{playerScore}</p>
          </div>
          <div className="text-xl font-black text-slate-300 dark:text-slate-700">VS</div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">CPU</p>
            <p className="text-3xl font-extrabold text-sky-500 dark:text-sky-400">{cpuScore}</p>
          </div>
        </div>

        {/* CONNECT 4 BOARD FRAME & TRACKING CONTAINER */}
<div className="relative rounded-[40px] border border-blue-600/30 bg-gradient-to-b from-blue-500 to-blue-700 p-6 shadow-2xl dark:from-blue-600 dark:to-blue-900">
  
  {/* FIXED: The indicator tray now perfectly mirrors the board's exact columns and gaps */}
  <div className="absolute -top-12 left-6 right-6 grid grid-cols-7 gap-3 sm:gap-4 justify-items-center">
    {Array.from({ length: 7 }).map((_, colIdx) => (
      <div key={colIdx} className="relative flex h-10 w-11 sm:w-14 justify-center items-center">
        <AnimatePresence>
          {hoveredCol === colIdx && currentTurn === "X" && !winner && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-pink-400/80 dark:bg-pink-500/80 shadow-md border-2 border-white"
            />
          )}
        </AnimatePresence>
      </div>
    ))}
  </div>

  {/* Grid Blueprint */}
  <div className="grid grid-cols-7 gap-3 sm:gap-4">
    {board.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          onMouseEnter={() => setHoveredCol(colIndex)}
          onMouseLeave={() => setHoveredCol(null)}
          onClick={() => makeMove(colIndex)}
          className="relative flex h-11 w-11 sm:h-14 sm:w-14 cursor-pointer items-center justify-center rounded-full bg-slate-900/30 shadow-[inner_0_4px_8px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-slate-950/40"
        >
          {/* Token Slots Drop Animate Canvas */}
          <AnimatePresence>
            {cell && (
              <motion.div
                initial={{ y: -300, scale: 0.2, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                className={`absolute inset-0.5 rounded-full shadow-md border border-white/20 ${
                  cell === "X"
                    ? "bg-gradient-to-tr from-pink-600 to-pink-400"
                    : "bg-gradient-to-tr from-sky-600 to-sky-400"
                }`}
              />
            )}
          </AnimatePresence>
        </div>
      )),
    )}
  </div>
</div>

        {/* MATCH EVALUATION STATUS DISPLAY CONTROLLER */}
        <div className="mt-8 min-h-[80px]">
          {!winner ? (
            <div className="rounded-full border border-white/60 bg-white/70 px-6 py-2.5 shadow-md dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300">
                {currentTurn === "X" ? "Your turn to drop" : "CPU is computing vector matrix..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="rounded-full border border-transparent bg-violet-500 px-8 py-3 shadow-lg shadow-violet-500/20">
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                  {matchWinner
                    ? matchWinner === "PLAYER" ? "🎉 Connect 4 Champion!" : "CPU Dominates Match"
                    : winner === "DRAW" ? "Round Stalemate Draw!" : winner === "X" ? "Round Clear Won" : "CPU Takes Round"}
                </p>
              </div>

              <button
                onClick={nextRound}
                className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {matchWinner ? "Reset Match Deck" : "Advance Round Tracker"}
              </button>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};