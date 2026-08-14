'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CountUp } from '@/components/count-up';

const districtData = [
  { name: 'Kigali', value: 6 },
  { name: 'East', value: 3 },
  { name: 'West', value: 3 },
  { name: 'North', value: 2 },
  { name: 'South', value: 2 },
];

const trainingData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 18 },
  { month: 'Mar', count: 15 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 20 },
  { month: 'Jun', count: 32 },
];

const COLORS = ['#6cb166', '#3b66b0', '#82ca9d', '#8884d8', '#ffc658'];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-secondary">Impact Dashboard</h1>
        <p className="text-muted-foreground font-body text-lg">Tracking ASSERWA's real-time contributions to Rwanda's sanitation infrastructure.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Active Members" 
          value={16} 
          change="Verified association members"
        />
        <StatCard 
          title="Communities Reached" 
          value={482} 
          change="+8% this quarter"
        />
        <StatCard 
          title="Waste Managed (m³)" 
          value={45} 
          suffix="k"
          change="+24% YoY"
        />
        <StatCard 
          title="Compliant Facilities" 
          value={89} 
          suffix="%"
          change="+5% improvement"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Reach */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline text-secondary">Reach by Province</CardTitle>
            <CardDescription>Number of active member organizations operating in each region (Total: 16).</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training Trends */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline text-secondary">Professional Development Trends</CardTitle>
            <CardDescription>Technical trainings conducted for members per month.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b66b0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, suffix = '' }: { title: string, value: number, change: string, suffix?: string }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div>
          <p className="text-sm font-headline text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-headline font-bold text-secondary mt-1">
            <CountUp end={value} suffix={suffix} />
          </h3>
          <p className="text-xs text-green-600 font-semibold mt-1">{change}</p>
        </div>
      </CardContent>
    </Card>
  );
}
