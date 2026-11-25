"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { isAllSircillaLocality } from "@/lib/locality";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LocalityFilter({ localities }: { localities: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocality = searchParams.get("locality") || "";

  const select = (localityId: string) => {
    if (localityId) {
      router.push(`?locality=${localityId}`);
    } else {
      router.push(`?`);
    }
  };

  if (localities.length === 0) return null;

  return (
    <nav
      aria-label="Filter by locality"
      className="px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar"
    >
      {/* All pill */}
      <button
        type="button"
        onClick={() => select("")}
        className={`shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
          currentLocality === ""
            ? "bg-[#222222] text-white border-[#222222] shadow-sm"
            : "bg-white text-[#484848] border-[#EBEBEB] hover:border-[#222222]"
        }`}
      >
        📍 All Areas
      </button>

      {localities.map((loc) => (
        <button
          key={loc.id}
          type="button"
          onClick={() => select(loc.id)}
          className={`shrink-0 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 whitespace-nowrap ${
            currentLocality === loc.id
              ? "bg-[#FF385C] text-white border-[#FF385C] shadow-sm"
              : "bg-white text-[#484848] border-[#EBEBEB] hover:border-[#FF385C]/50 hover:text-[#FF385C]"
          }`}
        >
          {isAllSircillaLocality(loc) ? `🌐 ${loc.nameEnglish}` : loc.nameEnglish}
        </button>
      ))}
    </nav>
  );
}
