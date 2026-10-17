import { getCategories, getLocalities } from "@/app/actions/worker";
import AdminAddWorkerForm from "./AdminAddWorkerForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminAddWorkerPage() {
  const categories = await getCategories();
  const localities = await getLocalities();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">➕ Add New Worker</h2>
          <p className="text-xs sm:text-sm text-[#717171] mt-0.5">Admin fast-track registration with automatic verification</p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-semibold text-[#484848] bg-white border border-[#EBEBEB] px-3.5 py-2 rounded-full hover:bg-[#F7F7F7] transition"
        >
          ← Back to List
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <AdminAddWorkerForm categories={categories} localities={localities} />
      </div>
    </div>
  );
}
