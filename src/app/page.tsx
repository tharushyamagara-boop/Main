'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useContentStore } from '@/lib/content-store';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const { slideshows, memberNetwork, objectives, contactInfo, services } = useContentStore();

  return (
    <div className="flex flex-col w-full bg-slate-50/50 min-h-screen">
      {/* 100% Full Width Hero Slideshow Section */}
      <section className="relative w-full overflow-hidden bg-slate-100">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {slideshows.map((slide, index) => {
              return (
                <CarouselItem key={slide.id || index}>
                  <div className="relative h-[460px] md:h-[520px] w-full flex items-center">
                    {/* Background Image / Video */}
                    <div className="absolute inset-0 z-0 bg-black">
                      {slide.imageUrl && (
                        slide.mediaType === 'video' || slide.imageUrl.startsWith('data:video') || slide.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video
                            src={slide.imageUrl}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={slide.imageUrl}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        )
                      )}
                    </div>

                    {/* Compact White Background Slide Overlay */}
                    <div className="container mx-auto px-6 lg:px-12 z-10 relative">
                      <div className="max-w-lg space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xl">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-extrabold leading-tight text-slate-900 tracking-tight">
                          {slide.title}<span className="text-[#6cb166]">{slide.titleHighlight}</span>
                        </h1>
                        <p className="text-xs sm:text-sm font-body text-slate-600 leading-relaxed">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <div className="absolute bottom-6 right-6 md:right-12 flex gap-2.5 z-20">
            <CarouselPrevious className="static translate-y-0 bg-white/90 border-slate-200 text-slate-800 hover:bg-[#3b66b0] hover:text-white hover:border-[#3b66b0] h-10 w-10 rounded-xl shadow-md transition-colors" />
            <CarouselNext className="static translate-y-0 bg-white/90 border-slate-200 text-slate-800 hover:bg-[#3b66b0] hover:text-white hover:border-[#3b66b0] h-10 w-10 rounded-xl shadow-md transition-colors" />
          </div>
        </Carousel>
      </section>

      {/* Main Objectives of the Organization */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[30px] w-full">
        <div className="text-center max-w-3xl mx-auto mb-[30px] space-y-3">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-900">Objectives of the Organization</h2>
          <p className="text-slate-600 font-body text-sm md:text-base leading-relaxed">
            ASSERWA operates across four key strategic pillars to advance Rwanda's sanitation sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {objectives.map((obj, idx) => (
            <div key={obj.id || idx} className="p-[30px] rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow space-y-3">
              <h3 className="text-lg font-headline font-bold text-slate-900 pt-1">{obj.title}</h3>
              <ul className="text-xs text-slate-600 font-body space-y-2 leading-relaxed">
                {obj.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <span className="text-[#6cb166] font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Official Member Companies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[30px] w-full">
        <div className="p-[30px] bg-[#6cb166] text-white rounded-3xl shadow-xl space-y-[30px]">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-headline font-bold text-white">Official Member Companies</h2>
            <p className="text-white/90 font-body text-sm">
              Official roster of certified member companies and sanitation service providers affiliated with ASSERWA in Rwanda:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {memberNetwork.flatMap(item => item.companies).map((comp, cIdx) => (
              <div key={cIdx} className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center gap-3 font-headline font-bold text-sm text-white">
                <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span>{comp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[30px] mb-[30px] w-full">
        <div className="p-[30px] bg-white border border-slate-200 rounded-3xl shadow-lg text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-headline font-bold text-slate-900">
            Contact Association Headquarters
          </h2>
          <p className="text-slate-600 font-body text-sm leading-relaxed">
            {contactInfo.address}
            <br />
            Email: <span className="font-bold text-slate-800">{contactInfo.email}</span> | Telephone: <span className="font-bold text-slate-800">{contactInfo.phone}</span>
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold px-8 shadow-md">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
