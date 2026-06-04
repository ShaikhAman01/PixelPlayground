"use client";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { GameShell } from "./GameShell";

import { useColorMemoryStore } from "@/store/colorMemory.store";

const colors = [
  "bg-pink-300",
  "bg-sky-300",
  "bg-yellow-300",
  "bg-green-300",
];

export const ColorMemory =
  () => {
    const {
      sequence,
      playerSequence,
      level,
      status,
      activeTile,
      setState,
    } =
      useColorMemoryStore();

    const [started, setStarted] =
      useState(false);

    // START GAME
    const startGame =
      () => {
        const first =
          Math.floor(
            Math.random() * 4
          );

        setState({
          sequence: [first],

          playerSequence:
            [],

          level: 1,

          status:
            "WATCHING",
        });

        setStarted(true);
      };

    // SHOW SEQUENCE
    useEffect(() => {
      if (
        !started
      )
        return;

      if (
        status !==
        "WATCHING"
      ) {
        return;
      }

      let i = 0;

      const interval =
        setInterval(() => {
          const tile =
            sequence[i];

          setState({
            activeTile:
              tile,
          });

          setTimeout(() => {
            setState({
              activeTile:
                null,
            });
          }, 400);

          i++;

          if (
            i >=
            sequence.length
          ) {
            clearInterval(
              interval
            );

            setTimeout(() => {
              setState({
                status:
                  "PLAYING",
              });
            }, 700);
          }
        }, 800);

      return () =>
        clearInterval(
          interval
        );
    }, [
      sequence,
      status,
      started,
      setState,
    ]);

    // PLAYER MOVE
    const handleClick =
      (
        index: number
      ) => {
        if (
          status !==
          "PLAYING"
        ) {
          return;
        }

        const next =
          [
            ...playerSequence,
            index,
          ];

        setState({
          playerSequence:
            next,
        });

        // WRONG
        if (
          next[
            next.length -
              1
          ] !==
          sequence[
            next.length -
              1
          ]
        ) {
          setState({
            status:
              "FAILED",
          });

          return;
        }

        // ROUND COMPLETE
        if (
          next.length ===
          sequence.length
        ) {
          setTimeout(() => {
            setState({
              sequence: [
                ...sequence,

                Math.floor(
                  Math.random() *
                    4
                ),
              ],

              playerSequence:
                [],

              level:
                level + 1,

              status:
                "WATCHING",
            });
          }, 700);
        }
      };

    return (
      <GameShell
        title="Color Memory"
        info="Watch the pattern and repeat it."
      >
        <div className="flex flex-col items-center">
          {/* LEVEL */}
          <div className="shell-title-panel mb-8 rounded-full border border-white/60 bg-white/70 px-8 py-4 shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60">
            <p className="text-title font-[family:var(--font-pixel)] text-2xl text-slate-700 transition-colors duration-300 dark:text-slate-200">
              Level {level}
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-5">
            {colors.map(
              (
                color,
                index
              ) => (
                <motion.button
                  key={index}
                  whileTap={{
                    scale: 0.95,
                  }}
                  animate={{
                    scale:
                      activeTile ===
                      index
                        ? 1.08
                        : 1,

                    opacity:
                      activeTile ===
                      index
                        ? 1
                        : 0.8,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  onClick={() =>
                    handleClick(
                      index
                    )
                  }
                  className={`h-40 w-40 rounded-[32px] ${color} shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]`}
                />
              )
            )}
          </div>

          {/* STATUS */}
          <div className="mt-8">
            {!started ? (
              <button
                onClick={
                  startGame
                }
                className="player-btn rounded-full bg-violet-400 px-8 py-4 text-white shadow-lg transition-all duration-300 dark:bg-violet-500 dark:shadow-violet-950/30"
              >
                Start Game
              </button>
            ) : status ===
              "FAILED" ? (
              <div className="flex flex-col items-center gap-4">
                <div className="shell-title-panel rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60">
                  <p className="text-xl text-rose-450 dark:text-rose-400 font-semibold">
                    Game Over
                  </p>
                </div>

                <button
                  onClick={
                    startGame
                  }
                  className="player-btn rounded-full bg-violet-400 px-8 py-4 text-white shadow-lg transition-all duration-300 dark:bg-violet-500 dark:shadow-violet-950/30"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="shell-title-panel rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60">
                <p className="text-title text-slate-600 transition-colors duration-300 dark:text-slate-350">
                  {status ===
                  "WATCHING"
                    ? "watch carefully..."
                    : "your turn"}
                </p>
              </div>
            )}
          </div>
        </div>
      </GameShell>
    );
  };