'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message sent",
        description: "Thank you for contacting ASSERWA. An officer will reply shortly.",
      });
    }, 1000);
  };

  return (
    <div className="bg-slate-50/50 py-[30px]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px] items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-[30px]">
            <div className="space-y-4">
              <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
                Official Contact
              </span>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">Contact ASSERWA</h1>
              <p className="text-slate-600 font-body text-base leading-relaxed">
                Forum of Sewage Emptiers in Rwanda. Reach out to our headquarters for inquiries, advocacy, or technical partnerships.
              </p>
            </div>

            <div className="space-y-[30px] pt-2">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <h4 className="font-headline font-bold text-slate-900 text-sm">Headquarters Address</h4>
                <p className="text-slate-600 text-xs font-body leading-relaxed">
                  Irembo House, Gishushu Road, Nyarutarama Village, Rukiri Cell / Public Cell, Remera Sector, Gasabo District, Kigali City, Rwanda
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <h4 className="font-headline font-bold text-slate-900 text-sm">Telephone</h4>
                <p className="text-slate-600 text-xs font-body leading-relaxed">
                  +250 784 246 216
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                <h4 className="font-headline font-bold text-slate-900 text-sm">Official Email</h4>
                <p className="text-slate-600 text-xs font-body leading-relaxed">
                  asserwarwanda@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-xl border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-[#3b66b0] text-white p-[30px]">
                <CardTitle className="font-headline text-2xl text-white">Contact & Inquiry Form</CardTitle>
                <CardDescription className="text-white/90 text-sm font-body">Send a direct message to ASSERWA leadership.</CardDescription>
              </CardHeader>
              <CardContent className="p-[30px]">
                <form onSubmit={handleSubmit} className="space-y-[30px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-slate-800 font-headline font-bold text-xs">Full Name</Label>
                      <Input id="contactName" placeholder="Your Name" required className="h-11 font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-slate-800 font-headline font-bold text-xs">Email Address</Label>
                      <Input id="contactEmail" type="email" placeholder="name@domain.com" required className="h-11 font-body" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inquiryType" className="text-slate-800 font-headline font-bold text-xs">Inquiry Type</Label>
                    <Select defaultValue="advocacy">
                      <SelectTrigger className="h-11 font-body">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent font-body>
                        <SelectItem value="advocacy">Advocacy & Partnerships</SelectItem>
                        <SelectItem value="membership">Member Services & Operations</SelectItem>
                        <SelectItem value="infrastructure">Sanitation Infrastructure</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-800 font-headline font-bold text-xs">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Write your message here..."
                      className="min-h-[140px] font-body text-sm"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-sm font-bold py-6 shadow-lg transition-transform hover:scale-[1.005]" disabled={loading}>
                    {loading ? "Sending Message..." : "Send Message"}
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
