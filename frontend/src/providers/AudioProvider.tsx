"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const playlist = [
  {
    title: "Midnight Coffee",
    artist: "Lofi Study Beats",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    fallbackSrc: "/music/cozy-lofi.mp3", 
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=60"
  },
  {
    title: "Rainy Desktop",
    artist: "Chillhop Workspace",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    fallbackSrc: "/music/cozy-lofi.mp3",
    albumArt: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=120&auto=format&fit=crop&q=60"
  }
];

interface TrackType {
  title: string;
  artist: string;
  src: string;
  fallbackSrc?: string;
  albumArt: string;
}

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  volume: number;
  currentTrack: number; // Sticking to index mapping pattern
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState<number>(35);
  const [isMounted, setIsMounted] = useState(false);

  const activeTrackPayload = playlist[trackIndex] || null;

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem("pp-volume");
      if (saved) setVolumeState(Number(saved));
    } catch (e) {
      console.warn("Storage sync failed:", e);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    if (isMounted) {
      try {
        localStorage.setItem("pp-volume", String(volume));
      } catch (e) {
        // Safe fall-through
      }
    }
  }, [volume, isMounted]);

  useEffect(() => {
    if (!audioRef.current || !activeTrackPayload || !isMounted) return;

    audioRef.current.pause();
    audioRef.current.src = activeTrackPayload.src;
    audioRef.current.load();

    if (isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => handlePlaybackFallback(activeTrackPayload));
    }
  }, [trackIndex, isMounted]);

  const handlePlaybackFallback = (track: TrackType) => {
    if (!audioRef.current || !track.fallbackSrc) {
      setIsPlaying(false);
      return;
    }
    
    console.warn("External stream blocked by extension proxy. Attempting local asset recovery path...");
    audioRef.current.src = track.fallbackSrc;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("Critical Audio Pipeline failure:", err);
        setIsPlaying(false);
      });
  };

  const togglePlay = async () => {
    if (!audioRef.current || !activeTrackPayload) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (!audioRef.current.src) {
          audioRef.current.src = activeTrackPayload.src;
          audioRef.current.load();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn("Initial play route intercepted. Running dynamic fallback strategy...");
      handlePlaybackFallback(activeTrackPayload);
    }
  };

  const nextTrack = () => {
    setIsPlaying(false);
    setTrackIndex((prev) => (prev + 1) % playlist.length);
    setTimeout(() => setIsPlaying(true), 50);
  };

  const previousTrack = () => {
    setIsPlaying(false);
    setTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setTimeout(() => setIsPlaying(true), 50);
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        volume,
        currentTrack: trackIndex,
        togglePlay,
        setVolume: setVolumeState,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
      <audio ref={audioRef} preload="auto" crossOrigin="anonymous" loop />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be wrapped inside an AudioProvider node.");
  return context;
}