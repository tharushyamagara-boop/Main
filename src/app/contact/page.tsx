'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, HandHeart, Heart, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Inquiry sent",
        description: "Thank you for reaching out. A partnership officer will contact you within 48 hours.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-secondary">Partner with ASSERWA</h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed">
              We collaborate with international NGOs, development partners, and government bodies to improve sanitation infrastructure across Rwanda. Join us in our mission.
            </p>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="text-primary w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-secondary">Headquarters</h4>
                <p className="text-muted-foreground text-sm font-body">KN 2 St, Kigali, Rwanda<br/>Nyarugenge District</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Phone className="text-primary w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-secondary">Phone Support</h4>
                <p className="text-muted-foreground text-sm font-body">+250 788 000 000<br/>Mon-Fri, 8am - 5pm</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="text-primary w-5 h-5" />
              </div>
              <div>
                <h4 className="font-headline font-bold text-secondary">Email Inquiries</h4>
                <p className="text-muted-foreground text-sm font-body">partners@asserwa.org.rw<br/>info@asserwa.org.rw</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20 space-y-4 relative overflow-hidden">
             <Heart className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-primary opacity-5" />
             <div className="relative z-10">
               <h3 className="text-xl font-headline font-bold text-secondary flex items-center gap-2">
                 <HandHeart className="w-6 h-6 text-primary" /> Support Our Initiatives
               </h3>
               <p className="text-sm text-muted-foreground font-body mb-6">
                 Individual donations directly fund member training programs and community sanitation outreach in rural districts.
               </p>
               <Button className="w-full bg-primary hover:bg-primary/90 text-white font-headline shadow-lg">
                 Donate to Sanitation Fund
               </Button>
             </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <Card className="shadow-xl border-none">
            <CardHeader className="bg-slate-50 border-b p-8">
              <CardTitle className="font-headline text-2xl text-secondary">Partnership Inquiry</CardTitle>
              <CardDescription className="text-base">Let us know how you would like to support or collaborate with ASSERWA.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input id="orgName" placeholder="UN-Habitat / World Bank" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select defaultValue="partnership">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partnership">Project Partnership</SelectItem>
                        <SelectItem value="donation">Corporate Donation</SelectItem>
                        <SelectItem value="research">Technical Research</SelectItem>
                        <SelectItem value="advocacy">Advocacy Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person</Label>
                    <Input id="contactName" placeholder="Full Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Work Email</Label>
                    <Input id="contactEmail" type="email" placeholder="name@organization.org" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Collaboration Proposals / Inquiry Details</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Briefly describe your interest in supporting Rwanda's sanitation sector..."
                    className="min-h-[150px] font-body"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-headline text-lg py-6 shadow-lg transition-transform hover:scale-[1.01]" disabled={loading}>
                  {loading ? "Sending Inquiry..." : "Send Partnership Inquiry"}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Globe className="w-3 h-3" /> Supporting UN Sustainable Development Goal 6
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
