"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/app/actions/worker";

export default function CategoryClient({ initialCategories }: { initialCategories: any[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await createCategory(formData);
      if (res?.success === false) {
        setMessage({ text: res.error || "Failed to create category", type: "error" });
      } else {
        if (res?.category) {
          setCategories((prev) => [...prev, res.category]);
        }
        setMessage({ text: "Category added successfully!", type: "success" });
        form.reset();
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to create category", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Category Form Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-fit">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-full bg-[#FFF1F3] text-[#FF385C] flex items-center justify-center text-sm font-bold">
            ➕
          </span>
          <div>
            <h3 className="font-bold text-base text-[#222222]">Add New Category</h3>
            <p className="text-xs text-[#717171]">Create a new trade or skill bucket</p>
          </div>
        </div>
        
        {message && (
          <div className={`p-3.5 rounded-xl mb-4 text-xs font-semibold border ${
            message.type === 'success' 
              ? 'bg-[#ECFDF5] text-[#008A05] border-[#A7F3D0]' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#484848] mb-1">
              Category Name (English) <span className="text-[#FF385C]">*</span>
            </label>
            <input 
              name="nameEnglish" 
              type="text" 
              required 
              placeholder="e.g. Electrician, Carpenter" 
              className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#484848] mb-1">
              Category Name (Telugu) <span className="text-[#FF385C]">*</span>
            </label>
            <input 
              name="nameTelugu" 
              type="text" 
              required 
              placeholder="e.g. ఎలక్ట్రీషియన్, కార్పెంటర్" 
              className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#484848] mb-1">
              Icon (Emoji or Identifier) <span className="text-[#FF385C]">*</span>
            </label>
            <input 
              name="icon" 
              type="text" 
              required 
              placeholder="e.g. ⚡, 🪚, 🚰" 
              className="w-full bg-[#F7F7F7] border border-[#EBEBEB] px-3.5 py-2.5 rounded-xl text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#FF385C] hover:bg-[#E00B41] active:bg-[#D7043A] text-white font-semibold py-2.5 rounded-full text-sm shadow-[0_2px_8px_rgba(255,56,92,0.25)] transition active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Adding Category..." : "Add Category"}
          </button>
        </form>
      </div>

      {/* Categories Table Card */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-5 border-b border-[#EBEBEB] flex justify-between items-center bg-[#FAFAFA]">
          <div>
            <h3 className="font-bold text-sm text-[#222222]">Active Categories</h3>
            <p className="text-xs text-[#717171]">Current categories visible on home & search</p>
          </div>
          <span className="text-xs bg-white border border-[#EBEBEB] px-3 py-1 rounded-full font-semibold text-[#484848]">
            {categories.length} Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA] text-xs font-semibold text-[#717171] uppercase tracking-wider">
                <th className="p-4 w-16 text-center">Icon</th>
                <th className="p-4">English Name</th>
                <th className="p-4">Telugu Name</th>
                <th className="p-4">Slug Identifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB] text-sm">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-[#FAFAFA] transition">
                  <td className="p-4 text-center text-2xl">{c.icon}</td>
                  <td className="p-4 font-bold text-[#222222]">{c.nameEnglish}</td>
                  <td className="p-4 text-[#484848] leading-relaxed">{c.nameTelugu}</td>
                  <td className="p-4">
                    <span className="text-xs font-mono bg-[#F7F7F7] text-[#717171] px-2.5 py-1 rounded-full border border-[#EBEBEB]">
                      {c.slug}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
