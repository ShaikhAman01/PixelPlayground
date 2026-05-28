"use client";

import {
  useEffect,
  useMemo,
} from "react";

import { GameShell } from "./GameShell";

import { words } from "@/data/wordleWords";

import { useWordleStore } from "@/store/wordle.store";

import { validWords } from "@/data/validWords";

const keyboard = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM",
];

export const WordleGame =
  () => {
    const {
      solution,
      guesses,
      currentGuess,
      status,
      setState,
    } = useWordleStore();

    // DAILY WORD
    const dailyWord =
      useMemo(() => {
        const day =
          Math.floor(
            Date.now() /
              86400000
          );

        return (
          words[
            day %
              words.length
          ]
        );
      }, []);

    // INIT
    useEffect(() => {
      if (
        solution
      )
        return;

      setState({
        solution:
          dailyWord,
      });
    }, []);

    // KEYBOARD INPUT
    useEffect(() => {
      const handleKey =
        (
          e: KeyboardEvent
        ) => {
          if (
            status !==
            "PLAYING"
          ) {
            return;
          }

          const key =
            e.key.toUpperCase();

          // ENTER
          if (
            key ===
            "ENTER"
          ) {
            if (
  currentGuess.length !==
  5
) {
  return;
}

if (
  !validWords.has(
    currentGuess
  )
) {
  alert(
    "Not in word list"
  );

  return;
}

            const next =
              [
                ...guesses,
                currentGuess,
              ];

            if (
              currentGuess ===
              solution
            ) {
              setState({
                guesses:
                  next,

                currentGuess:
                  "",

                status:
                  "WON",
              });

              return;
            }

            if (
              next.length >=
              6
            ) {
              setState({
                guesses:
                  next,

                currentGuess:
                  "",

                status:
                  "LOST",
              });

              return;
            }

            setState({
              guesses:
                next,

              currentGuess:
                "",
            });

            return;
          }

          // BACKSPACE
          if (
            key ===
            "BACKSPACE"
          ) {
            setState({
              currentGuess:
                currentGuess.slice(
                  0,
                  -1
                ),
            });

            return;
          }

          // LETTER
          if (
            /^[A-Z]$/.test(
              key
            )
          ) {
            if (
              currentGuess.length >=
              5
            ) {
              return;
            }

            setState({
              currentGuess:
                currentGuess +
                key,
            });
          }
        };

      window.addEventListener(
        "keydown",
        handleKey
      );

      return () =>
        window.removeEventListener(
          "keydown",
          handleKey
        );
    }, [
      currentGuess,
      guesses,
      solution,
      status,
    ]);

    const getTileClass =
      (
        letter: string,
        index: number
      ) => {
        if (
          solution[index] ===
          letter
        ) {
          return "bg-green-300";
        }

        if (
          solution.includes(
            letter
          )
        ) {
          return "bg-yellow-300";
        }

        return "bg-slate-200";
      };

    return (
      <GameShell
        title="Wordle"
        info="Guess the hidden 5-letter word."
      >
        <div className="flex flex-col items-center">
          {/* GRID */}
          <div className="space-y-3">
            {Array.from({
              length: 6,
            }).map(
              (
                _,
                rowIndex
              ) => {
                const guess =
                  guesses[
                    rowIndex
                  ] ??
                  (rowIndex ===
                  guesses.length
                    ? currentGuess
                    : "");

                return (
                  <div
                    key={
                      rowIndex
                    }
                    className="flex gap-3"
                  >
                    {Array.from({
                      length: 5,
                    }).map(
                      (
                        _,
                        colIndex
                      ) => {
                        const letter =
                          guess[
                            colIndex
                          ];

                        const submitted =
                          rowIndex <
                          guesses.length;

                        return (
                          <div
                            key={
                              colIndex
                            }
                            className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-white/60 text-2xl font-bold shadow-lg ${
                              submitted
                                ? getTileClass(
                                    letter,
                                    colIndex
                                  )
                                : "bg-white/70"
                            }`}
                          >
                            {
                              letter
                            }
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* KEYBOARD */}
          <div className="mt-10 space-y-3">
            {keyboard.map(
              (
                row
              ) => (
                <div
                  key={row}
                  className="flex justify-center gap-2"
                >
                  {row
                    .split("")
                    .map(
                      (
                        key
                      ) => (
                        <button
                          key={
                            key
                          }
                          onClick={() => {
                            window.dispatchEvent(
                              new KeyboardEvent(
                                "keydown",
                                {
                                  key,
                                }
                              )
                            );
                          }}
                          className="rounded-xl bg-white/70 px-4 py-3 text-sm shadow-lg"
                        >
                          {key}
                        </button>
                      )
                    )}
                </div>
              )
            )}
          </div>

          {/* STATUS */}
          <div className="mt-8">
            {status ===
              "WON" && (
              <div className="rounded-full bg-green-200 px-8 py-4 shadow-lg">
                <p className="font-[family:var(--font-pixel)] text-2xl text-green-800">
                  You Won ✨
                </p>
              </div>
            )}

            {status ===
              "LOST" && (
              <div className="rounded-full bg-rose-200 px-8 py-4 shadow-lg">
                <p className="font-[family:var(--font-pixel)] text-2xl text-rose-800">
                  {solution}
                </p>
              </div>
            )}
          </div>
        </div>
      </GameShell>
    );
  };