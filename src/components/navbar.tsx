'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Droplets, Menu, X, Phone, Mail, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT US', href: '/about' },
  { name: 'SERVICES', href: '/services' },
  { name: 'IMPACT DASHBOARD', href: '/dashboard' },
  { name: 'COMPLIANCE AI', href: '/compliance', isBadge: true },
  { name: 'RESOURCES', href: '/resources' },
  { name: 'ADVOCACY & NEWS', href: '/news' },
  { name: 'GALLERY', href: '/gallery' },
  { name: 'CONTACT', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm border-b border-slate-200 bg-white">
      {/* Full Width Top Header Bar - White Background */}
      <div className="w-full bg-white text-slate-600 text-xs py-2.5 px-6 lg:px-12 border-b border-slate-200 hidden sm:block">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-[#3b66b0] transition-colors">
              <MapPin className="h-3.5 w-3.5 text-[#6cb166]" />
              <span>Nyarugenge, KN 2 St, Kigali, Rwanda</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#3b66b0] transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#6cb166]" />
              <span>+250 788 000 000</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-[#3b66b0] transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#6cb166]" />
              <span>info@asserwa.org.rw</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 bg-[#6cb166]/10 border border-[#6cb166]/30 text-[#4d8748] px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-[#6cb166]" />
              Official National Association
            </span>
          </div>
        </div>
      </div>

      {/* Full Width Main Navbar - White Background */}
      <nav className="w-full bg-white text-slate-900 px-6 lg:px-12">
        <div className="w-full flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#3b66b0] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl tracking-tight text-[#3b66b0] group-hover:text-[#2b4c85] transition-colors">
                ASSERWA
              </span>
              <span className="text-[10px] text-slate-500 font-body uppercase tracking-wider font-semibold">
                Sewage Emptiers Association Rwanda
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-bold tracking-wider transition-all duration-200 relative py-2 hover:text-[#3b66b0] flex items-center gap-1.5",
                    isActive ? "text-[#3b66b0] font-extrabold" : "text-slate-700"
                  )}
                >
                  {link.name}
                  {link.isBadge && (
                    <span className="bg-[#6cb166] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full tracking-normal">
                      AI
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b66b0] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Primary CTA */}
          <div className="hidden lg:flex items-center">
            <Button asChild size="sm" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold px-5 shadow-sm">
              <Link href="/contact" className="flex items-center gap-1.5">
                Inquire <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white p-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "py-2.5 px-4 text-xs font-bold tracking-wider rounded-lg transition-colors flex items-center justify-between",
                    isActive ? "bg-slate-100 text-[#3b66b0] border border-slate-200" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <span>{link.name}</span>
                  {link.isBadge && (
                    <span className="bg-[#6cb166] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                      GenAI
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-200 mt-2">
              <Button asChild className="w-full bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Partner With ASSERWA
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
