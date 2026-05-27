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
      className={`rounded-3xl border bg-white/70 p-4 transition ${
        active
          ? "border-violet-300 shadow-lg shadow-violet-100"
          : "border-white/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-200 to-violet-200 text-xl">
            🧸
          </div>

          <div>
            <p className="font-semibold text-slate-700">
              {username}
            </p>

            <p className="text-sm text-emerald-500">
              Ready
            </p>
          </div>
        </div>

        <div className="font-[family:var(--font-pixel)] text-3xl text-slate-500">
          {symbol}
        </div>
      </div>
    </motion.div>
  );
};