import { Context, Next } from "hono";

// Fixed-window counter kept in isolate memory. This is best-effort only:
// each Workers isolate has its own map and it resets on eviction. Good
// enough to blunt brute-force attempts on auth endpoints without adding
// infrastructure; swap for a Durable Object / KV counter if this ever
// needs to be a real guarantee.
const WINDOW_MS = 60_000;

const buckets = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = (limit: number) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header("cf-connecting-ip") ?? "local";
    const key = `${ip}:${c.req.path}`;
    const now = Date.now();

    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      bucket.count++;
      if (bucket.count > limit) {
        return c.json(
          { success: false, message: "Too many requests, slow down a little" },
          429
        );
      }
    }

    // Opportunistic cleanup so the map doesn't grow unbounded
    if (buckets.size > 5_000) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
      }
    }

    await next();
  };
};
