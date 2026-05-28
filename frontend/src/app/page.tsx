import { GameCard } from "@/components/game/GameCard";

import { AmbientBackground } from "@/components/layout/AmbientBackground";

import { TopBar } from "@/components/layout/TopBar";

import { games } from "@/data/games";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <AmbientBackground />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col px-8 py-8">
        {/* Navbar */}
        <TopBar />

        {/* Hero */}
        <section className="mt-20 text-center">
          <h1 className="font-[family:var(--font-pixel)] text-6xl text-slate-700">
            PixelPlayground
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            cozy games, dreamy vibes,
            and relaxing little worlds
            to spend time in ✨
          </p>
        </section>

        {/* Games */}
        <section className="mt-20">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {games.map(
              (game) => (
                <GameCard
                  key={game.id}
                  {...game}
                />
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}