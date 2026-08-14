
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Droplets, Users, BarChart3, BookOpen, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheck },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'News', href: '/news', icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Droplets className="h-8 w-8 text-primary" />
          <span className="font-headline font-bold text-xl tracking-tight text-secondary">
            ASSERWA<span className="text-primary">PORTAL</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-border mx-2" />
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-white font-headline uppercase tracking-wider text-xs px-6 py-2">
            <Link href="/register">Register</Link>
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-primary focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 py-2 text-base font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
          <Button asChild variant="default" className="w-full mt-2" onClick={() => setIsOpen(false)}>
            <Link href="/register">Register Member</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
