export type Cell =
  | "X"
  | "O"
  | null;

export class Connect4Engine {
  rows = 6;

  cols = 7;

  board: Cell[][];

  currentTurn:
    | "X"
    | "O";

  winner:
    | "X"
    | "O"
    | "DRAW"
    | null;

  status:
    | "PLAYING"
    | "FINISHED";

  constructor() {
    this.board =
      Array.from({
        length:
          this.rows,
      }).map(() =>
        Array(
          this.cols
        ).fill(null)
      );

    this.currentTurn =
      "X";

    this.winner =
      null;

    this.status =
      "PLAYING";
  }

  makeMove(
    col: number
  ) {
    if (
      this.status !==
      "PLAYING"
    ) {
      return false;
    }

    // DROP TO BOTTOM
    for (
      let row =
        this.rows - 1;
      row >= 0;
      row--
    ) {
      if (
        this.board[row][
          col
        ] === null
      ) {
        this.board[row][
          col
        ] =
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
            (row) =>
              row.every(
                (
                  cell
                ) =>
                  cell !==
                  null
              )
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
    }

    return false;
  }

  reset() {
    this.board =
      Array.from({
        length:
          this.rows,
      }).map(() =>
        Array(
          this.cols
        ).fill(null)
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
    const dirs = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];

    for (
      let row = 0;
      row < this.rows;
      row++
    ) {
      for (
        let col = 0;
        col < this.cols;
        col++
      ) {
        const cell =
          this.board[row][
            col
          ];

        if (!cell)
          continue;

        for (const [
          dr,
          dc,
        ] of dirs) {
          let count = 1;

          for (
            let i = 1;
            i < 4;
            i++
          ) {
            const r =
              row +
              dr * i;

            const c =
              col +
              dc * i;

            if (
              r < 0 ||
              r >=
                this.rows ||
              c < 0 ||
              c >=
                this.cols
            ) {
              break;
            }

            if (
              this.board[r][
                c
              ] === cell
            ) {
              count++;
            }
          }

          if (
            count >= 4
          ) {
            return cell;
          }
        }
      }
    }

    return null;
  }
}