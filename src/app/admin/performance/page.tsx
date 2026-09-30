'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Compass, 
  Smartphone, 
  Laptop, 
  Globe, 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  Users, 
  Share2, 
  ShieldAlert, 
  Menu, 
  X, 
  CalendarClock, 
  FileSpreadsheet, 
  Filter,
  CheckCircle,
  ExternalLink,
  Search
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { 
  Booking, 
  subscribeToBookings, 
  fetchAllBookingsDirect,
  calculateDeclaredSourceFrequencies, 
  DeclaredSourceFrequency, 
  normalizeDeclaredSource
} from '@/lib/bookings';
import { exportBookingsToExcel, exportBookingsToCSV } from '@/lib/exportExcel';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminPerformancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3b66b0]/20 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading Platform Performance Console...</p>
        </div>
      </div>
    }>
      <AdminPerformanceContent />
    </Suspense>
  );
}

function AdminPerformanceContent() {
  const router = useRouter();

  // Admin Auth Store
  const { currentAdmin, login } = useAdminStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('tharushyamagara@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Bookings Data & Sync
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [filterQuery, setFilterQuery] = useState('');

  // Auth resolution
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Real-time subscription to bookings
  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
      setLastSyncedTime(new Date().toLocaleTimeString());
    });
    return () => unsubscribe();
  }, []);

  // Calculate Declared Sources Frequency Matrix
  const declaredSourceFrequencies = useMemo(() => {
    return calculateDeclaredSourceFrequencies(bookings);
  }, [bookings]);

  // Overall platform acquisition metrics
  const platformStats = useMemo(() => {
    let mobileCount = 0;
    let desktopCount = 0;
    const campaignMap: Record<string, number> = {};
    const referrerMap: Record<string, number> = {};

    bookings.forEach(b => {
      if (b.attribution?.device) {
        if (/mobile|android|iphone/i.test(b.attribution.device)) {
          mobileCount++;
        } else {
          desktopCount++;
        }
      }

      if (b.attribution?.campaign) {
        campaignMap[b.attribution.campaign] = (campaignMap[b.attribution.campaign] || 0) + 1;
      }

      if (b.attribution?.referrerHost && b.attribution.referrerHost !== 'Direct') {
        referrerMap[b.attribution.referrerHost] = (referrerMap[b.attribution.referrerHost] || 0) + 1;
      }
    });

    const total = bookings.length;
    const completedTotal = bookings.filter(b => b.status === 'completed').length;
    const overallConversion = total > 0 ? Math.round((completedTotal / total) * 100) : 0;

    const topSource = declaredSourceFrequencies.length > 0 ? declaredSourceFrequencies[0] : null;

    return {
      total,
      completedTotal,
      overallConversion,
      mobileCount,
      desktopCount,
      topSource,
      campaigns: Object.entries(campaignMap).sort((a, b) => b[1] - a[1]),
      referrers: Object.entries(referrerMap).sort((a, b) => b[1] - a[1]),
    };
  }, [bookings, declaredSourceFrequencies]);

  // Pending count for sidebar badge
  const pendingCount = useMemo(() => {
    return bookings.filter(b => b.status === 'pending').length;
  }, [bookings]);

  // Filtered source frequency list
  const filteredSources = useMemo(() => {
    if (!filterQuery.trim()) return declaredSourceFrequencies;
    const q = filterQuery.toLowerCase().trim();
    return declaredSourceFrequencies.filter(s => s.source.toLowerCase().includes(q));
  }, [declaredSourceFrequencies, filterQuery]);

  // Manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const direct = await fetchAllBookingsDirect();
      if (direct.length > 0) setBookings(direct);
      setLastSyncedTime(new Date().toLocaleTimeString());
      toast({
        title: "Performance Data Synced",
        description: `Recalculated analytics across ${bookings.length} requests.`,
      });
    } catch (e: any) {
      toast({
        title: "Sync Notice",
        description: "Local cache is active and synchronized.",
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Export Analytics to Excel
  const handleExportPerformanceExcel = () => {
    if (bookings.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no bookings to generate performance analytics.",
        variant: "destructive"
      });
      return;
    }

    const success = exportBookingsToExcel(bookings, {
      filterName: 'Platform-Performance-All',
      filenamePrefix: 'ASSERWA_Acquisition_Report'
    });

    if (success) {
      toast({
        title: "Performance Report Generated",
        description: `Exported acquisition channels, declared sources, and device attribution to Excel.`,
      });
    }
  };

  // Inline Admin Login
  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = login(loginEmail, loginPassword);
    if (!success) {
      setLoginError('Invalid administrator credentials.');
    } else {
      toast({
        title: "Welcome back!",
        description: `Signed in as ${loginEmail}.`,
      });
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3b66b0]/20 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Authenticating access claims...</p>
        </div>
      </div>
    );
  }

  const isAuthorized = currentAdmin && (
    currentAdmin.role === 'Super Admin' ||
    currentAdmin.role === 'Content Manager' ||
    currentAdmin.role === 'Editor' ||
    currentAdmin.email.toLowerCase() === 'tharushyamagara@gmail.com'
  );

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50/80 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#3b66b0] border border-blue-100 flex items-center justify-center mb-4">
              <ShieldAlert className="w-8 h-8 text-[#3b66b0]" />
            </div>
            <h1 className="text-xl font-headline font-bold text-slate-900">
              Unauthorized Access
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              The Platform Performance & Acquisition Console is restricted to authorized operators.
            </p>
          </div>

          <form onSubmit={handleInlineLogin} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Administrator Email</label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="tharushyamagara@gmail.com"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Access Key</label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10"
              />
            </div>

            {loginError && (
              <p className="text-xs text-slate-900 bg-white p-3 rounded-xl border border-red-200 shadow-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-headline text-xs font-bold h-10 shadow-md"
            >
              Sign In to Performance Console
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col lg:flex-row font-body">
      
      {/* Desktop Persistent Admin Sidebar */}
      <AdminSidebar
        pendingBookingsCount={pendingCount}
        className="hidden lg:flex"
      />

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="relative z-10 w-72 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminSidebar
              pendingBookingsCount={pendingCount}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/70 overflow-y-auto min-h-screen">
        
        {/* Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-headline font-bold text-slate-900 tracking-tight">
                  Platform Performance & Acquisition
                </h1>
                <Badge className="bg-blue-50 text-[#3b66b0] border border-blue-200 text-[10px] hidden sm:inline-flex">
                  Traffic Analytics
                </Badge>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Track where users declare they heard about ASSERWA and measure completed job conversion rates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="h-8 px-2.5 sm:px-3 bg-white border-slate-200 hover:bg-slate-100 text-slate-700 text-xs"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5 text-slate-400", isRefreshing && "animate-spin text-[#3b66b0]")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              onClick={handleExportPerformanceExcel}
              size="sm"
              className="h-8 px-3 bg-[#6cb166] hover:bg-[#5aa054] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>Export Report</span>
            </Button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Top Performance Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Total Declarations</span>
                <Compass className="w-4 h-4 text-[#3b66b0]" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-headline text-slate-900">{platformStats.total}</span>
                <span className="text-xs text-slate-400">100% captured</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Completed Jobs</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-headline text-emerald-700">{platformStats.completedTotal}</span>
                <span className="text-xs font-semibold text-emerald-600">{platformStats.overallConversion}% completion rate</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Top Acquisition Channel</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold font-headline text-slate-900 truncate max-w-[150px]">
                  {platformStats.topSource ? platformStats.topSource.source : 'N/A'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {platformStats.topSource ? `${platformStats.topSource.percentage}%` : ''}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <span>Device Distribution</span>
                <Smartphone className="w-4 h-4 text-slate-500" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  📱 {platformStats.mobileCount} • 💻 {platformStats.desktopCount}
                </span>
                <span className="text-[11px] text-slate-400">
                  {platformStats.total > 0 ? Math.round((platformStats.mobileCount / platformStats.total) * 100) : 0}% Mobile
                </span>
              </div>
            </div>

          </div>

          {/* Channel Performance Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-headline font-bold text-slate-900">
                    Acquisition Channels & Conversion Matrix
                  </h3>
                  <Badge className="bg-blue-50 text-[#3b66b0] border border-blue-200 text-[10px]">
                    {filteredSources.length} Channels
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live ranking of all marketing touchpoints, request volumes, completed jobs, and conversion efficiency.
                </p>
              </div>

              <div className="w-full sm:w-72">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <Input
                    type="text"
                    placeholder="Search channels..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="h-8 pl-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus:bg-white"
                  />
                  {filterQuery && (
                    <button 
                      onClick={() => setFilterQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Channel / Touchpoint</th>
                    <th className="py-3 px-4 text-center">Inquiries</th>
                    <th className="py-3 px-4">Audience Share</th>
                    <th className="py-3 px-4 text-center">Unique Requesters</th>
                    <th className="py-3 px-4 text-center">Completed Jobs</th>
                    <th className="py-3 px-4 text-center">Conversion Rate</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSources.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                        No acquisition channels match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredSources.map((stat, idx) => (
                      <tr key={stat.source} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 text-center font-bold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#3b66b0] shrink-0" />
                            <span className="font-semibold text-slate-900">{stat.source}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                          {stat.count}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5 min-w-[140px]">
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
                              <div 
                                className="bg-[#3b66b0] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, Math.max(4, stat.percentage))}%` }} 
                              />
                            </div>
                            <span className="font-mono text-xs font-semibold text-slate-700 w-10 text-right">
                              {stat.percentage}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-700">
                          {stat.uniqueRequesters}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-emerald-700 font-bold">
                          {stat.completedCount}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded-md font-mono font-bold text-[11px] inline-block",
                            stat.conversionRate >= 50 
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                              : stat.conversionRate > 0
                                ? "bg-blue-50 text-[#3b66b0] border border-blue-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}>
                            {stat.conversionRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-[11px] text-[#3b66b0] hover:text-[#284982] hover:bg-blue-50 font-semibold"
                          >
                            <Link href={`/admin/bookings?channel=${encodeURIComponent(stat.source)}`}>
                              <span>Filter Queue</span>
                              <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredSources.length} channel touchpoints</span>
              <span className="text-[11px] text-slate-400">Values update automatically on new customer requests</span>
            </div>
          </div>

          {/* Secondary Tables: Digital Campaigns & External Referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* UTM Campaigns Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#3b66b0]" />
                    <span>Digital Campaigns (UTM Tracking)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Campaigns captured via utm_campaign query parameters</p>
                </div>
                <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">
                  {platformStats.campaigns.length} Active
                </Badge>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-semibold text-[10px] uppercase">
                      <th className="py-2.5 px-3.5">Campaign Name</th>
                      <th className="py-2.5 px-3.5 text-center">Hits / Inquiries</th>
                      <th className="py-2.5 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {platformStats.campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-xs text-slate-400 italic">
                          No active utm_campaign parameters recorded yet.
                        </td>
                      </tr>
                    ) : (
                      platformStats.campaigns.map(([campaign, count]) => (
                        <tr key={campaign} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3.5 font-mono text-xs font-medium text-slate-900 truncate max-w-[200px]">
                            {campaign}
                          </td>
                          <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-800">
                            {count}
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <Link
                              href={`/admin/bookings?search=${encodeURIComponent(campaign)}`}
                              className="text-[11px] text-[#3b66b0] hover:underline font-semibold inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* External Referrers Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>External Referrer Domains</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">HTTP referrer origins directing traffic to ASSERWA</p>
                </div>
                <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">
                  {platformStats.referrers.length} Hosts
                </Badge>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-semibold text-[10px] uppercase">
                      <th className="py-2.5 px-3.5">Referrer Host Domain</th>
                      <th className="py-2.5 px-3.5 text-center">Referrals</th>
                      <th className="py-2.5 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {platformStats.referrers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-xs text-slate-400 italic">
                          No external referrer host headers recorded yet.
                        </td>
                      </tr>
                    ) : (
                      platformStats.referrers.map(([host, count]) => (
                        <tr key={host} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3.5 text-slate-800 font-medium truncate max-w-[200px]">
                            {host}
                          </td>
                          <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-800">
                            {count}
                          </td>
                          <td className="py-2.5 px-3.5 text-right">
                            <Link
                              href={`/admin/bookings?search=${encodeURIComponent(host)}`}
                              className="text-[11px] text-[#3b66b0] hover:underline font-semibold inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Device & Platform Breakdown Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Device & Platform Environment Breakdown</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">User agent device distribution across all booking submissions</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 font-semibold text-[10px] uppercase">
                    <th className="py-2.5 px-4">Device Category</th>
                    <th className="py-2.5 px-4 text-center">Requests</th>
                    <th className="py-2.5 px-4">Distribution Ratio</th>
                    <th className="py-2.5 px-4 text-right">Platform Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Mobile (Smartphone / Tablet)</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                      {platformStats.mobileCount}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
                          <div 
                            className="bg-blue-600 h-full rounded-full" 
                            style={{ width: `${platformStats.total > 0 ? (platformStats.mobileCount / platformStats.total) * 100 : 0}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">
                      {platformStats.total > 0 ? Math.round((platformStats.mobileCount / platformStats.total) * 100) : 0}%
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-emerald-600" />
                      <span>Desktop & Workstation</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                      {platformStats.desktopCount}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
                          <div 
                            className="bg-emerald-600 h-full rounded-full" 
                            style={{ width: `${platformStats.total > 0 ? (platformStats.desktopCount / platformStats.total) * 100 : 0}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">
                      {platformStats.total > 0 ? Math.round((platformStats.desktopCount / platformStats.total) * 100) : 0}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
