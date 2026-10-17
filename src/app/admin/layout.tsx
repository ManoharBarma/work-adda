import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col md:flex-row font-sans text-[#222222]">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-[#EBEBEB] flex flex-col hidden md:flex shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#EBEBEB] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFF1F3] border border-[#FFD2D9] flex items-center justify-center text-lg font-bold text-[#FF385C] shadow-sm">
            WA
          </div>
          <div>
            <h2 className="text-base font-bold text-[#222222] tracking-tight">Work Adda Admin</h2>
            <p className="text-xs text-[#717171]">Sircilla Directory Control</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#717171]">
            Overview & Management
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl text-[#222222] hover:bg-[#F7F7F7] transition active:scale-[0.98]"
          >
            <span className="w-8 h-8 rounded-lg bg-[#FFF1F3] text-[#FF385C] flex items-center justify-center text-sm">
              📊
            </span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/worker/new"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl text-[#222222] hover:bg-[#F7F7F7] transition active:scale-[0.98]"
          >
            <span className="w-8 h-8 rounded-lg bg-[#F7F7F7] text-[#222222] flex items-center justify-center text-sm border border-[#EBEBEB]">
              ➕
            </span>
            <span>Add Worker</span>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl text-[#222222] hover:bg-[#F7F7F7] transition active:scale-[0.98]"
          >
            <span className="w-8 h-8 rounded-lg bg-[#F7F7F7] text-[#222222] flex items-center justify-center text-sm border border-[#EBEBEB]">
              📁
            </span>
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/localities"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl text-[#222222] hover:bg-[#F7F7F7] transition active:scale-[0.98]"
          >
            <span className="w-8 h-8 rounded-lg bg-[#F7F7F7] text-[#222222] flex items-center justify-center text-sm border border-[#EBEBEB]">
              📍
            </span>
            <span>Localities</span>
          </Link>

          <div className="pt-4 border-t border-[#EBEBEB] my-2"></div>

          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7] transition"
            target="_blank"
          >
            <span className="w-8 h-8 rounded-lg bg-[#F7F7F7] flex items-center justify-center text-sm border border-[#EBEBEB]">
              🏠
            </span>
            <span>View Public Site</span>
            <span className="ml-auto text-xs text-[#B0B0B0]">↗</span>
          </Link>
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-[#EBEBEB] bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FF385C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#222222] truncate">Administrator</p>
              <p className="text-[11px] text-[#717171] truncate">admin@workadda.local</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-[#EBEBEB] px-4 py-3 sticky top-0 z-20 flex justify-between items-center shadow-sm">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FFF1F3] border border-[#FFD2D9] flex items-center justify-center text-xs font-bold text-[#FF385C]">
            WA
          </div>
          <span className="font-bold text-sm text-[#222222]">Admin Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="text-xs bg-[#F7F7F7] border border-[#EBEBEB] text-[#484848] px-2.5 py-1.5 rounded-full font-medium"
          >
            Public Site ↗
          </Link>
        </div>
      </header>

      {/* Mobile Horizontal Navigation Tabs */}
      <div className="md:hidden bg-white border-b border-[#EBEBEB] px-3 py-2 flex items-center gap-2 overflow-x-auto hide-scrollbar sticky top-[53px] z-10 text-xs">
        <Link href="/admin" className="px-3 py-1.5 rounded-full bg-[#FFF1F3] text-[#FF385C] font-semibold shrink-0">
          📊 Dashboard
        </Link>
        <Link href="/admin/worker/new" className="px-3 py-1.5 rounded-full bg-[#F7F7F7] text-[#484848] font-medium shrink-0">
          ➕ Add Worker
        </Link>
        <Link href="/admin/categories" className="px-3 py-1.5 rounded-full bg-[#F7F7F7] text-[#484848] font-medium shrink-0">
          📁 Categories
        </Link>
        <Link href="/admin/localities" className="px-3 py-1.5 rounded-full bg-[#F7F7F7] text-[#484848] font-medium shrink-0">
          📍 Localities
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-auto md:h-screen overflow-y-auto">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex bg-white/80 backdrop-blur-md border-b border-[#EBEBEB] px-8 py-4 justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-[#222222]">Management Console</h1>
            <p className="text-xs text-[#717171]">Overview of workers, activity, and platform metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#ECFDF5] text-[#008A05] px-3 py-1 rounded-full text-xs font-semibold border border-[#A7F3D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008A05] animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
