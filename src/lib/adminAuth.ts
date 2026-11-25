import crypto from "crypto";
import { headers } from "next/headers";

function safeEqual(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function isAdminRequest(): boolean {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPwd = process.env.ADMIN_PASSWORD;
  if (!adminUser || !adminPwd) return false;

  const authHeader = headers().get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;

  try {
    const encoded = authHeader.slice(6).trim();
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) return false;

    const user = decoded.slice(0, colonIdx);
    const pwd = decoded.slice(colonIdx + 1);
    return safeEqual(user, adminUser) && safeEqual(pwd, adminPwd);
  } catch {
    return false;
  }
}

export function requireAdmin(): void {
  if (!isAdminRequest()) {
    throw new Error("Unauthorized: Admin authentication required.");
  }
}
