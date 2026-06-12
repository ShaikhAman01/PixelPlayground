"use client";

import {
  Moon,
  Sun,
  User,
  Gamepad2,
  Coffee,
  Music2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MusicPlayer } from "../music/MusicPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../providers/ThemeProvider";
import Image from "next/image";
import { useState } from "react";

export const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<"play" | "chill">("play");
  const [musicExpanded, setMusicExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 select-none">
      <div
        className="
          max-w-[1280px]
          mx-auto
          rounded-3xl
          border border-white/15
          bg-white/10
          dark:bg-slate-950/20
          backdrop-blur-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        "
      >
        <div className="px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-2">

            {/* LEFT */}
            <div className="flex items-center shrink-0">
              <div
                className="
                  flex items-center gap-3
                  rounded-2xl
                  border border-white/20
                  bg-white/10
                  dark:bg-white/[0.03]
                  px-3 py-2
                  backdrop-blur-xl
                "
              >
                <Image
                  src="/logo/logo3.png"
                  alt="Pixel Playground"
                  width={180}
                  height={55}
                  className="h-9 sm:h-11 w-auto object-contain"
                  priority
                />

                <div className="leading-none hidden sm:block">
                  <div className="pixel-font text-base font-black tracking-[0.12em] uppercase text-[#0F2C75] dark:text-slate-100">
                    PIXEL
                  </div>

                  <div className="pixel-font text-[10px] tracking-[0.35em] uppercase text-[#0F2C75] dark:text-slate-300 mt-1">
                    PLAYGROUND
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER - MOBILE + DESKTOP */}
            <div className="flex flex-1 justify-center px-2 min-w-0">
              <div
                className="
                  flex items-center
                  rounded-2xl
                  border border-white/20
                  bg-white/10
                  dark:bg-white/[0.03]
                  p-1
                  backdrop-blur-xl
                "
              >
                <button
                  onClick={() => setMode("play")}
                  className={`
                    flex items-center gap-1.5
                    px-3 md:px-4
                    py-2
                    rounded-xl
                    text-xs md:text-sm
                    font-medium
                    transition-all
                    ${
                      mode === "play"
                        ? "bg-violet-500 text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-white/10"
                    }
                  `}
                >
                  <Gamepad2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Play</span>
                </button>

                <button
                  onClick={() => setMode("chill")}
                  className={`
                    flex items-center gap-1.5
                    px-3 md:px-4
                    py-2
                    rounded-xl
                    text-xs md:text-sm
                    font-medium
                    transition-all
                    ${
                      mode === "chill"
                        ? "bg-violet-500 text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-white/10"
                    }
                  `}
                >
                  <Coffee className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden md:inline">Chill</span>
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 shrink-0">

              {/* MUSIC */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setMusicExpanded((prev) => !prev);
                    setProfileExpanded(false);
                  }}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    border border-white/20
                    bg-white/10
                    dark:bg-white/[0.03]
                    backdrop-blur-xl
                    text-slate-600
                    dark:text-slate-300
                    hover:bg-white/20
                    dark:hover:bg-white/[0.08]
                    hover:text-slate-900
                    dark:hover:text-white
                    transition-all duration-200
                  "
                >
                  <Music2 className="h-4 w-4" />
                </motion.button>

                <AnimatePresence>
                  {musicExpanded && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.98,
                      }}
                      className="
                        absolute
                        right-0
                        top-14
                        w-[320px]
                        sm:w-[360px]
                        md:w-[420px]
                        z-50
                      "
                    >
                      <MusicPlayer />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* THEME DESKTOP ONLY */}
              <div className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    border border-white/20
                    bg-white/10
                    dark:bg-white/[0.03]
                    backdrop-blur-xl
                    text-slate-600
                    dark:text-slate-300
                    hover:bg-white/20
                    dark:hover:bg-white/[0.08]
                    hover:text-slate-900
                    dark:hover:text-white
                    transition-all duration-200
                  "
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </motion.button>
              </div>

              {/* PROFILE */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setProfileExpanded((prev) => !prev);
                    setMusicExpanded(false);
                  }}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    border border-white/20
                    bg-white/10
                    dark:bg-white/[0.03]
                    backdrop-blur-xl
                    text-slate-600
                    dark:text-slate-300
                    hover:bg-white/20
                    dark:hover:bg-white/[0.08]
                    hover:text-slate-900
                    dark:hover:text-white
                    transition-all duration-200
                  "
                >
                  <User className="h-4 w-4" />
                </motion.button>

                <AnimatePresence>
                  {profileExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="
                        absolute
                        right-0
                        top-14
                        w-56
                        overflow-hidden
                        rounded-2xl
                        border border-white/15
                        bg-white/80
                        dark:bg-slate-900/95
                        backdrop-blur-xl
                        shadow-xl
                        z-50
                      "
                    >
                      <div className="px-4 py-3 border-b border-slate-200/20 dark:border-slate-700/30">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Guest User
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Sign in coming soon
                        </p>
                      </div>

                      <button
                        onClick={toggleTheme}
                        className="
                          md:hidden
                          w-full
                          px-4
                          py-3
                          flex
                          items-center
                          justify-between
                          text-sm
                          text-slate-700
                          dark:text-slate-200
                          hover:bg-black/5
                          dark:hover:bg-white/5
                          transition-colors
                        "
                      >
                        <span>
                          {theme === "dark"
                            ? "Light Mode"
                            : "Dark Mode"}
                        </span>

                        {theme === "dark" ? (
                          <Sun className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Moon className="h-4 w-4" />
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