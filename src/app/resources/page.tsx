import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

const resources = [
  {
    title: "Sanitation & Hygiene Guidelines",
    type: "Regulation",
    size: "4.2 MB",
    description: "Official guidelines for sewage management, hygiene promotion, and environmental protection in Rwanda."
  },
  {
    title: "Toilet Maintenance & Operations Manual",
    type: "Technical Guide",
    size: "8.1 MB",
    description: "Operational standards for toilet construction, safe fecal sludge handling, and facility maintenance."
  },
  {
    title: "Environmental Protection Standard",
    type: "Report",
    size: "5.5 MB",
    description: "Frameworks safeguarding public health and water sources from untreated wastewater."
  },
  {
    title: "ASSSERVA Organizational Charter",
    type: "Policy",
    size: "1.5 MB",
    description: "Code of professional standards and ethics for all member sewage emptiers in Rwanda."
  }
];

export default function ResourcesPage() {
  return (
    <div className="bg-slate-50/50 py-16">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
              Documentation
            </span>
            <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900">Technical Guidelines & Manuals</h1>
            <p className="text-slate-600 font-body text-base">
              Access official guidelines, sanitation manuals, and advocacy publications from ASSSERVA.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input className="pl-10 bg-white" placeholder="Search manuals..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resources.map((res, idx) => (
            <Card key={idx} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border-slate-200 bg-white rounded-2xl">
              <CardHeader className="bg-slate-50 group-hover:bg-[#6cb166]/10 transition-colors p-6">
                <span className="px-2.5 py-1 bg-[#3b66b0] text-white text-[10px] font-bold uppercase tracking-wider rounded-md self-start mb-2">
                  {res.type}
                </span>
                <CardTitle className="font-headline text-lg text-slate-900 group-hover:text-[#3b66b0] transition-colors">
                  {res.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <p className="text-sm text-slate-600 font-body leading-relaxed">
                  {res.description}
                </p>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex justify-between items-center text-xs text-slate-500">
                <span className="font-semibold">{res.size}</span>
                <Button size="sm" variant="ghost" className="text-[#3b66b0] hover:text-[#3b66b0] hover:bg-[#3b66b0]/10 font-headline font-bold text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" /> Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
