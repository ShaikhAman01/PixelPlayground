import { GameCard } from "@/components/game/GameCard";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { TopBar } from "@/components/layout/TopBar";
import { games } from "@/data/games";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col bg-[#F1F5F9] dark:bg-slate-950 transition-colors duration-300">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col flex-1 px-8 pt-6 pb-20 justify-between gap-12">
        
        <TopBar />

        {/* Server-Rendered Content Node */}
        <section className="flex flex-col items-center justify-center text-center my-auto mt-12">
          <div className="bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 px-4 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.01)] backdrop-blur-sm mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-violet-600/90 dark:text-violet-400">
              Personal Play Space v1.0
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl font-[family:var(--font-pixel)]">
            PixelPlayground
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            cozy games, dreamy vibes, and relaxing little worlds to spend time in ✨
          </p>
        </section>

        {/* Modules Docks */}
        <section className="w-full">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 auto-rows-fr">
            {games.map((game) => (
              <GameCard 
                key={game.id} 
                id={game.id}
                title={game.title}
                description={game.description}
                color={game.color}
                iconName={game.iconName}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}