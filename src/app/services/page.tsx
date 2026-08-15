import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Users, HeartHandshake, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react';

const coreServices = [
  {
    title: "Environmental & Hygiene Promotion",
    description: "Promoting environmental protection, sanitation practices, and community hygiene to improve health and well-being.",
    icon: ShieldCheck,
    link: "/compliance",
    cta: "View Objectives"
  },
  {
    title: "Professional Development",
    description: "Promoting high professional standards among sewage emptiers and sanitation workers across Rwanda.",
    icon: Users,
    link: "/about",
    cta: "Learn More"
  },
  {
    title: "Institutional Advocacy",
    description: "Advocating for sanitation practitioners at national government institutions, local government bodies, and non-government stakeholders.",
    icon: HeartHandshake,
    link: "/contact",
    cta: "Partner With Us"
  },
  {
    title: "Sanitation Infrastructure",
    description: "Advocating for toilet construction and promoting proper operation and maintenance of sanitation facilities.",
    icon: Wrench,
    link: "/dashboard",
    cta: "View Member Network"
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Areas of Operation
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Services & Objectives</h1>
          <p className="text-lg text-slate-600 font-body leading-relaxed">
            ASSSERVA works to improve sanitation services, protect public health, and safeguard the environment across Rwanda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreServices.map((service, idx) => (
            <Card key={idx} className="flex flex-col border border-slate-200 hover:border-[#6cb166]/50 hover:shadow-xl transition-all duration-300 rounded-2xl bg-white overflow-hidden p-8 space-y-4">
              <div className="w-12 h-12 bg-[#6cb166]/10 rounded-xl flex items-center justify-center">
                <service.icon className="w-6 h-6 text-[#4d8748]" />
              </div>
              <h3 className="font-headline font-bold text-xl text-slate-900">{service.title}</h3>
              <p className="font-body text-slate-600 text-sm leading-relaxed flex-1">{service.description}</p>
              <div className="pt-2">
                <Button asChild variant="outline" className="border-[#3b66b0] text-[#3b66b0] hover:bg-[#3b66b0] hover:text-white font-headline text-xs font-bold">
                  <Link href={service.link} className="flex items-center gap-2">
                    {service.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Member Support Box */}
        <div className="bg-[#6cb166] rounded-3xl p-8 md:p-12 text-white shadow-xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-white bg-white/20 px-3 py-1 rounded-full border border-white/30">
              Professional Representation
            </span>
            <h2 className="text-3xl font-headline font-bold text-white">Advocacy for Sanitation Practitioners</h2>
            <p className="text-white/95 font-body text-base leading-relaxed">
              ASSSERVA represents sewage emptiers and sanitation service providers at national government institutions, local government bodies, and non-government stakeholders.
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
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
