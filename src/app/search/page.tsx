import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  // Perform search on workers
  const workers = await prisma.worker.findMany({
    where: {
      status: "APPROVED",
      OR: [
        { fullName: { contains: query, mode: "insensitive" } },
        { categories: { some: { nameEnglish: { contains: query, mode: "insensitive" } } } },
        { categories: { some: { nameTelugu: { contains: query, mode: "insensitive" } } } },
        { locality: { nameEnglish: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      locality: true,
      categories: true,
    },
    orderBy: { profileViews: "desc" },
  });

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
          <h1 className="text-xl font-bold">Search Results</h1>
          <p className="text-blue-200 text-sm">&quot;{query}&quot; కోసం శోధన</p>
        </div>
      </div>

      {/* Worker List */}
      <div className="px-4 space-y-3 mt-6 max-w-lg mx-auto">
        {workers.length === 0 && (
          <div className="text-center text-gray-500 py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">😕</div>
            <p className="font-medium text-gray-900">No workers found</p>
            <p className="text-sm mt-1">Try searching for a different name or profession.</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 font-bold hover:underline">
              Go back home
            </Link>
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
                  <h3 className="text-lg font-bold text-gray-900">{worker.fullName}</h3>
                  {worker.mobileVerified && (
                    <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                      ✅ Verified
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {worker.categories?.map((c: any) => c.nameEnglish).join(", ")}
                </p>
                <p className="text-sm text-gray-500 mb-1">{worker.experienceYears} Years (అనుభవం)</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
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
