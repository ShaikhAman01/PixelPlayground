export interface Env {
  JWT_SECRET: string;
  ALLOWED_ORIGIN: string;
  DB: D1Database;
}

export interface AuthTokenPayload {
  sub: string;
  username: string;
  isGuest: boolean;
  exp: number;
  [key: string]: unknown;
}

/** Hono context variables shared by authenticated routes. */
export interface AuthVariables {
  jwtPayload: AuthTokenPayload;
  requestId: string;
  [key: string]: unknown;
}
