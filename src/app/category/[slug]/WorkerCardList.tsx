"use client";

import WorkerCard from "@/components/WorkerCard";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function WorkerCardList({
  workers,
  categoryTitle,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workers: any[];
  categoryTitle: string;
}) {
  if (workers.length === 0) {
    return (
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-8 text-center shadow-sm mt-4">
        <div className="w-14 h-14 bg-[#F7F7F7] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
          🔍
        </div>
        <h3 className="font-bold text-[#222222] text-base mb-1">No workers found</h3>
        <p className="text-xs text-[#717171] mb-5 max-w-xs mx-auto">
          No registered workers found in this locality yet. Try choosing &quot;All Areas&quot; or check back soon.
        </p>
        <Link
          href="/register"
          className="inline-block bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow transition-all"
        >
          Register as {categoryTitle}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workers.map((worker, index) => (
        <div
          key={worker.id}
          className="animate-slide-up"
          style={{ animationDelay: `${Math.min(index * 55, 400)}ms` }}
        >
          <WorkerCard worker={worker} />
        </div>
      ))}
    </div>
  );
}
