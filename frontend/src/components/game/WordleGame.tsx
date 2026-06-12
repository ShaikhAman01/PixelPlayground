"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GameShell } from "./GameShell";
import { words } from "@/data/wordleWords";
import { useWordleStore } from "@/store/wordle.store";
import { validWords } from "@/data/validWords";

const keyboard = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export const WordleGame = () => {
  const { solution, guesses, currentGuess, status, setState } = useWordleStore();
  const [isShaking, setIsShaking] = useState(false);
  const [timeToNext, setTimeToNext] = useState("");

  // Calculate the standard locked daily seed word
  const dailyWord = useMemo(() => {
    if (typeof window === "undefined") return words[0];
    const timestampSeed = new Date().setHours(0,0,0,0);
    const index = Math.floor(timestampSeed / 86400000);
    return words[index % words.length];
  }, []);

  // Compute countdown timer to midnight for the lockout screen
  useEffect(() => {
    if (status === "PLAYING") return;

    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeToNext(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (solution || !dailyWord) return;
    setState({ solution: dailyWord });
  }, [solution, dailyWord, setState]);

  const triggerShakeEffect = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  }, []);

  const handleKeyInput = useCallback((rawKey: string) => {
    if (status !== "PLAYING" || !solution) return;
    const key = rawKey.toUpperCase();

    if (key === "ENTER") {
      if (currentGuess.length !== 5 || !validWords.has(currentGuess.toUpperCase())) {
        triggerShakeEffect();
        return;
      }

      const next = [...guesses, currentGuess];
      if (currentGuess === solution) {
        setState({ guesses: next, currentGuess: "", status: "WON" });
        return;
      }
      if (next.length >= 6) {
        setState({ guesses: next, currentGuess: "", status: "LOST" });
        return;
      }
      setState({ guesses: next, currentGuess: "" });
      return;
    }

    if (key === "BACKSPACE" || key === "BACK") {
      setState({ currentGuess: currentGuess.slice(0, -1) });
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      if (currentGuess.length >= 5) return;
      setState({ currentGuess: currentGuess + key });
    }
  }, [currentGuess, guesses, solution, status, setState, triggerShakeEffect]);

  useEffect(() => {
    const handlePhysicalKey = (e: KeyboardEvent) => {
      handleKeyInput(e.key);
    };
    window.addEventListener("keydown", handlePhysicalKey);
    return () => window.removeEventListener("keydown", handlePhysicalKey);
  }, [handleKeyInput]);

  const getTileClass = (letter: string, index: number) => {
    if (!solution) return "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-transparent";
    
    if (solution[index] === letter) {
      return "bg-emerald-500 text-white border-transparent font-black shadow-md";
    }
    if (solution.includes(letter)) {
      return "bg-amber-500 text-white border-transparent font-bold";
    }
    return "bg-zinc-300 border-transparent text-white dark:bg-zinc-800 dark:text-zinc-500 opacity-70";
  };

  return (
    // Pass undefined to onRestart when finished to natively disable GameShell's reset hooks
    <GameShell title="Wordle" onRestart={status === "PLAYING" ? () => {} : undefined}>
      <div className="flex flex-col items-center justify-center w-full max-w-sm px-2 select-none voices-flat pb-2">
        
        {/* Core Matrix Board Wrapper */}
        <div className="relative grid grid-rows-6 gap-2 p-4 rounded-[28px] bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 w-full justify-center shadow-sm backdrop-blur-md">
          {Array.from({ length: 6 }).map((_, rowIndex) => {
            const isCurrentRow = rowIndex === guesses.length;
            const guess = guesses[rowIndex] ?? (isCurrentRow ? currentGuess : "");

            return (
              <motion.div 
                key={rowIndex} 
                animate={isCurrentRow && isShaking ? { x: [-4, 4, -4, 4, 0], transition: { duration: 0.3 } } : {}}
                className="flex gap-2"
              >
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  const letter = guess[colIndex];
                  const submitted = rowIndex < guesses.length;

                  return (
                    <div
                      key={colIndex}
                      className={`flex w-14 h-14 sm:w-16 sm:h-16 items-center justify-center rounded-2xl border text-xl font-black transition-all duration-300 shadow-sm ${
                        submitted
                          ? getTileClass(letter, colIndex)
                          : letter
                            ? "border-zinc-400 bg-white text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white scale-[1.02]"
                            : "border-zinc-200/80 bg-white/40 dark:border-zinc-800/80 dark:bg-zinc-900/20 text-zinc-800 dark:text-zinc-100"
                      }`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}

          {/* Locked-out Day Overlay Screen */}
          {status !== "PLAYING" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-zinc-950/10 dark:bg-zinc-950/30 backdrop-blur-md rounded-[26px] flex flex-col items-center justify-center z-20 p-4 text-center"
            >
              <div className="bg-white/95 dark:bg-zinc-900/95 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-[220px]">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {status === "WON" ? "Masterful" : "Unlucky"}
                </p>
                <p className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 mt-1">
                  The word was: <span className="font-mono text-emerald-600 uppercase tracking-wider">{solution}</span>
                </p>
                
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Next Wordle In</p>
                  <p className="text-lg font-black font-mono text-zinc-950 dark:text-white tracking-wide mt-0.5">{timeToNext}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Keyboard Deck */}
        <div className={`mt-6 space-y-2 w-full px-1 transition-opacity ${status !== "PLAYING" ? "opacity-40 pointer-events-none" : ""}`}>
          {keyboard.map((row, rIdx) => (
            <div key={row} className="flex justify-center gap-1.5 w-full">
              {rIdx === 2 && (
                <button
                  onClick={() => handleKeyInput("ENTER")}
                  className="rounded-xl bg-white border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 px-2.5 py-3 text-[10px] font-black uppercase tracking-wider shadow-sm transition-all"
                >
                  Enter
                </button>
              )}
              {row.split("").map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyInput(key)}
                  className="flex-1 max-w-[36px] rounded-xl bg-white border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 py-3 text-xs font-black uppercase tracking-wide shadow-sm transition-all"
                >
                  {key}
                </button>
              ))}
              {rIdx === 2 && (
                <button
                  onClick={() => handleKeyInput("BACKSPACE")}
                  className="rounded-xl bg-white border border-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 px-2.5 py-3 text-[10px] font-black uppercase tracking-wider shadow-sm transition-all"
                >
                  Del
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </GameShell>
  );
};