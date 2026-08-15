import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tag, Calendar, User, MailCheck } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';

const newsItems = [
  {
    title: "ASSERWA Meets with WASAC to Discuss New Service Tariffs",
    excerpt: "High-level stakeholder engagement meeting focused on establishing transparent pricing frameworks for sewage emptying across all provinces.",
    date: "May 24, 2024",
    author: "Emery Kabera",
    tag: "Advocacy",
    imgId: "news-advocacy"
  },
  {
    title: "Professional Training: Modern Waste Treatment Techniques",
    excerpt: "Over 100 member representatives attended our intensive workshop on eco-friendly disposal and decentralized facility maintenance.",
    date: "June 12, 2024",
    author: "Alice Mukantwali",
    tag: "Technical Training",
    imgId: "member-training"
  },
  {
    title: "Community Outreach: Health & Hygiene Campaign in Bugesera",
    excerpt: "Collaborating with regional healthcare centers to educate facility managers on sanitation maintenance standards.",
    date: "June 05, 2024",
    author: "David Tuyizere",
    tag: "Community Health",
    imgId: "community-impact"
  }
];

export default function NewsPage() {
  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Press & Governance
          </span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Advocacy & News</h1>
          <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed">
            Stay informed on regulatory engagements, technical training schedules, and public health policy updates from ASSERWA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {newsItems.map((news, idx) => {
            const img = PlaceHolderImages.find(i => i.id === news.imgId);
            return (
              <Card key={idx} className="overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col rounded-2xl bg-white group">
                <div className="relative h-56 w-full overflow-hidden bg-[#6cb166]">
                  {img && (
                    <Image
                      src={img.imageUrl}
                      alt={news.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                      data-ai-hint={img.imageHint}
                    />
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#3b66b0] text-white text-[10px] font-headline font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                      <Tag className="w-3 h-3" /> {news.tag}
                    </span>
                  </div>
                </div>
                <CardContent className="p-7 flex-1 flex flex-col space-y-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-body">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#3b66b0]" /> {news.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#3b66b0]" /> {news.author}</span>
                  </div>
                  <h2 className="text-xl font-headline font-bold text-slate-900 leading-snug group-hover:text-[#3b66b0] transition-colors">
                    {news.title}
                  </h2>
                  <p className="text-sm text-slate-600 font-body leading-relaxed flex-1">
                    {news.excerpt}
                  </p>
                  <div className="pt-2 border-t border-slate-100">
                    <Button variant="ghost" className="p-0 h-auto text-[#3b66b0] font-headline font-bold text-xs hover:bg-transparent flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      Read Full Report <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Newsletter Box - Brand Green #6cb166 */}
        <div className="mt-20 py-12 bg-[#6cb166] text-white rounded-3xl px-8 md:px-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl border border-white/10">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-headline text-xs font-bold uppercase tracking-wider">
              <MailCheck className="w-4 h-4" /> Stakeholder Briefing
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">Subscribe to Regulatory Updates</h2>
            <p className="text-white/95 font-body text-sm max-w-xl">
              Receive monthly digests on tariff framework adjustments, national sanitation policies, and technical guidelines.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <Input className="w-full sm:w-80 bg-white/20 border-white/30 text-white placeholder:text-white/70 font-body" placeholder="Enter work email" />
            <Button className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold px-8 py-5 shadow-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
