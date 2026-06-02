"use client";

import { motion } from "framer-motion";

import { useGameStore } from "@/store/game.store";

import { TurnIndicator } from "./TurnIndicator";

interface Props {
  onMove: (
    index: number
  ) => void;

  onRematch: () => void;
}

export const TicTacToeBoard =
  ({
    onMove,
    onRematch,
  }: Props) => {
    const {
      board,
      currentTurn,
      winner,
      status,
    } = useGameStore();

    return (
      <div className="flex flex-col items-center">
        {/* TURN */}
        {!winner && (
          <TurnIndicator
            currentTurn={
              currentTurn
            }
          />
        )}

        {/* BOARD WRAPPER */}
        <div
          className="
            relative
            rounded-[42px]
            border
            border-white/80
            bg-white/70
            p-5
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            backdrop-blur-2xl
            transition-all
            duration-300
            dark:border-white/10
            dark:bg-slate-900/60
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]

            before:absolute
            before:inset-0
            before:-z-10
            before:rounded-[42px]
            before:bg-violet-200/20
            before:blur-3xl
            dark:before:bg-violet-950/20
          "
        >
          {/* BOARD */}
          <div className="grid grid-cols-3 gap-4">
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
                  transition={{
                    type: "spring",
                    stiffness: 300,
                  }}
                  onClick={() =>
                    onMove(
                      index
                    )
                  }
                  disabled={
                    !!cell ||
                    status !==
                      "PLAYING"
                  }
                  className="
                    group
                    relative
                    flex
                    h-44
                    w-44
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[28px]

                    border
                    border-slate-200/80

                    bg-white/95

                    shadow-sm

                    transition-all
                    duration-300

                    hover:border-violet-200
                    hover:shadow-md
                    dark:border-white/10
                    dark:bg-slate-900/90
                    dark:hover:border-violet-500/50

                    disabled:cursor-not-allowed
                  "
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-100/40 to-sky-100/30 dark:from-violet-950/30 dark:to-sky-950/20" />
                  </div>

                  {/* Inner Soft Glow */}
                  <div className="absolute inset-[1px] rounded-[26px] border border-white/60 dark:border-white/5" />

                  {/* Symbol */}
                  <motion.span
                    initial={{
                      scale: 0,
                      rotate: -10,
                    }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                    }}
                    className={`
                      relative
                      z-10
                      font-[family:var(--font-pixel)]
                      text-7xl

                      ${
                        cell ===
                        "X"
                          ? "text-pink-400 dark:text-pink-500"
                          : "text-sky-400 dark:text-sky-500"
                      }
                    `}
                  >
                    {cell}
                  </motion.span>
                </motion.button>
              )
            )}
          </div>
        </div>

        {/* WINNER */}
        {winner && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-8 flex flex-col items-center gap-5"
          >
            <div className="rounded-full border border-white/60 bg-white/80 px-8 py-4 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/80">
              <p className="font-[family:var(--font-pixel)] text-3xl text-violet-500 dark:text-violet-400">
                {winner ===
                "DRAW"
                  ? "DRAW!"
                  : `${winner} WINS`}
              </p>
            </div>

            <button
              onClick={
                onRematch
              }
              className="
                rounded-full
                bg-violet-400
                px-8
                py-4
                font-medium
                text-white
                shadow-lg
                shadow-violet-200
                transition-all
                duration-300

                hover:scale-[1.03]
                hover:bg-violet-500
                dark:bg-violet-500
                dark:shadow-violet-950/30
                dark:hover:bg-violet-600
              "
            >
              Play Again
            </button>
          </motion.div>
        )}
      </div>
    );
  };