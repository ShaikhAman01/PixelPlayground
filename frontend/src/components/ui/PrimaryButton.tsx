"use client";

import { motion } from "framer-motion";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;

  onClick?: () => void;

  className?: string;
}

export const PrimaryButton =
  ({
    children,
    onClick,
    className = "",
  }: Props) => {
    return (
      <motion.button
        whileHover={{
          scale: 1.03,
        }}
        whileTap={{
          scale: 0.97,
        }}
        onClick={onClick}
        className={`rounded-2xl bg-violet-400 px-6 py-4 font-medium text-white shadow-lg shadow-violet-200 transition hover:bg-violet-500 ${className}`}
      >
        {children}
      </motion.button>
    );
  };