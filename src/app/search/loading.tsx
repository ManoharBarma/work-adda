export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-[#F7F7F7] pb-16">
      {/* Skeleton Header */}
      <div className="bg-white border-b border-[#EBEBEB] px-4 py-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <div className="skeleton h-4 w-28 rounded-lg" />
              <div className="skeleton h-3 w-20 rounded-lg" />
            </div>
          </div>
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        {/* Skeleton Inline Search Bar */}
        <div className="skeleton h-11 w-full rounded-full mb-4" />

        {/* Skeleton Worker Cards */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#EBEBEB] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start gap-3">
                <div className="skeleton w-14 h-14 rounded-full shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="skeleton h-4 w-3/4 rounded-lg" />
                  <div className="skeleton h-3 w-1/2 rounded-lg" />
                  <div className="flex gap-2 mt-2">
                    <div className="skeleton h-6 w-20 rounded-full" />
                    <div className="skeleton h-6 w-16 rounded-full" />
                  </div>
                </div>
                <div className="skeleton w-9 h-9 rounded-full shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
