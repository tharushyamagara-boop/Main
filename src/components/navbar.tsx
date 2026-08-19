'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useContentStore } from '@/lib/content-store';

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT US', href: '/about' },
  { name: 'OBJECTIVES', href: '/compliance' },
  { name: 'SERVICES', href: '/services' },
  { name: 'MEMBER NETWORK', href: '/dashboard' },
  { name: 'RESOURCES', href: '/resources' },
  { name: 'ADVOCACY & NEWS', href: '/news' },
  { name: 'GALLERY', href: '/gallery' },
  { name: 'SYMPOSIUM 2026', href: '/register', isBadge: true },
  { name: 'CONTACT', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { contactInfo } = useContentStore();

  return (
    <div className="w-full">
      {/* Top Header Bar (Contact Information) */}
      <div className="w-full bg-transparent text-slate-700 text-xs py-2.5 px-6 lg:px-12 border-b border-slate-200/60 hidden sm:block">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-6 text-xs">
            <span className="truncate max-w-xs md:max-w-md">{contactInfo.address}</span>
            <span className="text-slate-300">•</span>
            <span className="whitespace-nowrap">{contactInfo.phone}</span>
            <span className="text-slate-300">•</span>
            <span className="whitespace-nowrap">{contactInfo.email}</span>
          </div>
        </div>
      </div>

      {/* Sticky Main Navigation Header */}
      <header className="sticky top-0 z-50 w-full shadow-md bg-[#6cb166]">
        <nav className="w-full bg-[#6cb166] text-white px-5 lg:px-8 xl:px-12">
          <div className="w-full flex h-20 items-center justify-between">
            
            {/* Brand Logo Group - 2-line subtitle for clean fit without overflow */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 mr-3 lg:mr-5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden p-1 shrink-0">
                <Image src="/logo.png" alt="ASSERWA Logo" width={48} height={48} className="object-contain w-full h-full" priority />
              </div>
              <div className="flex flex-col max-w-[140px] sm:max-w-[170px]">
                <span className="font-headline font-bold text-lg sm:text-xl tracking-tight text-[#3b66b0] group-hover:opacity-90 transition-opacity drop-shadow-sm leading-tight">
                  ASSERWA
                </span>
                <span className="text-[9px] sm:text-[10px] text-white/90 font-body uppercase tracking-wider font-semibold leading-tight">
                  Forum of Sewage Emptiers in Rwanda
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Group (Links + CTA) */}
            <div className="hidden xl:flex items-center gap-2 2xl:gap-4 flex-nowrap shrink-0 ml-auto">
              <div className="flex items-center gap-1.5 xl:gap-2 2xl:gap-3.5 flex-nowrap">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;

                  if (link.isBadge) {
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "text-[10px] 2xl:text-xs font-headline font-bold px-2 py-1 2xl:px-2.5 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-1 shrink-0 shadow-sm",
                          isActive
                            ? "bg-white text-[#3b66b0] shadow-md"
                            : "bg-[#3b66b0]/40 text-white hover:bg-[#3b66b0]/70 border border-white/20"
                        )}
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-[11px] 2xl:text-xs font-bold tracking-tight 2xl:tracking-wider whitespace-nowrap transition-all duration-200 relative py-2 px-1 hover:text-white flex items-center shrink-0",
                        isActive ? "text-white font-extrabold" : "text-white/85"
                      )}
                    >
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Primary CTA Button */}
              <Button asChild size="sm" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold px-3.5 2xl:px-5 shadow-md whitespace-nowrap shrink-0 ml-1">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>

            {/* Mobile / Tablet Nav Toggle Button */}
            <button
              className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg focus:outline-none shrink-0"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile / Tablet Dropdown Menu */}
          {isOpen && (
            <div className="xl:hidden border-t border-white/10 bg-[#6cb166] p-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "py-2.5 px-4 text-xs font-bold tracking-wider rounded-lg transition-colors flex items-center justify-between",
                      isActive ? "bg-[#4d8748] text-white border border-white/20" : "text-white/85 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span>{link.name}</span>
                    {link.isBadge && (
                      <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Event
                      </span>
                    )}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-white/10 mt-2">
                <Button asChild className="w-full bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Contact ASSERWA
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
}
