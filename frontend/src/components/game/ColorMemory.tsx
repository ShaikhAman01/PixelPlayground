"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { GameShell } from "./GameShell";
import { useColorMemoryStore } from "@/store/colorMemory.store";
import { submitScore } from "@/lib/scoreSync";

const tilesConfig = [
  { default: "bg-rose-500/20 border-rose-300/40 text-rose-600 dark:text-rose-400 dark:bg-rose-950/20", active: "bg-rose-400 border-transparent text-white shadow-[0_0_24px_rgba(251,113,133,0.5)]", note: 261.63 },
  { default: "bg-sky-500/20 border-sky-300/40 text-sky-600 dark:text-sky-400 dark:bg-sky-950/20", active: "bg-sky-400 border-transparent text-white shadow-[0_0_24px_rgba(56,189,248,0.5)]", note: 293.66 },
  { default: "bg-amber-500/20 border-amber-300/40 text-amber-600 dark:text-amber-400 dark:bg-amber-950/20", active: "bg-amber-400 border-transparent text-white shadow-[0_0_24px_rgba(251,191,36,0.5)]", note: 329.63 },
  { default: "bg-emerald-500/20 border-emerald-300/40 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-950/20", active: "bg-emerald-400 border-transparent text-white shadow-[0_0_24px_rgba(52,211,153,0.5)]", note: 349.23 }
];

const createAudioContext = (): AudioContext => {
  const Ctor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) throw new Error("Web Audio API unavailable");
  return new Ctor();
};

export const ColorMemory = () => {
  const { sequence, playerSequence, level, status, activeTile, setState } = useColorMemoryStore();
  const [started, setStarted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const queueTimeout = useCallback((fn: () => void, ms: number) => {
    timeoutsRef.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const playTone = (frequency: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = createAudioContext();
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
        audioCtxRef.current = createAudioContext();
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
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = createAudioContext();
      }
    } catch {
      // Tones are a nice-to-have; the game itself works without audio
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

      queueTimeout(() => {
        setState({ activeTile: null });
      }, 450);

      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        queueTimeout(() => {
          setState({ status: "PLAYING" });
        }, 600);
      }
    }, 850);

    return () => clearInterval(interval);
  }, [sequence, status, started, setState, queueTimeout]);

  const handleClick = (index: number) => {
    if (status !== "PLAYING") return;

    const next = [...playerSequence, index];
    setState({ playerSequence: next });

    if (index !== sequence[playerSequence.length]) {
      setState({ status: "FAILED" });
      playFailureTone();
      submitScore({ gameId: "colormemory", outcome: "completed", level });
      return;
    }

    playTone(tilesConfig[index].note);

    if (next.length === sequence.length) {
      setState({ status: "WATCHING" });
      queueTimeout(() => {
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

        <div className="relative w-full">

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

        {/* First-visit start CTA — the pad alone gives no hint how to begin */}
        <AnimatePresence>
          {!started && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
            >
              <button
                onClick={startGame}
                className="flex items-center gap-2 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 px-7 py-3.5 text-sm font-black uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> Start
              </button>
              <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 px-3 py-1 rounded-full backdrop-blur-sm">
                Watch the pattern, then repeat it
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {started && status === "FAILED" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.45 } }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
            >
              <div className="bg-white/95 dark:bg-zinc-900/95 px-6 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Nice run
                </p>
                <p className="text-lg font-black text-zinc-950 dark:text-white">
                  Level {level} reached
                </p>
              </div>
              <button
                onClick={startGame}
                className="rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 px-6 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        </div>

      </div>
    </GameShell>
  );
};