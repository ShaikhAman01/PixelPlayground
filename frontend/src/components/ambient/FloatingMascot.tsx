"use client";

import { motion } from "framer-motion";

export const FloatingMascot =
  () => {
    return (
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 right-[14%] hidden xl:block"
      >
        <div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
          <div className="text-center">
            <div className="text-6xl">
              🐱
            </div>

            <p className="mt-3 text-sm text-slate-500">
              cozy vibes only
            </p>
          </div>
        </div>
      </motion.div>
    );
  };