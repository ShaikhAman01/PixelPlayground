import type {
  ClientEvent,
  ServerEvent,
} from "../types/ws.types";

import type {
  TicTacToeState,
} from "../types/game.types";


interface Player {
  id: string;

  username: string;

  symbol: "X" | "O";
}


export class GameRoom {
  private sessions =
    new Map<string, WebSocket>();

  private players: Player[] = [];

  private gameState: TicTacToeState =
    {
      board: Array(9).fill(
        null
      ),

      currentTurn: "X",

      winner: null,

      status: "WAITING",
    };


  constructor(
    private state: DurableObjectState,
    private env: Env
  ) {}


  async fetch(
    request: Request
  ) {
    const upgradeHeader =
      request.headers.get(
        "Upgrade"
      );

    if (
      upgradeHeader !==
      "websocket"
    ) {
      return new Response(
        "Expected websocket",
        {
          status: 426,
        }
      );
    }

    const pair =
      new WebSocketPair();

    const [client, server] =
      Object.values(pair);

    const connectionId =
      crypto.randomUUID();

    server.accept();

    console.log(
      `[PLAYER_CONNECTED] ${connectionId}`
    );

    this.sessions.set(
      connectionId,
      server
    );


    server.addEventListener(
      "message",
      (event) => {
        try {
          const data =
            JSON.parse(
              event.data.toString()
            ) as ClientEvent;

          console.log(
            "[GAME_EVENT]",
            data
          );


          // JOIN ROOM
          if (
            data.type ===
            "JOIN_ROOM"
          ) {
            if (
              this.players
                .length >= 2
            ) {
              this.sendError(
                server,
                "Room full"
              );

              return;
            }

            const symbol =
              this.players
                .length === 0
                ? "X"
                : "O";

            this.players.push({
              id: connectionId,

              username:
                data.payload
                  .username,

              symbol,
            });

            if (
              this.players
                .length === 2
            ) {
              this.gameState.status =
                "PLAYING";
            }

            this.broadcastState();
          }


          // MAKE MOVE
          if (
            data.type ===
            "MAKE_MOVE"
          ) {
            this.handleMove(
              connectionId,
              data.payload.index
            );
          }


          // HEARTBEAT
          if (
            data.type === "PING"
          ) {
            const response: ServerEvent =
              {
                type: "PONG",
              };

            server.send(
              JSON.stringify(
                response
              )
            );
          }
        } catch (error) {
          console.error(error);

          this.sendError(
            server,
            "Invalid message"
          );
        }
      }
    );


    server.addEventListener(
      "close",
      () => {
        console.log(
          `[PLAYER_DISCONNECTED] ${connectionId}`
        );

        this.sessions.delete(
          connectionId
        );

        this.players =
          this.players.filter(
            (p) =>
              p.id !==
              connectionId
          );
      }
    );

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }


  private handleMove(
    playerId: string,
    index: number
  ) {
    if (
      this.gameState.status !==
      "PLAYING"
    ) {
      return;
    }

    const player =
      this.players.find(
        (p) =>
          p.id === playerId
      );

    if (!player) return;

    // Turn validation
    if (
      player.symbol !==
      this.gameState
        .currentTurn
    ) {
      return;
    }

    // Cell already occupied
    if (
      this.gameState.board[
        index
      ] !== null
    ) {
      return;
    }

    this.gameState.board[
      index
    ] = player.symbol;

    // Check winner
    const winner =
      this.checkWinner();

    if (winner) {
      this.gameState.winner =
        winner;

      this.gameState.status =
        "FINISHED";
    } else if (
      this.gameState.board.every(
        (cell) =>
          cell !== null
      )
    ) {
      this.gameState.winner =
        "DRAW";

      this.gameState.status =
        "FINISHED";
    } else {
      this.gameState.currentTurn =
        this.gameState
          .currentTurn === "X"
          ? "O"
          : "X";
    }

    this.broadcastState();
  }


  private checkWinner():
    | "X"
    | "O"
    | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of lines) {
      const [a, b, c] =
        line;

      if (
        this.gameState.board[
          a
        ] &&
        this.gameState.board[
          a
        ] ===
          this.gameState
            .board[b] &&
        this.gameState.board[
          a
        ] ===
          this.gameState
            .board[c]
      ) {
        return this.gameState
          .board[a];
      }
    }

    return null;
  }


  private broadcastState() {
    const response: ServerEvent =
      {
        type: "GAME_STATE",

        payload: {
          players:
            this.players,

          gameState:
            this.gameState,
        },
      };

    const serialized =
      JSON.stringify(
        response
      );

    this.sessions.forEach(
      (socket) => {
        socket.send(
          serialized
        );
      }
    );
  }


  private sendError(
    socket: WebSocket,
    message: string
  ) {
    const response: ServerEvent =
      {
        type: "ERROR",

        payload: {
          message,
        },
      };

    socket.send(
      JSON.stringify(
        response
      )
    );
  }
}