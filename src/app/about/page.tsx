import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Target, Users, History, CheckCircle2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const trainingImg = PlaceHolderImages.find(img => img.id === 'member-training');

  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Header */}
        <div className="space-y-4 mb-16 text-center max-w-3xl mx-auto">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Institutional Profile
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">
            About ASSERWA
          </h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed">
            The Association of Sewage Emptiers in Rwanda (ASSERWA) is the recognized national professional body committed to standardizing, professionalizing, and innovating sanitation management across Rwanda.
          </p>
        </div>

        {/* History & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#6cb166]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#6cb166]/30">
                <History className="text-[#4d8748] w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold text-slate-900">Our Institutional Origins</h3>
                <p className="text-slate-600 font-body text-base leading-relaxed">
                  Established to bring structure, safety, and regulation to Rwanda's sanitation sector, ASSERWA has expanded into a critical partner for national ministries, regulatory bodies (RURA), and public health agencies (WASAC).
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#3b66b0]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#3b66b0]/30">
                <Shield className="text-[#3b66b0] w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold text-slate-900">Our Mission</h3>
                <p className="text-slate-600 font-body text-base leading-relaxed">
                  To advocate for high technical standards, provide ongoing professional certifications, and ensure every municipality and district in Rwanda benefits from safe, efficient, and dignified sanitation services.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            {trainingImg && (
              <Image
                src={trainingImg.imageUrl}
                alt={trainingImg.description}
                fill
                className="object-cover"
                data-ai-hint={trainingImg.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3b66b0]/90 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <p className="font-headline font-bold text-base">Technical Capacity Workshop</p>
                <p className="text-slate-200 text-xs font-body">Training Certified Sanitation Operators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border border-slate-200 bg-white shadow-md rounded-2xl">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 bg-[#3b66b0]/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#3b66b0]" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-slate-900">Our Vision</h3>
              <p className="text-slate-600 font-body leading-relaxed text-base">
                A Rwanda where professionalized, eco-conscious sanitation management is a cornerstone of public health, environmental conservation, and sustainable economic growth.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-md rounded-2xl">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 bg-[#6cb166]/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4d8748]" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-slate-900">Our Core Values</h3>
              <p className="text-slate-600 font-body leading-relaxed text-base">
                Uncompromising integrity, environmental stewardship, continuous technical training, and collaborative governance alongside government regulatory authorities.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Pillars - Brand Green #6cb166 */}
        <div className="bg-[#6cb166] text-white rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4 mb-8">
            <h3 className="text-2xl md:text-3xl font-headline font-bold">Regulatory & Operational Commitments</h3>
            <p className="text-white/95 font-body text-base">
              ASSERWA enforces strict operational codes among all member companies to guarantee compliance with Rwandan national laws.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "100% Verified Equipment Standards",
              "Mandatory Safety & PPE Compliance",
              "Transparent & Standardized Pricing",
              "Discharge at Approved Treatment Sites"
            ].map((pillar, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span className="font-headline font-bold text-xs leading-relaxed text-white">{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
