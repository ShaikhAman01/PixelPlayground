"use client";

import { motion } from "framer-motion";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const PageTransition =
  ({
    children,
  }: Props) => {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    );
  };