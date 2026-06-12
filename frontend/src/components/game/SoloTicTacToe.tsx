"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameShell } from "./GameShell";
import { useTimer } from "@/hooks/useTimer";
import { motion, AnimatePresence } from "framer-motion";
import { TicTacToeEngine } from "@/games/tictactoe.engine";
import { getCpuMove } from "@/games/tictactoe.ai";
import { useSoloStore } from "@/store/solo.store";

export const SoloTicTacToe = () => {
  const engineRef = useRef(new TicTacToeEngine());
  const [winningIndices, setWinningIndices] = useState<number[]>([]);

  const {
    board,
    currentTurn,
    winner,
    status,
    playerScore,
    cpuScore,
    round,
    matchWinner,
    difficulty,
    setState,
  } = useSoloStore();

  const { formattedTime, start, pause, reset } = useTimer({ autoStart: true });

  const detectWinningCombo = useCallback((currentBoard: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return line;
      }
    }
    return null;
  }, []);

  const syncState = useCallback(() => {
    const currentBoard = [...engineRef.current.board];
    const combo = detectWinningCombo(currentBoard);
    if (combo) setWinningIndices(combo);

    setState({
      board: currentBoard,
      currentTurn: engineRef.current.currentTurn,
      winner: engineRef.current.winner,
      status: engineRef.current.status === "WAITING" ? undefined : engineRef.current.status,
    });
  }, [setState, detectWinningCombo]);

  const makeMove = (index: number) => {
    if (currentTurn !== "X" || status !== "PLAYING") return;
    const success = engineRef.current.makeMove(index);
    if (success) syncState();
  };

  useEffect(() => {
    if (currentTurn !== "O" || status !== "PLAYING" || winner) return;

    const timeout = setTimeout(() => {
      const move = getCpuMove(engineRef.current.board, difficulty);
      if (move !== null) {
        engineRef.current.makeMove(move);
        syncState();
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [currentTurn, status, winner, difficulty, syncState]);

  useEffect(() => {
    if (!winner) return;
    pause();

    if (winner === "X") setState({ playerScore: playerScore + 1, round: round + 1 });
    else if (winner === "O") setState({ cpuScore: cpuScore + 1, round: round + 1 });
    else if (winner === "DRAW") setState({ round: round + 1 });
  }, [winner]);

  useEffect(() => {
    if (playerScore >= 2) setState({ matchWinner: "PLAYER" });
    if (cpuScore >= 2) setState({ matchWinner: "CPU" });
  }, [playerScore, cpuScore, setState]);

  const nextRound = () => {
    engineRef.current.reset();
    setWinningIndices([]);
    reset();
    start();

    if (matchWinner) {
      setState({
        board: Array(9).fill(null),
        currentTurn: "X",
        winner: null,
        status: "PLAYING",
        playerScore: 0,
        cpuScore: 0,
        round: 1,
        matchWinner: null,
      });
    } else {
      setState({
        board: engineRef.current.board,
        currentTurn: "X",
        winner: null,
        status: "PLAYING",
      });
    }
  };

  return (
    <GameShell title="Tic Tac Toe" timer={formattedTime} onRestart={nextRound}>
      <div className="flex flex-col items-center justify-center w-full">
        
        <div className="relative rounded-[28px] bg-white/90 dark:bg-zinc-900/90 p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-md">
          <div className="grid grid-cols-3 gap-3">
            {board.map((cell, index) => {
              const isWinningCell = winningIndices.includes(index);
              const hasWinnerExist = winningIndices.length > 0;
              
              return (
                <motion.button
                  key={index}
                  whileHover={!cell && status === "PLAYING" ? { scale: 1.02 } : {}}
                  whileTap={!cell && status === "PLAYING" ? { scale: 0.98 } : {}}
                  onClick={() => makeMove(index)}
                  disabled={!!cell || status !== "PLAYING"}
                  className={`flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border text-3xl font-black shadow-sm transition-all duration-300 select-none ${
                    cell 
                      ? isWinningCell
                        ? "bg-violet-100 dark:bg-violet-950/50 border-violet-300 dark:border-violet-700 z-10 scale-105"
                        : hasWinnerExist
                          ? "bg-white/40 dark:bg-zinc-950/20 border-transparent opacity-30 scale-95"
                          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 z-10"
                      : hasWinnerExist
                        ? "bg-transparent border-transparent opacity-10 scale-95"
                        : "bg-zinc-50/50 border-zinc-200/60 dark:bg-zinc-900/40 dark:border-zinc-800/60 hover:bg-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {cell && (
                      <motion.span
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cell === "X" ? "text-violet-600 dark:text-violet-400" : "text-rose-500 dark:text-rose-400"}
                      >
                        {cell}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>

        {winner && (
          <div className="mt-6">
            <button
              onClick={nextRound}
              className="rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-900 dark:hover:bg-zinc-100 px-6 py-3 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              {matchWinner ? "Reset Match" : "Next Round"}
            </button>
          </div>
        )}

      </div>
    </GameShell>
  );
};