import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register as Worker — 100% Free | Work Adda Sircilla",
  description:
    "Create your free worker profile on Work Adda Sircilla. Get direct calls and WhatsApp inquiries from local customers with zero commission.",
};

export default async function RegisterPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  const localities = await prisma.locality.findMany({
    orderBy: { nameEnglish: "asc" },
  });

  return <RegisterForm categories={categories} localities={localities} />;
}
