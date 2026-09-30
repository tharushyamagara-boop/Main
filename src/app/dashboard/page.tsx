'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Search,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { MemberCompany, subscribeToMemberCompanies, DEFAULT_MEMBER_COMPANIES } from '@/lib/members';

export default function DashboardPage() {
  const [members, setMembers] = useState<MemberCompany[]>(
    DEFAULT_MEMBER_COMPANIES.filter(m => m.active !== false)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const unsubscribe = subscribeToMemberCompanies((data) => {
      setMembers(data.filter(m => m.active !== false));
    });
    return () => unsubscribe();
  }, []);

  const categories = ['All', ...Array.from(new Set(members.map(m => m.category)))];

  const filteredMembers = members.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.headquarters.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || member.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50/50 py-10 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        
        {/* Header Banner */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1.5 rounded-full border border-[#3b66b0]/20">
            <Building2 className="w-3.5 h-3.5 text-[#3b66b0]" />
            <span>Official ASSERWA Member Directory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900">
            Certified Member Companies & Service Providers
          </h1>
          <p className="text-slate-600 font-body text-base max-w-2xl leading-relaxed">
            Verified roster of certified sanitation companies, vacuum tanker operators, and fecal sludge management enterprises affiliated with ASSERWA across Rwanda.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member company or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b66b0]/30 focus:border-[#3b66b0]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#3b66b0] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              <CardHeader className="p-5 pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {member.logoUrl ? (
                      <img
                        src={member.logoUrl}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-0.5 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b66b0] to-[#254479] text-white flex items-center justify-center font-headline font-bold text-sm shadow-xs shrink-0">
                        {member.logoText || member.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <CardTitle className="text-base font-headline font-bold text-slate-900 line-clamp-1 group-hover:text-[#3b66b0] transition-colors">
                        {member.name}
                      </CardTitle>
                      <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
                        {member.category}
                      </span>
                    </div>
                  </div>
                  
                  {member.verified && (
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] shrink-0 font-bold flex items-center gap-1 px-2 py-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Certified</span>
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {member.briefDescription || member.description}
                </p>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.headquarters}</span>
                  </div>
                  {member.fleet && (
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.fleet}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:text-[#3b66b0] hover:underline font-medium">
                      {member.phone}
                    </a>
                  </div>
                </div>

                {/* Actions: Visit Website & Book Service */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  {member.websiteUrl ? (
                    <a
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-[#3b66b0] hover:text-white border border-slate-200 hover:border-[#3b66b0] text-[#3b66b0] text-xs font-semibold transition-all shadow-2xs group/btn"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <div className="flex-1 text-center py-2 text-[11px] text-slate-400 font-medium">
                      ASSERWA Certified Member
                    </div>
                  )}

                  <Button asChild size="sm" className="bg-[#6cb166] hover:bg-[#5aa054] text-white text-xs font-semibold rounded-xl px-3 shadow-xs">
                    <Link href={`/book?memberId=${member.id}`}>
                      <span>Book</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Regulatory Protection Callout */}
        <div className="p-8 bg-gradient-to-br from-[#3b66b0] to-[#274883] text-white rounded-3xl shadow-md space-y-3 text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-white">
            <ShieldCheck className="w-6 h-6 text-[#6cb166]" />
          </div>
          <h3 className="text-xl font-headline font-bold">Verified Professional Membership Standards</h3>
          <p className="text-xs font-body text-white/90 leading-relaxed max-w-xl mx-auto">
            All member companies listed in the ASSERWA directory adhere to national environmental guidelines, RURA sanitation regulatory standards, and public health safety protocols across Rwanda.
          </p>
        </div>

      </div>
    </div>
  );
}

