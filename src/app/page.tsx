import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BarChart3, Users, Droplets, ArrowRight, Award, CheckCircle2, FileText, Sparkles, Building2, Globe2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CountUp } from '@/components/count-up';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';

const heroSlides = [
  {
    title: "Advancing Rwanda's ",
    titleHighlight: "Sanitation Excellence",
    description: "Empowering professional sewage emptiers through advocacy, technical training, and standardized compliance to ensure a cleaner, healthier Rwanda for everyone.",
    imgId: "hero-sanitation",
    ctaPrimary: "Partner With Us",
    ctaSecondary: "View Impact Dashboard",
    hrefPrimary: "/contact",
    hrefSecondary: "/dashboard"
  },
  {
    title: "Professionalizing the ",
    titleHighlight: "Sanitation Sector",
    description: "Providing technical training and national certifications to ensure the highest standards of environmental safety and hygiene across all 30 districts.",
    imgId: "member-training",
    ctaPrimary: "Explore Our Services",
    ctaSecondary: "Knowledge Repository",
    hrefPrimary: "/services",
    hrefSecondary: "/resources"
  },
  {
    title: "Protecting Our ",
    titleHighlight: "Environment & Public Health",
    description: "Working alongside national regulators (RURA, WASAC) to protect public health through professionalized waste management and decentralized infrastructure.",
    imgId: "community-impact",
    ctaPrimary: "Get in Touch",
    ctaSecondary: "Compliance AI Check",
    hrefPrimary: "/contact",
    hrefSecondary: "/compliance"
  }
];

export default function Home() {
  const impactImg = PlaceHolderImages.find(img => img.id === 'community-impact');
  const trainingImg = PlaceHolderImages.find(img => img.id === 'member-training');

  return (
    <div className="flex flex-col w-full bg-slate-50/50">
      {/* Executive Hero Slideshow Section */}
      <section className="relative w-full overflow-hidden bg-slate-950">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroSlides.map((slide, index) => {
              const slideImg = PlaceHolderImages.find(img => img.id === slide.imgId);
              return (
                <CarouselItem key={index}>
                  <div className="relative h-[620px] md:h-[680px] w-full flex items-center">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                      {slideImg && (
                        <Image
                          src={slideImg.imageUrl}
                          alt={slide.title}
                          fill
                          className="object-cover brightness-[0.35] contrast-[1.05]"
                          priority={index === 0}
                          data-ai-hint={slideImg.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                    </div>

                    {/* Content Container */}
                    <div className="container mx-auto px-4 z-10 text-white">
                      <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-emerald-400 font-headline font-bold text-xs tracking-wide">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Official Association of Sewage Emptiers in Rwanda</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-extrabold leading-[1.15] text-white tracking-tight">
                          {slide.title}<span className="text-emerald-400">{slide.titleHighlight}</span>
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl font-body text-slate-300 max-w-2xl leading-relaxed">
                          {slide.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-headline font-bold px-8 shadow-lg shadow-emerald-950/50">
                            <Link href={slide.hrefPrimary} className="flex items-center gap-2">
                              {slide.ctaPrimary} <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button asChild size="lg" variant="outline" className="bg-slate-900/60 backdrop-blur-md border-slate-700 text-slate-100 hover:bg-slate-800 hover:text-white font-headline px-8">
                            <Link href={slide.hrefSecondary}>{slide.ctaSecondary}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <div className="absolute bottom-8 right-6 md:right-12 flex gap-3 z-20">
            <CarouselPrevious className="static translate-y-0 bg-slate-900/80 border-slate-700 text-white hover:bg-emerald-600 hover:border-emerald-500 h-11 w-11 rounded-xl shadow-lg transition-colors" />
            <CarouselNext className="static translate-y-0 bg-slate-900/80 border-slate-700 text-white hover:bg-emerald-600 hover:border-emerald-500 h-11 w-11 rounded-xl shadow-lg transition-colors" />
          </div>
        </Carousel>
      </section>

      {/* Institutional Partner Bar */}
      <section className="py-6 bg-slate-900 border-b border-slate-800 text-slate-400 text-xs font-headline font-bold">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>REGULATORY COLLABORATION & GOVERNANCE</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>RURA Certified Guidelines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>WASAC Alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ministry of Environment Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Impact Stats */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-emerald-500/50 transition-colors">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-emerald-400 mb-2">
                <CountUp end={16} />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-slate-300">Active Member Companies</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-emerald-500/50 transition-colors">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-emerald-400 mb-2">
                <CountUp end={30} suffix="+" />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-slate-300">Districts Supported</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-emerald-500/50 transition-colors">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-emerald-400 mb-2">
                <CountUp end={15} suffix="k+" />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-slate-300">Facilities Managed</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-emerald-500/50 transition-colors">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-emerald-400 mb-2">
                <CountUp end={50} suffix="+" />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-slate-300">Annual Trainings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Institutional Services & AI Capabilities */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Institutional Framework
            </span>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-900">Professionalizing Rwanda's Sanitation Sector</h2>
            <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed">
              We provide the tools, digital frameworks, and technical resources necessary for sanitation professionals to deliver safe, dignified, and compliant service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="group p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300">
                <ShieldCheck className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">GenAI Engine</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-3 text-slate-900">Compliance Evaluation</h3>
              <p className="text-slate-600 font-body text-sm mb-6 leading-relaxed flex-1">
                Evaluate technical service reports and facility maintenance plans against Rwandan national sanitation standards using our reasoning AI model.
              </p>
              <Link href="/compliance" className="text-emerald-700 font-headline font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
                Run Evaluation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service Card 2 */}
            <div className="group p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                <BarChart3 className="w-7 h-7 text-blue-700 group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 px-2 py-0.5 rounded">Analytics</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-3 text-slate-900">Impact Dashboard</h3>
              <p className="text-slate-600 font-body text-sm mb-6 leading-relaxed flex-1">
                Track real-time geographic coverage, waste volume managed (m³), and technical training metrics across all 30 districts.
              </p>
              <Link href="/dashboard" className="text-emerald-700 font-headline font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
                View Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service Card 3 */}
            <div className="group p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-600 transition-all duration-300">
                <Users className="w-7 h-7 text-amber-700 group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 px-2 py-0.5 rounded">Advocacy</span>
              </div>
              <h3 className="text-xl font-headline font-bold mb-3 text-slate-900">Advocacy & News</h3>
              <p className="text-slate-600 font-body text-sm mb-6 leading-relaxed flex-1">
                Stay updated with stakeholder engagements with RURA & WASAC, tariff policy discussions, and association initiatives.
              </p>
              <Link href="/news" className="text-emerald-700 font-headline font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
                Read Updates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Advocacy & Stakeholder Alignment */}
      <section className="py-24 bg-slate-100/80 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              {impactImg && (
                <Image
                  src={impactImg.imageUrl}
                  alt={impactImg.description}
                  fill
                  className="object-cover"
                  data-ai-hint={impactImg.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="font-headline font-bold text-lg">National Sanitation Standard Enforcement</p>
                  <p className="text-slate-300 text-xs font-body">Kigali & 30 Provinces Coverage</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300">
                Government & Public Health Partnership
              </span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-900">Advocating for Public Health, Ethics & Trust</h2>
              <p className="text-base text-slate-600 font-body leading-relaxed">
                ASSERWA acts as the vital institutional bridge between private sanitation practitioners and regulatory bodies including RURA, WASAC, and the Ministry of Environment. We represent our member companies while guaranteeing environmental integrity for the Rwandan public.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  "Technical capacity building for operators",
                  "Environmental safety & PPE standards",
                  "Standardized transparent tariff frameworks",
                  "Policy advocacy & institutional representation"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <Droplets className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-headline font-bold text-xs text-slate-800 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-headline text-sm font-bold px-8 shadow-lg">
                  <Link href="/contact">Inquire for Partnership</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-200 font-headline text-sm font-bold">
                  <Link href="/about">About Our Association</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-6">
          <Globe2 className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-white tracking-tight">
            Collaborate With ASSERWA for a Cleaner Rwanda
          </h2>
          <p className="text-slate-300 font-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We invite international development organizations, government agencies, and municipal authorities to partner with ASSERWA in advancing sustainable waste management.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-headline font-bold px-8 shadow-lg">
              <Link href="/contact">Contact Our Office</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
