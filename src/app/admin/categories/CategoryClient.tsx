"use client";

import { useState } from "react";
import { createCategory } from "@/app/actions/worker";

export default function CategoryClient({ initialCategories }: { initialCategories: any[] }) {
  const [categories] = useState(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      await createCategory(formData);
      setMessage({ text: "Category added successfully!", type: "success" });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to create category", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Add New Category</h3>
        
        {message && (
          <div className={`p-3 rounded mb-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name (English)</label>
            <input name="nameEnglish" type="text" required placeholder="e.g. Electrician" className="w-full border border-slate-300 p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name (Telugu)</label>
            <input name="nameTelugu" type="text" required placeholder="e.g. ఎలక్ట్రీషియన్" className="w-full border border-slate-300 p-2 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Icon (Emoji/SVG)</label>
            <input name="icon" type="text" required placeholder="e.g. ⚡" className="w-full border border-slate-300 p-2 rounded-lg" />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th className="p-4 font-semibold">Icon</th>
              <th className="p-4 font-semibold">English Name</th>
              <th className="p-4 font-semibold">Telugu Name</th>
              <th className="p-4 font-semibold">Slug</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="p-4 text-2xl">{c.icon}</td>
                <td className="p-4 font-medium text-slate-800">{c.nameEnglish}</td>
                <td className="p-4 text-slate-600">{c.nameTelugu}</td>
                <td className="p-4 text-slate-500 font-mono text-xs">{c.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
