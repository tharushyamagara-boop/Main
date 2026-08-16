'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useContentStore } from '@/lib/content-store';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function GalleryPage() {
  const { gallery } = useContentStore();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isVideo = (item: (typeof gallery)[0]) =>
    item.mediaType === 'video' ||
    item.imageUrl?.startsWith('data:video') ||
    !!item.imageUrl?.match(/\.(mp4|webm|ogg)$/i);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  const next = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % gallery.length);
  }, [lightboxIndex, gallery.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, prev, next]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const current = lightboxIndex !== null ? gallery[lightboxIndex] : null;

  return (
    <div className="bg-slate-50/50 py-[30px]">
      <div className="container mx-auto px-4 max-w-6xl space-y-[30px]">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Field Documentation
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Impact Gallery</h1>
          <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed">
            Visual record of ASSERWA field projects, facility inspections, capacity building workshops, and community sanitation outreach across Rwanda.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {gallery.map((img, idx) => (
            <div
              key={img.id || idx}
              className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-slate-200 flex flex-col cursor-pointer"
              onClick={() => openLightbox(idx)}
              role="button"
              aria-label={`Open ${img.description} in slideshow`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
            >
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                {img.imageUrl && (
                  isVideo(img) ? (
                    <video
                      src={img.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src={img.imageUrl}
                      alt={img.description}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-10 h-10 drop-shadow-lg" />
                </div>
              </div>
              <div className="p-5 bg-white border-t border-slate-100 flex-1 flex items-center">
                <p className="text-slate-800 font-headline text-sm font-bold leading-snug">
                  {img.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-[30px] bg-white border border-slate-200 rounded-3xl text-center shadow-md max-w-3xl mx-auto space-y-3">
          <h3 className="text-xl font-headline font-bold text-slate-900">Documenting Progress Across Rwanda</h3>
          <p className="text-slate-600 font-body text-sm italic leading-relaxed">
            &quot;A cleaner Rwanda is visible in every community we serve. Our gallery reflects the ongoing dedication of our member organizations.&quot;
          </p>
        </div>
      </div>

      {/* ── Lightbox Slideshow ── */}
      {lightboxIndex !== null && current && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            id="lightbox-close"
            className="absolute top-5 right-5 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-2.5 transition-all duration-200 backdrop-blur-sm"
            onClick={closeLightbox}
            aria-label="Close slideshow"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-xs font-bold font-headline px-4 py-1.5 rounded-full">
            {lightboxIndex + 1} / {gallery.length}
          </div>

          {/* Prev */}
          <button
            id="lightbox-prev"
            className="absolute left-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Media */}
          <div
            className="relative flex items-center justify-center w-full h-full px-20"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(current) ? (
              <video
                key={lightboxIndex}
                src={current.imageUrl}
                controls
                autoPlay
                className="max-h-[80vh] max-w-full rounded-xl shadow-2xl"
              />
            ) : (
              <div className="relative max-h-[80vh] max-w-4xl w-full h-[80vh]">
                <Image
                  key={lightboxIndex}
                  src={current.imageUrl}
                  alt={current.description}
                  fill
                  className="object-contain rounded-xl shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-lg text-center bg-white/10 backdrop-blur-sm text-white text-sm font-headline font-semibold px-6 py-2.5 rounded-full shadow-lg">
            {current.description}
          </div>

          {/* Next */}
          <button
            id="lightbox-next"
            className="absolute right-4 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
}

