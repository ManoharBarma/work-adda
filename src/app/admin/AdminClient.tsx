"use client";

import { useTransition, useState, useMemo } from "react";
import { approveWorker, rejectWorker, deleteWorker } from "@/app/actions/worker";

export default function AdminClient({ initialWorkers, metrics }: { initialWorkers: any[], metrics: any }) {
  const [workers, setWorkers] = useState(initialWorkers);
  const [activeCount, setActiveCount] = useState(metrics.active);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleApprove = (id: string, name: string) => {
    startTransition(async () => {
      await approveWorker(id);
      setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: "APPROVED", mobileVerified: true } : w));
      setActiveCount(prev => prev + 1);
      showMessage(`✅ Approved ${name}!`);
    });
  };

  const handleReject = (id: string, name: string) => {
    startTransition(async () => {
      await rejectWorker(id);
      setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: "REJECTED" } : w));
      showMessage(`❌ Rejected ${name}.`);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}?`)) return;
    startTransition(async () => {
      await deleteWorker(id);
      setWorkers(prev => prev.filter(w => w.id !== id));
      showMessage(`🗑️ Deleted ${name}.`);
    });
  };

  // Derived State
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const matchesSearch = w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || w.phone.includes(searchQuery);
      const matchesStatus = statusFilter === "ALL" || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [workers, searchQuery, statusFilter]);

  return (
    <div className="p-8 relative">
      {message && (
        <div className="fixed top-20 right-8 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
          {message}
        </div>
      )}

      {/* Metrics Header */}
      <h2 className="text-xl font-bold text-slate-800 mb-4">Platform Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="text-slate-500 font-semibold mb-1">Total Workers (Active)</h3>
            <p className="text-4xl font-bold text-slate-800">{activeCount}</p>
          </div>
          <div className="text-right">
            <h3 className="text-slate-500 font-semibold mb-1">Total Pending</h3>
            <p className="text-4xl font-bold text-orange-600">{workers.filter(w => w.status === "PENDING").length}</p>
          </div>
        </div>
      </div>

      {/* Time-Based Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Views */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-semibold mb-4 flex items-center gap-2">👀 Profile Views</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 24 Hours</span><span className="font-bold text-slate-800">{metrics.timeStats?.views?.d1 || 0}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 7 Days</span><span className="font-bold text-slate-800">{metrics.timeStats?.views?.d7 || 0}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 30 Days</span><span className="font-bold text-slate-800">{metrics.timeStats?.views?.d30 || 0}</span></div>
          </div>
        </div>
        
        {/* Calls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-semibold mb-4 flex items-center gap-2">📞 Direct Calls <span className="text-xs font-normal text-slate-400">({metrics.calls} total)</span></h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 24 Hours</span><span className="font-bold text-blue-600">{metrics.timeStats?.calls?.d1 || 0}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 7 Days</span><span className="font-bold text-blue-600">{metrics.timeStats?.calls?.d7 || 0}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 30 Days</span><span className="font-bold text-blue-600">{metrics.timeStats?.calls?.d30 || 0}</span></div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-semibold mb-4 flex items-center gap-2">🟢 WhatsApp Clicks <span className="text-xs font-normal text-slate-400">({metrics.clicks} total)</span></h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 24 Hours</span><span className="font-bold text-green-600">{metrics.timeStats?.whatsapp?.d1 || 0}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 7 Days</span><span className="font-bold text-green-600">{metrics.timeStats?.whatsapp?.d7 || 0}</span></div>
            <div className="flex justify-between items-center"><span className="text-sm text-slate-500">Last 30 Days</span><span className="font-bold text-green-600">{metrics.timeStats?.whatsapp?.d30 || 0}</span></div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Worker Directory</h2>
      {/* Filters */}
      <div className="bg-white p-4 rounded-t-2xl shadow-sm border border-slate-200 border-b-0 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search name or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-slate-700 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Showing {filteredWorkers.length} workers
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Phone</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Locality</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Views</th>
              <th className="px-6 py-4 font-semibold text-center">Interactions (📞/🟢)</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredWorkers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                  No workers found matching your filters.
                </td>
              </tr>
            ) : (
              filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50 transition text-sm">
                  <td className="px-6 py-4 font-bold text-slate-800">{worker.fullName}</td>
                  <td className="px-6 py-4 text-slate-600">{worker.phone}</td>
                  <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={worker.categories?.map((c: any) => c.nameEnglish).join(", ")}>
                    {worker.categories?.map((c: any) => c.nameEnglish).join(", ")}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{worker.locality?.nameEnglish}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      worker.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                      worker.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-600">{worker.profileViews}</td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    <span className="text-blue-600 font-bold">{worker.callClicks}</span> / <span className="text-green-600 font-bold">{worker.whatsappClicks}</span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {worker.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleApprove(worker.id, worker.fullName)} disabled={isPending} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-200 transition disabled:opacity-50">Approve</button>
                        <button onClick={() => handleReject(worker.id, worker.fullName)} disabled={isPending} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold hover:bg-red-100 transition disabled:opacity-50">Reject</button>
                      </>
                    )}
                    {worker.status === 'APPROVED' && (
                      <button onClick={() => handleReject(worker.id, worker.fullName)} disabled={isPending} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 transition disabled:opacity-50">Revoke</button>
                    )}
                    <a href={`/admin/worker/${worker.id}/edit`} className="inline-block bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition">
                      Edit
                    </a>
                    <button onClick={() => handleDelete(worker.id, worker.fullName)} disabled={isPending} className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold shadow hover:bg-red-700 transition disabled:opacity-50">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
