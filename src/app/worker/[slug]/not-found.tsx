import Link from "next/link";

export default function WorkerNotFound() {
  return (
    <main className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white border border-[#EBEBEB] rounded-3xl p-8 max-w-sm shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <div className="w-16 h-16 bg-[#FFF1F3] text-[#FF385C] rounded-full flex items-center justify-center text-3xl mb-4 mx-auto border border-[#FFCCD5]">
          🔍
        </div>
        <h1 className="text-xl font-bold text-[#222222] mb-1">
          Worker Profile Not Found
        </h1>
        <p className="text-xs text-[#717171] mb-4">
          కార్మికుడి ప్రొఫైల్ కనుగొనబడలేదు
        </p>
        <p className="text-xs text-[#484848] mb-6 leading-relaxed">
          This profile may have been removed or is not yet active. Browse available local workers in Sircilla instead.
        </p>
        <Link
          href="/"
          className="inline-block w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3 rounded-full font-semibold text-xs shadow transition-all active:scale-95"
        >
          Back to Home (హోమ్‌కి వెళ్ళండి)
        </Link>
      </div>
    </main>
  );
}
