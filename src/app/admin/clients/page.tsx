'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Crown, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  ShieldAlert, 
  Menu, 
  X, 
  History, 
  CheckCircle2, 
  CheckCircle, 
  XCircle, 
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  Award,
  Sparkles,
  Compass
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { 
  Booking, 
  subscribeToBookings, 
  fetchAllBookingsDirect,
  aggregateClientProfiles, 
  ClientProfileSummary, 
  ClientTier,
  normalizeDeclaredSource
} from '@/lib/bookings';
import { exportBookingsToExcel, exportBookingsToCSV } from '@/lib/exportExcel';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminClientsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3b66b0]/20 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading Client Tracker...</p>
        </div>
      </div>
    }>
      <AdminClientsContent />
    </Suspense>
  );
}

function AdminClientsContent() {

  const { currentAdmin, login } = useAdminStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('tharushyamagara@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mobile drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Bookings Data & Realtime Sync
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<ClientTier | 'all'>('all');

  // Modal Drawer for customer timeline
  const [selectedProfile, setSelectedProfile] = useState<ClientProfileSummary | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Auth resolution
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Subscribe to bookings
  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
      setLastSyncedTime(new Date().toLocaleTimeString());
    });
    return () => unsubscribe();
  }, []);

  // Aggregated Client Profiles
  const clientProfiles = useMemo(() => {
    return aggregateClientProfiles(bookings);
  }, [bookings]);

  // Tier counts
  const tierCounts = useMemo(() => {
    let potential = 0;
    let client = 0;
    let regular = 0;
    clientProfiles.forEach(p => {
      if (p.tier === 'regular') regular++;
      else if (p.tier === 'client') client++;
      else potential++;
    });
    return { potential, client, regular, total: clientProfiles.length };
  }, [clientProfiles]);

  // Pending count for sidebar badge
  const pendingCount = useMemo(() => {
    return bookings.filter(b => b.status === 'pending').length;
  }, [bookings]);

  // Filtered Client Profiles
  const filteredProfiles = useMemo(() => {
    return clientProfiles.filter(profile => {
      if (tierFilter !== 'all' && profile.tier !== tierFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (profile.customerName || '').toLowerCase().includes(q);
        const matchesEmail = (profile.email || '').toLowerCase().includes(q);
        const matchesPhone = (profile.phone || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }

      return true;
    });
  }, [clientProfiles, tierFilter, searchQuery]);

  // Manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const direct = await fetchAllBookingsDirect();
      if (direct.length > 0) setBookings(direct);
      setLastSyncedTime(new Date().toLocaleTimeString());
      toast({
        title: "Client Tracker Updated",
        description: `Successfully recomputed ${clientProfiles.length} customer lifecycle profiles.`,
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

  // Export Client CRM Report
  const handleExportClientsExcel = () => {
    if (filteredProfiles.length === 0) {
      toast({
        title: "No Data to Export",
        description: "No customer profiles match your current search.",
        variant: "destructive"
      });
      return;
    }

    // Map all client bookings into exportable rows
    const clientBookingsToExport = filteredProfiles.flatMap(p => p.bookings);
    const success = exportBookingsToExcel(clientBookingsToExport, {
      filterName: tierFilter === 'all' ? 'All-Clients' : `Tier-${tierFilter}`,
      filenamePrefix: 'ASSERWA_Client_Directory'
    });

    if (success) {
      toast({
        title: "Client Directory Exported",
        description: `Exported ${filteredProfiles.length} clients with full completed booking counts to Excel (.xlsx).`,
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
          <p className="text-xs text-slate-500">Authenticating operations credentials...</p>
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
              The ASSERWA Client Lifecycle Tracker is restricted to authorized administrators.
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
              Sign In to Client Tracker
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
                  Client Tracker & Loyalty Lifecycle
                </h1>
                <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] hidden sm:inline-flex">
                  CRM Active
                </Badge>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Track service requesters from Potential Client to Client and Regular Client based on completed bookings.
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
              onClick={handleExportClientsExcel}
              size="sm"
              className="h-8 px-3 bg-[#6cb166] hover:bg-[#5aa054] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>Export Clients</span>
            </Button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Loyalty Tier Rule & Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Total Requesters */}
            <div 
              onClick={() => setTierFilter('all')}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer shadow-sm",
                tierFilter === 'all'
                  ? "bg-[#3b66b0] text-white border-[#3b66b0]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px] font-bold uppercase tracking-wider", tierFilter === 'all' ? "text-blue-100" : "text-slate-500")}>
                  Total Requesters
                </span>
                <Users className={cn("w-4 h-4", tierFilter === 'all' ? "text-white" : "text-slate-400")} />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={cn("text-2xl font-bold font-headline", tierFilter === 'all' ? "text-white" : "text-slate-900")}>
                  {tierCounts.total}
                </span>
                <span className={cn("text-xs font-semibold", tierFilter === 'all' ? "text-white/80" : "text-slate-400")}>
                  100% of accounts
                </span>
              </div>
            </div>

            {/* Potential Clients */}
            <div 
              onClick={() => setTierFilter(tierFilter === 'potential' ? 'all' : 'potential')}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer shadow-sm",
                tierFilter === 'potential'
                  ? "bg-amber-500 text-white border-amber-600"
                  : "bg-white border-slate-200 hover:border-amber-200"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px] font-bold uppercase tracking-wider", tierFilter === 'potential' ? "text-white" : "text-amber-800")}>
                  Potential Clients
                </span>
                <UserPlus className={cn("w-4 h-4", tierFilter === 'potential' ? "text-white" : "text-amber-700")} />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={cn("text-2xl font-bold font-headline", tierFilter === 'potential' ? "text-white" : "text-amber-900")}>
                  {tierCounts.potential}
                </span>
                <span className={cn("text-xs", tierFilter === 'potential' ? "text-amber-100" : "text-slate-400")}>
                  0 completed
                </span>
              </div>
            </div>

            {/* Active Clients */}
            <div 
              onClick={() => setTierFilter(tierFilter === 'client' ? 'all' : 'client')}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer shadow-sm",
                tierFilter === 'client'
                  ? "bg-[#3b66b0] text-white border-[#3b66b0]"
                  : "bg-white border-slate-200 hover:border-blue-200"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px] font-bold uppercase tracking-wider", tierFilter === 'client' ? "text-white" : "text-blue-800")}>
                  Clients
                </span>
                <UserCheck className={cn("w-4 h-4", tierFilter === 'client' ? "text-white" : "text-[#3b66b0]")} />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={cn("text-2xl font-bold font-headline", tierFilter === 'client' ? "text-white" : "text-blue-900")}>
                  {tierCounts.client}
                </span>
                <span className={cn("text-xs", tierFilter === 'client' ? "text-blue-100" : "text-slate-400")}>
                  1–4 completed
                </span>
              </div>
            </div>

            {/* Regular Clients */}
            <div 
              onClick={() => setTierFilter(tierFilter === 'regular' ? 'all' : 'regular')}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer shadow-sm",
                tierFilter === 'regular'
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white border-slate-200 hover:border-emerald-300"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px] font-bold uppercase tracking-wider", tierFilter === 'regular' ? "text-white" : "text-emerald-800")}>
                  ⭐ Regular Clients
                </span>
                <Crown className={cn("w-4 h-4", tierFilter === 'regular' ? "text-white" : "text-emerald-700")} />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={cn("text-2xl font-bold font-headline", tierFilter === 'regular' ? "text-white" : "text-emerald-950")}>
                  {tierCounts.regular}
                </span>
                <span className={cn("text-xs font-semibold", tierFilter === 'regular' ? "text-emerald-100" : "text-emerald-700")}>
                  5+ completed (VIP)
                </span>
              </div>
            </div>

          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  type="text"
                  placeholder="Search clients by name, email, or telephone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-10 h-10 text-xs rounded-xl focus:bg-white"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tier Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
                <button
                  onClick={() => setTierFilter('all')}
                  className={cn("px-3 py-1.5 rounded-lg font-medium transition-colors", tierFilter === 'all' ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900")}
                >
                  All ({tierCounts.total})
                </button>
                <button
                  onClick={() => setTierFilter('regular')}
                  className={cn("px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1", tierFilter === 'regular' ? "bg-emerald-600 text-white shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900")}
                >
                  <Crown className="w-3 h-3 text-current" />
                  <span>Regular ({tierCounts.regular})</span>
                </button>
                <button
                  onClick={() => setTierFilter('client')}
                  className={cn("px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1", tierFilter === 'client' ? "bg-[#3b66b0] text-white shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900")}
                >
                  <UserCheck className="w-3 h-3 text-current" />
                  <span>Clients ({tierCounts.client})</span>
                </button>
                <button
                  onClick={() => setTierFilter('potential')}
                  className={cn("px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1", tierFilter === 'potential' ? "bg-amber-500 text-white shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900")}
                >
                  <UserPlus className="w-3 h-3 text-current" />
                  <span>Potential ({tierCounts.potential})</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Showing <strong>{filteredProfiles.length}</strong> of <strong>{clientProfiles.length}</strong> service requesters</span>
              {(tierFilter !== 'all' || searchQuery.trim()) && (
                <button
                  onClick={() => {
                    setTierFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-[#3b66b0] hover:underline font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Client Directory Table */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="font-headline font-bold text-slate-900 text-sm">No Clients Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No customer profiles match your current search query or tier criteria.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[2fr_1.5fr_0.8fr_0.8fr_0.8fr_0.8fr_auto] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <span>Client</span>
                <span>Contact</span>
                <span>Tier</span>
                <span>Total</span>
                <span>Done</span>
                <span>Progress</span>
                <span>Source</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-100">
                {filteredProfiles.map((profile) => {
                  const isRegular = profile.tier === 'regular';
                  const isClient = profile.tier === 'client';
                  const progressPct = Math.min(100, Math.round((profile.completedCount / 5) * 100));

                  const tierBadge = isRegular
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold"><Crown className="w-2.5 h-2.5" />⭐ Regular</span>
                    : isClient
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#3b66b0] text-[10px] font-semibold"><UserCheck className="w-2.5 h-2.5" />Client</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium"><UserPlus className="w-2.5 h-2.5" />Potential</span>;

                  return (
                    <div
                      key={profile.clientId}
                      className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_0.8fr_0.8fr_0.8fr_0.8fr_auto] gap-3 px-4 py-3 items-center hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => { setSelectedProfile(profile); setIsDetailModalOpen(true); }}
                    >
                      {/* Client name */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#3b66b0] transition-colors">
                          {profile.customerName}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate md:hidden">{profile.email}</p>
                      </div>

                      {/* Contact */}
                      <div className="hidden md:block min-w-0">
                        <p className="text-xs text-slate-700 truncate">{profile.email}</p>
                        <p className="text-[11px] font-mono text-slate-500">{profile.phone}</p>
                      </div>

                      {/* Tier */}
                      <div className="hidden md:flex">{tierBadge}</div>

                      {/* Total bookings */}
                      <div className="hidden md:block text-center">
                        <span className="text-sm font-bold text-slate-900">{profile.totalBookingsCount}</span>
                        <p className="text-[10px] text-slate-400">requests</p>
                      </div>

                      {/* Completed */}
                      <div className="hidden md:block text-center">
                        <span className={cn("text-sm font-bold", profile.completedCount > 0 ? "text-emerald-700" : "text-slate-400")}>{profile.completedCount}</span>
                        <p className="text-[10px] text-slate-400">/ 5</p>
                      </div>

                      {/* Progress bar */}
                      <div className="hidden md:block">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={cn("h-full rounded-full", isRegular ? "bg-emerald-600" : isClient ? "bg-[#3b66b0]" : "bg-amber-400")}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 text-right">{progressPct}%</p>
                      </div>

                      {/* Source */}
                      <div className="hidden md:flex flex-wrap gap-1">
                        {profile.declaredSources.slice(0, 1).map(src => (
                          <span key={src} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[80px]">
                            {normalizeDeclaredSource(src)}
                          </span>
                        ))}
                        {profile.declaredSources.length > 1 && (
                          <span className="text-[10px] text-slate-400">+{profile.declaredSources.length - 1}</span>
                        )}
                      </div>

                      {/* Mobile summary strip */}
                      <div className="md:hidden flex items-center justify-between gap-2">
                        {tierBadge}
                        <span className="text-[11px] text-slate-500 font-mono">{profile.completedCount}/5 completed</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Customer Full Booking Timeline Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[85vh] overflow-y-auto">
          {selectedProfile && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div>
                    <DialogTitle className="text-lg font-headline font-bold text-slate-900">
                      {selectedProfile.customerName}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 mt-1">
                      Customer Lifecycle Profile & Verified Booking Records
                    </DialogDescription>
                  </div>

                  {selectedProfile.tier === 'regular' && (
                    <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-2.5 py-0.5">
                      ⭐ Regular Client (5+ Completed)
                    </Badge>
                  )}
                  {selectedProfile.tier === 'client' && (
                    <Badge className="bg-blue-50 text-[#3b66b0] border-blue-200 font-semibold text-xs px-2.5 py-0.5">
                      Client ({selectedProfile.completedCount} Completed)
                    </Badge>
                  )}
                  {selectedProfile.tier === 'potential' && (
                    <Badge className="bg-amber-50 text-amber-900 border-amber-200 font-medium text-xs px-2.5 py-0.5">
                      Potential Client (0 Completed)
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              {/* Contact Information & Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Contact</span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedProfile.phone}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Declared Acquisition</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProfile.declaredSources.map(s => (
                      <span key={s} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                        {normalizeDeclaredSource(s)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress to Next Tier */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Loyalty Status Progression</span>
                  <span className="font-mono text-slate-600 font-bold">
                    {selectedProfile.completedCount} / 5 Completed Bookings
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      selectedProfile.tier === 'regular' ? "bg-emerald-600" : "bg-[#3b66b0]"
                    )}
                    style={{ width: `${Math.min(100, Math.round((selectedProfile.completedCount / 5) * 100))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {selectedProfile.tier === 'regular'
                    ? "✓ Client has satisfied the requirement of 5 or more completed requests and holds Regular Client status."
                    : `${5 - selectedProfile.completedCount} more completed service requests required to achieve Regular Client status.`}
                </p>
              </div>

              {/* Chronological Bookings Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Booking History Timeline ({selectedProfile.bookings.length})
                </h4>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedProfile.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">#{b.id}</span>
                          <span className="font-semibold text-slate-900 truncate">{b.serviceType}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {b.appointmentDateFormatted || b.appointmentDate} • {b.preferredTime}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {b.status === 'completed' && (
                          <Badge className="bg-[#6cb166] text-white border-[#6cb166] text-[10px]">Completed</Badge>
                        )}
                        {b.status === 'confirmed' && (
                          <Badge className="bg-[#3b66b0] text-white border-[#3b66b0] text-[10px]">Confirmed</Badge>
                        )}
                        {b.status === 'pending' && (
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">Pending</Badge>
                        )}
                        {b.status === 'cancelled' && (
                          <Badge variant="outline" className="border-slate-200 text-slate-500 text-[10px]">Cancelled</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
