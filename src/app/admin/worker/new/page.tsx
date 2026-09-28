import { getCategories, getLocalities } from "@/app/actions/worker";
import AdminAddWorkerForm from "./AdminAddWorkerForm";

export const dynamic = "force-dynamic";

export default async function AdminAddWorkerPage() {
  const categories = await getCategories();
  const localities = await getLocalities();

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">➕ Add New Worker (Auto-Approve)</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <AdminAddWorkerForm categories={categories} localities={localities} />
      </div>
    </div>
  );
}
