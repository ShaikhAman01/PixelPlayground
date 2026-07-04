CREATE TABLE `game_stats` (
	`user_id` text NOT NULL,
	`game_id` text NOT NULL,
	`plays` integer DEFAULT 0 NOT NULL,
	`wins` integer DEFAULT 0 NOT NULL,
	`losses` integer DEFAULT 0 NOT NULL,
	`draws` integer DEFAULT 0 NOT NULL,
	`best_score` integer,
	`best_time_secs` integer,
	`best_moves` integer,
	`current_streak` integer DEFAULT 0 NOT NULL,
	`best_streak` integer DEFAULT 0 NOT NULL,
	`last_played_day` text,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `game_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_game_stats_game` ON `game_stats` (`game_id`);--> statement-breakpoint
CREATE TABLE `scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`game_id` text NOT NULL,
	`outcome` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`time_secs` integer,
	`moves` integer,
	`difficulty` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_scores_user_game` ON `scores` (`user_id`,`game_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text,
	`is_guest` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
-- Hand-tuned: drizzle-kit can't express COLLATE NOCASE; uniqueness must be
-- case-insensitive so "Aman" and "aman" are one identity.
CREATE UNIQUE INDEX `idx_users_username` ON `users` (`username` COLLATE NOCASE);