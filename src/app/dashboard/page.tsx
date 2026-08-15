'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CountUp } from '@/components/count-up';
import { Building2, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const districtData = [
  { name: 'Kigali City', value: 6 },
  { name: 'Eastern Prov.', value: 3 },
  { name: 'Western Prov.', value: 3 },
  { name: 'Northern Prov.', value: 2 },
  { name: 'Southern Prov.', value: 2 },
];

const trainingData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 18 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 20 },
  { month: 'Jun', count: 32 },
];

const COLORS = ['#15803d', '#1e40af', '#0d9488', '#6366f1', '#eab308'];

export default function DashboardPage() {
  return (
    <div className="bg-slate-50/50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 space-y-3">
          <span className="text-xs font-headline font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3.5 py-1 rounded-full border border-emerald-300">
            Real-time Metrics
          </span>
          <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900">National Impact Dashboard</h1>
          <p className="text-slate-600 font-body text-base max-w-2xl">
            Real-time metrics tracking ASSERWA's operational reach, member compliance, and infrastructure contributions across Rwanda.
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Active Members" 
            value={16} 
            change="Verified association entities"
            icon={Building2}
          />
          <StatCard 
            title="Communities Served" 
            value={482} 
            change="+8% this quarter"
            icon={Users}
          />
          <StatCard 
            title="Waste Managed (m³)" 
            value={45} 
            suffix="k"
            change="+24% YoY growth"
            icon={TrendingUp}
          />
          <StatCard 
            title="Compliant Facilities" 
            value={89} 
            suffix="%"
            change="+5% improvement rate"
            icon={ShieldCheck}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Geographic Reach */}
          <Card className="shadow-md border border-slate-200 rounded-2xl bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="font-headline text-lg text-slate-900">Regional Coverage by Province</CardTitle>
              <CardDescription className="text-xs font-body text-slate-500">Number of active member organizations operating per region (Total: 16).</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Training Trends */}
          <Card className="shadow-md border border-slate-200 rounded-2xl bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="font-headline text-lg text-slate-900">Technical Training Trends</CardTitle>
              <CardDescription className="text-xs font-body text-slate-500">Professional development sessions conducted for member staff per month.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trainingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#15803d" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, suffix = '', icon: Icon }: { title: string, value: number, change: string, suffix?: string, icon: any }) {
  return (
    <Card className="shadow-md border border-slate-200 rounded-2xl bg-white hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-headline text-slate-500 uppercase tracking-wider font-bold">{title}</p>
          <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-emerald-700" />
          </div>
        </div>
        <h3 className="text-3xl font-headline font-extrabold text-slate-900 tracking-tight">
          <CountUp end={value} suffix={suffix} />
        </h3>
        <p className="text-xs text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
          <span>{change}</span>
        </p>
      </CardContent>
    </Card>
  );
}
