"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRegisterWorker } from "@/app/actions/worker";
import { ProfilePhotoField, WorkPhotosField } from "@/components/ImageUpload";
import {
  ALL_SIRCILLA_NAME_EN,
  ALL_SIRCILLA_NAME_TE,
  ALL_SIRCILLA_SENTINEL,
  isAllSircillaLocality,
} from "@/lib/locality";

export default function AdminAddWorkerForm({ categories, localities }: { categories: any[], localities: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  const [fullName, setFullName] = useState("");
  const [fullNameTelugu, setFullNameTelugu] = useState("");
  
  const [selectedLocalityId, setSelectedLocalityId] = useState("");
  const [customLocality, setCustomLocality] = useState("");
  const [customLocalityTelugu, setCustomLocalityTelugu] = useState("");

  const isOtherLocality = localities.find(l => l.id === selectedLocalityId)?.nameEnglish === "Other (Not Listed)";
  const hasAllSircilla = localities.some(isAllSircillaLocality);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const result = await adminRegisterWorker(formData);
      if (result.success) {
        setMessage({ text: "Worker added and auto-approved!", type: "success" });
        (e.target as HTMLFormElement).reset();
        setFullName("");
        setFullNameTelugu("");
        router.push("/admin");
      } else {
        setMessage({ text: result.error || "Failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "An error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-xs font-semibold border ${
          message.type === 'success' 
            ? 'bg-[#ECFDF5] text-[#008A05] border-[#A7F3D0]' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Names (English + Telugu) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1">
            Full Name (English) <span className="text-[#FF385C]">*</span>
          </label>
          <input 
            name="fullName" 
            type="text" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => handleNameBlur(fullName, setFullNameTelugu)}
            placeholder="e.g. Ramesh Kumar"
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
          />
          <p className="text-[11px] text-[#717171] mt-1">Blurring auto-populates Telugu name</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1">
            Full Name (Telugu)
          </label>
          <input 
            name="fullNameTelugu" 
            type="text" 
            value={fullNameTelugu}
            onChange={(e) => setFullNameTelugu(e.target.value)}
            placeholder="e.g. రమేష్ కుమార్"
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
          />
        </div>
      </div>

      {/* Phone & WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1">
            Phone Number (10 digits) <span className="text-[#FF385C]">*</span>
          </label>
          <input 
            name="phone" 
            type="tel" 
            required 
            pattern="[789][0-9]{9}" 
            placeholder="9876543210"
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition font-mono" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1">
            WhatsApp Number (Optional)
          </label>
          <input 
            name="whatsappPhone" 
            type="tel" 
            pattern="[789][0-9]{9}" 
            placeholder="Same as phone if empty"
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition font-mono" 
          />
        </div>
      </div>

      {/* Categories selection */}
      <div>
        <label className="block text-xs font-semibold text-[#484848] mb-1.5">
          Select Categories (Trades) <span className="text-[#FF385C]">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#FAFAFA] border border-[#EBEBEB] p-3 rounded-2xl max-h-48 overflow-y-auto">
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EBEBEB] hover:border-[#222222] transition cursor-pointer text-xs font-medium text-[#222222]">
              <input 
                type="checkbox" 
                name="category" 
                value={c.slug} 
                className="rounded accent-[#FF385C] text-[#FF385C] focus:ring-[#FF385C] w-4 h-4" 
              />
              <span className="truncate">{c.icon} {c.nameEnglish}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Locality & Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1">
            Locality in Sircilla <span className="text-[#FF385C]">*</span>
          </label>
          <select 
            name="locality" 
            required 
            value={selectedLocalityId}
            onChange={(e) => setSelectedLocalityId(e.target.value)}
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition cursor-pointer"
          >
            <option value="">Select Locality...</option>
            {!hasAllSircilla && (
              <option value={ALL_SIRCILLA_SENTINEL}>
                🌐 {ALL_SIRCILLA_NAME_EN} ({ALL_SIRCILLA_NAME_TE})
              </option>
            )}
            {localities.map(loc => (
              <option key={loc.id} value={loc.id}>
                {isAllSircillaLocality(loc) ? `🌐 ${loc.nameEnglish} (${loc.nameTelugu})` : `${loc.nameEnglish} (${loc.nameTelugu})`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1">
            Years of Experience <span className="text-[#FF385C]">*</span>
          </label>
          <input 
            name="experience" 
            type="number" 
            min="0" 
            required 
            defaultValue="2"
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
          />
        </div>
      </div>

      {/* Dynamic custom locality */}
      {isOtherLocality && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFF1F3] p-4 rounded-2xl border border-[#FFD2D9]">
          <div>
            <label className="block text-xs font-semibold text-[#FF385C] mb-1">Custom Locality (English)</label>
            <input 
              name="customLocality" 
              type="text" 
              required={isOtherLocality}
              value={customLocality}
              onChange={(e) => setCustomLocality(e.target.value)}
              onBlur={() => handleNameBlur(customLocality, setCustomLocalityTelugu)}
              placeholder="e.g. New Colony"
              className="w-full bg-white border border-[#FFD2D9] px-3.5 py-2 rounded-xl text-sm text-[#222222] focus:outline-none focus:border-[#FF385C]" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#FF385C] mb-1">Custom Locality (Telugu)</label>
            <input 
              name="customLocalityTelugu" 
              type="text" 
              required={isOtherLocality}
              value={customLocalityTelugu}
              onChange={(e) => setCustomLocalityTelugu(e.target.value)}
              placeholder="e.g. న్యూ కాలనీ"
              className="w-full bg-white border border-[#FFD2D9] px-3.5 py-2 rounded-xl text-sm text-[#222222] focus:outline-none focus:border-[#FF385C]" 
            />
          </div>
        </div>
      )}

      {/* Bio */}
      <div>
        <label className="block text-xs font-semibold text-[#484848] mb-1">
          Bio / Brief Introduction (Optional)
        </label>
        <textarea 
          name="bio" 
          rows={3} 
          placeholder="Brief summary of skills, specialties, or standard charges..."
          className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition"
        ></textarea>
      </div>

      <ProfilePhotoField />
      <WorkPhotosField />

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-[#FF385C] hover:bg-[#E00B41] active:bg-[#D7043A] text-white font-semibold py-3 rounded-full text-sm shadow-[0_2px_8px_rgba(255,56,92,0.25)] transition active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Adding Worker..." : "Add & Auto-Approve Worker"}
      </button>
    </form>
  );
}
