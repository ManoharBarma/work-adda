import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white px-4 py-12 rounded-b-3xl shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Work Adda
        </h1>
        <p className="text-blue-100 text-sm mb-6 max-w-xs mx-auto">
          Find skilled local workers in your area and contact them directly.<br />
          <span className="text-xs opacity-90 block mt-1">(మీ ప్రాంతంలోని నైపుణ్యం కలిగిన కార్మికులను కనుగొనండి మరియు వారిని నేరుగా సంప్రదించండి.)</span>
        </p>

        {/* Search Bar */}
        <form action="/search" method="GET" className="relative max-w-md mx-auto">
          <input
            type="text"
            name="q"
            required
            placeholder="Search workers or categories..."
            className="w-full pl-12 pr-24 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg text-base"
          />
          <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-full font-medium shadow hover:bg-blue-700 transition">
            Search
          </button>
        </form>
      </div>

      {/* Categories Grid */}
      <div className="px-4 mt-10 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-1 px-2">Browse Categories</h2>
        <p className="text-sm text-gray-500 mb-4 px-2">వర్గాలను బ్రౌజ్ చేయండి</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              href={`/category/${cat.slug}`}
              key={cat.slug}
              className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition active:scale-95"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-gray-800 text-sm leading-tight">{cat.nameEnglish}</div>
              <div className="text-xs text-gray-500 mt-1">{cat.nameTelugu}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action for Workers */}
      <div className="px-4 mt-12 max-w-lg mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl text-center shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Are you a skilled worker?<br /><span className="text-sm">(మీరు నైపుణ్యం కలిగిన కార్మికులా?)</span></h3>
          <p className="text-sm text-gray-600 mb-5">
            Register your profile for free and let local customers contact you directly. No commissions.
          </p>
          <Link
            href="/register"
            className="inline-block w-full bg-indigo-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-indigo-700 transition active:scale-95"
          >
            Register as Worker — Free
          </Link>
        </div>
      </div>
    </main>
  );
}
