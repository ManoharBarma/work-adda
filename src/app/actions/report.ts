"use server";

import { prisma } from "@/lib/prisma";
import { ReportReason } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";

const VALID_REASONS = new Set<string>(Object.values(ReportReason));

export async function submitWorkerReport(input: {
  workerId: string;
  reason: string;
  details?: string;
}) {
  if (!input.workerId || !VALID_REASONS.has(input.reason)) {
    return { success: false, error: "Please select a valid reason." };
  }

  const worker = await prisma.worker.findUnique({
    where: { id: input.workerId },
    select: { id: true },
  });

  if (!worker) {
    return { success: false, error: "Worker not found." };
  }

  const cleanDetails = input.details?.trim().slice(0, 500) || null;

  await prisma.report.create({
    data: {
      workerId: input.workerId,
      reason: input.reason as ReportReason,
      details: cleanDetails,
    },
  });

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function getReportsForAdmin() {
  requireAdmin();
  return await prisma.report.findMany({
    include: {
      worker: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          slug: true,
          status: true,
        },
      },
    },
    orderBy: [{ resolved: "asc" }, { createdAt: "desc" }],
  });
}

export async function setReportResolved(reportId: string, resolved: boolean) {
  requireAdmin();
  await prisma.report.update({
    where: { id: reportId },
    data: { resolved },
  });
  revalidatePath("/admin/reports");
  return { success: true };
}
