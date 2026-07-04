"use client";

import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { api, type LeaderboardResult } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useStatsSync } from "@/lib/scoreSync";

const VALUE_LABELS: Record<string, string> = {
  tictactoe: "Wins",
  connect4: "Wins",
  game2048: "Score",
  wordle: "Streak",
  colormemory: "Level",
  slidepuzzle: "Time",
};

const formatValue = (gameId: string, value: number) => {
  if (gameId !== "slidepuzzle") return value.toLocaleString();
  const mins = Math.floor(value / 60);
  const secs = value % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const LeaderboardPanel = ({ gameId }: { gameId: string }) => {
  const token = useAuthStore((s) => s.token);
  const sessionStatus = useAuthStore((s) => s.status);
  const statsVersion = useStatsSync((s) => s.version);

  const [data, setData] = useState<LeaderboardResult | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (sessionStatus !== "ready") return;

    let cancelled = false;
    void api
      .leaderboard(gameId, token ?? undefined)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setFailed(false);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [gameId, token, sessionStatus, statsVersion]);

  // Stale data stays visible while a refresh is in flight — no skeleton flash
  const state: "loading" | "ready" | "offline" = data
    ? "ready"
    : sessionStatus === "offline" || failed
      ? "offline"
      : "loading";

  const meOutsideTop =
    data?.me && !data.entries.some((e) => e.rank === data.me?.rank) ? data.me : null;

  return (
    <div className="rounded-[24px] border border-zinc-200 dark:border-zinc-800/80 bg-amber-50/70 dark:bg-zinc-900/90 p-4 shadow-sm flex flex-col backdrop-blur-xl w-full">
      <div className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1.5">
        <Trophy className="w-3.5 h-3.5" /> Leaderboard
        <span className="ml-auto font-bold normal-case tracking-normal text-zinc-400 dark:text-zinc-600">
          {VALUE_LABELS[gameId]}
        </span>
      </div>

      {state === "loading" && (
        <div className="space-y-1.5" aria-hidden>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse"
            />
          ))}
        </div>
      )}

      {state === "offline" && (
        <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 py-2 text-center">
          Leaderboard unavailable offline
        </p>
      )}

      {state === "ready" && data && data.entries.length === 0 && (
        <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 py-2 text-center">
          No scores yet — set the first one!
        </p>
      )}

      {state === "ready" && data && data.entries.length > 0 && (
        <ol className="space-y-1.5">
          {data.entries.map((entry) => {
            const isMe = data.me?.rank === entry.rank && data.me?.username === entry.username;
            return (
              <li
                key={`${entry.rank}-${entry.username}`}
                className={`flex items-center gap-2 border p-2 rounded-xl text-xs ${
                  isMe
                    ? "bg-violet-100/60 border-violet-200 dark:bg-violet-950/40 dark:border-violet-900/60"
                    : "bg-white/50 dark:bg-zinc-955/40 border-zinc-200 dark:border-zinc-800/40"
                }`}
              >
                <span className="w-5 text-center font-black font-mono text-zinc-400 dark:text-zinc-500">
                  {entry.rank}
                </span>
                <span className="flex-1 font-bold text-zinc-700 dark:text-zinc-300 truncate">
                  {entry.username}
                  {isMe && <span className="text-violet-500 dark:text-violet-400 ml-1">(you)</span>}
                </span>
                <span className="font-black font-mono text-zinc-950 dark:text-white">
                  {formatValue(gameId, entry.value)}
                </span>
              </li>
            );
          })}
          {meOutsideTop && (
            <li className="flex items-center gap-2 border p-2 rounded-xl text-xs bg-violet-100/60 border-violet-200 dark:bg-violet-950/40 dark:border-violet-900/60">
              <span className="w-5 text-center font-black font-mono text-zinc-400 dark:text-zinc-500">
                {meOutsideTop.rank}
              </span>
              <span className="flex-1 font-bold text-zinc-700 dark:text-zinc-300 truncate">
                {meOutsideTop.username}
                <span className="text-violet-500 dark:text-violet-400 ml-1">(you)</span>
              </span>
              <span className="font-black font-mono text-zinc-950 dark:text-white">
                {formatValue(gameId, meOutsideTop.value)}
              </span>
            </li>
          )}
        </ol>
      )}
    </div>
  );
};
