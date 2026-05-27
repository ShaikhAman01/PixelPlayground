"use client";

import {
  Moon,
  Volume2,
  Users,
} from "lucide-react";

import { GlassPanel } from "../ui/GlassPanel";
import { MusicPlayer } from "../music/MusicPlayer";

export const TopBar = () => {
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
          <h1 className="font-[family:var(--font-pixel)] text-3xl text-slate-700">
            PixelPlayground
          </h1>

          <p className="text-sm text-slate-400">
            cozy mini games
          </p>
        </div>
      </div>

      {/* Music */}
     <MusicPlayer />

      {/* Icons */}
      <div className="flex items-center gap-4">
        {[Volume2, Moon, Users].map(
          (Icon, i) => (
            <button
              key={i}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-xl transition hover:scale-[1.03]"
            >
              <Icon className="h-5 w-5 text-slate-600" />
            </button>
          )
        )}
      </div>
    </div>
  );
};