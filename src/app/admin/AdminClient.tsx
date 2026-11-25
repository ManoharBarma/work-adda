"use client";

import { useTransition, useState, useMemo } from "react";
import { approveWorker, rejectWorker, deleteWorker } from "@/app/actions/worker";
import { generateWorkerEditLink } from "@/app/actions/workerPortal";
import Link from "next/link";

export default function AdminClient({ initialWorkers, metrics }: { initialWorkers: any[], metrics: any }) {
  const [workers, setWorkers] = useState(initialWorkers);
  const [activeCount, setActiveCount] = useState(metrics.active);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Magic Edit Link Modal State
  const [editLinkModal, setEditLinkModal] = useState<{
    workerName: string;
    phone: string;
    url: string;
  } | null>(null);
  const [editLinkClosing, setEditLinkClosing] = useState(false);

  const closeEditLinkModal = () => {
    setEditLinkClosing(true);
    setTimeout(() => {
      setEditLinkModal(null);
      setEditLinkClosing(false);
    }, 180);
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleApprove = (id: string, name: string) => {
    startTransition(async () => {
      await approveWorker(id);
      setWorkers((prev: any[]) => prev.map(w => w.id === id ? { ...w, status: "APPROVED", mobileVerified: true } : w));
      setActiveCount((prev: number) => prev + 1);
      showMessage(`✅ Approved ${name}!`);
    });
  };

  const handleReject = (id: string, name: string) => {
    const wasApproved = workers.find(w => w.id === id)?.status === "APPROVED";
    startTransition(async () => {
      await rejectWorker(id);
      setWorkers((prev: any[]) => prev.map(w => w.id === id ? { ...w, status: "REJECTED" } : w));
      if (wasApproved) {
        setActiveCount((prev: number) => Math.max(0, prev - 1));
      }
      showMessage(`❌ Rejected ${name}.`);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}?`)) return;
    const wasApproved = workers.find(w => w.id === id)?.status === "APPROVED";
    startTransition(async () => {
      await deleteWorker(id);
      setWorkers((prev: any[]) => prev.filter(w => w.id !== id));
      if (wasApproved) {
        setActiveCount((prev: number) => Math.max(0, prev - 1));
      }
      showMessage(`🗑️ Deleted ${name}.`);
    });
  };

  const handleGenerateEditLink = (id: string) => {
    startTransition(async () => {
      const res = await generateWorkerEditLink(id);
      if (res.success && res.path) {
        const fullUrl = `${window.location.origin}${res.path}`;
        setEditLinkClosing(false);
        setEditLinkModal({
          workerName: res.workerName || "Worker",
          phone: res.phone || "",
          url: fullUrl,
        });
      } else {
        showMessage(`⚠️ ${res.error || "Could not generate edit link."}`);
      }
    });
  };

  // Derived State
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const matchesSearch = w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        w.phone.includes(searchQuery) ||
        (w.fullNameTelugu && w.fullNameTelugu.includes(searchQuery));
      const matchesStatus = statusFilter === "ALL" || w.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [workers, searchQuery, statusFilter]);

  const pendingCount = workers.filter(w => w.status === "PENDING").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {message && (
        <div className="fixed top-20 right-6 bg-[#222222] text-white text-sm px-5 py-3 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.18)] z-50 animate-fade-in flex items-center gap-2 border border-white/10">
          {message}
        </div>
      )}

      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#222222] tracking-tight">Platform Analytics & Directory</h2>
          <p className="text-xs sm:text-sm text-[#717171] mt-0.5">Manage workers, approvals, and monitor consumer interactions</p>
        </div>
        <Link
          href="/admin/worker/new"
          className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] active:bg-[#D7043A] text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-[0_2px_8px_rgba(255,56,92,0.25)] transition active:scale-95 shrink-0"
        >
          <span>➕</span> Add New Worker
        </Link>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Workers */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">Active Workers</span>
            <div className="w-8 h-8 rounded-full bg-[#FFF1F3] text-[#FF385C] flex items-center justify-center text-sm font-bold">
              👥
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#222222] mt-3 tracking-tight">{activeCount}</p>
          <p className="text-xs text-[#008A05] font-medium mt-1">Live in search results</p>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">Pending Review</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
              ⏳
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-3 tracking-tight">{pendingCount}</p>
          <p className="text-xs text-[#717171] font-medium mt-1">Awaiting verification</p>
        </div>

        {/* Profile Views */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">Profile Views</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
              👀
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#222222] mt-3 tracking-tight">{metrics.views || 0}</p>
          <div className="flex items-center gap-2 text-xs text-[#717171] mt-1">
            <span>24h: <strong>{metrics.timeStats?.views?.d1 || 0}</strong></span>
            <span>•</span>
            <span>7d: <strong>{metrics.timeStats?.views?.d7 || 0}</strong></span>
          </div>
        </div>

        {/* Direct Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#717171]">Direct Calls & WA</span>
            <div className="w-8 h-8 rounded-full bg-[#E8FBF0] text-[#25D366] flex items-center justify-center text-sm font-bold">
              💬
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#25D366] mt-3 tracking-tight">
            {(metrics.calls || 0) + (metrics.clicks || 0)}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#717171] mt-1">
            <span>Calls: <strong>{metrics.calls || 0}</strong></span>
            <span>•</span>
            <span>WA: <strong>{metrics.clicks || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Directory Management Table */}
      <div className="space-y-4">
        {/* Filters Header Pill */}
        <div className="bg-white p-4 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Pill Search */}
            <div className="relative flex-1 md:w-72">
              <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[#717171]">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search name, Telugu, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F7F7] border border-[#EBEBEB] rounded-full pl-9 pr-4 py-2 text-sm text-[#222222] placeholder:text-[#B0B0B0] focus:outline-none focus:bg-white focus:border-[#222222] transition"
              />
            </div>

            {/* Status Dropdown Pill */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F7F7F7] border border-[#EBEBEB] rounded-full px-4 py-2 text-sm font-medium text-[#484848] focus:outline-none focus:bg-white focus:border-[#222222] transition cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved Only</option>
              <option value="PENDING">Pending Only</option>
              <option value="INACTIVE">Paused (Inactive)</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="text-xs text-[#717171] font-medium self-end md:self-center">
            Showing <strong className="text-[#222222]">{filteredWorkers.length}</strong> of {workers.length} workers
          </div>
        </div>

        {/* Master Table Container */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#EBEBEB] bg-[#FAFAFA] text-xs font-semibold text-[#717171] uppercase tracking-wider">
                  <th className="px-5 py-3.5">Worker Profile</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Trade & Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Views</th>
                  <th className="px-5 py-3.5 text-center">Interactions</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB] text-sm">
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-[#717171]">
                      <div className="text-2xl mb-2">🔍</div>
                      <p className="font-medium text-sm">No workers found matching your query.</p>
                      <button
                        onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
                        className="mt-3 text-xs text-[#FF385C] font-semibold hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-[#FAFAFA] transition">
                      {/* Name & Photo */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F7F7F7] border border-[#EBEBEB] flex items-center justify-center font-bold text-[#FF385C] text-sm shrink-0 overflow-hidden shadow-inner">
                            {worker.profilePhotoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={worker.profilePhotoUrl} alt={worker.fullName} className="w-full h-full object-cover" />
                            ) : (
                              worker.fullName?.charAt(0) || "W"
                            )}
                          </div>
                          <div>
                            <Link href={`/worker/${worker.slug}`} target="_blank" className="font-bold text-[#222222] hover:text-[#FF385C] transition flex items-center gap-1.5">
                              <span>{worker.fullName}</span>
                              <span className="text-[10px] text-[#B0B0B0]">↗</span>
                            </Link>
                            {worker.fullNameTelugu && (
                              <p className="text-xs text-[#717171]">{worker.fullNameTelugu}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-[#484848] bg-[#F7F7F7] px-2.5 py-1 rounded-full border border-[#EBEBEB]">
                          {worker.phone}
                        </span>
                      </td>

                      {/* Trade & Locality */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-[#222222] text-xs">
                            {worker.categories?.map((c: any) => c.nameEnglish).join(", ") || "General"}
                          </span>
                          <span className="text-[11px] text-[#717171]">
                            📍 {worker.locality?.nameEnglish || "Sircilla"}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          worker.status === 'APPROVED' ? 'bg-[#ECFDF5] text-[#008A05] border border-[#A7F3D0]' :
                          worker.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          worker.status === 'INACTIVE' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            worker.status === 'APPROVED' ? 'bg-[#008A05]' :
                            worker.status === 'PENDING' ? 'bg-amber-500' :
                            worker.status === 'INACTIVE' ? 'bg-slate-500' : 'bg-red-500'
                          }`} />
                          {worker.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-5 py-4 text-center font-semibold text-[#484848] text-xs">
                        {worker.profileViews || 0}
                      </td>

                      {/* Interactions */}
                      <td className="px-5 py-4 text-center text-xs">
                        <div className="inline-flex items-center gap-2 bg-[#F7F7F7] px-2.5 py-1 rounded-full border border-[#EBEBEB]">
                          <span className="text-blue-600 font-semibold" title="Phone Calls">📞 {worker.callClicks || 0}</span>
                          <span className="text-[#B0B0B0]">|</span>
                          <span className="text-[#25D366] font-semibold" title="WhatsApp Clicks">💬 {worker.whatsappClicks || 0}</span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right space-x-1.5">
                        {worker.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(worker.id, worker.fullName)}
                              disabled={isPending}
                              className="bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#008A05] px-3 py-1.5 rounded-full text-xs font-bold transition disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(worker.id, worker.fullName)}
                              disabled={isPending}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {worker.status === 'APPROVED' && (
                          <button
                            onClick={() => handleReject(worker.id, worker.fullName)}
                            disabled={isPending}
                            className="bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#717171] px-3 py-1.5 rounded-full text-xs font-semibold transition disabled:opacity-50"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleGenerateEditLink(worker.id)}
                          disabled={isPending}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-semibold transition disabled:opacity-50"
                          title="Generate 7-day self-edit link"
                        >
                          Edit Link
                        </button>
                        <Link
                          href={`/admin/worker/${worker.id}/edit`}
                          className="inline-block bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] border border-[#EBEBEB] px-3 py-1.5 rounded-full text-xs font-semibold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(worker.id, worker.fullName)}
                          disabled={isPending}
                          className="bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-100 px-3 py-1.5 rounded-full text-xs font-semibold transition disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Magic Edit Link Modal */}
      {editLinkModal && (
        <div
          className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 ${
            editLinkClosing ? "animate-backdrop-out" : "animate-backdrop-in"
          }`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeEditLinkModal();
          }}
        >
          <div
            className={`bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#EBEBEB] space-y-4 ${
              editLinkClosing ? "animate-modal-out" : "animate-modal-in"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#222222]">
                  1-Tap Worker Edit Link
                </h3>
                <p className="text-xs text-[#717171] mt-0.5">
                  For <span className="font-semibold text-[#222222]">{editLinkModal.workerName}</span> • Valid for 7 days
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditLinkModal}
                className="w-8 h-8 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#717171] hover:text-[#222222] transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              readOnly
              value={editLinkModal.url}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full bg-[#F7F7F7] border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#484848] focus:outline-none"
            />

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(editLinkModal.url);
                    showMessage("✅ Edit link copied to clipboard!");
                  } catch {
                    showMessage("⚠️ Select and copy the link manually.");
                  }
                }}
                className="flex-1 bg-[#222222] hover:bg-black text-white py-2.5 rounded-full text-xs font-semibold transition"
              >
                Copy Link
              </button>
              <a
                href={`https://wa.me/91${editLinkModal.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(
                  `Hi ${editLinkModal.workerName}, tap this link to update your Work Adda Sircilla profile, photos, or availability (valid 7 days): ${editLinkModal.url}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2.5 rounded-full text-xs font-semibold text-center transition"
              >
                Send on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
