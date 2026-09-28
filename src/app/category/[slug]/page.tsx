import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getApprovedWorkersByCategory, getLocalities } from "@/app/actions/worker";
import LocalityFilter from "./LocalityFilter";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ 
  params,
  searchParams
}: { 
  params: { slug: string },
  searchParams: { locality?: string }
}) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  const workers = await getApprovedWorkersByCategory(params.slug, searchParams.locality);
  const localities = await getLocalities();
  
  const title = category 
    ? { en: category.nameEnglish, te: category.nameTelugu } 
    : { en: params.slug.replace("-", " ").toUpperCase(), te: "కార్మికులు" };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 shadow-md flex items-center">
        <Link href="/" className="mr-4 active:scale-95 bg-blue-700 p-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold">{title.en}</h1>
          <p className="text-blue-200 text-sm">{title.te}</p>
        </div>
      </div>

      {/* Locality Filter */}
      <LocalityFilter localities={localities} />

      {/* Worker List */}
      <div className="px-4 space-y-3 mt-2">
        {workers.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No approved workers found in this category yet.
          </div>
        )}
        {workers.map((worker) => (
          <Link href={`/worker/${worker.slug}`} key={worker.id} className="block">
            <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex items-start gap-4 active:bg-gray-50 transition">
              
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                {worker.fullName.charAt(0)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">
                    {worker.fullName}
                    {worker.fullNameTelugu && <span className="text-sm font-normal text-gray-500 block">{worker.fullNameTelugu}</span>}
                  </h3>
                  {worker.mobileVerified && (
                    <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                      ✅ Verified
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{worker.experienceYears} Years (అనుభవం)</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {worker.locality?.nameEnglish} ({worker.locality?.nameTelugu})
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
