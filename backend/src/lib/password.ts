// PBKDF2 via WebCrypto — bcrypt implementations in JS blow the Workers
// CPU budget, while PBKDF2 runs natively in the runtime.
const ITERATIONS = 100_000;
const HASH_BYTES = 32;

const toBase64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
};

const fromBase64 = (b64: string) =>
  Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));

const derive = async (password: string, salt: Uint8Array, iterations: number) => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    key,
    HASH_BYTES * 8
  );
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await derive(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toBase64(salt)}$${toBase64(bits)}`;
};

export const verifyPassword = async (
  password: string,
  stored: string
): Promise<boolean> => {
  const [scheme, iterationsRaw, saltB64, hashB64] = stored.split("$");
  if (scheme !== "pbkdf2") return false;

  const iterations = Number(iterationsRaw);
  if (!Number.isInteger(iterations) || iterations < 1) return false;

  const expected = fromBase64(hashB64);
  const actual = new Uint8Array(await derive(password, fromBase64(saltB64), iterations));

  if (expected.length !== actual.length) return false;
  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ actual[i];
  return diff === 0;
};
