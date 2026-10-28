'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { useContentStore } from '@/lib/content-store';

export default function NewsPage() {
  const { news } = useContentStore();

  return (
    <div className="bg-slate-50/50 py-[30px] min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl space-y-[30px]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#3b66b0] text-xs font-bold uppercase tracking-wider">
            Official Announcements
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">
            Advocacy & News
          </h1>
          <p className="text-slate-600 font-body text-base md:text-lg leading-relaxed">
            Stay informed on institutional engagements, professional standards, regulatory updates, and community initiatives from ASSERWA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
          {news.map((item, idx) => {
            return (
              <Card key={item.id || idx} className="overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col rounded-2xl bg-white group">
                <Link href={`/news/${item.id}`} className="block relative h-56 w-full overflow-hidden bg-slate-900 cursor-pointer">
                  {item.imageUrl ? (
                    item.mediaType === 'video' || item.imageUrl.startsWith('data:video') || item.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={item.imageUrl}
                        preload="none"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        muted
                      />
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                        loading="lazy"
                        decoding="async"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3b66b0] to-[#25457d] p-6 text-center">
                      <span className="font-headline font-extrabold text-white text-lg opacity-90">
                        {item.tag || "ASSERWA News"}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#3b66b0] text-white text-[10px] font-headline font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 shadow-md">
                      {item.tag}
                    </span>
                  </div>
                </Link>

                <CardContent className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-body">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[120px]">{item.author}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-headline font-bold text-slate-900 leading-snug group-hover:text-[#3b66b0] transition-colors">
                      <Link href={`/news/${item.id}`} className="hover:underline">
                        {item.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-slate-600 font-body leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Button asChild size="sm" className="bg-[#3b66b0] hover:bg-[#25457d] text-white text-xs font-bold rounded-xl shadow-xs px-4 py-2">
                      <Link
                        href={`/news/${item.id}`}
                        className="inline-flex items-center gap-1.5"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>

                    <Link
                      href={`/news/${item.id}`}
                      className="text-[11px] text-slate-400 hover:text-slate-700 font-medium transition-colors"
                    >
                      Full Article →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Newsletter Box - Brand Green #6cb166 */}
        <div className="p-[30px] bg-[#6cb166] text-white rounded-3xl flex flex-col md:flex-row items-center gap-[30px] shadow-2xl border border-white/10">
          <div className="flex-1 space-y-3">
            <div className="text-white font-headline text-xs font-bold uppercase tracking-wider">
              Stakeholder Briefing
            </div>
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-white">Subscribe to ASSERWA Updates</h2>
            <p className="text-white/95 font-body text-sm max-w-xl">
              Get official announcements regarding sanitation guidelines and environmental protection initiatives.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <Input className="w-full sm:w-80 bg-white/20 border-white/30 text-white placeholder:text-white/70 font-body" placeholder="Enter your email" />
            <Button className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold px-8 py-5 shadow-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
