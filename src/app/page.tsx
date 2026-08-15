import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BarChart3, Users, Droplets, ArrowRight, CheckCircle2, Building2, Globe2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CountUp } from '@/components/count-up';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const heroSlides = [
  {
    title: "Advancing Rwanda's ",
    titleHighlight: "Sanitation Excellence",
    description: "Empowering professional sewage emptiers through advocacy, technical training, and standardized compliance to ensure a cleaner, healthier Rwanda for everyone.",
    imgId: "hero-sanitation"
  },
  {
    title: "Professionalizing the ",
    titleHighlight: "Sanitation Sector",
    description: "Providing technical training and national certifications to ensure the highest standards of environmental safety and hygiene across all 30 districts.",
    imgId: "member-training"
  },
  {
    title: "Protecting Our ",
    titleHighlight: "Environment & Health",
    description: "Working alongside national regulators (RURA, WASAC) to protect public health through professionalized waste management and decentralized infrastructure.",
    imgId: "community-impact"
  }
];

export default function Home() {
  const impactImg = PlaceHolderImages.find(img => img.id === 'community-impact');

  return (
    <div className="flex flex-col w-full bg-slate-50/50 min-h-screen">
      {/* 100% Full Width Hero Slideshow Section */}
      <section className="relative w-full overflow-hidden bg-slate-100">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroSlides.map((slide, index) => {
              const slideImg = PlaceHolderImages.find(img => img.id === slide.imgId);
              return (
                <CarouselItem key={index}>
                  <div className="relative h-[460px] md:h-[520px] w-full flex items-center">
                    {/* Background Image spanning 100% full viewport width */}
                    <div className="absolute inset-0 z-0">
                      {slideImg && (
                        <Image
                          src={slideImg.imageUrl}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          data-ai-hint={slideImg.imageHint}
                        />
                      )}
                    </div>

                    {/* Compact White Background Slide Overlay */}
                    <div className="container mx-auto px-6 lg:px-12 z-10 relative">
                      <div className="max-w-lg space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-500 bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xl">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-extrabold leading-tight text-slate-900 tracking-tight">
                          {slide.title}<span className="text-[#6cb166]">{slide.titleHighlight}</span>
                        </h1>
                        <p className="text-xs sm:text-sm font-body text-slate-600 leading-relaxed">
                          {slide.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          
          <div className="absolute bottom-6 right-6 md:right-12 flex gap-2.5 z-20">
            <CarouselPrevious className="static translate-y-0 bg-white/90 border-slate-200 text-slate-800 hover:bg-[#3b66b0] hover:text-white hover:border-[#3b66b0] h-10 w-10 rounded-xl shadow-md transition-colors" />
            <CarouselNext className="static translate-y-0 bg-white/90 border-slate-200 text-slate-800 hover:bg-[#3b66b0] hover:text-white hover:border-[#3b66b0] h-10 w-10 rounded-xl shadow-md transition-colors" />
          </div>
        </Carousel>
      </section>

      {/* Institutional Partner Bar with Margins */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="py-5 px-8 bg-[#3b66b0] text-white text-xs font-headline font-bold rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <Building2 className="w-4 h-4 text-[#6cb166]" />
            <span>REGULATORY COLLABORATION & GOVERNANCE</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6cb166]" />
              <span>RURA Certified Guidelines</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6cb166]" />
              <span>WASAC Alignment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6cb166]" />
              <span>Ministry of Environment Compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Impact Stats with Margins */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="py-14 px-8 bg-[#6cb166] text-white rounded-3xl shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-2">
                <CountUp end={16} />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-white/90">Active Member Companies</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-2">
                <CountUp end={30} suffix="+" />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-white/90">Districts Supported</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-2">
                <CountUp end={15} suffix="k+" />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-white/90">Facilities Managed</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 text-center backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-2">
                <CountUp end={50} suffix="+" />
              </div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-white/90">Annual Trainings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Institutional Services with Margins */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#6cb166] bg-[#6cb166]/10 px-3.5 py-1 rounded-full border border-[#6cb166]/30">
            Institutional Framework
          </span>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-slate-900">Professionalizing Rwanda's Sanitation Sector</h2>
          <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed">
            We provide the tools, digital frameworks, and technical resources necessary for sanitation professionals to deliver safe, dignified, and compliant service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="group p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:border-[#6cb166]/50 transition-all duration-300 flex flex-col">
            <div className="w-14 h-14 bg-[#6cb166]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#6cb166] transition-all duration-300">
              <ShieldCheck className="w-7 h-7 text-[#6cb166] group-hover:text-white transition-colors" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6cb166] text-white px-2 py-0.5 rounded">GenAI Engine</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-3 text-slate-900">Compliance Evaluation</h3>
            <p className="text-slate-600 font-body text-sm mb-6 leading-relaxed flex-1">
              Evaluate technical service reports and facility maintenance plans against Rwandan national sanitation standards using our reasoning AI model.
            </p>
            <Link href="/compliance" className="text-[#3b66b0] font-headline font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
              Run Evaluation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service Card 2 */}
          <div className="group p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:border-[#3b66b0]/50 transition-all duration-300 flex flex-col">
            <div className="w-14 h-14 bg-[#3b66b0]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#3b66b0] transition-all duration-300">
              <BarChart3 className="w-7 h-7 text-[#3b66b0] group-hover:text-white transition-colors" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#3b66b0] text-white px-2 py-0.5 rounded">Analytics</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-3 text-slate-900">Impact Dashboard</h3>
            <p className="text-slate-600 font-body text-sm mb-6 leading-relaxed flex-1">
              Track real-time geographic coverage, waste volume managed (m³), and technical training metrics across all 30 districts.
            </p>
            <Link href="/dashboard" className="text-[#3b66b0] font-headline font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Service Card 3 */}
          <div className="group p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:border-[#6cb166]/50 transition-all duration-300 flex flex-col">
            <div className="w-14 h-14 bg-[#6cb166]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#6cb166] transition-all duration-300">
              <Users className="w-7 h-7 text-[#6cb166] group-hover:text-white transition-colors" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 px-2 py-0.5 rounded">Advocacy</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-3 text-slate-900">Advocacy & News</h3>
            <p className="text-slate-600 font-body text-sm mb-6 leading-relaxed flex-1">
              Stay updated with stakeholder engagements with RURA & WASAC, tariff policy discussions, and association initiatives.
            </p>
            <Link href="/news" className="text-[#3b66b0] font-headline font-bold text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform mt-auto">
              Read Updates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Advocacy Section with Margins */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="p-8 md:p-12 bg-white rounded-3xl border border-slate-200 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 relative h-[420px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              {impactImg && (
                <Image
                  src={impactImg.imageUrl}
                  alt={impactImg.description}
                  fill
                  className="object-cover"
                  data-ai-hint={impactImg.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3b66b0]/90 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="font-headline font-bold text-base">National Sanitation Standard Enforcement</p>
                  <p className="text-slate-200 text-xs font-body">Kigali & 30 Provinces Coverage</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
                Government & Public Health Partnership
              </span>
              <h2 className="text-3xl font-headline font-bold text-slate-900">Advocating for Public Health, Ethics & Trust</h2>
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
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <Droplets className="w-5 h-5 text-[#6cb166] shrink-0 mt-0.5" />
                    <span className="font-headline font-bold text-xs text-slate-800 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-sm font-bold px-8 shadow-lg">
                  <Link href="/contact">Inquire for Partnership</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-[#6cb166] text-[#4d8748] hover:bg-[#6cb166]/10 font-headline text-sm font-bold">
                  <Link href="/about">About Our Association</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Call to Action with Margins */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16 w-full">
        <div className="py-16 px-8 bg-[#6cb166] text-white rounded-3xl shadow-xl text-center space-y-6">
          <Globe2 className="w-12 h-12 text-white mx-auto opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-white tracking-tight">
            Collaborate With ASSERWA for a Cleaner Rwanda
          </h2>
          <p className="text-white/95 font-body text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We invite international development organizations, government agencies, and municipal authorities to partner with ASSERWA in advancing sustainable waste management.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-sm font-bold px-8 shadow-lg">
              <Link href="/contact">Contact Our Office</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
