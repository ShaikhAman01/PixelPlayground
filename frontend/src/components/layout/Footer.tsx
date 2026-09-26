"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import {
  API_BASE_URL,
  BUG_REPORT_URL,
  FEATURE_REQUEST_URL,
  GITHUB_REPO,
} from "@/lib/links";

const navLinkClass =
  "text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:underline transition-colors";

const columnTitleClass =
  "pixel-font text-[10px] uppercase tracking-wider text-slate-900 dark:text-slate-400 font-black";

const modalInputClass =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500";

export const Footer = () => {
  const { token, user, status, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const needsPassword = Boolean(user && !user.isGuest);

  const close = () => {
    setOpen(false);
    setPassword("");
    setError("");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleDelete = async () => {
    if (busy || !token) return;
    setBusy(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(needsPassword ? { password } : {}),
      });
      const body = (await res.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!res.ok || !body?.success) {
        setError(body?.message ?? "Could not delete the account, try again");
        return;
      }

      close();
      toast.success("Account deleted. Starting fresh as a new guest.");
      await logout();
    } catch {
      setError("Network error, try again later");
    } finally {
      setBusy(false);
    }
  };

  return (
    <footer className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 pb-10 select-none font-sans">
      {/* NEW STRUCTURE: Added a matching frosted glass panel container. 
        Lifts content away from cloud graphics, matching the cards and topbar perfectly.
      */}
      <div className="
        w-full
        rounded-3xl
        border border-slate-200/80 dark:border-slate-800
        bg-white/70 dark:bg-slate-900/75
        backdrop-blur-xl
        p-6 sm:p-8 md:p-10
        shadow-[0_8px_32px_rgba(15,23,42,0.03)]
        dark:shadow-[0_16px_48px_rgba(0,0,0,0.25)]
        transition-all duration-300
      ">
        
        {/* Main Grid Split */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 pb-8 border-b border-slate-300 dark:border-slate-800">
          
          {/* Left Column: Core Brand */}
          <div className="md:col-span-4 flex flex-col items-start justify-center">
            <div className="flex items-center gap-3">
              <Image
                src="/logo/logo3.png"
                alt="Pixel Playground Logo"
                width={36}
                height={36}
                className="object-contain"
              />
              <div>
                <h3 className="pixel-font text-sm font-black tracking-widest text-slate-950 dark:text-slate-50 uppercase">
                  PIXEL PLAYGROUND
                </h3>
                <p className="text-[10px] mt-0.5 text-slate-800 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                  cozy retro arcade
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-xs font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
              Cozy browser games designed for quick breaks and peaceful gaming sessions.
            </p>
          </div>

          {/* Right Column: Directory Navigation */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 lg:gap-x-8">
            {/* Arcade Category */}
            <div className="flex flex-col gap-3">
              <span className={columnTitleClass}>Arcade</span>
              <Link href="/game/tictactoe" className={navLinkClass}>
                Tic Tac Toe
              </Link>
              <Link href="/game/game2048" className={navLinkClass}>
                2048
              </Link>
              <Link href="/game/wordle" className={navLinkClass}>
                Wordle
              </Link>
            </div>

            {/* Puzzles Category */}
            <div className="flex flex-col gap-3">
              <span className={columnTitleClass}>Puzzles</span>
              <Link href="/game/connect4" className={navLinkClass}>
                Connect 4
              </Link>
              <Link href="/game/colormemory" className={navLinkClass}>
                Color Memory
              </Link>
              <Link href="/game/slidepuzzle" className={navLinkClass}>
                Slide Puzzle
              </Link>
            </div>

            {/* Community Category */}
            <div className="flex flex-col gap-3">
              <span className={columnTitleClass}>Community</span>
              <Link href="/about" className={navLinkClass}>
                About
              </Link>
              <Link href="/privacy" className={navLinkClass}>
                Privacy
              </Link>
              <Link href="/terms" className={navLinkClass}>
                Terms
              </Link>
            </div>

            {/* Support Category */}
            <div className="flex flex-col gap-3">
              <span className={columnTitleClass}>Support</span>
              <a href={BUG_REPORT_URL} target="_blank" rel="noreferrer" className={navLinkClass}>
                Report a bug
              </a>
              <a href={FEATURE_REQUEST_URL} target="_blank" rel="noreferrer" className={navLinkClass}>
                Request a feature
              </a>
              <a href={GITHUB_REPO} target="_blank" rel="noreferrer" className={navLinkClass}>
                Source code
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Ground Row */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <p className="text-xs font-black text-slate-950 dark:text-slate-50">
            © {new Date().getFullYear()} Pixel Playground
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-[10px] uppercase tracking-widest font-extrabold text-slate-700 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer"
            >
              Delete account
            </button>
            <span className="text-[10px] text-slate-400 dark:text-slate-600">·</span>
            <p className="text-[10px] text-slate-700 dark:text-slate-400 uppercase tracking-widest font-extrabold">
              MIT licensed
            </p>
          </div>
        </div>

      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <h2
              id="delete-account-title"
              className="pixel-font text-base font-black uppercase tracking-wide text-slate-900 dark:text-slate-50"
            >
              Delete your account
            </h2>
            <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
              This removes your account together with every score, stat and streak attached to it, and takes your
              leaderboard entries with it. It happens straight away and cannot be undone.
            </p>

            {status !== "ready" || !token ? (
              <p className="mt-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                No active session to delete. You are playing offline right now.
              </p>
            ) : (
              <>
                <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Signed in as {user?.username}
                  {user?.isGuest ? " (guest)" : ""}.
                </p>

                {needsPassword && (
                  <input
                    autoFocus
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleDelete();
                    }}
                    placeholder="Confirm your password"
                    className={`${modalInputClass} mt-4`}
                    aria-label="Confirm your password"
                  />
                )}

                {error && (
                  <p className="mt-3 text-[11px] font-bold text-rose-700 dark:text-rose-300">{error}</p>
                )}
              </>
            )}

            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Keep playing
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={busy || !token || status !== "ready" || (needsPassword && password.length === 0)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy && <Loader2 className="h-3 w-3 animate-spin" />}
                Delete forever
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
