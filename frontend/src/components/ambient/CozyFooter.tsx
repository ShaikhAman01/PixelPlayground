"use client";

import { motion } from "framer-motion";

export const CozyFooter = () => {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] overflow-hidden select-none">
      {/* Deep Atmosphere Horizon Glow Blend */}
      <div className="absolute bottom-0 h-48 w-full bg-gradient-to-t from-[#f5dfde]/50 via-[#e3d1fc]/20 to-transparent dark:from-[#3b0764]/10 dark:via-[#1e1b4b]/10 transition-colors duration-500" />

      {/* Layer 1: Distant Low Horizon Slopes */}
      <div 
        className="absolute bottom-[40px] left-0 right-0 h-28 bg-gradient-to-t from-violet-200/40 to-violet-100/20 dark:from-violet-950/20 dark:to-transparent opacity-60 transition-colors duration-500"
        style={{ clipPath: "ellipse(60% 100% at 20% 100%)" }}
      />
      <div 
        className="absolute bottom-[35px] left-0 right-0 h-32 bg-gradient-to-t from-pink-200/40 to-pink-100/20 dark:from-pink-950/15 dark:to-transparent opacity-50 transition-colors duration-500"
        style={{ clipPath: "ellipse(55% 100% at 85% 100%)" }}
      />

      {/* Layer 2: Clean Water Horizon Mirror Block */}
      <div className="absolute bottom-0 h-16 w-full bg-gradient-to-t from-white/30 via-sky-100/20 to-transparent dark:from-sky-950/10 border-t border-white/20 dark:border-white/5 backdrop-blur-[1px] transition-colors duration-500" />

      {/* Layer 3: Sharp Geometric Foreground Structural Land Base */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-12 bg-white/20 dark:bg-slate-900/30 border-t border-white/50 dark:border-white/10 shadow-[inset_0_4px_12px_rgba(255,255,255,0.4)] dark:shadow-none transition-colors duration-500"
        style={{ clipPath: "polygon(0 30%, 15% 15%, 35% 25%, 60% 5%, 80% 20%, 100% 0%, 100% 100%, 0 100%)" }}
      />

      {/* Vector Production Asset Replacement: Sleek Resting Minimalist Cat Silhouette */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 right-16 text-slate-500/60 dark:text-slate-400/40 drop-shadow-sm transition-colors duration-500"
      >
        <svg width="32" height="24" viewBox="0 0 24 16" fill="currentColor">
          <path d="M20 10c0-2.2-1.8-4-4-4h-2.7c-.5-1.5-1.9-2.5-3.5-2.5S6.7 4.5 6.2 6H5c-2.2 0-4 1.8-4 4s1.8 4 4 4h11c2.2 0 4-1.8 4-4zm-13.5-2c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm5 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
          <path d="M19 6.5s1.5-2.5 2.5-2.5.5 1.5.5 2.5h-3z" />
        </svg>
      </motion.div>

      {/* Ambient Micro-Lantern Lighting Source Pod */}
      <div className="absolute bottom-4 left-14 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-16 w-16 rounded-full bg-amber-300/40 dark:bg-amber-500/20 blur-xl transition-colors duration-500"
        />
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="text-slate-600/80 dark:text-slate-400/60 drop-shadow-sm transition-colors duration-500">
          <path d="M3 5h8v10H3V5z" fill="#FEF3C7" className="dark:fill-amber-950/40" />
          <path d="M2 3h10v2H2V3zm1 12h8v2H3v-2zm4-14C4.5 1 1 3.5 1 6h12c0-2.5-3.5-5-6-5z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 5v10M9 5v10" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};