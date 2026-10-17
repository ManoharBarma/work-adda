import { getWorker, getCategories, getLocalities } from "@/app/actions/worker";
import EditWorkerForm from "./EditWorkerForm";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditWorkerPage({ params }: { params: { id: string } }) {
  const worker = await getWorker(params.id);
  
  if (!worker) {
    notFound();
  }

  const categories = await getCategories();
  const localities = await getLocalities();

  const safeWorker = JSON.parse(JSON.stringify(worker));
  const safeCategories = JSON.parse(JSON.stringify(categories));
  const safeLocalities = JSON.parse(JSON.stringify(localities));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">Edit Worker Profile</h1>
          <p className="text-xs sm:text-sm text-[#717171] mt-0.5">Updating details for {worker.fullName}</p>
        </div>
        <Link 
          href="/admin" 
          className="text-xs font-semibold text-[#484848] bg-white border border-[#EBEBEB] px-3.5 py-2 rounded-full hover:bg-[#F7F7F7] transition"
        >
          ← Back to List
        </Link>
      </div>
      
      <EditWorkerForm 
        worker={safeWorker} 
        categories={safeCategories} 
        localities={safeLocalities} 
      />
    </div>
  );
}
