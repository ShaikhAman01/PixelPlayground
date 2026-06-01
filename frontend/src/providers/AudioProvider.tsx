"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const playlist = [
  {
    title: "Cozy Evening",
    artist: "Lofi Ambience",
    src: "/music/cozy-lofi.mp3",
  },
];

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;

  isPlaying: boolean;

  volume: number;

  currentTrack: number;

  togglePlay: () => void;

  setVolume: (
    volume: number
  ) => void;

  nextTrack: () => void;

  previousTrack: () => void;
}

const AudioContext =
  createContext<AudioContextType | null>(
    null
  );

export function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef =
    useRef<HTMLAudioElement>(
      null
    );

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const saved =
        typeof window !== "undefined"
          ? localStorage.getItem("pp-volume")
          : null;
      return saved ? Number(saved) : 35;
    } catch {
      return 35;
    }
  });

  const [
    currentTrack,
    setCurrentTrack,
  ] = useState(0);

  useEffect(() => {
    if (
      audioRef.current
    ) {
      audioRef.current.volume =
        volume / 100;
    }

    localStorage.setItem(
      "pp-volume",
      String(volume)
    );
  }, [volume]);

  const togglePlay =
    async () => {
      if (
        !audioRef.current
      )
        return;

      try {
        if (isPlaying) {
          audioRef.current.pause();

          setIsPlaying(
            false
          );
        } else {
          await audioRef.current.play();

          setIsPlaying(
            true
          );
        }
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const nextTrack =
    () => {
      setCurrentTrack(
        (prev) =>
          (prev + 1) %
          playlist.length
      );
    };

  const previousTrack =
    () => {
      setCurrentTrack(
        (prev) =>
          prev === 0
            ? playlist.length -
              1
            : prev - 1
      );
    };

  useEffect(() => {
    if (
      !audioRef.current
    )
      return;

    audioRef.current.src =
      playlist[
        currentTrack
      ].src;

    if (
      isPlaying
    ) {
      audioRef.current.play();
    }
  }, [
    currentTrack,
    isPlaying,
  ]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,

        isPlaying,

        volume,

        currentTrack,

        togglePlay,

        setVolume:
          setVolumeState,

        nextTrack,

        previousTrack,
      }}
    >
      {children}

      <audio
        ref={audioRef}
        preload="auto"
        loop
      />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context =
    useContext(
      AudioContext
    );

  if (!context) {
    throw new Error(
      "useAudio must be used inside AudioProvider"
    );
  }

  return context;
}