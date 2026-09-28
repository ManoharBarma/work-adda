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

  // Next.js client component serialization
  const safeWorker = JSON.parse(JSON.stringify(worker));
  const safeCategories = JSON.parse(JSON.stringify(categories));
  const safeLocalities = JSON.parse(JSON.stringify(localities));

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Edit Worker Profile</h1>
            <p className="text-slate-500">Updating details for {worker.fullName}</p>
          </div>
          <Link href="/admin" className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-slate-50 transition">
            Back to Dashboard
          </Link>
        </div>
        
        <EditWorkerForm 
          worker={safeWorker} 
          categories={safeCategories} 
          localities={safeLocalities} 
        />
      </div>
    </div>
  );
}
