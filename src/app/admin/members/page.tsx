'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Plus, 
  Search, 
  ExternalLink, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Check, 
  Globe, 
  Truck, 
  Tag, 
  ShieldAlert, 
  Menu, 
  X,
  FileSpreadsheet,
  RotateCcw,
  CalendarCheck,
  ImageIcon,
  Eye,
  EyeOff,
  UploadCloud
} from 'lucide-react';
import { useAdminStore } from '@/lib/admin-store';
import { uploadMediaToFirebaseStorage } from '@/lib/firebase';
import { 
  MemberCompany, 
  DEFAULT_MEMBER_COMPANIES, 
  subscribeToMemberCompanies, 
  saveMemberCompanyRecord, 
  deleteMemberCompanyRecord,
  toggleMemberVisibility,
  toggleMemberWebsiteVisibility,
  setLocalMemberCompanies 
} from '@/lib/members';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
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
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminMembersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3b66b0]/20 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Loading Member Directory Console...</p>
        </div>
      </div>
    }>
      <AdminMembersContent />
    </Suspense>
  );
}

function AdminMembersContent() {
  const router = useRouter();

  // Admin Auth Store
  const { currentAdmin, login } = useAdminStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Members Data
  const [members, setMembers] = useState<MemberCompany[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal State
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState<MemberCompany | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberCompany | null>(null);
  const [targetMemberToDelete, setTargetMemberToDelete] = useState<MemberCompany | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBriefDescription, setFormBriefDescription] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formShowWebsite, setFormShowWebsite] = useState(true);
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formHeadquarters, setFormHeadquarters] = useState('');
  const [formFleet, setFormFleet] = useState('');
  const [formServices, setFormServices] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setUploadProgress(0);

    try {
      const url = await uploadMediaToFirebaseStorage(file, "member_logos", (progress) => {
        setUploadProgress(progress);
      });
      setFormLogoUrl(url);
      toast({
        title: "Logo Uploaded",
        description: "Company logo successfully uploaded to storage.",
      });
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Could not upload the logo image.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingLogo(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // Auth resolution
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Real-time subscriber to Member Companies
  useEffect(() => {
    const unsubscribe = subscribeToMemberCompanies((data) => {
      setMembers(data);
    });
    return () => unsubscribe();
  }, []);

  // Member counts by visibility
  const visibleCount = useMemo(() => members.filter(m => m.active !== false).length, [members]);
  const hiddenCount = useMemo(() => members.filter(m => m.active === false).length, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (visibilityFilter === 'visible' && m.active === false) return false;
      if (visibilityFilter === 'hidden' && m.active !== false) return false;
      if (categoryFilter !== 'all' && m.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchCat = m.category.toLowerCase().includes(q);
        const matchHq = m.headquarters.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchHq && !matchDesc) return false;
      }
      return true;
    });
  }, [members, visibilityFilter, categoryFilter, searchQuery]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set).sort();
  }, [members]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Reset to first page when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, visibilityFilter]);

  // Open Detail Modal
  const handleOpenDetailModal = (member: MemberCompany) => {
    setSelectedMemberForDetail(member);
    setIsDetailOpen(true);
  };

  // Toggle Member Visibility (Show / Hide)
  const handleToggleVisibility = async (member: MemberCompany) => {
    const willBeActive = member.active === false;
    await toggleMemberVisibility(member.id);
    toast({
      title: willBeActive ? "Member Now Visible" : "Member Hidden",
      description: willBeActive
        ? `"${member.name}" is now visible to customers on the homepage, directory, and booking portal.`
        : `"${member.name}" has been hidden from the front-end, member directory, and booking portal.`,
    });
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormCategory('Vacuum Truck Haulage & Sludge Evacuation');
    setFormDescription('');
    setFormBriefDescription('');
    setFormWebsite('');
    setFormShowWebsite(true);
    setFormLogoUrl('');
    setFormPhone('+250 788 ');
    setFormEmail('');
    setFormHeadquarters('Kigali, Rwanda');
    setFormFleet('4 Vacuum Haulers (12,000L - 18,000L)');
    setFormServices('Liquid Waste Collection and Transport, Emergency Pumping');
    setFormActive(true);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (member: MemberCompany) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormCategory(member.category || '');
    setFormDescription(member.description || '');
    setFormBriefDescription(member.briefDescription || '');
    setFormWebsite(member.websiteUrl || '');
    setFormShowWebsite(member.showWebsite !== false && Boolean(member.websiteUrl));
    setFormLogoUrl(member.logoUrl || '');
    setFormPhone(member.phone || '');
    setFormEmail(member.email || '');
    setFormHeadquarters(member.headquarters || '');
    setFormFleet(member.fleet || '');
    setFormServices(Array.isArray(member.services) ? member.services.join(', ') : '');
    setFormActive(member.active !== false);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Toggle Website Visibility
  const handleToggleWebsiteVisibility = async (member: MemberCompany) => {
    if (!member.websiteUrl || member.websiteUrl.trim() === '') {
      toast({
        title: "No Website Configured",
        description: `"${member.name}" does not have a website URL set. Edit the member to add one.`,
      });
      return;
    }
    const currentShow = member.showWebsite !== false;
    const newShow = !currentShow;
    const success = await toggleMemberWebsiteVisibility(member.id);
    if (success) {
      toast({
        title: newShow ? "Website Display Enabled" : "Website Display Hidden",
        description: newShow
          ? `The website for "${member.name}" is now visible on public pages.`
          : `The website for "${member.name}" is now hidden from public pages.`,
      });
    }
  };

  // Submit Member Form
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [k: string]: string } = {};

    if (!formName.trim()) {
      errors.name = 'Company name is required.';
    }

    let cleanWebsite = formWebsite.trim();
    if (cleanWebsite) {
      if (!cleanWebsite.startsWith('http://') && !cleanWebsite.startsWith('https://')) {
        cleanWebsite = `https://${cleanWebsite}`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const servicesList = formServices
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const memberToSave: MemberCompany = {
      id: editingMember ? editingMember.id : `mem-${Date.now()}`,
      name: formName.trim(),
      category: formCategory.trim() || 'Sanitation Service Provider',
      description: formDescription.trim(),
      briefDescription: formBriefDescription.trim() || formDescription.trim().substring(0, 130),
      websiteUrl: cleanWebsite,
      showWebsite: cleanWebsite ? formShowWebsite : false,
      logoUrl: formLogoUrl.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      headquarters: formHeadquarters.trim() || 'Kigali, Rwanda',
      fleet: formFleet.trim(),
      services: servicesList.length > 0 ? servicesList : ['Liquid Waste Collection and Transport'],
      verified: true,
      active: formActive,
      establishedYear: editingMember?.establishedYear || 2020,
      logoText: formName.trim().substring(0, 3).toUpperCase()
    };

    const success = await saveMemberCompanyRecord(memberToSave);
    if (!success) {
      toast({
        title: "Update Failed",
        description: `Failed to save "${memberToSave.name}". Please check database permissions.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsModalOpen(false);

    toast({
      title: editingMember ? "Member Company Updated" : "Member Company Created",
      description: `"${memberToSave.name}" has been saved and will appear in public booking selections.`,
    });
  };

  // Delete Member
  const handleDeleteMember = async () => {
    if (!targetMemberToDelete) return;
    const name = targetMemberToDelete.name;
    const success = await deleteMemberCompanyRecord(targetMemberToDelete.id);
    if (!success) {
      setTargetMemberToDelete(null);
      toast({
        title: "Delete Failed",
        description: `Failed to remove "${name}". Please check database permissions.`,
        variant: "destructive"
      });
      return;
    }

    setTargetMemberToDelete(null);

    toast({
      title: "Member Removed",
      description: `"${name}" has been removed from the ASSERWA member roster.`,
    });
  };

  // Reset to default roster
  const handleResetDefaults = () => {
    setLocalMemberCompanies(DEFAULT_MEMBER_COMPANIES);
    setMembers(DEFAULT_MEMBER_COMPANIES);
    toast({
      title: "Roster Reset",
      description: "Member companies reset to the official ASSERWA founding network.",
    });
  };

  // Fast inline login
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

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#3b66b0]/20 border-t-[#3b66b0] rounded-full animate-spin" />
          <p className="text-xs text-slate-500">Checking authorization claims...</p>
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
              The Member Companies Management Console is restricted to authorized operators.
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
              Sign In to Member Manager
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
                  Member Companies & Service Providers
                </h1>
                <Badge className="bg-blue-50 text-[#3b66b0] border border-blue-200 text-[10px] hidden sm:inline-flex">
                  {members.length} Members
                </Badge>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Manage ASSERWA member companies selectable by clients during online booking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleResetDefaults}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hidden sm:flex items-center gap-1.5"
              title="Reset to official founding members"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Founding Roster</span>
            </Button>

            <Button
              onClick={handleOpenAddModal}
              size="sm"
              className="h-8 px-3 bg-[#6cb166] hover:bg-[#5aa054] text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add Member Company</span>
            </Button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Member Roster Info Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  type="text"
                  placeholder="Search member companies by name, specialization, or district..."
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

              {/* Visibility and Category Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                
                {/* Visibility Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setVisibilityFilter('all')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors",
                      visibilityFilter === 'all'
                        ? "bg-white text-slate-900 shadow-2xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    All ({members.length})
                  </button>
                  <button
                    onClick={() => setVisibilityFilter('visible')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1",
                      visibilityFilter === 'visible'
                        ? "bg-emerald-600 text-white shadow-2xs font-bold"
                        : "text-slate-600 hover:text-emerald-700"
                    )}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Visible ({visibleCount})</span>
                  </button>
                  <button
                    onClick={() => setVisibilityFilter('hidden')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1",
                      visibilityFilter === 'hidden'
                        ? "bg-amber-600 text-white shadow-2xs font-bold"
                        : "text-slate-600 hover:text-amber-800"
                    )}
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Hidden ({hiddenCount})</span>
                  </button>
                </div>

                <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                {/* Category Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap",
                      categoryFilter === 'all'
                        ? "bg-slate-800 text-white font-bold"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    )}
                  >
                    All Sectors
                  </button>
                  {categories.slice(0, 3).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap truncate max-w-[150px]",
                        categoryFilter === cat
                          ? "bg-[#3b66b0] text-white font-bold"
                          : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                      )}
                      title={cat}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>
                Showing <strong>{filteredMembers.length}</strong> of <strong>{members.length}</strong> member companies
                {visibilityFilter !== 'all' && <span className="ml-1 text-[#3b66b0]">({visibilityFilter} only)</span>}
              </span>
              <span className="text-[11px] text-slate-400">
                Visible companies are shown on the homepage, member directory, and booking selection.
              </span>
            </div>
          </div>

          {/* Member Companies Table View */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Company & Identity</th>
                    <th className="py-3 px-4">Sector / Category</th>
                    <th className="py-3 px-4">Location & Fleet</th>
                    <th className="py-3 px-4">Direct Contact</th>
                    <th className="py-3 px-4 text-center">Portal Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                        No member companies found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedMembers.map((member, idx) => {
                      const isVisible = member.active !== false;
                      const globalIndex = (currentPage - 1) * pageSize + idx + 1;

                      return (
                        <tr 
                          key={member.id} 
                          className={cn(
                            "hover:bg-slate-50/80 transition-colors group cursor-pointer",
                            !isVisible && "bg-amber-50/20"
                          )}
                          onClick={() => handleOpenDetailModal(member)}
                        >
                          {/* Index */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400 text-center font-bold">
                            {globalIndex}
                          </td>

                          {/* Company & Brand */}
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3">
                              {member.logoUrl ? (
                                <img
                                  src={member.logoUrl}
                                  alt={member.name}
                                  className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-slate-200 p-0.5 shrink-0 shadow-xs"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-[#3b66b0] flex items-center justify-center font-bold text-xs font-headline shadow-xs shrink-0">
                                  {member.logoText || member.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0">
                                <button
                                  onClick={() => handleOpenDetailModal(member)}
                                  className="font-headline font-bold text-slate-900 text-xs truncate text-left hover:text-[#3b66b0] hover:underline"
                                >
                                  <span>{member.name}</span>
                                </button>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                  {member.establishedYear && (
                                    <span>Est. {member.establishedYear}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Sector / Category */}
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-[#3b66b0] border border-blue-100 max-w-[200px] truncate">
                              {member.category}
                            </span>
                          </td>

                          {/* Location & Fleet */}
                          <td className="py-3 px-4">
                            <div className="space-y-0.5 max-w-[200px]">
                              <div className="flex items-center gap-1.5 text-slate-800 font-medium truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{member.headquarters}</span>
                              </div>
                              {member.fleet && (
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                                  <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{member.fleet}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-0.5 text-[11px]">
                              {member.phone && (
                                <div className="flex items-center gap-1.5 text-slate-700">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{member.phone}</span>
                                </div>
                              )}
                              {member.websiteUrl ? (
                                <div className="flex items-center gap-1.5">
                                  <a
                                    href={member.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                      "flex items-center gap-1 font-medium truncate max-w-[120px]",
                                      member.showWebsite !== false 
                                        ? "text-[#3b66b0] hover:underline" 
                                        : "text-slate-400 line-through opacity-75"
                                    )}
                                    title={member.showWebsite !== false ? "Website visible publicly" : "Website hidden from public"}
                                  >
                                    <Globe className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{member.websiteUrl.replace(/^https?:\/\//, '')}</span>
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleWebsiteVisibility(member)}
                                    title={member.showWebsite !== false ? "Website is visible on public site. Click to hide" : "Website is hidden from public site. Click to show"}
                                    className={cn(
                                      "p-1 rounded-md text-[10px] font-bold transition-colors shrink-0",
                                      member.showWebsite !== false
                                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                                        : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                                    )}
                                  >
                                    {member.showWebsite !== false ? (
                                      <Eye className="w-3 h-3" />
                                    ) : (
                                      <EyeOff className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">No website</span>
                              )}
                            </div>
                          </td>

                          {/* Status / Visibility */}
                          <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <Button
                              onClick={() => handleToggleVisibility(member)}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-6 px-2 text-[10px] font-bold rounded-full transition-all flex items-center gap-1 mx-auto",
                                isVisible 
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100" 
                                  : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                              )}
                              title={isVisible ? "Click to hide from public directory" : "Click to show on public directory"}
                            >
                              {isVisible ? (
                                <>
                                  <Eye className="w-3 h-3 text-emerald-600" />
                                  <span>Visible</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3 text-amber-600" />
                                  <span>Hidden</span>
                                </>
                              )}
                            </Button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              
                              {/* View Details Modal */}
                              <Button
                                onClick={() => handleOpenDetailModal(member)}
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[11px] bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                title="View complete profile details"
                              >
                                <Eye className="w-3 h-3 mr-1 text-slate-400" />
                                <span>Details</span>
                              </Button>

                              {/* Bookings shortcut */}
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-[11px] bg-blue-50 border-blue-200 text-[#3b66b0] hover:bg-blue-100 hover:text-[#284982]"
                                title="View bookings assigned to this member"
                              >
                                <Link href={`/admin/member-bookings?memberId=${member.id}`}>
                                  <CalendarCheck className="w-3 h-3 mr-1" />
                                  <span>Bookings</span>
                                </Link>
                              </Button>

                              {/* Edit */}
                              <Button
                                onClick={() => handleOpenEditModal(member)}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                title="Edit Company"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>

                              {/* Delete */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    onClick={() => setTargetMemberToDelete(member)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    title="Delete Company"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white border-slate-200 text-slate-900">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Member Company?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-xs text-slate-500">
                                      Are you sure you want to remove <strong className="text-slate-900">{member.name}</strong> from the active ASSERWA directory? Customers will no longer be able to select them for direct service dispatch.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-100 text-slate-700 border-slate-200">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteMember}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Remove Member
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination & Summary Footer */}
            <div className="p-3.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span>
                  Showing <strong>{filteredMembers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to <strong>{Math.min(currentPage * pageSize, filteredMembers.length)}</strong> of <strong>{filteredMembers.length}</strong> companies
                </span>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-3 border-l border-slate-200">
                  <span>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-700 focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span>per page</span>
                </div>
              </div>

              {/* Page buttons */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-xs bg-white border-slate-200 text-slate-700 disabled:opacity-40"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "w-7 h-7 rounded text-xs font-semibold transition-colors",
                          currentPage === page
                            ? "bg-[#3b66b0] text-white font-bold shadow-2xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2.5 text-xs bg-white border-slate-200 text-slate-700 disabled:opacity-40"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>

      {/* Add / Edit Member Company Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-headline font-bold text-slate-900">
              {editingMember ? "Edit Member Company Profile" : "Add New ASSERWA Member Company"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Populate company information, equipment capacity, and official website URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveMember} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Company Name *</label>
              <Input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Kigali Septic Service"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
                required
              />
              {formErrors.name && <p className="text-[11px] text-red-600">{formErrors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Category *</label>
                <Input
                  type="text"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Vacuum Truck Haulage"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Website URL (Optional)</label>
                  {formWebsite.trim() && (
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 select-none">
                      <input
                        type="checkbox"
                        checked={formShowWebsite}
                        onChange={(e) => setFormShowWebsite(e.target.checked)}
                        className="rounded border-slate-300 text-[#3b66b0] focus:ring-[#3b66b0] w-3.5 h-3.5"
                      />
                      <span>Show on public site</span>
                    </label>
                  )}
                </div>
                <Input
                  type="text"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  placeholder="https://kigaliseptic.rw (Optional)"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
                />
                <p className="text-[10px] text-slate-400">
                  Optional. Leave blank if not available. {formWebsite.trim() && (formShowWebsite ? "• Visible on public site" : "• Hidden from public site")}
                </p>
                {formErrors.website && <p className="text-[11px] text-red-600">{formErrors.website}</p>}
              </div>
            </div>

            {/* Logo Image URL and Live Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Company Logo</label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 flex-col">
                      <div className="w-4 h-4 border-2 border-[#3b66b0] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {formLogoUrl ? (
                    <img src={formLogoUrl} alt="Preview" className="w-full h-full object-contain p-0.5" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    type="text"
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9 flex-1"
                  />
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
                      title="Upload company logo"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="h-9 px-3 text-xs bg-white border-slate-200 text-slate-700 relative z-10 pointer-events-none"
                    >
                      <UploadCloud className="w-4 h-4 mr-1.5 text-slate-400" />
                      {isUploadingLogo ? `${Math.round(uploadProgress)}%` : "Upload"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Brief Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Short Summary</span>
                <span className="text-[10px] text-slate-400 font-normal">{formBriefDescription.length}/150</span>
              </label>
              <Input
                type="text"
                value={formBriefDescription}
                onChange={(e) => setFormBriefDescription(e.target.value)}
                maxLength={150}
                placeholder="Brief 1-sentence company summary..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <Input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+250 788 123 456"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email</label>
                <Input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="dispatch@company.rw"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Headquarters</label>
                <Input
                  type="text"
                  value={formHeadquarters}
                  onChange={(e) => setFormHeadquarters(e.target.value)}
                  placeholder="Nyarugenge, Kigali"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Fleet & Equipment</label>
                <Input
                  type="text"
                  value={formFleet}
                  onChange={(e) => setFormFleet(e.target.value)}
                  placeholder="e.g. 6 Vacuum Tankers (15,000L)"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Services (comma separated)</label>
              <Input
                type="text"
                value={formServices}
                onChange={(e) => setFormServices(e.target.value)}
                placeholder="e.g. Liquid Waste Collection, Emergency Pumping"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Description</label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Overview of company credentials and capacity..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[75px]"
              />
            </div>

            {/* Public Portal Visibility Toggle */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  {formActive ? (
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>Visible on Public Portal & Booking</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Controls whether this member is displayed on the website and booking form.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFormActive(!formActive)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  formActive ? "bg-[#3b66b0]" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                    formActive ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="bg-white border-slate-200 text-slate-700 text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#3b66b0] hover:bg-[#2b4c85] text-white text-xs h-9 font-semibold"
              >
                {editingMember ? "Save Profile Changes" : "Create Member Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Member Company Profile Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto">
          {selectedMemberForDetail && (
            <>
              <DialogHeader className="border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {selectedMemberForDetail.logoUrl ? (
                      <img
                        src={selectedMemberForDetail.logoUrl}
                        alt={selectedMemberForDetail.name}
                        className="w-14 h-14 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#3b66b0] flex items-center justify-center font-bold text-lg font-headline shadow-sm shrink-0">
                        {selectedMemberForDetail.logoText || selectedMemberForDetail.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <DialogTitle className="text-lg font-headline font-bold text-slate-900">
                          {selectedMemberForDetail.name}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                          Profile details for {selectedMemberForDetail.name}
                        </DialogDescription>
                      </div>
                      <p className="text-xs text-[#3b66b0] font-semibold mt-0.5">
                        {selectedMemberForDetail.category}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        {selectedMemberForDetail.establishedYear && (
                          <span>Established {selectedMemberForDetail.establishedYear}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {selectedMemberForDetail.active !== false ? (
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1.5 px-2.5 py-1 font-semibold">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Visible on Website</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs flex items-center gap-1.5 px-2.5 py-1 font-bold">
                        <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                        <span>Hidden from Public</span>
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Description & Summary */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Company Profile & Overview
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    {selectedMemberForDetail.description || selectedMemberForDetail.briefDescription || "No detailed description provided."}
                  </p>
                </div>

                {/* Operations & Location details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-semibold">Headquarters / Operational Base</span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedMemberForDetail.headquarters || "Kigali, Rwanda"}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[11px] block font-semibold">Fleet & Equipment Specs</span>
                    <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{selectedMemberForDetail.fleet || "Modern Vacuum Fleet"}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Contact & Website */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Contact & Digital Reach
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Telephone</span>
                      <div className="flex items-center gap-1 text-slate-800 font-semibold mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{selectedMemberForDetail.phone || "N/A"}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Email</span>
                      <div className="flex items-center gap-1 text-slate-800 font-semibold mt-0.5 truncate">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{selectedMemberForDetail.email || "N/A"}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] block">Website</span>
                        {selectedMemberForDetail.websiteUrl && (
                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded-full font-bold",
                            selectedMemberForDetail.showWebsite !== false 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          )}>
                            {selectedMemberForDetail.showWebsite !== false ? "Visible" : "Hidden"}
                          </span>
                        )}
                      </div>
                      {selectedMemberForDetail.websiteUrl ? (
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <a
                            href={selectedMemberForDetail.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#3b66b0] hover:underline font-semibold truncate"
                          >
                            <Globe className="w-3 h-3 shrink-0" />
                            <span className="truncate">{selectedMemberForDetail.websiteUrl.replace(/^https?:\/\//, '')}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                          <button
                            type="button"
                            onClick={async () => {
                              await handleToggleWebsiteVisibility(selectedMemberForDetail);
                              setSelectedMemberForDetail(prev => prev ? ({ ...prev, showWebsite: prev.showWebsite === false ? true : false }) : null);
                            }}
                            className="text-[10px] text-[#3b66b0] hover:underline font-bold shrink-0"
                          >
                            {selectedMemberForDetail.showWebsite !== false ? "Hide URL" : "Show URL"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">None provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Services Pills */}
                {selectedMemberForDetail.services && selectedMemberForDetail.services.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider block">
                      Authorized Sanitation Services
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMemberForDetail.services.map((svc, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100 text-[#3b66b0] font-medium text-[11px]"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  onClick={() => {
                    handleToggleVisibility(selectedMemberForDetail);
                    setSelectedMemberForDetail({
                      ...selectedMemberForDetail,
                      active: selectedMemberForDetail.active === false
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 text-xs font-semibold",
                    selectedMemberForDetail.active !== false
                      ? "bg-white border-slate-200 text-amber-700 hover:bg-amber-50"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  )}
                >
                  {selectedMemberForDetail.active !== false ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 mr-1" />
                      <span>Hide from Public</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span>Make Visible</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs bg-blue-50 border-blue-200 text-[#3b66b0] hover:bg-blue-100"
                  >
                    <Link href={`/admin/member-bookings?memberId=${selectedMemberForDetail.id}`}>
                      <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
                      <span>View Bookings</span>
                    </Link>
                  </Button>

                  <Button
                    onClick={() => {
                      setIsDetailOpen(false);
                      handleOpenEditModal(selectedMemberForDetail);
                    }}
                    size="sm"
                    className="h-8 text-xs bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                    <span>Edit Profile</span>
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
