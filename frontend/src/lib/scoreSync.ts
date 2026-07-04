import { create } from "zustand";
import { toast } from "sonner";
import { api, type SubmitScorePayload } from "@/lib/api";
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
    const { token } = useAuthStore.getState();
    if (!token) return;

    try {
      const result = await api.submitScore(token, payload);
      useStatsSync.getState().bump();
      if (result.newBest) {
        toast.success("New personal best!", { duration: 2500 });
      }
    } catch {
      // Offline or rejected — gameplay goes on, nothing to surface
    }
  })();
};
