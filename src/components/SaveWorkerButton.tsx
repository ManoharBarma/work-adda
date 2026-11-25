"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getSavedWorkerIds,
  isWorkerSaved,
  subscribeSavedWorkers,
  toggleSavedWorker,
} from "@/lib/savedWorkers";

interface ToastState {
  message: string;
  key: number;
  exiting: boolean;
}

export default function SaveWorkerButton({
  workerId,
  className = "",
}: {
  workerId: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [popping, setPopping] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastExitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastKey = useRef(0);

  useEffect(() => {
    setSaved(isWorkerSaved(workerId));
    return subscribeSavedWorkers(() => setSaved(isWorkerSaved(workerId)));
  }, [workerId]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (toastExitTimerRef.current) clearTimeout(toastExitTimerRef.current);
    };
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (toastExitTimerRef.current) clearTimeout(toastExitTimerRef.current);
    toastKey.current += 1;
    setToast({ message: msg, key: toastKey.current, exiting: false });

    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, exiting: true } : null));
      toastExitTimerRef.current = setTimeout(() => setToast(null), 200);
    }, 2000);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleSavedWorker(workerId);
    setSaved(next);

    if (next) {
      setPopping(true);
      setTimeout(() => setPopping(false), 400);
      showToast("❤️ Saved to your list");
    } else {
      showToast("Removed from saved");
    }
  };

  return (
    <>
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
          className={`w-4 h-4 ${popping ? "animate-heart-pop" : ""}`}
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

      {/* Floating Toast (portaled to body so ancestor transforms never clip/offset fixed positioning) */}
      {toast &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            aria-live="polite"
            className="fixed bottom-24 inset-x-0 z-[100] flex justify-center pointer-events-none px-4"
          >
            <div
              key={toast.key}
              className={`bg-[#222222] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg ${
                toast.exiting ? "animate-toast-out" : "animate-toast-in"
              }`}
            >
              {toast.message}
            </div>
          </div>,
          document.body
        )}
    </>
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
