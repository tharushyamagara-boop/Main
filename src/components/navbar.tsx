'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
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
          <div className="flex items-center gap-6">
            <span className="truncate max-w-xs md:max-w-md">{contactInfo.address}</span>
            <span className="text-slate-300">•</span>
            <span>{contactInfo.phone}</span>
            <span className="text-slate-300">•</span>
            <span>{contactInfo.email}</span>
          </div>
        </div>
      </div>

      {/* Sticky Main Navigation Header */}
      <header className="sticky top-0 z-50 w-full shadow-md bg-[#6cb166]">
        <nav className="w-full bg-[#6cb166] text-white px-6 lg:px-12">
          <div className="w-full flex h-20 items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden p-1">
                <Image src="/logo.png" alt="ASSERWA Logo" width={44} height={44} className="object-contain w-full h-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-xl tracking-tight text-white group-hover:opacity-90 transition-opacity">
                  ASSERWA
                </span>
                <span className="text-[10px] text-white/90 font-body uppercase tracking-wider font-semibold">
                  Association of Sewage Emptiers in Rwanda
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-xs font-bold tracking-wider transition-all duration-200 relative py-2 hover:text-white flex items-center gap-1.5",
                      isActive ? "text-white font-extrabold" : "text-white/85"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Primary CTA */}
            <div className="hidden lg:flex items-center">
              <Button asChild size="sm" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold px-5 shadow-md">
                <Link href="/contact">
                  Contact Us
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
            <div className="lg:hidden border-t border-white/10 bg-[#6cb166] p-4 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300">
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
