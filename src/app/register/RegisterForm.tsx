"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { registerWorker } from "@/app/actions/worker";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RegisterForm({ categories, localities }: { categories: any[], localities: any[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState("");
  const [fullNameTelugu, setFullNameTelugu] = useState("");
  
  const [selectedLocalityId, setSelectedLocalityId] = useState("");
  const [customLocality, setCustomLocality] = useState("");
  const [customLocalityTelugu, setCustomLocalityTelugu] = useState("");

  const isOtherLocality = localities.find(l => l.id === selectedLocalityId)?.nameEnglish === "Other (Not Listed)";

  const handleNameBlur = async (text: string, setter: (val: string) => void) => {
    if (!text.trim()) return;
    try {
      const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=te-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`);
      const data = await response.json();
      if (data[0] === 'SUCCESS') {
        setter(data[1][0][1][0]);
      }
    } catch (err) {
      console.error("Translation error", err);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await registerWorker(formData);
        if (res?.success === false) {
          setErrorMsg(res.error || "Failed to register");
        } else {
          setSubmitted(true);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setErrorMsg(err.message || "An unexpected error occurred.");
      }
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white border border-[#EBEBEB] rounded-3xl p-8 max-w-sm shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="w-16 h-16 bg-[#ECFDF5] text-[#008A05] rounded-full flex items-center justify-center text-3xl mb-4 mx-auto border border-[#A7F3D0]">
            ✓
          </div>
          <h1 className="text-xl font-bold text-[#222222] mb-1">
            Registration Submitted!
          </h1>
          <p className="text-sm text-[#717171] mb-2 font-medium">
            (నమోదు విజయవంతంగా పూర్తయింది!)
          </p>
          <p className="text-xs text-[#484848] mb-6 leading-relaxed">
            Thank you! Our local team will verify your details and activate your profile within 24 hours.
          </p>
          <Link 
            href="/" 
            className="inline-block w-full bg-[#222222] hover:bg-black text-white py-3 rounded-full font-semibold text-xs shadow transition-all active:scale-95"
          >
            Back to Home (హోమ్‌కి వెళ్ళండి)
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-16">
      {/* Airbnb-style Header */}
      <div className="bg-white border-b border-[#EBEBEB] sticky top-0 z-30 px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              <h1 className="text-lg font-bold text-[#222222] tracking-tight">Worker Registration</h1>
              <p className="text-xs text-[#717171]">కార్మికుల నమోదు - 100% ఉచితం</p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#FF385C] bg-[#FFF1F3] px-2.5 py-1 rounded-full border border-[#FFCCD5]">
            Free
          </span>
        </div>
      </div>

      <div className="px-4 mt-6 max-w-lg mx-auto">
        <form action={handleSubmit} className="bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#EBEBEB] space-y-4">
          
          {errorMsg && (
            <div className="bg-[#FFF1F3] text-[#FF385C] p-3.5 rounded-xl text-xs font-semibold border border-[#FFCCD5] flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              Full Name (ఇంగ్లీష్‌లో పేరు) <span className="text-[#FF385C]">*</span>
            </label>
            <input 
              name="fullName" 
              required 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleNameBlur(fullName, setFullNameTelugu)}
              placeholder="ex: Raju" 
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              Telugu Name (తెలుగులో పేరు) <span className="text-[#FF385C]">*</span>
            </label>
            <input 
              name="fullNameTelugu" 
              required 
              type="text" 
              value={fullNameTelugu}
              onChange={(e) => setFullNameTelugu(e.target.value)}
              placeholder="ex: రాజు (Auto-suggests from English)" 
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] bg-[#F7F7F7] transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              Mobile Number (మొబైల్ నంబర్) <span className="text-[#FF385C]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-xs font-bold text-[#717171]">+91</span>
              <input 
                name="phone" 
                required 
                type="tel" 
                pattern="^[789]\d{9}$"
                title="Phone number must be 10 digits and start with 7, 8, or 9"
                placeholder="10-digit mobile number" 
                className="w-full border border-[#EBEBEB] rounded-xl pl-12 pr-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              WhatsApp Number (వాట్సాప్ నంబర్) <span className="text-xs font-normal text-[#717171]">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-xs font-bold text-[#717171]">+91</span>
              <input 
                name="whatsappPhone" 
                type="tel" 
                pattern="^[789]\d{9}$"
                title="Phone number must be 10 digits and start with 7, 8, or 9"
                placeholder="Leave blank if same as mobile" 
                className="w-full border border-[#EBEBEB] rounded-xl pl-12 pr-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              Service Categories (సేవా వర్గాలు) <span className="text-[#FF385C]">*</span>
              <span className="block text-[11px] text-[#717171] font-normal mt-0.5">Select all services you provide</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-52 overflow-y-auto border border-[#EBEBEB] rounded-xl p-2.5 bg-[#F7F7F7]">
              {categories.map(c => (
                <label key={c.slug} className="flex items-center gap-2.5 p-2 bg-white border border-[#EBEBEB] hover:border-[#FF385C]/40 rounded-lg cursor-pointer transition-all">
                  <input type="checkbox" name="category" value={c.slug} className="w-4 h-4 text-[#FF385C] rounded border-[#B0B0B0] focus:ring-[#FF385C] accent-[#FF385C]" />
                  <span className="text-xs font-medium text-[#222222] truncate">
                    {c.icon} {c.nameEnglish} <span className="text-[10px] text-[#717171]">({c.nameTelugu})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              Locality in Sircilla (ప్రాంతం) <span className="text-[#FF385C]">*</span>
            </label>
            <select 
              name="locality" 
              required 
              value={selectedLocalityId}
              onChange={(e) => setSelectedLocalityId(e.target.value)}
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] bg-white transition-all cursor-pointer"
            >
              <option value="">Select your area...</option>
              {localities.map(l => (
                <option key={l.id} value={l.id}>{l.nameEnglish} ({l.nameTelugu})</option>
              ))}
            </select>
          </div>
          
          {isOtherLocality && (
            <div className="p-4 bg-[#FFF1F3] border border-[#FFCCD5] rounded-xl space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Type your Area Name (మీ ప్రాంతం పేరు) <span className="text-[#FF385C]">*</span>
                </label>
                <input 
                  name="customLocality" 
                  type="text" 
                  required={isOtherLocality}
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  onBlur={() => handleNameBlur(customLocality, setCustomLocalityTelugu)}
                  placeholder="ex: Gandhinagar" 
                  className="w-full border border-[#EBEBEB] rounded-xl px-4 py-2.5 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 bg-white" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Telugu Area Name (తెలుగులో) <span className="text-[#FF385C]">*</span>
                </label>
                <input 
                  name="customLocalityTelugu" 
                  type="text" 
                  required={isOtherLocality}
                  value={customLocalityTelugu}
                  onChange={(e) => setCustomLocalityTelugu(e.target.value)}
                  placeholder="ex: గాంధీనగర్" 
                  className="w-full border border-[#EBEBEB] rounded-xl px-4 py-2.5 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 bg-white" 
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              Years of Experience (అనుభవం)
            </label>
            <input 
              name="experience" 
              type="number" 
              placeholder="ex: 5" 
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] transition-all" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#222222] mb-1.5">
              About You / Bio (మీ గురించి) <span className="text-xs font-normal text-[#717171]">(Optional)</span>
            </label>
            <textarea 
              name="bio" 
              rows={3}
              placeholder="Tell customers about your skills, availability, and specializations..." 
              className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] resize-none transition-all" 
            ></textarea>
          </div>

          <div className="pt-2">
            <button 
              disabled={isPending} 
              type="submit" 
              className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70 flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="text-sm">{isPending ? "Submitting..." : "Submit Registration (నమోదు చేయండి)"}</span>
            </button>
            <p className="text-center text-[11px] text-[#717171] mt-3 leading-relaxed">
              By registering, you agree to receive direct calls and WhatsApp inquiries from local customers.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
