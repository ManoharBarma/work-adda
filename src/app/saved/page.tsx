import type { Metadata } from "next";
import Link from "next/link";
import SavedWorkersClient from "./SavedWorkersClient";

export const metadata: Metadata = {
  title: "Saved Workers | Work Adda Sircilla",
  description: "Quickly call or WhatsApp your saved local workers in Sircilla.",
};

export default function SavedWorkersPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-16">
      {/* Sticky Header */}
      <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-30 px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center gap-3">
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
            <h1 className="text-lg font-bold text-[#222222] tracking-tight">Saved Workers</h1>
            <p className="text-xs text-[#717171]">సేవ్ చేసిన కార్మికులు</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        <SavedWorkersClient />
      </div>
    </main>
  );
}
