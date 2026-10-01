import { create } from "zustand";
import { toast } from "sonner";
import { api, ApiError, type SubmitScorePayload } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

interface StatsSyncState {
  /** Bumped after every successful submission so panels can refetch. */
  version: number;
  bump: () => void;
}

export const useStatsSync = create<StatsSyncState>((set) => ({
  version: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
}));

/** Local calendar day, matching the Wordle midnight countdown. */
export const localDay = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Fire-and-forget score submission. Games call this at their natural end;
 * it must never throw or block gameplay — an unreachable backend just
 * means the run isn't recorded.
 */
export const submitScore = (payload: SubmitScorePayload) => {
  void (async () => {
    const auth = useAuthStore.getState();
    if (auth.status !== "ready" || !auth.token) {
      await auth.ensureSession();
    }
    const send = async () => {
      const { token } = useAuthStore.getState();
      if (!token) return;
      const result = await api.submitScore(token, payload);
      useStatsSync.getState().bump();
      if (result.newBest) {
        toast("New personal best!", { icon: "🏆", duration: 2500 });
      }
    };

    const { token: usedToken, user } = useAuthStore.getState();
    try {
      await send();
    } catch (err) {
      if (!(err instanceof ApiError) || err.status !== 401) return;
      // Another submit already recovered from this dead session.
      if (useAuthStore.getState().token !== usedToken) return;
      await useAuthStore.getState().logout();
      if (user && !user.isGuest) {
        toast("Your session ended. Sign in again to keep saving scores.", { duration: 5000 });
        return;
      }
      await send().catch(() => {});
    }
  })();
};
