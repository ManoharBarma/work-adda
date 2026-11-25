import Link from "next/link";

export interface WorkerCardData {
  id: string;
  slug: string;
  fullName: string;
  fullNameTelugu?: string | null;
  mobileVerified: boolean;
  experienceYears: number;
  locality?: {
    nameEnglish: string;
    nameTelugu: string;
  } | null;
  categories?: {
    nameEnglish: string;
  }[];
}

interface WorkerCardProps {
  worker: WorkerCardData;
  showCategories?: boolean;
}

export default function WorkerCard({ worker, showCategories = false }: WorkerCardProps) {
  return (
    <Link href={`/worker/${worker.slug}`} className="block group">
      <div className="bg-white border border-[#EBEBEB] hover:border-[#FF385C]/40 p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-[0.99] transition-all flex items-start gap-3.5">
        {/* Worker Avatar */}
        <div className="w-14 h-14 bg-gradient-to-br from-[#FFF1F3] to-[#FFE4E8] text-[#FF385C] rounded-full flex items-center justify-center font-bold text-xl shrink-0 border border-[#FFCCD5] shadow-xs">
          {worker.fullName.charAt(0).toUpperCase()}
        </div>

        {/* Worker Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-1">
            <h3 className="text-base font-bold text-[#222222] group-hover:text-[#FF385C] transition-colors truncate">
              {worker.fullName}
              {worker.fullNameTelugu && (
                <span className="text-xs font-normal text-[#717171] block truncate mt-0.5">
                  {worker.fullNameTelugu}
                </span>
              )}
            </h3>

            {worker.mobileVerified && (
              <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#008A05] text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#A7F3D0] shrink-0">
                <svg className="w-3 h-3 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            )}
          </div>

          {showCategories && worker.categories && worker.categories.length > 0 && (
            <p className="text-xs font-semibold text-[#FF385C] mt-1 truncate">
              {worker.categories.map((c) => c.nameEnglish).join(", ")}
            </p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-[#484848]">
            <span className="font-semibold text-[#222222] bg-[#F7F7F7] px-2 py-0.5 rounded-md border border-[#EBEBEB]">
              {worker.experienceYears} Years Exp
            </span>
            <span className="text-[11px] text-[#717171]">
              ({worker.experienceYears} సం. అనుభవం)
            </span>
          </div>

          {worker.locality && (
            <p className="text-xs text-[#717171] flex items-center gap-1 mt-2">
              <svg className="w-3.5 h-3.5 text-[#FF385C] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">
                {worker.locality.nameEnglish} ({worker.locality.nameTelugu})
              </span>
            </p>
          )}
        </div>

        {/* Right Arrow */}
        <div className="self-center text-[#B0B0B0] group-hover:text-[#FF385C] transition-colors shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
