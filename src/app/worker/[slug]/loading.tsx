export default function WorkerLoading() {
  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-32">
      {/* Skeleton Header */}
      <div className="bg-white border-b border-[#EBEBEB] px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="text-center space-y-1.5">
            <div className="skeleton h-4 w-28 mx-auto rounded-lg" />
            <div className="skeleton h-3 w-20 mx-auto rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="skeleton w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-5 space-y-4">
        {/* Profile card skeleton */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col items-center gap-3">
            <div className="skeleton w-24 h-24 rounded-full" />
            <div className="skeleton h-5 w-40 rounded-lg" />
            <div className="skeleton h-4 w-28 rounded-lg" />
            <div className="skeleton h-7 w-36 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#EBEBEB]">
            <div className="skeleton h-16 rounded-xl" />
            <div className="skeleton h-16 rounded-xl" />
          </div>
        </div>

        {/* About skeleton */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-2">
          <div className="skeleton h-4 w-24 rounded-lg" />
          <div className="skeleton h-3 w-full rounded-lg" />
          <div className="skeleton h-3 w-5/6 rounded-lg" />
          <div className="skeleton h-3 w-3/4 rounded-lg" />
        </div>

        {/* Skills skeleton */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="skeleton h-4 w-32 rounded-lg mb-3" />
          <div className="flex flex-wrap gap-2">
            {[72, 88, 64, 80, 96].map((w, i) => (
              <div key={i} className="skeleton h-7 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-3">
          <div className="skeleton flex-1 h-12 rounded-full" />
          <div className="skeleton flex-1 h-12 rounded-full" />
        </div>
      </div>
    </main>
  );
}
