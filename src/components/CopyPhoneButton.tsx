"use client";

import { useState } from "react";

export default function CopyPhoneButton({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  const cleanPhone = phone.replace(/\D/g, "").slice(-10);
  const formattedPhone =
    cleanPhone.length === 10
      ? `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
      : phone;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cleanPhone);
      } else {
        const el = document.createElement("textarea");
        el.value = cleanPhone;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure silently
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy phone number ${formattedPhone}`}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
        copied
          ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#008A05]"
          : "bg-[#F7F7F7] border-[#EBEBEB] text-[#222222] hover:border-[#222222]"
      }`}
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>Copied • కాపీ అయింది</span>
        </>
      ) : (
        <>
          <span>📞</span>
          <span>{formattedPhone}</span>
          <span className="text-[10px] text-[#717171] font-normal">• Tap to copy</span>
        </>
      )}
    </button>
  );
}
