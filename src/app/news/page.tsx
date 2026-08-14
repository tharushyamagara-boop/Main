import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Tag } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';

const newsItems = [
  {
    title: "ASSERWA Meets with WASAC to Discuss New Tariffs",
    excerpt: "Stakeholder engagement meeting focused on ensuring fair pricing for sewage emptying services across all provinces.",
    date: "May 24, 2024",
    author: "Emery Kabera",
    tag: "Advocacy",
    imgId: "news-advocacy"
  },
  {
    title: "Professional Training: Modern Treatment Techniques",
    excerpt: "Over 100 members attended our workshop on eco-friendly disposal and decentralized treatment technologies.",
    date: "June 12, 2024",
    author: "Alice Mukantwali",
    tag: "Training",
    imgId: "member-training"
  },
  {
    title: "Community Outreach: Health Campaign in Bugesera",
    excerpt: "Partnering with local health clinics to promote better sanitation practices and facility maintenance.",
    date: "June 05, 2024",
    author: "David Tuyizere",
    tag: "Community",
    imgId: "community-impact"
  }
];

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mb-12 space-y-4">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Advocacy & Updates</h1>
        <p className="text-muted-foreground font-body text-lg">
          Keeping members and stakeholders informed on policy shifts, technical advancements, and community initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {newsItems.map((news, idx) => {
          const img = PlaceHolderImages.find(i => i.id === news.imgId);
          return (
            <Card key={idx} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
              <div className="relative h-56 w-full">
                {img && (
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    fill
                    className="object-cover"
                    data-ai-hint={img.imageHint}
                  />
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {news.tag}
                  </span>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span>{news.date}</span>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span>{news.author}</span>
                </div>
                <h2 className="text-xl font-headline font-bold text-secondary mb-3 leading-tight group-hover:text-primary transition-colors">
                  {news.title}
                </h2>
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6 flex-1">
                  {news.excerpt}
                </p>
                <Button variant="link" className="p-0 h-auto text-primary font-bold self-start group">
                  Read Full Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-20 py-12 border-y bg-slate-50/50 rounded-3xl px-8 md:px-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl md:text-3xl font-headline font-bold text-secondary">Stakeholder Newsletter</h2>
          <p className="text-muted-foreground font-body">
            Get monthly digests of policy updates, advocacy efforts, and technical research delivered directly to your inbox.
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <Input className="w-full sm:w-80" placeholder="Enter your email" />
          <Button className="bg-secondary hover:bg-secondary/90 text-white whitespace-nowrap px-8">Subscribe</Button>
        </div>
      </div>
    </div>
  );
}
