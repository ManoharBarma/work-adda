"use server";

import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  clearWorkerSession,
  createWorkerMagicToken,
  getWorkerSessionId,
  setWorkerSession,
} from "@/lib/workerSession";
import { requireAdmin } from "@/lib/adminAuth";
import { resolveLocalityId } from "@/lib/resolveLocality";
import { sanitizeImageUrl, sanitizeWorkPhotos } from "@/lib/imageValidation";
import { composeWorkerBio } from "@/lib/workerBio";

const PHONE_REGEX = /^[789]\d{9}$/;

export async function requestWorkerOtp(phoneInput: string) {
  const phone = phoneInput.replace(/\D/g, "").slice(-10);
  if (!PHONE_REGEX.test(phone)) {
    return {
      success: false,
      error: "Enter a valid 10-digit mobile number starting with 7, 8, or 9.",
    };
  }

  const worker = await prisma.worker.findUnique({
    where: { phone },
    select: { id: true, fullName: true },
  });

  if (!worker) {
    return {
      success: false,
      error: "No worker profile found for this number. Please register first.",
    };
  }

  // Rate limit: max 3 OTP requests in 10 minutes per phone
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentCount = await prisma.otpVerification.count({
    where: { phone, createdAt: { gte: tenMinutesAgo } },
  });

  if (recentCount >= 3) {
    return {
      success: false,
      error: "Too many OTP requests. Please wait a few minutes before retrying.",
    };
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const record = await prisma.otpVerification.create({
    data: { phone, otp, expiresAt },
  });

  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  if (fast2smsKey) {
    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: fast2smsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: phone,
        }),
      });
      if (!response.ok) {
        await prisma.otpVerification.delete({ where: { id: record.id } }).catch(() => {});
        return {
          success: false,
          error: "Could not send SMS right now. Please try again shortly.",
        };
      }
      return { success: true };
    } catch {
      await prisma.otpVerification.delete({ where: { id: record.id } }).catch(() => {});
      return {
        success: false,
        error: "SMS service unreachable. Please try again shortly.",
      };
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[WorkAdda DEV OTP] Phone: ${phone} | OTP: ${otp}`);
    return { success: true, devOtp: otp };
  }

  // Never leak OTPs or leave an unsendable OTP active in production
  await prisma.otpVerification.delete({ where: { id: record.id } }).catch(() => {});
  return {
    success: false,
    error:
      "SMS OTP gateway (FAST2SMS_API_KEY) is not configured yet on this server. Contact Work Adda Admin to update your profile.",
  };
}

export async function verifyWorkerOtp(phoneInput: string, otpInput: string) {
  const phone = phoneInput.replace(/\D/g, "").slice(-10);
  const otp = otpInput.trim();

  if (!PHONE_REGEX.test(phone) || !/^\d{6}$/.test(otp)) {
    return { success: false, error: "Please enter a valid 10-digit number and 6-digit OTP." };
  }

  const match = await prisma.otpVerification.findFirst({
    where: {
      phone,
      otp,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!match) {
    return { success: false, error: "Invalid or expired OTP. Please request a new one." };
  }

  const worker = await prisma.worker.findUnique({
    where: { phone },
    select: { id: true },
  });

  if (!worker) {
    return { success: false, error: "Worker account not found." };
  }

  await prisma.otpVerification.deleteMany({ where: { phone } });
  await prisma.worker.update({
    where: { id: worker.id },
    data: { mobileVerified: true },
  });

  setWorkerSession(worker.id);
  revalidatePath("/manage");
  return { success: true };
}

export async function getLoggedInWorker() {
  const workerId = getWorkerSessionId();
  if (!workerId) return null;

  return await prisma.worker.findUnique({
    where: { id: workerId },
    include: {
      locality: true,
      categories: true,
      workPhotos: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function updateOwnWorkerProfile(formData: FormData) {
  const workerId = getWorkerSessionId();
  if (!workerId) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  const fullName = (formData.get("fullName") as string)?.trim();
  const fullNameTelugu = (formData.get("fullNameTelugu") as string)?.trim() || null;
  const rawWhatsapp = (formData.get("whatsappPhone") as string)?.replace(/\D/g, "").slice(-10);
  const rawLocalityId = formData.get("locality") as string;
  const experienceYears = Math.max(0, parseInt(formData.get("experience") as string) || 0);
  const rawBio = (formData.get("bio") as string) || null;
  const visitingCharge = (formData.get("visitingCharge") as string) || null;
  const bio = composeWorkerBio(rawBio, visitingCharge);
  const profilePhotoUrl = sanitizeImageUrl(formData.get("profilePhotoUrl") as string | null);
  const workPhotos = sanitizeWorkPhotos(formData.getAll("workPhotos"));

  if (!fullName) {
    return { success: false, error: "Full name is required." };
  }

  if (rawWhatsapp && !PHONE_REGEX.test(rawWhatsapp)) {
    return {
      success: false,
      error: "WhatsApp number must be 10 digits starting with 7, 8, or 9.",
    };
  }

  const existing = await prisma.worker.findUnique({
    where: { id: workerId },
    select: { phone: true },
  });

  if (!existing) {
    return { success: false, error: "Worker not found." };
  }

  const localityId = await resolveLocalityId(rawLocalityId);

  await prisma.worker.update({
    where: { id: workerId },
    data: {
      fullName,
      fullNameTelugu,
      whatsappPhone: rawWhatsapp || existing.phone,
      localityId,
      experienceYears,
      bio,
      profilePhotoUrl,
      workPhotos: {
        deleteMany: {},
        create: workPhotos.map((photoUrl) => ({ photoUrl })),
      },
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}

export async function toggleOwnVisibility() {
  const workerId = getWorkerSessionId();
  if (!workerId) {
    return { success: false, error: "Session expired. Please log in again." };
  }

  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    select: { status: true },
  });

  if (!worker) {
    return { success: false, error: "Worker not found." };
  }

  if (worker.status !== "APPROVED" && worker.status !== "INACTIVE") {
    return {
      success: false,
      error: "Only approved profiles can be paused or resumed.",
    };
  }

  const nextStatus = worker.status === "APPROVED" ? "INACTIVE" : "APPROVED";

  await prisma.worker.update({
    where: { id: workerId },
    data: { status: nextStatus },
  });

  revalidatePath("/", "layout");
  return { success: true, status: nextStatus };
}

export async function generateWorkerEditLink(workerId: string) {
  requireAdmin();

  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    select: { id: true, fullName: true, phone: true, whatsappPhone: true },
  });

  if (!worker) {
    return { success: false, error: "Worker not found." };
  }

  const token = createWorkerMagicToken(worker.id);
  return {
    success: true,
    path: `/api/worker/magic-login?token=${encodeURIComponent(token)}`,
    workerName: worker.fullName,
    phone: worker.whatsappPhone || worker.phone,
  };
}

export async function logoutWorker() {
  clearWorkerSession();
  revalidatePath("/manage");
  return { success: true };
}
