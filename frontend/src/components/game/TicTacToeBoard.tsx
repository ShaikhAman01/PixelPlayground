"use client";

import { useGameStore } from "@/store/game.store";

interface Props {
  onMove: (
    index: number
  ) => void;
}

export const TicTacToeBoard =
  ({
    onMove,
  }: Props) => {
    const {
      board,
      currentTurn,
      winner,
      status,
    } = useGameStore();

    return (
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">
          Tic Tac Toe
        </h1>

        <p>
          Status: {status}
        </p>

        <p>
          Turn: {currentTurn}
        </p>

        {winner && (
          <p>
            Winner: {winner}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2">
          {board.map(
            (
              cell,
              index
            ) => (
              <button
                key={index}
                onClick={() =>
                  onMove(
                    index
                  )
                }
                className="h-24 w-24 border text-3xl font-bold"
              >
                {cell}
              </button>
            )
          )}
        </div>
      </div>
    );
  };