export type Cell =
  | "X"
  | "O"
  | null;

export class TicTacToeEngine {
  board: Cell[];

  currentTurn:
    | "X"
    | "O";

  winner:
    | "X"
    | "O"
    | "DRAW"
    | null;

  status:
    | "WAITING"
    | "PLAYING"
    | "FINISHED";

  constructor() {
    this.board =
      Array(9).fill(
        null
      );

    this.currentTurn =
      "X";

    this.winner =
      null;

    this.status =
      "PLAYING";
  }

  makeMove(
    index: number
  ) {
    if (
      this.status !==
      "PLAYING"
    ) {
      return false;
    }

    if (
      this.board[index]
    ) {
      return false;
    }

    this.board[index] =
      this.currentTurn;

    const winner =
      this.checkWinner();

    if (winner) {
      this.winner =
        winner;

      this.status =
        "FINISHED";

      return true;
    }

    const isDraw =
      this.board.every(
        (cell) =>
          cell !== null
      );

    if (isDraw) {
      this.winner =
        "DRAW";

      this.status =
        "FINISHED";

      return true;
    }

    this.currentTurn =
      this.currentTurn ===
      "X"
        ? "O"
        : "X";

    return true;
  }

  reset() {
    this.board =
      Array(9).fill(
        null
      );

    this.currentTurn =
      "X";

    this.winner =
      null;

    this.status =
      "PLAYING";
  }

  private checkWinner():
    | "X"
    | "O"
    | null {
    const combos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of combos) {
      const [a, b, c] =
        combo;

      if (
        this.board[a] &&
        this.board[a] ===
          this.board[b] &&
        this.board[a] ===
          this.board[c]
      ) {
        return this.board[
          a
        ] as "X" | "O";
      }
    }

    return null;
  }
}