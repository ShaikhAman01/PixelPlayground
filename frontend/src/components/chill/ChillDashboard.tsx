"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Volume1,
  SlidersHorizontal,
  MoreVertical,
  Clock,
  X,
  Trash2,
  Settings,
  RotateCcw,
  CloudRain,
  Wind,
  Coffee,
  Flame,
  ChevronLeft,
  ChevronRight,
  Music2,
  Plus,
  Minus,
  Bird,
  Waves,
  ImageIcon
} from "lucide-react";

import { useAudioStore, playlist as initialPlaylist, TrackType } from "@/store/audio.store";
import { useMode } from "@/components/providers/ModeProvider";
import { CHILL_WALLPAPERS } from "@/data/chillWallpapers";

const RING_R = 52;
const RING_CIRC = 2 * Math.PI * RING_R;

const ProgressRing = ({ progress }: { progress: number }) => (
  <svg width="128" height="128" viewBox="0 0 128 128" className="absolute inset-0">
    <circle cx="64" cy="64" r={RING_R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
    <circle
      cx="64" cy="64" r={RING_R}
      fill="none"
      stroke="rgba(255,255,255,0.45)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray={RING_CIRC}
      strokeDashoffset={RING_CIRC * (1 - progress)}
      transform="rotate(-90 64 64)"
      style={{ transition: "stroke-dashoffset 1s linear" }}
    />
  </svg>
);

interface EffectCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: number;
  disabled: boolean;
  onChange: (id: string, val: number) => void;
}

const EffectCard = ({ id, name, icon, value, disabled, onChange }: EffectCardProps) => {
  const isActive = value > 0;
  return (
    <div
      className={`flex flex-col gap-2.5 p-3 rounded-2xl border transition-all duration-200 ${
        isActive && !disabled
          ? "border-white/15 bg-white/[0.07]"
          : "border-white/5 bg-white/[0.03] opacity-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-300">
            {name}
          </span>
        </div>
        <span className="text-[9px] font-mono text-zinc-500 tabular-nums">
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range" min="0" max="1" step="0.05"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(id, parseFloat(e.target.value))}
        className="w-full h-0.5 appearance-none rounded-full bg-white/10 accent-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
      />
    </div>
  );
};

const Divider = ({ className }: { className?: string }) => (
  <div className={`h-4 w-px bg-white/10 shrink-0 ${className ?? ""}`} />
);

const AMBIENT_AUDIO_INSTANCES: Record<string, HTMLAudioElement> = 
  typeof window !== "undefined" 
    ? {
        rain: new Audio("/audio/effects/rain.mp3"),
        wind: new Audio("/audio/effects/wind.mp3"),
        fire: new Audio("/audio/effects/fire.mp3"),
        cafe: new Audio("/audio/effects/cafe.mp3"),
        birds: new Audio("/audio/effects/birds.mp3"),
        waves: new Audio("/audio/effects/waves.mp3")
      }
    : {};

if (typeof window !== "undefined") {
  Object.values(AMBIENT_AUDIO_INSTANCES).forEach(audio => {
    audio.loop = true;
    audio.preload = "auto";
  });
}

export const ChillDashboard = () => {
  const { mode, setMode } = useMode();
  const { trackIndex, isPlaying, volume, setVolume, nextTrack, prevTrack, setIsPlaying } = useAudioStore();

  const [activeWallpaper, setActiveWallpaper] = useState(CHILL_WALLPAPERS[0].url);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [showEffectsMenu, setShowEffectsMenu] = useState(false);
  const [showPomodoroPanel, setShowPomodoroPanel] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [disabledTrackIndices, setDisabledTrackIndices] = useState<number[]>([]);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [masterAmbientVol, setMasterAmbientVol] = useState(0.5);

  const [activeEffects, setActiveEffects] = useState<Record<string, number>>({
    rain: 0, cafe: 0, fire: 0, wind: 0, birds: 0, waves: 0
  });

  const [activeTab, setActiveTab] = useState<"focus" | "break">("focus");
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const totalSeconds = (activeTab === "focus" ? focusDuration : breakDuration) * 60;
  const remainingSeconds = minutes * 60 + seconds;
  const timerProgress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 1;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    Object.keys(activeEffects).forEach((id) => {
      const audio = AMBIENT_AUDIO_INSTANCES[id];
      if (audio) {
        const targetVolume = Math.max(0, Math.min(1, activeEffects[id] * masterAmbientVol));
        audio.volume = targetVolume;

        const shouldPlay = ambientEnabled && targetVolume > 0;

        if (shouldPlay) {
          if (audio.paused) {
            console.log(`🔊 [Ambient Mixer] Attempting to stream: ${id} at volume ${Math.round(targetVolume * 100)}%`);
            audio.play().catch((err) => {
              console.error(`❌ [Ambient Mixer] Browser blocked execution context for ${id}:`, err.message);
            });
          }
        } else {
          if (!audio.paused) {
            console.log(`🔇 [Ambient Mixer] Pausing stream: ${id}`);
            audio.pause();
          }
        }
      }
    });

    return () => {
      Object.values(AMBIENT_AUDIO_INSTANCES).forEach((audio) => {
        if (!audio.paused) audio.pause();
      });
    };
  }, [activeEffects, masterAmbientVol, ambientEnabled]);

  useEffect(() => {
    if (disabledTrackIndices.includes(trackIndex)) {
      if (disabledTrackIndices.length < initialPlaylist.length) nextTrack();
    }
  }, [trackIndex, disabledTrackIndices, nextTrack]);

  useEffect(() => {
    setMinutes(activeTab === "focus" ? focusDuration : breakDuration);
    setSeconds(0);
  }, [focusDuration, breakDuration, activeTab]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            const nextTab = activeTab === "focus" ? "break" : "focus";
            setActiveTab(nextTab);
            setMinutes(nextTab === "focus" ? focusDuration : breakDuration);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timerRunning, minutes, seconds, activeTab, focusDuration, breakDuration]);

  const toggleTrackDisabledState = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDisabledTrackIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const updateEffectVolume = (id: string, val: number) => {
    setActiveEffects((prev) => ({ ...prev, [id]: val }));
  };

  const toggleMute = () => {
    if (volume > 0) { setPrevVolume(volume); setVolume(0); }
    else setVolume(prevVolume || 50);
  };

  const cycleWallpaper = (dir: 1 | -1) => {
    const idx = CHILL_WALLPAPERS.findIndex((wp) => wp.url === activeWallpaper);
    const next = (idx + dir + CHILL_WALLPAPERS.length) % CHILL_WALLPAPERS.length;
    setActiveWallpaper(CHILL_WALLPAPERS[next].url);
  };

  const closeAllPanels = (except?: "playlist" | "effects") => {
    if (except !== "playlist") setShowPlaylistMenu(false);
    if (except !== "effects") setShowEffectsMenu(false);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 40 ? Volume1 : Volume2;

  const EFFECTS = [
    { id: "rain",  name: "Rain",      icon: <CloudRain className="w-3.5 h-3.5 text-sky-400" /> },
    { id: "wind",  name: "Wind",      icon: <Wind className="w-3.5 h-3.5 text-teal-400" /> },
    { id: "fire",  name: "Fireplace", icon: <Flame className="w-3.5 h-3.5 text-rose-400" /> },
    { id: "cafe",  name: "Café",      icon: <Coffee className="w-3.5 h-3.5 text-amber-400" /> },
    { id: "birds", name: "Birds",     icon: <Bird className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: "waves", name: "Waves",     icon: <Waves className="w-3.5 h-3.5 text-cyan-400" /> }
  ];

  const currentTrack = initialPlaylist[trackIndex];
  const imageSrc = currentTrack?.albumArt ?? (currentTrack as any)?.coverUrl;
  const playableCount = initialPlaylist.length - disabledTrackIndices.length;
  const panelBase = "absolute left-0 right-0 bg-zinc-950/95 border border-white/[0.08] rounded-2xl shadow-2xl z-50 backdrop-blur-2xl";

  function renderVolumeIcon(): React.ReactNode {
    const Icon = VolumeIcon as any;
    return <Icon className="w-3.5 h-3.5" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 w-screen h-screen overflow-hidden text-slate-200 font-sans select-none"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${activeWallpaper})` }}
      />
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 pointer-events-none" />

      <AnimatePresence>
        {showPomodoroPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-24 right-4 md:top-6 md:right-8 w-60 z-40 pointer-events-auto"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/90 backdrop-blur-3xl p-5 text-white shadow-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 bg-white/[0.05] border border-white/[0.04] rounded-xl p-0.5">
                  {(["focus", "break"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setTimerRunning(false);
                        setActiveTab(tab);
                        setMinutes(tab === "focus" ? focusDuration : breakDuration);
                        setSeconds(0);
                      }}
                      className="px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer dynamic-tab bg-transparent text-white/40"
                      style={{
                        backgroundColor: activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
                        color: activeTab === tab ? "#ffffff" : "rgba(255,255,255,0.4)"
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowPomodoroPanel(false)}
                  className="w-5 h-5 rounded-full bg-white/[0.05] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="relative w-32 h-32 mx-auto flex items-center justify-center mb-4">
                <ProgressRing progress={timerProgress} />
                <div className="flex flex-col items-center z-10">
                  <span className="text-3xl font-black font-mono tracking-tight tabular-nums text-zinc-100 leading-none">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-[0.18em] text-white/20 mt-1.5">
                    {activeTab}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-5 text-zinc-400">
                <button
                  onClick={() => setShowTimerSettings(!showTimerSettings)}
                  className={`transition-colors cursor-pointer ${showTimerSettings ? "text-white" : "hover:text-white"}`}
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/12 text-white hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                >
                  {timerRunning
                    ? <Pause className="w-3.5 h-3.5 fill-current" />
                    : <Play  className="w-3.5 h-3.5 fill-current ml-0.5" />
                  }
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setMinutes(activeTab === "focus" ? focusDuration : breakDuration);
                    setSeconds(0);
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <AnimatePresence>
                {showTimerSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-zinc-400">
                      {[
                        { 
                          label: "Focus Block", 
                          value: focusDuration, 
                          onChange: (val: number) => setFocusDuration(Math.max(1, Math.min(60, val))) 
                        },
                        { 
                          label: "Break Window", 
                          value: breakDuration, 
                          onChange: (val: number) => setBreakDuration(Math.max(1, Math.min(60, val))) 
                        },
                      ].map(({ label, value, onChange }) => (
                        <div key={label} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] p-2 rounded-xl">
                          <span className="text-[10px] font-bold tracking-wide uppercase text-zinc-400">{label}</span>
                          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 overflow-hidden">
                            <button 
                              onClick={() => onChange(value - 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="w-8 text-center text-white font-mono text-xs font-bold tabular-nums">
                              {value}m
                            </span>
                            <button 
                              onClick={() => onChange(value + 1)}
                              className="w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 z-50 px-4 max-w-3xl mx-auto flex flex-col items-center pointer-events-auto">
        <div className="relative w-full">

          <AnimatePresence>
            {showPlaylistMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className={`${panelBase} bottom-[calc(100%+10px)] p-3.5 max-h-52 overflow-y-auto`}
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
              >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.06]">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Playlist
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    {playableCount} tracks
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {initialPlaylist.map((track, idx) => {
                    const isDisabled = disabledTrackIndices.includes(idx);
                    const isCurrent = idx === trackIndex;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (!isDisabled) {
                            useAudioStore.setState({ trackIndex: idx });
                            setIsPlaying(true);
                          }
                        }}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all border ${
                          isDisabled
                            ? "opacity-25 border-transparent cursor-default"
                            : isCurrent
                            ? "bg-white/[0.08] border-white/[0.08] cursor-pointer"
                            : "border-transparent hover:bg-white/[0.05] cursor-pointer"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center ${
                          isCurrent ? "bg-white/15" : "bg-white/[0.06]"
                        }`}>
                          <Music2 className={`w-3 h-3 ${isCurrent ? "text-white/70" : "text-white/20"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[10px] font-semibold uppercase tracking-wide truncate ${
                            isDisabled ? "line-through text-zinc-500" : isCurrent ? "text-white" : "text-zinc-300"
                          }`}>
                            {track.title}
                          </p>
                          <p className="text-[9px] text-zinc-500 truncate mt-0.5">{track.artist}</p>
                        </div>
                        <button
                          onClick={(e) => toggleTrackDisabledState(idx, e)}
                          className={`flex-shrink-0 p-1 rounded-md transition-colors ${
                            isDisabled
                              ? "text-emerald-400 hover:text-emerald-300 text-[10px] font-semibold"
                              : "text-zinc-600 hover:text-rose-400"
                          }`}
                        >
                          {isDisabled ? "Restore" : <Trash2 className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showEffectsMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className={`${panelBase} bottom-[calc(100%+10px)] p-4 max-h-72 overflow-y-auto custom-scrollbar`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-zinc-200 tracking-wide">
                    Ambient mixer
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={ambientEnabled}
                      onChange={() => setAmbientEnabled(!ambientEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-700 rounded-full peer-checked:bg-emerald-500 transition-colors relative">
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                        ambientEnabled ? "translate-x-4.5 left-0.5" : "left-0.5"
                      }`} />
                    </div>
                  </label>
                </div>
                <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-white/[0.06]">
                  <Volume2 className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={masterAmbientVol}
                    onChange={(e) => setMasterAmbientVol(parseFloat(e.target.value))}
                    disabled={!ambientEnabled}
                    className="flex-1 h-0.5 appearance-none rounded-full bg-white/10 accent-white cursor-pointer disabled:opacity-30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {EFFECTS.map((eff) => (
                    <EffectCard
                      key={eff.id}
                      id={eff.id}
                      name={eff.name}
                      icon={eff.icon}
                      value={activeEffects[eff.id]}
                      disabled={!ambientEnabled}
                      onChange={updateEffectVolume}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN CONTAINER BAR - UPDATED FOR RESPONSIVE SCALING */}
          <div className="w-full rounded-2xl md:rounded-full border border-white/[0.08] bg-zinc-950/75 backdrop-blur-3xl px-3 py-3 md:px-5 text-white shadow-2xl flex items-center justify-between md:justify-start gap-2 md:gap-4">

            {/* Left Section: Track Transport Controls */}
            <div className="flex items-center gap-1.5 md:gap-2.5 text-zinc-400 flex-shrink-0">
              <button onClick={prevTrack} className="hover:text-white transition-colors active:scale-90 cursor-pointer">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm flex-shrink-0 cursor-pointer"
              >
                {isPlaying
                  ? <Pause className="w-3 h-3 fill-current" />
                  : <Play  className="w-3 h-3 fill-current ml-0.5" />
                }
              </button>
              <button onClick={nextTrack} className="hover:text-white transition-colors active:scale-90 cursor-pointer">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            <Divider />

            {/* Middle Section: Metatags Tracker (Flexible dimensions) */}
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-zinc-800 border border-white/[0.06] flex-shrink-0 relative hidden sm:block">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt="Album art"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <Music2 className="w-3 h-3 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="overflow-hidden whitespace-nowrap">
                  {currentTrack?.title && currentTrack.title.length > 25 ? (
                    <div className={`flex gap-6 ${isPlaying ? "animate-marquee" : ""}`}>
                      <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-100 whitespace-nowrap">
                        {currentTrack.title}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-zinc-100 truncate block">
                      {currentTrack?.title ?? "Station"}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold truncate block mt-0.5">
                  {currentTrack?.artist ?? "Radio"}
                </span>
              </div>
              <button
                onClick={() => { closeAllPanels("playlist"); setShowPlaylistMenu((v) => !v); }}
                className={`flex-shrink-0 p-1 rounded-md transition-colors cursor-pointer ${
                  showPlaylistMenu ? "text-white bg-white/10" : "text-zinc-500 hover:text-white hover:bg-white/[0.06]"
                }`}
                title="Playlist"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </div>

            <Divider />

            {/* Right Operators Block Section */}
            <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">
              
              {/* Mixer Action Item */}
              <button
                onClick={() => { closeAllPanels("effects"); setShowEffectsMenu((v) => !v); }}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-all cursor-pointer ${
                  showEffectsMenu ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title="Ambient mixer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>

              <Divider className="hidden md:block" />

              {/* Volume Scrubber Node Container (Hidden completely on mobile) */}
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                <button onClick={toggleMute} className="hover:text-white transition-colors cursor-pointer">
                  {renderVolumeIcon()}
                </button>
                <input
                  type="range" min="0" max="100" value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-16 h-0.5 appearance-none rounded-full bg-white/10 accent-white cursor-pointer"
                />
              </div>

              <Divider />

              {/* Pomodoro Focus Action Item */}
              <button
                onClick={() => setShowPomodoroPanel((v) => !v)}
                className={`flex-shrink-0 p-1.5 rounded-lg transition-all cursor-pointer ${
                  showPomodoroPanel ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title="Pomodoro timer"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>

              <Divider className="hidden sm:block" />

              {/* Wallpaper Canvas Cycles (Hidden on tiny mobile targets) */}
              <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 text-zinc-400">
                <button
                  onClick={() => cycleWallpaper(-1)}
                  className="hover:text-white transition-colors p-0.5 cursor-pointer"
                  title="Previous background"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <ImageIcon className="w-3.5 h-3.5 opacity-40 select-none pointer-events-none" />
                <button
                  onClick={() => cycleWallpaper(1)}
                  className="hover:text-white transition-colors p-0.5 cursor-pointer"
                  title="Next background"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};