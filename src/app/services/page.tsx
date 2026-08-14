
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, BarChart3, BookOpen, HardHat, Droplets, CheckCircle } from 'lucide-react';

const services = [
  {
    title: "Compliance Evaluation",
    description: "Our AI-powered tool analyzes technical reports against Rwandan national standards.",
    icon: ShieldCheck,
    link: "/compliance",
    cta: "Run Check"
  },
  {
    title: "Impact Monitoring",
    description: "Visualizing the reach and effectiveness of sanitation projects across all provinces.",
    icon: BarChart3,
    link: "/dashboard",
    cta: "View Stats"
  },
  {
    title: "Technical Resources",
    description: "Access a library of manuals, guidelines, and research papers for practitioners.",
    icon: BookOpen,
    link: "/resources",
    cta: "Access Library"
  }
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-secondary">Our Services</h1>
        <p className="text-lg text-muted-foreground font-body leading-relaxed">
          ASSERWA provides technical support, professional advocacy, and standardized tools to empower sanitation experts and protect public health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {services.map((service, idx) => (
          <Card key={idx} className="flex flex-col border-primary/10 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-headline text-xl text-secondary">{service.title}</CardTitle>
              <CardDescription className="font-body text-sm leading-relaxed">{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="outline" className="w-full font-headline border-primary text-primary hover:bg-primary hover:text-white">
                <Link href={service.link}>{service.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-secondary rounded-3xl p-8 md:p-12 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-headline font-bold">Professional Support for Members</h2>
            <p className="text-slate-300 font-body text-lg">
              Beyond digital tools, we offer hands-on support for our 16 association members and their operations.
            </p>
            <ul className="space-y-4">
              {[
                "Government Policy Advocacy (RURA, WASAC)",
                "Standardized Pricing Frameworks",
                "Advanced Field Equipment Training",
                "Health & Safety Certifications"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-body text-sm font-semibold">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <HardHat className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-headline font-bold">Field Ops</h4>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <Droplets className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-headline font-bold">Hygiene</h4>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-headline font-bold">Standards</h4>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-headline font-bold">Reporting</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
