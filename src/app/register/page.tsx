
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ShieldCheck, UserPlus, FileText, Building2 } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Registration submitted",
        description: "ASSERWA admins will review your credentials and contact you shortly.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="text-center mb-10 space-y-2">
        <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Join the Association</h1>
        <p className="text-muted-foreground font-body">Register as a professional sanitation practitioner in Rwanda.</p>
      </div>

      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Member Credentials</CardTitle>
          <CardDescription>All fields are required for professional vetting.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Jean" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Ndayishimiye" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" type="email" placeholder="jean@sanitation-coop.rw" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coop">Cooperative/Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="coop" className="pl-9" placeholder="Kigali Green Sanitation Ltd" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">RURA License Number</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="license" className="pl-9" placeholder="RURA/SAN/2024/000" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">Primary District of Operation</Label>
              <Input id="district" placeholder="Nyarugenge" required />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-6 p-3 bg-slate-50 rounded-lg text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                By joining, you agree to adhere to the National Professional Sanitation Standards and ASSERWA Code of Ethics.
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-headline" disabled={loading}>
                {loading ? "Processing Application..." : "Submit Membership Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
