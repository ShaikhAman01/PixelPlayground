"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import { GameLayout } from "@/components/layout/GameLayout";

import { LeftSidebar } from "@/components/layout/LeftSidebar";

import { RightSidebar } from "@/components/layout/RightSidebar";

import { TicTacToeBoard } from "@/components/game/TicTacToeBoard";

import { useSocket } from "@/hooks/useSocket";

export default function RoomPage() {
  const params =
    useParams();

  const roomId =
    params.roomId as string;

  const [username, setUsername] =
    useState("");

  useEffect(() => {
    const storedUsername =
      localStorage.getItem(
        "username"
      );

    if (storedUsername) {
      setUsername(
        storedUsername
      );
    }
  }, []);

  const {
    makeMove,
    rematch,
  } = useSocket(
    roomId,
    username
  );

  if (!username) {
    return null;
  }

  return (
    <GameLayout
      leftSidebar={
        <LeftSidebar
          roomId={roomId}
        />
      }
      rightSidebar={
        <RightSidebar />
      }
    >
      <TicTacToeBoard
        onMove={
          makeMove
        }
        onRematch={
          rematch
        }
      />
    </GameLayout>
  );
}