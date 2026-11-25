"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { setReportResolved } from "@/app/actions/report";

interface ReportItem {
  id: string;
  reason: string;
  details: string | null;
  resolved: boolean;
  createdAt: string;
  worker: {
    id: string;
    fullName: string;
    phone: string;
    slug: string;
    status: string;
  };
}

const REASON_LABELS: Record<string, string> = {
  WRONG_PHONE: "Wrong / Dead Number",
  NO_LONGER_PROVIDES_SERVICE: "No Longer Active",
  WRONG_PROFESSION: "Wrong Category",
  DUPLICATE_PROFILE: "Duplicate Profile",
  FAKE_PROFILE: "Fake Profile",
  INAPPROPRIATE_CONTENT: "Inappropriate Content",
  OTHER: "Other",
};

export default function ReportsClient({ initialReports }: { initialReports: ReportItem[] }) {
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [filter, setFilter] = useState<"OPEN" | "RESOLVED" | "ALL">("OPEN");
  const [isPending, startTransition] = useTransition();

  const handleToggle = (reportId: string, nextResolved: boolean) => {
    startTransition(async () => {
      await setReportResolved(reportId, nextResolved);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, resolved: nextResolved } : r))
      );
    });
  };

  const visibleReports = reports.filter((r) => {
    if (filter === "OPEN") return !r.resolved;
    if (filter === "RESOLVED") return r.resolved;
    return true;
  });

  const openCount = reports.filter((r) => !r.resolved).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#222222] tracking-tight">
            🚩 User Reports Queue
          </h2>
          <p className="text-xs sm:text-sm text-[#717171] mt-0.5">
            {openCount} open {openCount === 1 ? "report" : "reports"} waiting for review
          </p>
        </div>

        <div className="flex gap-2">
          {(["OPEN", "RESOLVED", "ALL"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                filter === tab
                  ? "bg-[#222222] text-white border-[#222222]"
                  : "bg-[#F7F7F7] text-[#484848] border-[#EBEBEB] hover:border-[#222222]"
              }`}
            >
              {tab === "OPEN" ? `Open (${openCount})` : tab === "RESOLVED" ? "Resolved" : "All"}
            </button>
          ))}
        </div>
      </div>

      {visibleReports.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-[#EBEBEB] text-center shadow-sm">
          <p className="text-2xl mb-2">✅</p>
          <h3 className="text-sm font-bold text-[#222222]">No reports in this view</h3>
          <p className="text-xs text-[#717171] mt-1">
            Community reports for outdated numbers or issues will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-5 rounded-2xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFF1F3] text-[#FF385C] border border-[#FFCCD5]">
                    {REASON_LABELS[report.reason] || report.reason}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      report.resolved
                        ? "bg-[#ECFDF5] text-[#008A05] border-[#A7F3D0]"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {report.resolved ? "Resolved" : "Open"}
                  </span>
                  <span className="text-[11px] text-[#717171]">
                    {new Date(report.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="text-sm font-bold text-[#222222]">
                  {report.worker.fullName}{" "}
                  <span className="text-xs font-mono font-normal text-[#717171]">
                    ({report.worker.phone})
                  </span>
                </div>

                {report.details && (
                  <p className="text-xs text-[#484848] bg-[#F7F7F7] px-3 py-2 rounded-xl border border-[#EBEBEB]">
                    &ldquo;{report.details}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/worker/${report.worker.id}/edit`}
                  className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] border border-[#EBEBEB] transition"
                >
                  Edit Worker
                </Link>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggle(report.id, !report.resolved)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition disabled:opacity-60 ${
                    report.resolved
                      ? "bg-[#F7F7F7] text-[#484848] border border-[#EBEBEB] hover:bg-[#EBEBEB]"
                      : "bg-[#222222] hover:bg-black text-white"
                  }`}
                >
                  {report.resolved ? "Reopen" : "Mark Resolved"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
