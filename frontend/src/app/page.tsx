import { GameCard } from "@/components/game/GameCard";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { games } from "@/data/games";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-cover bg-top bg-no-repeat transition-all duration-500 bg-[url('/background/bg-long.png')] dark:bg-[url('/background/bg-long-dark.png')]">
      {/* Atmosphere */}
      <div className="absolute inset-0 bg-indigo-950/[0.01] dark:bg-indigo-950/15 pointer-events-none z-0" />

      {/* Water Glow */}
      <div className="absolute left-1/2 top-[26rem] -translate-x-1/2 w-[700px] h-[260px] rounded-full blur-[120px] bg-pink-300/10 dark:bg-violet-400/10 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col px-4 sm:px-8 pt-28">
        <TopBar />

        {/* HERO */}
        <section className="relative flex flex-col items-center justify-center text-center w-full max-w-[660px] mx-auto mt-16 mb-6 select-none">
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-center -translate-y-[44%] pointer-events-none">
            <div className="animate-breathing">
              <Image
                src="/hero/cat.png"
                alt="Peeking Cat"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="w-full p-8 pt-20 flex flex-col items-center z-10">
            <h1 className="pixel-font text-4xl sm:text-5xl font-black tracking-widest text-slate-800 dark:text-indigo-50 uppercase leading-none">
              PIXEL<br />PLAYGROUND
            </h1>

            <div className="mt-4 text-lg text-pink-500 animate-pulse">❤️</div>

            <p className="mx-auto mt-4 max-w-md text-xs sm:text-sm font-mono font-medium text-slate-600/90 dark:text-indigo-200/70 tracking-wide leading-relaxed">
              cozy games for peaceful breaks and late-night gaming sessions ✨
            </p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="rounded-xl border border-white/50 dark:border-white/10 bg-white/30 dark:bg-indigo-950/30 backdrop-blur-sm px-3 py-2 text-xs font-bold text-slate-700 dark:text-indigo-100">
                🎮 {games.length} Games
              </div>
              <div className="rounded-xl border border-white/50 dark:border-white/10 bg-white/30 dark:bg-indigo-950/30 backdrop-blur-sm px-3 py-2 text-xs font-bold text-slate-700 dark:text-indigo-100">
                🎵 Chill Music
              </div>
              <div className="rounded-xl border border-white/50 dark:border-white/10 bg-white/30 dark:bg-indigo-950/30 backdrop-blur-sm px-3 py-2 text-xs font-bold text-slate-700 dark:text-indigo-100">
                ✨ Cozy Arcade
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-[380px]">
              <Link href="/game/tictactoe" className="w-full">
                <button className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer">
                  🎮 Start Playing
                </button>
              </Link>

              <a href="#featured-arcade" className="w-full">
                <button className="w-full rounded-2xl bg-white/90 border border-slate-200/60 hover:bg-white text-slate-700 dark:bg-slate-900/80 dark:border-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-900 py-3.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-1 shadow-sm cursor-pointer">
                  🎯 Browse Games
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        {/* FIXED: Swapped out standard static mt-[8rem] for responsive mt-28 sm:mt-[15rem] 
            to guarantee header assets won't collide on mobile displays */}
        <section id="featured-arcade" className="relative z-10 w-full px-4 mt-28 sm:mt-[15rem] scroll-mt-24">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-5 mb-10 w-full max-w-xl">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-400/70 to-transparent" />
              <h2 className="pixel-font text-xl sm:text-2xl font-black text-white uppercase tracking-[0.18em] whitespace-nowrap drop-shadow-[0_2px_4px_rgba(15,44,117,0.6)]">
                FEATURED GAMES
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-400/70 to-transparent" />
            </div>

            <div className="w-full grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1040px] mx-auto pb-12">
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

        <div className="mt-20">
          <Footer />
        </div>
      </div>
    </main>
  );
}