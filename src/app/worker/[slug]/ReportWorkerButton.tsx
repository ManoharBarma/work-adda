"use client";

import { useState, useTransition } from "react";
import { submitWorkerReport } from "@/app/actions/report";

const REPORT_REASONS = [
  { value: "WRONG_PHONE", labelEn: "Wrong or switched-off number", labelTe: "తప్పు లేదా పనిచేయని నంబర్" },
  { value: "NO_LONGER_PROVIDES_SERVICE", labelEn: "No longer provides this service", labelTe: "ఇప్పుడు ఈ పని చేయడం లేదు" },
  { value: "WRONG_PROFESSION", labelEn: "Wrong category / profession", labelTe: "తప్పు వర్గం / వృత్తి" },
  { value: "DUPLICATE_PROFILE", labelEn: "Duplicate profile", labelTe: "డూప్లికేట్ ప్రొఫైల్" },
  { value: "FAKE_PROFILE", labelEn: "Fake or misleading profile", labelTe: "నకిలీ ప్రొఫైల్" },
  { value: "INAPPROPRIATE_CONTENT", labelEn: "Inappropriate content", labelTe: "అనుచితమైన సమాచారం" },
  { value: "OTHER", labelEn: "Other issue", labelTe: "ఇతర సమస్య" },
] as const;

export default function ReportWorkerButton({
  workerId,
  workerName,
}: {
  workerId: string;
  workerName: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("WRONG_PHONE");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitWorkerReport({ workerId, reason, details });
        if (res.success) {
          setSubmitted(true);
        } else {
          setError(res.error || "Could not submit report.");
        }
      } catch {
        setError("An unexpected error occurred.");
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    if (submitted) {
      setSubmitted(false);
      setDetails("");
      setReason("WRONG_PHONE");
    }
  };

  return (
    <>
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#717171] hover:text-[#FF385C] underline underline-offset-4 transition-colors py-1.5 px-3"
        >
          <span>🚩</span>
          <span>Report wrong number or issue • సమస్యను నివేదించండి</span>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[#EBEBEB] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#222222]">
                  Report Profile Issue
                </h3>
                <p className="text-xs text-[#717171] mt-0.5">
                  Reporting <span className="font-semibold text-[#222222]">{workerName}</span> • ప్రొఫైల్ సమస్య
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full border border-[#EBEBEB] flex items-center justify-center text-[#717171] hover:text-[#222222] hover:bg-[#F7F7F7]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#008A05] border border-[#A7F3D0] flex items-center justify-center text-xl mx-auto">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-[#222222]">
                  Thank you! Report submitted.
                </h4>
                <p className="text-xs text-[#717171] leading-relaxed">
                  Our local team will verify and update this profile shortly. (మీ నివేదికకు ధన్యవాదాలు.)
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full bg-[#222222] hover:bg-black text-white py-2.5 rounded-full text-xs font-semibold transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-[#FFF1F3] text-[#FF385C] border border-[#FFCCD5] rounded-xl p-3 text-xs font-semibold">
                    ⚠️ {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#222222]">
                    What is the issue? <span className="text-[#FF385C]">*</span>
                  </label>
                  {REPORT_REASONS.map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        reason === item.value
                          ? "border-[#FF385C] bg-[#FFF1F3]/50"
                          : "border-[#EBEBEB] hover:border-[#222222]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={item.value}
                        checked={reason === item.value}
                        onChange={() => setReason(item.value)}
                        className="mt-0.5 accent-[#FF385C]"
                      />
                      <div>
                        <span className="block text-xs font-semibold text-[#222222]">
                          {item.labelEn}
                        </span>
                        <span className="block text-[11px] text-[#717171]">
                          {item.labelTe}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#222222] mb-1">
                    Additional Details <span className="font-normal text-[#717171]">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    maxLength={500}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Share any helpful details..."
                    className="w-full border border-[#EBEBEB] rounded-xl px-3.5 py-2.5 text-xs text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] resize-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] py-2.5 rounded-full text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-[#FF385C] hover:bg-[#E00B41] text-white py-2.5 rounded-full text-xs font-semibold shadow transition disabled:opacity-60"
                  >
                    {isPending ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
