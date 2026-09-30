'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useContentStore } from '@/lib/content-store';
import { MemberCompany, subscribeToMemberCompanies, DEFAULT_MEMBER_COMPANIES } from '@/lib/members';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const { slideshows, memberNetwork, objectives, contactInfo, services } = useContentStore();
  const [members, setMembers] = useState<MemberCompany[]>(
    DEFAULT_MEMBER_COMPANIES.filter(m => m.active !== false)
  );

  useEffect(() => {
    const unsub = subscribeToMemberCompanies((data) => {
      setMembers(data.filter(m => m.active !== false));
    });
    return () => unsub();
  }, []);

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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3 py-1 rounded-full border border-[#3b66b0]/20">
              <Building2 className="w-3.5 h-3.5 text-[#3b66b0]" />
              <span>Certified Provider Network</span>
            </div>
            <h2 className="text-3xl font-headline font-extrabold text-slate-900">
              Official ASSERWA Member Companies
            </h2>
            <p className="text-slate-600 font-body text-sm max-w-2xl">
              Roster of certified sanitation operators and vacuum emptiers adhering to RURA sanitation standards and environmental guidelines across Rwanda.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 hover:text-[#3b66b0] hover:bg-slate-50 text-xs shrink-0">
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <span>View Full Directory ({members.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.slice(0, 6).map((comp) => (
            <div
              key={comp.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {comp.logoUrl ? (
                      <img
                        src={comp.logoUrl}
                        alt={comp.name}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-0.5 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b66b0] to-[#1e3a6e] text-white flex items-center justify-center font-bold text-sm font-headline shadow-2xs shrink-0">
                        {comp.logoText || comp.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-headline font-bold text-slate-900 text-sm truncate group-hover:text-[#3b66b0] transition-colors">
                        {comp.name}
                      </h3>
                      <p className="text-[11px] text-[#3b66b0] font-semibold truncate mt-0.5">
                        {comp.category}
                      </p>
                    </div>
                  </div>

                  {comp.verified && (
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] shrink-0 flex items-center gap-1 font-bold px-2 py-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Certified</span>
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {comp.briefDescription || comp.description}
                </p>

                <div className="text-[11px] text-slate-500 font-medium">
                  <span>HQ: </span>
                  <span className="text-slate-700">{comp.headquarters}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {comp.websiteUrl ? (
                  <a
                    href={comp.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-[#3b66b0] font-semibold hover:underline"
                    title={`Open ${comp.name} website in new tab`}
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">ASSERWA Member</span>
                )}

                <Button asChild size="sm" className="h-7 px-3 text-xs bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-semibold rounded-lg shadow-2xs">
                  <Link href={`/book?memberId=${comp.id}`}>
                    <span>Book Service</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
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
