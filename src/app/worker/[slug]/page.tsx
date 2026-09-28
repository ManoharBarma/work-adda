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
          phone: data.phone,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          category: data.categories?.map((c: any) => c.nameEnglish).join(", "),
          experience: `${data.experienceYears} Years`,
          locality: `${data.locality.nameEnglish} (${data.locality.nameTelugu})`,
          profileViews: data.profileViews,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          skills: data.skills?.map((ws: any) => ws.skill.nameEnglish) || [], 
          about: data.bio || "No bio available. (బయో అందుబాటులో లేదు)",
          categorySlug: data.categories?.[0]?.slug || ""
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

  if (!worker) return <div className="p-8 text-center text-gray-500">Loading (లోడ్ అవుతోంది)...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-4 flex items-center shadow-md">
        <Link href={`/category/${worker.categorySlug}`} className="mr-4 active:scale-95 bg-blue-700 p-2 rounded-full">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold">Profile</h1>
          <p className="text-blue-200 text-sm">ప్రొఫైల్</p>
        </div>
      </div>

      {/* Top Card */}
      <div className="bg-white px-4 py-8 rounded-b-3xl shadow-sm text-center">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-4xl mx-auto mb-4">
          {worker.name.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{worker.name}</h2>
        <p className="text-blue-600 font-medium mb-2">{worker.category}</p>
        
        <div className="flex justify-center text-sm text-gray-600 mt-4 mb-5">
          <div className="flex flex-col items-center">
            <span className="font-bold text-gray-900 text-lg">{worker.experience}</span>
            <span className="text-xs">అనుభవం (Exp)</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 mx-auto">
           <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
             <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
           </svg>
           <span className="text-sm font-semibold text-gray-700">{worker.locality}</span>
        </div>
      </div>

      {/* About Section */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">About (గురించి)</h3>
        <p className="text-gray-600 text-sm leading-relaxed bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          {worker.about}
        </p>
      </div>

      {/* Skills Section */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Skills (నైపుణ్యాలు)</h3>
        <div className="flex flex-wrap gap-2">
          {worker.skills.map((skill: string, index: number) => (
            <span key={index} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <a 
          href={`tel:${worker.phone}`}
          onClick={() => trackIntent('CALL')}
          className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold flex flex-col items-center justify-center shadow-md active:scale-95 transition leading-tight"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            Call Now
          </span>
          <span className="text-[10px] font-normal text-gray-300">కాల్ చేయండి</span>
        </a>
        
        <a 
          href={`https://wa.me/${worker.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackIntent('WHATSAPP')}
          className="flex-1 bg-green-500 text-white py-3.5 rounded-xl font-bold flex flex-col items-center justify-center shadow-md active:scale-95 transition leading-tight"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.976L2 22l5.187-1.359a9.922 9.922 0 004.825 1.246h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.67-1.04-5.18-2.926-7.068A9.938 9.938 0 0012.012 2zm0 18.272h-.003a8.28 8.28 0 01-4.225-1.15l-.303-.18-3.14.823.84-3.06-.197-.314A8.3 8.3 0 013.715 11.98c.002-4.577 3.73-8.305 8.306-8.305 2.217 0 4.3.865 5.867 2.434a8.27 8.27 0 012.428 5.875c-.001 4.577-3.729 8.304-8.304 8.304zm4.56-6.223c-.25-.125-1.478-.73-1.706-.814-.23-.084-.396-.125-.563.125-.167.25-.646.814-.792.98-.146.166-.292.188-.542.063-.25-.125-1.055-.39-2.01-1.243-.743-.664-1.245-1.484-1.391-1.734-.146-.25-.015-.386.11-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.084-.167.042-.313-.021-.438-.063-.125-.563-1.354-.771-1.854-.204-.49-.41-.423-.563-.431-.146-.008-.313-.008-.479-.008a.91.91 0 00-.667.313c-.23.25-.875.854-.875 2.083 0 1.23.896 2.417 1.021 2.583.125.167 1.77 2.7 4.291 3.791.6.258 1.069.412 1.434.528.601.19 1.15.163 1.583.099.486-.073 1.478-.604 1.687-1.188.209-.583.209-1.083.146-1.187-.062-.104-.229-.167-.479-.292z"/>
            </svg>
            WhatsApp
          </span>
          <span className="text-[10px] font-normal text-green-100">వాట్సాప్</span>
        </a>
      </div>
    </main>
  );
}
