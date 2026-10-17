"use client";

import { useRouter, useSearchParams } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LocalityFilter({ localities }: { localities: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocality = searchParams.get("locality") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localityId = e.target.value;
    if (localityId) {
      router.push(`?locality=${localityId}`);
    } else {
      router.push(`?`);
    }
  };

  return (
    <div className="px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar">
      <div className="relative w-full">
        <select 
          value={currentLocality}
          onChange={handleChange}
          className="appearance-none w-full bg-white border border-[#EBEBEB] text-[#222222] font-medium px-4 py-2.5 pr-9 rounded-full text-xs shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] transition-all cursor-pointer"
        >
          <option value="">📍 Any Locality in Sircilla (ఏదైనా ప్రాంతం)</option>
          {localities.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.nameEnglish} ({loc.nameTelugu})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#717171]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
