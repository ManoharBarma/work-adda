"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sanitizeImageUrl, sanitizeWorkPhotos } from "@/lib/imageValidation";
import { composeWorkerBio } from "@/lib/workerBio";
import {
  ALL_SIRCILLA_NAME_EN,
  isAllSircillaLocality,
  sortLocalitiesWithAllSircillaFirst,
} from "@/lib/locality";
import { resolveLocalityId } from "@/lib/resolveLocality";

// Admin: Get all workers for the master table
export async function getAllWorkersForAdmin() {
  return await prisma.worker.findMany({
    include: {
      categories: true,
      locality: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// Admin: Delete a worker entirely
export async function deleteWorker(id: string) {
  await prisma.worker.delete({
    where: { id }
  });
  revalidatePath("/", "layout");
}

// Admin: Approve a worker
export async function approveWorker(id: string) {
  await prisma.worker.update({
    where: { id },
    data: { 
      status: "APPROVED",
      mobileVerified: true // Auto-verify upon admin approval
    },
  });
  revalidatePath("/", "layout");
}

// Admin: Reject a worker
export async function rejectWorker(id: string) {
  await prisma.worker.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  revalidatePath("/", "layout");
}

// Admin: Update worker details
export async function updateWorkerAdmin(id: string, formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const experienceYears = parseInt(formData.get("experience") as string) || 0;
  const rawLocalityId = formData.get("locality") as string;
  const categorySlugs = formData.getAll("category") as string[];
  const whatsappPhone = (formData.get("whatsappPhone") as string) || phone;
  const rawBio = (formData.get("bio") as string) || null;
  const visitingCharge = (formData.get("visitingCharge") as string) || null;
  const bio = composeWorkerBio(rawBio, visitingCharge);
  const profilePhotoUrl = sanitizeImageUrl(formData.get("profilePhotoUrl") as string | null);
  const workPhotos = sanitizeWorkPhotos(formData.getAll("workPhotos"));

  if (!/^[789]\d{9}$/.test(phone)) {
    return { success: false, error: "Invalid phone number. It must be 10 digits and start with 7, 8, or 9." };
  }

  const selectedCategories = await prisma.category.findMany({
    where: { slug: { in: categorySlugs } },
  });

  try {
    const localityId = await resolveLocalityId(rawLocalityId);
    await prisma.worker.update({
      where: { id },
      data: {
        fullName,
        phone,
        whatsappPhone,
        bio,
        profilePhotoUrl,
        experienceYears,
        localityId,
        categories: {
          set: selectedCategories.map(c => ({ id: c.id }))
        },
        workPhotos: {
          deleteMany: {},
          create: workPhotos.map((photoUrl) => ({ photoUrl })),
        },
      }
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
      return { success: false, error: "This phone number is already registered to another user!" };
    }
    return { success: false, error: "Failed to update worker." };
  }
}

// Public/Admin: Get all active categories
export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { displayOrder: "asc" }
  });
}

// Admin: Create a new category
export async function createCategory(formData: FormData) {
  const nameEnglish = formData.get("nameEnglish") as string;
  const nameTelugu = formData.get("nameTelugu") as string;
  const icon = formData.get("icon") as string;
  
  if (!nameEnglish || !nameTelugu || !icon) throw new Error("Missing required fields");
  
  const slug = nameEnglish.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  await prisma.category.create({
    data: { nameEnglish, nameTelugu, icon, slug }
  });
  
  revalidatePath("/");
  return { success: true };
}

// Admin: Create a new locality
export async function createLocality(formData: FormData) {
  const nameEnglish = formData.get("nameEnglish") as string;
  const nameTelugu = formData.get("nameTelugu") as string;
  const town = (formData.get("town") as string) || "Sircilla";
  const district = (formData.get("district") as string) || "Rajanna Sircilla";
  
  if (!nameEnglish || !nameTelugu) throw new Error("Missing required fields");
  
  await prisma.locality.create({
    data: { nameEnglish, nameTelugu, town, district }
  });
  
  revalidatePath("/");
  return { success: true };
}

// Admin: Register and auto-approve a new worker
export async function adminRegisterWorker(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const fullNameTelugu = formData.get("fullNameTelugu") as string;
  const phone = formData.get("phone") as string;
  const categorySlugs = formData.getAll("category") as string[]; 
  let localityId = formData.get("locality") as string;
  const customLocality = formData.get("customLocality") as string;
  const customLocalityTelugu = formData.get("customLocalityTelugu") as string;
  const experienceYears = parseInt(formData.get("experience") as string) || 0;
  const whatsappPhone = (formData.get("whatsappPhone") as string) || phone;
  const rawBio = (formData.get("bio") as string) || null;
  const visitingCharge = (formData.get("visitingCharge") as string) || null;
  const bio = composeWorkerBio(rawBio, visitingCharge);
  const profilePhotoUrl = sanitizeImageUrl(formData.get("profilePhotoUrl") as string | null);
  const workPhotos = sanitizeWorkPhotos(formData.getAll("workPhotos"));

  if (!/^[789]\d{9}$/.test(phone)) {
    return { success: false, error: "Invalid phone number. It must be 10 digits and start with 7, 8, or 9." };
  }
  
  if (!categorySlugs || categorySlugs.length === 0) {
    return { success: false, error: "Please select at least one category." };
  }

  const selectedCategories = await prisma.category.findMany({
    where: { slug: { in: categorySlugs } },
  });

  try {
    localityId = await resolveLocalityId(localityId, customLocality, customLocalityTelugu);

    const worker = await prisma.worker.create({
      data: {
        fullName,
        fullNameTelugu,
        phone,
        whatsappPhone,
        bio,
        profilePhotoUrl,
        slug: `${fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
        categories: {
          connect: selectedCategories.map(c => ({ id: c.id }))
        },
        workPhotos: workPhotos.length
          ? { create: workPhotos.map((photoUrl) => ({ photoUrl })) }
          : undefined,
        localityId,
        experienceYears,
        status: "APPROVED",
        mobileVerified: true,
      },
    });
    revalidatePath("/");
    return { success: true, worker };
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
      return { success: false, error: "This phone number is already registered!" };
    }
    return { success: false, error: "An unexpected error occurred." };
  }
}

// Public: Register a new worker
export async function registerWorker(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const fullNameTelugu = formData.get("fullNameTelugu") as string;
  const phone = formData.get("phone") as string;
  const categorySlugs = formData.getAll("category") as string[]; // Can be multiple now
  let localityId = formData.get("locality") as string;
  const customLocality = formData.get("customLocality") as string;
  const customLocalityTelugu = formData.get("customLocalityTelugu") as string;
  const experienceYears = parseInt(formData.get("experience") as string) || 0;
  const whatsappPhone = (formData.get("whatsappPhone") as string) || phone;
  const rawBio = (formData.get("bio") as string) || null;
  const visitingCharge = (formData.get("visitingCharge") as string) || null;
  const bio = composeWorkerBio(rawBio, visitingCharge);
  const profilePhotoUrl = sanitizeImageUrl(formData.get("profilePhotoUrl") as string | null);
  const workPhotos = sanitizeWorkPhotos(formData.getAll("workPhotos"));

  if (!/^[789]\d{9}$/.test(phone)) {
    throw new Error("Invalid phone number. It must be 10 digits and start with 7, 8, or 9.");
  }

  if (!categorySlugs || categorySlugs.length === 0) {
    throw new Error("Please select at least one category.");
  }

  // Find categories by slugs
  const selectedCategories = await prisma.category.findMany({
    where: { slug: { in: categorySlugs } },
  });

  if (selectedCategories.length === 0) throw new Error("Categories not found");

  try {
    localityId = await resolveLocalityId(localityId, customLocality, customLocalityTelugu);

    // Create worker
    const worker = await prisma.worker.create({
      data: {
        fullName,
        fullNameTelugu,
        phone,
        whatsappPhone,
        bio,
        profilePhotoUrl,
        slug: `${fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
        categories: {
          connect: selectedCategories.map(c => ({ id: c.id }))
        },
        workPhotos: workPhotos.length
          ? { create: workPhotos.map((photoUrl) => ({ photoUrl })) }
          : undefined,
        localityId,
        experienceYears,
        status: "PENDING",
      },
    });

    revalidatePath("/admin");
    return { success: true, worker };
  } catch (error: any) {
    // Prisma Unique Constraint Error (P2002) for Phone Number
    if (error.code === 'P2002' && error.meta?.target?.includes('phone')) {
      return { success: false, error: "This phone number is already registered!" };
    }
    console.error(error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

// Public: Get approved workers by category
export async function getApprovedWorkersByCategory(categorySlug: string, localityId?: string) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    categories: { some: { id: category.id } },
    status: "APPROVED",
  };

  if (localityId) {
    whereClause.OR = [
      { localityId },
      { locality: { nameEnglish: { equals: ALL_SIRCILLA_NAME_EN, mode: "insensitive" } } },
    ];
  }

  const workers = await prisma.worker.findMany({
    where: whereClause,
    include: {
      locality: true,
      categories: true,
    },
    orderBy: { profileViews: "desc" },
  });

  if (!localityId) return workers;

  // Show exact locality matches first, followed by workers serving All Sircilla
  return workers.sort((a, b) => {
    const aExact = a.localityId === localityId ? 0 : isAllSircillaLocality(a.locality) ? 1 : 2;
    const bExact = b.localityId === localityId ? 0 : isAllSircillaLocality(b.locality) ? 1 : 2;
    return aExact - bExact;
  });
}

// Public: Get approved workers by IDs (for Saved Workers page)
export async function getApprovedWorkersByIds(ids: string[]) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const cleanIds = ids.slice(0, 50);

  return await prisma.worker.findMany({
    where: {
      id: { in: cleanIds },
      status: "APPROVED",
    },
    include: {
      locality: true,
      categories: true,
    },
  });
}

// Public: Get single worker by Slug
export async function getWorkerBySlug(slug: string) {
  return await prisma.worker.findUnique({
    where: { slug },
    include: {
      locality: true,
      categories: true,
      skills: {
        include: { skill: true }
      },
      workPhotos: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
}

// Admin: Get single worker by ID
export async function getWorker(id: string) {
  return await prisma.worker.findUnique({
    where: { id },
    include: {
      locality: true,
      categories: true,
      skills: {
        include: { skill: true }
      },
      workPhotos: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
}

// Public: Get all localities for the dropdown
export async function getLocalities() {
  const localities = await prisma.locality.findMany({
    orderBy: { nameEnglish: "asc" },
  });
  return sortLocalitiesWithAllSircillaFirst(localities);
}

// Admin: Get Analytics Metrics
export async function getAnalyticsMetrics() {
  const activeWorkers = await prisma.worker.count({ where: { status: "APPROVED" } });
  
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    views24h, views7d, views30d,
    calls24h, calls7d, calls30d,
    wa24h, wa7d, wa30d,
    totalCalls, totalWa
  ] = await Promise.all([
    prisma.workerInteraction.count({ where: { type: "VIEW", createdAt: { gte: dayAgo } } }),
    prisma.workerInteraction.count({ where: { type: "VIEW", createdAt: { gte: weekAgo } } }),
    prisma.workerInteraction.count({ where: { type: "VIEW", createdAt: { gte: monthAgo } } }),
    
    prisma.workerInteraction.count({ where: { type: "CALL", createdAt: { gte: dayAgo } } }),
    prisma.workerInteraction.count({ where: { type: "CALL", createdAt: { gte: weekAgo } } }),
    prisma.workerInteraction.count({ where: { type: "CALL", createdAt: { gte: monthAgo } } }),

    prisma.workerInteraction.count({ where: { type: "WHATSAPP", createdAt: { gte: dayAgo } } }),
    prisma.workerInteraction.count({ where: { type: "WHATSAPP", createdAt: { gte: weekAgo } } }),
    prisma.workerInteraction.count({ where: { type: "WHATSAPP", createdAt: { gte: monthAgo } } }),

    prisma.workerInteraction.count({ where: { type: "CALL" } }),
    prisma.workerInteraction.count({ where: { type: "WHATSAPP" } })
  ]);

  return {
    active: activeWorkers,
    clicks: totalWa,
    calls: totalCalls,
    timeStats: {
      views: { d1: views24h, d7: views7d, d30: views30d },
      calls: { d1: calls24h, d7: calls7d, d30: calls30d },
      whatsapp: { d1: wa24h, d7: wa7d, d30: wa30d },
    }
  };
}
