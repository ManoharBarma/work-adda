"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

interface WorkPhoto {
  id: string;
  photoUrl: string;
}

export default function WorkPhotoGallery({
  photos,
  workerName,
}: {
  photos: WorkPhoto[];
  workerName: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const isOpen = lightboxIndex !== null;

  const openAt = (i: number) => {
    setClosing(false);
    setLightboxIndex(i);
  };

  const close = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setLightboxIndex(null);
      setClosing(false);
    }, 180);
  }, []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : 0));
  }, [photos.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : 0));
  }, [photos.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, prev, next]);

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openAt(index)}
            aria-label={`View ${workerName} work photo ${index + 1}`}
            className="aspect-square rounded-xl overflow-hidden border border-[#EBEBEB] bg-[#F7F7F7] group active:scale-95 transition-transform cursor-zoom-in relative"
          >
            <Image
              src={photo.photoUrl}
              alt={`${workerName} work sample ${index + 1}`}
              width={240}
              height={240}
              unoptimized
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Zoom hint overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-lg drop-shadow">🔍</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && lightboxIndex !== null && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center
            ${closing ? "animate-backdrop-out" : "animate-backdrop-in"}`}
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={close}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null || photos.length <= 1) return;
            const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
            const diff = touchStartX.current - endX;
            touchStartX.current = null;
            if (Math.abs(diff) > 45) {
              if (diff > 0) next();
              else prev();
            }
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/40 text-white/90 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Prev arrow */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              ←
            </button>
          )}

          {/* Main image */}
          <div
            className={`relative max-w-full max-h-full px-16 py-16 ${closing ? "animate-modal-out" : "animate-gallery-in"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightboxIndex].photoUrl}
              alt={`${workerName} work sample ${lightboxIndex + 1}`}
              width={800}
              height={800}
              unoptimized
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            />
          </div>

          {/* Next arrow */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              →
            </button>
          )}

          {/* Dot indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === lightboxIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
