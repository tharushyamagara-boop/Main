
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Target, Users, History } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const trainingImg = PlaceHolderImages.find(img => img.id === 'member-training');

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="space-y-4 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-secondary">About ASSERWA</h1>
        <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
          The Association of Sewage Emptiers in Rwanda (ASSERWA) is the premier professional body dedicated to excellence in sanitation services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <History className="text-primary w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-secondary mb-2">Our History</h3>
              <p className="text-muted-foreground font-body">
                Founded to organize and professionalize the sanitation sector in Rwanda, ASSERWA has grown into a vital partner for national health and environmental protection agencies.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Shield className="text-primary w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-secondary mb-2">Our Mission</h3>
              <p className="text-muted-foreground font-body">
                To advocate for professional standards, provide technical training, and ensure that every community in Rwanda has access to safe, efficient, and dignified sanitation services.
              </p>
            </div>
          </div>
        </div>
        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
          {trainingImg && (
            <Image
              src={trainingImg.imageUrl}
              alt={trainingImg.description}
              fill
              className="object-cover"
              data-ai-hint={trainingImg.imageHint}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none bg-slate-50 shadow-sm">
          <CardContent className="pt-6">
            <Target className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-headline font-bold text-secondary mb-2">Our Vision</h3>
            <p className="text-muted-foreground font-body">
              A Rwanda where professional sanitation management is a cornerstone of public health, environmental sustainability, and economic development.
            </p>
          </CardContent>
        </Card>
        <Card className="border-none bg-slate-50 shadow-sm">
          <CardContent className="pt-6">
            <Users className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-headline font-bold text-secondary mb-2">Our Values</h3>
            <p className="text-muted-foreground font-body">
              Integrity in service, commitment to environmental safety, continuous professional development, and collaboration with national stakeholders.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
