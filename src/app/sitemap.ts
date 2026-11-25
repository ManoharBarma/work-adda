import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [categories, workers] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.worker.findMany({
        where: { status: "APPROVED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const workerRoutes: MetadataRoute.Sitemap = workers.map((worker) => ({
      url: `${SITE_URL}/worker/${worker.slug}`,
      lastModified: worker.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...workerRoutes];
  } catch {
    return staticRoutes;
  }
}
