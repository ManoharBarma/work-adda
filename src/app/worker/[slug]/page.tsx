import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkerBySlug } from "@/app/actions/worker";
import WorkerActions, { WorkerShareButton } from "./WorkerActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getWorkerBySlug(params.slug);

  if (!data || data.status !== "APPROVED") {
    return {
      title: "Worker Not Found | Work Adda",
    };
  }

  const categories = data.categories.map((c) => c.nameEnglish).join(", ");
  const title = `${data.fullName}${categories ? ` — ${categories}` : ""} in ${data.locality.nameEnglish} | Work Adda`;
  const description =
    data.bio ||
    `Contact ${data.fullName} (${categories}) in ${data.locality.nameEnglish}, Sircilla. ${data.experienceYears} years experience. Call or WhatsApp directly with zero commission.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
  };
}

export default async function WorkerProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getWorkerBySlug(params.slug);

  if (!data || data.status !== "APPROVED") {
    notFound();
  }

  const categoryNames = data.categories.map((c) => c.nameEnglish).join(", ");
  const categorySlug = data.categories[0]?.slug || "";
  const skills = data.skills.map((ws) => ws.skill.nameEnglish);
  const about =
    data.bio ||
    "Experienced and reliable worker available for work in Sircilla. Contact directly for availability and rates.";

  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-32">
      {/* Airbnb-style Sticky Header */}
      <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-30 px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href={categorySlug ? `/category/${categorySlug}` : "/"}
            className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#F7F7F7] active:scale-95 transition-all text-[#222222]"
            aria-label="Back to workers list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="text-center">
            <h1 className="text-sm font-bold text-[#222222] tracking-tight truncate max-w-[180px]">
              {data.fullName}
            </h1>
            <p className="text-[11px] text-[#717171]">Worker Profile • ప్రొఫైల్</p>
          </div>

          <div className="flex items-center gap-2">
            <WorkerShareButton
              workerId={data.id}
              workerName={data.fullName}
              category={categoryNames}
              locality={data.locality.nameEnglish}
            />
            <Link
              href="/"
              className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#F7F7F7] active:scale-95 transition-all text-[#717171]"
              aria-label="Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-5 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center relative overflow-hidden">
          {/* Top subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF385C] via-[#FF5A5F] to-[#E00B41]" />

          {/* Large Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#FFF1F3] to-[#FFE4E8] text-[#FF385C] rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-3 border-2 border-[#FFCCD5] shadow-sm">
            {data.fullName.charAt(0).toUpperCase()}
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h2 className="text-2xl font-bold text-[#222222] tracking-tight">{data.fullName}</h2>
            {data.mobileVerified && (
              <span title="Verified Worker">
                <svg className="w-5 h-5 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>

          {data.fullNameTelugu && (
            <h3 className="text-base font-medium text-[#717171] mb-2">{data.fullNameTelugu}</h3>
          )}

          <div className="inline-flex items-center gap-1.5 bg-[#FFF1F3] text-[#FF385C] border border-[#FFCCD5] px-3.5 py-1 rounded-full text-xs font-bold mb-4">
            <span>🛠️</span>
            <span>{categoryNames}</span>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EBEBEB]">
            <div className="bg-[#F7F7F7] rounded-xl p-3 border border-[#EBEBEB]/70">
              <span className="text-xs text-[#717171] block mb-0.5">Experience (అనుభవం)</span>
              <span className="text-base font-extrabold text-[#222222]">
                {data.experienceYears} {data.experienceYears === 1 ? "Year" : "Years"}
              </span>
            </div>
            <div className="bg-[#F7F7F7] rounded-xl p-3 border border-[#EBEBEB]/70">
              <span className="text-xs text-[#717171] block mb-0.5">Location (ప్రాంతం)</span>
              <span
                className="text-xs font-bold text-[#222222] truncate block"
                title={`${data.locality.nameEnglish} (${data.locality.nameTelugu})`}
              >
                {data.locality.nameEnglish}
              </span>
              <span className="text-[10px] text-[#717171] block truncate">
                {data.locality.nameTelugu}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">📝</span>
            <h3 className="text-base font-bold text-[#222222]">About (గురించి)</h3>
          </div>
          <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-line">{about}</p>
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⭐</span>
              <h3 className="text-base font-bold text-[#222222]">Skills &amp; Services (నైపుణ్యాలు)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#F7F7F7] text-[#222222] border border-[#EBEBEB] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs hover:border-[#222222] transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Direct Contact Guarantee / Trust Info */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <h4 className="text-xs font-bold text-emerald-900">Direct Contact • Zero Commission</h4>
            <p className="text-[11px] text-emerald-800 leading-snug mt-0.5">
              Call or WhatsApp this worker directly. Negotiate rates and schedule work with no middleman fees.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons & View Tracking */}
      <WorkerActions
        workerId={data.id}
        phone={data.phone}
        whatsappPhone={data.whatsappPhone}
      />
    </main>
  );
}
