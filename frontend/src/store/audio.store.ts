import { create } from "zustand";

interface AudioState {
  volume: number;

  isMuted: boolean;

  setVolume: (
    volume: number
  ) => void;

  toggleMute: () => void;
}

export const useAudioStore =
  create<AudioState>(
    (set) => ({
      volume: 0.4,

      isMuted: false,

      setVolume: (
        volume
      ) =>
        set({
          volume,
        }),

      toggleMute: () =>
        set((state) => ({
          isMuted:
            !state.isMuted,
        })),
    })
  );