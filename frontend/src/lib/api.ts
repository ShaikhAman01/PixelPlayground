// Typed client for the PixelPlayground Workers API.
// Every helper throws ApiError on non-2xx and TypeError on network failure;
// callers that must never block gameplay catch and degrade silently.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export interface PublicUser {
  id: string;
  username: string;
  isGuest: boolean;
}

export interface AuthSession {
  token: string;
  user: PublicUser;
}

export interface GameStats {
  gameId: string;
  plays: number;
  wins: number;
  losses: number;
  draws: number;
  bestScore: number | null;
  bestTimeSecs: number | null;
  bestMoves: number | null;
  currentStreak: number;
  bestStreak: number;
}

export interface LeaderboardEntry {
  username: string;
  isGuest: boolean;
  value: number;
  rank: number;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  me: LeaderboardEntry | null;
  metric: { column: string; direction: "asc" | "desc" };
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SubmitScorePayload =
  | { gameId: "tictactoe"; outcome: "win" | "loss" | "draw"; moves: number; difficulty: Difficulty }
  | { gameId: "connect4"; outcome: "win" | "loss" | "draw"; moves?: number; difficulty: Difficulty }
  | { gameId: "game2048"; outcome: "completed"; score: number }
  | { gameId: "wordle"; outcome: "win" | "loss"; guesses: number; day: string }
  | { gameId: "colormemory"; outcome: "completed"; level: number }
  | { gameId: "slidepuzzle"; outcome: "win"; timeSecs: number; moves: number };

export interface SubmitScoreResult {
  stats: GameStats;
  newBest: boolean;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const request = async <T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): Promise<T> => {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      ...(options.body !== undefined && { "Content-Type": "application/json" }),
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const envelope = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !envelope?.success) {
    throw new ApiError(res.status, envelope?.message ?? `Request failed (${res.status})`);
  }
  return envelope.data;
};

export const api = {
  createGuest: (username?: string) =>
    request<AuthSession>("/api/v1/auth/guest", {
      method: "POST",
      body: username ? { username } : {},
    }),

  signup: (username: string, password: string) =>
    request<AuthSession>("/api/v1/auth/signup", {
      method: "POST",
      body: { username, password },
    }),

  login: (username: string, password: string) =>
    request<AuthSession>("/api/v1/auth/login", {
      method: "POST",
      body: { username, password },
    }),

  /** Guest → registered account; keeps all stats. */
  upgrade: (token: string, username: string, password: string) =>
    request<AuthSession>("/api/v1/auth/upgrade", {
      method: "POST",
      body: { username, password },
      token,
    }),

  me: (token: string) => request<{ user: PublicUser }>("/api/v1/auth/me", { token }),

  rename: (token: string, username: string) =>
    request<AuthSession>("/api/v1/users/me", {
      method: "PATCH",
      body: { username },
      token,
    }),

  submitScore: (token: string, payload: SubmitScorePayload) =>
    request<SubmitScoreResult>("/api/v1/scores", {
      method: "POST",
      body: payload,
      token,
    }),

  myStats: (token: string) => request<{ stats: GameStats[] }>("/api/v1/stats/me", { token }),

  leaderboard: (gameId: string, token?: string, limit = 5) =>
    request<LeaderboardResult>(`/api/v1/leaderboard/${gameId}?limit=${limit}`, { token }),
};
