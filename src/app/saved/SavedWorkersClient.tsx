"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getApprovedWorkersByIds } from "@/app/actions/worker";
import { getSavedWorkerIds, subscribeSavedWorkers } from "@/lib/savedWorkers";
import WorkerCard, { WorkerCardData } from "@/components/WorkerCard";

export default function SavedWorkersClient() {
  const [workers, setWorkers] = useState<WorkerCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSaved = async () => {
      const ids = getSavedWorkerIds();
      if (ids.length === 0) {
        if (active) {
          setWorkers([]);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getApprovedWorkersByIds(ids);
        if (active) {
          // Preserve user's saved order
          const byId = new Map(data.map((w) => [w.id, w]));
          const ordered = ids
            .map((id) => byId.get(id))
            .filter((w): w is NonNullable<typeof w> => Boolean(w));
          setWorkers(ordered);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSaved();
    const unsub = subscribeSavedWorkers(loadSaved);
    return () => {
      active = false;
      unsub();
    };
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#FF385C] border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-[#717171]">Loading saved workers...</p>
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-8 text-center shadow-sm mt-4">
        <div className="w-14 h-14 bg-[#FFF1F3] text-[#FF385C] rounded-full flex items-center justify-center text-2xl mx-auto mb-3 border border-[#FFCCD5]">
          ❤️
        </div>
        <h2 className="font-bold text-[#222222] text-base mb-1">No saved workers yet</h2>
        <p className="text-xs text-[#717171] mb-1">మీరు ఇంకా ఏ కార్మికుడినీ సేవ్ చేయలేదు</p>
        <p className="text-xs text-[#484848] mb-5 max-w-xs mx-auto leading-relaxed">
          Tap the heart icon on any worker card to save your trusted electricians, plumbers, and mechanics for quick access.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow transition-all"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workers.map((worker) => (
        <WorkerCard key={worker.id} worker={worker} showCategories />
      ))}
    </div>
  );
}
