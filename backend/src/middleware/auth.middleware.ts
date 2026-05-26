import { jwt } from "hono/jwt";

export const createAuthMiddleware = (
  secret: string
) => {
  return jwt({
    secret,
    alg: "HS256",
  });
};