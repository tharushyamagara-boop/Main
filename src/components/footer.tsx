
import Link from 'next/link';
import { Droplets, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-slate-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="font-headline font-bold text-lg text-secondary">ASSERWA</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Association of Sewage Emptiers in Rwanda is dedicated to professionalizing sanitation services and protecting our environment.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-sm mb-4 uppercase tracking-wider text-secondary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-primary">Impact Dashboard</Link></li>
              <li><Link href="/compliance" className="text-muted-foreground hover:text-primary">Compliance Tool</Link></li>
              <li><Link href="/resources" className="text-muted-foreground hover:text-primary">Knowledge Center</Link></li>
              <li><Link href="/news" className="text-muted-foreground hover:text-primary">Advocacy & News</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-sm mb-4 uppercase tracking-wider text-secondary">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Kigali, Rwanda<br/>Nyarugenge, KN 2 St</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+250 788 000 000</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@asserwa.org.rw</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-semibold text-sm mb-4 uppercase tracking-wider text-secondary">Support Us</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Partner with us to support sanitation initiatives across Rwanda.
            </p>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/contact">Inquire for Partnership</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Association of Sewage Emptiers in Rwanda (ASSERWA). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import { Button } from '@/components/ui/button';
