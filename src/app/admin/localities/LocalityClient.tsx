"use client";

import { useState } from "react";
import { createLocality } from "@/app/actions/worker";
import { useRouter } from "next/navigation";

export default function LocalityClient({ initialLocalities }: { initialLocalities: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameEnglish, setNameEnglish] = useState("");
  const [nameTelugu, setNameTelugu] = useState("");
  const [search, setSearch] = useState("");

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
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add locality");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLocalities = initialLocalities.filter(l => 
    l.nameEnglish.toLowerCase().includes(search.toLowerCase()) || 
    (l.nameTelugu && l.nameTelugu.includes(search))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Existing Localities Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FFF1F3] text-[#FF385C] flex items-center justify-center text-sm font-bold">
              📍
            </span>
            <div>
              <h3 className="font-bold text-base text-[#222222]">Existing Localities</h3>
              <p className="text-xs text-[#717171]">Neighborhoods & wards in Sircilla</p>
            </div>
          </div>
          <span className="text-xs bg-[#F7F7F7] border border-[#EBEBEB] px-3 py-1 rounded-full font-semibold text-[#484848]">
            {initialLocalities.length} Areas
          </span>
        </div>

        {/* Filter search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F7F7F7] border border-[#EBEBEB] rounded-full px-4 py-2 text-xs text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition"
          />
        </div>

        <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {filteredLocalities.map((loc) => (
            <li 
              key={loc.id} 
              className="flex justify-between items-center p-3 bg-[#FAFAFA] hover:bg-[#F2F2F2] rounded-xl border border-[#EBEBEB] transition"
            >
              <div>
                <p className="font-bold text-xs text-[#222222]">{loc.nameEnglish}</p>
                <p className="text-xs text-[#717171] leading-relaxed">{loc.nameTelugu}</p>
              </div>
              <span className="text-[10px] text-[#B0B0B0] font-mono bg-white px-2 py-0.5 rounded border border-[#EBEBEB]">
                ID: {loc.id.slice(-5)}
              </span>
            </li>
          ))}
          {filteredLocalities.length === 0 && (
            <li className="text-center py-6 text-xs text-[#717171]">
              No localities match &ldquo;{search}&rdquo;
            </li>
          )}
        </ul>
      </div>

      {/* Add New Locality Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-full bg-[#FFF1F3] text-[#FF385C] flex items-center justify-center text-sm font-bold">
            ➕
          </span>
          <div>
            <h3 className="font-bold text-base text-[#222222]">Add New Locality</h3>
            <p className="text-xs text-[#717171]">Auto-translates English to Telugu on blur</p>
          </div>
        </div>

        <form onSubmit={handleAddLocality} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#484848] mb-1">
              Locality Name (English) <span className="text-[#FF385C]">*</span>
            </label>
            <input 
              name="nameEnglish" 
              type="text" 
              required 
              value={nameEnglish}
              onChange={(e) => setNameEnglish(e.target.value)}
              onBlur={handleNameBlur}
              placeholder="e.g. Shanti Nagar, Gandhi Nagar"
              className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
            />
            <p className="text-[11px] text-[#717171] mt-1">Typing and unfocusing will auto-translate to Telugu below</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#484848] mb-1">
              Locality Name (Telugu) <span className="text-[#FF385C]">*</span>
            </label>
            <input 
              name="nameTelugu" 
              type="text" 
              required 
              value={nameTelugu}
              onChange={(e) => setNameTelugu(e.target.value)}
              placeholder="e.g. శాంతి నగర్"
              className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#FF385C] hover:bg-[#E00B41] active:bg-[#D7043A] text-white font-semibold py-2.5 rounded-full text-sm shadow-[0_2px_8px_rgba(255,56,92,0.25)] transition active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Adding Locality..." : "Add Locality"}
          </button>
        </form>
      </div>
    </div>
  );
}
