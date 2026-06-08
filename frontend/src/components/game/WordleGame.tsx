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
    if (!solution || solution.length === 0) return "bg-slate-300 dark:bg-slate-800 text-slate-700";
    if (solution[index] === letter) return "bg-emerald-400 text-white border-transparent";
    if (solution.includes(letter)) return "bg-amber-400 text-white border-transparent";
    return "bg-slate-300 dark:bg-slate-800 text-slate-400 border-transparent";
  };

  return (
    <GameShell title="Wordle">
      <div className="flex flex-col items-center justify-center w-full">
        
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, rowIndex) => {
            const isCurrentRow = rowIndex === guesses.length;
            const guess = guesses[rowIndex] ?? (isCurrentRow ? currentGuess : "");

            return (
              <div key={rowIndex} className={`flex gap-2 ${isCurrentRow && isShaking ? "animate-shake" : ""}`}>
                {Array.from({ length: 5 }).map((_, colIndex) => {
                  const letter = guess[colIndex];
                  const submitted = rowIndex < guesses.length;

                  return (
                    <div
                      key={colIndex}
                      className={`flex size-[clamp(3rem,10vw,3.4rem)] items-center justify-center rounded-xl border text-lg font-black transition-all duration-300 ${
                        submitted
                          ? getTileClass(letter, colIndex)
                          : "border-slate-200/60 bg-white/80 dark:border-white/5 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100"
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

        <div className="mt-6 space-y-1.5 max-w-full overflow-hidden opacity-95">
          {keyboard.map((row) => (
            <div key={row} className="flex justify-center gap-1">
              {row.split("").map((key) => (
                <button
                  key={key}
                  onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key }))}
                  className="rounded-lg bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 px-2.5 py-2.5 text-xs font-bold border border-slate-200/40 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all"
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