"use client";

import Image from "next/image";
import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pause, Play, VolumeX, Volume, Volume1, Volume2, SkipBack, SkipForward,
} from "lucide-react";
import { useAudioStore, playlist } from "@/store/audio.store";
import { useTheme } from "../providers/ThemeProvider";

const WAVEFORM_DURATIONS = Array.from(
  { length: 14 },
  (_, i) => 0.65 + (i % 5) * 0.11,
);

export const MusicPlayer = () => {
  const { theme } = useTheme();

  const isPlaying = useAudioStore((s) => s.isPlaying);
  const volume = useAudioStore((s) => s.volume);
  const trackIndex = useAudioStore((s) => s.trackIndex);
  const hydrated = useAudioStore((s) => s.hydrated);

  const setVolume = useAudioStore((s) => s.setVolume);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const setIsPlaying = useAudioStore((s) => s.setIsPlaying);

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const preMuteVolumeRef = useRef(35);

  const track = playlist[trackIndex];
  const isLongTitle = track && track.title.length > 20;

  const ready = hydrated && track;

  const VolumeIcon = useMemo(() => {
    if (!hydrated || volume === 0) return VolumeX;
    if (volume < 30) return Volume;
    if (volume < 70) return Volume1;
    return Volume2;
  }, [volume, hydrated]);

  const handleVolumeIconClick = () => {
    if (volume > 0) {
      preMuteVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(preMuteVolumeRef.current);
    }
  };

  return (
    <div className="flex items-center rounded-2xl w-full justify-between select-none font-sans bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 p-3 shadow-xl backdrop-blur-2xl">
      
      {/* COLUMN 1: TRACK METADATA */}
      <div className="flex items-center gap-2.5 flex-1 lg:flex-none w-auto lg:w-[180px] lg:min-w-[180px] lg:max-w-[180px] overflow-hidden">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 shadow-inner overflow-hidden">
          {ready && track.albumArt ? (
            <motion.div
              className="w-full h-full relative rounded-full overflow-hidden p-0.5 bg-slate-800"
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={isPlaying ? { duration: 16, repeat: Infinity, ease: "linear" } : { duration: 0 }}
            >
              <Image
                src={track.albumArt}
                alt="Album Cover Graphic"
                width={40}
                height={40}
                loading="eager"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-400 shadow-sm z-10" />
            </motion.div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-800 animate-pulse" />
          )}
        </div>

        <div className="flex flex-col overflow-hidden flex-1 max-w-[110px] sm:max-w-[125px]">
          <div className="relative w-full overflow-hidden">
            {ready ? (
              isLongTitle ? (
                <div className={`flex gap-4 ${isPlaying ? "animate-marquee" : ""}`}>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {track.title}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                  {track.title}
                </span>
              )
            ) : (
              <span className="text-xs font-bold text-slate-400 block animate-pulse">Loading...</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold truncate uppercase tracking-widest block mt-0.5">
            {ready ? track.artist : "Radio Hub"}
          </span>

          {/* Monochrome Waveform Bars */}
          <div className="hidden sm:flex mt-1.5 items-end gap-[2px] h-2.5 w-full">
            {WAVEFORM_DURATIONS.map((duration, i) => (
              <motion.div
                key={i}
                style={{ transformOrigin: "bottom" }}
                animate={{ scaleY: isPlaying && hydrated ? [0.2, 1.0, 0.3, 0.8, 0.2] : 0.15 }}
                transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
                className={`w-[2px] h-full rounded-full transition-colors duration-300 ${
                  isPlaying ? "bg-slate-800 dark:bg-slate-200" : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* COLUMN 2: PLAYBACK CONTROLLERS */}
      <div className="flex items-center justify-center gap-1 w-[90px] sm:w-[100px] shrink-0">
        <button
          onClick={prevTrack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Previous Track"
        >
          <SkipBack className="h-4 w-4 fill-current" />
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 transition-colors shadow-sm cursor-pointer"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying && hydrated ? (
            <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
          ) : (
            <Play className="ml-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
          )}
        </motion.button>

        <button
          onClick={nextTrack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Next Track"
        >
          <SkipForward className="h-4 w-4 fill-current" />
        </button>
      </div>

      {/* COLUMN 3: SLIDER TRACK */}
      <div
        className="hidden md:flex relative items-center justify-end gap-1.5 w-[110px] min-w-[110px]"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <button
          onClick={handleVolumeIconClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Mute"
        >
          <VolumeIcon className="h-4 w-4" />
        </button>

        <div className="w-[70px] h-8 flex items-center justify-end overflow-hidden pr-0.5">
          <AnimatePresence>
            {showVolumeSlider && hydrated && (
              <motion.div
                initial={{ width: 0, opacity: 0, x: 6 }}
                animate={{ width: 66, opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: 6 }}
                className="flex items-center w-full"
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-[3px] appearance-none bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer outline-none [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
                  style={{
                    background: `linear-gradient(to right, ${theme === 'dark' ? '#ffffff' : '#0f172a'} 0%, ${theme === 'dark' ? '#ffffff' : '#0f172a'} ${volume}%, ${theme === 'dark' ? '#1e293b' : '#e2e8f0'} ${volume}%, ${theme === 'dark' ? '#1e293b' : '#e2e8f0'} 100%)`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
};