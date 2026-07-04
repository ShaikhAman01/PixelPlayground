import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    passwordHash: text("password_hash"),
    isGuest: integer("is_guest", { mode: "boolean" }).notNull().default(true),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [uniqueIndex("idx_users_username").on(table.username)]
);

export const scores = sqliteTable(
  "scores",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: text("game_id").notNull(),
    outcome: text("outcome").notNull(),
    score: integer("score").notNull().default(0),
    timeSecs: integer("time_secs"),
    moves: integer("moves"),
    difficulty: text("difficulty"),
    createdAt: integer("created_at").notNull(),
  },
  (table) => [
    index("idx_scores_user_game").on(table.userId, table.gameId, table.createdAt),
  ]
);

export const gameStats = sqliteTable(
  "game_stats",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameId: text("game_id").notNull(),
    plays: integer("plays").notNull().default(0),
    wins: integer("wins").notNull().default(0),
    losses: integer("losses").notNull().default(0),
    draws: integer("draws").notNull().default(0),
    bestScore: integer("best_score"),
    bestTimeSecs: integer("best_time_secs"),
    bestMoves: integer("best_moves"),
    currentStreak: integer("current_streak").notNull().default(0),
    bestStreak: integer("best_streak").notNull().default(0),
    lastPlayedDay: text("last_played_day"),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.gameId] }),
    index("idx_game_stats_game").on(table.gameId),
  ]
);

export type User = typeof users.$inferSelect;
export type Score = typeof scores.$inferSelect;
export type GameStatsRow = typeof gameStats.$inferSelect;
