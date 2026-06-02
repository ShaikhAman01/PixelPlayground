"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export const MusicPlayer = () => {
  const {
    isPlaying,
    volume,
    currentTrack, // Track Index Integer from Provider State
    togglePlay,
    setVolume,
    nextTrack,
    previousTrack,
  } = useAudio();

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const track = useMemo(() => playlist[currentTrack], [currentTrack]);

  const waveformDurations = useMemo(
    () => Array.from({ length: 20 }, () => 0.6 + Math.random() * 0.8),
    []
  );

  const VolumeIcon = useMemo(() => {
    if (!isMounted || volume === 0) return VolumeX;
    if (volume < 30) return Volume;
    if (volume < 70) return Volume1;
    return Volume2;
  }, [volume, isMounted]);

  return (
    <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/40 border border-white/70 dark:border-white/10 px-4 py-2 rounded-2xl shadow-[0_8px_32px_rgba(31,38,135,0.04)] backdrop-blur-md w-full justify-between select-none transition-colors duration-300">
      
      {/* Left Column: Cover Platter Base */}
      <div className="flex items-center gap-3 min-w-[170px] max-w-[210px]">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          {isMounted && track?.albumArt ? (
            <div
              className={`w-full h-full relative rounded-full overflow-hidden p-0.5 bg-slate-900 border border-slate-950/20 ${
                isPlaying ? "animate-[spin_12s_linear_infinite]" : ""
              }`}
              style={{
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            >
              <img 
                src={track.albumArt} 
                alt="Cover"
                className="w-full h-full object-cover rounded-full pointer-events-none opacity-90"
              />
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white border border-slate-950/30 shadow-sm z-10" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate transition-colors duration-300">
            {isMounted && track ? track.title : "Loading Player..."}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold truncate mt-0.5 uppercase tracking-wider transition-colors duration-300">
            {isMounted && track ? track.artist : "Radio Hub"}
          </span>
          
          {/* Audio Equalizer Simulation */}
          <div className="mt-1 flex items-end gap-[2px] h-2.5">
            {waveformDurations.map((duration, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying && isMounted ? [2, 10, 4, 8, 2] : 2 }}
                transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
                className="w-[2px] rounded-full bg-violet-400/90"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Column: Control Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={previousTrack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/40 active:scale-95 transition-all"
          aria-label="Previous Track"
        >
          <SkipBack className="h-3.5 w-3.5 fill-current" />
        </button>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white shadow-md shadow-violet-200 dark:shadow-none hover:bg-violet-600 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying && isMounted ? (
            <Pause className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
          )}
        </motion.button>

        <button
          onClick={nextTrack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/40 active:scale-95 transition-all"
          aria-label="Next Track"
        >
          <SkipForward className="h-3.5 w-3.5 fill-current" />
        </button>
      </div>

      {/* Right Column: Sliding Volume Component */}
      <div 
        className="relative flex items-center gap-1"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/40 transition-all">
          <VolumeIcon className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {showVolumeSlider && isMounted && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 72, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden flex items-center pr-1"
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1 appearance-none bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer accent-violet-500 outline-none"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, #cbd5e1 ${volume}%, #cbd5e1 100%)`
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};