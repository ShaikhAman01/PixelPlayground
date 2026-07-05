"use client";

import dynamic from "next/dynamic";
import type { GameId } from "./gameIds";

const GameLoading = () => (
  <div className="flex min-h-[320px] w-full items-center justify-center">
    <div className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-5 py-3 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
      <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        Loading game…
      </span>
    </div>
  </div>
);

// Each game loads in its own chunk so e.g. Wordle's 14k-line word list
// never ships to players of the other games.
const games: Record<GameId, React.ComponentType> = {
  tictactoe: dynamic(
    () => import("@/components/game/SoloTicTacToe").then((m) => m.SoloTicTacToe),
    { loading: GameLoading }
  ),
  connect4: dynamic(
    () => import("@/components/game/SoloConnect4").then((m) => m.SoloConnect4),
    { loading: GameLoading }
  ),
  wordle: dynamic(
    () => import("@/components/game/WordleGame").then((m) => m.WordleGame),
    { loading: GameLoading }
  ),
  colormemory: dynamic(
    () => import("@/components/game/ColorMemory").then((m) => m.ColorMemory),
    { loading: GameLoading }
  ),
  slidepuzzle: dynamic(
    () => import("@/components/game/SlidePuzzle").then((m) => m.SlidePuzzle),
    { loading: GameLoading }
  ),
  game2048: dynamic(
    () => import("@/components/game/Game2048").then((m) => m.Game2048),
    { loading: GameLoading }
  ),
};

export const GameHost = ({ gameId }: { gameId: GameId }) => {
  const GameComponent = games[gameId];
  return <GameComponent />;
};
