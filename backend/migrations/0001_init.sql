-- Initial schema: users, score history, per-game aggregate stats.
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL COLLATE NOCASE,
    password_hash TEXT,
    is_guest INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX idx_users_username ON users (username);

CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    outcome TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    time_secs INTEGER,
    moves INTEGER,
    difficulty TEXT,
    created_at INTEGER NOT NULL
);

CREATE INDEX idx_scores_user_game ON scores (user_id, game_id, created_at);

CREATE TABLE game_stats (
    user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    plays INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    best_score INTEGER,
    best_time_secs INTEGER,
    best_moves INTEGER,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    last_played_day TEXT,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, game_id)
);

CREATE INDEX idx_game_stats_game ON game_stats (game_id);
