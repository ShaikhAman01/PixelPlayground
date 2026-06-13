"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-[32px] border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
      >
        <div className="text-center select-none mb-8">
          <h1 className="pixel-font text-2xl font-black uppercase tracking-wide text-slate-900 dark:text-slate-50">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs font-sans font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Agreement & Scope of Use
          </p>
        </div>

        <div className="space-y-6 font-sans text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 h-96 overflow-y-auto pr-2 border-b border-slate-100 dark:border-slate-800/60 custom-scrollbar">
          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the interactive applications on this platform, you agree to interact with the platform layout cleanly and strictly within standard client browser limits. No registration or operational authentication protocols are required to interact with these features.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              2. Fair Play License Parameters
            </h2>
            <p>
              Users are permitted full operational interaction with all game logic systems. However, any attempt to inject reverse malicious scripts, exploit baseline framework architectures, execute automation script matrices, or inject denial of platform tasks to degrade the host ecosystem for other operators is explicitly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              3. Operational Availability & Disclaimers
            </h2>
            <p>
              This suite is distributed entirely as-is, as a sandbox environment built for simple personal amusement. No architectural uptime configurations, state serialization save guarantees, or operational validation metrics are promised. The platform maintainer is not liable for data drops or device-specific layout configurations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
              4. Complete Agreement Clause
            </h2>
            <p>
              These points summarize the entire operational understanding boundary between users and the web engine workspace context. No other implicit usage agreements are active.
            </p>
          </section>
        </div>

        <Link href="/" className="block w-full mt-8">
          <button className="w-full rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-50 py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-sm cursor-pointer">
            Accept & Continue
          </button>
        </Link>
      </motion.main>
    </div>
  );
}