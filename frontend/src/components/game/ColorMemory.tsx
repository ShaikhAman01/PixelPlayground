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
          <div className="mb-8 rounded-full border border-white/60 bg-white/70 px-8 py-4 shadow-lg">
            <p className="font-[family:var(--font-pixel)] text-2xl text-slate-700">
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
                  className={`h-40 w-40 rounded-[32px] ${color} shadow-xl`}
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
                className="rounded-full bg-violet-400 px-8 py-4 text-white shadow-lg"
              >
                Start Game
              </button>
            ) : status ===
              "FAILED" ? (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-white/70 px-6 py-4 shadow-lg">
                  <p className="text-xl text-rose-400">
                    Game Over
                  </p>
                </div>

                <button
                  onClick={
                    startGame
                  }
                  className="rounded-full bg-violet-400 px-8 py-4 text-white shadow-lg"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="rounded-full bg-white/70 px-6 py-4 shadow-lg">
                <p className="text-slate-600">
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