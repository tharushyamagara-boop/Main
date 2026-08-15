import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Target, Users, MapPin, CheckCircle2, HeartHandshake, Wrench } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const trainingImg = PlaceHolderImages.find(img => img.id === 'member-training');

  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Title Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Official Profile
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">
            Who is ASSSERVA?
          </h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed">
            ASSSERVA (Association of Sewage Emptiers in Rwanda) is a non-governmental organization that brings together sewage emptiers and sanitation service providers in Rwanda.
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
                To promote a culture of hygiene and sanitation among members and the wider community.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xl font-headline font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#3b66b0]" /> Main Objective & Scope
              </h3>
              <p className="text-slate-700 font-body leading-relaxed text-base">
                The organization works to improve sanitation services, protect public health, and safeguard the environment across all provinces of Rwanda.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[380px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            {trainingImg && (
              <Image
                src={trainingImg.imageUrl}
                alt="ASSSERVA Technical Operations"
                fill
                className="object-cover"
                data-ai-hint={trainingImg.imageHint}
              />
            )}
          </div>
        </div>

        {/* 4 Objectives Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-slate-900 text-center">Objectives of the Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Obj 1 */}
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 bg-[#6cb166]/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#4d8748]" />
              </div>
              <h3 className="text-lg font-headline font-bold text-slate-900">Environmental and Hygiene Promotion</h3>
              <ul className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6cb166] shrink-0 mt-0.5" />
                  <span>Promote environmental protection and sanitation practices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6cb166] shrink-0 mt-0.5" />
                  <span>Promote hygiene and sanitation activities that improve the health and well-being of members and communities.</span>
                </li>
              </ul>
            </Card>

            {/* Obj 2 */}
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 bg-[#3b66b0]/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#3b66b0]" />
              </div>
              <h3 className="text-lg font-headline font-bold text-slate-900">Professional Development</h3>
              <ul className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3b66b0] shrink-0 mt-0.5" />
                  <span>Promote high professional standards among sewage emptiers and sanitation workers.</span>
                </li>
              </ul>
            </Card>

            {/* Obj 3 */}
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 bg-[#6cb166]/10 rounded-xl flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-[#4d8748]" />
              </div>
              <h3 className="text-lg font-headline font-bold text-slate-900">Advocacy</h3>
              <p className="text-xs text-slate-500 font-body">Advocate for sewage emptiers and sanitation practitioners at different levels:</p>
              <ul className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6cb166] shrink-0 mt-0.5" />
                  <span>National government institutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6cb166] shrink-0 mt-0.5" />
                  <span>Local government institutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#6cb166] shrink-0 mt-0.5" />
                  <span>Non-government stakeholders and partners</span>
                </li>
              </ul>
            </Card>

            {/* Obj 4 */}
            <Card className="border border-slate-200 bg-white shadow-sm rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 bg-[#3b66b0]/10 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-[#3b66b0]" />
              </div>
              <h3 className="text-lg font-headline font-bold text-slate-900">Sanitation Infrastructure</h3>
              <ul className="space-y-2 text-sm text-slate-600 font-body leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3b66b0] shrink-0 mt-0.5" />
                  <span>Advocate for the construction of toilets and sanitation facilities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3b66b0] shrink-0 mt-0.5" />
                  <span>Promote proper operation and maintenance of toilets and sanitation infrastructure.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Contact Info Box */}
        <div className="p-8 bg-[#6cb166] text-white rounded-3xl shadow-lg space-y-3">
          <h3 className="text-xl font-headline font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white" /> Official Headquarters Contact
          </h3>
          <p className="text-sm font-body text-white/95 leading-relaxed">
            Public Cell / Rukiri Cell, Irembo House, Gishushu Road, Nyarutarama Village, Remera II, Remera Sector, Gasabo District, Kigali City, Rwanda
            <br />
            Email: <span className="font-bold">assservarwanda@gmail.com</span> | Phone: <span className="font-bold">+250 784 246 216</span>
          </p>
        </div>
      </div>
    </div>
  );
}
