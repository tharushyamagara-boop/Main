'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useContentStore } from '@/lib/content-store';

export function Footer() {
  const { contactInfo } = useContentStore();

  return (
    <footer className="w-full bg-[#3b66b0] text-white border-t border-white/10">

      {/* Full Width Main Footer Content */}
      <div className="w-full px-6 lg:px-12 py-[30px]">
        <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden p-1">
                <Image src="/logo.png" alt="ASSERWA Logo" width={44} height={44} className="object-contain w-full h-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-xl text-white tracking-tight">ASSERWA</span>
                <span className="text-[10px] text-white/80 font-body uppercase tracking-wider font-semibold">
                  Association of Sewage Emptiers in Rwanda
                </span>
              </div>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-body max-w-sm">
              ASSERWA is a non-governmental organization that brings together sewage emptiers and sanitation service providers in Rwanda to improve sanitation services, protect public health, and safeguard the environment.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-white">Sitemap</h4>
            <ul className="space-y-2.5 text-xs font-body">
              <li><Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-white/80 hover:text-white transition-colors">Who is ASSERWA?</Link></li>
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
            </ul>
          </div>

          {/* Col 4: Contact HQ */}
          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-white">Headquarters</h4>
            <ul className="space-y-3 text-xs font-body">
              <li className="text-white/80">
                <span>{contactInfo.address}</span>
              </li>
              <li className="text-white/80">
                <span>Phone: {contactInfo.phone}</span>
              </li>
              <li className="text-white/80">
                <span>Email: {contactInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-[30px] pt-[30px] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/80 font-headline uppercase tracking-wider">
          <p>© {new Date().getFullYear()} Association of Sewage Emptiers in Rwanda (ASSERWA). All rights reserved.</p>
          <div className="text-white">
            <span>Promoting Hygiene, Sanitation & Environmental Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
