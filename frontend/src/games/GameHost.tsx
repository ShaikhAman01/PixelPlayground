"use client";

import dynamic from "next/dynamic";
import type { GameId } from "./gameIds";
import { CatLoader } from "@/components/ui/CatLoader";

const GameLoading = () => <CatLoader />;

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
