'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, HandHeart, Globe, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Partnership inquiry submitted",
        description: "Thank you for reaching out to ASSERWA. An officer will contact you within 48 hours.",
      });
    }, 1200);
  };

  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300">
                Institutional Engagement
              </span>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Partner with ASSERWA</h1>
              <p className="text-slate-600 font-body text-base leading-relaxed">
                We collaborate with international development agencies, government ministries, NGOs, and municipal authorities to strengthen sanitation infrastructure across Rwanda.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-emerald-700 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-slate-900 text-sm">Headquarters Address</h4>
                  <p className="text-slate-600 text-xs font-body leading-relaxed mt-0.5">KN 2 St, Kigali, Rwanda<br/>Nyarugenge District</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="text-emerald-700 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-slate-900 text-sm">Telephone Support</h4>
                  <p className="text-slate-600 text-xs font-body leading-relaxed mt-0.5">+250 788 000 000<br/>Monday – Friday, 8:00 AM – 5:00 PM CAT</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="text-emerald-700 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-slate-900 text-sm">Official Email</h4>
                  <p className="text-slate-600 text-xs font-body leading-relaxed mt-0.5">partners@asserwa.org.rw<br/>info@asserwa.org.rw</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-headline font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> UN SDG Alignment
              </div>
              <h3 className="text-lg font-headline font-bold text-white">Supporting UN Sustainable Development Goal 6</h3>
              <p className="text-xs text-slate-300 font-body leading-relaxed">
                Ensure availability and sustainable management of water and sanitation for all in Rwanda.
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-xl border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="font-headline text-2xl text-white">Institutional Partnership Inquiry</CardTitle>
                <CardDescription className="text-slate-300 text-sm font-body">Submit project collaboration proposals or stakeholder inquiries.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="orgName" className="text-slate-800 font-headline font-bold text-xs">Organization / Institution Name</Label>
                      <Input id="orgName" placeholder="e.g. UN-Habitat / WASAC" required className="h-11 font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiryType" className="text-slate-800 font-headline font-bold text-xs">Inquiry Type</Label>
                      <Select defaultValue="partnership">
                        <SelectTrigger className="h-11 font-body">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent font-body>
                          <SelectItem value="partnership">Technical Project Partnership</SelectItem>
                          <SelectItem value="advocacy">Regulatory & Policy Advocacy</SelectItem>
                          <SelectItem value="research">Technical Sanitation Research</SelectItem>
                          <SelectItem value="training">Operator Capacity Building</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-slate-800 font-headline font-bold text-xs">Contact Officer</Label>
                      <Input id="contactName" placeholder="Full Name" required className="h-11 font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-slate-800 font-headline font-bold text-xs">Official Work Email</Label>
                      <Input id="contactEmail" type="email" placeholder="name@organization.org" required className="h-11 font-body" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-800 font-headline font-bold text-xs">Proposal & Inquiry Details</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Detail your interest in collaborating with ASSERWA to enhance sanitation standards..."
                      className="min-h-[140px] font-body text-sm"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-headline text-sm font-bold py-6 shadow-lg transition-transform hover:scale-[1.005]" disabled={loading}>
                    {loading ? "Transmitting Inquiry..." : "Submit Official Inquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
