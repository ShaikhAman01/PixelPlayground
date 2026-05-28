"use client";

import Link from "next/link";

import { motion } from "framer-motion";

interface Props {
  id: string;

  title: string;

  description: string;

  emoji: string;

  color: string;
}

export const GameCard =
  ({
    id,
    title,
    description,
    emoji,
    color,
  }: Props) => {
    return (
      <Link
        href={`/game/${id}`}
      >
        <motion.div
          whileHover={{
            y: -6,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
          }}
          className="
            group
            relative
            overflow-hidden
            rounded-[36px]
            border
            border-white/60
            bg-white/60
            p-6
            shadow-[0_10px_40px_rgba(0,0,0,0.05)]
            backdrop-blur-xl
          "
        >
          {/* Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-30`}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Emoji */}
            <div
              className={`mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br ${color} text-4xl shadow-inner`}
            >
              {emoji}
            </div>

            {/* Title */}
            <h3 className="font-[family:var(--font-pixel)] text-2xl text-slate-700">
              {title}
            </h3>

            {/* Desc */}
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {description}
            </p>
          </div>
        </motion.div>
      </Link>
    );
  };