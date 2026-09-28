"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRegisterWorker } from "@/app/actions/worker";

export default function AdminAddWorkerForm({ categories, localities }: { categories: any[], localities: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

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
        router.push("/admin");
      } else {
        setMessage({ text: result.error || "Failed", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: "An error occurred", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
        <input name="fullName" type="text" required className="w-full border border-slate-300 p-2 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input name="phone" type="tel" required pattern="[789][0-9]{9}" className="w-full border border-slate-300 p-2 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (Optional)</label>
          <input name="whatsappPhone" type="tel" pattern="[789][0-9]{9}" className="w-full border border-slate-300 p-2 rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Select Categories</label>
        <div className="grid grid-cols-2 gap-2 border border-slate-300 p-3 rounded-lg max-h-48 overflow-y-auto">
          {categories.map(c => (
            <label key={c.id} className="flex items-center space-x-2 text-sm">
              <input type="checkbox" name="category" value={c.slug} className="rounded text-blue-600 focus:ring-blue-500" />
              <span>{c.icon} {c.nameEnglish}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Locality</label>
          <select name="locality" required className="w-full border border-slate-300 p-2 rounded-lg">
            {localities.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.nameEnglish} ({loc.nameTelugu})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
          <input name="experience" type="number" min="0" required className="w-full border border-slate-300 p-2 rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Bio / About (Optional)</label>
        <textarea name="bio" rows={3} className="w-full border border-slate-300 p-2 rounded-lg"></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Adding Worker..." : "Add & Auto-Approve Worker"}
      </button>
    </form>
  );
}
