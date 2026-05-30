interface Props {
  username: string;

  symbol: string;

  active?: boolean;
}

import { motion } from "framer-motion";

export const PlayerCard = ({
  username,
  symbol,
  active,
}: Props) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`rounded-3xl border bg-white/70 p-4 transition-all duration-300 dark:bg-slate-900/60 ${
        active
          ? "border-violet-300 shadow-lg shadow-violet-100 dark:border-violet-500 dark:shadow-violet-950/20"
          : "border-white/60 dark:border-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-violet-200 text-xl dark:from-pink-900/30 dark:to-violet-900/30">
            🧸
          </div>

          <div>
            <p className="font-semibold text-slate-700 transition-colors duration-300 dark:text-slate-200">
              {username}
            </p>

            <p className="text-sm text-emerald-500 dark:text-emerald-400">
              Ready
            </p>
          </div>
        </div>

        <div className="font-[family:var(--font-pixel)] text-3xl text-slate-500 transition-colors duration-300 dark:text-slate-400">
          {symbol}
        </div>
      </div>
    </motion.div>
  );
};