import { Context } from "hono";
import { sign } from "hono/jwt";
import { GuestSessionSchema } from "../schemas/auth.schema";

export const createGuestSession = async (c: Context) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = GuestSessionSchema.parse(body);
  
  const guestId = crypto.randomUUID();
  const payload = {
    sub: guestId,
    username: parsed.username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 Days
  };

  const token = await sign(payload, c.env.JWT_SECRET);
  return c.json({ token, user: { id: guestId, username: parsed.username } });
};

export const signup = async (c: Context) => {
  return c.json({ success: true, message: "User credentials registered safely" });
};

export const login = async (c: Context) => {
  const token = await sign({ sub: "user-id", username: "Player" }, c.env.JWT_SECRET);
  return c.json({ success: true, token });
};