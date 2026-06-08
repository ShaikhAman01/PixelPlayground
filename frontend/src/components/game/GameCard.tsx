"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  color?: string;
  iconName?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ id, title }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full bg-white/80 dark:bg-slate-900/40 border border-white/60 dark:border-white/5 rounded-[32px] p-5 shadow-md dark:shadow-xl flex flex-col items-center backdrop-blur-sm transition-all duration-300"
    >
      {/* 1. EMULATOR SCREEN PREVIEW */}
      <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#2B1B54] to-[#140F2D] p-2.5 shadow-inner border-[3px] border-[#3F365E]/60 dark:border-[#2C244C]/80 overflow-hidden group">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-40" />
        
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-slate-950/40">
          <Image
            src={`/previews/${id.toLowerCase().replace(/\s+/g, "")}.png`}
            alt={`${title} Preview Grid`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* 2. D-PAD & HARDWARE DECK */}
      <div className="w-full flex items-center justify-between mt-5 px-1 select-none pointer-events-none">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute w-8 h-2.5 bg-slate-300 dark:bg-slate-700/80 rounded-sm transition-colors duration-300" />
          <div className="absolute h-8 w-2.5 bg-slate-300 dark:bg-slate-700/80 rounded-sm transition-colors duration-300" />
          <div className="absolute w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full transition-colors duration-300" />
        </div>

        <div className="relative w-8 h-8 grid grid-cols-2 gap-1.5 rotate-45">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400 dark:bg-pink-500/90 shadow-sm transition-colors duration-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400 dark:bg-pink-500/90 shadow-sm transition-colors duration-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400 dark:bg-pink-500/90 shadow-sm transition-colors duration-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400 dark:bg-pink-500/90 shadow-sm transition-colors duration-300" />
        </div>
      </div>

      {/* 3. GAME TITLE */}
      <h3 className="pixel-font text-lg font-black tracking-wide text-[#32354A] dark:text-indigo-200 uppercase mt-4 transition-colors duration-300">
        {title}
      </h3>

      {/* 4. PLAY NOW CTA */}
      <Link href={`/game/${id.toLowerCase().replace(/\s+/g, "")}`} className="w-full mt-4">
        <button className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 dark:from-violet-600 dark:to-indigo-600 dark:hover:from-violet-700 dark:hover:to-indigo-700 active:scale-95 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 group">
          <span className="flex items-center justify-center text-sm">按</span>
          <span className="flex items-center justify-center">Play Now</span>
          <span className="flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1 font-mono text-sm leading-none h-full">
            →
          </span>
        </button>
      </Link>
    </motion.div>
  );
};