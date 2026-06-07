"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "./GameShell";
import { useColorMemoryStore } from "@/store/colorMemory.store";

// Upgraded UI styling matrix featuring static default and specialized glow modes
const tilesConfig = [
  { default: "bg-rose-400/40 border-rose-400/30 text-rose-500", active: "bg-rose-400 shadow-rose-400/80 text-white border-transparent", note: 261.63 }, // C4
  { default: "bg-sky-400/40 border-sky-400/30 text-sky-500", active: "bg-sky-400 shadow-sky-400/80 text-white border-transparent", note: 293.66 },  // D4
  { default: "bg-amber-400/40 border-amber-400/30 text-amber-500", active: "bg-amber-400 shadow-amber-400/80 text-white border-transparent", note: 329.63 }, // E4
  { default: "bg-emerald-400/40 border-emerald-400/30 text-emerald-500", active: "bg-emerald-400 shadow-emerald-400/80 text-white border-transparent", note: 349.23 } // F4
];

export const ColorMemory = () => {
  const { sequence, playerSequence, level, status, activeTile, setState } = useColorMemoryStore();
  const [started, setStarted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Instantiates a smooth programmatic tone synthesizer
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
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  const startGame = () => {
    // Prime the audio context right away following player interaction
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const first = Math.floor(Math.random() * 4);
    setState({ sequence: [first], playerSequence: [], level: 1, status: "WATCHING" });
    setStarted(true);
  };

  // SYSTEM TIMELINE SHOWCASE
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

  // ACTION INPUT PROCESSOR
  const handleClick = (index: number) => {
    if (status !== "PLAYING") return;

    playTone(tilesConfig[index].note);
    const next = [...playerSequence, index];
    setState({ playerSequence: next });

    // WRONG MATCH DETECTED
    if (next[next.length - 1] !== sequence[next.length - 1]) {
      setState({ status: "FAILED" });
      return;
    }

    // ROUND PASSED STEPPER
    if (next.length === sequence.length) {
      setState({ status: "WATCHING" }); // Promptly shift state locks to ignore duplicate clicks
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
    <GameShell title="Color Memory" info="Watch the musical light pattern and duplicate it exactly.">
      <div className="flex flex-col items-center max-w-full px-4">
        
        {/* LEVEL NOTIFIER */}
        <div className="mb-8 rounded-2xl border border-slate-200/40 bg-white/70 px-6 py-2 shadow-md backdrop-blur-md dark:border-white/5 dark:bg-slate-900/60">
          <p className="text-xs font-black uppercase tracking-widest text-violet-500 dark:text-violet-400">
            Stage Progression: Level {level}
          </p>
        </div>

        {/* RE-STYLED MATRIX BUTTON DECK */}
        <div className={`grid grid-cols-2 gap-5 p-4 rounded-[42px] border border-white/60 bg-white/30 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/30 ${
          status === "WATCHING" ? "pointer-events-none cursor-not-allowed" : ""
        }`}>
          {tilesConfig.map((tile, index) => {
            const isLit = activeTile === index;
            return (
              <motion.button
                key={index}
                whileHover={status === "PLAYING" ? { scale: 1.03 } : {}}
                whileTap={status === "PLAYING" ? { scale: 0.96 } : {}}
                animate={{
                  scale: isLit ? 1.05 : 1,
                }}
                onClick={() => handleClick(index)}
                className={`h-32 w-32 sm:h-36 sm:w-36 rounded-[28px] border-2 transition-all duration-200 font-extrabold text-lg flex items-center justify-center shadow-sm ${
                  isLit ? tile.active + " shadow-xl scale-105" : tile.default
                }`}
              >
                {index + 1}
              </motion.button>
            );
          })}
        </div>

        {/* REALTIME STATUS FOOTER BOX */}
        <div className="mt-8 min-h-[72px]">
          {!started ? (
            <button
              onClick={startGame}
              className="rounded-full bg-violet-500 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-violet-500/20 transition-all hover:bg-violet-600 active:scale-95"
            >
              Initiate System
            </button>
          ) : status === "FAILED" ? (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="rounded-full border border-rose-500/10 bg-rose-500/20 px-6 py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Sequence Desynced!
                </p>
              </div>
              <button
                onClick={startGame}
                className="rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold uppercase text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Retry Simulation
              </button>
            </div>
          ) : (
            <div className="rounded-full border border-white/60 bg-white/70 px-6 py-2.5 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {status === "WATCHING" ? "⚡ Scanning playback matrix..." : "👉 input current string"}
              </p>
            </div>
          )}
        </div>

      </div>
    </GameShell>
  );
};