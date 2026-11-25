import type { Metadata } from "next";
import Link from "next/link";
import { getLocalities } from "@/app/actions/worker";
import { getLoggedInWorker } from "@/app/actions/workerPortal";
import ManageClient from "./ManageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Worker Profile | Work Adda Sircilla",
  description:
    "Log in with your registered mobile number to update your Work Adda profile, photos, rates, or availability.",
};

export default async function ManagePage() {
  const [worker, localities] = await Promise.all([
    getLoggedInWorker(),
    getLocalities(),
  ]);

  const safeWorker = worker ? JSON.parse(JSON.stringify(worker)) : null;
  const safeLocalities = JSON.parse(JSON.stringify(localities));

  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-16">
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
            <h1 className="text-lg font-bold text-[#222222] tracking-tight">Worker Portal</h1>
            <p className="text-xs text-[#717171]">కార్మికుల ప్రొఫైల్ నిర్వహణ</p>
          </div>
        </div>
      </div>

      <ManageClient initialWorker={safeWorker} localities={safeLocalities} />
    </main>
  );
}
