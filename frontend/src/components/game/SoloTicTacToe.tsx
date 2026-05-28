"use client";

import {
  useEffect,
  useRef,
} from "react";

import { motion } from "framer-motion";

import {
  TicTacToeEngine,
} from "@/games/tictactoe.engine";

import { getCpuMove } from "@/games/tictactoe.ai";

import { useSoloStore } from "@/store/solo.store";

export const SoloTicTacToe =
  () => {
    const engineRef =
      useRef(
        new TicTacToeEngine()
      );

    const {
      board,
      currentTurn,
      winner,
      status,

      playerScore,
      cpuScore,

      round,

      setState,
    } = useSoloStore();

    // SYNC ENGINE -> STORE
    const syncState =
      () => {
        setState({
          board:
            engineRef.current
              .board,

          currentTurn:
            engineRef.current
              .currentTurn,

          winner:
            engineRef.current
              .winner,

          status:
            engineRef.current
              .status,
        });
      };

    // PLAYER MOVE
    const makeMove = (
      index: number
    ) => {
      if (
        currentTurn !==
        "X"
      ) {
        return;
      }

      const success =
        engineRef.current.makeMove(
          index
        );

      if (!success)
        return;

      syncState();
    };

    // CPU TURN
    useEffect(() => {
      if (
        currentTurn !==
        "O"
      ) {
        return;
      }

      if (
        status !==
        "PLAYING"
      ) {
        return;
      }

      const timeout =
        setTimeout(() => {
          const move =
            getCpuMove(
              engineRef.current
                .board
            );

          if (
            move === null
          ) {
            return;
          }

          engineRef.current.makeMove(
            move
          );

          syncState();
        }, 700);

      return () =>
        clearTimeout(
          timeout
        );
    }, [
      currentTurn,
      status,
    ]);

    // SCORE TRACKING
    useEffect(() => {
      if (!winner)
        return;

      if (winner === "X") {
        setState({
          playerScore:
            playerScore + 1,
        });
      }

      if (winner === "O") {
        setState({
          cpuScore:
            cpuScore + 1,
        });
      }
    }, [winner]);

    // RESET ROUND
    const nextRound =
      () => {
        engineRef.current.reset();

        setState({
          board:
            engineRef.current
              .board,

          currentTurn:
            engineRef.current
              .currentTurn,

          winner:
            engineRef.current
              .winner,

          status:
            engineRef.current
              .status,

          round:
            round + 1,
        });
      };

    return (
      <div className="flex flex-col items-center">
        {/* SCORE */}
        <div className="mb-8 flex items-center gap-6 rounded-full border border-white/60 bg-white/70 px-8 py-4 shadow-lg backdrop-blur-xl">
          <div className="text-center">
            <p className="text-sm text-slate-400">
              You
            </p>

            <p className="font-[family:var(--font-pixel)] text-3xl text-pink-400">
              {
                playerScore
              }
            </p>
          </div>

          <div className="text-slate-300">
            vs
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              CPU
            </p>

            <p className="font-[family:var(--font-pixel)] text-3xl text-sky-400">
              {cpuScore}
            </p>
          </div>
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-3 gap-4 rounded-[42px] border border-white/70 bg-white/60 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
          {board.map(
            (
              cell,
              index
            ) => (
              <motion.button
                key={index}
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={() =>
                  makeMove(
                    index
                  )
                }
                disabled={
                  !!cell ||
                  status !==
                    "PLAYING"
                }
                className="flex h-40 w-40 items-center justify-center rounded-[28px] border border-slate-200/80 bg-white/95 text-7xl shadow-sm transition hover:border-violet-200"
              >
                <span
                  className={`font-[family:var(--font-pixel)] ${
                    cell ===
                    "X"
                      ? "text-pink-400"
                      : "text-sky-400"
                  }`}
                >
                  {cell}
                </span>
              </motion.button>
            )
          )}
        </div>

        {/* STATUS */}
        <div className="mt-8">
          {!winner ? (
            <div className="rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg">
              <p className="text-slate-600">
                {currentTurn ===
                "X"
                  ? "your turn"
                  : "cpu thinking..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5">
              <div className="rounded-full border border-white/60 bg-white/80 px-8 py-4 shadow-lg">
                <p className="font-[family:var(--font-pixel)] text-3xl text-violet-500">
                  {winner ===
                  "DRAW"
                    ? "DRAW!"
                    : winner ===
                        "X"
                      ? "YOU WIN"
                      : "CPU WINS"}
                </p>
              </div>

              <button
                onClick={
                  nextRound
                }
                className="rounded-full bg-violet-400 px-8 py-4 font-medium text-white shadow-lg shadow-violet-200 transition hover:scale-[1.03]"
              >
                Next Round
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };