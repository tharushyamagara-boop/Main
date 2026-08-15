import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Camera, Image as ImageIcon } from 'lucide-react';

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-') || img.id === 'community-impact' || img.id === 'hero-sanitation' || img.id === 'member-training' || img.id === 'news-advocacy');

  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Field Documentation
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Impact Gallery</h1>
          <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed">
            Visual record of ASSERWA field projects, facility inspections, capacity building workshops, and community sanitation outreach across Rwanda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 bg-[#6cb166] h-72 border border-slate-200">
              <Image
                src={img.imageUrl}
                alt={img.description}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                data-ai-hint={img.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b66b0] via-[#3b66b0]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-flex items-center gap-1 text-[10px] font-headline font-bold uppercase tracking-wider text-white bg-[#6cb166] px-2.5 py-0.5 rounded-full mb-2 border border-white/20">
                    <Camera className="w-3 h-3" /> Field Inspection
                  </span>
                  <p className="text-white font-headline text-sm font-bold leading-snug">
                    {img.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 p-10 bg-white border border-slate-200 rounded-3xl text-center shadow-md max-w-3xl mx-auto space-y-3">
          <ImageIcon className="w-10 h-10 text-[#6cb166] mx-auto" />
          <h3 className="text-xl font-headline font-bold text-slate-900">Documenting Progress Across 30 Districts</h3>
          <p className="text-slate-600 font-body text-sm italic leading-relaxed">
            "A cleaner Rwanda is visible in every community we serve. Our gallery reflects the ongoing dedication of our 16 member organizations."
          </p>
        </div>
      </div>
    </div>
  );
}
