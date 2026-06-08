import { GameCard } from "@/components/game/GameCard";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { games } from "@/data/games";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main 
      className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-cover bg-top bg-no-repeat pb-24 transition-all duration-500 bg-[url('/background/bg-long.png')] dark:bg-[url('/background/bg-long-dark.png')]"
    >
      {/* Ambient overlay depth tint shifting dynamically under dark mode states */}
      <div className="absolute inset-0 bg-pink-100/5 dark:bg-indigo-950/20 pointer-events-none z-0" />

      {/* Main layout flow wrapper container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col px-8 pt-6 gap-16">
        
        {/* GLOBAL HEADER BAR NAVBAR */}
        <TopBar />

        {/* ================= SECTION 1: HERO MODULE ================= */}
        <section className="relative flex flex-col items-center justify-center text-center w-full max-w-[700px] mx-auto scale-90 sm:scale-100 mt-6 mb-8">
          
          {/* Peeking Cat Asset */}
          <div className="absolute -top-12 z-20 flex justify-center w-full">
            <Image 
              src="/hero/cat.png"
              alt="Cozy Cat Peeking"
              width={160} 
              height={160}
              className="object-contain"
            />
          </div>

          <div className="w-full p-10 pt-16 flex flex-col items-center z-10">
            
            {/* Main Branding Title */}
            <h1 className="pixel-font text-5xl font-extrabold tracking-widest text-[#32354A] dark:text-indigo-100 uppercase font-mono leading-none transition-colors duration-300">
              PIXEL<br/>PLAYGROUND
            </h1>

            {/* Pulsing heart indicator */}
            <div className="mt-4 text-xl text-pink-500 select-none animate-pulse">
              ❤️
            </div>

            {/* Cozy Description Block */}
            <p className="mx-auto mt-4 max-w-xl text-xs md:text-sm text-slate-600 dark:text-indigo-200/80 font-semibold leading-relaxed transition-colors duration-300">
              cozy games for peaceful breaks and late-night gaming sessions ✨
            </p>

            {/* Hero Action Button Deck */}
            <div className="mt-8 flex flex-col items-center gap-3.5 w-full max-w-[280px]">
              <Link href="/browse" className="w-full">
                <button
                  className="w-full rounded-2xl bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white py-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                >
                  <span className="text-sm">🎮</span> Start Playing
                </button>
              </Link>

              <button
                className="w-full rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/60 py-3 text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                <span className="text-sm">🎲</span> Browse Games
              </button>
            </div>
          </div>
        </section>
        {/* ================= END SECTION 1 ================= */}


        {/* ================= SECTION 2: FEATURED GAMES ================= */}
        <section className="relative z-10 w-full p-8 sm:p-12 mt-[12rem]">
          <div className="flex flex-col items-center">
            
            {/* Featured Header Label Title */}
            <div className="flex items-center gap-2 mb-10 select-none">
              <span className="text-pink-500 dark:text-pink-400 animate-pulse text-xl">✦</span>
              <h2 className="pixel-font text-2xl sm:text-3xl font-black text-[#32354A] dark:text-indigo-100 uppercase tracking-widest text-center transition-colors duration-300">
                Featured Games
              </h2>
              <span className="text-pink-500 dark:text-pink-400 animate-pulse text-xl">✦</span>
            </div>

            {/* Handheld Grid Deck */}
            <div className="w-full grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1000px] mx-auto">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  description={game.description}
                />
              ))}
            </div>
          </div>
        </section>
        {/* ================= END SECTION 2 ================= */}

        {/* ================= SECTION 3: SEAMLESS FOOTER SECTION ================= */}
        <Footer />
        {/* ================= END SECTION 3 ================= */}
      </div>
    </main>
  );
}