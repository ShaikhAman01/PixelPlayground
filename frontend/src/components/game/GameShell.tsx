"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Gamepad2, Trophy, Sparkles, ChevronDown, HelpCircle, Clock, Play 
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
  timer,
  onRestart,
  onNewGame,
  children,
}) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

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
        rules: ["Take turns placing X marks on the 3x3 grid.", "Match 3 in a horizontal, vertical, or diagonal line to win.", "Block the computer from completing its lines."],
        difficulty: tictactoe.difficulty,
        setDifficulty: (diff: any) => tictactoe.setState({ difficulty: diff }),
        metrics: [
          { label: "Played", value: tictactoe.round - 1, icon: <Gamepad2 className="w-4 h-4 text-zinc-500" /> },
          { label: "Won", value: tictactoe.playerScore, icon: <Trophy className="w-4 h-4 text-zinc-500" /> },
          { label: "Win Rate", value: `${winRate}%`, icon: <Sparkles className="w-4 h-4 text-zinc-500" /> }
        ],
        statusTitle: "Turn",
        statusValue: tictactoe.currentTurn === "X" ? "Your Turn" : "CPU Thinking",
        statusColor: tictactoe.currentTurn === "X" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400",
        scoreboard: [
          { label: "You", score: tictactoe.playerScore },
          { label: "Computer", score: tictactoe.cpuScore }
        ]
      };
    }

    if (gameKey.includes("connect 4")) {
      const winRate = connect4.round > 1 ? Math.round((connect4.playerScore / (connect4.round - 1)) * 100) : 0;
      return {
        description: "Match four slots in a row to win.",
        rules: ["Click columns to drop tokens into the grid matrix.", "Connect 4 matching colored discs in any continuous direction.", "Keep an eye on CPU placement traps."],
        difficulty: connect4.difficulty,
        setDifficulty: (diff: any) => connect4.setState({ difficulty: diff }),
        metrics: [
          { label: "Played", value: connect4.round - 1, icon: <Gamepad2 className="w-4 h-4 text-zinc-500" /> },
          { label: "Won", value: connect4.playerScore, icon: <Trophy className="w-4 h-4 text-zinc-500" /> },
          { label: "Win Rate", value: `${winRate}%`, icon: <Sparkles className="w-4 h-4 text-zinc-500" /> }
        ],
        statusTitle: "Turn",
        statusValue: connect4.currentTurn === "X" ? "Your Turn" : "CPU Thinking",
        statusColor: connect4.currentTurn === "X" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400",
        scoreboard: [
          { label: "You", score: connect4.playerScore },
          { label: "Computer", score: connect4.cpuScore }
        ]
      };
    }

    if (gameKey.includes("2048")) {
      return {
        description: "Slide tiles together to reach the 2048 block!",
        rules: ["Use keyboard arrow keys to move all board tiles at once.", "Identical numbers fuse into their sum when slammed together.", "Keep the grid from locking up completely."],
        difficulty: null,
        metrics: [
          { label: "Score", value: game2048.score, icon: <Gamepad2 className="w-4 h-4 text-zinc-500" /> },
          { label: "Best", value: game2048.bestScore, icon: <Trophy className="w-4 h-4 text-zinc-500" /> }
        ],
        statusTitle: "Status",
        statusValue: game2048.gameOver ? "Game Over" : "Playing",
        statusColor: game2048.gameOver ? "text-rose-500 font-bold" : "text-zinc-900 dark:text-zinc-100",
        scoreboard: [
          { label: "Current Score", score: game2048.score },
          { label: "Best Score", score: game2048.bestScore }
        ]
      };
    }

    if (gameKey.includes("slide puzzle")) {
      return {
        description: "Move the puzzle blocks into order from 1 to 8.",
        rules: ["Click blocks neighboring the lone empty spacer to shift them.", "Arrange numbers into an ascending sequence from left to right.", "Try completing the matrix in the fewest moves possible."],
        difficulty: null,
        metrics: [
          { label: "Moves", value: slidePuzzle.moves, icon: <Gamepad2 className="w-4 h-4 text-zinc-500" /> }
        ],
        statusTitle: "Status",
        statusValue: slidePuzzle.won ? "Solved!" : "Playing",
        statusColor: slidePuzzle.won ? "text-emerald-500 font-bold" : "text-zinc-900 dark:text-zinc-100",
        scoreboard: [
          { label: "Moves Made", score: slidePuzzle.moves }
        ]
      };
    }

    if (gameKey.includes("color memory")) {
      return {
        description: "Watch the lights flash, then copy the pattern exactly.",
        rules: ["Study the luminous pad flash sequences attentively.", "Click blocks to repeat the track back without making a mistake.", "Every cleared stage stacks an extra tile step onto the loop."],
        difficulty: null,
        metrics: [
          { label: "Level", value: colorMemory.level, icon: <Gamepad2 className="w-4 h-4 text-zinc-500" /> }
        ],
        statusTitle: "Status",
        statusValue: colorMemory.status === "WATCHING" ? "Watch Closely" : "Your Turn",
        statusColor: colorMemory.status === "WATCHING" ? "text-amber-500 font-bold animate-pulse" : "text-emerald-500 font-bold",
        scoreboard: [
          { label: "Highest Level", score: colorMemory.level }
        ]
      };
    }

    return {
      description: "Find the hidden letters to guess the word.",
      rules: ["Type valid words into rows to reveal layout match insights.", "Green indicates a perfect placement match.", "Yellow means the letter lives elsewhere inside the word puzzle."],
      difficulty: null,
      metrics: [{ label: "Status", value: "Active", icon: <Gamepad2 className="w-4 h-4 text-zinc-500" /> }],
      statusTitle: "Status",
      statusValue: "Playing",
      statusColor: "text-zinc-950 dark:text-white",
      scoreboard: [{ label: "Game Mode", score: "Solo Run" }]
    };
  };

  const game = getGameStats();

  const handleNewGameTrigger = () => {
    if (onNewGame) {
      onNewGame();
    } else if (onRestart) {
      onRestart();
    }
  };

  React.useEffect(() => {
    const preventDefaultScrollKeys = (e: KeyboardEvent) => {
      const blockKeys = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
      if (blockKeys.includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventDefaultScrollKeys, { passive: false });
    return () => window.removeEventListener("keydown", preventDefaultScrollKeys);
  }, []);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-6 md:px-8 py-2 md:py-4 flex flex-col flex-1 select-none text-zinc-800 dark:text-zinc-200">
      
      {/* Top Status Badges Wrap */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 mb-4 md:mb-6">
        <div className="rounded-full bg-amber-50/80 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 px-4 py-1.5 shadow-sm flex items-center gap-2 backdrop-blur-xl">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">Mode:</p>
          <span className="text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-zinc-200/40 dark:border-zinc-700/40">
            {isCpuGame ? "Versus CPU" : "Playing Solo"}
          </span>
        </div>

        {timer !== undefined && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full bg-amber-50/80 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 px-4 py-1.5 shadow-sm flex items-center gap-1.5 backdrop-blur-xl"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs font-black font-mono text-zinc-800 dark:text-zinc-200">{timer}</span>
          </motion.div>
        )}
      </div>

      <main className="w-full flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start mt-1">
        
        {/* Left Side: Games Index (FIXED LAYER STACK FOR MOBILE) */}
        <section className="w-full lg:col-span-3 order-1 relative z-30">
          <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800/80 bg-amber-50/70 dark:bg-zinc-900/90 p-4 md:p-5 shadow-sm flex flex-col backdrop-blur-xl">
            <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2 mb-2">
              <Gamepad2 className="w-3.5 h-3.5" /> Games
            </div>
            
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-bold shadow-sm text-zinc-800 dark:text-zinc-100 cursor-pointer"
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
                      className="absolute left-0 right-0 mt-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl z-50 max-h-[240px] overflow-y-auto"
                    >
                      {gamesList.map((g) => (
                        <button
                          key={g.slug}
                          onClick={() => {
                            setDropdownOpen(false);
                            router.push(`/game/${g.slug}`);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {g.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setRulesOpen(!rulesOpen)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-bold transition-all duration-200 cursor-pointer ${
                  rulesOpen 
                    ? "border-zinc-400 bg-white text-zinc-955 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                    : "border-zinc-200 bg-white/40 text-zinc-500 hover:bg-white dark:border-zinc-800 dark:bg-zinc-955/40 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {rulesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3.5 pt-3.5 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">How To Play</p>
                    <ul className="space-y-1.5">
                      {game.rules.map((rule, index) => (
                        <li key={index} className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-zinc-400 mt-0.5">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="hidden md:block text-xs font-semibold text-zinc-500 dark:text-zinc-400 leading-relaxed mt-3.5">
              {game.description}
            </p>

            {isCpuGame && game.difficulty && (
              <>
                <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 flex items-center gap-2 mt-4 mb-2">
                  Difficulty
                </div>
                <div className="grid grid-cols-3 gap-1 p-1 bg-white/50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  {(["EASY", "MEDIUM", "HARD"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => game.setDifficulty(mode)}
                      className={`text-[9px] md:text-[10px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                        game.difficulty === mode
                          ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                      }`}
                    >
                      {mode.toLowerCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Center Section: Main Gameplay Core Playfield Container */}
        <section className="w-full lg:col-span-6 order-2 flex flex-col items-center justify-center relative z-10">
          <div className="w-full rounded-[28px] md:rounded-[32px] border border-zinc-200 dark:border-zinc-800/80 bg-amber-50/70 dark:bg-zinc-900/90 p-3 sm:p-5 shadow-sm backdrop-blur-xl flex flex-col items-center">
            
            <div className="w-full flex items-center justify-center min-h-[340px] md:min-h-[380px] p-1 overflow-x-auto">
              {children}
            </div>

            {/* FIXED UX: Collapsed duplicate actions down into one gorgeous, clean primary action anchor */}
            <div className="w-full mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={handleNewGameTrigger}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-slate-800 dark:hover:bg-zinc-100 font-bold text-xs py-3.5 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Clear & Reset Board
              </button>
            </div>
          </div>
        </section>

        {/* Right Side: Scoreboard Status Tracker Only */}
        <section className="w-full lg:col-span-3 order-3 flex flex-col gap-4 relative z-10">
          <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800/80 bg-amber-50/70 dark:bg-zinc-900/90 p-4 shadow-sm flex flex-col backdrop-blur-xl w-full">
            <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
              Match Status
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-955/40 p-2.5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">{game.statusTitle}</span>
              <span className={`text-xs font-extrabold uppercase font-mono ${game.statusColor}`}>
                {game.statusValue}
              </span>
            </div>

            <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mt-4 mb-2">
              Scoreboard
            </div>
            <div className="space-y-1.5">
              {game.scoreboard.map((scoreCard, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/50 dark:bg-zinc-955/40 border border-zinc-200 dark:border-zinc-800/40 p-2.5 rounded-xl">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {scoreCard.label}
                  </span>
                  <span className="text-sm font-black text-zinc-950 dark:text-white font-mono leading-none">
                    {scoreCard.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};