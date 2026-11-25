"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getSavedWorkerIds,
  isWorkerSaved,
  subscribeSavedWorkers,
  toggleSavedWorker,
} from "@/lib/savedWorkers";

export default function SaveWorkerButton({
  workerId,
  className = "",
}: {
  workerId: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isWorkerSaved(workerId));
    return subscribeSavedWorkers(() => setSaved(isWorkerSaved(workerId)));
  }, [workerId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleSavedWorker(workerId);
    setSaved(next);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved workers" : "Save worker"}
      title={saved ? "Saved" : "Save worker"}
      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
        saved
          ? "bg-[#FFF1F3] border-[#FFCCD5] text-[#FF385C]"
          : "bg-white/95 border-[#EBEBEB] text-[#717171] hover:text-[#FF385C] hover:border-[#FFCCD5]"
      } ${className}`}
    >
      <svg
        className="w-4 h-4"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.1"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

export function SavedNavBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getSavedWorkerIds().length);
    return subscribeSavedWorkers(() => setCount(getSavedWorkerIds().length));
  }, []);

  return (
    <Link
      href="/saved"
      className="inline-flex items-center gap-1.5 bg-white border border-[#EBEBEB] hover:border-[#FF385C]/50 text-[#222222] text-xs font-semibold px-3.5 py-2 rounded-full shadow-xs transition-all active:scale-95"
    >
      <span className="text-[#FF385C]">❤️</span>
      <span>Saved</span>
      {count > 0 && (
        <span className="bg-[#FF385C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
          {count}
        </span>
      )}
    </Link>
  );
}
