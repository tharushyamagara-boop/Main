'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Target, MapPin, CheckCircle2, Users, HeartHandshake, Wrench } from 'lucide-react';
import { useContentStore } from '@/lib/content-store';

export default function AboutPage() {
  const { aboutUs, objectives, contactInfo } = useContentStore();

  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Title Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            {aboutUs.headerTag}
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">
            {aboutUs.title}
          </h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed">
            {aboutUs.description}
          </p>
        </div>

        {/* Core Mission & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xl font-headline font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6cb166]" /> Main Mission
              </h3>
              <p className="text-slate-700 font-body leading-relaxed text-base">
                {aboutUs.mission}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xl font-headline font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#3b66b0]" /> Main Objective & Scope
              </h3>
              <p className="text-slate-700 font-body leading-relaxed text-base">
                {aboutUs.objectiveScope}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[380px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            {aboutUs.imageUrl && (
              <Image
                src={aboutUs.imageUrl}
                alt="ASSSERVA Operations"
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>

        {/* 4 Objectives Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-slate-900 text-center">Objectives of the Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((obj, idx) => (
              <Card key={obj.id || idx} className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${obj.color}15` }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: obj.color }} />
                </div>
                <h3 className="text-lg font-headline font-bold text-slate-900">{obj.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
                  {obj.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: obj.color }} />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info Box */}
        <div className="p-8 bg-[#6cb166] text-white rounded-3xl shadow-lg space-y-3">
          <h3 className="text-xl font-headline font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" /> Official Headquarters Contact
          </h3>
          <p className="text-sm font-body text-white/95 leading-relaxed">
            {contactInfo.address}
            <br />
            Email: <span className="font-bold">{contactInfo.email}</span> | Phone: <span className="font-bold">{contactInfo.phone}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
