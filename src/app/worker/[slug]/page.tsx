"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getWorkerBySlug } from "@/app/actions/worker";

export default function WorkerProfilePage({ params }: { params: { slug: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [worker, setWorker] = useState<any>(null);

  useEffect(() => {
    getWorkerBySlug(params.slug).then(data => {
      if (data) {
        setWorker({
          id: data.id,
          name: data.fullName,
          nameTelugu: data.fullNameTelugu,
          phone: data.phone,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          category: data.categories?.map((c: any) => c.nameEnglish).join(", "),
          experience: `${data.experienceYears} Years`,
          experienceYears: data.experienceYears,
          locality: `${data.locality.nameEnglish} (${data.locality.nameTelugu})`,
          localityEnglish: data.locality.nameEnglish,
          localityTelugu: data.locality.nameTelugu,
          profileViews: data.profileViews,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          skills: data.skills?.map((ws: any) => ws.skill.nameEnglish) || [], 
          about: data.bio || "Experienced and reliable worker available for work in Sircilla. Contact directly for availability and rates.",
          categorySlug: data.categories?.[0]?.slug || "",
          mobileVerified: data.mobileVerified,
        });
      }
    });
  }, [params.slug]);

  const trackIntent = (type: 'CALL' | 'WHATSAPP' | 'VIEW') => {
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({ workerId: worker.id, type });
      navigator.sendBeacon('/api/analytics/track', payload);
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ workerId: worker.id, type }),
        keepalive: true
      }).catch(() => {});
    }
  };

  // Track profile view once worker is loaded
  useEffect(() => {
    if (worker) {
      trackIntent('VIEW');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worker?.id]);

  if (!worker) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#FF385C] border-t-transparent animate-spin mb-3"></div>
        <p className="text-sm font-semibold text-[#717171]">Loading worker profile...</p>
        <p className="text-xs text-[#B0B0B0] mt-1">ప్రొఫైల్ లోడ్ అవుతోంది</p>
      </main>
    );
  }

  const cleanPhone = worker.phone.replace(/\D/g, '').slice(-10);

  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-32">
      {/* Airbnb-style Sticky Header */}
      <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-30 px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link 
            href={worker.categorySlug ? `/category/${worker.categorySlug}` : "/"} 
            className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#F7F7F7] active:scale-95 transition-all text-[#222222]"
            aria-label="Back to workers list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="text-center">
            <h1 className="text-sm font-bold text-[#222222] tracking-tight truncate max-w-[200px]">
              {worker.name}
            </h1>
            <p className="text-[11px] text-[#717171]">Worker Profile • ప్రొఫైల్</p>
          </div>

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

      <div className="max-w-lg mx-auto px-4 mt-5 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] text-center relative overflow-hidden">
          {/* Top subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF385C] via-[#FF5A5F] to-[#E00B41]" />

          {/* Large Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-[#FFF1F3] to-[#FFE4E8] text-[#FF385C] rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-3 border-2 border-[#FFCCD5] shadow-sm">
            {worker.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h2 className="text-2xl font-bold text-[#222222] tracking-tight">{worker.name}</h2>
            {worker.mobileVerified && (
              <span title="Verified Worker">
                <svg className="w-5 h-5 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>

          {worker.nameTelugu && (
            <h3 className="text-base font-medium text-[#717171] mb-2">{worker.nameTelugu}</h3>
          )}

          <div className="inline-flex items-center gap-1.5 bg-[#FFF1F3] text-[#FF385C] border border-[#FFCCD5] px-3.5 py-1 rounded-full text-xs font-bold mb-4">
            <span>🛠️</span>
            <span>{worker.category}</span>
          </div>

          {/* Highlights Row */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EBEBEB]">
            <div className="bg-[#F7F7F7] rounded-xl p-3 border border-[#EBEBEB]/70">
              <span className="text-xs text-[#717171] block mb-0.5">Experience (అనుభవం)</span>
              <span className="text-base font-extrabold text-[#222222]">{worker.experience}</span>
            </div>
            <div className="bg-[#F7F7F7] rounded-xl p-3 border border-[#EBEBEB]/70">
              <span className="text-xs text-[#717171] block mb-0.5">Location (ప్రాంతం)</span>
              <span className="text-xs font-bold text-[#222222] truncate block" title={worker.locality}>
                {worker.localityEnglish}
              </span>
              <span className="text-[10px] text-[#717171] block truncate">{worker.localityTelugu}</span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">📝</span>
            <h3 className="text-base font-bold text-[#222222]">About (గురించి)</h3>
          </div>
          <p className="text-sm text-[#484848] leading-relaxed whitespace-pre-line">
            {worker.about}
          </p>
        </div>

        {/* Skills Section */}
        {worker.skills && worker.skills.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⭐</span>
              <h3 className="text-base font-bold text-[#222222]">Skills & Services (నైపుణ్యాలు)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill: string, index: number) => (
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

      {/* Floating Action Buttons (Airbnb style sticky bottom bar) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EBEBEB] p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
        <div className="max-w-lg mx-auto flex gap-3">
          {/* Call Button */}
          <a 
            href={`tel:${cleanPhone}`}
            onClick={() => trackIntent('CALL')}
            className="flex-1 bg-[#222222] hover:bg-black active:scale-95 text-white py-3 px-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-md transition-all leading-tight text-center"
          >
            <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <span className="text-sm block">Call Now</span>
              <span className="text-[10px] font-normal text-white/70 block">కాల్ చేయండి</span>
            </div>
          </a>
          
          {/* WhatsApp Button */}
          <a 
            href={`https://wa.me/91${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackIntent('WHATSAPP')}
            className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] active:scale-95 text-white py-3 px-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-md transition-all leading-tight text-center"
          >
            <svg className="w-5 h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.976L2 22l5.187-1.359a9.922 9.922 0 004.825 1.246h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.67-1.04-5.18-2.926-7.068A9.938 9.938 0 0012.012 2zm0 18.272h-.003a8.28 8.28 0 01-4.225-1.15l-.303-.18-3.14.823.84-3.06-.197-.314A8.3 8.3 0 013.715 11.98c.002-4.577 3.73-8.305 8.306-8.305 2.217 0 4.3.865 5.867 2.434a8.27 8.27 0 012.428 5.875c-.001 4.577-3.729 8.304-8.304 8.304zm4.56-6.223c-.25-.125-1.478-.73-1.706-.814-.23-.084-.396-.125-.563.125-.167.25-.646.814-.792.98-.146.166-.292.188-.542.063-.25-.125-1.055-.39-2.01-1.243-.743-.664-1.245-1.484-1.391-1.734-.146-.25-.015-.386.11-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.084-.167.042-.313-.021-.438-.063-.125-.563-1.354-.771-1.854-.204-.49-.41-.423-.563-.431-.146-.008-.313-.008-.479-.008a.91.91 0 00-.667.313c-.23.25-.875.854-.875 2.083 0 1.23.896 2.417 1.021 2.583.125.167 1.77 2.7 4.291 3.791.6.258 1.069.412 1.434.528.601.19 1.15.163 1.583.099.486-.073 1.478-.604 1.687-1.188.209-.583.209-1.083.146-1.187-.062-.104-.229-.167-.479-.292z"/>
            </svg>
            <div>
              <span className="text-sm block">WhatsApp</span>
              <span className="text-[10px] font-normal text-white/80 block">వాట్సాప్ మెసేజ్</span>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
