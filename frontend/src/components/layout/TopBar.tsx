"use client";

import { Moon, Sun, User, Gamepad2, Coffee, Music2 } from "lucide-react";
import { MusicPlayer } from "../music/MusicPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../providers/ThemeProvider";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<"play" | "chill">("play");
  const [musicExpanded, setMusicExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMusicExpanded(false);
        setProfileExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 select-none">
      <div
        ref={containerRef}
        className="
          max-w-[1280px]
          mx-auto
          rounded-2xl sm:rounded-3xl
          border border-white/20 dark:border-white/10
          bg-white/[0.07] dark:bg-slate-950/[0.12]
          backdrop-blur-xl
          shadow-[0_8px_32px_rgba(15,23,42,0.04)]
          dark:shadow-[0_16px_48px_rgba(0,0,0,0.2)]
          transition-all duration-300
        "
      >
        <div className="px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* ================= LEFT BRAND LOGO ================= */}
            <div className="flex items-center shrink-0">
              <Link
                href="/"
                className="
                  flex items-center gap-2.5
                  rounded-xl sm:rounded-2xl
                  border border-white/10 dark:border-white/5
                  bg-white/10 dark:bg-white/[0.02]
                  px-3 py-1.5
                  transition-all duration-200
                  hover:bg-white/20 dark:hover:bg-white/[0.06]
                  active:scale-[0.98]
                "
              >
                <Image
                  src="/logo/logo3.png"
                  alt="Pixel Playground Logo"
                  width={160}
                  height={44}
                  className="h-8 sm:h-10 lg:h-12 w-auto object-contain transition-all duration-300"
                  priority
                />
                {/* PRODUCTION CONTRAST FIX: Swapped to text-slate-950 and dark:text-indigo-50/90 for clean readability */}
                <div className="leading-none hidden sm:block ml-1">
                  <div className="pixel-font text-xs sm:text-sm lg:text-base font-black tracking-[0.12em] uppercase text-slate-950 dark:text-indigo-50/90">
                    PIXEL
                  </div>
                  <div className="pixel-font text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.22em] lg:tracking-[0.28em] uppercase text-slate-700 dark:text-indigo-200/70 mt-1">
                    PLAYGROUND
                  </div>
                </div>
              </Link>
            </div>

            {/* ================= CENTER SWITCHER ================= */}
            <div className="flex flex-1 justify-center px-1 min-w-0">
              <div
                className="
                  relative
                  flex items-center
                  rounded-xl sm:rounded-2xl
                  border border-white/10 dark:border-white/5
                  bg-black/[0.04] dark:bg-black/[0.15]
                  p-0.5 sm:p-1
                "
              >
                <button
                  onClick={() => setMode("play")}
                  className={`
                    relative
                    flex items-center gap-1.5
                    px-3.5 sm:px-5 py-1.5 sm:py-2
                    rounded-lg sm:rounded-xl
                    text-xs sm:text-sm
                    font-bold tracking-wide
                    transition-colors duration-200
                    cursor-pointer z-10
                    ${mode === "play" ? "text-slate-900 dark:text-white" : "text-slate-700/70 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}
                  `}
                >
                  {mode === "play" && (
                    <motion.div
                      layoutId="capsule-mode-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg sm:rounded-xl bg-white/90 dark:bg-white/15 border border-white/40 dark:border-white/10 shadow-sm"
                    />
                  )}
                  <Gamepad2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10" />
                  <span className="hidden sm:inline relative z-10">Play</span>
                </button>

                <button
                  onClick={() => setMode("chill")}
                  className={`
                    relative
                    flex items-center gap-1.5
                    px-3.5 sm:px-5 py-1.5 sm:py-2
                    rounded-lg sm:rounded-xl
                    text-xs sm:text-sm
                    font-bold tracking-wide
                    transition-colors duration-200
                    cursor-pointer z-10
                    ${mode === "chill" ? "text-slate-900 dark:text-white" : "text-slate-700/70 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}
                  `}
                >
                  {mode === "chill" && (
                    <motion.div
                      layoutId="capsule-mode-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 rounded-lg sm:rounded-xl bg-white/90 dark:bg-white/15 border border-white/40 dark:border-white/10 shadow-sm"
                    />
                  )}
                  <Coffee className="h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10" />
                  <span className="hidden sm:inline relative z-10">Chill</span>
                </button>
              </div>
            </div>

            {/* ================= RIGHT ICON OPERATORS ================= */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              <div className="static sm:relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setMusicExpanded(!musicExpanded);
                    setProfileExpanded(false);
                  }}
                  className={`
                    flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center
                    rounded-xl border transition-all duration-200 cursor-pointer
                    ${musicExpanded 
                      ? "border-white/40 bg-white/30 text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" 
                      : "border-white/10 dark:border-white/5 bg-white/10 dark:bg-white/[0.02] text-slate-700/80 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white"
                    }
                  `}
                >
                  <Music2 className="h-4 w-4" />
                </motion.button>

                <AnimatePresence>
                  {musicExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="
                        absolute
                        left-3 right-3 sm:left-auto sm:right-0
                        top-16 sm:top-14
                        w-[calc(100%-24px)] sm:w-[360px] md:w-[420px]
                        z-50
                        drop-shadow-2xl
                      "
                    >
                      <MusicPlayer />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={toggleTheme}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl border border-white/10 dark:border-white/5
                    bg-white/10 dark:bg-white/[0.02]
                    text-slate-700/80 dark:text-slate-300
                    hover:bg-white/20 dark:hover:bg-white/[0.06]
                    hover:text-slate-900 dark:hover:text-white
                    transition-all duration-200 cursor-pointer
                  "
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </motion.button>
              </div>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setProfileExpanded(!profileExpanded);
                    setMusicExpanded(false);
                  }}
                  className={`
                    flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center
                    rounded-xl border transition-all duration-200 cursor-pointer
                    ${profileExpanded 
                      ? "border-white/40 bg-white/30 text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white" 
                      : "border-white/10 dark:border-white/5 bg-white/10 dark:bg-white/[0.02] text-slate-700/80 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white"
                    }
                  `}
                >
                  <User className="h-4 w-4" />
                </motion.button>

                <AnimatePresence>
                  {profileExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="
                        absolute
                        right-0
                        top-13 sm:top-14
                        w-56
                        overflow-hidden
                        rounded-xl sm:rounded-2xl
                        border border-white/20 dark:border-slate-800
                        bg-white/95 dark:bg-slate-900/95
                        backdrop-blur-xl
                        shadow-2xl
                        z-50
                      "
                    >
                      <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">Profile Context</p>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                          Guest Arcade User
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                          Cloud saves coming soon
                        </p>
                      </div>

                      <button
                        onClick={toggleTheme}
                        className="
                          md:hidden
                          w-full
                          px-4 py-3.5
                          flex
                          items-center
                          justify-between
                          text-xs font-bold uppercase tracking-wider
                          text-slate-600 dark:text-slate-300
                          hover:bg-slate-50 dark:hover:bg-slate-800
                          transition-colors cursor-pointer
                        "
                      >
                        <span>Display Theme</span>
                        {theme === "dark" ? (
                          <div className="flex items-center gap-1 text-amber-500 font-mono text-[10px]"><Sun className="h-3.5 w-3.5" /> LIGHT</div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-700 font-mono text-[10px]"><Moon className="h-3.5 w-3.5" /> DARK</div>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};