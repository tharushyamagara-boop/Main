'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle2, Building2, Globe2, MapPin, Users, HeartHandshake, Wrench, ArrowRight, BarChart3 } from 'lucide-react';
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
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      {slide.imageUrl && (
                        <Image
                          src={slide.imageUrl}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                        />
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

      {/* Official Slogan Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="py-5 px-8 bg-[#3b66b0] text-white text-xs font-headline font-bold rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-4 h-4 text-[#6cb166]" />
            <span>OFFICIAL SLOGAN</span>
          </div>
          <div className="text-center md:text-right font-semibold text-white">
            “{contactInfo.slogan}”
            <span className="block text-[11px] text-white/80 font-normal mt-0.5">
              (“{contactInfo.sloganKinyarwanda}”)
            </span>
          </div>
        </div>
      </section>

      {/* Who is ASSSERVA? Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="p-8 md:p-12 bg-white rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
              About the Organization
            </span>
            <h2 className="text-3xl font-headline font-bold text-slate-900">Who is ASSSERVA?</h2>
            <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed">
              ASSSERVA (Association of Sewage Emptiers in Rwanda) is a non-governmental organization that brings together sewage emptiers and sanitation service providers in Rwanda. The organization works to improve sanitation services, protect public health, and safeguard the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#6cb166]" /> Main Mission
              </h4>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                To promote a culture of hygiene and sanitation among members and the wider community.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-headline font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3b66b0]" /> Headquarters Location
              </h4>
              <p className="text-xs text-slate-600 font-body leading-relaxed">
                {contactInfo.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Main Objectives of the Organization */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#6cb166] bg-[#6cb166]/10 px-3.5 py-1 rounded-full border border-[#6cb166]/30">
            Institutional Objectives
          </span>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-900">Objectives of the Organization</h2>
          <p className="text-slate-600 font-body text-sm md:text-base leading-relaxed">
            ASSSERVA operates across four key strategic pillars to advance Rwanda's sanitation sector.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {objectives.map((obj, idx) => (
            <div key={obj.id || idx} className="p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${obj.color}15` }}>
                <ShieldCheck className="w-6 h-6" style={{ color: obj.color }} />
              </div>
              <h3 className="text-lg font-headline font-bold text-slate-900">{obj.title}</h3>
              <ul className="text-xs text-slate-600 font-body space-y-2 leading-relaxed">
                {obj.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: obj.color }} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Member Companies & Areas of Operation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="py-14 px-8 bg-[#6cb166] text-white rounded-3xl shadow-xl space-y-8">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-headline font-bold text-white">Areas of Operation / Member Companies</h2>
            <p className="text-white/90 font-body text-sm">
              ASSSERVA represents member companies and sanitation service providers operating across different regions of Rwanda:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {memberNetwork.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm space-y-3">
                <h3 className="font-headline font-bold text-base text-white border-b border-white/20 pb-2">{item.region}</h3>
                <ul className="space-y-2 text-xs font-body text-white/95">
                  {item.companies.map((comp, cIdx) => (
                    <li key={cIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16 w-full">
        <div className="p-10 bg-white border border-slate-200 rounded-3xl shadow-lg text-center space-y-4 max-w-3xl mx-auto">
          <Globe2 className="w-10 h-10 text-[#3b66b0] mx-auto" />
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
