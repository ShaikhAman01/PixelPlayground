"use client";

import { useRouter } from "next/navigation";

import {
  useState,
} from "react";

export default function Home() {
  const router =
    useRouter();

  const [username, setUsername] =
    useState("");

  const [roomId, setRoomId] =
    useState("");


  const createRoom = () => {
    if (!username) return;

    const generatedRoomId =
      crypto.randomUUID().slice(
        0,
        6
      );

    localStorage.setItem(
      "username",
      username
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
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border p-8 shadow">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">
            PixelPlayground
          </h1>

          <p className="text-muted-foreground">
            Multiplayer Mini Games
          </p>
        </div>


        <div className="space-y-4">
          <input
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            placeholder="Username"
            className="w-full rounded-lg border p-3"
          />

          <button
            onClick={
              createRoom
            }
            className="w-full rounded-lg bg-black p-3 text-white"
          >
            Create Room
          </button>
        </div>


        <div className="space-y-4">
          <input
            value={roomId}
            onChange={(e) =>
              setRoomId(
                e.target.value
              )
            }
            placeholder="Room ID"
            className="w-full rounded-lg border p-3"
          />

          <button
            onClick={
              joinRoom
            }
            className="w-full rounded-lg border p-3"
          >
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}