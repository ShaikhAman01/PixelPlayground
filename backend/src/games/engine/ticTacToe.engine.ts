import { BaseGameEngine } from "./base.engine";

export class TicTacToeEngine extends BaseGameEngine<
  (string | null)[]
> {
  constructor() {
    super(
      Array(9).fill(null)
    );
  }

  makeMove(
    player: string,
    position: number
  ) {
    if (
      this.state.status !==
      "PLAYING"
    ) {
      return;
    }

    if (
      this.state.board[
        position
      ]
    ) {
      return;
    }

    if (
      player !==
      this.state.currentTurn
    ) {
      return;
    }

    this.state.board[
      position
    ] = player;

    this.state.moveHistory.push(
      {
        player,

        position,

        timestamp:
          Date.now(),
      }
    );

    const winner =
      this.checkWinner();

    if (winner) {
      this.state.winner =
        winner;

      this.state.status =
        "FINISHED";

      return;
    }

    const isDraw =
      this.state.board.every(
        (cell) => cell !== null
      );

    if (isDraw) {
      this.state.winner =
        "DRAW";

      this.state.status =
        "FINISHED";

      return;
    }

    this.state.currentTurn =
      player === "X"
        ? "O"
        : "X";
  }

  reset() {
    this.state.board =
      Array(9).fill(null);

    this.state.currentTurn =
      "X";

    this.state.winner =
      null;

    this.state.status =
      "PLAYING";

    this.state.moveHistory =
      [];
  }

  private checkWinner():
    | string
    | null {
    const board =
      this.state.board;

    const combinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of combinations) {
      const [a, b, c] =
        combo;

      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }

    return null;
  }
}