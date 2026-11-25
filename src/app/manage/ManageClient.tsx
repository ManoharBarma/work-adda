"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  logoutWorker,
  requestWorkerOtp,
  toggleOwnVisibility,
  updateOwnWorkerProfile,
  verifyWorkerOtp,
} from "@/app/actions/workerPortal";
import {
  ALL_SIRCILLA_NAME_EN,
  ALL_SIRCILLA_NAME_TE,
  ALL_SIRCILLA_SENTINEL,
  isAllSircillaLocality,
} from "@/lib/locality";
import { parseWorkerBio } from "@/lib/workerBio";
import { ProfilePhotoField, WorkPhotosField } from "@/components/ImageUpload";
import VisitingChargeField from "@/components/VisitingChargeField";

interface ManageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialWorker: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localities: any[];
}

export default function ManageClient({ initialWorker, localities }: ManageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // OTP Login state
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard state
  const [worker, setWorker] = useState(initialWorker);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setWorker(initialWorker);
  }, [initialWorker]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setDevOtpHint(null);
    startTransition(async () => {
      const res = await requestWorkerOtp(phone);
      if (res.success) {
        if (res.devOtp) setDevOtpHint(res.devOtp);
        setStep("OTP");
      } else {
        setAuthError(res.error || "Could not send OTP.");
      }
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    startTransition(async () => {
      const res = await verifyWorkerOtp(phone, otp);
      if (res.success) {
        router.refresh();
      } else {
        setAuthError(res.error || "Invalid OTP.");
      }
    });
  };

  const handleSaveProfile = (formData: FormData) => {
    setSaveMessage(null);
    setSaveError(null);
    startTransition(async () => {
      const res = await updateOwnWorkerProfile(formData);
      if (res.success) {
        setSaveMessage("✅ Profile updated successfully! (ప్రొఫైల్ అప్‌డేట్ చేయబడింది)");
        router.refresh();
      } else {
        setSaveError(res.error || "Could not save changes.");
      }
    });
  };

  const handleToggleVisibility = () => {
    setSaveMessage(null);
    setSaveError(null);
    startTransition(async () => {
      const res = await toggleOwnVisibility();
      if (res.success && res.status) {
        setWorker((prev: typeof worker) => (prev ? { ...prev, status: res.status } : prev));
        setSaveMessage(
          res.status === "APPROVED"
            ? "✅ Your profile is now live to customers!"
            : "⏸️ Your profile is paused and hidden from search."
        );
      } else {
        setSaveError(res.error || "Could not update visibility.");
      }
    });
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutWorker();
      setWorker(null);
      setStep("PHONE");
      setOtp("");
      router.refresh();
    });
  };

  if (!worker) {
    return (
      <div className="max-w-md mx-auto px-4 mt-8">
        <div className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 bg-[#FFF1F3] text-[#FF385C] rounded-full flex items-center justify-center text-2xl mx-auto mb-3 border border-[#FFCCD5]">
              🔐
            </div>
            <h2 className="text-lg font-bold text-[#222222]">
              Manage Your Worker Profile
            </h2>
            <p className="text-xs text-[#717171] mt-1">
              మీ ప్రొఫైల్‌ను మార్చడానికి మొబైల్ నంబర్‌తో లాగిన్ అవ్వండి
            </p>
          </div>

          {authError && (
            <div className="bg-[#FFF1F3] text-[#FF385C] border border-[#FFCCD5] rounded-xl p-3 text-xs font-semibold">
              ⚠️ {authError}
            </div>
          )}

          {devOtpHint && (
            <div className="bg-[#ECFDF5] text-[#008A05] border border-[#A7F3D0] rounded-xl p-3 text-xs font-semibold">
              Dev Mode OTP: <span className="font-mono font-bold">{devOtpHint}</span>
            </div>
          )}

          {step === "PHONE" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1.5">
                  Registered Mobile Number (నమోదైన మొబైల్ నంబర్)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs font-bold text-[#717171]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="^[789]\d{9}$"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full border border-[#EBEBEB] rounded-xl pl-12 pr-4 py-3 text-sm text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3.5 rounded-full font-bold text-sm shadow transition active:scale-95 disabled:opacity-60"
              >
                {isPending ? "Sending OTP..." : "Send OTP (ఓటీపీ పంపండి)"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1.5">
                  Enter 6-Digit OTP sent to +91 {phone}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  pattern="^\d{6}$"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#222222] hover:bg-black text-white py-3.5 rounded-full font-bold text-sm shadow transition active:scale-95 disabled:opacity-60"
              >
                {isPending ? "Verifying..." : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("PHONE");
                  setOtp("");
                  setAuthError(null);
                }}
                className="w-full text-xs font-semibold text-[#717171] hover:text-[#222222] py-1"
              >
                ← Change mobile number
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-[#EBEBEB] text-center text-xs text-[#717171]">
            New to Work Adda?{" "}
            <Link href="/register" className="font-bold text-[#FF385C] hover:underline">
              Register Free →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { visitingCharge, cleanBio } = parseWorkerBio(worker.bio);
  const canToggleVisibility = worker.status === "APPROVED" || worker.status === "INACTIVE";

  return (
    <div className="max-w-lg mx-auto px-4 mt-5 space-y-4">
      {/* Status & Visibility Banner */}
      <div className="bg-white border border-[#EBEBEB] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs text-[#717171] block">Logged in as +91 {worker.phone}</span>
            <h2 className="text-lg font-bold text-[#222222]">{worker.fullName}</h2>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="text-xs font-semibold text-[#717171] hover:text-[#222222] border border-[#EBEBEB] px-3 py-1.5 rounded-full"
          >
            Log out
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EBEBEB]">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                worker.status === "APPROVED"
                  ? "bg-[#ECFDF5] text-[#008A05] border-[#A7F3D0]"
                  : worker.status === "INACTIVE"
                  ? "bg-slate-100 text-slate-700 border-slate-200"
                  : worker.status === "PENDING"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {worker.status === "APPROVED"
                ? "🟢 Live & Visible"
                : worker.status === "INACTIVE"
                ? "⏸️ Paused (Hidden)"
                : worker.status === "PENDING"
                ? "🟡 Under Review"
                : `🔴 ${worker.status}`}
            </span>

            {worker.status === "APPROVED" && (
              <Link
                href={`/worker/${worker.slug}`}
                className="text-xs font-semibold text-[#FF385C] hover:underline"
              >
                View Public Profile ↗
              </Link>
            )}
          </div>

          {canToggleVisibility && (
            <button
              type="button"
              onClick={handleToggleVisibility}
              disabled={isPending}
              className="px-4 py-1.5 rounded-full text-xs font-semibold border border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white transition disabled:opacity-60"
            >
              {worker.status === "APPROVED" ? "Pause Profile" : "Resume Profile"}
            </button>
          )}
        </div>

        {worker.status === "REJECTED" && worker.rejectionReason && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
            Reason: {worker.rejectionReason}
          </p>
        )}

        {/* Quick Analytics */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-[#F7F7F7] rounded-xl p-2.5 text-center border border-[#EBEBEB]">
            <span className="text-base font-extrabold text-[#222222] block">
              {worker.profileViews || 0}
            </span>
            <span className="text-[11px] text-[#717171]">Views</span>
          </div>
          <div className="bg-[#F7F7F7] rounded-xl p-2.5 text-center border border-[#EBEBEB]">
            <span className="text-base font-extrabold text-[#222222] block">
              {worker.callClicks || 0}
            </span>
            <span className="text-[11px] text-[#717171]">Calls</span>
          </div>
          <div className="bg-[#F7F7F7] rounded-xl p-2.5 text-center border border-[#EBEBEB]">
            <span className="text-base font-extrabold text-[#222222] block">
              {worker.whatsappClicks || 0}
            </span>
            <span className="text-[11px] text-[#717171]">WhatsApp</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form
        action={handleSaveProfile}
        className="bg-white border border-[#EBEBEB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4"
      >
        <h3 className="text-base font-bold text-[#222222]">
          Edit Profile Details (ప్రొఫైల్ మార్చుకోండి)
        </h3>

        {saveMessage && (
          <div className="bg-[#ECFDF5] text-[#008A05] border border-[#A7F3D0] rounded-xl p-3 text-xs font-semibold">
            {saveMessage}
          </div>
        )}
        {saveError && (
          <div className="bg-[#FFF1F3] text-[#FF385C] border border-[#FFCCD5] rounded-xl p-3 text-xs font-semibold">
            ⚠️ {saveError}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#222222] mb-1.5">
            Full Name <span className="text-[#FF385C]">*</span>
          </label>
          <input
            name="fullName"
            type="text"
            required
            defaultValue={worker.fullName}
            className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#222222] mb-1.5">
            Telugu Name (తెలుగులో పేరు)
          </label>
          <input
            name="fullNameTelugu"
            type="text"
            defaultValue={worker.fullNameTelugu || ""}
            className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#222222] mb-1.5">
            WhatsApp Number (వాట్సాప్ నంబర్)
          </label>
          <input
            name="whatsappPhone"
            type="tel"
            pattern="^[789]\d{9}$"
            defaultValue={worker.whatsappPhone || worker.phone}
            className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] font-mono focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#222222] mb-1.5">
            Locality in Sircilla (ప్రాంతం)
          </label>
          <select
            name="locality"
            required
            defaultValue={worker.localityId}
            className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
          >
            {!localities.some(isAllSircillaLocality) && (
              <option value={ALL_SIRCILLA_SENTINEL}>
                🌐 {ALL_SIRCILLA_NAME_EN} ({ALL_SIRCILLA_NAME_TE})
              </option>
            )}
            {localities.map((l) => (
              <option key={l.id} value={l.id}>
                {isAllSircillaLocality(l)
                  ? `🌐 ${l.nameEnglish} (${l.nameTelugu})`
                  : `${l.nameEnglish} (${l.nameTelugu})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#222222] mb-1.5">
            Years of Experience (అనుభవం)
          </label>
          <input
            name="experience"
            type="number"
            min="0"
            defaultValue={worker.experienceYears || 0}
            className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
          />
        </div>

        <VisitingChargeField initialValue={visitingCharge || ""} />

        <div>
          <label className="block text-xs font-bold text-[#222222] mb-1.5">
            About You / Bio (మీ గురించి)
          </label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={cleanBio}
            className="w-full border border-[#EBEBEB] rounded-xl px-4 py-3 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] resize-none"
          />
        </div>

        <ProfilePhotoField initialUrl={worker.profilePhotoUrl} />
        <WorkPhotosField
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialUrls={worker.workPhotos?.map((wp: any) => wp.photoUrl) || []}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white py-3.5 rounded-full font-bold text-sm shadow transition active:scale-95 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes (మార్పులు సేవ్ చేయండి)"}
        </button>
      </form>
    </div>
  );
}
