import { Hono } from "hono";
import { z } from "zod";
import { jwt } from "hono/jwt";

export const userRouter = new Hono();

// Middleware for authenticating routes
userRouter.use("/*", jwt({ secret: async (c) => c.env.JWT_SECRET }));

const userSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const parsed = userSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: "Invalid input", details: parsed.error.errors }, 400);
  }

  // Insertinto database 
  return c.json({ message: "User registered successfully!" });
});


userRouter.post("/login", async (c) => {
  const { username, password } = await c.req.json();

  // Validate user generate JWT
  const token = "example.jwt.token"; 
  return c.json({ token });
});

// Protected 
userRouter.get("/profile", async (c) => {
  const user = c.get("user"); // User from JWT 
  return c.json({ message: "User profile retrieved", user });
});
