"use client";

import { motion } from "framer-motion";

export const FloatingClouds =
  () => {
    return (
      <>
        {/* Cloud 1 */}
        <motion.div
          animate={{
            x: [0, 30, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[8%] top-[20%]"
        >
          <div className="h-20 w-44 rounded-full bg-white/40 blur-2xl" />
        </motion.div>

        {/* Cloud 2 */}
        <motion.div
          animate={{
            x: [0, -25, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-[30%]"
        >
          <div className="h-24 w-52 rounded-full bg-pink-100/40 blur-2xl" />
        </motion.div>

        {/* Cloud 3 */}
        <motion.div
          animate={{
            x: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[18%] left-[20%]"
        >
          <div className="h-24 w-60 rounded-full bg-sky-100/30 blur-2xl" />
        </motion.div>
      </>
    );
  };