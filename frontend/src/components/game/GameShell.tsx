"use client";

import {
  Info,
  RotateCcw,
  Timer,
} from "lucide-react";

import { motion } from "framer-motion";

import { ReactNode } from "react";

interface Props {
  title: string;

  children: ReactNode;

  onRestart?: () => void;

  timer?: string;

  info?: string;
}

export const GameShell =
  ({
    title,
    children,
    onRestart,
    timer,
    info,
  }: Props) => {
    return (
      <div className="w-full max-w-[1100px]">
        {/* Top Controls */}
        <div className="mb-8 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            {/* Title */}
            <div className="shell-title-panel rounded-full border border-white/60 bg-white/70 px-6 py-3 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <h1 className="text-title font-[family:var(--font-pixel)] text-2xl text-slate-700 transition-colors duration-300 dark:text-slate-200">
                {title}
              </h1>
            </div>

            {/* Timer */}
            {timer && (
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat:
                    Infinity,
                }}
                className="shell-title-panel flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-3 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                <Timer className="h-4 w-4 text-violet-400 dark:text-violet-500" />

                <span className="text-title font-medium text-slate-600 transition-colors duration-300 dark:text-slate-300">
                  {timer}
                </span>
              </motion.div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Info */}
            {info && (
              <button
                className="
                  shell-btn
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/60
                  bg-white/70
                  shadow-lg
                  backdrop-blur-xl
                  transition-all
                  duration-300

                  hover:scale-105
                  dark:border-white/10
                  dark:bg-slate-900/60
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                "
              >
                <Info className="shell-btn-icon h-5 w-5 text-slate-500 transition-colors duration-300 dark:text-slate-400" />
              </button>
            )}

            {/* Restart */}
            {onRestart && (
              <button
                onClick={
                  onRestart
                }
                className="
                  shell-btn
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/60
                  bg-white/70
                  shadow-lg
                  backdrop-blur-xl
                  transition-all
                  duration-300

                  hover:scale-105
                  dark:border-white/10
                  dark:bg-slate-900/60
                  dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                "
              >
                <RotateCcw className="shell-btn-icon h-5 w-5 text-slate-500 transition-colors duration-300 dark:text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div
          className="
            shell-game-area
            rounded-[42px]
            border
            border-white/60
            bg-white/30
            p-10
            shadow-[0_20px_60px_rgba(0,0,0,0.05)]
            backdrop-blur-2xl
            transition-all
            duration-300
            dark:border-white/5
            dark:bg-slate-900/20
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          "
        >
          {children}
        </div>
      </div>
    );
  };