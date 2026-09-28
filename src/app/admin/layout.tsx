import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Sircilla Admin</h2>
          <p className="text-slate-400 text-sm mt-1">Directory Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition">
            📊 Dashboard
          </Link>
          <Link href="/admin/worker/new" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg font-medium transition">
            ➕ Add Worker
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg font-medium transition">
            📁 Categories
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg font-medium transition mt-8" target="_blank">
            🏠 View Public Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
              🟢 System Online
            </span>
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-300">
              AD
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
