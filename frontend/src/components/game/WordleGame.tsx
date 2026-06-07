"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { GameShell } from "./GameShell";
import { words } from "@/data/wordleWords";
import { useWordleStore } from "@/store/wordle.store";
import { validWords } from "@/data/validWords";

const keyboard = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export const WordleGame = () => {
  const { solution, guesses, currentGuess, status, setState } = useWordleStore();
  const [isShaking, setIsShaking] = useState(false);

  // Safely calculate seed logic inside standard execution paths to satisfy the purity audit rules
  const dailyWord = useMemo(() => {
    if (typeof window === "undefined") return words[0];
    const timestampSeed = new Date().setHours(0,0,0,0);
    const index = Math.floor(timestampSeed / 86400000);
    return words[index % words.length];
  }, []);

  useEffect(() => {
    if (solution || !dailyWord) return;
    setState({ solution: dailyWord });
  }, [solution, dailyWord, setState]);


  const triggerShakeEffect = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (status !== "PLAYING") return;
      const key = e.key.toUpperCase();

      if (key === "ENTER") {
        if (currentGuess.length !== 5) {
          triggerShakeEffect();
          return;
        }
        if (!validWords.has(currentGuess.toUpperCase())) {
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

      if (key === "BACKSPACE") {
        setState({ currentGuess: currentGuess.slice(0, -1) });
        return;
      }

      if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length >= 5) return;
        setState({ currentGuess: currentGuess + key });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentGuess, guesses, solution, status, setState, triggerShakeEffect]);

  const getTileClass = (letter: string, index: number) => {
  // Guard clause: If the state hasn't populated the solution yet, wait.
  if (!solution || solution.length === 0) {
    return "bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent";
  }

  if (solution[index] === letter) {
    return "bg-emerald-400 text-white border-transparent shadow-emerald-200 dark:shadow-none";
  }
  if (solution.includes(letter)) {
    return "bg-amber-400 text-white border-transparent shadow-amber-200 dark:shadow-none";
  }
  return "bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent";
};

  return (
    <GameShell title="Wordle" info="Guess the hidden 5-letter word.">
      <div className="flex flex-col items-center max-w-full px-2">
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, rowIndex) => {
            const isCurrentRow = rowIndex === guesses.length;
            const guess = guesses[rowIndex] ?? (isCurrentRow ? currentGuess : "");

            return (
              <div 
                key={rowIndex} 
                className={`flex gap-2.5 transition-transform duration-300 ${isCurrentRow && isShaking ? "animate-shake" : ""}`}
              >
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  const letter = guess[colIndex];
                  const submitted = rowIndex < guesses.length;

                  return (
                    <div
                      key={colIndex}
                      className={`flex size-[clamp(3.25rem,11vw,3.75rem)] items-center justify-center rounded-2xl border text-xl font-bold shadow-md transition-all duration-300 ${
                        submitted
                          ? getTileClass(letter, colIndex)
                          : "border-white/80 bg-white/60 dark:border-white/10 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Keyboard Input Deck */}
        <div className="mt-8 space-y-2 max-w-full overflow-hidden">
          {keyboard.map((row) => (
            <div key={row} className="flex justify-center gap-1.5">
              {row.split("").map((key) => (
                <button
                  key={key}
                  onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key }))}
                  className="rounded-xl bg-white/60 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 px-3 py-3 text-xs font-bold shadow-sm border border-white/40 dark:border-white/5 hover:bg-white/90 dark:hover:bg-slate-800 active:scale-95 transition-all"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </GameShell>
  );
};