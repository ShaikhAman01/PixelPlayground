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
    if (currentTurn !== "X" || winner) return;
    const success = engineRef.current.makeMove(col);
    if (!success) return;
    syncState();
  };

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
      <div className="flex flex-col items-center justify-center w-full">
        
        <div className="relative rounded-[32px] border border-blue-600/20 bg-gradient-to-b from-blue-500 to-blue-700 p-5 shadow-xl dark:from-blue-600 dark:to-blue-900">
          
          <div className="absolute -top-11 left-5 right-5 grid grid-cols-7 gap-3 sm:gap-4 justify-items-center">
            {Array.from({ length: 7 }).map((_, colIdx) => (
              <div key={colIdx} className="relative flex h-9 w-9 sm:w-12 justify-center items-center">
                <AnimatePresence>
                  {hoveredCol === colIdx && currentTurn === "X" && !winner && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-pink-400/80 dark:bg-pink-500/80 border-2 border-white"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3 sm:gap-4">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  onMouseEnter={() => setHoveredCol(colIndex)}
                  onMouseLeave={() => setHoveredCol(null)}
                  onClick={() => makeMove(colIndex)}
                  className="relative flex h-9 w-9 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full bg-slate-900/30 shadow-[inner_0_3px_6px_rgba(0,0,0,0.4)]"
                >
                  <AnimatePresence>
                    {cell && (
                      <motion.div
                        initial={{ y: -250, scale: 0.4, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 130, damping: 15 }}
                        className={`absolute inset-0.5 rounded-full border border-white/10 ${
                          cell === "X" ? "bg-gradient-to-tr from-pink-500 to-pink-400" : "bg-gradient-to-tr from-sky-500 to-sky-400"
                        }`}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )),
            )}
          </div>
        </div>

        {winner && (
          <div className="mt-6">
            <button
              onClick={nextRound}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md dark:bg-white dark:text-slate-900 transition-all active:scale-95"
            >
              {matchWinner ? "Reset Match" : "Next Round"}
            </button>
          </div>
        )}

      </div>
    </GameShell>
  );
};