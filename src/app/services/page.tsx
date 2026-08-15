import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, BarChart3, BookOpen, HardHat, Droplets, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const services = [
  {
    title: "AI Compliance Evaluation Engine",
    description: "Our GenAI-powered platform analyzes technical reports and site maintenance plans against Rwandan national sanitation standards.",
    icon: ShieldCheck,
    link: "/compliance",
    cta: "Evaluate Report",
    badge: "GenAI Reasoning"
  },
  {
    title: "National Impact Analytics",
    description: "Real-time visual monitoring of waste managed, district coverage, and member operational reach across all 30 provinces.",
    icon: BarChart3,
    link: "/dashboard",
    cta: "View Impact Data",
    badge: "Analytics"
  },
  {
    title: "Technical Knowledge Repository",
    description: "Access curated national guidelines, worker safety protocols, and environmental research manuals.",
    icon: BookOpen,
    link: "/resources",
    cta: "Browse Publications",
    badge: "Documentation"
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300">
            Professional Offerings & Tools
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Our Services & Digital Platform</h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed">
            ASSERWA provides technical assistance, AI-driven compliance checking, and professional advocacy to ensure sanitation operations meet national standardizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {services.map((service, idx) => (
            <Card key={idx} className="flex flex-col border border-slate-200 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 rounded-2xl bg-white overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-slate-200 px-2.5 py-1 rounded-full">
                    {service.badge}
                  </span>
                </div>
                <CardTitle className="font-headline text-xl text-slate-900 mb-2">{service.title}</CardTitle>
                <CardDescription className="font-body text-slate-600 text-sm leading-relaxed">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 mt-auto">
                <Button asChild className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-headline text-xs font-bold py-5 shadow-sm transition-colors">
                  <Link href={service.link} className="flex items-center justify-center gap-2">
                    {service.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Member Support Services */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
                Institutional Member Support
              </span>
              <h2 className="text-3xl font-headline font-bold text-white">Direct Assistance for Association Members</h2>
              <p className="text-slate-300 font-body text-base leading-relaxed">
                Beyond digital software, we deliver comprehensive operational support for our 16 member organizations operating across Rwanda.
              </p>
              <ul className="space-y-3.5 pt-2">
                {[
                  "Government Policy Representation (RURA & WASAC)",
                  "Transparent & Standardized Tariff Frameworks",
                  "Advanced Mechanical & Safe Emptying Technical Training",
                  "Environmental Health & Occupational Safety Certifications"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-body text-sm font-semibold text-slate-200">
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 text-center hover:border-emerald-500/40 transition-colors">
                <HardHat className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-headline font-bold text-sm text-white">Field Operations</h4>
                <p className="text-[11px] text-slate-400 mt-1 font-body">Safety & Equipment</p>
              </div>
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 text-center hover:border-emerald-500/40 transition-colors">
                <Droplets className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-headline font-bold text-sm text-white">Hygiene Standards</h4>
                <p className="text-[11px] text-slate-400 mt-1 font-body">Public Protection</p>
              </div>
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 text-center hover:border-emerald-500/40 transition-colors">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-headline font-bold text-sm text-white">Compliance</h4>
                <p className="text-[11px] text-slate-400 mt-1 font-body">National Verification</p>
              </div>
              <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 text-center hover:border-emerald-500/40 transition-colors">
                <BarChart3 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-headline font-bold text-sm text-white">Reporting</h4>
                <p className="text-[11px] text-slate-400 mt-1 font-body">District Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
