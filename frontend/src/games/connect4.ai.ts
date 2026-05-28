import { Cell } from "./connect4.engine";

export class Connect4AI {
  getMove(
    board: Cell[][]
  ) {
    const validCols: number[] =
      [];

    for (
      let col = 0;
      col < 7;
      col++
    ) {
      if (
        board[0][col] ===
        null
      ) {
        validCols.push(
          col
        );
      }
    }

    if (
      validCols.length ===
      0
    ) {
      return null;
    }

    // CENTER PRIORITY
    if (
      validCols.includes(
        3
      )
    ) {
      return 3;
    }

    return validCols[
      Math.floor(
        Math.random() *
          validCols.length
      )
    ];
  }
}