'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Building2, ShieldCheck, Users } from 'lucide-react';

const memberNetwork = [
  {
    region: "Kigali City",
    description: "Capital & Central Administrative Operations",
    companies: ["Kyalin Services SARL", "Igisubizo Co. Ltd", "SANEC Co. Ltd", "Kant Kigali Ltd"]
  },
  {
    region: "Western Province (Uburengerazuba)",
    description: "Lake Kivu & Western Regional Providers",
    companies: ["UBTC Fast", "Timbe Best Co. Ltd", "Umucyo Best Technical Co."]
  },
  {
    region: "Northern Province (Amajyaruguru)",
    description: "Northern Region Service Providers",
    companies: ["Sanitec Co. Ltd", "Theophile"]
  },
  {
    region: "Southern Province (Amajyepfo)",
    description: "Southern Regional Operations",
    companies: ["UMOJA Co. Ltd", "Tabara Co. Ltd"]
  }
];

export default function DashboardPage() {
  return (
    <div className="bg-slate-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Areas of Operation
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900">Member Companies Network</h1>
          <p className="text-slate-600 font-body text-base max-w-2xl">
            Official roster of member companies and sanitation service providers affiliated with ASSSERVA across Rwanda.
          </p>
        </div>

        {/* Region Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {memberNetwork.map((item, idx) => (
            <Card key={idx} className="shadow-md border border-slate-200 rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-[#3b66b0] text-white p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-headline text-lg text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#6cb166]" /> {item.region}
                  </CardTitle>
                </div>
                <CardDescription className="text-white/80 text-xs font-body mt-1">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="text-xs font-headline font-bold uppercase tracking-wider text-slate-500 mb-3">Affiliated Member Service Providers:</h4>
                <ul className="space-y-2.5">
                  {item.companies.map((company, cIdx) => (
                    <li key={cIdx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-headline font-bold text-sm">
                      <Building2 className="w-4 h-4 text-[#6cb166] shrink-0" />
                      <span>{company}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Official Note */}
        <div className="p-8 bg-[#6cb166] text-white rounded-3xl shadow-lg space-y-2 text-center max-w-3xl mx-auto">
          <ShieldCheck className="w-8 h-8 text-white mx-auto" />
          <h3 className="text-lg font-headline font-bold">Verified Professional Membership</h3>
          <p className="text-xs font-body text-white/95 leading-relaxed max-w-xl mx-auto">
            ASSSERVA brings together certified sewage emptiers and sanitation practitioners in Rwanda to ensure professional fecal sludge management, public health safety, and environmental protection.
          </p>
        </div>
      </div>
    </div>
  );
}
