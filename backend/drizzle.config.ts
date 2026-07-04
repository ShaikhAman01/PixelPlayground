import { defineConfig } from "drizzle-kit";

// Generates SQL migrations from src/db/schema.ts diffs:
//   npx drizzle-kit generate --name <change>
// Apply them with wrangler:
//   npx wrangler d1 migrations apply DB --local   (or --remote)
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./src/db/schema.ts",
  out: "./migrations",
});
