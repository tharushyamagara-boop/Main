'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useContentStore } from '@/lib/content-store';

export default function DashboardPage() {
  const { memberNetwork } = useContentStore();

  // Combine all companies into a single flat list
  const allCompanies = memberNetwork.flatMap(item => item.companies);

  return (
    <div className="bg-slate-50/50 py-[30px]">
      <div className="container mx-auto px-4 max-w-6xl space-y-[30px]">
        <div className="space-y-3">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Official Directory
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900">Member Companies Directory</h1>
          <p className="text-slate-600 font-body text-base max-w-2xl">
            Official roster of certified member companies and sanitation service providers affiliated with ASSERWA across Rwanda.
          </p>
        </div>

        {/* Member Directory List */}
        <Card className="shadow-md border border-slate-200 rounded-3xl bg-white overflow-hidden">
          <CardHeader className="bg-[#3b66b0] text-white p-[30px]">
            <CardTitle className="font-headline text-xl text-white">
              Official ASSERWA Member Companies
            </CardTitle>
            <CardDescription className="text-white/80 text-sm font-body mt-1">
              Full official list of certified member companies and sanitation service providers
            </CardDescription>
          </CardHeader>
          <CardContent className="p-[30px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCompanies.map((company, cIdx) => (
                <div key={cIdx} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-headline font-bold text-sm hover:border-[#6cb166] hover:bg-slate-100/80 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[#6cb166] shrink-0" />
                  <span>{company}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Official Note */}
        <div className="p-[30px] bg-[#6cb166] text-white rounded-3xl shadow-lg space-y-2 text-center max-w-3xl mx-auto">
          <h3 className="text-lg font-headline font-bold">Verified Professional Membership</h3>
          <p className="text-xs font-body text-white/95 leading-relaxed max-w-xl mx-auto">
            ASSERWA brings together certified sewage emptiers and sanitation practitioners in Rwanda to ensure professional fecal sludge management, public health safety, and environmental protection.
          </p>
        </div>
      </div>
    </div>
  );
}
