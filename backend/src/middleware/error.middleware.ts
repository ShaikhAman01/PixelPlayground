import { Context, Next } from "hono";

import {
  errorResponse,
} from "../utils/helpers";

export const errorMiddleware = async (
  c: Context,
  next: Next
) => {
  try {
    await next();
  } catch (error) {
    console.error(
      "[GLOBAL_ERROR]",
      error
    );

    return c.json(
      errorResponse(
        "Internal server error"
      ),
      500
    );
  }
};