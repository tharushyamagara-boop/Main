
import Link from 'next/link';
import { Droplets, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              Professionalizing sanitation services and protecting Rwanda's environment since inception.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-secondary">Sitemap</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary">Services</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary">Impact Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-secondary">Connect</h4>
            <ul className="space-y-3 text-sm font-body">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Kigali, Rwanda<br/>Nyarugenge, KN 2 St</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+250 788 000 000</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@asserwa.org.rw</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-xs mb-4 uppercase tracking-widest text-secondary">Partnership</h4>
            <p className="text-sm text-muted-foreground mb-4 font-body">
              Inquire about technical collaborations and projects.
            </p>
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white font-headline">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-[10px] text-muted-foreground font-headline uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Association of Sewage Emptiers in Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
