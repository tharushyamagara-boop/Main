'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContentStore } from '@/lib/content-store';
import { ImageIcon, Upload, Building2 } from 'lucide-react';

export default function AboutPage() {
  const { aboutUs, objectives, contactInfo } = useContentStore();

  return (
    <div className="bg-slate-50/50 py-[30px]">
      <div className="container mx-auto px-4 max-w-6xl space-y-[30px]">
        {/* Title Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">
            {aboutUs.title}
          </h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed">
            {aboutUs.description}
          </p>
        </div>

        {/* Core Mission & Image Photo Holder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px] items-center">
          <div className="lg:col-span-7 space-y-[30px]">
            <div className="p-[30px] rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xl font-headline font-bold text-slate-900">
                Main Mission
              </h3>
              <p className="text-slate-700 font-body leading-relaxed text-base">
                {aboutUs.mission}
              </p>
            </div>

            <div className="p-[30px] rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xl font-headline font-bold text-slate-900">
                Main Objective & Scope
              </h3>
              <p className="text-slate-700 font-body leading-relaxed text-base">
                {aboutUs.objectiveScope}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[380px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100 group">
            {aboutUs.imageUrl ? (
              <>
                <Image
                  src={aboutUs.imageUrl}
                  alt="ASSERWA Operations"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-semibold drop-shadow-sm flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ASSERWA Field Operations</span>
                  </span>
                  <Link 
                    href="/admin" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs"
                    title="Change photo in Admin Panel"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Change Photo</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-3 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Official ASSERWA Photo Holder</p>
                  <p className="text-xs text-slate-500 mt-0.5">Upload a photo in the Admin Panel to display here</p>
                </div>
                <Button asChild size="sm" variant="outline" className="text-xs h-9 border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-xs">
                  <Link href="/admin">
                    <Upload className="w-3.5 h-3.5 mr-1.5 text-[#3b66b0]" />
                    <span>Add Photo in Admin</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Objectives Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-slate-900 text-center">Objectives of the Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
            {objectives.map((obj, idx) => (
              <Card key={obj.id || idx} className="border border-slate-200 bg-white shadow-sm rounded-2xl p-[30px] space-y-3">
                <h3 className="text-lg font-headline font-bold text-slate-900">{obj.title}</h3>
                <ul className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
                  {obj.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="text-[#6cb166] font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info Box */}
        <div className="p-[30px] bg-[#6cb166] text-white rounded-3xl shadow-lg space-y-3">
          <h3 className="text-xl font-headline font-bold">
            Official Headquarters Contact
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
