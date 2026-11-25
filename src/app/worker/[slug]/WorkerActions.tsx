"use client";

import { useEffect, useState } from "react";

interface WorkerActionsProps {
  workerId: string;
  workerName: string;
  phone: string;
  whatsappPhone?: string | null;
  category: string;
  locality: string;
}

function sendTrackBeacon(workerId: string, type: "VIEW" | "CALL" | "WHATSAPP" | "SHARE") {
  const payload = JSON.stringify({ workerId, type });
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/track", blob);
  } else {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

export function WorkerShareButton({
  workerId,
  workerName,
  category,
  locality,
}: Pick<WorkerActionsProps, "workerId" | "workerName" | "category" | "locality">) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    sendTrackBeacon(workerId, "SHARE");
    const url = window.location.href;
    const text = `${workerName} (${category}) in ${locality} — Work Adda Sircilla`;

    if (navigator.share) {
      try {
        await navigator.share({ title: workerName, text, url });
        return;
      } catch {
        // User cancelled or share failed; fall back to clipboard/WhatsApp
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore clipboard errors
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-10 h-10 rounded-full border border-[#EBEBEB] flex items-center justify-center hover:bg-[#F7F7F7] active:scale-95 transition-all text-[#222222]"
      aria-label="Share worker profile"
      title={copied ? "Link copied!" : "Share profile"}
    >
      {copied ? (
        <svg className="w-5 h-5 text-[#008A05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
    </button>
  );
}

export default function WorkerActions({
  workerId,
  workerName,
  category,
  phone,
  whatsappPhone,
}: Pick<WorkerActionsProps, "workerId" | "workerName" | "category" | "phone" | "whatsappPhone">) {
  useEffect(() => {
    sendTrackBeacon(workerId, "VIEW");
  }, [workerId]);

  const cleanCallPhone = phone.replace(/\D/g, "").slice(-10);
  const cleanWaPhone = (whatsappPhone || phone).replace(/\D/g, "").slice(-10);
  const waMessage = encodeURIComponent(
    `Hi ${workerName}, I found your ${category ? `${category} ` : ""}profile on Work Adda Sircilla. Are you available for work?`
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#EBEBEB] p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
      <div className="max-w-lg mx-auto flex gap-3">
        {/* Call Button */}
        <a
          href={`tel:${cleanCallPhone}`}
          onClick={() => sendTrackBeacon(workerId, "CALL")}
          className="flex-1 bg-[#222222] hover:bg-black active:scale-95 text-white py-3 px-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-md transition-all leading-tight text-center"
        >
          <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <div>
            <span className="text-sm block">Call Now</span>
            <span className="text-[10px] font-normal text-white/70 block">కాల్ చేయండి</span>
          </div>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/91${cleanWaPhone}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendTrackBeacon(workerId, "WHATSAPP")}
          className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] active:scale-95 text-white py-3 px-3 rounded-full font-bold flex items-center justify-center gap-2 shadow-md transition-all leading-tight text-center"
        >
          <svg className="w-5 h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.976L2 22l5.187-1.359a9.922 9.922 0 004.825 1.246h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.67-1.04-5.18-2.926-7.068A9.938 9.938 0 0012.012 2zm0 18.272h-.003a8.28 8.28 0 01-4.225-1.15l-.303-.18-3.14.823.84-3.06-.197-.314A8.3 8.3 0 013.715 11.98c.002-4.577 3.73-8.305 8.306-8.305 2.217 0 4.3.865 5.867 2.434a8.27 8.27 0 012.428 5.875c-.001 4.577-3.729 8.304-8.304 8.304zm4.56-6.223c-.25-.125-1.478-.73-1.706-.814-.23-.084-.396-.125-.563.125-.167.25-.646.814-.792.98-.146.166-.292.188-.542.063-.25-.125-1.055-.39-2.01-1.243-.743-.664-1.245-1.484-1.391-1.734-.146-.25-.015-.386.11-.51.113-.112.25-.292.375-.438.125-.146.167-.25.25-.417.084-.167.042-.313-.021-.438-.063-.125-.563-1.354-.771-1.854-.204-.49-.41-.423-.563-.431-.146-.008-.313-.008-.479-.008a.91.91 0 00-.667.313c-.23.25-.875.854-.875 2.083 0 1.23.896 2.417 1.021 2.583.125.167 1.77 2.7 4.291 3.791.6.258 1.069.412 1.434.528.601.19 1.15.163 1.583.099.486-.073 1.478-.604 1.687-1.188.209-.583.209-1.083.146-1.187-.062-.104-.229-.167-.479-.292z" />
          </svg>
          <div>
            <span className="text-sm block">WhatsApp</span>
            <span className="text-[10px] font-normal text-white/80 block">వాట్సాప్ మెసేజ్</span>
          </div>
        </a>
      </div>
    </div>
  );
}
