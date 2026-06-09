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

export const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  description,
}) => {
  // FIXED: Adjusted string parser to create standard kebab-case paths (e.g. slide-puzzle, color-memory)
  // Added standard 2048 conversion tracking override to match your filesystem layout name rules perfectly
  const cleanId = id.toLowerCase().trim();
  const gameSlug = cleanId === "2048" ? "game2048" : cleanId.replace(/\s+/g, "-");

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="group relative overflow-hidden rounded-[32px] border border-white/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/35 backdrop-blur-xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-all duration-300"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-400/10 via-transparent to-pink-400/10 pointer-events-none" />

      {/* Preview */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#2B1B54] to-[#140F2D] p-2">
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-40" />

        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {/* Asset matches compact name tracking mapping */}
          <Image
            src={`/previews/${cleanId.replace(/\s+/g, "")}.png`}
            alt={`${title} Preview`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>

      {/* Controller Deck */}
      <div className="flex items-center justify-between mt-5 px-1 select-none">
        {/* D-Pad */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute w-8 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
          <div className="absolute h-8 w-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
          <div className="absolute w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 rotate-45">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 text-center">
        <h3 className="pixel-font text-lg font-black uppercase tracking-wide text-[#32354A] dark:text-indigo-100">
          {title}
        </h3>
        <p className="mt-2 text-xs font-mono text-slate-500 dark:text-indigo-200/60 tracking-wide uppercase">
          {description}
        </p>
      </div>

      {/* CTA */}
      <Link href={`/game/${gameSlug}`} className="block w-full mt-5">
        <button className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 active:scale-[0.98] text-white font-bold text-xs py-3 px-4 uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 cursor-pointer">
          <span>Play Now</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </Link>
    </motion.article>
  );
};