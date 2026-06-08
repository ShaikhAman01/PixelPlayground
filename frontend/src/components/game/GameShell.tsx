"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSoloStore } from "@/store/solo.store";
import { useConnect4Store } from "@/store/connect4.store";
import { useGame2048Store } from "@/store/game2048.store";
import { useSlidePuzzleStore } from "@/store/slidePuzzle.store";
import { useColorMemoryStore } from "@/store/colorMemory.store";

interface GameShellProps {
  title: string;
  info?: string;
  timer?: string;
  onRestart?: () => void;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  title,
  info,
  timer,
  onRestart,
  children,
}) => {
  // 1. Hook into all Zustand stores to extract live score data dynamically
  const tictactoe = useSoloStore();
  const connect4 = useConnect4Store();
  const game2048 = useGame2048Store();
  const slidePuzzle = useSlidePuzzleStore();
  const colorMemory = useColorMemoryStore();

  // Normalized helper to determine if the active game mode supports vs-CPU play
  const isCpuGame = title.toLowerCase().includes("tic tac toe") || title.toLowerCase().includes("connect 4");

  // 2. Resolve stats and difficulties based on the current active game module
  const getGameStats = () => {
    const gameKey = title.toLowerCase();

    if (gameKey.includes("tic tac toe")) {
      return {
        difficulty: tictactoe.difficulty,
        setDifficulty: (diff: any) => tictactoe.setState({ difficulty: diff }),
        round: tictactoe.round,
        metrics: [
          { label: "Games Played", value: tictactoe.round - 1 },
          { label: "You Won", value: tictactoe.playerScore, color: "text-emerald-500" },
          { label: "CPU Won", value: tictactoe.cpuScore, color: "text-rose-500" },
        ],
        scoreboard: [
          { label: "🔵 You (Player)", score: tictactoe.playerScore },
          { label: "❌ Computer (AI)", score: tictactoe.cpuScore }
        ],
        statusText: tictactoe.currentTurn === "X" ? "Your Turn" : "CPU Thinking...",
        statusSub: tictactoe.currentTurn === "X" ? "Awaiting your grid input" : "Calculating vectors"
      };
    }

    if (gameKey.includes("connect 4")) {
      return {
        difficulty: connect4.difficulty,
        setDifficulty: (diff: any) => connect4.setState({ difficulty: diff }),
        round: connect4.round,
        metrics: [
          { label: "Games Played", value: connect4.round - 1 },
          { label: "You Won", value: connect4.playerScore, color: "text-emerald-500" },
          { label: "CPU Won", value: connect4.cpuScore, color: "text-rose-500" },
        ],
        scoreboard: [
          { label: "🔴 You (Player)", score: connect4.playerScore },
          { label: "🟡 Computer (AI)", score: connect4.cpuScore }
        ],
        statusText: connect4.currentTurn === "X" ? "Your Turn" : "CPU Thinking...",
        statusSub: connect4.currentTurn === "X" ? "Drop a token into a slot" : "Simulating columns"
      };
    }

    if (gameKey.includes("2048")) {
      return {
        difficulty: null,
        round: null,
        metrics: [
          { label: "Current Score", value: game2048.score, color: "text-violet-500" },
          { label: "Personal Best", value: game2048.bestScore },
          { label: "Game State", value: game2048.gameOver ? "Game Over" : "Playing", color: game2048.gameOver ? "text-rose-500" : "text-emerald-500" },
        ],
        scoreboard: [
          { label: "✨ Current Score", score: game2048.score },
          { label: "🏆 All-Time Best", score: game2048.bestScore }
        ],
        statusText: game2048.gameOver ? "Simulation Over" : "Active Input",
        statusSub: game2048.gameOver ? "No valid moves remaining" : "Use WASD or Arrow Keys"
      };
    }

    if (gameKey.includes("slide puzzle")) {
      return {
        difficulty: null,
        round: null,
        metrics: [
          { label: "Total Moves", value: slidePuzzle.moves, color: "text-violet-500" },
          { label: "Solved Status", value: slidePuzzle.won ? "Completed" : "Solving", color: slidePuzzle.won ? "text-emerald-500" : "text-amber-500" },
        ],
        scoreboard: [
          { label: "⏱️ Moves Taken", score: slidePuzzle.moves },
        ],
        statusText: slidePuzzle.won ? "Puzzle Solved!" : "Shifting Blocks",
        statusSub: slidePuzzle.won ? "Excellent sorting!" : "Slide neighbor into blank spot"
      };
    }

    if (gameKey.includes("color memory")) {
      return {
        difficulty: null,
        round: null,
        metrics: [
          { label: "Current Level", value: colorMemory.level, color: "text-violet-500" },
          { label: "Sequence Length", value: colorMemory.sequence.length },
          { label: "System Status", value: colorMemory.status, color: "text-slate-600 font-bold" },
        ],
        scoreboard: [
          { label: "🌟 Highest Stage", score: colorMemory.level },
        ],
        statusText: colorMemory.status === "WATCHING" ? "Scanning Playback" : "Your Sequence Turn",
        statusSub: colorMemory.status === "WATCHING" ? "Watch light vectors carefully" : "Repeat the tones precisely"
      };
    }

    // Default Fallback values for basic games (like Wordle)
    return {
      difficulty: null,
      round: null,
      metrics: [
        { label: "Session State", value: "Active" }
      ],
      scoreboard: [
        { label: "🎮 Puzzle Mode", score: "Solo" }
      ],
      statusText: "Puzzle Active",
      statusSub: "Solve the challenge"
    };
  };

  const game = getGameStats();

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center bg-cover bg-center bg-no-repeat overflow-x-hidden font-sans text-[#4A4E69]"
      style={{ backgroundImage: "url('/background/bg.png')" }}
    >
      <div className="absolute inset-0 bg-indigo-950/10 backdrop-blur-[1px] pointer-events-none z-0" />

      {/* 1. GLOBAL LOFI NAVBAR PLATFORM */}
      <header className="relative z-10 w-full max-w-[1200px] mt-4 px-4">
        <div className="w-full flex items-center justify-between rounded-2xl bg-white/80 p-4 shadow-sm border border-white/40">
          <div className="flex items-center gap-2">
            <div className="text-xl font-black tracking-wider text-[#4A4E69] uppercase font-mono">
              🐱 PIXEL PLAYGROUND
            </div>
          </div>

          {/* Simulated Lofi Music Stream Widget Container */}
          <div className="hidden md:flex items-center gap-4 bg-white/40 rounded-xl px-4 py-1.5 border border-white/60 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-indigo-200/60 animate-pulse" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-700 leading-tight">lofi beats to relax / study to</p>
              <p className="text-[9px] font-medium text-slate-400">Lofi Girl Stream</p>
            </div>
            <div className="flex items-center gap-2.5 ml-4 text-slate-400 text-xs font-mono">
              <span>⏮</span> <span className="text-violet-500 text-lg">▶</span> <span>⏭</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm shadow-sm border border-slate-100">🔊</div>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm shadow-sm border border-slate-100">🌙</div>
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-sm shadow-sm border border-slate-100">⚙️</div>
          </div>
        </div>
      </header>

      {/* 2. THE THREE-COLUMN ADAPTIVE LAYOUT MATRIX GRID */}
      <main className="relative z-10 w-full max-w-[1200px] flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 my-4 items-start">
        
        {/* ================= LEFT CONTROLS SIDEBAR (COL 1-3) ================= */}
        <section className="lg:col-span-3 flex flex-col gap-4 w-full">
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-md flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-widest text-violet-400 flex items-center gap-1.5">
              <span>{isCpuGame ? "⚔️" : "🧩"}</span> {isCpuGame ? "VS CPU Mode" : "Solo Puzzle Mode"}
            </div>
            <h2 className="text-2xl font-black text-[#32354A] uppercase tracking-wide mt-2 font-mono">
              {title}
            </h2>
            {game.round && (
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                Round tracking parameter: {Math.min(game.round, 3)} / 3
              </p>
            )}

            {/* CONDITIONAL COMPONENT ADAPTATION: Render difficulty configurations ONLY for vs-CPU modes */}
            {isCpuGame && game.difficulty && (
              <>
                <div className="h-px bg-slate-200/60 my-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Difficulty</p>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/40">
                  {(["EASY", "MEDIUM", "HARD"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => game.setDifficulty(mode)}
                      className={`text-[11px] font-bold py-1.5 rounded-lg shadow-sm uppercase tracking-wider transition-all ${
                        game.difficulty === mode
                          ? "bg-violet-500 text-white"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {mode.toLowerCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Statistics Profile Interface Deck */}
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-md flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Module Statistics</p>
            <div className="space-y-2.5 text-xs font-semibold">
              {game.metrics.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-slate-100 pb-2 last:border-none last:pb-0">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-bold font-mono ${item.color ?? "text-slate-700"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CENTER GAMEPLAY CONTAINER SCREEN (COL 4-9) ================= */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center w-full gap-4">
          <div className="rounded-full border border-white/80 bg-white/90 px-6 py-2 shadow-sm flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">System Environment:</p>
            <span className="text-xs font-black text-violet-600 uppercase font-mono bg-violet-100/80 px-2.5 py-0.5 rounded-md">
              {isCpuGame ? "Match Arena Active" : "Local Sandbox Matrix"}
            </span>
          </div>

          {/* Target Game Inject Node Frame */}
          <div className="w-full rounded-[36px] border border-white/60 bg-white/60 p-6 shadow-xl backdrop-blur-md flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center items-center"
            >
              {children}
            </motion.div>
          </div>

          {info && (
            <div className="rounded-full bg-white/40 border border-white/60 px-6 py-1.5 shadow-sm text-center">
              <p className="text-[10px] font-bold text-slate-500/90 uppercase tracking-widest">
                ✨ {info}
              </p>
            </div>
          )}
        </section>

        {/* ================= RIGHT SYNC ACTION BUTTONS DECK (COL 10-12) ================= */}
        <section className="lg:col-span-3 flex flex-col gap-4 w-full">
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-md flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Activity State</p>
            <div className="flex items-center gap-3 bg-violet-50/70 p-3 rounded-xl border border-violet-100/50">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" />
              <div className="text-left">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wide">{game.statusText}</p>
                <p className="text-[10px] font-medium text-slate-400">{game.statusSub}</p>
              </div>
            </div>
          </div>

          {/* Adaptive Scoring Monitor Deck */}
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-md flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
              {isCpuGame ? "Live Scoreboard" : "Performance Tracker"}
            </p>
            <div className="space-y-2 text-xs font-semibold">
              {game.scoreboard.map((scoreCard, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-500">{scoreCard.label}</span>
                  <span className="text-lg font-black text-slate-800 font-mono">{scoreCard.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset / Core Match Action Deck */}
          <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-md flex flex-col gap-2.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Game Actions</p>
            {onRestart && (
              <button
                onClick={onRestart}
                className="w-full rounded-xl bg-violet-500 hover:bg-violet-600 text-white py-2.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
              >
                🔄 Reset Engine Board
              </button>
            )}

            {timer !== undefined && (
              <div className="w-full rounded-xl bg-white text-center border border-slate-200 py-2 text-xs font-bold font-mono tracking-wider text-slate-600 shadow-inner">
                ⏱️ Run Duration: {timer}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};