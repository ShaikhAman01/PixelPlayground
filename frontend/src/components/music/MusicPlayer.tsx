"use client";

import Image from "next/image";
import { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, VolumeX, Volume, Volume1, Volume2, SkipBack, SkipForward } from "lucide-react";
import { useAudioStore, playlist } from "@/store/audio.store";

const WAVEFORM_DURATIONS = Array.from({ length: 20 }, (_, i) => 0.65 + (i % 7) * 0.09);

export const MusicPlayer = () => {
  const isPlaying = useAudioStore((s) => s.isPlaying);
  const volume = useAudioStore((s) => s.volume);
  const trackIndex = useAudioStore((s) => s.trackIndex);
  
  const setVolume = useAudioStore((s) => s.setVolume);
  const nextTrack = useAudioStore((s) => s.nextTrack);
  const prevTrack = useAudioStore((s) => s.prevTrack);
  const setIsPlaying = useAudioStore((s) => s.setIsPlaying);

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const preMuteVolumeRef = useRef(35);

  // Using a robust hydration check to securely eliminate server-side mismatches
  const isClient = typeof window !== "undefined";

  const track = playlist[trackIndex];
  const isLongTitle = track && track.title.length > 20;

  // Compute reactive volume icon safely using client-only environments
  const VolumeIcon = useMemo(() => {
    if (!isClient || volume === 0) return VolumeX;
    if (volume < 30) return Volume;
    if (volume < 70) return Volume1;
    return Volume2;
  }, [volume, isClient]);

  const handleVolumeIconClick = () => {
    if (volume > 0) {
      preMuteVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(preMuteVolumeRef.current);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-900/40 border border-white/60 dark:border-white/10 px-4 py-2.5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl w-full justify-between select-none transition-all duration-300 group/player">
      
      {/* 1. Left Column: Album Art + Moving Text Container */}
      <div className="flex items-center gap-3 w-[190px] min-w-[190px] max-w-[190px] overflow-hidden">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-inner overflow-hidden transition-colors">
          {isClient && track?.albumArt ? (
            <motion.div
              className="w-full h-full relative rounded-full overflow-hidden p-0.5 bg-slate-900 border border-slate-950/20"
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={isPlaying ? { duration: 12, repeat: Infinity, ease: "linear" } : { duration: 0 }}
            >
              {/* Using an optimized image component with proper size boundaries to avoid LCP layout thrashing */}
              <Image
                src={track.albumArt}
                alt="Cover"
                width={44}
                height={44}
                loading="eager"
                className="w-full h-full object-cover rounded-full opacity-90 pointer-events-none"
              />
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white border border-slate-950/30 shadow-sm z-10" />
            </motion.div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md" />
          )}
        </div>

        <div className="flex flex-col overflow-hidden flex-1 w-full max-w-[135px]">
          <div className="relative w-full overflow-hidden">
            {isClient && track ? (
              isLongTitle ? (
                <div className={`flex gap-4 ${isPlaying ? "animate-marquee" : ""}`}>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    {track.title}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap" aria-hidden="true">
                    {track.title}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate block">
                  {track.title}
                </span>
              )
            ) : (
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">Loading...</span>
            )}
          </div>

          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold truncate mt-0.5 uppercase tracking-wider block">
            {isClient && track ? track.artist : "Radio Hub"}
          </span>
          
          <div className="mt-1 flex items-end gap-[2px] h-2.5 w-full">
            {WAVEFORM_DURATIONS.map((duration, i) => (
              <motion.div
                key={i}
                style={{ transformOrigin: "bottom" }}
                animate={{ scaleY: isPlaying && isClient ? [0.2, 1.0, 0.4, 0.8, 0.2] : 0.15 }}
                transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
                className={`w-[2px] h-full rounded-full origin-bottom transition-colors duration-500 ${
                  isPlaying ? "bg-violet-400/90 dark:bg-violet-400/80" : "bg-slate-300 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Center Column: Media Playback Commands */}
      <div className="flex items-center justify-center gap-1 w-[100px] min-w-[100px]">
        <button 
          onClick={prevTrack} 
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40 transition-all active:scale-95"
          aria-label="Previous Track"
        >
          <SkipBack className="h-4 w-4 fill-current" />
        </button>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/20 dark:shadow-none hover:from-violet-600 hover:to-indigo-600 transition-all duration-300"
          aria-label={isPlaying ? "Pause Track" : "Play Track"}
        >
          {isPlaying && isClient ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
        </motion.button>

        <button 
          onClick={nextTrack} 
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40 transition-all active:scale-95"
          aria-label="Next Track"
        >
          <SkipForward className="h-4 w-4 fill-current" />
        </button>
      </div>

      {/* 3. Right Column: Redesigned Minimalist Slider System */}
      <div 
        className="relative flex items-center justify-end gap-1.5 w-[120px] min-w-[120px]"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <button 
          onClick={handleVolumeIconClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/40 transition-all active:scale-95 pointer-events-auto"
          aria-label="Toggle Mute"
        >
          <VolumeIcon className="h-4 w-4 transition-transform duration-200 group-hover/player:scale-105" />
        </button>

        <div className="w-[76px] h-8 flex items-center justify-end overflow-hidden pr-1">
          <AnimatePresence>
            {showVolumeSlider && isClient && (
              <motion.div 
                initial={{ width: 0, opacity: 0, x: 10 }} 
                animate={{ width: 72, opacity: 1, x: 0 }} 
                exit={{ width: 0, opacity: 0, x: 10 }} 
                className="flex items-center w-full"
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-[3px] appearance-none bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer outline-none transition-all duration-200 accent-violet-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-125"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, #cbd5e1 ${volume}%, #cbd5e1 100%)`
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