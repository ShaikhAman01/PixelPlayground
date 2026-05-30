"use client";

import {
  Pause,
  Play,
  Volume2,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { motion } from "framer-motion";

import { GlassPanel } from "../ui/GlassPanel";

export const MusicPlayer =
  () => {
    const [playing, setPlaying] =
      useState(false);

    const [volume, setVolume] =
      useState(35);

    const audioRef =
      useRef<HTMLAudioElement>(
        null
      );

    useEffect(() => {
      if (
        audioRef.current
      ) {
        audioRef.current.volume =
          volume / 100;
      }
    }, [volume]);

    const toggleMusic =
      async () => {
        if (
          !audioRef.current
        )
          return;

        if (playing) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }

        setPlaying(
          !playing
        );
      };

    return (
      <>
        {/* AUDIO */}
        <audio
          ref={audioRef}
          loop
          preload="auto"
        >
          <source
            src="/music/cozy-lofi.mp3"
            type="audio/mpeg"
          />
        </audio>

        {/* PLAYER */}
        <GlassPanel className="flex items-center gap-5 px-5 py-4">
          {/* Album Art */}
          <motion.div
            animate={{
              rotate: playing
                ? 360
                : 0,
            }}
            transition={{
              duration: 12,
              repeat:
                Infinity,
              ease: "linear",
            }}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-pink-200 to-sky-200 shadow-inner"
          >
            {/* Vinyl */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
              <div className="h-3 w-3 rounded-full bg-white" />
            </div>
          </motion.div>

          {/* Song Info */}
          <div className="min-w-[180px]">
            <p className="font-medium text-slate-700">
              cozy evening
            </p>

            <p className="mt-1 text-sm text-slate-400">
              lofi ambience
            </p>

            {/* Fake waveform */}
            <div className="mt-3 flex h-5 items-end gap-1">
              {Array.from({
                length: 18,
              }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height:
                      playing
                        ? [
                            6,
                            18,
                            10,
                            14,
                            6,
                          ]
                        : 6,
                  }}
                  transition={{
                    duration:
                      1 +
                      Math.random(),
                    repeat:
                      Infinity,
                  }}
                  className="w-1 rounded-full bg-violet-300"
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-3">
            {/* Play Button */}
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={
                toggleMusic
              }
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400 text-white shadow-lg shadow-violet-200"
            >
              {playing ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-1 h-5 w-5" />
              )}
            </motion.button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-slate-400" />

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(
                  e
                ) =>
                  setVolume(
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className="h-1 w-24 cursor-pointer accent-violet-400"
              />
            </div>
          </div>
        </GlassPanel>
      </>
    );
  };