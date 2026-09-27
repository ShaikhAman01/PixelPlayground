import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Pick a game instead.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <main id="main-content" tabIndex={-1} className="pp-rise w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="text-center select-none mb-8">
          <p className="pixel-font text-6xl sm:text-7xl font-black text-slate-900 dark:text-slate-50 leading-none">
            404
          </p>
          <h1 className="pixel-font mt-4 text-xl font-black uppercase tracking-wide text-slate-900 dark:text-slate-50">
            Nothing To Play Here
          </h1>
          <p className="mt-3 text-xs sm:text-sm font-sans font-medium text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            This page wandered off, or it never existed. The cat is not telling. Here is the whole arcade instead.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-sans">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 px-3 py-3 text-center hover:border-slate-400 dark:hover:border-slate-600 hover:-translate-y-0.5 transition-all"
            >
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{game.title}</span>
              <span className="block mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {game.description}
              </span>
            </Link>
          ))}
        </div>

        <Link href="/" className="block w-full mt-8">
          <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm cursor-pointer">
            Back To The Arcade
          </button>
        </Link>
      </main>
    </div>
  );
}
