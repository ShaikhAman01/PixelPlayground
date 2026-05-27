"use client";

import {
  useEffect,
  useRef,
} from "react";

import { useGameStore } from "@/store/game.store";

export const useSocket = (
  roomId: string,
  username: string
) => {
  const socketRef =
    useRef<WebSocket | null>(
      null
    );

  const setGameState =
    useGameStore(
      (s) =>
        s.setGameState
    );

  const rematch = () => {
  socketRef.current?.send(
    JSON.stringify({
      type: "REMATCH",
    })
  );
};

  useEffect(() => {
      if (!username) return;
    const socket =
      new WebSocket(
        `ws://localhost:8787/ws/${roomId}`
      );

    socketRef.current =
      socket;

    socket.onopen = () => {
      console.log(
        "Connected"
      );

      socket.send(
        JSON.stringify({
          type:
            "JOIN_ROOM",

          payload: {
            username,
          },
        })
      );
    };

    socket.onmessage = (
      event
    ) => {
      const data =
        JSON.parse(
          event.data
        );

      console.log(
        "[SOCKET_EVENT]",
        data
      );

      if (
        data.type ===
        "GAME_STATE"
      ) {
        setGameState({
          ...data.payload
            .gameState,

          players:
            data.payload
              .players,
        });
      }
    };

    socket.onclose = () => {
      console.log(
        "Disconnected"
      );
    };

    return () => {
      socket.close();
    };
  }, [
    roomId,
    username,
    setGameState,
  ]);

  const makeMove = (
    index: number
  ) => {
    socketRef.current?.send(
      JSON.stringify({
        type:
          "MAKE_MOVE",

        payload: {
          index,
        },
      })
    );
  };

  return {
    makeMove,
    rematch,
  };
};