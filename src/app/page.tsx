import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShieldCheck, BarChart3, Users, Droplets, ArrowRight } from 'lucide-react';
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
    description: "Empowering professional sewage emptiers through advocacy, training, and standardized compliance to ensure a cleaner, healthier Rwanda for everyone.",
    imgId: "hero-sanitation",
    ctaPrimary: "Partner With Us",
    ctaSecondary: "View Our Impact"
  },
  {
    title: "Professionalizing the ",
    titleHighlight: "Sanitation Sector",
    description: "Providing technical training and certifications to ensure the highest standards of hygiene and environmental safety across all provinces.",
    imgId: "member-training",
    ctaPrimary: "Learn About Us",
    ctaSecondary: "Member Resources"
  },
  {
    title: "Protecting Our ",
    titleHighlight: "Environment & Health",
    description: "Working across all 30 districts to protect public health through professionalized waste management and infrastructure development.",
    imgId: "community-impact",
    ctaPrimary: "Get in Touch",
    ctaSecondary: "Impact Dashboard"
  }
];

export default function Home() {
  const impactImg = PlaceHolderImages.find(img => img.id === 'community-impact');

  return (
    <div className="flex flex-col w-full">
      {/* Hero Slideshow Section */}
      <section className="relative w-full overflow-hidden bg-slate-900">
        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {heroSlides.map((slide, index) => {
              const slideImg = PlaceHolderImages.find(img => img.id === slide.imgId);
              return (
                <CarouselItem key={index}>
                  <div className="relative h-[650px] w-full flex items-center">
                    <div className="absolute inset-0 z-0">
                      {slideImg && (
                        <Image
                          src={slideImg.imageUrl}
                          alt={slideImg.description}
                          fill
                          className="object-cover brightness-[0.35]"
                          priority={index === 0}
                          data-ai-hint={slideImg.imageHint}
                        />
                      )}
                    </div>
                    <div className="container mx-auto px-4 z-10 text-white">
                      <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl md:text-6xl font-headline font-bold leading-tight">
                          {slide.title}<span className="text-primary">{slide.titleHighlight}</span>
                        </h1>
                        <p className="text-lg md:text-xl font-body text-slate-200 max-w-2xl">
                          {slide.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-headline px-8">
                            <Link href="/contact">{slide.ctaPrimary}</Link>
                          </Button>
                          <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-headline px-8">
                            <Link href="/dashboard">{slide.ctaSecondary}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="absolute bottom-8 right-16 flex gap-2 z-20">
            <CarouselPrevious className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12" />
            <CarouselNext className="static translate-y-0 bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12" />
          </div>
        </Carousel>
      </section>

      {/* Quick Impact Stats */}
      <section className="py-12 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-headline font-bold text-primary mb-1">
                <CountUp end={16} />
              </div>
              <div className="text-sm font-headline uppercase tracking-wider text-slate-300">Active Members</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-headline font-bold text-primary mb-1">
                <CountUp end={30} suffix="+" />
              </div>
              <div className="text-sm font-headline uppercase tracking-wider text-slate-300">Districts Supported</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-headline font-bold text-primary mb-1">
                <CountUp end={15} suffix="k+" />
              </div>
              <div className="text-sm font-headline uppercase tracking-wider text-slate-300">Facilities Managed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-headline font-bold text-primary mb-1">
                <CountUp end={50} suffix="+" />
              </div>
              <div className="text-sm font-headline uppercase tracking-wider text-slate-300">Annual Trainings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features / Services */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Professionalizing the Industry</h2>
            <p className="text-muted-foreground font-body text-lg">
              We provide the tools and resources necessary for sanitation professionals to excel and comply with Rwandan national standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 border rounded-2xl hover:shadow-xl transition-all duration-300 bg-slate-50/50">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4 text-secondary">Compliance AI</h3>
              <p className="text-muted-foreground font-body mb-6">
                Evaluate your service reports and maintenance plans against national standards using our GenAI reasoning engine.
              </p>
              <Link href="/compliance" className="text-primary font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Start Evaluation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="group p-8 border rounded-2xl hover:shadow-xl transition-all duration-300 bg-slate-50/50">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4 text-secondary">Impact Dashboard</h3>
              <p className="text-muted-foreground font-body mb-6">
                Track real-time statistics of sanitation initiatives, community reach, and professional growth across all districts.
              </p>
              <Link href="/dashboard" className="text-primary font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                View Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="group p-8 border rounded-2xl hover:shadow-xl transition-all duration-300 bg-slate-50/50">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-4 text-secondary">Advocacy & News</h3>
              <p className="text-muted-foreground font-body mb-6">
                Stay updated with the latest stakeholder engagements, policy changes, and association initiatives.
              </p>
              <Link href="/news" className="text-primary font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Read Latest <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with Image */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              {impactImg && (
                <Image
                  src={impactImg.imageUrl}
                  alt={impactImg.description}
                  fill
                  className="object-cover"
                  data-ai-hint={impactImg.imageHint}
                />
              )}
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Advocating for Public Health & Trust</h2>
              <p className="text-lg text-muted-foreground font-body leading-relaxed">
                ASSERWA acts as a bridge between practitioners and government bodies like RURA and WASAC. We represent the interests of our members while ensuring the highest standards of hygiene for the Rwandan public.
              </p>
              <ul className="space-y-4">
                {[
                  "Technical capacity building for members",
                  "Environmental protection initiatives",
                  "Standardized pricing and service delivery",
                  "Government partnership and policy advocacy"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-body font-semibold text-secondary">
                    <Droplets className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                <Button asChild className="bg-secondary hover:bg-secondary/90 text-white font-headline">
                  <Link href="/contact">Inquire for Partnership</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
