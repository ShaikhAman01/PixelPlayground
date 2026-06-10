import { Hono } from "hono";
import { z } from "zod";
import { jwt } from "hono/jwt";
import type { Env } from "../types";

export const userRouter = new Hono<{ Bindings: Env }>();

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

userRouter.use("/profile", async (c, next) => {
  // Specifying the cryptographic validation algorithm maps the Hono type bounds accurately
  const handler = jwt({ secret: c.env.JWT_SECRET, alg: "HS256" });
  return handler(c, next);
});

userRouter.post("/signup", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    // Zod encapsulates errors within its .issues property array block
    return c.json({ error: "Invalid input layout format", details: parsed.error.issues }, 400);
  }

  return c.json({ success: true, message: "User registered successfully!" });
});

userRouter.post("/login", async (c) => {
  return c.json({ success: true, token: "example.jwt.token" });
});

userRouter.get("/profile", async (c) => {
  const payload = c.get("jwtPayload"); 
  return c.json({ success: true, message: "User profile retrieved", user: payload });
});