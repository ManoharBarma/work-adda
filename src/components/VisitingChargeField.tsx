"use client";

import { useState } from "react";

const QUICK_RATES = [
  "₹150 visit",
  "₹200 visit",
  "₹300 visit",
  "₹500/day",
  "₹800/day",
];

export default function VisitingChargeField({
  name = "visitingCharge",
  initialValue = "",
}: {
  name?: string;
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div>
      <label className="block text-xs font-bold text-[#222222] mb-1.5">
        Starting Rate / Visiting Charge (ప్రారంభ ఛార్జీ){" "}
        <span className="text-xs font-normal text-[#717171]">(Optional)</span>
      </label>
      <input
        name={name}
        type="text"
        maxLength={50}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ex: ₹200 visit or ₹600/day"
        className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] bg-white transition-all"
      />
      <div className="flex flex-wrap gap-1.5 mt-2">
        {QUICK_RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            onClick={() => setValue(rate)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition ${
              value === rate
                ? "bg-[#222222] text-white border-[#222222]"
                : "bg-[#F7F7F7] text-[#484848] border-[#EBEBEB] hover:border-[#222222]"
            }`}
          >
            {rate}
          </button>
        ))}
      </div>
    </div>
  );
}
