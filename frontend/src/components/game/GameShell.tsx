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
            <div className="rounded-full border border-white/60 bg-white/70 px-6 py-3 shadow-lg backdrop-blur-xl">
              <h1 className="font-[family:var(--font-pixel)] text-2xl text-slate-700">
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
                className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-3 shadow-lg backdrop-blur-xl"
              >
                <Timer className="h-4 w-4 text-violet-400" />

                <span className="font-medium text-slate-600">
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
                  transition

                  hover:scale-105
                "
              >
                <Info className="h-5 w-5 text-slate-500" />
              </button>
            )}

            {/* Restart */}
            {onRestart && (
              <button
                onClick={
                  onRestart
                }
                className="
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
                  transition

                  hover:scale-105
                "
              >
                <RotateCcw className="h-5 w-5 text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* Game Area */}
        <div
          className="
            rounded-[42px]
            border
            border-white/60
            bg-white/30
            p-10
            shadow-[0_20px_60px_rgba(0,0,0,0.05)]
            backdrop-blur-2xl
          "
        >
          {children}
        </div>
      </div>
    );
  };