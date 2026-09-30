'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useContentStore } from '@/lib/content-store';

export default function ServicesPage() {
  const { services } = useContentStore();

  return (
    <div className="bg-slate-50/50 py-[30px]">
      <div className="container mx-auto px-4 max-w-6xl space-y-[30px]">
        <div className="max-w-3xl mb-[30px] space-y-4">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Services & Objectives</h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed">
            ASSERWA works to improve sanitation services, protect public health, and safeguard the environment across Rwanda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
          {services.map((service, idx) => (
            <Card key={service.id || idx} className="flex flex-col border border-slate-200 hover:border-[#6cb166]/50 hover:shadow-xl transition-all duration-300 rounded-2xl bg-white overflow-hidden p-[30px] space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-headline font-bold text-xl text-slate-900 leading-snug">{service.title}</h3>
              </div>
              <p className="font-body text-slate-600 text-sm leading-relaxed flex-1">{service.description}</p>
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <Button asChild size="sm" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold shadow-sm">
                  <Link href={service.link || '/book'}>
                    {service.cta || 'Book Service'}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100 font-headline text-xs font-bold">
                  <Link href="/book">
                    Book Online (GPS)
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Member Support Box */}
        <div className="bg-[#6cb166] rounded-3xl p-[30px] text-white shadow-xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl font-headline font-bold text-white">Advocacy for Sanitation Practitioners</h2>
            <p className="text-white/95 font-body text-base leading-relaxed">
              ASSERWA represents sewage emptiers and sanitation service providers at national government institutions, local government bodies, and non-government stakeholders.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              "National Government Institutional Representation",
              "Local Government Advocacy across Rwanda",
              "Non-Government Stakeholder Partnerships",
              "Sanitation Infrastructure Operation & Maintenance"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/20 text-xs font-headline font-bold">
                <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
