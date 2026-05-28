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

  // REMATCH
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

    // CONNECTED
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

    // RECEIVE MESSAGE
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

      switch (
        data.type
      ) {
        // GAME STATE
        case "GAME_STATE": {
          setGameState({
            board:
              data.payload
                .board,

            currentTurn:
              data.payload
                .currentTurn,

            winner:
              data.payload
                .winner,

            status:
              data.payload
                .status,

            players:
              data.payload
                .players,

            moveHistory:
              data.payload
                .moveHistory,
          });

          break;
        }

        // ERROR
        case "ERROR": {
          console.error(
            data.payload
              ?.message
          );

          break;
        }

        default:
          break;
      }
    };

    // DISCONNECTED
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

  // MAKE MOVE
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