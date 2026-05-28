"use client";

import { motion } from "framer-motion";

export const Sparkles =
  () => {
    return (
      <>
        {[
  {
    bottom: "70px",
    left: "12%",
  },

  {
    bottom: "120px",
    left: "24%",
  },

  {
    bottom: "90px",
    left: "36%",
  },

  {
    bottom: "150px",
    left: "48%",
  },

  {
    bottom: "80px",
    left: "60%",
  },

  {
    bottom: "130px",
    left: "72%",
  },

  {
    bottom: "100px",
    left: "84%",
  },
].map(
  (
    sparkle,
    i
  ) => (
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
        bottom:
          sparkle.bottom,

        left:
          sparkle.left,
      }}
    >
      ✦
    </motion.div>
  )
)}
      </>
    );
  };