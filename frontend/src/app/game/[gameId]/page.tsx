import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { GameHost } from "@/games/GameHost";
import { GameScene } from "@/components/scene/GameScene";
import { GAME_IDS, isGameId, type GameId } from "@/games/gameIds";

interface Props {
  params: Promise<{
    gameId: string;
  }>;
}

const OG_ALT = "PixelPlayground, a cozy lofi browser arcade";

const GAME_META: Record<GameId, { title: string; description: string }> = {
  tictactoe: {
    title: "Tic Tac Toe",
    description:
      "Play Tic Tac Toe in your browser against an AI opponent on easy, medium or hard. Free, no signup, and your wins count towards the leaderboard.",
  },
  connect4: {
    title: "Connect 4",
    description:
      "Drop your discs and line up four before the computer does. Three difficulty levels, instant play in the browser, wins tracked on the leaderboard.",
  },
  wordle: {
    title: "Wordle",
    description:
      "A daily five letter word puzzle with six guesses. Keep a streak going day after day and see how it ranks against everyone else's.",
  },
  colormemory: {
    title: "Color Memory",
    description:
      "Watch the color sequence, repeat it back, then do it again one step longer. A simple memory game that gets brutal around level ten.",
  },
  slidepuzzle: {
    title: "Slide Puzzle",
    description:
      "The classic sliding tile puzzle. Rearrange the tiles into order in as few moves as you can, because this leaderboard ranks on time.",
  },
  game2048: {
    title: "2048",
    description:
      "Swipe to merge matching tiles and chase the 2048 tile. Your board is saved between visits and your best score goes on the leaderboard.",
  },
};

export function generateStaticParams() {
  return GAME_IDS.map((gameId) => ({ gameId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gameId } = await params;
  if (!isGameId(gameId)) {
    return { title: "Game not found" };
  }

  const { title, description } = GAME_META[gameId];
  const path = `/game/${gameId}`;

  // Spelling the image out again: a route that sets its own openGraph block
  // does not pick up the root opengraph-image file on its own.
  const images = [{ url: "/opengraph-image", width: 1200, height: 630, alt: OG_ALT }];

  return {
    title: `Play ${title}`,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `Play ${title} · PixelPlayground`,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `Play ${title} · PixelPlayground`,
      description,
      images,
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { gameId } = await params;

  if (!isGameId(gameId)) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1} className="relative min-h-screen lg:h-dvh lg:max-h-dvh w-full overflow-x-hidden lg:overflow-hidden flex flex-col transition-all duration-500">

      {/* The painting, split into layers that move on their own */}
      <GameScene />

      {/* Background Overlay Layer */}
      <div className="absolute inset-0 bg-indigo-950/5 dark:bg-indigo-950/20 pointer-events-none z-10" />

      {/* Main Structural Application Grid Container */}
      <div className="relative z-20 mx-auto flex h-auto lg:h-full w-full max-w-[1280px] flex-col px-3 sm:px-4 md:px-8 pt-20 md:pt-28 pb-6 lg:overflow-hidden">

        <TopBar />

        {/* Dynamic Game Component Display Frame */}
        <div className="flex flex-1 flex-col items-center justify-start lg:justify-center overflow-y-auto lg:overflow-hidden mt-4 lg:mt-0 w-full">
          <GameHost gameId={gameId} />
        </div>

      </div>
    </main>
  );
}
