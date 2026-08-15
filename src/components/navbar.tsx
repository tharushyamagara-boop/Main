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
    <header className="sticky top-0 z-50 w-full shadow-lg">
      {/* Full Width Top Header Bar */}
      <div className="w-full bg-[#2b4c85] text-white/90 text-xs py-2.5 px-6 lg:px-12 border-b border-white/10 hidden sm:block">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="h-3.5 w-3.5 text-[#6cb166]" />
              <span>Nyarugenge, KN 2 St, Kigali, Rwanda</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#6cb166]" />
              <span>+250 788 000 000</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#6cb166]" />
              <span>info@asserwa.org.rw</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 bg-[#6cb166]/20 border border-[#6cb166]/40 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-[#6cb166]" />
              Official National Association
            </span>
          </div>
        </div>
      </div>

      {/* Full Width Main Navbar - Brand Blue #3b66b0 */}
      <nav className="w-full bg-[#3b66b0] text-white shadow-md border-b border-white/10 px-6 lg:px-12">
        <div className="w-full flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#6cb166] flex items-center justify-center shadow-md shadow-blue-900/30 group-hover:scale-105 transition-transform">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl tracking-tight text-white group-hover:opacity-90 transition-opacity">
                ASSERWA
              </span>
              <span className="text-[10px] text-white/80 font-body uppercase tracking-wider font-semibold">
                Sewage Emptiers Association Rwanda
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-bold tracking-wider transition-all duration-200 relative py-2 hover:text-[#6cb166] flex items-center gap-1.5",
                    isActive ? "text-white font-extrabold" : "text-white/80"
                  )}
                >
                  {link.name}
                  {link.isBadge && (
                    <span className="bg-[#6cb166] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full tracking-normal">
                      AI
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6cb166] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Primary CTA */}
          <div className="hidden lg:flex items-center">
            <Button asChild size="sm" className="bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold px-5 shadow-md">
              <Link href="/contact" className="flex items-center gap-1.5">
                Inquire <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#3b66b0] p-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "py-2.5 px-4 text-xs font-bold tracking-wider rounded-lg transition-colors flex items-center justify-between",
                    isActive ? "bg-[#2b4c85] text-white border border-white/20" : "text-white/80 hover:bg-white/10 hover:text-white"
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
            <div className="pt-3 border-t border-white/10 mt-2">
              <Button asChild className="w-full bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold">
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
