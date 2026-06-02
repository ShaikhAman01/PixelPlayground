"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Pause,
  Play,
  VolumeX,
  Volume,
  Volume1,
  Volume2,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { useAudio, playlist } from "@/providers/AudioProvider";
import { GlassPanel } from "../ui/GlassPanel";

export const MusicPlayer = () => {
  const {
    isPlaying,
    volume,
    currentTrack,
    togglePlay,
    setVolume,
    nextTrack,
    previousTrack,
  } = useAudio();

  const track = playlist[currentTrack];

  const waveformDurations = useMemo(
    () => Array.from({ length: 18 }, () => 1 + Math.random()),
    []
  );

  // Dynamic Volume Icon based on state
  const VolumeIcon = useMemo(() => {
    if (volume === 0) return VolumeX;
    if (volume < 30) return Volume;
    if (volume < 70) return Volume1;
    return Volume2;
  }, [volume]);

  // Framer Motion configuration for smooth, continuous vinyl rotation
  const vinylVariants = {
    play: {
      rotate: 360,
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
    pause: {
      rotate: 0, // Fallback style if needed, or stays static
    },
  };

  return (
    <GlassPanel className="flex items-center gap-6 px-5 py-4 w-full max-w-2xl justify-between">
      {/* Track Info Section */}
      <div className="flex items-center gap-4">
        {/* Album Art / Vinyl */}
        <motion.div
          variants={vinylVariants}
          animate={isPlaying ? "play" : "pause"}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-pink-200 to-sky-200 shadow-inner"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
        </motion.div>

        {/* Dynamic Typography & Waveform */}
        <div className="min-w-[180px]">
          <p className="font-semibold text-slate-700 line-clamp-1">
            {track?.title || "No Track Selected"}
          </p>
          <p className="text-xs text-slate-400 line-clamp-1">
            {track?.artist || "Unknown Artist"}
          </p>

          {/* Audio Visualizer Waveform simulation */}
          <div className="mt-2.5 flex items-end gap-0.5 h-[18px]">
            {waveformDurations.map((duration, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlaying ? [6, 18, 10, 14, 6] : 4,
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1 rounded-full bg-violet-400/70"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Playback Controls Wrapper */}
      <div className="flex items-center gap-4">
        <button
          onClick={previousTrack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-600 shadow-sm transition hover:bg-slate-100 active:scale-95"
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4 fill-current" />
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500 text-white shadow-lg shadow-violet-200 transition hover:bg-violet-600"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          )}
        </motion.button>

        <button
          onClick={nextTrack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-600 shadow-sm transition hover:bg-slate-100 active:scale-95"
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4 fill-current" />
        </button>
      </div>

      {/* Volume Controller */}
      <div className="flex items-center gap-2 group">
        <VolumeIcon className="h-4 w-4 text-slate-400 transition group-hover:text-slate-600" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 w-20 cursor-pointer accent-violet-500 bg-slate-200 rounded-lg appearance-none structural-slider"
          aria-label="Volume slider"
        />
      </div>
    </GlassPanel>
  );
};