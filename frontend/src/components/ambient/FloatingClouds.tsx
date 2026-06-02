"use client";

import { motion } from "framer-motion";

export const FloatingClouds = () => {
  const cloudData = [
    { initialX: "10%", top: "18%", scale: 1, duration: 25, reverse: false },
    { initialX: "65%", top: "28%", scale: 0.85, duration: 32, reverse: true },
    { initialX: "25%", top: "42%", scale: 0.7, duration: 28, reverse: false },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {cloudData.map((cloud, index) => (
        <motion.div
          key={index}
          style={{ left: cloud.initialX, top: cloud.top, scale: cloud.scale }}
          animate={{ x: cloud.reverse ? [0, -40, 0] : [0, 40, 0] }}
          transition={{ duration: cloud.duration, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
        >
          {/* High-fidelity procedural vector cloud structure */}
          <div className="relative w-48 h-12 bg-white/30 dark:bg-violet-950/10 backdrop-blur-[2px] rounded-full shadow-[inset_0_4px_12px_rgba(255,255,255,0.4)] dark:shadow-none transition-colors duration-500">
            <div className="absolute -top-6 left-8 w-16 h-16 bg-white/30 dark:bg-violet-950/10 backdrop-blur-[2px] rounded-full" />
            <div className="absolute -top-4 left-20 w-12 h-12 bg-white/30 dark:bg-violet-950/10 backdrop-blur-[2px] rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};