import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "workadda_worker_session";
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

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

export function setWorkerSession(workerId: string) {
  const payload = JSON.stringify({
    workerId,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = signPayload(payloadB64);
  const token = `${payloadB64}.${sig}`;

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export function getWorkerSessionId(): string | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  const expectedSig = signPayload(payloadB64);

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (
      typeof parsed?.workerId === "string" &&
      typeof parsed?.exp === "number" &&
      parsed.exp > Date.now()
    ) {
      return parsed.workerId;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearWorkerSession() {
  cookies().delete(COOKIE_NAME);
}
