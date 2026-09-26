import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_REPO } from "@/lib/links";

export const metadata: Metadata = {
  title: "About",
  description:
    "PixelPlayground is a cozy six game browser arcade built with Next.js, Hono on Cloudflare Workers and D1. No ads, no signup wall, one developer.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <main className="pp-rise w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="text-center select-none mb-8">
          <h1 className="pixel-font text-2xl font-black uppercase tracking-wide text-slate-900 dark:text-slate-50">
            About The Arcade
          </h1>
          <p className="mt-2 text-xs font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Pure gameplay, zero distractions
          </p>
        </div>

        {/* Informational Prose Stage Layout */}
        <div className="space-y-6 font-sans text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            Welcome to a small hub built for people who still like classic web games. The clutter is deliberately
            missing: no banner ads, no newsletter popup, no signup wall between you and the first move. You get a guest
            name the second you arrive and you can start playing.
          </p>
          <p>
            Every board here, from <span className="text-violet-500 font-bold">Tic Tac Toe</span> to{" "}
            <span className="text-teal-500 font-bold">Wordle</span>, is drawn with plain web elements rather than
            images, so it stays sharp at any size and runs well on a tired laptop. The games themselves play out
            entirely in your browser. When a round ends, the result travels to a small Cloudflare Worker so streaks and
            leaderboards have somewhere to live, and if that server is unreachable the games carry on regardless.
          </p>

          <div className="border-t border-b border-slate-100 dark:border-slate-800/60 py-4 my-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">6</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Games Available</p>
            </div>
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">0</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Ads Ever</p>
            </div>
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">1</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Developer</p>
            </div>
          </div>

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 pt-2">
            The Philosophy
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            The objective is simple: celebrate core gaming mechanics through a beautiful interface. Web software can be
            genuinely well engineered and still feel cozy. The whole thing is a portfolio project, the code is open on{" "}
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className="font-bold text-violet-600 dark:text-violet-300 underline underline-offset-2"
            >
              GitHub
            </a>
            , and what gets stored about you is written out plainly in the{" "}
            <Link
              href="/privacy"
              className="font-bold text-violet-600 dark:text-violet-300 underline underline-offset-2"
            >
              privacy policy
            </Link>
            .
          </p>
        </div>

        <Link href="/" className="block w-full mt-8">
          <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm cursor-pointer">
            Return to Dashboard
          </button>
        </Link>
      </main>
    </div>
  );
}
