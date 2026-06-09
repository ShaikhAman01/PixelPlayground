"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Clock, 
  Play, 
  Sparkles,
  ChevronDown,
  Activity
} from "lucide-react";
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
  onNewGame?: () => void;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  title,
  info,
  timer,
  onRestart,
  onNewGame,
  children,
}) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const tictactoe = useSoloStore();
  const connect4 = useConnect4Store();
  const game2048 = useGame2048Store();
  const slidePuzzle = useSlidePuzzleStore();
  const colorMemory = useColorMemoryStore();

  const isCpuGame = title.toLowerCase().includes("tic tac toe") || title.toLowerCase().includes("connect 4");

  const gamesList = [
    { name: "Tic Tac Toe", slug: "tictactoe" },
    { name: "Connect 4", slug: "connect4" },
    { name: "2048", slug: "game2048" },
    { name: "Wordle", slug: "wordle" },
    { name: "Color Memory", slug: "colormemory" },
    { name: "Slide Puzzle", slug: "slidepuzzle" }
  ];

  const getGameStats = () => {
    const gameKey = title.toLowerCase();

    if (gameKey.includes("tic tac toe")) {
      const winRate = tictactoe.round > 1 ? Math.round((tictactoe.playerScore / (tictactoe.round - 1)) * 100) : 0;
      return {
        description: "Get three in a row before the computer!",
        difficulty: tictactoe.difficulty,
        setDifficulty: (diff: any) => tictactoe.setState({ difficulty: diff }),
        metrics: [
          { label: "Games Played", value: tictactoe.round - 1, icon: <Gamepad2 className="w-4 h-4 text-violet-500" /> },
          { label: "Games Won", value: tictactoe.playerScore, icon: <Trophy className="w-4 h-4 text-amber-500" /> },
          { label: "Win Rate", value: `${winRate}%`, icon: <Sparkles className="w-4 h-4 text-pink-500" /> }
        ],
        statusTitle: "Turn",
        statusValue: tictactoe.currentTurn === "X" ? "You" : "Computer",
        statusColor: tictactoe.currentTurn === "X" ? "text-violet-500" : "text-rose-500",
        scoreboard: [
          { label: "You", score: tictactoe.playerScore, indicator: "🔵" },
          { label: "Computer", score: tictactoe.cpuScore, indicator: "❌" }
        ],
        objective: "Beat the computer",
        bestScore: `${tictactoe.playerScore} wins`
      };
    }

    if (gameKey.includes("connect 4")) {
      const winRate = connect4.round > 1 ? Math.round((connect4.playerScore / (connect4.round - 1)) * 100) : 0;
      return {
        description: "Drop tokens to match four in a row vertically, horizontally, or diagonally.",
        difficulty: connect4.difficulty,
        setDifficulty: (diff: any) => connect4.setState({ difficulty: diff }),
        metrics: [
          { label: "Games Played", value: connect4.round - 1, icon: <Gamepad2 className="w-4 h-4 text-violet-500" /> },
          { label: "Games Won", value: connect4.playerScore, icon: <Trophy className="w-4 h-4 text-amber-500" /> },
          { label: "Win Rate", value: `${winRate}%`, icon: <Sparkles className="w-4 h-4 text-pink-500" /> }
        ],
        statusTitle: "Turn",
        statusValue: connect4.currentTurn === "X" ? "You" : "Computer",
        statusColor: connect4.currentTurn === "X" ? "text-violet-500" : "text-rose-500",
        scoreboard: [
          { label: "You", score: connect4.playerScore, indicator: "🔴" },
          { label: "Computer", score: connect4.cpuScore, indicator: "🟡" }
        ],
        objective: "Connect four slots",
        bestScore: `${connect4.playerScore} wins`
      };
    }

    if (gameKey.includes("2048")) {
      return {
        description: "Slide the numbered grid tiles together to combine them into the 2048 block!",
        difficulty: null,
        metrics: [
          { label: "Current Score", value: game2048.score, icon: <Gamepad2 className="w-4 h-4 text-violet-500" /> },
          { label: "Personal Best", value: game2048.bestScore, icon: <Trophy className="w-4 h-4 text-amber-500" /> }
        ],
        statusTitle: "Status",
        statusValue: game2048.gameOver ? "Game Over" : "Playing",
        statusColor: game2048.gameOver ? "text-rose-500" : "text-emerald-500",
        scoreboard: [
          { label: "Score", score: game2048.score, indicator: "✨" },
          { label: "Best", score: game2048.bestScore, indicator: "🏆" }
        ],
        objective: "Reach the 2048 tile",
        bestScore: `${game2048.bestScore} pts`
      };
    }

    if (gameKey.includes("slide puzzle")) {
      return {
        description: "Slide grid blocks around to sort them into ascending numerical order.",
        difficulty: null,
        metrics: [
          { label: "Total Moves", value: slidePuzzle.moves, icon: <Gamepad2 className="w-4 h-4 text-violet-500" /> },
          { label: "Puzzle State", value: slidePuzzle.won ? "Solved" : "Active", icon: <Sparkles className="w-4 h-4 text-emerald-500" /> }
        ],
        statusTitle: "Status",
        statusValue: slidePuzzle.won ? "Winner!" : "Playing",
        statusColor: slidePuzzle.won ? "text-emerald-500" : "text-amber-500",
        scoreboard: [
          { label: "Moves Taken", score: slidePuzzle.moves, indicator: "⏱️" }
        ],
        objective: "Sort blocks sequentially",
        bestScore: "Fastest Clear"
      };
    }

    if (gameKey.includes("color memory")) {
      return {
        description: "Watch the light pattern flash, then repeat it exactly.",
        difficulty: null,
        metrics: [
          { label: "Current Level", value: colorMemory.level, icon: <Gamepad2 className="w-4 h-4 text-violet-500" /> },
          { label: "Sequence Run", value: colorMemory.sequence.length, icon: <Activity className="w-4 h-4 text-pink-500" /> }
        ],
        statusTitle: "Status",
        statusValue: colorMemory.status === "WATCHING" ? "Watching" : "Your Turn",
        statusColor: colorMemory.status === "WATCHING" ? "text-rose-400 animate-pulse" : "text-emerald-500",
        scoreboard: [
          { label: "Highest Stage", score: colorMemory.level, indicator: "🌟" }
        ],
        objective: "Match the lights",
        bestScore: `Stage ${colorMemory.level}`
      };
    }

    return {
      description: "Solve the daily word puzzle grid.",
      difficulty: null,
      metrics: [{ label: "Status", value: "Active", icon: <Gamepad2 className="w-4 h-4 text-violet-500" /> }],
      statusTitle: "Status",
      statusValue: "Playing",
      statusColor: "text-violet-500",
      scoreboard: [{ label: "Puzzle Mode", score: "Solo", indicator: "🧩" }],
      objective: "Find hidden letters",
      bestScore: "Active"
    };
  };

  const game = getGameStats();

  React.useEffect(() => {
    const preventDefaultScrollKeys = (e: KeyboardEvent) => {
      const blockKeys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown"];
      if (blockKeys.includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventDefaultScrollKeys, { passive: false });
    return () => window.removeEventListener("keydown", preventDefaultScrollKeys);
  }, []);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-4 flex flex-col flex-1 select-none text-[#4A4E69] dark:text-indigo-200 overflow-hidden">
      
      <div className="w-full flex justify-center mb-6">
        <div className="rounded-full bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/40 px-6 py-2 shadow-sm flex items-center gap-2 backdrop-blur-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-indigo-300">Game Engine:</p>
          <span className="text-xs font-black text-violet-600 dark:text-violet-400 uppercase font-mono bg-violet-100/60 dark:bg-violet-950/40 px-2.5 py-0.5 rounded-md">
            {isCpuGame ? "Versus Computer" : "Solo Match"}
          </span>
        </div>
      </div>

      <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start mt-2 overflow-hidden">
        
        {/* ================= LEFT CONFIGURATION PANEL (COL 1-3) ================= */}
        <section className="lg:col-span-3 flex flex-col gap-4 w-full">
          <div className="rounded-[28px] border border-white/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 p-6 shadow-sm flex flex-col backdrop-blur-md">
            
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 flex items-center gap-2 mb-2">
              <Gamepad2 className="w-3.5 h-3.5" /> Select Game
            </div>
            
            <div className="relative w-full">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 px-4 py-2.5 text-xs font-bold shadow-inner text-slate-700 dark:text-indigo-100"
              >
                <span>{title}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute left-0 right-0 mt-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden"
                  >
                    {gamesList.map((g) => (
                      <button
                        key={g.slug}
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push(`/game/${g.slug}`);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 dark:text-indigo-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 transition-colors"
                      >
                        {g.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 flex items-center gap-2 mt-6 mb-2">
              Description
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-indigo-300/80 leading-relaxed">
              {game.description}
            </p>

            {isCpuGame && game.difficulty && (
              <>
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 flex items-center gap-2 mt-6 mb-2">
                  Difficulty
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                  {(["EASY", "MEDIUM", "HARD"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => game.setDifficulty(mode)}
                      className={`text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                        game.difficulty === mode
                          ? "bg-violet-500 text-white shadow-sm"
                          : "text-slate-400 dark:text-indigo-400 hover:text-slate-700 dark:hover:text-white"
                      }`}
                    >
                      {mode.toLowerCase()}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 flex items-center gap-2 mt-6 mb-3">
              Stats
            </div>
            <div className="space-y-3">
              {game.metrics.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs font-semibold bg-white/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/20 rounded-xl p-2.5">
                  <span className="text-slate-500 dark:text-indigo-300/70 flex items-center gap-2">
                    {item.icon} {item.label}
                  </span>
                  <span className="font-bold font-mono text-slate-800 dark:text-indigo-100">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CENTER PLAYING FIELD GRID CONTAINER (COL 4-9) ================= */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center w-full">
          <div className="w-full rounded-[32px] border border-white/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 p-5 shadow-sm backdrop-blur-md flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 px-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 font-mono">
                Game Area
              </span>
            </div>

            <div className="w-full flex items-center justify-center min-h-[380px] p-2">
              {children}
            </div>

            {/* FIXED: Scaled layout down to a clean 2-column distribution row (Hint Removed) */}
            <div className="w-full grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
              <button 
                onClick={onNewGame}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs py-2.5 shadow-sm transition-all active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> New Game
              </button>
              <button 
                onClick={onRestart}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-indigo-200 font-bold text-xs py-2.5 shadow-sm transition-all active:scale-[0.98]"
              >
                Reset Match
              </button>
            </div>

          </div>
        </section>

        {/* ================= RIGHT METADATA STATUS SIDEBAR (COL 10-12) ================= */}
        <section className="lg:col-span-3 flex flex-col gap-4 w-full">
          <div className="rounded-[28px] border border-white/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/60 p-6 shadow-sm flex flex-col backdrop-blur-md">
            
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 flex items-center gap-1 mb-2">
              Status <span className="text-[10px] opacity-60">+</span>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/40 p-3 flex flex-col items-start mb-6">
              <span className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-wide">{game.statusTitle}</span>
              <span className={`text-base font-black uppercase font-mono mt-0.5 ${game.statusColor}`}>
                {game.statusValue}
              </span>
            </div>

            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 flex items-center gap-1 mb-2">
              Score <span className="text-[10px] opacity-60">+</span>
            </div>
            <div className="space-y-2 mb-6">
              {game.scoreboard.map((scoreCard, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/20 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-500 dark:text-indigo-200 flex items-center gap-2">
                    <span>{scoreCard.indicator}</span> {scoreCard.label}
                  </span>
                  <span className="text-lg font-black text-slate-800 dark:text-white font-mono leading-none">
                    {scoreCard.score}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-400 flex items-center gap-1 mb-2">
              Game Info <span className="text-[10px] opacity-60">+</span>
            </div>
            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center shadow-sm">
                  <Target className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-wide">Objective</p>
                  <p className="text-xs font-black text-slate-700 dark:text-indigo-100 uppercase mt-0.5">{game.objective}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shadow-sm">
                  <Trophy className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-wide">Best Score</p>
                  <p className="text-xs font-black text-slate-700 dark:text-indigo-100 uppercase mt-0.5">{game.bestScore}</p>
                </div>
              </div>

              {timer !== undefined && (
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-50 flex items-center justify-center shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-wide">Time Elapsed</p>
                    <p className="text-xs font-black text-slate-700 dark:text-indigo-100 uppercase mt-0.5">{timer}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};