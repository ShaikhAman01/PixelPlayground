"use client";

import { useEffect, useRef, useCallback } from "react";
import { GameShell } from "./GameShell";
import { useTimer } from "@/hooks/useTimer";
import { motion, AnimatePresence } from "framer-motion";
import { TicTacToeEngine } from "@/games/tictactoe.engine";
import { getCpuMove } from "@/games/tictactoe.ai";
import { useSoloStore } from "@/store/solo.store";

export const SoloTicTacToe = () => {
  const engineRef = useRef(new TicTacToeEngine());

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

  const { formattedTime, start, pause, reset } = useTimer({
    autoStart: true,
  });

  const syncState = useCallback(() => {
    setState({
      board: [...engineRef.current.board],
      currentTurn: engineRef.current.currentTurn,
      winner: engineRef.current.winner,
      status: engineRef.current.status === "WAITING" ? undefined : engineRef.current.status,
    });
  }, [setState]);

  const makeMove = (index: number) => {
    if (currentTurn !== "X" || status !== "PLAYING") return;
    const success = engineRef.current.makeMove(index);
    if (success) syncState();
  };

  // AI TURN EFFECT HANDLER
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

  // FIXED RE-RENDER LOOP: Listened exclusively to winner changes
  useEffect(() => {
    if (!winner) return;
    pause();

    // Functional conditional updates executed isolated without external dependency tracking
    if (winner === "X") {
      setState({ playerScore: playerScore + 1, round: round + 1 });
    } else if (winner === "O") {
      setState({ cpuScore: cpuScore + 1, round: round + 1 });
    } else if (winner === "DRAW") {
      setState({ round: round + 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]); 

  // MATCH WINNER
  useEffect(() => {
    if (playerScore >= 2) setState({ matchWinner: "PLAYER" });
    if (cpuScore >= 2) setState({ matchWinner: "CPU" });
  }, [playerScore, cpuScore, setState]);

  const nextRound = () => {
    engineRef.current.reset();
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
    <GameShell
      title="Tic Tac Toe"
      timer={formattedTime}
      onRestart={nextRound}
      info="Get 3 in a row before the CPU does."
    >
      <div className="flex flex-col items-center max-w-full px-4">
        
        {/* IMPROVED UI: SEGMENTED DIFFICULTY TOGGLE */}
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

        {/* ROUND PANEL */}
        <div className="mb-4 rounded-full border border-white/60 bg-white/70 px-5 py-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Round {Math.min(round, 3)} / 3
          </p>
        </div>

        {/* SCORE PANEL */}
        <div className="mb-8 flex items-center gap-8 rounded-3xl border border-white/60 bg-white/70 px-10 py-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
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

        {/* MODERNIZED GRAPHICAL BOARD */}
        <div className="grid grid-cols-3 gap-4 rounded-[36px] border border-white/80 bg-white/40 p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:border-white/5 dark:bg-slate-900/40">
          {board.map((cell, index) => (
            <motion.button
              key={index}
              whileHover={!cell && status === "PLAYING" ? { scale: 1.04, y: -2 } : {}}
              whileTap={!cell && status === "PLAYING" ? { scale: 0.96 } : {}}
              onClick={() => makeMove(index)}
              disabled={!!cell || status !== "PLAYING"}
              className={`flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-[24px] border transition-all duration-300 text-5xl font-black shadow-sm ${
                cell 
                  ? "bg-white/90 border-transparent dark:bg-slate-800/90" 
                  : "bg-white/60 border-slate-200/60 hover:bg-white hover:border-violet-300 dark:bg-slate-900/60 dark:border-white/5 dark:hover:border-violet-500/40"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: cell === "X" ? -10 : 10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={cell === "X" ? "text-pink-500 drop-shadow-sm" : "text-sky-500 drop-shadow-sm"}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* BOTTOM GAME FOOTER STATUS */}
        <div className="mt-8 min-h-[80px]">
          {!winner ? (
            <div className="rounded-full border border-white/60 bg-white/70 px-6 py-3 shadow-md dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-sm font-medium tracking-wide text-slate-600 dark:text-slate-300">
                {currentTurn === "X" ? "Your turn to move" : "CPU is thinking..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="rounded-full border border-transparent bg-violet-500 px-8 py-3 shadow-lg shadow-violet-500/20">
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                  {matchWinner
                    ? matchWinner === "PLAYER" ? "🎉 Match Won!" : "CPU Wins Match"
                    : winner === "DRAW" ? "Round Draw!" : winner === "X" ? "Round Won" : "CPU Won Round"}
                </p>
              </div>

              <button
                onClick={nextRound}
                className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {matchWinner ? "Reset Entire Match" : "Advance to Next Round"}
              </button>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};