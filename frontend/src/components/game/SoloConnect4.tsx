"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { GameShell } from "./GameShell";
import { Connect4Engine } from "@/games/connect4.engine";
import { Connect4AI } from "@/games/connect4.ai";
import { useConnect4Store } from "@/store/connect4.store";
import { useTimer } from "@/hooks/useTimer";

export const SoloConnect4 = () => {
  const engineRef = useRef(new Connect4Engine());
  const aiRef = useRef(new Connect4AI());

  const {
    board,
    currentTurn,
    winner,
    playerScore,
    cpuScore,
    round,
    matchWinner,
    setState,
  } = useConnect4Store();

  const { formattedTime, pause, reset, start } = useTimer({
    autoStart: true,
  });

  const syncState = useCallback(() => {
    setState({
      board: engineRef.current.board,
      currentTurn: engineRef.current.currentTurn,
      winner: engineRef.current.winner,
      status: engineRef.current.status,
    });
  }, [setState]);

  // PLAYER MOVE
  const makeMove = (col: number) => {
    if (currentTurn !== "X" || winner) return;
    const success = engineRef.current.makeMove(col);
    if (!success) return;
    syncState();
  };

  // CPU MOVE
  useEffect(() => {
    if (currentTurn !== "O" || winner) return;

    const timeout = setTimeout(() => {
      const move = aiRef.current.getMove(engineRef.current.board);
      if (move === null) return;
      engineRef.current.makeMove(move);
      syncState();
    }, 700);

    return () => clearTimeout(timeout);
  }, [currentTurn, winner, syncState]);

  // SCORE & MATCH EVALUATION TRACKING
  // Extracted logic updates layout mutations cleanly only on explicit winner updates
  useEffect(() => {
    if (!winner) return;
    pause();

    // Reading store primitives inside functional updates prevents dependency re-trigger loop cascading
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
    <GameShell
      title="Connect 4"
      timer={formattedTime}
      onRestart={nextRound}
      info="Connect 4 discs before the CPU."
    >
      <div className="flex flex-col items-center">
        {/* ROUND */}
        <div className="shell-title-panel mb-4 rounded-full border border-white/60 bg-white/70 px-5 py-2 shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-body text-sm text-slate-500 transition-colors duration-300 dark:text-slate-400">
            Round {Math.min(round, 3)} / 3
          </p>
        </div>

        {/* SCORE */}
        <div className="shell-title-panel mb-8 flex items-center gap-6 rounded-full border border-white/60 bg-white/70 px-8 py-4 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60">
          <div className="text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">You</p>
            <p className="font-[family:var(--font-pixel)] text-3xl text-pink-400 dark:text-pink-500">
              {playerScore}
            </p>
          </div>
          <div className="text-slate-300 dark:text-slate-650">vs</div>
          <div className="text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">CPU</p>
            <p className="font-[family:var(--font-pixel)] text-3xl text-sky-400 dark:text-sky-500">
              {cpuScore}
            </p>
          </div>
        </div>

        {/* BOARD */}
        <div className="shell-game-area grid grid-cols-7 gap-3 rounded-[36px] border border-white/60 bg-white/70 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileTap={{ scale: 0.92 }}
                onClick={() => makeMove(colIndex)}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
              >
                <div
                  className={`h-12 w-12 rounded-full transition-colors duration-300 ${
                    cell === "X"
                      ? "bg-pink-400 dark:bg-pink-500"
                      : cell === "O"
                        ? "bg-sky-400 dark:bg-sky-500"
                        : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />
              </motion.button>
            )),
          )}
        </div>

        {/* STATUS */}
        <div className="mt-8">
          {!winner ? (
            <div className="shell-title-panel rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-title text-slate-600 transition-colors duration-300 dark:text-slate-300">
                {currentTurn === "X" ? "your turn" : "cpu thinking..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="shell-title-panel rounded-full border border-white/60 bg-white/80 px-8 py-4 shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/80">
                <p className="font-[family:var(--font-pixel)] text-3xl text-violet-500 dark:text-violet-400">
                  {matchWinner
                    ? matchWinner === "PLAYER"
                      ? "MATCH WON ✨"
                      : "CPU WINS MATCH"
                    : winner === "DRAW"
                      ? "DRAW!"
                      : winner === "X"
                        ? "ROUND WON"
                        : "CPU WON"}
                </p>
              </div>

              <button
                onClick={nextRound}
                className="player-btn rounded-full bg-violet-400 px-8 py-4 font-medium text-white shadow-lg shadow-violet-200 transition-all duration-300 hover:scale-[1.03] dark:bg-violet-500 dark:shadow-violet-950/30 dark:hover:bg-violet-600"
              >
                {matchWinner ? "Play Again" : "Next Round"}
              </button>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};