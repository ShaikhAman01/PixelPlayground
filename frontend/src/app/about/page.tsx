"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
      >
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
            Welcome to a minimalist hub crafted for lovers of classic web gaming. This space was engineered to strip away the clutter of modern web platforms—no flashing banner advertisements, no forced account signups, and no heavy asset tracking scripts. 
          </p>
          <p>
            Every single application here—from <span className="text-violet-500 font-bold">Tic Tac Toe</span> to <span className="text-teal-500 font-bold">Wordle</span>—runs completely on lightweight, Client-side state engines. By rendering boards using pure native web code instead of image frameworks, these games scale infinitely sharp and run with blistering hardware efficiency.
          </p>

          <div className="border-t border-b border-slate-100 dark:border-slate-800/60 py-4 my-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">6</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Games Available</p>
            </div>
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">0ms</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Network Delay</p>
            </div>
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white">100%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Privacy First</p>
            </div>
          </div>

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 pt-2">
            The Philosophy
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            The objective of this suite is simple: celebrate core gaming mechanics through beautiful user interfaces. We believe web software can be structurally powerful while embracing cozy, minimalist design principles.
          </p>
        </div>

        <Link href="/" className="block w-full mt-8">
          <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm cursor-pointer">
            Return to Dashboard
          </button>
        </Link>
      </motion.main>
    </div>
  );
}