export interface JWTPayload {
  userId: string;
  exp: number;
}

export interface Env {
  JWT_SECRET: string;

  GAME_ROOM: DurableObjectNamespace;
}