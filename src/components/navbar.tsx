
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Droplets, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT', href: '/about' },
  { name: 'SERVICES', href: '/services' },
  { name: 'ARTICLES', href: '/news' },
  { name: 'GALLERY', href: '/gallery' },
  { name: 'CONTACT', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary shadow-md border-b border-white/10">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Droplets className="h-8 w-8 text-white" />
          <span className="font-headline font-bold text-xl tracking-tight text-white group-hover:opacity-90 transition-opacity">
            ASSERWA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-bold tracking-widest transition-all hover:text-white hover:scale-105",
                pathname === link.href ? "text-white underline underline-offset-4 decoration-2" : "text-white/80"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-md focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary p-4 flex flex-col gap-2 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "py-3 px-4 text-sm font-bold tracking-widest transition-colors rounded-md",
                pathname === link.href ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
