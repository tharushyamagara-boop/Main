import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info, MapPin, Phone, Mail } from 'lucide-react';

export default function MembershipInfoPage() {
  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900">ASSERWA Membership</h1>
          <p className="text-slate-600 font-body">Information regarding sewage emptiers and sanitation service providers membership.</p>
        </div>

        <Card className="shadow-xl border border-slate-200 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-[#3b66b0] text-white p-8">
            <CardTitle className="font-headline text-xl flex items-center gap-2 text-white">
              <Info className="w-5 h-5 text-[#6cb166]" /> Organization Membership Structure
            </CardTitle>
            <CardDescription className="text-white/90 text-sm font-body">ASSERWA brings together sewage emptiers and sanitation service providers in Rwanda.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="font-body text-slate-700 leading-relaxed space-y-4 text-sm">
              <p>
                ASSERWA is a non-governmental organization that brings together sewage emptiers and sanitation service providers across Kigali City, Western Province, Northern Province, and Southern Province.
              </p>
              <p>
                The organization works to promote high professional standards among sewage emptiers, protect public health, and safeguard the environment.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h4 className="font-headline font-bold text-slate-900">Headquarters Contact Information</h4>
              <div className="space-y-2 text-xs text-slate-600 font-body">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#6cb166] shrink-0 mt-0.5" />
                  <span>Irembo House, Gishushu Road, Nyarutarama Village, Rukiri Cell, Remera Sector, Gasabo District, Kigali City, Rwanda</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#6cb166] shrink-0" />
                  <span>+250 784 246 216</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#6cb166] shrink-0" />
                  <span>asserwarwanda@gmail.com</span>
                </p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-sm font-bold py-5">
                  <Link href="/contact">Contact Headquarters</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
