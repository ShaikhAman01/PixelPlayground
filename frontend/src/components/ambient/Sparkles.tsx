"use client";

import { motion } from "framer-motion";

export const Sparkles =
  () => {
    return (
      <>
        {Array.from({
          length: 18,
        }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [
                0.2,
                1,
                0.2,
              ],

              scale: [
                0.8,
                1.2,
                0.8,
              ],
            }}
            transition={{
              duration:
                2 +
                Math.random() *
                  4,

              repeat:
                Infinity,

              delay:
                Math.random() *
                5,
            }}
            className="absolute text-white/80"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            ✦
          </motion.div>
        ))}
      </>
    );
  };