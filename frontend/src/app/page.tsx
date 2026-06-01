import { GameCard } from "@/components/game/GameCard";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { TopBar } from "@/components/layout/TopBar";
import { games } from "@/data/games";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex flex-col bg-[#F1F5F9]">
      <AmbientBackground />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col flex-1 px-8 pt-6 pb-20 justify-between gap-12">
        
        <TopBar />

        {/* System Dashboard Callout Header */}
        <section className="flex flex-col items-center justify-center text-center my-auto">
          <div className="bg-white/40 border border-white/60 px-4 py-1 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.01)] backdrop-blur-sm mb-4">
            <span className="text-[10px] font-bold tracking-widest uppercase text-violet-600/90">
              Personal Play Space v1.0
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            PixelPlayground
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
            A minimalist workspace built for quick, clean breaks. Choose a module below to start a localized single-player session against the CPU.
          </p>
        </section>

        {/* Dashboard Modules Workspace Dock */}
        <section className="w-full">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 auto-rows-fr">
            {games.map((game) => (
              <GameCard 
                key={game.id} 
                id={game.id}
                title={game.title}
                description={game.description}
                color={game.color}
                iconName={game.iconName} // Ensure your data configuration provides an icon name (e.g., "Grid", "Hash", "Layers")
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}