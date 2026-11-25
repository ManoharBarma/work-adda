"use client";

import Image from "next/image";
import { useRef, useState } from "react";

async function compressImageFile(
  file: File,
  maxDimension: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("Invalid image file."));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfilePhotoField({
  name = "profilePhotoUrl",
  initialUrl,
}: {
  name?: string;
  initialUrl?: string | null;
}) {
  const [photoUrl, setPhotoUrl] = useState<string>(initialUrl || "");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const compressed = await compressImageFile(file, 320, 0.78);
      setPhotoUrl(compressed);
    } catch {
      setError("Could not process image. Try a JPG or PNG photo.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-[#222222] mb-1.5">
        Profile Photo (ప్రొఫైల్ ఫోటో){" "}
        <span className="text-xs font-normal text-[#717171]">(Optional)</span>
      </label>
      <input type="hidden" name={name} value={photoUrl} />

      <div className="flex items-center gap-4 p-3.5 bg-[#F7F7F7] border border-[#EBEBEB] rounded-xl">
        <div className="w-16 h-16 rounded-full bg-white border border-[#EBEBEB] overflow-hidden flex items-center justify-center shrink-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Profile preview"
              width={64}
              height={64}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl text-[#B0B0B0]">📷</span>
          )}
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white hover:bg-[#EBEBEB] text-[#222222] border border-[#EBEBEB] px-3.5 py-1.5 rounded-full text-xs font-semibold transition"
            >
              {photoUrl ? "Change Photo" : "Upload Photo"}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="text-xs font-semibold text-[#FF385C] hover:underline px-2 py-1.5"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#717171]">
            Customers trust profiles with a clear face photo.
          </p>
          {error && <p className="text-[11px] text-[#FF385C] font-semibold">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export function WorkPhotosField({
  name = "workPhotos",
  initialUrls = [],
  maxPhotos = 3,
}: {
  name?: string;
  initialUrls?: string[];
  maxPhotos?: number;
}) {
  const [photos, setPhotos] = useState<string[]>(initialUrls.slice(0, maxPhotos));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setError(null);

    const remaining = maxPhotos - photos.length;
    const toProcess = files.slice(0, remaining);

    try {
      const compressedList = await Promise.all(
        toProcess.map((file) => compressImageFile(file, 720, 0.72))
      );
      setPhotos((prev) => [...prev, ...compressedList].slice(0, maxPhotos));
    } catch {
      setError("Could not process one or more photos.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-[#222222] mb-1.5">
        Work Photos / Portfolio (పని ఫోటోలు){" "}
        <span className="text-xs font-normal text-[#717171]">
          (Optional • Up to {maxPhotos})
        </span>
      </label>

      {photos.map((url, idx) => (
        <input key={idx} type="hidden" name={name} value={url} />
      ))}

      <div className="grid grid-cols-3 gap-2.5">
        {photos.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded-xl overflow-hidden border border-[#EBEBEB] bg-[#F7F7F7]"
          >
            <Image
              src={url}
              alt={`Work photo ${idx + 1}`}
              width={200}
              height={200}
              unoptimized
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-black"
              aria-label="Remove work photo"
            >
              ✕
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[#EBEBEB] hover:border-[#FF385C] bg-[#F7F7F7] flex flex-col items-center justify-center text-center p-2 transition cursor-pointer"
          >
            <span className="text-xl mb-1">🖼️</span>
            <span className="text-[11px] font-semibold text-[#484848]">
              + Add Photo
            </span>
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-[#FF385C] font-semibold mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        className="hidden"
      />
    </div>
  );
}
