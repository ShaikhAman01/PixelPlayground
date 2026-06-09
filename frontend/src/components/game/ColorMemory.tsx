"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { GameShell } from "./GameShell";
import { useColorMemoryStore } from "@/store/colorMemory.store";

const tilesConfig = [
  { default: "bg-rose-400/40 border-rose-400/30 text-rose-500", active: "bg-rose-400 shadow-rose-400/80 text-white border-transparent", note: 261.63 },
  { default: "bg-sky-400/40 border-sky-400/30 text-sky-500", active: "bg-sky-400 shadow-sky-400/80 text-white border-transparent", note: 293.66 },
  { default: "bg-amber-400/40 border-amber-400/30 text-amber-500", active: "bg-amber-400 shadow-amber-400/80 text-white border-transparent", note: 329.63 },
  { default: "bg-emerald-400/40 border-emerald-400/30 text-emerald-500", active: "bg-emerald-400 shadow-emerald-400/80 text-white border-transparent", note: 349.23 }
];

export const ColorMemory = () => {
  const { sequence, playerSequence, level, status, activeTile, setState } = useColorMemoryStore();
  const [started, setStarted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (frequency: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio Context blocked:", e);
    }
  };

  const startGame = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const first = Math.floor(Math.random() * 4);
    setState({ sequence: [first], playerSequence: [], level: 1, status: "WATCHING" });
    setStarted(true);
  };

  useEffect(() => {
    if (!started || status !== "WATCHING" || sequence.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      const tileIndex = sequence[i];
      setState({ activeTile: tileIndex });
      playTone(tilesConfig[tileIndex].note);

      setTimeout(() => {
        setState({ activeTile: null });
      }, 450);

      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setState({ status: "PLAYING" });
        }, 600);
      }
    }, 850);

    return () => clearInterval(interval);
  }, [sequence, status, started, setState]);

  const handleClick = (index: number) => {
    if (status !== "PLAYING") return;

    playTone(tilesConfig[index].note);
    const next = [...playerSequence, index];
    setState({ playerSequence: next });

    if (next[next.length - 1] !== sequence[next.length - 1]) {
      setState({ status: "FAILED" });
      return;
    }

    if (next.length === sequence.length) {
      setState({ status: "WATCHING" });
      setTimeout(() => {
        setState({
          sequence: [...sequence, Math.floor(Math.random() * 4)],
          playerSequence: [],
          level: level + 1,
        });
      }, 800);
    }
  };

  return (
    <GameShell title="Color Memory" onRestart={startGame}>
      <div className="flex flex-col items-center justify-center w-full">
        
        <div className={`grid grid-cols-2 gap-5 p-5 rounded-[36px] bg-white/10 dark:bg-slate-900/10 border border-white/20 ${
          status === "WATCHING" ? "pointer-events-none opacity-90" : ""
        }`}>
          {tilesConfig.map((tile, index) => {
            const isLit = activeTile === index;
            return (
              <motion.button
                key={index}
                whileHover={status === "PLAYING" ? { scale: 1.02 } : {}}
                whileTap={status === "PLAYING" ? { scale: 0.97 } : {}}
                onClick={() => handleClick(index)}
                className={`h-28 w-28 sm:h-32 sm:w-32 rounded-3xl border-2 transition-all duration-200 text-xl font-black flex items-center justify-center shadow-sm ${
                  isLit ? tile.active + " shadow-lg" : tile.default
                }`}
              >
                {index + 1}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 min-h-[44px] flex items-center justify-center">
          {!started ? (
            <button
              onClick={startGame}
              className="rounded-xl bg-violet-500 px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-violet-600 transition-all active:scale-95"
            >
              Start Game
            </button>
          ) : status === "FAILED" ? (
            <button
              onClick={startGame}
              className="rounded-xl bg-rose-500 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-rose-600 transition-all active:scale-95"
            >
              Try Again
            </button>
          ) : null}
        </div>

      </div>
    </GameShell>
  );
};