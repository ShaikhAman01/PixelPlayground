import type {
  ClientEvent,
  ServerEvent,
} from "../types/ws.types";

import {
  TicTacToeEngine,
} from "../games/engine/ticTacToe.engine";

interface PlayerSession {
  socket: WebSocket;

  playerId: string;
}

export class GameRoom {
  private sessions =
    new Map<
      string,
      PlayerSession
    >();

  private engine =
    new TicTacToeEngine();

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
      {
        socket: server,

        playerId:
          connectionId,
      }
    );

    server.addEventListener(
      "message",
      async (
        event
      ) => {
        try {
          const data =
            JSON.parse(
              event.data.toString()
            ) as ClientEvent;

          console.log(
            "[GAME_EVENT]",
            data
          );

          switch (
            data.type
          ) {
            // JOIN ROOM
            case "JOIN_ROOM": {
              const currentPlayers =
                this.engine.getState()
                  .players;

              if (
                currentPlayers.length >=
                2
              ) {
                this.sendError(
                  server,
                  "Room full"
                );

                return;
              }

              const symbol =
                currentPlayers.length ===
                0
                  ? "X"
                  : "O";

              this.engine.addPlayer(
                {
                  id: connectionId,

                  username:
                    data.payload
                      .username,

                  symbol,
                }
              );

              this.broadcastState();

              break;
            }

            // MAKE MOVE
            case "MAKE_MOVE": {
              const symbol =
                this.engine.getPlayerSymbol(
                  connectionId
                );

              if (
                !symbol
              ) {
                return;
              }

              this.engine.makeMove(
                symbol,
                data.payload
                  .index
              );

              this.broadcastState();

              break;
            }

            // REMATCH
            case "REMATCH": {
              this.engine.reset();

              this.broadcastState();

              break;
            }

            // HEARTBEAT
            case "PING": {
              const response: ServerEvent =
                {
                  type: "PONG",
                };

              server.send(
                JSON.stringify(
                  response
                )
              );

              break;
            }

            default:
              this.sendError(
                server,
                "Unknown event"
              );
          }
        } catch (error) {
          console.error(
            error
          );

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

        this.broadcastState();

        // Cleanup if empty
        if (
          this.sessions.size ===
          0
        ) {
          console.log(
            "[ROOM_EMPTY]"
          );
        }
      }
    );

    return new Response(
      null,
      {
        status: 101,

        webSocket:
          client,
      }
    );
  }

  private broadcastState() {
    const response: ServerEvent =
      {
        type: "GAME_STATE",

        payload:
          this.engine.getSnapshot(),
      };

    console.log(
      "[BROADCASTING_STATE]",
      this.engine.getSnapshot()
    );

    const serialized =
      JSON.stringify(
        response
      );

    this.sessions.forEach(
      ({
        socket,
      }) => {
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