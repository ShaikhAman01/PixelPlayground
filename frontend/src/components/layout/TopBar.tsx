"use client";

import { Moon, Sun, Volume2 } from "lucide-react";
import { MusicPlayer } from "../music/MusicPlayer";
import { motion } from "framer-motion";
import { useState } from "react";

export const TopBar = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <header className="w-full flex items-center justify-between gap-8 z-20">
      {/* Brand Logo Wrapper */}
      <div className="flex items-center gap-3 bg-white/40 border border-white/60 px-4 py-2 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] backdrop-blur-md">
        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
          <div className="rounded-[3px] bg-violet-400" />
          <div className="rounded-[3px] bg-pink-400" />
          <div className="rounded-[3px] bg-sky-400" />
          <div className="rounded-[3px] bg-amber-400" />
        </div>
        <div className="flex flex-col">
          <span className="font-[family:var(--font-pixel)] text-sm font-bold tracking-wider text-slate-700 uppercase">
            Pixel
          </span>
          <span className="text-[10px] text-violet-500 uppercase tracking-widest font-semibold -mt-0.5">
            Playground
          </span>
        </div>
      </div>

      {/* Centered Integrated Media Hub */}
      <div className="flex-1 max-w-lg">
        <MusicPlayer />
      </div>

      {/* Contextual System Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02, y: -0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDark(!isDark)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 bg-white/50 text-slate-600 hover:text-slate-800 hover:bg-white/80 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-md"
          aria-label="Toggle Atmosphere Mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>
      </div>
    </header>
  );
};