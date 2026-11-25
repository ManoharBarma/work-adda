import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  const query = searchParams.q?.trim();
  const title = query
    ? `Search "${query}" in Sircilla | Work Adda`
    : "Search Local Workers in Sircilla | Work Adda";
  return {
    title,
    description: query
      ? `Browse local workers matching "${query}" in Sircilla on Work Adda.`
      : "Search electricians, plumbers, painters, and skilled workers in Sircilla.",
  };
}

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
    <main className="min-h-screen bg-[#F7F7F7] pb-16">
      {/* Airbnb-style Sticky Header */}
      <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-30 px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#F7F7F7] active:scale-95 transition-all text-[#222222]"
              aria-label="Back to home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-[#222222] tracking-tight">Search Results</h1>
              <p className="text-xs text-[#717171]">&quot;{query}&quot; కోసం శోధన</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#717171] bg-[#F7F7F7] px-3 py-1 rounded-full border border-[#EBEBEB]">
            {workers.length} found
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        {/* Inline Search Bar to refine query */}
        <form action="/search" method="GET" className="mb-4">
          <div className="bg-white rounded-full p-1.5 pl-4 shadow-xs border border-[#EBEBEB] flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#FF385C]/20 focus-within:border-[#FF385C] transition-all">
            <svg className="w-4 h-4 text-[#717171] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by worker name, trade or locality..."
              className="w-full bg-transparent text-[#222222] placeholder-[#717171] text-xs focus:outline-none"
            />
            <button 
              type="submit" 
              className="bg-[#222222] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Worker List */}
        <div className="space-y-3">
          {workers.length === 0 && (
            <div className="bg-white border border-[#EBEBEB] rounded-2xl p-8 text-center shadow-sm mt-4">
              <div className="w-14 h-14 bg-[#FFF1F3] text-[#FF385C] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                🔍
              </div>
              <h3 className="font-bold text-[#222222] text-base mb-1">
                No workers matched &quot;{query}&quot;
              </h3>
              <p className="text-xs text-[#717171] mb-5 max-w-xs mx-auto">
                Try searching for a simpler term like &quot;electrician&quot;, &quot;painter&quot;, or browse all categories.
              </p>
              <Link 
                href="/" 
                className="inline-block bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow transition-all"
              >
                Browse All Categories
              </Link>
            </div>
          )}

          {workers.map((worker) => (
            <Link 
              href={`/worker/${worker.slug}`} 
              key={worker.id} 
              className="block group"
            >
              <div className="bg-white border border-[#EBEBEB] hover:border-[#FF385C]/40 p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-[0.99] transition-all flex items-start gap-3.5">
                
                {/* Worker Avatar */}
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFF1F3] to-[#FFE4E8] text-[#FF385C] rounded-full flex items-center justify-center font-bold text-xl shrink-0 border border-[#FFCCD5] shadow-xs">
                  {worker.fullName.charAt(0).toUpperCase()}
                </div>
                
                {/* Worker Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="text-base font-bold text-[#222222] group-hover:text-[#FF385C] transition-colors truncate">
                      {worker.fullName}
                      {worker.fullNameTelugu && (
                        <span className="text-xs font-normal text-[#717171] block truncate mt-0.5">
                          {worker.fullNameTelugu}
                        </span>
                      )}
                    </h3>

                    {worker.mobileVerified && (
                      <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#008A05] text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#A7F3D0] shrink-0">
                        <svg className="w-3 h-3 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-[#FF385C] mt-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {worker.categories?.map((c: any) => c.nameEnglish).join(", ")}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-[#484848]">
                    <span className="font-semibold text-[#222222] bg-[#F7F7F7] px-2 py-0.5 rounded-md border border-[#EBEBEB]">
                      {worker.experienceYears} Years Exp
                    </span>
                    <span className="text-[11px] text-[#717171]">
                      ({worker.experienceYears} సం. అనుభవం)
                    </span>
                  </div>

                  <p className="text-xs text-[#717171] flex items-center gap-1 mt-2">
                    <svg className="w-3.5 h-3.5 text-[#FF385C] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">
                      {worker.locality?.nameEnglish} ({worker.locality?.nameTelugu})
                    </span>
                  </p>
                </div>

                {/* Arrow */}
                <div className="self-center text-[#B0B0B0] group-hover:text-[#FF385C] transition-colors shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
