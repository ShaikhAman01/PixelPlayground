"use client";

import { useState } from "react";
import { Check, Loader2, LogOut, Moon, Pencil, Sun, WifiOff, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

interface ProfileMenuProps {
  theme: string;
  toggleTheme: () => void;
}

type PanelMode = "view" | "rename" | "signup" | "login";

const inputClass =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500";

const primaryBtnClass =
  "w-full rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 py-2 text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5";

export const ProfileMenu = ({ theme, toggleTheme }: ProfileMenuProps) => {
  const { user, status, rename, signup, login, logout, ensureSession } = useAuthStore();
  const [mode, setMode] = useState<PanelMode>("view");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const resetForm = (next: PanelMode) => {
    setMode(next);
    setName("");
    setPassword("");
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
        <WifiOff className="h-4 w-4 text-slate-400" />
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Playing offline</p>
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
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
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1.5">
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
              className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950 disabled:opacity-40 cursor-pointer"
              aria-label="Save name"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={() => resetForm("view")}
              className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 cursor-pointer"
              aria-label="Cancel rename"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">
              {status === "ready" && user ? user.username : "Connecting..."}
            </p>
            {status === "ready" && (
              <button
                onClick={() => resetForm("rename")}
                className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Edit display name"
              >
                <Pencil className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {mode !== "rename" && (
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
            {user?.isGuest ? "Progress saved on this device's session" : "Progress synced to your account"}
          </p>
        )}
        {mode === "rename" && error && (
          <p className="text-[10px] font-bold text-rose-500 mt-1.5">{error}</p>
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => submitOnEnter(e, handleCredentials)}
            placeholder={mode === "signup" ? "Password (6+ characters)" : "Password"}
            className={inputClass}
            aria-label="Password"
          />
          {error && <p className="text-[10px] font-bold text-rose-500">{error}</p>}
          <button
            onClick={handleCredentials}
            disabled={busy || name.trim().length < 2 || password.length < (mode === "signup" ? 6 : 1)}
            className={primaryBtnClass}
          >
            {busy && <Loader2 className="h-3 w-3 animate-spin" />}
            {mode === "signup" ? "Create Account" : "Log In"}
          </button>
          <button
            onClick={() => resetForm("view")}
            className="w-full text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 py-1 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {mode === "view" && status === "ready" && (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
          {user?.isGuest ? (
            <>
              <button onClick={() => resetForm("signup")} className={primaryBtnClass}>
                Save Progress — Create Account
              </button>
              <button
                onClick={() => resetForm("login")}
                className="w-full text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1 transition-colors cursor-pointer"
              >
                Already have an account? Log in
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                void logout();
                toast("Logged out — playing as guest");
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="h-3 w-3" /> Log Out
            </button>
          )}
        </div>
      )}

      <button
        onClick={toggleTheme}
        className="md:hidden w-full px-4 py-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <span>Display Theme</span>
        {theme === "dark" ? (
          <div className="flex items-center gap-1 text-amber-500 font-mono text-[10px]">
            <Sun className="h-3.5 w-3.5" /> LIGHT
          </div>
        ) : (
          <div className="flex items-center gap-1 text-slate-700 font-mono text-[10px]">
            <Moon className="h-3.5 w-3.5" /> DARK
          </div>
        )}
      </button>
    </>
  );
};
