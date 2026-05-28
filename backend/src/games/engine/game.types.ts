export type GameStatus =
  | "WAITING"
  | "PLAYING"
  | "FINISHED";

export interface Player {
  id: string;

  username: string;

  symbol: string;
}

export interface GameState<
  TBoard
> {
  board: TBoard;

  currentTurn: string;

  winner: string | null;

  status: GameStatus;

  players: Player[];

  moveHistory: GameMove[];
}

export interface GameMove {
  player: string;

  position: number;

  timestamp: number;
}