"use client";

import Link from "next/link";

interface CategoryChip {
  slug: string;
  nameEnglish: string;
  icon: string;
  _count: { workers: number };
}

export default function QuickSearchChips({ categories }: { categories: CategoryChip[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="max-w-lg mx-auto px-4 mt-4">
      <p className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider mb-2 px-1">
        Quick Find
      </p>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="shrink-0 inline-flex items-center gap-1.5 bg-white border border-[#EBEBEB] hover:border-[#FF385C]/50 hover:bg-[#FFF1F3]/50 active:scale-95 transition-all px-3.5 py-2 rounded-full shadow-xs group"
          >
            <span className="text-base group-hover:scale-110 transition-transform duration-200">
              {cat.icon}
            </span>
            <span className="text-xs font-semibold text-[#222222] group-hover:text-[#FF385C] transition-colors whitespace-nowrap">
              {cat.nameEnglish}
            </span>
            {cat._count.workers > 0 && (
              <span className="text-[10px] font-bold text-[#717171] bg-[#F7F7F7] group-hover:bg-[#FFCCD5]/60 px-1.5 py-0.5 rounded-full transition-colors">
                {cat._count.workers}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
