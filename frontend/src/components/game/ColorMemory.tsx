"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { GameShell } from "./GameShell";
import { useColorMemoryStore } from "@/store/colorMemory.store";

const tilesConfig = [
  { default: "bg-rose-500/20 border-rose-300/40 text-rose-600 dark:text-rose-400 dark:bg-rose-950/20", active: "bg-rose-400 border-transparent text-white shadow-[0_0_24px_rgba(251,113,133,0.5)]", note: 261.63 },
  { default: "bg-sky-500/20 border-sky-300/40 text-sky-600 dark:text-sky-400 dark:bg-sky-950/20", active: "bg-sky-400 border-transparent text-white shadow-[0_0_24px_rgba(56,189,248,0.5)]", note: 293.66 },
  { default: "bg-amber-500/20 border-amber-300/40 text-amber-600 dark:text-amber-400 dark:bg-amber-950/20", active: "bg-amber-400 border-transparent text-white shadow-[0_0_24px_rgba(251,191,36,0.5)]", note: 329.63 },
  { default: "bg-emerald-500/20 border-emerald-300/40 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/20", active: "bg-emerald-400 border-transparent text-white shadow-[0_0_24px_rgba(52,211,153,0.5)]", note: 349.23 }
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
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio Context blocked:", e);
    }
  };

  const playFailureTone = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn(e);
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

    const next = [...playerSequence, index];
    setState({ playerSequence: next });

    if (index !== sequence[playerSequence.length]) {
      setState({ status: "FAILED" });
      playFailureTone();
      return;
    }

    playTone(tilesConfig[index].note);

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
      <div className="flex flex-col items-center justify-center w-full max-w-md px-2 select-none pb-2">
        
        {/* Expanded, high-impact grid alignment setup */}
        <motion.div 
          animate={status === "FAILED" ? {
            x: [0, -6, 6, -6, 6, 0],
            transition: { duration: 0.4 }
          } : {}}
          className={`grid grid-cols-2 gap-4 sm:gap-5 p-4 sm:p-5 rounded-[28px] border w-full justify-items-center transition-all duration-300 shadow-sm backdrop-blur-md ${
            status === "FAILED"
              ? "bg-rose-500/10 border-rose-300 dark:border-rose-900/60 opacity-90 shadow-[0_0_32px_rgba(239,68,68,0.15)]"
              : status === "WATCHING" || !started 
                ? "bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 pointer-events-none opacity-80" 
                : "bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800"
          }`}
        >
          {tilesConfig.map((tile, index) => {
            const isLit = activeTile === index;
            return (
              <motion.button
                key={index}
                whileHover={status === "PLAYING" && started ? { scale: 1.02 } : {}}
                whileTap={status === "PLAYING" && started ? { scale: 0.98 } : {}}
                onClick={() => handleClick(index)}
                disabled={status !== "PLAYING" || !started}
                className={`w-full h-32 sm:h-36 rounded-2xl border text-3xl font-black flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
                  status === "FAILED"
                    ? "bg-rose-500/5 border-rose-200/40 text-rose-400 dark:bg-rose-950/10 dark:border-rose-900/20 opacity-40 scale-95 pointer-events-none"
                    : isLit ? tile.active : tile.default
                }`}
              >
                {index + 1}
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </GameShell>
  );
};