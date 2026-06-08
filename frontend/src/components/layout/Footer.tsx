"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="relative z-10 w-full max-w-[1200px] mx-auto px-16 py-12 select-none bg-transparent">
      
      {/* Upper Content Layer */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#32354A]/10 dark:border-indigo-500/10 items-start">
        
        {/* Brand Information Column */}
        <div className="md:col-span-5 flex flex-col items-start text-left">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo/logo3.png" 
              alt="Pixel Playground Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <div className="leading-none">
              {/* FIXED: Switched to deep slate text for light mode, white for dark mode */}
              <span className="pixel-font text-lg font-black tracking-widest text-[#32354A] dark:text-white uppercase block">
                PIXEL
              </span>
              <span className="text-[11px] font-bold tracking-widest text-[#4A4E69] dark:text-indigo-200 uppercase block mt-1">
                PLAYGROUND
              </span>
            </div>
          </div>
          {/* FIXED: Dynamic color scaling for readability over bright light clouds */}
          <p className="mt-4 max-w-xs text-xs font-semibold leading-relaxed text-[#4A4E69]/90 dark:text-indigo-200/60">
            A minimalist, cozy corner of the web built for peaceful breaks, dreamy retro visuals, and late-night gaming sessions. Play, relax, and repeat.
          </p>
        </div>

        {/* Navigation Link Columns */}
        <div className="md:col-span-7 grid grid-cols-3 gap-6 w-full text-left">
          {/* Column A: Arcade Hub */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4A4E69]/50 dark:text-white/40">
              Arcade Hub
            </span>
            <Link href="/game/tictactoe" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Tic Tac Toe
            </Link>
            <Link href="/game/2048" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Game 2048
            </Link>
            <Link href="/game/wordle" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Wordle
            </Link>
          </div>

          {/* Column B: Puzzle Room */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4A4E69]/50 dark:text-white/40">
              Puzzle Room
            </span>
            <Link href="/game/connect4" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Connect 4
            </Link>
            <Link href="/game/colormemory" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Color Memory
            </Link>
            <Link href="/game/slidepuzzle" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Slide Puzzle
            </Link>
          </div>

          {/* Column C: Legal / Support */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#4A4E69]/50 dark:text-white/40">
              Community
            </span>
            <Link href="/about" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              About Room
            </Link>
            <Link href="/privacy" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Privacy Rules
            </Link>
            <Link href="/terms" className="text-xs font-bold text-[#32354A] hover:text-violet-600 dark:text-white dark:hover:text-pink-200 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>

      </div>

      {/* Lower Content Layer */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
        
        {/* Left: Tagline Context */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#4A4E69]/70 dark:text-indigo-300/50">
          <span>🎮</span>
          <span>Personal Sandbox Environment v1.0</span>
        </div>

        {/* Center: Social Icons */}
        <div className="flex items-center gap-7 text-[#32354A] dark:text-white">
          <Link 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-violet-600 dark:hover:text-pink-200 transition-all duration-200 transform hover:scale-110"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </Link>

          <Link 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-violet-600 dark:hover:text-pink-200 transition-all duration-200 transform hover:scale-110"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </Link>
        </div>

        {/* Right: Copyright Metadata */}
        <div className="text-center md:text-right font-sans leading-normal">
          <p className="text-xs font-bold text-[#32354A] dark:text-white tracking-wide">
            © {new Date().getFullYear()} Pixel Playground
          </p>
          <p className="text-[10px] font-semibold text-[#4A4E69]/70 dark:text-indigo-300/50 tracking-wider uppercase mt-1">
            All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};