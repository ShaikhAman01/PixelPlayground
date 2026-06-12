"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  color?: string;
  iconName?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  description,
}) => {
  const cleanId = id.toLowerCase().trim();
  const gameSlug = cleanId === "2048" ? "game2048" : cleanId.replace(/\s+/g, "-");

  // Renders a giant beautiful abstract game board inside your original monitor frame
  const renderMiniGameIllustration = () => {
    switch (cleanId) {
      case "tic-tac-toe":
      case "tictactoe":
        return (
          /* FIXED: Removed raw border frames from individual cell blocks to make the layout seamless in dark mode */
          <div className="grid grid-cols-3 gap-2 w-36 h-36 p-3 rounded-[22px] bg-white/90 dark:bg-zinc-950/50 border border-violet-100/80 dark:border-violet-900/30 shadow-inner">
            <div className="flex items-center justify-center rounded-xl text-violet-500 dark:text-violet-400 font-black text-3xl">X</div>
            <div className="bg-zinc-100/60 dark:bg-zinc-900/30 rounded-xl" />
            <div className="flex items-center justify-center rounded-xl text-rose-400 dark:text-rose-400 font-black text-3xl">O</div>
            <div className="bg-zinc-100/60 dark:bg-zinc-900/30 rounded-xl" />
            <div className="flex items-center justify-center rounded-xl text-violet-500 dark:text-violet-400 font-black text-3xl">X</div>
            <div className="bg-zinc-100/60 dark:bg-zinc-900/30 rounded-xl" />
            <div className="bg-zinc-100/60 dark:bg-zinc-900/30 rounded-xl" />
            <div className="bg-zinc-100/60 dark:bg-zinc-900/30 rounded-xl" />
            <div className="flex items-center justify-center rounded-xl text-rose-400 dark:text-rose-400 font-black text-3xl">O</div>
          </div>
        );

      case "connect4":
      case "connect-4":
        return (
          <div className="grid grid-cols-4 gap-3 w-44 p-4 rounded-[22px] bg-white/80 dark:bg-zinc-950/40 border border-rose-100 dark:border-rose-900/30 shadow-inner justify-items-center">
            <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-900/50" />
            <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-900/50" />
            <div className="w-7 h-7 rounded-full bg-rose-400" />
            <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-900/50" />
            <div className="w-7 h-7 rounded-full bg-violet-400" />
            <div className="w-7 h-7 rounded-full bg-rose-400" />
            <div className="w-7 h-7 rounded-full bg-violet-400" />
            <div className="w-7 h-7 rounded-full bg-rose-400" />
          </div>
        );

      case "2048":
      case "game2048":
        return (
          <div className="grid grid-cols-3 gap-3 w-36 h-36 p-3.5 rounded-[22px] bg-white/80 dark:bg-zinc-950/40 border border-amber-100 dark:border-amber-900/30 shadow-inner">
            <div className="bg-zinc-100/90 dark:bg-zinc-800 text-sm font-black text-zinc-500 dark:text-zinc-400 flex items-center justify-center rounded-xl">2</div>
            <div className="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300 text-sm font-black flex items-center justify-center rounded-xl">4</div>
            <div className="bg-zinc-100/50 dark:bg-zinc-900/40 rounded-xl" />
            <div className="bg-zinc-100/50 dark:bg-zinc-900/40 rounded-xl" />
            <div className="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300 text-xs font-black flex items-center justify-center rounded-xl scale-105 shadow-sm">16</div>
            <div className="bg-zinc-100/50 dark:bg-zinc-900/40 rounded-xl" />
            <div className="bg-zinc-100/50 dark:bg-zinc-900/40 rounded-xl" />
            <div className="bg-zinc-100/50 dark:bg-zinc-900/40 rounded-xl" />
            <div className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200 text-sm font-black flex items-center justify-center rounded-xl">8</div>
          </div>
        );

      case "color-memory":
      case "colormemory":
        return (
          /* FIXED: Reconfigured transparent opacity scales so they stand out clearly against obsidian dark cards */
          <div className="grid grid-cols-2 gap-3.5 w-36 h-36 p-3.5 rounded-[24px] bg-white/80 dark:bg-zinc-950/40 border border-emerald-100 dark:border-emerald-900/30 shadow-inner">
            <div className="bg-rose-400/20 border-2 border-rose-200/60 dark:bg-rose-500/10 dark:border-rose-500/20 rounded-2xl" />
            <div className="bg-violet-400 border-2 border-transparent rounded-2xl shadow-sm scale-[1.03]" />
            <div className="bg-amber-400/20 border-2 border-amber-200/60 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-2xl" />
            <div className="bg-emerald-400/20 border-2 border-emerald-200/60 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-2xl" />
          </div>
        );

      case "slide-puzzle":
      case "slidepuzzle":
        return (
          <div className="grid grid-cols-3 gap-3 w-36 h-36 p-3.5 rounded-[22px] bg-white/80 dark:bg-zinc-950/40 border border-sky-100 dark:border-sky-900/30 shadow-inner">
            <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 text-sm font-bold flex items-center justify-center rounded-xl">1</div>
            <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 text-sm font-bold flex items-center justify-center rounded-xl">3</div>
            <div className="bg-violet-100 border border-violet-300 text-violet-700 dark:bg-violet-950/40 dark:border-violet-800 dark:text-violet-300 text-sm font-bold flex items-center justify-center rounded-xl">2</div>
            <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 text-sm font-bold flex items-center justify-center rounded-xl">4</div>
            <div className="bg-transparent rounded-xl" />
            <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 text-sm font-bold flex items-center justify-center rounded-xl">5</div>
            <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 text-sm font-bold flex items-center justify-center rounded-xl">7</div>
            <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 text-sm font-bold flex items-center justify-center rounded-xl">8</div>
            <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 text-sm font-bold flex items-center justify-center rounded-xl">6</div>
          </div>
        );

      case "wordle":
        return (
          <div className="flex flex-col gap-2.5 w-40 p-3 rounded-[22px] bg-white/80 dark:bg-zinc-950/40 border border-teal-100 dark:border-teal-900/30 shadow-inner">
            <div className="flex gap-1.5 justify-center">
              <div className="w-6 h-6 rounded-md bg-emerald-500 text-xs text-white font-black flex items-center justify-center">W</div>
              <div className="w-6 h-6 rounded-md bg-zinc-300 dark:bg-zinc-800 text-xs text-white font-black flex items-center justify-center">O</div>
              <div className="w-6 h-6 rounded-md bg-amber-500 text-xs text-white font-black flex items-center justify-center">R</div>
              <div className="w-6 h-6 rounded-md bg-zinc-300 dark:bg-zinc-800 text-xs text-white font-black flex items-center justify-center">D</div>
              <div className="w-6 h-6 rounded-md bg-zinc-300 dark:bg-zinc-800 text-xs text-white font-black flex items-center justify-center">S</div>
            </div>
            <div className="flex gap-1.5 justify-center opacity-40">
              <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-900" />
              <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-900" />
              <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-900" />
              <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-900" />
              <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-zinc-900" />
            </div>
          </div>
        );

      default:
        return <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />;
    }
  };

  const getStageBgColor = () => {
    switch (cleanId) {
      case "tic-tac-toe":
      case "tictactoe": return "bg-violet-50/70 border-violet-100/80 dark:bg-violet-950/10 dark:border-violet-900/30"; 
      case "connect4":
      case "connect-4": return "bg-rose-50/70 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/30";
      case "2048":
      case "game2048": return "bg-amber-50/70 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30";
      case "color-memory":
      case "colormemory": return "bg-emerald-50/70 border-emerald-100/80 dark:bg-emerald-950/10 dark:border-emerald-900/30"; 
      case "slide-puzzle":
      case "slidepuzzle": return "bg-sky-50/70 dark:bg-sky-950/10 border-sky-100 dark:border-sky-900/30";
      case "wordle": return "bg-teal-50/70 dark:bg-teal-950/10 border-teal-100 dark:border-teal-900/30";
      default: return "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800";
    }
  };

  return (
    <motion.article
      whileHover={{ scale: 1 }}
      className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_24px_48px_rgba(0,0,0,0.35)] hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Monitor screen window frame layout with the custom retro scanline layer overlay */}
        <div className={`relative w-full aspect-[16/10] rounded-2xl overflow-hidden border p-1.5 transition-colors duration-200 flex items-center justify-center group-hover:border-slate-400 dark:group-hover:border-slate-600 ${getStageBgColor()}`}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-25" />

          <motion.div
            className="relative z-10 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            whileHover={{ scale: 1.06, rotate: -0.5 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {renderMiniGameIllustration()}
          </motion.div>
        </div>

        {/* Premium console controller details located directly below the main monitor display window */}
        <div className="flex items-center justify-between mt-5 px-1 select-none">
          {/* Hardware Cross Directional Pad (D-Pad) */}
          <div className="relative w-7 h-7 flex items-center justify-center transition-transform duration-200 group-hover:scale-95">
            <div className="absolute w-7 h-2 rounded-sm bg-slate-300 dark:bg-slate-700" />
            <div className="absolute h-7 w-2 rounded-sm bg-slate-300 dark:bg-slate-700" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          </div>

          {/* 45-degree Angled Arcade Button Array */}
          <div className="grid grid-cols-2 gap-1 rotate-45 transition-transform duration-200 group-hover:scale-95">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>

        {/* Content text metadata container space */}
        <div className="mt-4 text-center px-1">
          <h3 className="pixel-font text-base font-black uppercase tracking-wide text-slate-900 dark:text-slate-50 transition-colors duration-200 group-hover:text-black dark:group-hover:text-white">
            {title}
          </h3>
          <p className="mt-2 text-[11px] font-sans font-semibold text-slate-500 dark:text-slate-400 tracking-wide leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <Link href={`/game/${gameSlug}`} className="block w-full mt-5">
        <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-100 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
          <span>Play Now</span>
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </button>
      </Link>
    </motion.article>
  );
};