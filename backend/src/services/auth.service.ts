import { eq, sql } from "drizzle-orm";
import { sign } from "hono/jwt";
import type { Database } from "../db/client";
import { users, type User } from "../db/schema";
import { hashPassword, verifyPassword } from "../lib/password";
import type { AuthTokenPayload } from "../types";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const ADJECTIVES = ["Cozy", "Sleepy", "Pixel", "Mellow", "Dreamy", "Snug", "Gentle", "Lofi"];
const ANIMALS = ["Fox", "Cat", "Owl", "Panda", "Bunny", "Otter", "Koala", "Duck"];

const randomFrom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateGuestName = () =>
  `${randomFrom(ADJECTIVES)} ${randomFrom(ANIMALS)} ${Math.floor(1000 + Math.random() * 9000)}`;

export interface PublicUser {
  id: string;
  username: string;
  isGuest: boolean;
}

export const toPublicUser = (user: User): PublicUser => ({
  id: user.id,
  username: user.username,
  isGuest: user.isGuest,
});

export const signToken = async (user: PublicUser, secret: string) => {
  const payload: AuthTokenPayload = {
    sub: user.id,
    username: user.username,
    isGuest: user.isGuest,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };
  return sign(payload, secret);
};

const findByUsername = async (db: Database, username: string) => {
  const rows = await db
    .select()
    .from(users)
    .where(sql`${users.username} = ${username} COLLATE NOCASE`)
    .limit(1);
  return rows[0] ?? null;
};

export const findById = async (db: Database, id: string): Promise<User | null> => {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
};

export const createGuest = async (db: Database, requestedName?: string): Promise<User> => {
  // Guest usernames share the unique index with real accounts, so retry
  // with a fresh generated name on collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const username =
      attempt === 0 && requestedName ? requestedName : generateGuestName();

    const existing = await findByUsername(db, username);
    if (existing) continue;

    const user: User = {
      id: crypto.randomUUID(),
      username,
      passwordHash: null,
      isGuest: true,
      createdAt: Date.now(),
    };
    await db.insert(users).values(user);
    return user;
  }
  throw new Error("Could not allocate a guest username");
};

export type CredentialResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

export const signup = async (
  db: Database,
  username: string,
  password: string
): Promise<CredentialResult> => {
  if (await findByUsername(db, username)) {
    return { ok: false, message: "That username is already taken" };
  }

  const user: User = {
    id: crypto.randomUUID(),
    username,
    passwordHash: await hashPassword(password),
    isGuest: false,
    createdAt: Date.now(),
  };
  await db.insert(users).values(user);
  return { ok: true, user };
};

export const login = async (
  db: Database,
  username: string,
  password: string
): Promise<CredentialResult> => {
  const user = await findByUsername(db, username);
  if (!user?.passwordHash) {
    return { ok: false, message: "Invalid username or password" };
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { ok: false, message: "Invalid username or password" };
  }
  return { ok: true, user };
};

/** Converts a guest into a full account, keeping all stats/scores. */
export const upgradeGuest = async (
  db: Database,
  userId: string,
  username: string,
  password: string
): Promise<CredentialResult> => {
  const user = await findById(db, userId);
  if (!user) return { ok: false, message: "Account not found" };
  if (!user.isGuest) return { ok: false, message: "Account is already registered" };

  const taken = await findByUsername(db, username);
  if (taken && taken.id !== userId) {
    return { ok: false, message: "That username is already taken" };
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(users)
    .set({ username, passwordHash, isGuest: false })
    .where(eq(users.id, userId));

  return { ok: true, user: { ...user, username, passwordHash, isGuest: false } };
};

export const renameUser = async (
  db: Database,
  userId: string,
  username: string
): Promise<CredentialResult> => {
  const user = await findById(db, userId);
  if (!user) return { ok: false, message: "Account not found" };

  const taken = await findByUsername(db, username);
  if (taken && taken.id !== userId) {
    return { ok: false, message: "That username is already taken" };
  }

  await db.update(users).set({ username }).where(eq(users.id, userId));
  return { ok: true, user: { ...user, username } };
};
