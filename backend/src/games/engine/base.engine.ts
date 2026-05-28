import {
  GameState,
  Player,
} from "./game.types";

export abstract class BaseGameEngine<
  TBoard
> {
  protected state: GameState<TBoard>;

  constructor(
    initialBoard: TBoard
  ) {
    this.state = {
      board: initialBoard,

      currentTurn: "X",

      winner: null,

      status: "WAITING",

      players: [],

      moveHistory: [],
    };
  }

  getPlayerSymbol(
  playerId: string
) {
  const player =
    this.state.players.find(
      (p) =>
        p.id === playerId
    );

  return player?.symbol;
}

getSnapshot() {
  return structuredClone(
    this.state
  );
}

  addPlayer(
    player: Player
  ) {
    if (
      this.state.players.length >=
      2
    ) {
      throw new Error(
        "Room full"
      );
    }

    this.state.players.push(
      player
    );

    if (
      this.state.players.length ===
      2
    ) {
      this.state.status =
        "PLAYING";
    }
  }

  getState() {
    return this.state;
  }

  abstract makeMove(
    player: string,
    position: number
  ): void;

  abstract reset(): void;
}
