'use client';

import Link from 'next/link';
import { Droplets, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ShieldCheck, Globe, Settings } from 'lucide-react';
import { useContentStore } from '@/lib/content-store';

export function Footer() {
  const { contactInfo } = useContentStore();

  return (
    <footer className="w-full bg-[#3b66b0] text-white border-t border-white/10">
      {/* Top Slogan Banner */}
      <div className="w-full border-b border-white/10 bg-[#2b4c85] py-6 px-6 lg:px-12">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-white font-headline font-bold">
            <ShieldCheck className="w-4 h-4 text-[#6cb166]" />
            <span>OFFICIAL SLOGAN:</span>
          </div>
          <div className="text-center md:text-right text-white/90 font-semibold italic">
            "{contactInfo.slogan}"
            <span className="block text-[11px] text-white/70 font-normal mt-0.5">
              (Kinyarwanda: "{contactInfo.sloganKinyarwanda}")
            </span>
          </div>
        </div>
      </div>

      {/* Full Width Main Footer Content */}
      <div className="w-full px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6cb166] flex items-center justify-center shadow-md">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-xl text-white tracking-tight">ASSSERVA</span>
                <span className="text-[10px] text-white/80 font-body uppercase tracking-wider font-semibold">
                  Association of Sewage Emptiers in Rwanda
                </span>
              </div>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-body max-w-sm">
              ASSSERVA is a non-governmental organization that brings together sewage emptiers and sanitation service providers in Rwanda to improve sanitation services, protect public health, and safeguard the environment.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="#" className="w-8 h-8 rounded-lg bg-[#2b4c85] hover:bg-[#6cb166] hover:text-white flex items-center justify-center text-white/90 transition-colors border border-white/10">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg bg-[#2b4c85] hover:bg-[#6cb166] hover:text-white flex items-center justify-center text-white/90 transition-colors border border-white/10">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-lg bg-[#2b4c85] hover:bg-[#6cb166] hover:text-white flex items-center justify-center text-white/90 transition-colors border border-white/10">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-white">Sitemap</h4>
            <ul className="space-y-2.5 text-xs font-body">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-white/80 hover:text-white transition-colors">Who is ASSSERVA?</Link></li>
              <li><Link href="/compliance" className="text-white/80 hover:text-white transition-colors">Organization Objectives</Link></li>
              <li><Link href="/services" className="text-white/80 hover:text-white transition-colors">Areas of Operation</Link></li>
              <li><Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">Member Companies</Link></li>
            </ul>
          </div>

          {/* Col 3: Resources & Admin */}
          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-white">Administration</h4>
            <ul className="space-y-2.5 text-xs font-body">
              <li><Link href="/resources" className="text-white/80 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/news" className="text-white/80 hover:text-white transition-colors">Advocacy & Updates</Link></li>
              <li><Link href="/gallery" className="text-white/80 hover:text-white transition-colors">Sanitation Gallery</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact Headquarters</Link></li>
              <li><Link href="/admin" className="text-emerald-300 font-bold hover:text-white flex items-center gap-1.5 mt-2"><Settings className="w-3.5 h-3.5" /> Content Admin Panel</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact HQ */}
          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-white">Headquarters</h4>
            <ul className="space-y-3 text-xs font-body">
              <li className="flex items-start gap-2.5 text-white/80">
                <MapPin className="h-4 w-4 mt-0.5 text-[#6cb166] shrink-0" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/80">
                <Phone className="h-4 w-4 text-[#6cb166] shrink-0" />
                <span>{contactInfo.phone}</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/80">
                <Mail className="h-4 w-4 text-[#6cb166] shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/80 font-headline uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Association of Sewage Emptiers in Rwanda (ASSSERVA). All rights reserved.</p>
          <div className="flex items-center gap-2 text-white">
            <Globe className="w-3.5 h-3.5 text-[#6cb166]" />
            <span>Promoting Hygiene, Sanitation & Environmental Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
