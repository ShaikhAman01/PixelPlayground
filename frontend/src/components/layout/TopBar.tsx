"use client";

import {
  Moon,
  Sun,
  Volume2,
  Users,
} from "lucide-react";

import { GlassPanel } from "../ui/GlassPanel";
import { MusicPlayer } from "../music/MusicPlayer";
import { useTheme } from "../providers/ThemeProvider";

export const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between px-8 py-6">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="grid grid-cols-2 gap-1">
          <div className="h-3 w-3 rounded-sm bg-violet-400" />
          <div className="h-3 w-3 rounded-sm bg-sky-400" />
          <div className="h-3 w-3 rounded-sm bg-pink-400" />
          <div className="h-3 w-3 rounded-sm bg-emerald-400" />
        </div>

        <div>
          <h1 className="text-title font-[family:var(--font-pixel)] text-3xl text-slate-700 transition-colors duration-300 dark:text-slate-200">
            PixelPlayground
          </h1>

          <p className="text-body text-sm text-slate-400 dark:text-slate-400">
            cozy mini games
          </p>
        </div>
      </div>

      {/* Music */}
      <MusicPlayer />

      {/* Icons */}
      <div className="flex items-center gap-4">
        <button
          className="topbar-btn flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl transition hover:scale-[1.03] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <Volume2 className="topbar-icon h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="topbar-btn flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl transition hover:scale-[1.03] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="topbar-icon h-5 w-5 text-slate-600" />
          )}
        </button>

        <button
          className="topbar-btn flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl transition hover:scale-[1.03] dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
        >
          <Users className="topbar-icon h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
    </div>
  );
};