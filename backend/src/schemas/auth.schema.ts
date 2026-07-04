import { z } from "zod";

const username = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, - and _");

const password = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100);

export const GuestSessionSchema = z.object({
  username: username.optional(),
});

export const SignupSchema = z.object({
  username,
  password,
});

export const LoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const RenameSchema = z.object({
  username,
});
