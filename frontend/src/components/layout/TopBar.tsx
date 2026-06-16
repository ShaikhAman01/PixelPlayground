"use client";

import { Moon, Sun, User, Gamepad2, Coffee, Music2 } from "lucide-react";
import { MusicPlayer } from "../music/MusicPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../providers/ThemeProvider";
import { useMode } from "../providers/ModeProvider";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export const TopBar = () => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { mode, setMode } = useMode();
  const [musicExpanded, setMusicExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMusicExpanded(false);
        setProfileExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const isInsideGamePage = pathname?.startsWith("/game/");
  const isChillMode = mode === "chill";
  const showAllOperators = !isChillMode || isInsideGamePage;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 select-none pointer-events-none">
      <div
        ref={containerRef}
        className="max-w-[1280px] mx-auto flex items-center justify-between w-full relative"
      >
        <div className="flex items-center shrink-0 pointer-events-auto">
          <Link
            href="/"
            className="transition-transform duration-200 active:scale-[0.98] block"
          >
            <Image
              src="/logo/logo3.png"
              alt="Pixel Playground Logo"
              width={240}
              height={64}
              className="h-14 sm:h-16 w-auto object-contain transition-all duration-300"
              priority
            />
          </Link>
        </div>

        {/* ================= CENTERED: MODE SWITCH CAPSULE (NOW TRULY FIXED) ================= */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center pointer-events-auto z-10">
          <AnimatePresence mode="wait">
            {!isInsideGamePage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="
                  relative
                  flex items-center
                  rounded-xl sm:rounded-2xl
                  border border-black/5 dark:border-white/10
                  bg-white/60 dark:bg-slate-950/40
                  backdrop-blur-xl
                  p-1
                  shadow-md
                "
              >
                <button
                  onClick={() => setMode("play")}
                  className={`
                    relative
                    flex items-center gap-2
                    px-4 sm:px-5 py-2
                    rounded-lg sm:rounded-xl
                    text-xs sm:text-sm
                    font-extrabold tracking-wider uppercase
                    transition-colors duration-200
                    cursor-pointer z-10
                    ${mode === "play" ? "text-slate-900" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}
                  `}
                >
                  {mode === "play" && (
                    <motion.div
                      layoutId="capsule-mode-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-lg sm:rounded-xl bg-white border border-black/5 shadow-sm"
                    />
                  )}
                  <Gamepad2 className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10 hidden sm:block">Play</span>
                </button>

                <button
                  onClick={() => setMode("chill")}
                  className={`
                    relative
                    flex items-center gap-2
                    px-4 sm:px-5 py-2
                    rounded-lg sm:rounded-xl
                    text-xs sm:text-sm
                    font-extrabold tracking-wider uppercase
                    transition-colors duration-200
                    cursor-pointer z-10
                    ${mode === "chill" ? "text-slate-900 dark:text-zinc-950" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"}
                  `}
                >
                  {mode === "chill" && (
                    <motion.div
                      layoutId="capsule-mode-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-lg sm:rounded-xl bg-white border border-black/5 shadow-sm"
                    />
                  )}
                  <Coffee className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10 hidden sm:block">Chill</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= RIGHT SIDE: OPERATORS MANAGEMENT TREE ================= */}
        <div className="flex items-center shrink-0 pointer-events-auto ml-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Music Button - Conditional */}
            {showAllOperators && (
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
                    rounded-xl border transition-all duration-200 cursor-pointer shadow-md
                    ${
                      musicExpanded
                        ? "border-black/20 bg-white/80 text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white"
                        : "border-black/5 dark:border-white/5 bg-white/60 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white"
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
            )}

            {/* Theme Changer - Always Persistent */}
            <div className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={toggleTheme}
                className="
                  flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center
                  rounded-xl border border-black/5 dark:border-white/5
                  bg-white/60 dark:bg-slate-950/40
                  text-slate-700 dark:text-slate-300
                  hover:bg-white/80 dark:hover:bg-white/[0.06]
                  hover:text-slate-900 dark:hover:text-white
                  transition-all duration-200 cursor-pointer shadow-md
                "
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-700" />
                )}
              </motion.button>
            </div>

            {/* Profile Button - Conditional */}
            {showAllOperators && (
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
                    rounded-xl border transition-all duration-200 cursor-pointer shadow-md
                    ${
                      profileExpanded
                        ? "border-black/20 bg-white/80 text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white"
                        : "border-black/5 dark:border-white/5 bg-white/60 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white"
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
                        border border-slate-200 dark:border-slate-800
                        bg-white dark:bg-slate-900
                        shadow-2xl
                        z-50
                      "
                    >
                      <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">
                          Profile Context
                        </p>
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
                          <div className="flex items-center gap-1 text-amber-500 font-mono text-[10px]">
                            <Sun className="h-3.5 w-3.5" /> LIGHT
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-700 font-mono text-[10px]">
                            <Moon className="h-3.5 w-3.5" /> DARK
                          </div>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};