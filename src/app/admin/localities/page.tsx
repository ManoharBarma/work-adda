import { getLocalities } from "@/app/actions/worker";
import LocalityClient from "./LocalityClient";

export const dynamic = "force-dynamic";

export default async function AdminLocalitiesPage() {
  const localities = await getLocalities();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">📍 Manage Localities</h2>
        <p className="text-xs sm:text-sm text-[#717171] mt-0.5">Define neighborhood boundaries, colonies, and Telugu names for Sircilla</p>
      </div>
      <LocalityClient initialLocalities={localities} />
    </div>
  );
}
