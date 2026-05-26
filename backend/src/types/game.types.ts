export type Cell =
  | "X"
  | "O"
  | null;

export type GameStatus =
  | "WAITING"
  | "PLAYING"
  | "FINISHED";

export interface TicTacToeState {
  board: Cell[];

  currentTurn: "X" | "O";

  winner:
    | "X"
    | "O"
    | "DRAW"
    | null;

  status: GameStatus;
}