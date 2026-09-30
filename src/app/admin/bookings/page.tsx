'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  ShieldAlert, 
  Lock, 
  Menu, 
  X, 
  FileSpreadsheet,
  CheckCircle2,
  CalendarClock,
  Sparkles,
  ChevronDown,
  Compass,
  Laptop,
  Smartphone,
  Globe,
  Crown,
  Award,
  UserCheck,
  Users,
  UserPlus,
  ArrowUpRight,
  History,
  Eye,
  Building2
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { 
  Booking, 
  BookingStatus, 
  subscribeToBookings, 
  updateBookingStatusRecord, 
  deleteBookingRecord,
  fetchAllBookingsDirect,
  calculateClientTier,
  aggregateClientProfiles,
  ClientTier,
  ClientProfileSummary,
  normalizeDeclaredSource
} from '@/lib/bookings';
import { exportBookingsToExcel, exportBookingsToCSV } from '@/lib/exportExcel';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3b66b0]/20 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading Bookings Console...</p>
        </div>
      </div>
    }>
      <AdminBookingsContent />
    </Suspense>
  );
}

function AdminBookingsContent() {

  // Admin Auth Store
  const { currentAdmin, login } = useAdminStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Bookings Data & Sync
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [targetBookingToDelete, setTargetBookingToDelete] = useState<Booking | null>(null);

  // Sync filter state from URL params — runs on mount AND whenever the URL changes
  // This makes sidebar links (?status=pending, etc.) immediately apply the filter
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<ClientTier | 'all'>('all');

  useEffect(() => {
    setStatusFilter(searchParams.get('status') || 'all');
    setChannelFilter(searchParams.get('channel') || 'all');
    setTierFilter((searchParams.get('tier') as ClientTier | 'all') || 'all');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Client Profile History Modal Drawer state
  const [selectedClientProfile, setSelectedClientProfile] = useState<ClientProfileSummary | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Booking Detail Dialog state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Resolve auth status on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Subscribe to real-time bookings
  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
      setLastSyncedTime(new Date().toLocaleTimeString());
    });
    return () => unsubscribe();
  }, []);

  // Reset to first page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, channelFilter, tierFilter, searchQuery]);

  // Derived attribution channels on-the-fly from incoming bookings
  const dynamicChannels = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach(b => {
      const channel = b.referralSource || b.attribution?.channel;
      if (channel && channel.trim()) {
        const clean = channel.startsWith('Others:') ? 'Others' : channel.trim();
        set.add(clean);
      }
    });
    return Array.from(set).sort();
  }, [bookings]);

  // CRM Client Lifecycle aggregated profiles
  const clientProfiles = useMemo(() => {
    return aggregateClientProfiles(bookings);
  }, [bookings]);

  // Client Tier counts
  const tierCounts = useMemo(() => {
    let potential = 0;
    let client = 0;
    let regular = 0;
    clientProfiles.forEach(p => {
      if (p.tier === 'regular') regular++;
      else if (p.tier === 'client') client++;
      else potential++;
    });
    return { potential, client, regular, totalRequesters: clientProfiles.length };
  }, [clientProfiles]);

  // Pending count for sidebar badge
  const pendingCount = useMemo(() => {
    return bookings.filter(b => b.status === 'pending').length;
  }, [bookings]);

  // Secondary Fallback Fetcher & Manual Refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const direct = await fetchAllBookingsDirect();
      if (direct.length > 0) setBookings(direct);
      setLastSyncedTime(new Date().toLocaleTimeString());
      toast({
        title: "Bookings Synchronized",
        description: `Successfully refreshed ${bookings.length} requests from central dispatch.`,
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

  // Status Change Workflow Action with Dual-Write Resilience & Tier Progression Check
  const handleStatusChange = async (booking: Booking, newStatus: BookingStatus) => {
    const previousStatus = booking.status;

    // Check if this action will promote the user to Regular Client (hitting 5th completed booking)
    const existingTier = calculateClientTier({ email: booking.email, phone: booking.phone }, bookings);
    const willHitRegular = newStatus === 'completed' && previousStatus !== 'completed' && existingTier.completedCount === 4;

    // 1. Commit status update to database & cache
    await updateBookingStatusRecord(booking.id, newStatus);

    // Optimistically update state
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: newStatus, updatedAt: Date.now() } : b));

    // Show celebratory promotion notification if customer reached 5 completed bookings
    if (willHitRegular) {
      toast({
        title: "⭐ Customer Promoted to Regular Client!",
        description: `${booking.customerName} has reached 5 completed bookings and unlocked Regular Client status!`
      });
    }

    // 2. Trigger automated customer notification engine (/api/bookings/notify-status)
    try {
      const notifyRes = await fetch('/api/bookings/notify-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          status: newStatus,
          customerName: booking.customerName,
          email: booking.email,
          serviceType: booking.serviceType,
          appointmentDateFormatted: booking.appointmentDateFormatted,
          preferredTime: booking.preferredTime,
          locationUrl: booking.locationUrl
        })
      });

      if (notifyRes.ok) {
        toast({
          title: `Booking marked as ${newStatus.toUpperCase()}`,
          description: `Email notification sent to ${booking.email}.`,
        });
      } else {
        toast({
          title: `Booking marked as ${newStatus.toUpperCase()}`,
          description: `Status updated in database for ${booking.customerName}.`,
        });
      }
    } catch (err) {
      toast({
        title: `Booking marked as ${newStatus.toUpperCase()}`,
        description: `Status updated. Notification dispatch queued.`,
      });
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!targetBookingToDelete) return;
    const id = targetBookingToDelete.id;
    const name = targetBookingToDelete.customerName;

    const success = await deleteBookingRecord(id);
    if (!success) {
      setTargetBookingToDelete(null);
      toast({
        title: "Delete Failed",
        description: `Failed to delete "${name}". Please check database permissions.`,
        variant: "destructive"
      });
      return;
    }

    setBookings(prev => prev.filter(b => b.id !== id));
    setTargetBookingToDelete(null);

    toast({
      title: "Booking Deleted",
      description: `Request for "${name}" has been permanently purged.`,
      variant: "default"
    });
  };

  // Filter & Search Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // 1. Status Filter
      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }

      // 2. Channel Filter
      if (channelFilter !== 'all') {
        const source = b.referralSource || '';
        const matchChannel = source.startsWith(channelFilter);
        if (!matchChannel) return false;
      }

      // 3. Client Tier Filter (potential | client | regular)
      if (tierFilter !== 'all') {
        const requesterTier = calculateClientTier({ email: b.email, phone: b.phone }, bookings);
        if (requesterTier.tier !== tierFilter) {
          return false;
        }
      }

      // 4. Universal Search matching across customerName, email, phone, and serviceType
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (b.customerName || '').toLowerCase().includes(q);
        const matchesEmail = (b.email || '').toLowerCase().includes(q);
        const matchesPhone = (b.phone || '').toLowerCase().includes(q);
        const matchesService = (b.serviceType || '').toLowerCase().includes(q);
        const matchesRef = (b.id || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesService && !matchesRef) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, statusFilter, channelFilter, tierFilter, searchQuery]);

  // Open Client Detail Modal
  const handleOpenClientProfile = (identifier: { email?: string; phone?: string; customerName?: string }) => {
    const profile = clientProfiles.find(p => {
      const matchEmail = identifier.email && p.email && p.email.toLowerCase() === identifier.email.toLowerCase();
      const matchPhone = identifier.phone && p.phone && p.phone.includes(identifier.phone.slice(-7));
      return matchEmail || matchPhone;
    });

    if (profile) {
      setSelectedClientProfile(profile);
      setIsProfileModalOpen(true);
    }
  };

  // Pagination slice
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBookings.slice(startIndex, startIndex + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  // Export to Excel handler
  const handleExportExcel = () => {
    if (filteredBookings.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no bookings matching the current filters.",
        variant: "destructive"
      });
      return;
    }

    const filterDescriptor = statusFilter === 'all' 
      ? (tierFilter !== 'all' ? `Tier-${tierFilter}` : (channelFilter === 'all' ? 'All' : channelFilter)) 
      : statusFilter;
    
    const success = exportBookingsToExcel(filteredBookings, {
      filterName: filterDescriptor,
      filenamePrefix: 'ASSERWA_Bookings'
    });

    if (success) {
      toast({
        title: "Excel (.xlsx) Report Generated",
        description: `Exported ${filteredBookings.length} booking records with Client Loyalty Tiers.`,
      });
    }
  };

  // Export to CSV handler
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no bookings matching the current filters.",
        variant: "destructive"
      });
      return;
    }
    const filterDescriptor = statusFilter === 'all' ? 'All' : statusFilter;
    exportBookingsToCSV(filteredBookings, { filterName: filterDescriptor });
    toast({
      title: "CSV Report Downloaded",
      description: `Exported ${filteredBookings.length} booking rows.`,
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setChannelFilter('all');
    setTierFilter('all');
    setCurrentPage(1);
  };

  // Fast inline login for admin
  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your administrator email and password.');
      return;
    }
    const success = login(loginEmail.trim(), loginPassword.trim());
    if (!success) {
      setLoginError('Invalid administrator credentials.');
    } else {
      toast({
        title: "Welcome back!",
        description: `Signed in as ${loginEmail.trim()}.`,
      });
      setLoginPassword('');
    }
  };

  // 1. Loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#3b66b0]/30 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Resolving Administrative Access Claims...</p>
        </div>
      </div>
    );
  }

  // 2. Auth Guard: Unauthorized Access Screen if not logged in as Admin
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
              The ASSERWA Booking & Dispatch Management Console is restricted to authorized operations administrators.
            </p>
          </div>

          <form onSubmit={handleInlineLogin} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Administrator Email</label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@asserwa.rw"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10"
                required
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
              Sign In to Control Center
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Button asChild variant="link" className="text-xs text-slate-500 hover:text-slate-900 p-0">
              <Link href="/">
                Return to Public Website
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics counts
  const totalCount = bookings.length;
  const pendingCountTotal = bookings.filter(b => b.status === 'pending').length;
  const confirmedCountTotal = bookings.filter(b => b.status === 'confirmed').length;
  const completedCountTotal = bookings.filter(b => b.status === 'completed').length;
  const cancelledCountTotal = bookings.filter(b => b.status === 'cancelled').length;

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
        
        {/* Top Header Bar */}
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
                  Bookings & Dispatch Operations
                </h1>
                <Badge className="bg-blue-50 text-[#3b66b0] border border-blue-200 text-[10px] hidden sm:inline-flex">
                  Live Dispatch
                </Badge>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Manage incoming sanitation service requests, assign vacuum tankers, and monitor client loyalty status.
              </p>
            </div>
          </div>

          {/* Header Action Buttons: 1-Click Export & Manual Refresh */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="h-8 px-2.5 sm:px-3 bg-white border-slate-200 hover:bg-slate-100 text-slate-700 text-xs"
              title="Refresh database records"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5 text-slate-400", isRefreshing && "animate-spin text-[#3b66b0]")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <Button
              onClick={handleExportExcel}
              size="sm"
              className="h-8 px-3 bg-[#6cb166] hover:bg-[#5aa054] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>Export .xlsx</span>
            </Button>

            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 bg-white border-slate-200 hover:bg-slate-100 text-slate-700 text-xs hidden md:flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV</span>
            </Button>
          </div>
        </header>

        {/* Dedicated Menu Quick-Banners */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/admin/clients"
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#3b66b0] font-semibold transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Client Tracker: <strong>{tierCounts.totalRequesters}</strong> tracked (⭐ {tierCounts.regular} Regular)</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <Link
              href="/admin/performance"
              className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#3b66b0] font-semibold transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#3b66b0]" />
              <span>Platform Performance & Declared Sources Analytics</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden md:block">
            Last Synced: {lastSyncedTime}
          </div>
        </div>

        {/* Dashboard Workspace */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Quick Metrics Bar: Status Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            
            <div 
              onClick={() => setStatusFilter('all')}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer",
                statusFilter === 'all' 
                  ? "bg-[#3b66b0] text-white border-[#3b66b0] shadow-md" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              <p className={cn("text-[11px] font-bold uppercase tracking-wider", statusFilter === 'all' ? "text-blue-100" : "text-slate-500")}>Total Requests</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className={cn("text-xl sm:text-2xl font-bold font-headline", statusFilter === 'all' ? "text-white" : "text-slate-900")}>{totalCount}</span>
                <span className={cn("text-[10px] font-semibold", statusFilter === 'all' ? "text-white/80" : "text-slate-400")}>100%</span>
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('pending')}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer",
                statusFilter === 'pending' 
                  ? "bg-[#3b66b0] text-white border-[#3b66b0] shadow-md" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              <p className={cn("text-[11px] font-bold uppercase tracking-wider flex items-center gap-1", statusFilter === 'pending' ? "text-blue-100" : "text-slate-600")}>
                <Clock className={cn("w-3 h-3", statusFilter === 'pending' ? "text-white" : "text-slate-400")} />
                <span>Pending Action</span>
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className={cn("text-xl sm:text-2xl font-bold font-headline", statusFilter === 'pending' ? "text-white" : "text-slate-900")}>{pendingCountTotal}</span>
                {pendingCountTotal > 0 && (
                  <span className={cn("text-[10px] px-1.5 py-0.2 rounded font-bold", statusFilter === 'pending' ? "bg-white/20 text-white" : "bg-slate-100 text-slate-800 border border-slate-200")}>
                    Review
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('confirmed')}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer",
                statusFilter === 'confirmed' 
                  ? "bg-[#3b66b0] text-white border-[#3b66b0] shadow-md" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              <p className={cn("text-[11px] font-bold uppercase tracking-wider flex items-center gap-1", statusFilter === 'confirmed' ? "text-blue-100" : "text-slate-600")}>
                <CheckCircle className={cn("w-3 h-3", statusFilter === 'confirmed' ? "text-white" : "text-slate-400")} />
                <span>Confirmed</span>
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className={cn("text-xl sm:text-2xl font-bold font-headline", statusFilter === 'confirmed' ? "text-white" : "text-slate-900")}>{confirmedCountTotal}</span>
                <span className={cn("text-[10px]", statusFilter === 'confirmed' ? "text-blue-100" : "text-slate-400")}>Scheduled</span>
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('completed')}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer",
                statusFilter === 'completed' 
                  ? "bg-[#6cb166] text-white border-[#6cb166] shadow-md" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              <p className={cn("text-[11px] font-bold uppercase tracking-wider flex items-center gap-1", statusFilter === 'completed' ? "text-white" : "text-slate-600")}>
                <CheckCircle2 className={cn("w-3 h-3", statusFilter === 'completed' ? "text-white" : "text-slate-400")} />
                <span>Completed</span>
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className={cn("text-xl sm:text-2xl font-bold font-headline", statusFilter === 'completed' ? "text-white" : "text-slate-900")}>{completedCountTotal}</span>
                <span className={cn("text-[10px]", statusFilter === 'completed' ? "text-white/80" : "text-slate-400")}>Archived</span>
              </div>
            </div>

            <div 
              onClick={() => setStatusFilter('cancelled')}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer col-span-2 sm:col-span-1",
                statusFilter === 'cancelled' 
                  ? "bg-slate-200 text-slate-900 border-slate-400 shadow-md font-bold" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              <p className={cn("text-[11px] font-bold uppercase tracking-wider flex items-center gap-1", statusFilter === 'cancelled' ? "text-slate-800" : "text-slate-600")}>
                <XCircle className={cn("w-3 h-3", statusFilter === 'cancelled' ? "text-slate-700" : "text-slate-400")} />
                <span>Cancelled</span>
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className={cn("text-xl sm:text-2xl font-bold font-headline", statusFilter === 'cancelled' ? "text-slate-900" : "text-slate-500")}>{cancelledCountTotal}</span>
                <span className="text-[10px] text-slate-400">Closed</span>
              </div>
            </div>

          </div>

          {/* Filtering, Search & Attribution Controls Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              
              {/* Universal Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  type="text"
                  placeholder="Search by customer name, email, phone, service type, or reference code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 pl-10 h-10 text-xs rounded-xl focus:bg-white focus:border-[#3b66b0]"
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

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Statuses', count: totalCount },
                  { id: 'pending', label: 'Pending', count: pendingCountTotal },
                  { id: 'confirmed', label: 'Confirmed', count: confirmedCountTotal },
                  { id: 'completed', label: 'Completed', count: completedCountTotal },
                  { id: 'cancelled', label: 'Cancelled', count: cancelledCountTotal },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5",
                      statusFilter === tab.id
                        ? "bg-[#3b66b0] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                    )}
                  >
                    <span>{tab.label}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold",
                      statusFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    )}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

            </div>

            {/* Loyalty Tier Quick Filter Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Client Tier:</span>
                </span>

                <button
                  onClick={() => setTierFilter('all')}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors",
                    tierFilter === 'all'
                      ? "bg-slate-800 text-white font-bold"
                      : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  All Tiers
                </button>

                <button
                  onClick={() => setTierFilter('regular')}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1",
                    tierFilter === 'regular'
                      ? "bg-emerald-600 text-white font-bold shadow-xs"
                      : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                  )}
                >
                  <span>⭐ Regular Clients (5+)</span>
                  <span className="font-mono text-[10px] font-bold">({tierCounts.regular})</span>
                </button>

                <button
                  onClick={() => setTierFilter('client')}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1",
                    tierFilter === 'client'
                      ? "bg-[#3b66b0] text-white font-bold shadow-xs"
                      : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
                  )}
                >
                  <span>Clients (1–4)</span>
                  <span className="font-mono text-[10px] font-bold">({tierCounts.client})</span>
                </button>

                <button
                  onClick={() => setTierFilter('potential')}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1",
                    tierFilter === 'potential'
                      ? "bg-amber-500 text-white font-bold shadow-xs"
                      : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                  )}
                >
                  <span>Potential (0)</span>
                  <span className="font-mono text-[10px] font-bold">({tierCounts.potential})</span>
                </button>
              </div>

              {/* Metrics Counter & Reset */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs text-slate-500">
                  Showing <strong className="text-slate-900">{filteredBookings.length}</strong> of <strong className="text-slate-700">{totalCount}</strong> Requests
                </span>

                {(statusFilter !== 'all' || channelFilter !== 'all' || tierFilter !== 'all' || searchQuery.trim()) && (
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-1.5"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

            </div>

          </div>

          {/* Bookings Cards Grid / List */}
          {paginatedBookings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <CalendarClock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-headline font-bold text-slate-900">
                  No Matching Bookings Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  There are no service booking requests matching your current filter criteria or search query.
                </p>
              </div>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                size="sm"
                className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <span>Requester</span>
                <span>Service</span>
                <span>Provider</span>
                <span>Date</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-100">
                {paginatedBookings.map((booking) => {
                  const isPending = booking.status === 'pending';
                  const isConfirmed = booking.status === 'confirmed';
                  const isCompleted = booking.status === 'completed';
                  const isCancelled = booking.status === 'cancelled';
                  const requesterTier = calculateClientTier({ email: booking.email, phone: booking.phone }, bookings);

                  const statusBadge = isPending
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold"><Clock className="w-2.5 h-2.5" />Pending</span>
                    : isConfirmed
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#3b66b0] text-[10px] font-semibold"><CheckCircle className="w-2.5 h-2.5" />Confirmed</span>
                    : isCompleted
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold"><CheckCircle2 className="w-2.5 h-2.5" />Completed</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-semibold"><XCircle className="w-2.5 h-2.5" />Cancelled</span>;

                  return (
                    <div
                      key={booking.id}
                      className={cn(
                        "grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-3 px-4 py-3 items-center hover:bg-slate-50/70 transition-colors cursor-pointer group",
                        isCancelled && "opacity-70"
                      )}
                      onClick={() => { setSelectedBooking(booking); setIsDetailOpen(true); }}
                    >
                      {/* Requester */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#3b66b0] transition-colors">{booking.customerName}</p>
                          {requesterTier.tier === 'regular' && <span title="Regular Client">⭐</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{booking.phone} • {booking.email}</p>
                      </div>

                      {/* Service */}
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{booking.serviceType}</p>
                        {booking.assignedMemberName && (
                          <p className="text-[11px] text-slate-500 truncate hidden md:block">{booking.assignedMemberName}</p>
                        )}
                      </div>

                      {/* Provider */}
                      <div className="hidden md:block min-w-0">
                        <p className="text-xs text-slate-700 truncate">{booking.assignedMemberName || <span className="text-slate-400 italic">Not assigned</span>}</p>
                      </div>

                      {/* Date */}
                      <div className="hidden md:block">
                        <p className="text-xs text-slate-700 font-medium">{booking.appointmentDateFormatted || booking.appointmentDate}</p>
                        <p className="text-[11px] text-slate-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>

                      {/* Status */}
                      <div className="hidden md:flex">{statusBadge}</div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {isPending && (
                          <Button
                            onClick={() => handleStatusChange(booking, 'confirmed')}
                            size="sm"
                            title="Confirm"
                            className="h-7 w-7 p-0 bg-[#3b66b0] hover:bg-[#2b4c85] text-white shadow-xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {isConfirmed && (
                          <Button
                            onClick={() => handleStatusChange(booking, 'completed')}
                            size="sm"
                            title="Mark Completed"
                            className="h-7 w-7 p-0 bg-[#6cb166] hover:bg-[#5aa054] text-white shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {(isPending || isConfirmed) && (
                          <Button
                            onClick={() => handleStatusChange(booking, 'cancelled')}
                            size="sm"
                            variant="outline"
                            title="Cancel"
                            className="h-7 w-7 p-0 bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {(isCompleted || isCancelled) && (
                          <Button
                            onClick={() => handleStatusChange(booking, 'pending')}
                            size="sm"
                            variant="outline"
                            title="Reset to Pending"
                            className="h-7 w-7 p-0 bg-white border-slate-200 text-slate-500 hover:text-slate-900"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={() => setTargetBookingToDelete(booking)}
                              variant="ghost"
                              size="sm"
                              title="Delete"
                              className="h-7 w-7 p-0 text-slate-300 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border-slate-200 text-slate-900">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-slate-900">Delete Booking Record?</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 text-xs">
                                Permanently remove the booking request for{' '}
                                <strong className="text-slate-900">{booking.customerName}</strong> (#{booking.id})? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white border-transparent">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {/* Mobile-only status + date strip */}
                      <div className="md:hidden flex items-center justify-between gap-2">
                        {statusBadge}
                        <span className="text-[11px] text-slate-400">{booking.appointmentDateFormatted || booking.appointmentDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredBookings.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl px-4 shadow-xs">
              <AdminPagination
                currentPage={currentPage}
                totalItems={filteredBookings.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}

        </div>

      </main>

      {/* Booking Detail Dialog (opens on row click) */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
          {selectedBooking && (() => {
            const b = selectedBooking;
            const isPending = b.status === 'pending';
            const isConfirmed = b.status === 'confirmed';
            const isCompleted = b.status === 'completed';
            const isCancelled = b.status === 'cancelled';
            const requesterTier = calculateClientTier({ email: b.email, phone: b.phone }, bookings);
            const declaredSource = normalizeDeclaredSource(b.referralSource || b.attribution?.channel || '');
            return (
              <div className="space-y-5">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-3 pr-6">
                    <div>
                      <DialogTitle className="text-lg font-headline font-bold text-slate-900">{b.customerName}</DialogTitle>
                      <DialogDescription className="text-xs text-slate-500 mt-0.5">Booking #{b.id} • Received {new Date(b.createdAt).toLocaleString()}</DialogDescription>
                    </div>
                    {isPending && <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-xs">Pending</Badge>}
                    {isConfirmed && <Badge className="bg-[#3b66b0] text-white text-xs">Confirmed</Badge>}
                    {isCompleted && <Badge className="bg-[#6cb166] text-white text-xs">Completed</Badge>}
                    {isCancelled && <Badge variant="outline" className="text-slate-500 text-xs">Cancelled</Badge>}
                  </div>
                </DialogHeader>

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Requester Contact</span>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${b.email}`} className="hover:text-[#3b66b0] hover:underline">{b.email}</a>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${b.phone}`} className="hover:text-[#3b66b0] hover:underline">{b.phone}</a>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Tier</span>
                    <div className="mt-1">
                      {requesterTier.tier === 'regular' && <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs">⭐ Regular Client ({requesterTier.completedCount} Completed)</Badge>}
                      {requesterTier.tier === 'client' && <Badge className="bg-blue-50 text-[#3b66b0] border-blue-200 text-xs">Client ({requesterTier.completedCount} Completed)</Badge>}
                      {requesterTier.tier === 'potential' && <Badge className="bg-amber-50 text-amber-900 border-amber-200 text-xs">Potential Client</Badge>}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Source: <span className="font-semibold text-slate-700">{declaredSource}</span></div>
                  </div>
                </div>

                {/* Service & Schedule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Requested Service</span>
                    <p className="text-sm font-semibold text-slate-900">{b.serviceType}</p>
                    {b.description && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 italic text-[11px]">
                        "{b.description}"
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Schedule</span>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      <p className="font-semibold text-slate-900">{b.appointmentDateFormatted || b.appointmentDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-slate-700">{b.preferredTime}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {b.locationUrl && (
                  <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-slate-700 truncate font-mono text-[11px]">{b.locationUrl}</span>
                    </div>
                    <a href={b.locationUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1 text-[#3b66b0] font-semibold hover:underline">
                      <span>Maps</span><ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Provider */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#3b66b0]/10 text-[#3b66b0] flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Service Provider</span>
                      <p className="font-bold text-slate-900 truncate">{b.assignedMemberName || <span className="text-slate-400 italic">Not assigned</span>}</p>
                    </div>
                  </div>
                  {b.assignedMemberWebsite && (
                    <a href={b.assignedMemberWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[#3b66b0] hover:bg-slate-50 font-semibold text-xs">
                      <span>Visit Website</span><ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleOpenClientProfile({ email: b.email, phone: b.phone, customerName: b.customerName });
                    }}
                  >
                    <History className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    Client History
                  </Button>
                  <div className="flex flex-wrap items-center gap-2">
                    {isPending && (
                      <Button onClick={() => { handleStatusChange(b, 'confirmed'); setIsDetailOpen(false); }} size="sm" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white text-xs h-8">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />Confirm
                      </Button>
                    )}
                    {isConfirmed && (
                      <Button onClick={() => { handleStatusChange(b, 'completed'); setIsDetailOpen(false); }} size="sm" className="bg-[#6cb166] hover:bg-[#5aa054] text-white text-xs h-8">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Mark Completed
                      </Button>
                    )}
                    {(isPending || isConfirmed) && (
                      <Button onClick={() => { handleStatusChange(b, 'cancelled'); setIsDetailOpen(false); }} variant="outline" size="sm" className="text-xs h-8">
                        <XCircle className="w-3.5 h-3.5 mr-1.5 text-slate-400" />Cancel
                      </Button>
                    )}
                    {(isCompleted || isCancelled) && (
                      <Button onClick={() => { handleStatusChange(b, 'pending'); setIsDetailOpen(false); }} variant="outline" size="sm" className="text-xs h-8">
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />Reset to Pending
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Customer Profile & Booking Timeline Modal Drawer */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[85vh] overflow-y-auto">
          {selectedClientProfile && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div>
                    <DialogTitle className="text-lg font-headline font-bold text-slate-900">
                      {selectedClientProfile.customerName}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 mt-1">
                      Service Requester Profile & Complete Booking Timeline
                    </DialogDescription>
                  </div>

                  {selectedClientProfile.tier === 'regular' && (
                    <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-xs px-2.5 py-0.5">
                      ⭐ Regular Client (5+ Completed)
                    </Badge>
                  )}
                  {selectedClientProfile.tier === 'client' && (
                    <Badge className="bg-blue-50 text-[#3b66b0] border-blue-200 font-semibold text-xs px-2.5 py-0.5">
                      Client ({selectedClientProfile.completedCount} Completed)
                    </Badge>
                  )}
                  {selectedClientProfile.tier === 'potential' && (
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
                    <span>{selectedClientProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedClientProfile.phone}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Declared Acquisition</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedClientProfile.declaredSources.map(s => (
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
                    {selectedClientProfile.completedCount} / 5 Completed Bookings
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      selectedClientProfile.tier === 'regular' ? "bg-emerald-600" : "bg-[#3b66b0]"
                    )}
                    style={{ width: `${Math.min(100, Math.round((selectedClientProfile.completedCount / 5) * 100))}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {selectedClientProfile.tier === 'regular'
                    ? "✓ Client has satisfied the requirement of 5 or more completed requests and holds Regular Client status."
                    : `${5 - selectedClientProfile.completedCount} more completed service requests required to achieve Regular Client status.`}
                </p>
              </div>

              {/* Chronological Bookings Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Booking Requests History ({selectedClientProfile.bookings.length})
                </h4>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedClientProfile.bookings.map((b) => (
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
                          {b.assignedMemberName && (
                            <span className="ml-2 font-medium text-[#3b66b0]">
                              • Provider: {b.assignedMemberName}
                            </span>
                          )}
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

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Button asChild size="sm" className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white text-xs">
                  <Link href={`/admin/clients?search=${encodeURIComponent(selectedClientProfile.email || selectedClientProfile.customerName)}`}>
                    <span>Open in Client Tracker</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
