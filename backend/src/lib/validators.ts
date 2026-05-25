import { z } from "zod";


export const signupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20),

  password: z
    .string()
    .min(6)
    .max(100),
});


export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});