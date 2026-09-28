import { getCategories } from "@/app/actions/worker";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Manage Categories</h2>
      <CategoryClient initialCategories={categories} />
    </div>
  );
}
