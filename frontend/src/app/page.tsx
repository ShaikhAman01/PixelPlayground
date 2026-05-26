"use client";

import { useSocket } from "@/hooks/useSocket";

import { TicTacToeBoard } from "@/components/game/TicTacToeBoard";

export default function Home() {
  const {
    makeMove,
  } = useSocket(
    "tic-1",
    "aman"
  );

  return (
    <main className="flex min-h-screen items-center justify-center">
      <TicTacToeBoard
        onMove={
          makeMove
        }
      />
    </main>
  );
}