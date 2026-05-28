"use client";

import { useEffect, useRef } from "react";

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
    status,

    playerScore,
    cpuScore,

    round,

    matchWinner,

    setState,
  } = useConnect4Store();

  const { formattedTime, pause, reset, start } = useTimer({
    autoStart: true,
  });

  // PLAYER MOVE
  const makeMove = (col: number) => {
    if (currentTurn !== "X") return;

    const success = engineRef.current.makeMove(col);

    if (!success) return;

    syncState();
  };

  // CPU MOVE
  useEffect(() => {
    if (currentTurn !== "O" || winner) {
      return;
    }

    const timeout = setTimeout(() => {
      const move = aiRef.current.getMove(engineRef.current.board);

      if (move === null) return;

      engineRef.current.makeMove(move);

      syncState();
    }, 700);

    return () => clearTimeout(timeout);
  }, [currentTurn, winner]);

  // SCORE
  useEffect(() => {
    if (!winner) return;

    pause();

    if (winner === "X") {
      setState({
        playerScore: playerScore + 1,

        round: round + 1,
      });
    }

    if (winner === "O") {
      setState({
        cpuScore: cpuScore + 1,

        round: round + 1,
      });
    }

    if (playerScore >= 2) {
      setState({
        matchWinner: "PLAYER",
      });
    }

    if (cpuScore >= 2) {
      setState({
        matchWinner: "CPU",
      });
    }
  }, [winner]);

  const syncState = () => {
    setState({
      board: engineRef.current.board,

      currentTurn: engineRef.current.currentTurn,

      winner: engineRef.current.winner,

      status: engineRef.current.status,
    });
  };

  const nextRound = () => {
    if (matchWinner) {
      setState({
        playerScore: 0,

        cpuScore: 0,

        round: 1,

        matchWinner: null,
      });
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
        <div className="mb-4 rounded-full border border-white/60 bg-white/70 px-5 py-2 shadow-lg">
          <p className="text-sm text-slate-500">
            Round {Math.min(round, 3)} / 3
          </p>
        </div>

        {/* SCORE */}
        <div className="mb-8 flex items-center gap-6 rounded-full border border-white/60 bg-white/70 px-8 py-4 shadow-lg backdrop-blur-xl">
          <div className="text-center">
            <p className="text-sm text-slate-400">You</p>

            <p className="font-[family:var(--font-pixel)] text-3xl text-pink-400">
              {playerScore}
            </p>
          </div>

          <div className="text-slate-300">vs</div>

          <div className="text-center">
            <p className="text-sm text-slate-400">CPU</p>

            <p className="font-[family:var(--font-pixel)] text-3xl text-sky-400">
              {cpuScore}
            </p>
          </div>
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-7 gap-3 rounded-[36px] border border-white/60 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={rowIndex * 7 + colIndex}
                whileTap={{
                  scale: 0.92,
                }}
                onClick={() => makeMove(colIndex)}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className={`h-12 w-12 rounded-full ${
                    cell === "X"
                      ? "bg-pink-400"
                      : cell === "O"
                        ? "bg-sky-400"
                        : "bg-slate-100"
                  }`}
                />
              </motion.button>
            )),
          )}
        </div>

        {/* STATUS */}
        <div className="mt-8">
          {!winner ? (
            <div className="rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg">
              <p className="text-slate-600">
                {currentTurn === "X" ? "your turn" : "cpu thinking..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="rounded-full border border-white/60 bg-white/80 px-8 py-4 shadow-lg">
                <p className="font-[family:var(--font-pixel)] text-3xl text-violet-500">
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
                className="rounded-full bg-violet-400 px-8 py-4 font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.03]"
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
