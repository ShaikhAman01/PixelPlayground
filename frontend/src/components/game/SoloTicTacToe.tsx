"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameShell } from "./GameShell";
import { useTimer } from "@/hooks/useTimer";
import { motion, AnimatePresence } from "framer-motion";
import { TicTacToeEngine } from "@/games/tictactoe.engine";
import { getCpuMove } from "@/games/tictactoe.ai";
import { useSoloStore } from "@/store/solo.store";

// Winning combo mappings to append absolute positioning classes
const winLineStyles: Record<string, string> = {
  "0,1,2": "top-[16.5%] left-[5%] right-[5%] h-1.5 origin-left",
  "3,4,5": "top-[50%] left-[5%] right-[5%] h-1.5 origin-left",
  "6,7,8": "top-[83.5%] left-[5%] right-[5%] h-1.5 origin-left",
  "0,3,6": "left-[16.5%] top-[5%] bottom-[5%] w-1.5 origin-top",
  "1,4,7": "left-[50%] top-[5%] bottom-[5%] w-1.5 origin-top",
  "2,5,8": "left-[83.5%] top-[5%] bottom-[5%] w-1.5 origin-top",
  "0,4,8": "top-[0%] left-[0%] w-[141%] h-1.5 rotate-45 origin-top-left translate-x-[4%] translate-y-[4%]",
  "2,4,6": "top-[0%] right-[0%] w-[141%] h-1.5 -rotate-45 origin-top-right -translate-x-[4%] translate-y-[4%]",
};

export const SoloTicTacToe = () => {
  const engineRef = useRef(new TicTacToeEngine());
  const [winningComboKey, setWinningComboKey] = useState<string | null>(null);

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

  // Scan current layout map indices to identify the match condition track
  const detectWinningCombo = useCallback((currentBoard: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical rows
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return line.join(",");
      }
    }
    return null;
  }, []);

  const syncState = useCallback(() => {
    const currentBoard = [...engineRef.current.board];
    const combo = detectWinningCombo(currentBoard);
    if (combo) setWinningComboKey(combo);

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
    setWinningComboKey(null);
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
        
        {/* Board Container Wrapper */}
        <div className="relative rounded-[32px] bg-white/10 dark:bg-slate-900/10 p-4 border border-white/20 shadow-sm">
          
          {/* Animated Win Strike Cross Line Overlay */}
          <AnimatePresence>
            {winningComboKey && winLineStyles[winningComboKey] && (
              <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
                animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`absolute rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.6)] z-30 pointer-events-none ${winLineStyles[winningComboKey]}`}
              />
            )}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-3.5">
            {board.map((cell, index) => (
              <motion.button
                key={index}
                whileHover={!cell && status === "PLAYING" ? { scale: 1.03 } : {}}
                whileTap={!cell && status === "PLAYING" ? { scale: 0.97 } : {}}
                onClick={() => makeMove(index)}
                disabled={!!cell || status !== "PLAYING"}
                className={`flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border transition-all duration-200 text-4xl font-black shadow-sm ${
                  cell 
                    ? "bg-white dark:bg-slate-800 border-transparent z-10" 
                    : "bg-white/50 border-slate-200/60 dark:bg-slate-900/50 dark:border-white/5"
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {cell && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cell === "X" ? "text-pink-500" : "text-sky-500"}
                    >
                      {cell}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </div>

        {winner && (
          <div className="mt-6">
            <button
              onClick={nextRound}
              className="rounded-xl bg-slate-900 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md dark:bg-white dark:text-slate-900 transition-all active:scale-95"
            >
              {matchWinner ? "Reset Match" : "Next Round"}
            </button>
          </div>
        )}

      </div>
    </GameShell>
  );
};