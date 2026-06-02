"use client";

import { motion } from "framer-motion";

const points = [
  { bottom: "11%", left: "14%" },
  { bottom: "16%", left: "28%" },
  { bottom: "13%", left: "42%" },
  { bottom: "18%", left: "56%" },
  { bottom: "12%", left: "70%" },
  { bottom: "17%", left: "84%" },
];

export const Sparkles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {points.map((coords, i) => (
        <motion.div
          key={i}
          style={{ bottom: coords.bottom, left: coords.left }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [0.8, 1.1, 0.8],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3.5 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute text-violet-400/60"
        >
          {/* SVG Vector Cross Star Pattern */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};