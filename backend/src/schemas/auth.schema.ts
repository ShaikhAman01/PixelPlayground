import { z } from "zod";

export const GuestSessionSchema = z.object({
  username: z.string().min(2).max(16).default("Cozy Gamer"),
});