'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  FileText, 
  Users, 
  CalendarClock, 
  UserCheck, 
  LogOut, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Sparkles,
  Clock,
  CheckCircle2,
  CheckCircle,
  XCircle,
  BarChart3,
  Crown,
  Building2,
  CalendarCheck
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { subscribeToBookings, Booking, aggregateClientProfiles } from '@/lib/bookings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  pendingBookingsCount?: number;
  className?: string;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  pendingBookingsCount: propPendingCount,
  className,
  onCloseMobile
}: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'slideshows';
  const currentStatus = searchParams.get('status') || 'all';
  const { currentAdmin, logout } = useAdminStore();

  const [bookings, setBookings] = useState<Booking[]>([]);

  // Subscribe to real-time bookings count
  useEffect(() => {
    const unsubscribe = subscribeToBookings((data) => {
      setBookings(data);
    });
    return () => unsubscribe();
  }, []);

  const totalBookings = bookings.length;
  const pendingCount = propPendingCount !== undefined 
    ? propPendingCount 
    : bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  const clientProfiles = aggregateClientProfiles(bookings);
  const totalClients = clientProfiles.length;
  const regularClients = clientProfiles.filter(p => p.tier === 'regular').length;

  const isBookingsActive = pathname === '/admin/bookings';
  const isClientsActive = pathname === '/admin/clients';
  const isPerformanceActive = pathname === '/admin/performance';
  const isMembersActive = pathname === '/admin/members';
  const isMemberBookingsActive = pathname === '/admin/member-bookings';

  return (
    <aside className={cn(
      "w-72 bg-white text-slate-800 flex flex-col min-h-screen border-r border-slate-200 shrink-0 select-none",
      className
    )}>
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group" onClick={onCloseMobile}>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
            <Image src="/logo.png" alt="ASSERWA Logo" width={36} height={36} className="object-contain" priority />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-extrabold text-base text-slate-900 tracking-tight">
                ASSERWA
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#3b66b0] px-1.5 py-0.5 rounded border border-blue-200 font-mono">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#6cb166]" />
              <span>Control Center</span>
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation Modules */}
      <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        
        {/* SECTION 1: BOOKING & DISPATCH OPERATIONS */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Bookings & Dispatch</span>
            {pendingCount > 0 && (
              <span className="bg-[#3b66b0] text-white px-1.5 py-0.2 rounded-full font-bold font-mono">
                {pendingCount} PENDING
              </span>
            )}
          </div>

          {/* Master Bookings Item */}
          <div className="space-y-1">
            <Link
              href="/admin/bookings"
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group",
                isBookingsActive && currentStatus === 'all'
                  ? "bg-[#3b66b0] text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-2.5">
                <CalendarClock className={cn(
                  "w-4 h-4 transition-colors",
                  isBookingsActive && currentStatus === 'all' ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                )} />
                <span>All Bookings</span>
              </div>

              <span className={cn(
                "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                isBookingsActive && currentStatus === 'all'
                  ? "bg-white/20 text-white border-transparent"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              )}>
                {totalBookings}
              </span>
            </Link>

            {/* Quick Status Sub-navigation */}
            <div className="pl-4 pr-1 pt-0.5 pb-1 space-y-0.5 border-l border-slate-200 ml-4">
              
              {/* Pending Filter */}
              <Link
                href="/admin/bookings?status=pending"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors group",
                  isBookingsActive && currentStatus === 'pending'
                    ? "bg-slate-100 text-slate-900 font-bold border border-slate-300"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Clock className={cn(
                    "w-3 h-3 transition-colors",
                    isBookingsActive && currentStatus === 'pending' ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                  )} />
                  <span>Pending Requests</span>
                </div>
                {pendingCount > 0 && (
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded font-mono font-bold">
                    {pendingCount}
                  </span>
                )}
              </Link>

              {/* Confirmed Filter */}
              <Link
                href="/admin/bookings?status=confirmed"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors group",
                  isBookingsActive && currentStatus === 'confirmed'
                    ? "bg-[#3b66b0] text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className={cn(
                    "w-3 h-3 transition-colors",
                    isBookingsActive && currentStatus === 'confirmed' ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                  )} />
                  <span>Confirmed & Scheduled</span>
                </div>
                {confirmedCount > 0 && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded font-mono",
                    isBookingsActive && currentStatus === 'confirmed' ? "bg-white/20 text-white" : "bg-blue-50 text-[#3b66b0]"
                  )}>
                    {confirmedCount}
                  </span>
                )}
              </Link>

              {/* Completed Filter */}
              <Link
                href="/admin/bookings?status=completed"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors group",
                  isBookingsActive && currentStatus === 'completed'
                    ? "bg-[#6cb166] text-white font-bold shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={cn(
                    "w-3 h-3 transition-colors",
                    isBookingsActive && currentStatus === 'completed' ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                  )} />
                  <span>Completed Work</span>
                </div>
                {completedCount > 0 && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded font-mono",
                    isBookingsActive && currentStatus === 'completed' ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
                  )}>
                    {completedCount}
                  </span>
                )}
              </Link>

              {/* Cancelled Filter */}
              <Link
                href="/admin/bookings?status=cancelled"
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors group",
                  isBookingsActive && currentStatus === 'cancelled'
                    ? "bg-slate-100 text-slate-800 font-bold border border-slate-300"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <XCircle className={cn(
                    "w-3 h-3 transition-colors",
                    isBookingsActive && currentStatus === 'cancelled' ? "text-slate-800" : "text-slate-400 group-hover:text-slate-700"
                  )} />
                  <span>Cancelled Requests</span>
                </div>
                {cancelledCount > 0 && (
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                    {cancelledCount}
                  </span>
                )}
              </Link>

            </div>
          </div>
        </div>

        {/* SECTION 2: INTELLIGENCE & TRACKING */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Intelligence & Tracking
          </div>

          {/* Dedicated Client Tracker Menu Item */}
          <Link
            href="/admin/clients"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group",
              isClientsActive
                ? "bg-[#3b66b0] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Users className={cn(
                "w-4 h-4 transition-colors",
                isClientsActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
              )} />
              <span>Client Tracker</span>
            </div>

            <div className="flex items-center gap-1">
              {regularClients > 0 && (
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-0.2 rounded-full",
                  isClientsActive ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                )} title={`${regularClients} Regular Clients`}>
                  ⭐ {regularClients}
                </span>
              )}
              <span className={cn(
                "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                isClientsActive
                  ? "bg-white/20 text-white border-transparent"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              )}>
                {totalClients}
              </span>
            </div>
          </Link>

          {/* Dedicated Platform Performance Menu Item */}
          <Link
            href="/admin/performance"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group",
              isPerformanceActive
                ? "bg-[#3b66b0] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className={cn(
                "w-4 h-4 transition-colors",
                isPerformanceActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
              )} />
              <span>Platform Performance</span>
            </div>

            <span className={cn(
              "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
              isPerformanceActive
                ? "bg-white/20 text-white border-transparent"
                : "bg-slate-100 text-slate-700 border-slate-200"
            )}>
              Sources
            </span>
          </Link>

          {/* Dedicated Member Companies Menu Item */}
          <Link
            href="/admin/members"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group",
              isMembersActive
                ? "bg-[#3b66b0] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className={cn(
                "w-4 h-4 transition-colors",
                isMembersActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
              )} />
              <span>Member Companies</span>
            </div>

            <span className={cn(
              "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
              isMembersActive
                ? "bg-white/20 text-white border-transparent"
                : "bg-slate-100 text-slate-700 border-slate-200"
            )}>
              Roster
            </span>
          </Link>

          {/* Dedicated Member's Bookings Menu Item */}
          <Link
            href="/admin/member-bookings"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group",
              isMemberBookingsActive
                ? "bg-[#3b66b0] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2.5">
              <CalendarCheck className={cn(
                "w-4 h-4 transition-colors",
                isMemberBookingsActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
              )} />
              <span>Member's Bookings</span>
            </div>

            <span className={cn(
              "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
              isMemberBookingsActive
                ? "bg-white/20 text-white border-transparent"
                : "bg-slate-100 text-slate-700 border-slate-200"
            )}>
              Dispatch
            </span>
          </Link>
        </div>

        {/* SECTION 3: CONTENT & PORTAL MANAGEMENT */}
        <div className="space-y-1">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Website & CMS Content
          </div>

          <Link
            href="/admin"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group",
              pathname === '/admin' && (!currentTab || currentTab === 'slideshows' || currentTab === 'menus' || currentTab === 'about' || currentTab === 'services' || currentTab === 'gallery' || currentTab === 'news')
                ? "bg-[#3b66b0] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2.5">
              <FileText className={cn(
                "w-4 h-4 transition-colors",
                pathname === '/admin' && (!currentTab || currentTab === 'slideshows' || currentTab === 'menus' || currentTab === 'about' || currentTab === 'services' || currentTab === 'gallery' || currentTab === 'news')
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-700"
              )} />
              <span>Content Management</span>
            </div>
          </Link>

          <Link
            href="/admin?tab=users"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group",
              pathname === '/admin' && currentTab === 'users'
                ? "bg-[#3b66b0] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Users className={cn(
                "w-4 h-4 transition-colors",
                pathname === '/admin' && currentTab === 'users'
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-700"
              )} />
              <span>Users & Roles</span>
            </div>
          </Link>

          <Link
            href="/admin?tab=visitors"
            onClick={onCloseMobile}
            className={cn(
              "flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group",
              pathname === '/admin' && currentTab === 'visitors'
                ? "bg-[#3b66b0] text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className={cn(
                "w-4 h-4 transition-colors",
                pathname === '/admin' && currentTab === 'visitors'
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-700"
              )} />
              <span>Symposium 2026 Visitors</span>
            </div>
          </Link>
        </div>

        {/* SECTION 3: QUICK ACTIONS */}
        <div className="space-y-1 pt-2">
          <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </div>

          <Link
            href="/book"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors" />
              <span>Open Public Booking Form</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              <span>View Public Website</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
          </Link>
        </div>

      </div>

      {/* Active Operator Profile Widget */}
      {currentAdmin ? (
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#3b66b0] text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {currentAdmin.name ? currentAdmin.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {currentAdmin.name}
                </p>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                  {currentAdmin.role}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Sign out of Admin console"
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 h-7 w-7 shrink-0 rounded-lg ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-[10px] text-slate-500 truncate mt-1.5 font-mono">
            {currentAdmin.email}
          </p>
        </div>
      ) : (
        <div className="p-3.5 border-t border-slate-200 text-center bg-slate-50/70">
          <p className="text-xs text-slate-500">Not signed in</p>
        </div>
      )}
    </aside>
  );
}
