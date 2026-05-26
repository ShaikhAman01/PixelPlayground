export interface Env {
  JWT_SECRET: string;
}

export interface JWTPayload {
  userId: string;
  exp: number;
}