'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Search, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  CheckCircle2, 
  FileSpreadsheet, 
  Download, 
  Menu, 
  X, 
  RefreshCw, 
  Compass, 
  Truck, 
  Globe, 
  ArrowUpRight, 
  Filter,
  Users,
  Inbox,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { 
  MemberCompany, 
  subscribeToMemberCompanies, 
  DEFAULT_MEMBER_COMPANIES,
  getMemberLogo,
  toggleMemberVisibility
} from '@/lib/members';
import { 
  Booking, 
  BookingStatus, 
  subscribeToBookings, 
  updateBookingStatusRecord,
  calculateClientTier,
  normalizeDeclaredSource
} from '@/lib/bookings';
import { exportBookingsToExcel, exportBookingsToCSV } from '@/lib/exportExcel';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminMemberBookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3b66b0]/20 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading Member Dispatch Console...</p>
        </div>
      </div>
    }>
      <AdminMemberBookingsContent />
    </Suspense>
  );
}

function AdminMemberBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Admin Auth Store
  const { currentAdmin, login } = useAdminStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('tharushyamagara@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data states
  const [members, setMembers] = useState<MemberCompany[]>(DEFAULT_MEMBER_COMPANIES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Auth resolution
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Subscribe to real-time members
  useEffect(() => {
    const unsub = subscribeToMemberCompanies((data) => {
      setMembers(data);
    });
    return () => unsub();
  }, []);

  // Subscribe to real-time bookings
  useEffect(() => {
    const unsub = subscribeToBookings((data) => {
      setBookings(data);
    });
    return () => unsub();
  }, []);

  // Pre-select member from URL or default to first member
  useEffect(() => {
    if (members.length === 0) return;
    const urlMemberId = searchParams.get('memberId');
    if (urlMemberId && members.some(m => m.id === urlMemberId)) {
      setSelectedMemberId(urlMemberId);
    } else if (!selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [members, searchParams, selectedMemberId]);

  // Selected Member
  const currentMember = useMemo(() => {
    return members.find(m => m.id === selectedMemberId) || members[0] || null;
  }, [members, selectedMemberId]);

  // Map bookings to members
  const memberBookingsMap = useMemo(() => {
    const map = new Map<string, Booking[]>();
    members.forEach(m => map.set(m.id, []));

    bookings.forEach(b => {
      if (b.assignedMemberId && map.has(b.assignedMemberId)) {
        map.get(b.assignedMemberId)!.push(b);
      } else if (b.assignedMemberName) {
        // Fallback match by company name
        const matched = members.find(m => 
          m.name.toLowerCase().trim() === b.assignedMemberName!.toLowerCase().trim()
        );
        if (matched) {
          map.get(matched.id)!.push(b);
        }
      }
    });

    return map;
  }, [members, bookings]);

  // Filtered member list for selector
  const filteredMemberList = useMemo(() => {
    if (!memberSearchQuery.trim()) return members;
    const q = memberSearchQuery.toLowerCase().trim();
    return members.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.headquarters.toLowerCase().includes(q)
    );
  }, [members, memberSearchQuery]);

  // Bookings for currently selected member
  const currentMemberBookings = useMemo(() => {
    if (!currentMember) return [];
    return memberBookingsMap.get(currentMember.id) || [];
  }, [currentMember, memberBookingsMap]);

  // Filtered bookings for currently selected member
  const filteredBookings = useMemo(() => {
    return currentMemberBookings.filter(b => {
      if (statusFilter !== 'all' && b.status !== statusFilter) {
        return false;
      }
      if (bookingSearchQuery.trim()) {
        const q = bookingSearchQuery.toLowerCase().trim();
        const matchName = (b.customerName || '').toLowerCase().includes(q);
        const matchEmail = (b.email || '').toLowerCase().includes(q);
        const matchPhone = (b.phone || '').toLowerCase().includes(q);
        const matchService = (b.serviceType || '').toLowerCase().includes(q);
        const matchId = (b.id || '').toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchPhone && !matchService && !matchId) {
          return false;
        }
      }
      return true;
    });
  }, [currentMemberBookings, statusFilter, bookingSearchQuery]);

  // Metric counts for current member
  const metrics = useMemo(() => {
    const total = currentMemberBookings.length;
    const pending = currentMemberBookings.filter(b => b.status === 'pending').length;
    const confirmed = currentMemberBookings.filter(b => b.status === 'confirmed').length;
    const completed = currentMemberBookings.filter(b => b.status === 'completed').length;
    const cancelled = currentMemberBookings.filter(b => b.status === 'cancelled').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, confirmed, completed, cancelled, completionRate };
  }, [currentMemberBookings]);

  // Status update handler
  const handleStatusChange = async (booking: Booking, newStatus: BookingStatus) => {
    const success = await updateBookingStatusRecord(booking.id, newStatus);
    if (success) {
      toast({
        title: "Booking Status Updated",
        description: `Booking #${booking.id} (${booking.customerName}) is now marked as ${newStatus}.`,
      });
    }
  };

  // Export handlers
  const handleExportExcel = () => {
    if (!currentMember) return;
    exportBookingsToExcel(filteredBookings, {
      filenamePrefix: `${currentMember.name.replace(/\s+/g, '_')}_Bookings`,
      filterName: statusFilter
    });
  };

  const handleExportCSV = () => {
    if (!currentMember) return;
    exportBookingsToCSV(filteredBookings, {
      filenamePrefix: `${currentMember.name.replace(/\s+/g, '_')}_Bookings`,
      filterName: statusFilter
    });
  };

  // Auth Guard
  if (authChecked && !currentAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-[#3b66b0] rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-headline font-bold text-slate-900">Member Dispatch Login</h2>
            <p className="text-xs text-slate-500">Sign in to view member-assigned service requests</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={(e) => {
            e.preventDefault();
            const success = login(loginEmail, loginPassword);
            if (!success) setLoginError('Invalid administrator credentials.');
          }} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Admin Email</label>
              <Input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-10"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#3b66b0] hover:bg-[#2b4c85] text-white text-xs h-10 font-bold">
              Sign In to Member Dispatch Console
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      
      {/* Desktop Left Sidebar Navigation */}
      <AdminSidebar className="hidden lg:flex" />

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white bg-slate-800 text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-headline font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#3b66b0]" />
                <span>Member Bookings & Dispatch Console</span>
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                View service bookings assigned to individual ASSERWA certified member companies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
              title="Export current member's bookings to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-[#6cb166]" />
              <span className="hidden sm:inline">Excel</span>
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
              title="Export current member's bookings to CSV"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-[#3b66b0]" />
              <span className="hidden sm:inline">CSV</span>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-8 px-3 text-xs bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-semibold shadow-2xs"
            >
              <Link href="/admin/members">
                <span>Manage Members</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Master-Detail Layout */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
          
          {/* Left Column: Member Companies Selector Roster */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Member Company
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {members.length} Members
                </span>
              </div>

              {/* Search Member input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search member..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#3b66b0]"
                />
              </div>

              {/* Member Selector List */}
              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredMemberList.map((m) => {
                  const mBookings = memberBookingsMap.get(m.id) || [];
                  const isSelected = m.id === selectedMemberId;
                  const activePending = mBookings.filter(b => b.status === 'pending').length;

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMemberId(m.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5",
                        isSelected
                          ? "bg-blue-50/70 border-[#3b66b0] text-[#1e3a6e] shadow-2xs"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {m.logoUrl ? (
                          <img
                            src={m.logoUrl}
                            alt={m.name}
                            className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#3b66b0] font-bold text-xs flex items-center justify-center shrink-0">
                            {m.logoText || m.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {m.name}
                            </p>
                            {m.active === false && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold">
                                Hidden
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">
                            {m.headquarters}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {activePending > 0 && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title={`${activePending} pending requests`} />
                        )}
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5",
                            isSelected ? "bg-white text-[#3b66b0] border-[#3b66b0]/40" : "bg-slate-100 text-slate-600 border-slate-200"
                          )}
                        >
                          {mBookings.length}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Member Profile Header & Assigned Bookings */}
          <div className="lg:col-span-8 space-y-6">
            
            {currentMember ? (
              <>
                {/* Member Profile Banner Card */}
                <div className={cn(
                  "bg-white border rounded-3xl p-6 shadow-sm space-y-5",
                  currentMember.active === false ? "border-amber-300 bg-amber-50/15" : "border-slate-200"
                )}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      {currentMember.logoUrl ? (
                        <img
                          src={currentMember.logoUrl}
                          alt={currentMember.name}
                          className="w-16 h-16 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1.5 shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b66b0] to-[#1e3a6e] text-white flex items-center justify-center font-headline font-extrabold text-xl shadow-xs shrink-0">
                          {currentMember.logoText || currentMember.name.substring(0, 3).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-headline font-extrabold text-slate-900">
                            {currentMember.name}
                          </h2>
                          
                          {/* Portal Visibility Badge */}
                          {currentMember.active !== false ? (
                            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>Visible on Portal</span>
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-bold flex items-center gap-1">
                              <EyeOff className="w-3 h-3 text-amber-700" />
                              <span>Hidden from Public</span>
                            </Badge>
                          )}

                          {currentMember.verified && (
                            <Badge className="bg-blue-50 text-[#3b66b0] border-blue-200 text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-[#3b66b0]" />
                              <span>Verified Member</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#3b66b0]">
                          {currentMember.category}
                        </p>
                        <p className="text-xs text-slate-600 pt-0.5 leading-relaxed">
                          {currentMember.briefDescription || currentMember.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons: Show/Hide and Website */}
                    <div className="flex flex-wrap sm:flex-col items-end gap-2 shrink-0">
                      {/* 1-Click Show / Hide Button */}
                      <Button
                        onClick={async () => {
                          const willBeActive = currentMember.active === false;
                          await toggleMemberVisibility(currentMember.id);
                          toast({
                            title: willBeActive ? "Member Now Visible" : "Member Hidden",
                            description: willBeActive
                              ? `"${currentMember.name}" is now visible to customers on front-end and booking.`
                              : `"${currentMember.name}" has been hidden from public views.`,
                          });
                        }}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 px-3 text-xs font-semibold shrink-0 transition-colors",
                          currentMember.active !== false
                            ? "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 border-transparent shadow-xs"
                        )}
                        title={currentMember.active !== false ? "Hide member from front-end and booking" : "Show member on front-end and booking"}
                      >
                        {currentMember.active !== false ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>Hide Member</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 mr-1 text-white" />
                            <span>Show Member</span>
                          </>
                        )}
                      </Button>

                      {currentMember.websiteUrl && (
                        <a
                          href={currentMember.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#3b66b0] hover:text-white border border-slate-200 hover:border-[#3b66b0] text-[#3b66b0] text-xs font-bold transition-all shadow-2xs shrink-0"
                          title={`Visit ${currentMember.name} official website`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Visit Website</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Company Quick Credentials */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Fleet Capacity</span>
                        <span className="font-semibold text-slate-800 truncate block">{currentMember.fleet || "Modern Vacuum Fleet"}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Headquarters</span>
                        <span className="font-semibold text-slate-800 truncate block">{currentMember.headquarters}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Direct Telephone</span>
                        <a href={`tel:${currentMember.phone}`} className="font-semibold text-slate-800 hover:text-[#3b66b0] truncate block">
                          {currentMember.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Dispatch Volume Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Requests</span>
                      <span className="text-xl font-headline font-black text-slate-900 mt-0.5 block">{metrics.total}</span>
                    </div>
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-center">
                      <span className="text-[10px] font-bold uppercase text-amber-700 block">Pending</span>
                      <span className="text-xl font-headline font-black text-amber-900 mt-0.5 block">{metrics.pending}</span>
                    </div>
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-center">
                      <span className="text-[10px] font-bold uppercase text-[#3b66b0] block">Confirmed</span>
                      <span className="text-xl font-headline font-black text-[#224480] mt-0.5 block">{metrics.confirmed}</span>
                    </div>
                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 block">Completed</span>
                      <span className="text-xl font-headline font-black text-emerald-900 mt-0.5 block">{metrics.completed}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Fulfillment</span>
                      <span className="text-xl font-headline font-black text-slate-800 mt-0.5 block">{metrics.completionRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Bookings Queue Filter & Search Bar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                      {[
                        { id: 'all', label: 'All Requests', count: metrics.total },
                        { id: 'pending', label: 'Pending', count: metrics.pending },
                        { id: 'confirmed', label: 'Confirmed', count: metrics.confirmed },
                        { id: 'completed', label: 'Completed', count: metrics.completed },
                        { id: 'cancelled', label: 'Cancelled', count: metrics.cancelled }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setStatusFilter(tab.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors whitespace-nowrap flex items-center gap-1.5",
                            statusFilter === tab.id
                              ? "bg-slate-900 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                          )}
                        >
                          <span>{tab.label}</span>
                          <span className="text-[10px] font-mono opacity-80">({tab.count})</span>
                        </button>
                      ))}
                    </div>

                    {/* Booking Search */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search requester, phone..."
                        value={bookingSearchQuery}
                        onChange={(e) => setBookingSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#3b66b0]"
                      />
                    </div>

                  </div>
                </div>

                {/* Bookings List Cards */}
                {filteredBookings.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-headline font-bold text-slate-900">
                      No Bookings Found For This Member
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      There are currently no customer service requests matching your criteria assigned to{' '}
                      <strong className="text-slate-800">{currentMember.name}</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((b) => {
                      const isPending = b.status === 'pending';
                      const isConfirmed = b.status === 'confirmed';
                      const isCompleted = b.status === 'completed';
                      const isCancelled = b.status === 'cancelled';
                      const requesterTier = calculateClientTier({ email: b.email, phone: b.phone }, bookings);
                      const declaredSource = normalizeDeclaredSource(b.referralSource || b.attribution?.channel || '');

                      return (
                        <div
                          key={b.id}
                          className={cn(
                            "bg-white border rounded-2xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md",
                            isPending && "border-slate-200",
                            isConfirmed && "border-[#3b66b0]/40",
                            isCompleted && "border-[#6cb166]/40",
                            isCancelled && "border-slate-200 bg-slate-50/60 opacity-80"
                          )}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-slate-400">#{b.id}</span>

                                {isPending && (
                                  <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-semibold px-2.5 py-0.5">
                                    Pending Action
                                  </Badge>
                                )}
                                {isConfirmed && (
                                  <Badge className="bg-[#3b66b0] text-white border-[#3b66b0] text-xs font-semibold px-2.5 py-0.5">
                                    Confirmed & Scheduled
                                  </Badge>
                                )}
                                {isCompleted && (
                                  <Badge className="bg-[#6cb166] text-white border-[#6cb166] text-xs font-semibold px-2.5 py-0.5">
                                    Completed Work
                                  </Badge>
                                )}
                                {isCancelled && (
                                  <Badge variant="outline" className="border-slate-200 text-slate-500 bg-slate-100 text-xs font-semibold px-2.5 py-0.5">
                                    Cancelled
                                  </Badge>
                                )}

                                <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                                  {declaredSource}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 pt-0.5">
                                <h4 className="font-headline font-bold text-slate-900 text-sm">
                                  {b.customerName}
                                </h4>
                                <span className="text-slate-300">•</span>
                                <a href={`tel:${b.phone}`} className="text-xs text-slate-600 hover:text-[#3b66b0] font-medium flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{b.phone}</span>
                                </a>
                                <span className="text-slate-300">•</span>
                                <a href={`mailto:${b.email}`} className="text-xs text-slate-600 hover:text-[#3b66b0] font-medium flex items-center gap-1 truncate max-w-[200px]">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span className="truncate">{b.email}</span>
                                </a>
                              </div>
                            </div>

                            {b.locationUrl && (
                              <a
                                href={b.locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs shrink-0"
                                title="Open exact customer GPS coordinates in Google Maps"
                              >
                                <MapPin className="w-3.5 h-3.5 text-red-500" />
                                <span>GPS Coordinates</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </a>
                            )}
                          </div>

                          {/* Service Details & Schedule */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <div className="sm:col-span-2 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Required</span>
                              <p className="font-bold text-slate-900 text-xs">{b.serviceType}</p>
                              {b.description && (
                                <p className="text-xs text-slate-600 italic mt-1">"{b.description}"</p>
                              )}
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheduled Date & Time</span>
                              <p className="font-semibold text-slate-900 text-xs flex items-center gap-1.5 mt-0.5">
                                <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                                <span>{b.appointmentDateFormatted || b.appointmentDate}</span>
                              </p>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{b.preferredTime}</span>
                              </p>
                            </div>
                          </div>

                          {/* Operational Status Actions */}
                          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-[11px] text-slate-400">
                              Logged: {new Date(b.createdAt).toLocaleString()}
                            </span>

                            <div className="flex items-center gap-2">
                              {isPending && (
                                <Button
                                  onClick={() => handleStatusChange(b, 'confirmed')}
                                  size="sm"
                                  className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white text-xs h-7 px-3 font-semibold shadow-2xs"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  <span>Confirm Request</span>
                                </Button>
                              )}

                              {isConfirmed && (
                                <Button
                                  onClick={() => handleStatusChange(b, 'completed')}
                                  size="sm"
                                  className="bg-[#6cb166] hover:bg-[#5aa054] text-white text-xs h-7 px-3 font-semibold shadow-2xs"
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  <span>Mark Completed</span>
                                </Button>
                              )}

                              {(isPending || isConfirmed) && (
                                <Button
                                  onClick={() => handleStatusChange(b, 'cancelled')}
                                  variant="outline"
                                  size="sm"
                                  className="bg-white border-slate-200 text-slate-600 hover:text-slate-900 text-xs h-7 px-2.5"
                                >
                                  <XCircle className="w-3 h-3 mr-1 text-slate-400" />
                                  <span>Cancel</span>
                                </Button>
                              )}

                              {(isCompleted || isCancelled) && (
                                <Button
                                  onClick={() => handleStatusChange(b, 'pending')}
                                  variant="outline"
                                  size="sm"
                                  className="bg-white border-slate-200 text-slate-600 hover:text-slate-900 text-xs h-7 px-2.5"
                                >
                                  <RotateCcw className="w-3 h-3 mr-1 text-slate-400" />
                                  <span>Reset to Pending</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
                Please select a member company from the left panel to inspect their assigned bookings.
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
