"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface Props {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  color: string;
}

export const GameCard = ({ id, title, description, iconName = "Gamepad2", color }: Props) => {
  const LucideIcon = (Icons as any)[iconName] || Icons.Gamepad2;

  return (
    <Link href={`/game/${id}`} className="h-full block">
      <motion.div
        whileHover={{
          y: -6,
          scale: 1.01,
          transition: { type: "spring", stiffness: 350, damping: 18 }
        }}
        whileTap={{ scale: 0.99 }}
        className="group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-white/80 bg-white/40 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-md hover:shadow-[0_12px_32px_rgba(139,92,246,0.06)] dark:border-white/10 dark:bg-slate-900/40 dark:shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition-all duration-300"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-500 group-hover:opacity-10 dark:group-hover:opacity-20 pointer-events-none`}
        />

        <div className="relative z-10 flex flex-col h-full items-center text-center">
          {/* Vector Graphics Frame Box */}
          <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-100 dark:bg-slate-950 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 group-hover:text-violet-500 dark:group-hover:text-violet-400 group-hover:border-violet-100 transition-all duration-300">
            <LucideIcon className="h-5 w-5 stroke-[1.75]" />
          </div>

          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight w-full truncate transition-colors duration-300">
            {title}
          </h3>

          <p className="mt-1 text-[11px] leading-normal text-slate-400 dark:text-slate-400 font-medium line-clamp-2 w-full px-0.5 transition-colors duration-300">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};