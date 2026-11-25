import crypto from "crypto";
import { cookies } from "next/headers";

export const WORKER_SESSION_COOKIE_NAME = "workadda_worker_session";
export const WORKER_SESSION_TTL_SECONDS = 2 * 60 * 60; // 2 hours
const SESSION_TTL_MS = WORKER_SESSION_TTL_SECONDS * 1000;
const MAGIC_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSigningKey(): Buffer {
  const rawSecret =
    process.env.WORKER_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.DATABASE_URL ||
    "workadda-dev-session-secret";
  return crypto.createHash("sha256").update(rawSecret).digest();
}

function signPayload(payloadB64: string): string {
  return crypto
    .createHmac("sha256", getSigningKey())
    .update(payloadB64)
    .digest("base64url");
}

function verifyTokenPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const expectedSig = signPayload(payloadB64);

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    return JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function createWorkerSessionToken(workerId: string): string {
  const payload = JSON.stringify({
    workerId,
    purpose: "session",
    exp: Date.now() + SESSION_TTL_MS,
  });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64)}`;
}

export function setWorkerSession(workerId: string) {
  cookies().set(WORKER_SESSION_COOKIE_NAME, createWorkerSessionToken(workerId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WORKER_SESSION_TTL_SECONDS,
  });
}

export function getWorkerSessionId(): string | null {
  const token = cookies().get(WORKER_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const parsed = verifyTokenPayload(token);
  if (
    parsed &&
    typeof parsed.workerId === "string" &&
    typeof parsed.exp === "number" &&
    parsed.exp > Date.now()
  ) {
    return parsed.workerId;
  }

  return null;
}

export function clearWorkerSession() {
  cookies().delete(WORKER_SESSION_COOKIE_NAME);
}

export function createWorkerMagicToken(
  workerId: string,
  ttlMs = MAGIC_LINK_TTL_MS
): string {
  const payload = JSON.stringify({
    workerId,
    purpose: "magic_edit",
    exp: Date.now() + ttlMs,
  });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  return `${payloadB64}.${signPayload(payloadB64)}`;
}

export function verifyWorkerMagicToken(token: string): string | null {
  const parsed = verifyTokenPayload(token);
  if (
    parsed &&
    parsed.purpose === "magic_edit" &&
    typeof parsed.workerId === "string" &&
    typeof parsed.exp === "number" &&
    parsed.exp > Date.now()
  ) {
    return parsed.workerId;
  }
  return null;
}
