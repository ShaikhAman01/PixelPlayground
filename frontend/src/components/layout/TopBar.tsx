"use client";

import { Moon, Sun, Users } from "lucide-react";
import { MusicPlayer } from "../music/MusicPlayer";
import { motion } from "framer-motion";
import { useTheme } from "../providers/ThemeProvider";

export const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full flex items-center justify-between gap-8 z-20">
 {/* Brand Logo Wrapper */}
<div className="flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 px-4 py-2 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] backdrop-blur-md transition-colors duration-300">
  <div className="grid grid-cols-2 gap-0.5 w-5 h-5 shrink-0">
    <div className="rounded-[3px] bg-violet-400" />
    <div className="rounded-[3px] bg-pink-400" />
    <div className="rounded-[3px] bg-sky-400" />
    <div className="rounded-[3px] bg-amber-400" />
  </div>

  <div className="flex flex-col leading-none">
  <span className="pixel-font text-sm sm:text-base font-bold tracking-wide text-slate-700 dark:text-slate-100 uppercase">
    Pixel
  </span>

  <span className="pixel-font text-[11px] text-violet-500 dark:text-violet-400 uppercase tracking-[0.2em] font-semibold">
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
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-900/60 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-md"
          aria-label="Multiplayer Hub Connection"
        >
          <Users className="h-4 w-4" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/80 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white/80 dark:hover:bg-slate-900/60 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-md"
          aria-label="Toggle Atmosphere Mode"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </motion.button>
      </div>
    </header>
  );
};