export interface JoinRoomEvent {
  type: "JOIN_ROOM";

  payload: {
    username: string;
  };
}

export interface MakeMoveEvent {
  type: "MAKE_MOVE";

  payload: {
    index: number;
  };
}

export interface PingEvent {
  type: "PING";
}
export interface RematchEvent {
type: "REMATCH";
}

export type ClientEvent =
  | JoinRoomEvent
  | MakeMoveEvent
  | PingEvent
  | RematchEvent


export interface GameStateEvent {
  type: "GAME_STATE";

  payload: unknown;
}

export interface ErrorEvent {
  type: "ERROR";

  payload: {
    message: string;
  };
}

export interface PongEvent {
  type: "PONG";
}

export type ServerEvent =
  | GameStateEvent
  | ErrorEvent
  | PongEvent;
