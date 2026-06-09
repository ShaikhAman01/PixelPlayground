"use client";

import Image from "next/image";
import Link from "next/link";
import { games } from "@/data/games";

export const Footer = () => {
  return (
    <footer className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-12 select-none">
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#32354A]/10 dark:border-indigo-500/10">
        {/* Brand */}
        <div className="md:col-span-5 flex flex-col items-start">
          <div className="flex items-center gap-3.5">
            <Image
              src="/logo/logo3.png"
              alt="Pixel Playground"
              width={42}
              height={42}
              className="object-contain"
            />

            <div>
              <h3 className="pixel-font text-base font-black tracking-widest text-[#0F2C75] dark:text-white">
                PIXEL PLAYGROUND
              </h3>

              <p className="text-[11px] mt-1 text-[#4A4E69]/70 dark:text-indigo-200/60 font-mono">
                cozy retro arcade
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#4A4E69] dark:text-indigo-200/60">
            A collection of cozy browser games designed for quick breaks,
            peaceful evenings and late-night gaming sessions.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <span className="rounded-xl bg-white/40 dark:bg-indigo-950/30 px-3 py-1 text-xs">
              🎮 {games.length} Games
            </span>

            <span className="rounded-xl bg-white/40 dark:bg-indigo-950/30 px-3 py-1 text-xs">
              ✨ Cozy
            </span>

            <span className="rounded-xl bg-white/40 dark:bg-indigo-950/30 px-3 py-1 text-xs">
              🎵 Music
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div className="flex flex-col gap-3">
            <span className="pixel-font text-[10px] uppercase tracking-wider text-[#4A4E69]/60 dark:text-indigo-400/50">
              Arcade
            </span>

            <Link href="/game/tictactoe" className="text-xs font-bold hover:text-violet-600">
              Tic Tac Toe
            </Link>

            <Link href="/game/game2048" className="text-xs font-bold hover:text-violet-600">
              2048
            </Link>

            <Link href="/game/wordle" className="text-xs font-bold hover:text-violet-600">
              Wordle
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="pixel-font text-[10px] uppercase tracking-wider text-[#4A4E69]/60 dark:text-indigo-400/50">
              Puzzles
            </span>

            <Link href="/game/connect4" className="text-xs font-bold hover:text-violet-600">
              Connect 4
            </Link>

            <Link href="/game/colormemory" className="text-xs font-bold hover:text-violet-600">
              Color Memory
            </Link>

            <Link href="/game/slidepuzzle" className="text-xs font-bold hover:text-violet-600">
              Slide Puzzle
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <span className="pixel-font text-[10px] uppercase tracking-wider text-[#4A4E69]/60 dark:text-indigo-400/50">
              Community
            </span>

            <Link href="/about" className="text-xs font-bold hover:text-violet-600">
              About
            </Link>

            <Link href="/privacy" className="text-xs font-bold hover:text-violet-600">
              Privacy
            </Link>

            <Link href="/terms" className="text-xs font-bold hover:text-violet-600">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
        <div className="flex items-center gap-2 text-xs text-[#4A4E69]/70 dark:text-indigo-400/40">
          <span>🎮</span>
          <span>Personal Sandbox Environment v1.0</span>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs font-bold text-[#0F2C75] dark:text-indigo-100">
            © {new Date().getFullYear()} Pixel Playground
          </p>

          <p className="text-[10px] mt-1 text-[#4A4E69]/70 dark:text-indigo-400/40 uppercase tracking-wider">
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};