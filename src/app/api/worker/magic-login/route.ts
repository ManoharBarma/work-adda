import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createWorkerSessionToken,
  verifyWorkerMagicToken,
  WORKER_SESSION_COOKIE_NAME,
  WORKER_SESSION_TTL_SECONDS,
} from "@/lib/workerSession";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const workerId = verifyWorkerMagicToken(token);

  if (!workerId) {
    return NextResponse.redirect(new URL("/manage?error=expired", req.url));
  }

  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    select: { id: true },
  });

  if (!worker) {
    return NextResponse.redirect(new URL("/manage?error=expired", req.url));
  }

  const res = NextResponse.redirect(new URL("/manage", req.url));
  res.headers.set("Referrer-Policy", "no-referrer");
  res.cookies.set(WORKER_SESSION_COOKIE_NAME, createWorkerSessionToken(worker.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WORKER_SESSION_TTL_SECONDS,
  });

  return res;
}
