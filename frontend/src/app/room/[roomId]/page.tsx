"use client";

import {
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import { Copy } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";

import { TicTacToeBoard } from "@/components/game/TicTacToeBoard";

export default function RoomPage() {
  const params =
    useParams();

  const roomId =
    params.roomId as string;

  const [username, setUsername] =
    useState(() => {
      if (typeof window === "undefined") {
        return "";
      }

      return (
        localStorage.getItem("username") ??
        ""
      );
    });

  const { makeMove, rematch } =
    useSocket(
      roomId,
      username
    );

  const copyRoomId =
    async () => {
      await navigator.clipboard.writeText(
        roomId
      );

      alert(
        "Room ID copied!"
      );
    };

  if (!username) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* ROOM HEADER */}
        <div className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow">
          <div>
            <p className="text-sm text-muted-foreground">
              Room ID
            </p>

            <h2 className="text-2xl font-bold">
              {roomId}
            </h2>
          </div>

          <button
            onClick={
              copyRoomId
            }
            className="rounded-xl border p-3 transition hover:bg-accent"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-xl">
          <TicTacToeBoard
            onMove={
              makeMove
            }
            onRematch={rematch}
          />
        </div>
      </div>
    </main>
  );
}