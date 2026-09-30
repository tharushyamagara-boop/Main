'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, Building2, ArrowRight,
  Search, MapPin, Phone, Mail, Truck, Globe, CheckCircle2 
} from 'lucide-react';
import { useContentStore } from '@/lib/content-store';
import { MemberCompany, subscribeToMemberCompanies, DEFAULT_MEMBER_COMPANIES } from '@/lib/members';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function Home() {
  const { slideshows, memberNetwork, objectives, contactInfo, services } = useContentStore();
  const [members, setMembers] = useState<MemberCompany[]>(
    DEFAULT_MEMBER_COMPANIES.filter(m => m.active !== false)
  );
  const [selectedMember, setSelectedMember] = useState<MemberCompany | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsub = subscribeToMemberCompanies((data) => {
      setMembers(data.filter(m => m.active !== false));
    });
    return () => unsub();
  }, []);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter(comp =>
      comp.name.toLowerCase().includes(q) ||
      comp.headquarters.toLowerCase().includes(q) ||
      comp.category.toLowerCase().includes(q) ||
      (comp.fleet && comp.fleet.toLowerCase().includes(q)) ||
      (comp.services && comp.services.some(s => s.toLowerCase().includes(q)))
    );
  }, [members, searchQuery]);

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

      {/* Official Member Companies Table Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-extrabold text-slate-900 tracking-tight">
              Official ASSERWA Member Companies
            </h2>
            <p className="text-slate-600 font-body text-sm max-w-2xl leading-relaxed">
              Complete official registry of licensed sanitation operators, vacuum tankers, and fecal sludge management providers across Rwanda. Click any company row to view full operational details.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button asChild variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 hover:text-[#3b66b0] hover:bg-slate-50 text-xs font-semibold shadow-2xs">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <span>View more company details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white text-xs font-semibold shadow-2xs">
              <Link href="/book">
                <span>Book Service</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, location, or service..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#3b66b0]/20 focus:border-[#3b66b0] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <span className="text-slate-400 text-[11px] font-medium shrink-0">Showing:</span>
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[11px] font-bold">
              {filteredMembers.length} {filteredMembers.length === 1 ? 'Company' : 'Companies'}
            </Badge>
          </div>
        </div>

        {/* Elegant Table Container */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Company & Specialization</th>
                  <th className="py-3.5 px-4">Headquarters</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Fleet & Equipment</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Contact & Web</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-body">
                {filteredMembers.map((comp, idx) => (
                  <tr
                    key={comp.id || idx}
                    onClick={() => {
                      setSelectedMember(comp);
                      setIsDetailOpen(true);
                    }}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Company Column */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs group-hover:border-[#3b66b0]/40 transition-colors">
                          {comp.logoUrl ? (
                            <img
                              src={comp.logoUrl}
                              alt={comp.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="font-headline font-bold text-xs text-[#3b66b0]">
                              {comp.logoText || comp.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-headline font-bold text-slate-900 text-sm group-hover:text-[#3b66b0] transition-colors truncate block">
                            {comp.name}
                          </span>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-[240px]">
                            {comp.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Headquarters Column */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium truncate max-w-[140px]">{comp.headquarters}</span>
                      </div>
                    </td>

                    {/* Fleet Column */}
                    <td className="py-3.5 px-4 text-slate-600 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px] text-[11px]">{comp.fleet || "Licensed Haulage Fleet"}</span>
                      </div>
                    </td>

                    {/* Contact & Web Column */}
                    <td className="py-3.5 px-4 hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1">
                        {comp.phone && (
                          <a
                            href={`tel:${comp.phone}`}
                            className="text-slate-700 hover:text-[#3b66b0] font-medium flex items-center gap-1 text-[11px]"
                          >
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{comp.phone}</span>
                          </a>
                        )}
                        {comp.websiteUrl && comp.websiteUrl !== '#' && comp.showWebsite !== false ? (
                          <a
                            href={comp.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3b66b0] hover:underline font-semibold flex items-center gap-1 text-[11px]"
                          >
                            <Globe className="w-3 h-3 text-[#3b66b0]" />
                            <span className="truncate max-w-[140px]">{comp.websiteUrl.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">ASSERWA Member</span>
                        )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMember(comp);
                            setIsDetailOpen(true);
                          }}
                          className="h-8 px-2.5 text-xs bg-white border-slate-200 text-slate-700 hover:text-[#3b66b0] hover:bg-slate-50 font-semibold"
                        >
                          <span>Details</span>
                        </Button>

                        <Button asChild size="sm" className="h-8 px-3 text-xs bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-semibold shadow-2xs">
                          <Link href={`/book?memberId=${comp.id}`}>
                            <span>Book</span>
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="p-12 text-center space-y-2">
              <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No member companies found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query.</p>
            </div>
          )}

          <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>Showing all {filteredMembers.length} authorized member companies in Rwanda.</span>
            <Link
              href="/dashboard"
              className="text-[#3b66b0] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Explore Member Network Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Member Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 p-0 overflow-hidden rounded-3xl shadow-2xl">
          {selectedMember && (
            <div>
              {/* Header banner */}
              <div className="bg-gradient-to-r from-[#3b66b0] to-[#25457d] p-6 text-white relative">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 border border-white/20 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                    {selectedMember.logoUrl ? (
                      <img
                        src={selectedMember.logoUrl}
                        alt={selectedMember.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="font-headline font-bold text-xl text-[#3b66b0]">
                        {selectedMember.logoText || selectedMember.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-headline font-bold text-xl text-white">
                      {selectedMember.name}
                    </h3>
                    <p className="text-xs text-white/80 font-medium mt-1">
                      {selectedMember.category}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/90">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-200" />
                        <span>{selectedMember.headquarters}</span>
                      </div>
                      {selectedMember.fleet && (
                        <div className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-blue-200" />
                          <span>{selectedMember.fleet}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Company Overview
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    {selectedMember.description || selectedMember.briefDescription || "Licensed sanitation and liquid waste management operator affiliated with ASSERWA."}
                  </p>
                </div>

                {/* Services */}
                {selectedMember.services && selectedMember.services.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Authorized Sanitation Services
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMember.services.map((svc, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#3b66b0] border border-blue-100 font-medium text-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#3b66b0]" />
                          <span>{svc}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact & Web Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone Dispatch</span>
                    <a href={`tel:${selectedMember.phone}`} className="text-xs font-bold text-slate-800 hover:text-[#3b66b0] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMember.phone || "Contact ASSERWA HQ"}</span>
                    </a>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Email Address</span>
                    <a href={`mailto:${selectedMember.email}`} className="text-xs font-bold text-slate-800 hover:text-[#3b66b0] flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedMember.email || "info@asserwa.rw"}</span>
                    </a>
                  </div>
                </div>

                {/* Official Website (if enabled) */}
                {selectedMember.websiteUrl && selectedMember.websiteUrl !== '#' && selectedMember.showWebsite !== false && (
                  <div className="pt-1">
                    <a
                      href={selectedMember.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#3b66b0]" />
                      <span>Visit Official Website: {selectedMember.websiteUrl.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailOpen(false)}
                  className="bg-white border-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  <Button asChild size="sm" className="bg-[#6cb166] hover:bg-[#5aa054] text-white text-xs font-bold shadow-xs">
                    <Link href={`/book?memberId=${selectedMember.id}`}>
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
