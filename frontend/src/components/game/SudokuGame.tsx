"use client";

import {
  useEffect,
} from "react";

import { GameShell } from "./GameShell";

import { useSudokuStore } from "@/store/sudoku.store";

import { useTimer } from "@/hooks/useTimer";

const starterPuzzle = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],

  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],

  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

export const SudokuGame =
  () => {
    const {
      board,
      initialBoard,
      won,
      setState,
    } =
      useSudokuStore();

    const {
      formattedTime,
    } = useTimer({
      autoStart: true,
    });

    // INIT
    useEffect(() => {
      if (
        board.length
      )
        return;

      setState({
        board:
          structuredClone(
            starterPuzzle
          ),

        initialBoard:
          structuredClone(
            starterPuzzle
          ),
      });
    }, []);

    // INPUT
    const updateCell =
      (
        row: number,
        col: number,
        value: string
      ) => {
        if (
          initialBoard[
            row
          ]?.[col] !== 0
        ) {
          return;
        }

        const number =
          Number(value);

        if (
          value &&
          (number < 1 ||
            number > 9)
        ) {
          return;
        }

        const next =
          structuredClone(
            board
          );

        next[row][col] =
          number || 0;

        // CHECK WIN
        const complete =
          next.every(
            (row) =>
              row.every(
                (cell) =>
                  cell !==
                  0
              )
          );

        setState({
          board: next,

          won:
            complete,
        });
      };

    return (
      <GameShell
        title="Sudoku"
        timer={
          formattedTime
        }
        info="Fill the board with numbers 1–9."
      >
        <div className="flex flex-col items-center">
          {/* GRID */}
          <div className="shell-game-area grid grid-cols-9 gap-[2px] rounded-[28px] border border-white/60 bg-white/70 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            {board.flatMap(
              (
                row,
                rowIndex
              ) =>
                row.map(
                  (
                    cell,
                    colIndex
                  ) => (
                    <input
                      key={`${rowIndex}-${colIndex}`}
                      value={
                        cell ===
                        0
                          ? ""
                          : cell
                      }
                      onChange={(
                        e
                      ) =>
                        updateCell(
                          rowIndex,
                          colIndex,
                          e.target
                            .value
                        )
                      }
                      maxLength={
                        1
                      }
                      className={`h-12 w-12 rounded-xl text-center text-lg font-bold outline-none transition-colors duration-300 ${
                        initialBoard[
                          rowIndex
                        ]?.[
                          colIndex
                        ] !== 0
                          ? "bg-violet-200 text-slate-700 dark:bg-violet-900/40 dark:text-slate-200"
                          : "bg-white text-violet-500 dark:bg-slate-950 dark:text-violet-400"
                      }`}
                    />
                  )
                )
            )}
          </div>

          {/* STATUS */}
          <div className="mt-8">
            {won ? (
              <div className="shell-title-panel rounded-full bg-green-200 px-8 py-4 shadow-lg transition-all duration-300 dark:bg-emerald-950/60 dark:border dark:border-emerald-500/20">
                <p className="font-[family:var(--font-pixel)] text-2xl text-green-800 dark:text-emerald-400">
                  Puzzle Solved ✨
                </p>
              </div>
            ) : (
              <div className="shell-title-panel rounded-full border border-white/60 bg-white/70 px-6 py-4 shadow-lg transition-all duration-300 dark:border-white/10 dark:bg-slate-900/60">
                <p className="text-title text-slate-600 transition-colors duration-300 dark:text-slate-350">
                  complete the puzzle
                </p>
              </div>
            )}
          </div>
        </div>
      </GameShell>
    );
  };