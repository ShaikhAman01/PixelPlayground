"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, Loader2, LogOut, Moon, Pencil, Sun, WifiOff, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

interface ProfileMenuProps {
  theme: string;
  toggleTheme: () => void;
}

type PanelMode = "view" | "rename" | "signup" | "login";

const inputClass =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500";

const primaryBtnClass =
  "w-full rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5";

// Secondary actions are sentence case: a full sentence in wide uppercase reads as
// a label rather than something you can click, and it wrapped onto two lines.
const secondaryBtnClass =
  "w-full py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer";

const iconBtnClass =
  "shrink-0 h-9 w-9 flex items-center justify-center rounded-lg cursor-pointer transition-colors";

export const ProfileMenu = ({ theme, toggleTheme }: ProfileMenuProps) => {
  const { user, status, rename, signup, login, logout, ensureSession } = useAuthStore();
  const [mode, setMode] = useState<PanelMode>("view");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const resetForm = (next: PanelMode) => {
    setMode(next);
    setName("");
    setPassword("");
    setShowPassword(false);
    setError("");
  };

  const handleRename = async () => {
    if (busy) return;
    setBusy(true);
    const result = await rename(name.trim());
    setBusy(false);
    if (result.ok) {
      toast.success(result.message);
      resetForm("view");
    } else {
      setError(result.message);
    }
  };

  const handleCredentials = async () => {
    if (busy) return;
    setBusy(true);
    const action = mode === "signup" ? signup : login;
    const result = await action(name.trim(), password);
    setBusy(false);
    if (result.ok) {
      toast.success(result.message);
      resetForm("view");
    } else {
      setError(result.message);
    }
  };

  const submitOnEnter = (e: React.KeyboardEvent, handler: () => void) => {
    if (e.key === "Enter") handler();
  };

  if (status === "offline") {
    return (
      <div className="px-4 py-4 flex flex-col items-center gap-2 text-center">
        <WifiOff className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Playing offline</p>
        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
          Scores will not be saved to the leaderboard.
        </p>
        <button onClick={() => void ensureSession()} className={`${primaryBtnClass} mt-1`}>
          Retry connection
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-none mb-1.5">
          {user?.isGuest ? "Guest Player" : "Player Profile"}
        </p>

        {mode === "rename" ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => submitOnEnter(e, handleRename)}
              placeholder={user?.username}
              maxLength={20}
              className={inputClass}
              aria-label="New display name"
            />
            <button
              onClick={handleRename}
              disabled={busy || name.trim().length < 2}
              className={`${iconBtnClass} bg-slate-950 text-white dark:bg-white dark:text-slate-950 disabled:opacity-40`}
              aria-label="Save name"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => resetForm("view")}
              className={`${iconBtnClass} border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800`}
              aria-label="Cancel rename"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">
              {status === "ready" && user ? user.username : "Connecting"}
            </p>
            {status !== "ready" && <Loader2 className="h-3 w-3 animate-spin text-slate-500 shrink-0" />}
            {status === "ready" && (
              <button
                onClick={() => resetForm("rename")}
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Edit display name"
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {mode !== "rename" && (
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">
            {user?.isGuest
              ? "Your progress is only saved on this device."
              : "Progress synced to your account"}
          </p>
        )}
        {mode === "rename" && error && (
          <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300 mt-1.5">{error}</p>
        )}
      </div>

      {(mode === "signup" || mode === "login") && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            maxLength={20}
            className={inputClass}
            aria-label="Username"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => submitOnEnter(e, handleCredentials)}
              placeholder={mode === "signup" ? "Password (6+ characters)" : "Password"}
              className={`${inputClass} pr-10`}
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0.5 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          {error && <p className="text-[11px] font-bold text-rose-700 dark:text-rose-300">{error}</p>}
          <button
            onClick={handleCredentials}
            disabled={busy || name.trim().length < 2 || password.length < (mode === "signup" ? 6 : 1)}
            className={primaryBtnClass}
          >
            {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            {mode === "signup" ? "Create Account" : "Log In"}
          </button>
          <button onClick={() => resetForm("view")} className={secondaryBtnClass}>
            Cancel
          </button>
        </div>
      )}

      {mode === "view" && status === "ready" && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
          {user?.isGuest ? (
            <>
              {/* One clear action. The reason to press it lives in the line above,
                  so the label stays on a single line. */}
              <button onClick={() => resetForm("signup")} className={primaryBtnClass}>
                Create account
              </button>
              <button onClick={() => resetForm("login")} className={secondaryBtnClass}>
                Already have an account?{" "}
                <span className="underline underline-offset-2 text-slate-800 dark:text-slate-200">Log in</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                void logout();
                toast("Logged out, playing as guest");
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="h-3 w-3" /> Log Out
            </button>
          )}
        </div>
      )}

      <button
        onClick={toggleTheme}
        className="md:hidden w-full px-4 py-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <span>Display Theme</span>
        {theme === "dark" ? (
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-mono text-[11px]">
            <Sun className="h-3.5 w-3.5" /> LIGHT
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-mono text-[11px]">
            <Moon className="h-3.5 w-3.5" /> DARK
          </div>
        )}
      </button>
    </>
  );
};
