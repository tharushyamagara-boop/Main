
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-') || img.id === 'community-impact' || img.id === 'hero-sanitation');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-secondary">Impact Gallery</h1>
        <p className="text-lg text-muted-foreground font-body leading-relaxed">
          Visual documentation of our projects, infrastructure development, and community impact across Rwanda.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {galleryImages.map((img, idx) => (
          <div key={idx} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 break-inside-avoid">
            <Image
              src={img.imageUrl}
              alt={img.description}
              width={800}
              height={600}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              data-ai-hint={img.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <p className="text-white font-headline text-sm font-bold tracking-wide">
                {img.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 py-12 border-t text-center">
        <h3 className="text-xl font-headline font-bold text-secondary mb-4">Sharing the Vision</h3>
        <p className="text-muted-foreground font-body max-w-xl mx-auto italic">
          "A cleaner Rwanda is visible in every community we serve. Our gallery reflects the dedication of our 16 member organizations."
        </p>
      </div>
    </div>
  );
}
