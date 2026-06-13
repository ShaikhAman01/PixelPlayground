"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
      >
        <div className="text-center select-none mb-8">
          <h1 className="pixel-font text-2xl font-black uppercase tracking-wide text-slate-900 dark:text-slate-50">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Last Updated: June 2026
          </p>
        </div>

        <div className="space-y-6 font-sans text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 h-96 overflow-y-auto pr-2 border-b border-slate-100 dark:border-slate-800/60 custom-scrollbar">
          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              1. Absolute Data Minimization
            </h2>
            <p>
              Your data belongs entirely to you. This gaming platform is engineered intentionally to operate without harvesting, tracking, or transmitting any personal identifier elements. We do not use user tracking profiles, behavior analytics tools, or marketing trackers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              2. Client-Side Mechanics & Storage
            </h2>
            <p>
              All application states, metrics matching calculations, move historical trees, and high-score logs operate inside your local machine viewport. If score parameters or local game layouts persist between reloads, they are written strictly to your device web workspace engine via local client-side memory frameworks. No transactional packets are written to remote servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              3. Third-Party Interfaces
            </h2>
            <p>
              Because this arcade does not establish server connection networks for baseline games, your environment operates strictly isolated. No data loops are shared, sold, or broadcasted to any external networks or advertising matrices under any circumstances.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              4. Changes to This Policy
            </h2>
            <p>
              As this workspace is fundamentally complete and non-tracking, future architectural shifts are not expected to change our baseline core privacy policies. Any future structural logic changes will remain strictly inside local operational parameters.
            </p>
          </section>
        </div>

        <Link href="/" className="block w-full mt-8">
          <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm cursor-pointer">
            Acknowledge & Go Back
          </button>
        </Link>
      </motion.main>
    </div>
  );
}