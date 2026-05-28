import { notFound } from "next/navigation";

import { AmbientBackground } from "@/components/layout/AmbientBackground";

import { TopBar } from "@/components/layout/TopBar";

import { gameRegistry } from "@/games/gameRegistry";

interface Props {
  params: Promise<{
    gameId: string;
  }>;
}

export default async function GamePage({
  params,
}: Props) {
  const { gameId } =
    await params;

  const isValidGameId =
    gameId in gameRegistry;

  if (!isValidGameId) {
    notFound();
  }

  const game =
    gameRegistry[
      gameId as keyof typeof gameRegistry
    ];

  const GameComponent =
    game.component;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <AmbientBackground />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col px-8 py-8">
        {/* Navbar */}
        <TopBar />

        {/* Game */}
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* Title */}
          <h1 className="mb-12 font-[family:var(--font-pixel)] text-5xl text-slate-700">
            {game.title}
          </h1>

          {/* Game */}
          <GameComponent />
        </div>
      </div>
    </main>
  );
}