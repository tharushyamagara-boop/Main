
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BookOpen, ExternalLink, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const resources = [
  {
    title: "National Sanitation Guidelines 2024",
    type: "Regulation",
    size: "4.2 MB",
    description: "The updated framework for sewage management and treatment standards in Rwanda."
  },
  {
    title: "Maintenance Best Practices Manual",
    type: "Technical Guide",
    size: "8.1 MB",
    description: "A comprehensive guide for the operation and maintenance of small-scale sanitation facilities."
  },
  {
    title: "Environmental Impact Study: Kigali",
    type: "Report",
    size: "12.5 MB",
    description: "Long-term study on the impact of decentralized sewage systems on local groundwater quality."
  },
  {
    title: "ASSERWA Code of Ethics",
    type: "Policy",
    size: "1.5 MB",
    description: "Professional standards and ethical guidelines for all association members."
  },
  {
    title: "Worker Safety & PPE Standard",
    type: "Safety",
    size: "3.8 MB",
    description: "Mandatory health and safety protocols for frontline sanitation professionals."
  },
  {
    title: "Public Health Advocacy Kit",
    type: "Toolkit",
    size: "5.4 MB",
    description: "Resources for community engagement and sanitation awareness campaigns."
  }
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-headline font-bold text-secondary text-left">Knowledge Repository</h1>
          <p className="text-muted-foreground font-body text-lg text-left">
            Access professional standards, technical manuals, and research publications curated for the Rwandan sanitation sector.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search publications..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((res, idx) => (
          <Card key={idx} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border-primary/10">
            <CardHeader className="bg-slate-50 group-hover:bg-primary/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded">
                  {res.type}
                </span>
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="font-headline text-lg text-secondary group-hover:text-primary transition-colors">
                {res.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {res.description}
              </p>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-1 font-semibold">
                <Download className="w-3 h-3" /> {res.size}
              </div>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                Download PDF
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-secondary rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute right-[-50px] top-[-50px] opacity-10">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <h2 className="text-2xl md:text-3xl font-headline font-bold">Submit a Technical Report</h2>
          <p className="text-slate-300 font-body">
            Are you a practitioner or researcher with insights to share? We welcome technical publications that can benefit the sanitation community in Rwanda.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-white font-headline mt-4">
            Submission Portal <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
