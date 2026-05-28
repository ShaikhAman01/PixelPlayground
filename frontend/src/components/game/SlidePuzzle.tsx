"use client";

import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import { GameShell } from "./GameShell";

import { useSlidePuzzleStore } from "@/store/slidePuzzle.store";

import { useTimer } from "@/hooks/useTimer";

const solvedBoard = [
  1, 2, 3,

  4, 5, 6,

  7, 8, 0,
];

export const SlidePuzzle =
  () => {
    const {
      board,
      moves,
      won,
      setState,
    } =
      useSlidePuzzleStore();

    const {
      formattedTime,
      reset,
      start,
      pause,
    } = useTimer({
      autoStart: true,
    });

    const [
      initialized,
      setInitialized,
    ] = useState(false);

    // SHUFFLE
    const shuffleBoard =
      () => {
        const shuffled =
          [
            ...solvedBoard,
          ].sort(
            () =>
              Math.random() -
              0.5
          );

        setState({
          board:
            shuffled,

          moves: 0,

          won: false,
        });

        reset();

        start();
      };

    // INIT
    useEffect(() => {
      if (
        initialized
      )
        return;

      shuffleBoard();

      setInitialized(
        true
      );
    }, []);

    // CHECK WIN
    useEffect(() => {
      if (
        board.length ===
        0
      )
        return;

      const solved =
        board.every(
          (
            value,
            index
          ) =>
            value ===
            solvedBoard[
              index
            ]
        );

      if (solved) {
        pause();

        setState({
          won: true,
        });
      }
    }, [board]);

    // MOVE TILE
    const moveTile =
      (
        index: number
      ) => {
        if (won)
          return;

        const emptyIndex =
          board.indexOf(
            0
          );

        const validMoves =
          [
            emptyIndex -
              1,

            emptyIndex +
              1,

            emptyIndex -
              3,

            emptyIndex +
              3,
          ];

        if (
          !validMoves.includes(
            index
          )
        ) {
          return;
        }

        const newBoard =
          [...board];

        [
          newBoard[
            emptyIndex
          ],

          newBoard[
            index
          ],
        ] = [
          newBoard[index],

          newBoard[
            emptyIndex
          ],
        ];

        setState({
          board:
            newBoard,

          moves:
            moves + 1,
        });
      };

    return (
      <GameShell
        title="Slide Puzzle"
        timer={
          formattedTime
        }
        onRestart={
          shuffleBoard
        }
        info="Arrange all tiles in order."
      >
        <div className="flex flex-col items-center">
          {/* MOVES */}
          <div className="mb-6 rounded-full border border-white/60 bg-white/70 px-6 py-3 shadow-lg">
            <p className="text-slate-600">
              Moves: {moves}
            </p>
          </div>

          {/* BOARD */}
          <div className="grid grid-cols-3 gap-4 rounded-[36px] border border-white/60 bg-white/70 p-5 shadow-xl backdrop-blur-xl">
            {board.map(
              (
                tile,
                index
              ) => (
                <motion.button
                  key={index}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    moveTile(
                      index
                    )
                  }
                  className={`flex h-28 w-28 items-center justify-center rounded-[24px] border text-3xl font-bold shadow-lg transition ${
                    tile === 0
                      ? "border-transparent bg-transparent shadow-none"
                      : "border-white/60 bg-white text-slate-700"
                  }`}
                >
                  {tile !== 0 &&
                    tile}
                </motion.button>
              )
            )}
          </div>

          {/* STATUS */}
          <div className="mt-8">
            {won ? (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full border border-white/60 bg-white/80 px-8 py-4 shadow-lg">
                  <p className="font-[family:var(--font-pixel)] text-3xl text-violet-500">
                    Puzzle Solved ✨
                  </p>
                </div>

                <button
                  onClick={
                    shuffleBoard
                  }
                  className="rounded-full bg-violet-400 px-8 py-4 text-white shadow-lg"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg">
                <p className="text-slate-600">
                  arrange the
                  tiles
                </p>
              </div>
            )}
          </div>
        </div>
      </GameShell>
    );
  };