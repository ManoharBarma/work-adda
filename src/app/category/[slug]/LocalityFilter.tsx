"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="px-4 py-4 flex gap-2 overflow-x-auto hide-scrollbar">
      <div className="relative w-full max-w-xs">
        <select 
          value={currentLocality}
          onChange={handleChange}
          className="appearance-none w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 pr-8 rounded-full text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">📍 Any Locality (ఏదైనా ప్రాంతం)</option>
          {localities.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.nameEnglish} ({loc.nameTelugu})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
}
