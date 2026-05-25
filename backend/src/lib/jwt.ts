import { sign } from "hono/jwt";

export const generateToken = async (
  userId: string,
  secret: string
) => {
  return await sign(
    {
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    secret
  );
};