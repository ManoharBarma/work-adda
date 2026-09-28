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
    <form action={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-100">
          ⚠️ {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
        <input 
          name="fullName" 
          required 
          type="text" 
          defaultValue={worker.fullName}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
        <input 
          name="phone" 
          required 
          type="tel" 
          pattern="^[789]\d{9}$"
          title="Phone number must be 10 digits and start with 7, 8, or 9"
          defaultValue={worker.phone}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">WhatsApp Number</label>
        <input 
          name="whatsappPhone" 
          type="tel" 
          pattern="^[789]\d{9}$"
          title="Phone number must be 10 digits and start with 7, 8, or 9"
          defaultValue={worker.whatsappPhone}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Service Categories</label>
        <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
          {categories.map(c => (
            <label key={c.slug} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer">
              <input 
                type="checkbox" 
                name="category" 
                value={c.slug} 
                defaultChecked={defaultCategorySlugs.includes(c.slug)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
              />
              <span className="text-slate-800 text-sm font-medium">{c.nameEnglish}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Locality</label>
        <select 
          name="locality" 
          required 
          defaultValue={worker.localityId}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {localities.map(l => (
            <option key={l.id} value={l.id}>{l.nameEnglish}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
        <input 
          name="experience" 
          type="number" 
          defaultValue={worker.experienceYears}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / About</label>
        <textarea 
          name="bio" 
          rows={3}
          defaultValue={worker.bio || ""}
          className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
        ></textarea>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={() => router.push("/admin")}
          className="px-6 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
        >
          Cancel
        </button>
        <button 
          disabled={isPending} 
          type="submit" 
          className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
