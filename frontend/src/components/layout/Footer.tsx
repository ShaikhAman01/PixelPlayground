"use client";

import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 pb-10 select-none font-sans">
      {/* NEW STRUCTURE: Added a matching frosted glass panel container. 
        Lifts content away from cloud graphics, matching the cards and topbar perfectly.
      */}
      <div className="
        w-full
        rounded-3xl
        border border-slate-200/80 dark:border-slate-800
        bg-white/70 dark:bg-slate-900/75
        backdrop-blur-xl
        p-6 sm:p-8 md:p-10
        shadow-[0_8px_32px_rgba(15,23,42,0.03)]
        dark:shadow-[0_16px_48px_rgba(0,0,0,0.25)]
        transition-all duration-300
      ">
        
        {/* Main Grid Split */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 pb-8 border-b border-slate-300 dark:border-slate-800">
          
          {/* Left Column: Core Brand */}
          <div className="md:col-span-5 flex flex-col items-start justify-center">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/logo3.png"
                alt="Pixel Playground Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <div>
                <h3 className="pixel-font text-sm font-black tracking-widest text-slate-950 dark:text-slate-50 uppercase">
                  PIXEL PLAYGROUND
                </h3>
                <p className="text-[10px] mt-0.5 text-slate-800 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                  cozy retro arcade
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
              Cozy browser games designed for quick breaks and peaceful gaming sessions.
            </p>
          </div>

          {/* Right Column: Directory Navigation */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Arcade Category */}
            <div className="flex flex-col gap-3">
              <span className="pixel-font text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-400 font-black">
                Arcade
              </span>
              <Link href="/game/tictactoe" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                Tic Tac Toe
              </Link>
              <Link href="/game/game2048" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                2048
              </Link>
              <Link href="/game/wordle" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                Wordle
              </Link>
            </div>

            {/* Puzzles Category */}
            <div className="flex flex-col gap-3">
              <span className="pixel-font text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-400 font-black">
                Puzzles
              </span>
              <Link href="/game/connect4" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                Connect 4
              </Link>
              <Link href="/game/colormemory" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                Color Memory
              </Link>
              <Link href="/game/slidepuzzle" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                Slide Puzzle
              </Link>
            </div>

            {/* Community Category */}
            <div className="flex flex-col gap-3">
              <span className="pixel-font text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-400 font-black">
                Community
              </span>
              <Link href="/about" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors">
                Terms
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Ground Row */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <p className="text-xs font-black text-slate-950 dark:text-slate-50">
            © {new Date().getFullYear()} Pixel Playground
          </p>
          <p className="text-[10px] text-slate-700 dark:text-slate-400 uppercase tracking-widest font-extrabold">
            All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};