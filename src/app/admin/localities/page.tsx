import { getLocalities } from "@/app/actions/worker";
import LocalityClient from "./LocalityClient";

export const dynamic = "force-dynamic";

export default async function AdminLocalitiesPage() {
  const localities = await getLocalities();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-6">📍 Manage Localities</h2>
      <LocalityClient initialLocalities={localities} />
    </div>
  );
}
