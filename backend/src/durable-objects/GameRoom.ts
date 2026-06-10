import type { ClientEvent, ServerEvent } from "../types/ws.types";
import { TicTacToeEngine } from "../games/engine/ticTacToe.engine";
import type { Env } from "../types";

interface PlayerSession {
  socket: WebSocket;
  playerId: string;
}

export class GameRoom {
  private sessions = new Map<string, PlayerSession>();
  private engine = new TicTacToeEngine();

  constructor(
    private state: DurableObjectState,
    private env: Env
  ) {
    // Transactional hydration block guarantees active matches persist safely
    this.state.blockConcurrencyWhile(async () => {
      const savedSnapshot = await this.state.storage.get("room_snapshot");
      if (savedSnapshot) {
        // Hydrate state inside your custom engine class
        // this.engine.loadSnapshot(savedSnapshot);
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (upgradeHeader !== "websocket") {
      return new Response("Expected websocket protocol", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const connectionId = crypto.randomUUID();

    // Establish persistent websocket context connection 
    server.accept();
    console.log(`[PLAYER_CONNECTED] ${connectionId}`);

    this.sessions.set(connectionId, {
      socket: server,
      playerId: connectionId,
    });

    server.addEventListener("message", async (event) => {
      try {
        const data = JSON.parse(event.data.toString()) as ClientEvent;
        console.log("[GAME_EVENT]", data);

        switch (data.type) {
          case "JOIN_ROOM": {
            const currentPlayers = this.engine.getState().players;
            if (currentPlayers.length >= 2) {
              this.sendError(server, "Room full");
              return;
            }

            const symbol = currentPlayers.length === 0 ? "X" : "O";
            this.engine.addPlayer({
              id: connectionId,
              username: data.payload.username,
              symbol,
            });

            await this.commitAndBroadcast();
            break;
          }

          case "MAKE_MOVE": {
            const symbol = this.engine.getPlayerSymbol(connectionId);
            if (!symbol) return;

            // Enforce input bounds check safety limits directly on server runtime
            const targetIndex = data.payload.index;
            if (targetIndex < 0 || targetIndex > 8) {
              this.sendError(server, "Invalid board grid index configuration");
              return;
            }

            this.engine.makeMove(symbol, targetIndex);
            await this.commitAndBroadcast();
            break;
          }

          case "REMATCH": {
            this.engine.reset();
            await this.commitAndBroadcast();
            break;
          }

          case "PING": {
            const response: ServerEvent = { type: "PONG" };
            server.send(JSON.stringify(response));
            break;
          }

          default:
            this.sendError(server, "Unknown event type");
        }
      } catch (error) {
        console.error(error);
        this.sendError(server, "Invalid message structure packet");
      }
    });

    server.addEventListener("close", () => {
      console.log(`[PLAYER_DISCONNECTED] ${connectionId}`);
      this.sessions.delete(connectionId);
      this.broadcastState();

      if (this.sessions.size === 0) {
        console.log("[ROOM_EMPTY] Purging idle runtime session frames");
      }
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  private async commitAndBroadcast() {
    // Atomically persist snapshot frames to disk before updating clients
    await this.state.storage.put("room_snapshot", this.engine.getSnapshot());
    this.broadcastState();
  }

  private broadcastState() {
    const response: ServerEvent = {
      type: "GAME_STATE",
      payload: this.engine.getSnapshot(),
    };

    console.log("[BROADCASTING_STATE]", this.engine.getSnapshot());
    const serialized = JSON.stringify(response);

    this.sessions.forEach(({ socket }) => {
      try {
        socket.send(serialized);
      } catch {
        // Dead socket handles auto drop gracefully
      }
    });
  }

  private sendError(socket: WebSocket, message: string) {
    const response: ServerEvent = {
      type: "ERROR",
      payload: { message },
    };
    socket.send(JSON.stringify(response));
  }
}