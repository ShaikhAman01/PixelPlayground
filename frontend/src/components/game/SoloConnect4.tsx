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

  const { board, currentTurn, winner, round, matchWinner, difficulty, setState } = useConnect4Store();
  const { formattedTime, pause, reset, start } = useTimer({ autoStart: true });

  const syncState = useCallback(() => {
    setState({
      board: JSON.parse(JSON.stringify(engineRef.current.board)),
      currentTurn: engineRef.current.currentTurn,
      winner: engineRef.current.winner,
      status: engineRef.current.status,
    });
  }, [setState]);

  const makeMove = (col: number) => {
    if (currentTurn !== "X" || winner || matchWinner) return;
    const success = engineRef.current.makeMove(col);
    if (!success) return;
    syncState();
  };

  useEffect(() => {
    if (currentTurn !== "O" || winner || matchWinner) return;
    const timeout = setTimeout(() => {
      const move = aiRef.current.getMove(engineRef.current.board, difficulty);
      if (move === null) return;
      engineRef.current.makeMove(move);
      syncState();
    }, 600);
    return () => clearTimeout(timeout);
  }, [currentTurn, winner, matchWinner, difficulty, syncState]);

  useEffect(() => {
    if (!winner) return;
    pause();

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
  }, [winner, pause]);

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
    <GameShell title="Connect 4" timer={formattedTime} onRestart={nextRound}>
      <div className="flex flex-col items-center justify-center w-full select-none pb-2 pt-10">
        
        <div className="relative rounded-[28px] bg-white/90 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 p-4 shadow-xl backdrop-blur-md">
          
          <div className="absolute -top-12 left-4 right-4 grid grid-cols-7 gap-2.5 sm:gap-3.5 justify-items-center">
            {Array.from({ length: 7 }).map((_, colIdx) => (
              <div key={colIdx} className="relative flex h-10 w-10 sm:h-12 sm:w-12 justify-center items-center">
                <AnimatePresence>
                  {hoveredCol === colIdx && currentTurn === "X" && !winner && !matchWinner && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.8 }}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-violet-400/70 border border-white"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className={`grid grid-cols-7 gap-2.5 sm:gap-3.5 transition-opacity duration-300 ${
            winner || matchWinner ? "opacity-60 pointer-events-none" : ""
          }`}>
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onMouseEnter={() => setHoveredCol(colIndex)}
                  onMouseLeave={() => setHoveredCol(null)}
                  onClick={() => makeMove(colIndex)}
                  className={`relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-950/60 shadow-[inner_0_2px_4px_rgba(0,0,0,0.06)] border border-zinc-200 dark:border-zinc-800 ${
                    winner || matchWinner ? "pointer-events-none" : "cursor-pointer"
                  }`}
                >
                  <AnimatePresence>
                    {cell && (
                      <motion.div
                        initial={{ y: -350, scale: 0.6, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 160, damping: 16 }}
                        className={`absolute inset-0.5 rounded-full border border-white/20 shadow-sm ${
                          cell === "X" 
                            ? "bg-gradient-to-tr from-violet-500 to-violet-400" 
                            : "bg-gradient-to-tr from-rose-400 to-rose-300"
                        }`}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )),
            )}
          </div>
        </div>

        {(winner || matchWinner) && (
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center gap-1"
          >
            <button
              onClick={nextRound}
              className="rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-100 px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              {matchWinner ? "Reset Match Series" : "Next Round"}
            </button>
          </motion.div>
        )}

      </div>
    </GameShell>
  );
};