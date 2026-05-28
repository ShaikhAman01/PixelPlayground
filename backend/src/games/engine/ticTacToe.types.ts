export interface JoinPayload {
  username: string;
}

export interface MovePayload {
  index: number;
}

export interface WSMessage {
  type: string;

  payload?: any;
}