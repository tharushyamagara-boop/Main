
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, ShieldAlert, Loader2, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { evaluateSanitationCompliance, SanitationComplianceEvaluationOutput } from '@/ai/flows/sanitation-compliance-evaluation-flow';
import { toast } from '@/hooks/use-toast';

export default function CompliancePage() {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<'service_report' | 'maintenance_plan' | 'other'>('service_report');
  const [reportContent, setReportContent] = useState('');
  const [result, setResult] = useState<SanitationComplianceEvaluationOutput | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportContent.trim()) {
      toast({ title: "Content required", description: "Please paste the report content first.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const evaluation = await evaluateSanitationCompliance({
        reportContent,
        reportType,
        additionalContext: "Evaluating based on Rwandan National Professional Sanitation Standards for ASSERWA members."
      });
      setResult(evaluation);
    } catch (error) {
      console.error(error);
      toast({ title: "Evaluation failed", description: "An error occurred during evaluation. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          Powered by ASSERWA GenAI
        </div>
        <h1 className="text-3xl md:text-5xl font-headline font-bold text-secondary tracking-tight">
          Compliance Standards Evaluation
        </h1>
        <p className="text-muted-foreground font-body text-lg max-w-2xl mx-auto">
          Instantly evaluate sanitation reports and site maintenance plans against Rwandan national standards. Ensure your work meets association criteria before submission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-secondary">Evaluation Input</CardTitle>
              <CardDescription>Enter the technical details for analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEvaluate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Document Type</label>
                  <Select 
                    value={reportType} 
                    onValueChange={(v: any) => setReportType(v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service_report">Service Report</SelectItem>
                      <SelectItem value="maintenance_plan">Maintenance Plan</SelectItem>
                      <SelectItem value="other">Other Technical Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary">Paste Document Content</label>
                  <Textarea 
                    placeholder="Paste technical details, equipment used, disposal methods, etc."
                    className="min-h-[250px] font-body resize-none"
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-headline"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Run AI Compliance Check
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="w-4 h-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-bold">Privacy Note</AlertTitle>
            <AlertDescription className="text-blue-700 text-sm">
              Your reports are processed securely. AI evaluations are advisory and should be reviewed by a certified supervisor.
            </AlertDescription>
          </Alert>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {!result && !loading && (
            <div className="h-[500px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-slate-50">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-headline font-semibold text-slate-500">Awaiting Evaluation</h3>
              <p className="text-slate-400 font-body max-w-xs mt-2">
                Paste your document content on the left to start the compliance reasoning engine.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-[500px] border rounded-2xl flex flex-col items-center justify-center text-center p-10 bg-white">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
              <h3 className="text-xl font-headline font-semibold text-secondary">Evaluating Standards...</h3>
              <p className="text-muted-foreground font-body mt-2">
                Our AI is cross-referencing your document with Rwandan National Sanitation guidelines.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {result.isCompliant ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-green-800">Compliance Verified</h3>
                    <p className="text-green-700 mt-1 font-body">{result.summary}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-8 h-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold text-amber-800">Needs Improvements</h3>
                    <p className="text-amber-700 mt-1 font-body">{result.summary}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-headline text-green-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Strong Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.complianceAreas.map((area, idx) => (
                        <li key={idx} className="text-sm font-body text-slate-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-headline text-amber-700 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Shortcomings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.nonComplianceAreas.map((area, idx) => (
                        <li key={idx} className="text-sm font-body text-slate-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/30 shadow-md">
                <CardHeader>
                  <CardTitle className="font-headline text-secondary flex items-center gap-2">
                    Actionable Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-slate-50 rounded-xl font-body text-slate-700 leading-relaxed italic">
                    {result.recommendations}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setResult(null)}>
                  Clear and Start Over
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
