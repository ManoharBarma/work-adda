import { getCategories } from "@/app/actions/worker";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">📁 Categories Directory</h2>
        <p className="text-xs sm:text-sm text-[#717171] mt-0.5">Manage trade categories, Telugu translations, and emoji icons</p>
      </div>
      <CategoryClient initialCategories={categories} />
    </div>
  );
}
