"use client";

import { GameCard } from "@/components/game/GameCard";
import { Footer } from "@/components/layout/Footer";
import { useMode } from "@/components/providers/ModeProvider";
import { ChillDashboard } from "@/components/chill/ChillDashboard";
import { games } from "@/data/games";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { mode } = useMode();
  const isChillActive = mode === "chill";

  return (
    <>
      <AnimatePresence mode="wait">
        {isChillActive && <ChillDashboard />}
      </AnimatePresence>

      <main
        className={`relative min-h-screen w-full overflow-x-hidden flex flex-col bg-cover bg-top bg-no-repeat transition-all duration-700 bg-[url('/background/bg-long2.png')] dark:bg-[url('/background/bg-long-dark2.png')] font-sans ${
          isChillActive
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 bg-slate-950/[0.01] dark:bg-slate-950/10 pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col px-4 sm:px-8 pt-28">
          <section className="relative flex flex-col items-center justify-center text-center w-full max-w-[640px] mx-auto mt-20 mb-6 select-none animate-fade-in">
            <div className="absolute top-0 left-0 right-0 z-20 flex justify-center -translate-y-[44%] pointer-events-none">
              <div className="animate-breathing">
                <Image
                  src="/hero/cat.png"
                  alt="Peeking Cat"
                  width={110}
                  height={110}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="w-full rounded-[28px] border border-white/15 dark:border-white/5 bg-white/[0.04] dark:bg-slate-950/[0.06] backdrop-blur-xl p-8 pt-16 flex flex-col items-center z-10 shadow-[0_8px_32px_rgba(15,23,42,0.02)]">
              <h1 className="pixel-font text-4xl sm:text-5xl font-black tracking-normal text-slate-800 dark:text-slate-100 uppercase leading-none">
                PIXEL
                <br />
                PLAYGROUND
              </h1>

              <p className="mx-auto mt-5 max-w-sm text-xs sm:text-sm font-sans font-medium text-slate-600/90 dark:text-slate-300/90 tracking-wide leading-relaxed">
                Cozy games for peaceful breaks and late-night gaming sessions.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2.5 font-sans">
                <div className="rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-slate-900/20 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {games.length} Games
                </div>
                <div className="rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-slate-900/20 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chill Music
                </div>
                <div className="rounded-xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-slate-900/20 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                  Cozy Arcade
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-[360px] font-sans">
                <Link href="/game/tictactoe" className="w-full">
                  <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.99] cursor-pointer shadow-sm">
                    Start Playing
                  </button>
                </Link>

                <a href="#featured-arcade" className="w-full">
                  <button className="w-full rounded-xl bg-white/60 border border-slate-200/60 dark:bg-transparent dark:border-white/20 text-slate-700 dark:text-white hover:bg-white/80 dark:hover:bg-white/5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-[0.99] cursor-pointer">
                    Browse Games
                  </button>
                </a>
              </div>
            </div>
          </section>

          <section
            id="featured-arcade"
            className="relative z-10 w-full px-4 mt-28 sm:mt-[15rem] scroll-mt-24"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-5 mb-10 w-full max-w-xl">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
                <h2 className="pixel-font text-xl sm:text-2xl font-black text-white dark:text-white uppercase tracking-[0.18em] whitespace-nowrap">
                  FEATURED GAMES
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
              </div>

              <div className="w-full grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1040px] mx-auto pb-12">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    title={game.title}
                    description={game.description}
                    isChillMode={false}
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
    </>
  );
}