import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function MembershipInfoPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Membership Information</h1>
        <p className="text-muted-foreground font-body">Information regarding ASSERWA professional membership.</p>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" /> Professional Association Structure
          </CardTitle>
          <CardDescription>ASSERWA maintains a specific professional membership based on national regulations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="font-body text-slate-700 leading-relaxed space-y-4">
            <p>
              Membership within the Association of Sewage Emptiers in Rwanda (ASSERWA) is reserved for certified practitioners who meet strict Rwandan national professional sanitation standards.
            </p>
            <p>
              Please note that ASSERWA does not offer open or automatic online registration. Membership is determined by government licensing and institutional vetting processes.
            </p>
            <p>
              Existing members can access their professional profiles and resources through the association's internal administrative channels.
            </p>
          </div>

          <div className="pt-6 border-t">
            <h4 className="font-headline font-bold text-secondary mb-2">Inquiries</h4>
            <p className="text-sm text-muted-foreground font-body mb-6">
              For administrative questions or to verify current membership status, please contact our headquarters directly.
            </p>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white font-headline">
              <Link href="/contact">Contact Our Office</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
