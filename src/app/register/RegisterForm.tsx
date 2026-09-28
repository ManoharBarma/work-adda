"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { registerWorker } from "@/app/actions/worker";

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
      } catch (err: any) {
        setErrorMsg(err.message || "An unexpected error occurred.");
      }
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!<br/><span className="text-xl">(నమోదు పూర్తయింది!)</span></h1>
        <p className="text-gray-600 mb-8 max-w-sm">
          Thank you. Our team will verify your details and list your profile within 24 hours.
        </p>
        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-blue-700 transition">
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-indigo-600 text-white px-4 py-6 shadow-md rounded-b-3xl text-center">
        <div className="flex justify-start mb-2">
          <Link href="/" className="active:scale-95 bg-indigo-700 p-2 rounded-full">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-1">Worker Registration</h1>
        <p className="text-indigo-100 text-sm">కార్మికుల నమోదు - 100% ఉచితం</p>
      </div>

      <div className="px-4 mt-8 max-w-lg mx-auto">
        <form action={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100">
              ⚠️ {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name (ఇంగ్లీష్‌లో పేరు) *</label>
            <input 
              name="fullName" 
              required 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleNameBlur(fullName, setFullNameTelugu)}
              placeholder="ex: Raju" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Telugu Name (తెలుగులో పేరు) *</label>
            <input 
              name="fullNameTelugu" 
              required 
              type="text" 
              value={fullNameTelugu}
              onChange={(e) => setFullNameTelugu(e.target.value)}
              placeholder="ex: రాజు" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number (మొబైల్ నంబర్) *</label>
            <input 
              name="phone" 
              required 
              type="tel" 
              pattern="^[789]\d{9}$"
              title="Phone number must be 10 digits and start with 7, 8, or 9"
              placeholder="10-digit mobile number" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number (వాట్సాప్ నంబర్) <span className="text-xs font-normal text-gray-500">(Optional)</span></label>
            <input 
              name="whatsappPhone" 
              type="tel" 
              pattern="^[789]\d{9}$"
              title="Phone number must be 10 digits and start with 7, 8, or 9"
              placeholder="Leave blank if same as mobile number" 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Service Categories (సేవా వర్గాలు) * <span className="text-xs text-gray-500 font-normal">(Select multiple if applicable)</span></label>
            <div className="space-y-1 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
              {categories.map(c => (
                <label key={c.slug} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
                  <input type="checkbox" name="category" value={c.slug} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <span className="text-gray-800 text-sm font-medium">{c.nameEnglish} <span className="text-gray-500 text-xs">({c.nameTelugu})</span></span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Locality (ప్రాంతం) *</label>
            <select 
              name="locality" 
              required 
              value={selectedLocalityId}
              onChange={(e) => setSelectedLocalityId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select your area...</option>
              {localities.map(l => (
                <option key={l.id} value={l.id}>{l.nameEnglish} ({l.nameTelugu})</option>
              ))}
            </select>
          </div>
          
          {isOtherLocality && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type your Area Name (మీ ప్రాంతం పేరు) *</label>
                <input 
                  name="customLocality" 
                  type="text" 
                  required={isOtherLocality}
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  onBlur={() => handleNameBlur(customLocality, setCustomLocalityTelugu)}
                  placeholder="ex: Gandhinagar" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Telugu Area Name (తెలుగులో) *</label>
                <input 
                  name="customLocalityTelugu" 
                  type="text" 
                  required={isOtherLocality}
                  value={customLocalityTelugu}
                  onChange={(e) => setCustomLocalityTelugu(e.target.value)}
                  placeholder="ex: గాంధీనగర్" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" 
                />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience (అనుభవం)</label>
            <input name="experience" type="number" placeholder="ex: 5" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">About You / Bio (మీ గురించి) <span className="text-xs font-normal text-gray-500">(Optional)</span></label>
            <textarea 
              name="bio" 
              rows={3}
              placeholder="Tell customers about your skills and services..." 
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
            ></textarea>
          </div>
          <div className="pt-2">
            <button disabled={isPending} type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition active:scale-95 disabled:opacity-70 flex flex-col items-center">
              <span>{isPending ? "Submitting..." : "Submit Registration"}</span>
              <span className="text-xs text-indigo-200 font-normal mt-0.5">సమర్పించండి</span>
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              By registering, you agree to receive calls and messages from local customers.<br/>
              (నమోదు చేయడం ద్వారా, మీరు స్థానిక కస్టమర్ల నుండి కాల్స్ పొందడానికి అంగీకరిస్తున్నారు.)
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
