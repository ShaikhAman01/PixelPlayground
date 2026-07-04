import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiError, type PublicUser } from "@/lib/api";

type SessionStatus = "idle" | "loading" | "ready" | "offline";

interface AuthState {
  token: string | null;
  user: PublicUser | null;
  status: SessionStatus;

  /**
   * Idempotent session bootstrap: reuses a persisted token, silently
   * creates a guest otherwise. Network failure leaves the app fully
   * playable in offline mode.
   */
  ensureSession: () => Promise<void>;
  signup: (username: string, password: string) => Promise<{ ok: boolean; message: string }>;
  login: (username: string, password: string) => Promise<{ ok: boolean; message: string }>;
  rename: (username: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
}

let bootstrapPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      status: "idle",

      ensureSession: async () => {
        if (get().status === "ready") return;
        if (bootstrapPromise) return bootstrapPromise;

        bootstrapPromise = (async () => {
          set({ status: "loading" });
          const { token } = get();
          try {
            if (token) {
              try {
                const { user } = await api.me(token);
                set({ user, status: "ready" });
                return;
              } catch (err) {
                // Expired/invalid token: fall through to a fresh guest.
                // Network errors are handled by the outer catch.
                if (!(err instanceof ApiError)) throw err;
              }
            }
            const session = await api.createGuest();
            set({ token: session.token, user: session.user, status: "ready" });
          } catch {
            set({ status: "offline" });
          } finally {
            bootstrapPromise = null;
          }
        })();
        return bootstrapPromise;
      },

      signup: async (username, password) => {
        const { token, user } = get();
        try {
          // A guest session upgrades in place so stats carry over
          const session =
            token && user?.isGuest
              ? await api.upgrade(token, username, password)
              : await api.signup(username, password);
          set({ token: session.token, user: session.user, status: "ready" });
          return { ok: true, message: "Account created!" };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof ApiError ? err.message : "Network error — try again later",
          };
        }
      },

      login: async (username, password) => {
        try {
          const session = await api.login(username, password);
          set({ token: session.token, user: session.user, status: "ready" });
          return { ok: true, message: `Welcome back, ${session.user.username}!` };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof ApiError ? err.message : "Network error — try again later",
          };
        }
      },

      rename: async (username) => {
        const { token } = get();
        if (!token) return { ok: false, message: "No active session" };
        try {
          const session = await api.rename(token, username);
          set({ token: session.token, user: session.user });
          return { ok: true, message: "Name updated" };
        } catch (err) {
          return {
            ok: false,
            message: err instanceof ApiError ? err.message : "Network error — try again later",
          };
        }
      },

      logout: async () => {
        set({ token: null, user: null, status: "idle" });
        await get().ensureSession();
      },
    }),
    {
      name: "pixel-playground-session",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
