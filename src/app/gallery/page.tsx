'use client';

import Image from 'next/image';
import { useContentStore } from '@/lib/content-store';

export default function GalleryPage() {
  const { gallery } = useContentStore();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {gallery.map((img, idx) => (
            <div key={img.id || idx} className="group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-slate-200 flex flex-col">
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                {img.imageUrl && (
                  img.mediaType === 'video' || img.imageUrl.startsWith('data:video') || img.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={img.imageUrl}
                      controls
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
            "A cleaner Rwanda is visible in every community we serve. Our gallery reflects the ongoing dedication of our member organizations."
          </p>
        </div>
      </div>
    </div>
  );
}
