"use client";

import { useState, useTransition } from "react";
import { updateWorkerAdmin } from "@/app/actions/worker";
import { useRouter } from "next/navigation";

export default function EditWorkerForm({ worker, categories, localities }: { worker: any, categories: any[], localities: any[] }) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        const res = await updateWorkerAdmin(worker.id, formData);
        if (res?.success === false) {
          setErrorMsg(res.error || "Failed to update worker");
        } else {
          router.push("/admin");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An unexpected error occurred.");
      }
    });
  };

  const defaultCategorySlugs = worker.categories?.map((c: any) => c.slug) || [];

  return (
    <form action={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-semibold border border-red-200">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-[#484848] mb-1.5">
          Full Name <span className="text-[#FF385C]">*</span>
        </label>
        <input 
          name="fullName" 
          required 
          type="text" 
          defaultValue={worker.fullName}
          className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
        />
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1.5">
            Phone Number <span className="text-[#FF385C]">*</span>
          </label>
          <input 
            name="phone" 
            required 
            type="tel" 
            pattern="^[789]\d{9}$"
            title="Phone number must be 10 digits and start with 7, 8, or 9"
            defaultValue={worker.phone}
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] font-mono focus:outline-none focus:bg-white focus:border-[#222222] transition" 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1.5">
            WhatsApp Number
          </label>
          <input 
            name="whatsappPhone" 
            type="tel" 
            pattern="^[789]\d{9}$"
            title="Phone number must be 10 digits and start with 7, 8, or 9"
            defaultValue={worker.whatsappPhone || ""}
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] font-mono focus:outline-none focus:bg-white focus:border-[#222222] transition" 
          />
        </div>
      </div>

      {/* Service Categories */}
      <div>
        <label className="block text-xs font-semibold text-[#484848] mb-1.5">
          Service Categories
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#FAFAFA] border border-[#EBEBEB] p-3 rounded-2xl max-h-48 overflow-y-auto">
          {categories.map(c => (
            <label key={c.slug} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-[#EBEBEB] hover:border-[#222222] transition cursor-pointer text-xs font-medium text-[#222222]">
              <input 
                type="checkbox" 
                name="category" 
                value={c.slug} 
                defaultChecked={defaultCategorySlugs.includes(c.slug)}
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
          <label className="block text-xs font-semibold text-[#484848] mb-1.5">
            Locality
          </label>
          <select 
            name="locality" 
            required 
            defaultValue={worker.localityId}
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition cursor-pointer"
          >
            {localities.map(l => (
              <option key={l.id} value={l.id}>{l.nameEnglish} ({l.nameTelugu})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#484848] mb-1.5">
            Years of Experience
          </label>
          <input 
            name="experience" 
            type="number" 
            defaultValue={worker.experienceYears || 0}
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-semibold text-[#484848] mb-1.5">
          Bio / About
        </label>
        <textarea 
          name="bio" 
          rows={3}
          defaultValue={worker.bio || ""}
          className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition resize-none" 
        ></textarea>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-[#EBEBEB] flex justify-end items-center gap-3">
        <button 
          type="button" 
          onClick={() => router.push("/admin")}
          className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#484848] bg-[#F7F7F7] border border-[#EBEBEB] hover:bg-[#EBEBEB] transition"
        >
          Cancel
        </button>
        <button 
          disabled={isPending} 
          type="submit" 
          className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#FF385C] hover:bg-[#E00B41] active:bg-[#D7043A] transition shadow-[0_2px_8px_rgba(255,56,92,0.25)] active:scale-95 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
