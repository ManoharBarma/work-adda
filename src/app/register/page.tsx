import { prisma } from "@/lib/prisma";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

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
