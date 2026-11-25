import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const revalidate = 300;

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-16">
      {/* Airbnb-Inspired Header & Hero */}
      <div className="bg-gradient-to-b from-[#FF385C] via-[#FF385C] to-[#E00B41] text-white px-4 pt-10 pb-14 rounded-b-[2rem] shadow-md text-center relative overflow-hidden">
        {/* Soft background glow accents */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          {/* Logo & Brand Tag */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative p-1 bg-white/20 backdrop-blur-md rounded-full shadow-lg">
              <Image 
                src="/logo.jpg" 
                alt="Work Adda Logo" 
                width={104} 
                height={104} 
                className="rounded-full border-2 border-white shadow-md object-cover"
                priority
              />
            </div>
            <span className="mt-2 inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm text-white/95 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sircilla Local Services
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Work Adda
          </h1>
          <p className="text-white/90 text-sm max-w-sm mx-auto leading-relaxed">
            Find trusted local workers & contact them directly.
            <span className="block text-xs text-white/80 mt-1 font-normal">
              మీ ప్రాంతంలోని నైపుణ్యం కలిగిన కార్మికులను నేరుగా సంప్రదించండి.
            </span>
          </p>

          {/* Airbnb Signature Floating Search Pill */}
          <form action="/search" method="GET" className="mt-7 relative max-w-md mx-auto">
            <div className="bg-white rounded-full p-2 pl-5 shadow-[0_6px_20px_rgba(0,0,0,0.18)] flex items-center gap-2 border border-white/50 transition-all focus-within:ring-2 focus-within:ring-black/20">
              <svg className="w-5 h-5 text-[#717171] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                required
                placeholder="Search electrician, plumber, painter..."
                className="w-full bg-transparent text-[#222222] placeholder-[#717171] text-sm focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-[#FF385C] hover:bg-[#E00B41] active:scale-95 text-white font-semibold text-xs px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Trust Highlights */}
      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-20">
        <div className="bg-white rounded-2xl p-3 border border-[#EBEBEB] shadow-sm flex justify-around items-center text-center">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-[#222222]">100% Free</span>
            <span className="text-[11px] text-[#717171]">ఉచిత సంప్రదింపు</span>
          </div>
          <div className="h-6 w-px bg-[#EBEBEB]" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-[#222222]">Direct Contact</span>
            <span className="text-[11px] text-[#717171]">కాల్ / వాట్సాప్</span>
          </div>
          <div className="h-6 w-px bg-[#EBEBEB]" />
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-[#222222]">Verified Locals</span>
            <span className="text-[11px] text-[#717171]">నమ్మకమైన కార్మికులు</span>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 mt-8 max-w-lg mx-auto">
        <div className="flex items-baseline justify-between mb-3 px-1">
          <div>
            <h2 className="text-lg font-bold text-[#222222]">Explore Services</h2>
            <p className="text-xs text-[#717171]">వర్గాలను బ్రౌజ్ చేయండి</p>
          </div>
          <span className="text-xs font-semibold text-[#FF385C] bg-[#FFF1F3] px-2.5 py-1 rounded-full border border-[#FFCCD5]">
            {categories.length} Categories
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link
              href={`/category/${cat.slug}`}
              key={cat.slug}
              className="bg-white border border-[#EBEBEB] hover:border-[#FF385C]/40 p-4 rounded-2xl flex flex-col items-center text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-95 transition-all group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <div className="font-semibold text-[#222222] group-hover:text-[#FF385C] text-sm leading-tight transition-colors">
                {cat.nameEnglish}
              </div>
              <div className="text-xs text-[#717171] mt-1 line-clamp-1">
                {cat.nameTelugu}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action for Workers (Airbnb Host Style) */}
      <div className="px-4 mt-10 max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-[#FFF1F3] via-white to-[#FFF5F6] border border-[#FFCCD5] p-6 rounded-2xl text-center shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 bg-[#FF385C]/10 text-[#FF385C] px-3 py-1 rounded-full text-xs font-bold mb-3">
            ✨ Free Worker Listing
          </div>
          <h3 className="text-lg font-bold text-[#222222] mb-1">
            Are you a skilled worker?
          </h3>
          <p className="text-sm font-medium text-[#717171] mb-2">
            మీరు నైపుణ్యం కలిగిన కార్మికులా?
          </p>
          <p className="text-xs text-[#484848] mb-5 leading-relaxed max-w-xs mx-auto">
            Create your free profile today. Let local customers call or WhatsApp you directly with zero commission.
          </p>
          <Link
            href="/register"
            className="inline-block w-full bg-[#222222] hover:bg-black text-white py-3.5 rounded-full font-semibold text-sm shadow-md active:scale-95 transition-all"
          >
            Register as Worker — 100% Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-[#717171] px-4 max-w-lg mx-auto">
        <p className="font-medium text-[#484848]">Work Adda • Sircilla</p>
        <p className="text-[11px] text-[#B0B0B0] mt-1">Connecting community with local craft and skill.</p>
      </div>
    </main>
  );
}
