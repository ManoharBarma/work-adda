"use client";

import { useState } from "react";
import { createLocality } from "@/app/actions/worker";
import { useRouter } from "next/navigation";

export default function LocalityClient({ initialLocalities }: { initialLocalities: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameEnglish, setNameEnglish] = useState("");
  const [nameTelugu, setNameTelugu] = useState("");

  const handleNameBlur = async () => {
    if (!nameEnglish.trim()) return;
    try {
      const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(nameEnglish)}&itc=te-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`);
      const data = await response.json();
      if (data[0] === 'SUCCESS') {
        const translated = data[1][0][1][0];
        setNameTelugu(translated);
      }
    } catch (err) {
      console.error("Translation error", err);
    }
  };

  const handleAddLocality = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createLocality(formData);
      setNameEnglish("");
      setNameTelugu("");
      (e.target as HTMLFormElement).reset();
      router.refresh(); // Reload to fetch latest localities
    } catch (error) {
      console.error(error);
      alert("Failed to add locality");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* List Existing */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Existing Localities</h3>
        <ul className="space-y-3 max-h-96 overflow-y-auto">
          {initialLocalities.map((loc) => (
            <li key={loc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="font-bold text-slate-700">{loc.nameEnglish}</p>
                <p className="text-sm text-slate-500">{loc.nameTelugu}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add New */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Locality</h3>
        <form onSubmit={handleAddLocality} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Locality Name (English)</label>
            <input 
              name="nameEnglish" 
              type="text" 
              required 
              value={nameEnglish}
              onChange={(e) => setNameEnglish(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="e.g. Shanti Nagar"
              className="w-full border border-slate-300 p-2 rounded-lg" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Locality Name (Telugu)</label>
            <input 
              name="nameTelugu" 
              type="text" 
              required 
              value={nameTelugu}
              onChange={(e) => setNameTelugu(e.target.value)}
              placeholder="e.g. శాంతి నగర్"
              className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Locality"}
          </button>
        </form>
      </div>
    </div>
  );
}
