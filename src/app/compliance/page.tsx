'use client';

import { Card } from '@/components/ui/card';

const objectives = [
  {
    title: "Environmental & Hygiene Promotion",
    color: "#6cb166",
    points: [
      "Promote environmental protection and sanitation practices across all provinces.",
      "Promote hygiene and sanitation activities that improve the health and well-being of members and communities."
    ]
  },
  {
    title: "Professional Development",
    color: "#3b66b0",
    points: [
      "Promote high professional standards among sewage emptiers and sanitation workers.",
      "Ensure proper equipment operation and safe fecal sludge handling protocols."
    ]
  },
  {
    title: "Multi-Level Advocacy",
    color: "#6cb166",
    points: [
      "Advocate for sewage emptiers and sanitation practitioners at National Government Institutions.",
      "Represent members at Local Government Institutions, Non-Government Stakeholders, and international partners."
    ]
  },
  {
    title: "Sanitation Infrastructure",
    color: "#3b66b0",
    points: [
      "Advocate for the construction of toilets and public sanitation facilities.",
      "Promote proper operation and maintenance of toilets and sanitation infrastructure."
    ]
  }
];

export default function ObjectivesPage() {
  return (
    <div className="bg-slate-50/50 py-[30px]">
      <div className="container mx-auto px-4 max-w-5xl space-y-[30px]">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3.5 py-1 rounded-full border border-[#3b66b0]/30">
            Institutional Directives
          </span>
          <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-slate-900 tracking-tight">
            Organization Objectives & Standards
          </h1>
          <p className="text-slate-600 font-body text-base md:text-lg max-w-2xl mx-auto">
            The core mission of ASSERWA is to promote a culture of hygiene and sanitation among members and the wider community in Rwanda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
          {objectives.map((obj, idx) => (
            <Card key={idx} className="border border-slate-200 bg-white shadow-md rounded-2xl p-[30px] space-y-4">
              <h3 className="text-xl font-headline font-bold text-slate-900">{obj.title}</h3>
              <ul className="space-y-3 pt-2">
                {obj.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2 text-sm text-slate-700 font-body leading-relaxed">
                    <span className="text-[#6cb166] font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Institutional Verification Notice */}
        <div className="p-[30px] bg-[#3b66b0] text-white rounded-3xl shadow-xl space-y-3">
          <h3 className="text-xl font-headline font-bold">Official Standard Verification</h3>
          <p className="text-sm font-body text-white/95 leading-relaxed">
            All member companies operating in Kigali, Western, Northern, and Southern provinces adhere to these core organizational objectives to guarantee environmental protection and public health safety.
          </p>
        </div>
      </div>
    </div>
  );
}
