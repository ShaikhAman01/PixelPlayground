import { Hono } from "hono";
import { z } from "zod";

export const gamesRouter = new Hono();


const gameSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});


gamesRouter.get("/", async (c) => {
  // Fetch games from db
  const games = [
    { id: 1, name: "Tic Tac Toe", description: "A classic game" },
    { id: 2, name: "Chess", description: "Strategic board game" },
  ];
  return c.json({ games });
});


gamesRouter.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = gameSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.errors }, 400);
  }

  // Insert game in db
  return c.json({ message: "Game created successfully!" });
});


gamesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  // Fetch game from db
  const game = { id, name: "Tic Tac Toe", description: "A classic game" };

  if (!game) return c.json({ error: "Game not found" }, 404);

  return c.json({ game });
});
