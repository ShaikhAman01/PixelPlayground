"use client";

import { motion } from "framer-motion";

export const CozyFooter =
  () => {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[260px] overflow-hidden">
        {/* Horizon Glow */}
        <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-[#f6d7d9]/60 via-[#eadcff]/30 to-transparent" />

        {/* Water Reflection */}
        <div className="absolute bottom-0 h-28 w-full bg-gradient-to-t from-sky-100/40 to-transparent backdrop-blur-sm" />

        {/* Mountain Layer 1 */}
        <div className="absolute bottom-20 left-[-10%] h-40 w-[45%] rounded-[100%] bg-violet-200/30 blur-2xl" />

        <div className="absolute bottom-16 right-[-5%] h-44 w-[40%] rounded-[100%] bg-pink-200/30 blur-2xl" />

        {/* Mountain Layer 2 */}
        <div className="absolute bottom-8 left-[20%] h-32 w-[35%] rounded-[100%] bg-sky-100/20 blur-2xl" />

        {/* Floating Sparkles */}
        {Array.from({
          length: 10,
        }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [
                0.2,
                1,
                0.2,
              ],

              y: [0, -6, 0],
            }}
            transition={{
              duration:
                3 + i,
              repeat:
                Infinity,
            }}
            className="absolute text-white/80"
            style={{
              bottom: `${40 + Math.random() * 120}px`,
              left: `${Math.random() * 100}%`,
            }}
          >
            ✦
          </motion.div>
        ))}

        {/* Tiny Cat Silhouette */}
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-16 opacity-70"
        >
          <div className="text-4xl">
            🐈
          </div>
        </motion.div>

        {/* Tiny Lantern Glow */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
          className="absolute bottom-12 left-14"
        >
          <div className="h-10 w-10 rounded-full bg-amber-200 blur-xl" />
        </motion.div>
      </div>
    );
  };