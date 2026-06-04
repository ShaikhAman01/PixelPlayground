"use client";

import { useEffect, useRef } from "react";
import { useAudioStore, playlist } from "@/store/audio.store";

export const AudioRuntime = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const volume = useAudioStore((s) => s.volume);
  const trackIndex = useAudioStore((s) => s.trackIndex);
  const setIsPlaying = useAudioStore((s) => s.setIsPlaying);

  const activeTrack = playlist[trackIndex];

  // Sync internal volume slider scales to media hardware layers
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Sync state loops cleanly when active track changes
  useEffect(() => {
    const player = audioRef.current;
    if (!player || !activeTrack) return;

    const executePlayback = async () => {
      try {
        player.pause();
        player.src = activeTrack.src;
        player.load();

        if (isPlaying) {
          await player.play();
        }
      } catch (err) {
        console.warn("Playback blocked by browser autoplay rules. Pausing active tracking state:", err);
        setIsPlaying(false);
      }
    };

    executePlayback();
  }, [trackIndex, activeTrack, setIsPlaying]);

  // Direct toggle interceptor handling click transformations
  useEffect(() => {
    const player = audioRef.current;
    if (!player) return;

    if (isPlaying && player.paused) {
      player.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && !player.paused) {
      player.pause();
    }
  }, [isPlaying, setIsPlaying]);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      crossOrigin="anonymous"
      loop
      onEnded={() => {
        // Auto-advance loop handling logic
        useAudioStore.getState().nextTrack();
      }}
    />
  );
};