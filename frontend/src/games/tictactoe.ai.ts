import { Cell } from "./tictactoe.engine";

export const getCpuMove =
  (
    board: Cell[]
  ) => {
    const emptyCells =
      board
        .map(
          (
            cell,
            index
          ) => ({
            cell,
            index,
          })
        )
        .filter(
          (
            item
          ) =>
            item.cell ===
            null
        );

    if (
      emptyCells.length ===
      0
    ) {
      return null;
    }

    const randomMove =
      emptyCells[
        Math.floor(
          Math.random() *
            emptyCells.length
        )
      ];

    return randomMove.index;
  };