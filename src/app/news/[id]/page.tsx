'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useContentStore } from '@/lib/content-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, Calendar, User, Share2, Check, 
  ArrowRight, Bookmark, Building2, ExternalLink
} from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params?.id as string;
  const { news } = useContentStore();
  const [copied, setCopied] = useState(false);

  const article = news.find((item) => item.id === articleId) || news.find((item) => item.id === decodeURIComponent(articleId));
  const relatedArticles = news.filter((item) => item.id !== article?.id).slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!article) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#3b66b0] flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-headline font-bold text-slate-900">Article Not Found</h1>
          <p className="text-sm text-slate-600 font-body">
            The advocacy or news update you are looking for may have been archived or removed.
          </p>
          <Button asChild className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold px-6">
            <Link href="/news" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All News</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Parse paragraphs from body
  const paragraphs = (article.body || article.excerpt || "")
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <article className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-[#3b66b0] hover:bg-white -ml-2 text-xs font-semibold self-start"
          >
            <Link href="/news" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Advocacy & News</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="bg-white border-slate-200 text-slate-700 hover:text-[#3b66b0] text-xs font-semibold h-8 px-3 rounded-xl shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600 mr-1.5" />
                  <span className="text-green-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Share Article</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Article Container */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-md overflow-hidden p-6 sm:p-10 lg:p-12 space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-[#3b66b0] text-white text-[11px] font-headline font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-2xs">
                {article.tag || "Advocacy"}
              </span>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-body">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Published on {article.date}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-body">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{article.author}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>
          </div>

          {/* Featured Photo or Video */}
          {article.imageUrl && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-md">
              {article.mediaType === 'video' || article.imageUrl.startsWith('data:video') || article.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={article.imageUrl}
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  decoding="async"
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>
          )}

          {/* Lead Excerpt Callout */}
          {article.excerpt && (
            <div className="p-5 sm:p-6 bg-blue-50/60 border-l-4 border-[#3b66b0] rounded-r-2xl">
              <p className="text-base sm:text-lg font-headline font-semibold text-slate-800 leading-relaxed italic">
                "{article.excerpt}"
              </p>
            </div>
          )}

          {/* Full Article Body Paragraphs */}
          <div className="prose prose-slate max-w-none space-y-5 text-slate-700 font-body text-base sm:text-lg leading-relaxed pt-2">
            {paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-slate-700 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          {/* Article Footer & Disclaimers */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <span>Official Release by </span>
              <strong className="text-slate-800 font-semibold">{article.author || "ASSERWA Secretariat"}</strong>
              <span> • Forum of Sewage Emptiers in Rwanda</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className="border-slate-200 text-xs font-semibold text-slate-700">
                <Link href="/contact">
                  <span>Press Inquiries</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* More Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-slate-900">
                More Advocacy & News Updates
              </h2>
              <Button asChild variant="link" className="text-[#3b66b0] text-xs font-bold p-0">
                <Link href="/news" className="flex items-center gap-1">
                  <span>View All Updates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((rel, rIdx) => (
                <Card key={rel.id || rIdx} className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white flex flex-col group">
                  <Link href={`/news/${rel.id}`} className="block relative h-40 w-full overflow-hidden bg-slate-900">
                    {rel.imageUrl ? (
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3b66b0] to-[#25457d] p-4 text-center">
                        <span className="font-headline font-bold text-white text-sm">
                          {rel.tag || "ASSERWA"}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-[#3b66b0] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {rel.tag}
                    </span>
                  </Link>

                  <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {rel.date}
                    </span>
                    <h3 className="text-sm font-headline font-bold text-slate-900 line-clamp-2 group-hover:text-[#3b66b0] transition-colors leading-snug">
                      <Link href={`/news/${rel.id}`}>
                        {rel.title}
                      </Link>
                    </h3>
                    <Link
                      href={`/news/${rel.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#3b66b0] pt-2"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

