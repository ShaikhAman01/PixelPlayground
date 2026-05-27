"use client";

import { motion } from "framer-motion";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { FloatingBlobs } from "@/components/layout/FloatingBlobs";

import { PixelDecoration } from "@/components/layout/PixelDecoration";

import { PageTransition } from "@/components/layout/PageTransition";

export default function Home() {
  const router =
    useRouter();

  const [username, setUsername] =
    useState("");

  const [roomId, setRoomId] =
    useState("");

  const createRoom = () => {
    if (!username) return;

    localStorage.setItem(
      "username",
      username
    );

    const generatedRoomId =
      crypto.randomUUID().slice(
        0,
        6
      );

    router.push(
      `/room/${generatedRoomId}`
    );
  };

  const joinRoom = () => {
    if (
      !username ||
      !roomId
    )
      return;

    localStorage.setItem(
      "username",
      username
    );

    router.push(
      `/room/${roomId}`
    );
  };

  return (
    <PageTransition>
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <FloatingBlobs />

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-[36px] border border-white/60 bg-white/70 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
              whileHover={{
                rotate: 2,
                scale: 1.04,
              }}
            >
              <PixelDecoration />
            </motion.div>

            <div className="space-y-2">
              <h1 className="font-[family:var(--font-pixel)] text-5xl text-slate-800">
                PixelPlayground
              </h1>

              <p className="leading-relaxed text-slate-500">
                Cozy multiplayer mini-games
                for relaxing with friends.
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div className="mt-10 space-y-5">
            <input
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              placeholder="Your name"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
            />

            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={
                createRoom
              }
              className="w-full rounded-2xl bg-violet-400 px-5 py-4 font-medium text-white shadow-lg shadow-violet-200 transition hover:bg-violet-500"
            >
              Create Room
            </motion.button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs tracking-wide text-slate-400">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Join Room */}
          <div className="space-y-5">
            <input
              value={roomId}
              onChange={(e) =>
                setRoomId(
                  e.target.value
                )
              }
              placeholder="Room code"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />

            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={
                joinRoom
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Join Room
            </motion.button>
          </div>
        </div>
      </motion.div>
    </main>
    </PageTransition>
  );
}