"use client";

import { motion } from "framer-motion";

import { useGameStore } from "@/store/game.store";

interface Player {
  id: string;
  username: string;
  symbol: string;
}

interface Props {
  onMove: (
    index: number
  ) => void;
  onRematch: () => void;
}

export const TicTacToeBoard =
  ({
    onMove,
    onRematch
  }: Props) => {
    const {
      board,
      currentTurn,
      winner,
      status,
      players,
    } = useGameStore();

    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-8">
        {/* HEADER */}
        <div className="space-y-2 text-center">
          <h1 className="text-5xl font-black tracking-tight">
            PixelPlayground
          </h1>

          <p className="text-muted-foreground">
            Multiplayer Tic Tac Toe
          </p>
        </div>


        {/* PLAYERS */}
        <div className="grid w-full grid-cols-2 gap-4">
          {players.map(
            (player: Player) => (
              <div
                key={player.id}
                className={`rounded-2xl border p-4 transition ${
                  currentTurn ===
                  player.symbol
                    ? "border-green-500 bg-green-500/10"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {
                        player.username
                      }
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Player
                    </p>
                  </div>

                  <div className="text-3xl font-black">
                    {
                      player.symbol
                    }
                  </div>
                </div>
              </div>
            )
          )}
        </div>


        {/* STATUS */}
        <div className="text-center">
          {status ===
            "WAITING" && (
            <p className="text-lg text-muted-foreground">
              Waiting for
              opponent...
            </p>
          )}

          {status ===
            "PLAYING" && (
            <p className="text-lg font-medium">
              Turn:{" "}
              {currentTurn}
            </p>
          )}

          {winner && (
            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              className="space-y-1"
            >
              <p className="text-3xl font-black text-green-500">
                {winner ===
                "DRAW"
                  ? "Draw!"
                  : `${winner} Wins!`}
              </p>
            </motion.div>
          )}

          <button
  onClick={
    onRematch
  }
  className="mt-4 rounded-xl bg-black px-6 py-3 text-white"
>
  Play Again
</button>
        </div>


        {/* BOARD */}
        <div className="grid grid-cols-3 gap-3">
          {board.map(
            (
              cell,
              index
            ) => (
              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                key={index}
                onClick={() =>
                  onMove(
                    index
                  )
                }
                disabled={
                  !!cell ||
                  status !==
                    "PLAYING"
                }
                className="flex h-28 w-28 items-center justify-center rounded-2xl border bg-card text-5xl font-black shadow transition hover:bg-accent disabled:cursor-not-allowed"
              >
                <motion.span
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                >
                  {cell}
                </motion.span>
              </motion.button>
            )
          )}
        </div>
      </div>
    );
  };