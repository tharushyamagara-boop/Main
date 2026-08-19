'use client';

import { useState, useEffect } from 'react';
import { useContentStore, SlideshowItem, GalleryItem, NewsItem } from '@/lib/content-store';
import { useAdminStore, AdminUser } from '@/lib/admin-store';
import { 
  uploadMediaToFirebaseStorage, 
  saveContentToFirestore, 
  SymposiumVisitor, 
  subscribeToSymposiumVisitors, 
  deleteSymposiumVisitor 
} from '@/lib/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Download, Trash2, Search, Users, Globe, Building, Sparkles, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const {
    slideshows, setSlideshows,
    aboutUs, setAboutUs,
    objectives, setObjectives,
    services, setServices,
    memberNetwork, setMemberNetwork,
    resources, setResources,
    news, setNews,
    gallery, setGallery,
    contactInfo, setContactInfo,
    resetToDefaults
  } = useContentStore();

  const { admins, currentAdmin, login, logout, addAdmin, removeAdmin } = useAdminStore();

  const [activeTab, setActiveTab] = useState('slideshows');
  const [loginEmail, setLoginEmail] = useState('tharushyamagara@gmail.com');
  const [loginError, setLoginError] = useState('');

  // Add User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('Editor');

  // Symposium 2026 Visitors State
  const [visitors, setVisitors] = useState<SymposiumVisitor[]>([]);
  const [visitorSearch, setVisitorSearch] = useState('');

  // Subscribe to real-time booth visitors
  useEffect(() => {
    const unsubscribe = subscribeToSymposiumVisitors((data) => {
      setVisitors(data);
    });
    return () => unsubscribe();
  }, []);

  const handleExportCSV = () => {
    if (visitors.length === 0) {
      toast({
        title: "No Visitors to Export",
        description: "There are no registered symposium visitors yet.",
        variant: "destructive"
      });
      return;
    }

    const headers = ["ID", "Full Name", "Contact Phone", "Email Address", "Country of Origin", "Organization", "Job Title", "Registration Date"];
    const rows = visitors.map(v => [
      `"${v.id}"`,
      `"${(v.fullName || '').replace(/"/g, '""')}"`,
      `"${(v.phone || '').replace(/"/g, '""')}"`,
      `"${(v.email || '').replace(/"/g, '""')}"`,
      `"${(v.country || '').replace(/"/g, '""')}"`,
      `"${(v.organization || '').replace(/"/g, '""')}"`,
      `"${(v.title || '').replace(/"/g, '""')}"`,
      `"${v.createdAt || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ASSERWA_Symposium_2026_Visitors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Export Complete",
      description: `Exported ${visitors.length} symposium attendee records.`,
    });
  };

  const handleDeleteVisitor = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove visitor record for "${name}"?`)) {
      await deleteSymposiumVisitor(id);
      toast({
        title: "Visitor Removed",
        description: `Record for ${name} deleted.`,
      });
    }
  };

  // Media File Upload Helper (Firebase Storage + Fallback Data URL)
  const handleMediaFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string, mediaType: 'image' | 'video') => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVid = file.type.startsWith('video/');

    // Attempt Firebase Cloud Storage upload
    try {
      toast({
        title: "Uploading to Firebase Storage...",
        description: `Uploading ${file.name}...`,
      });
      const downloadUrl = await uploadMediaToFirebaseStorage(file, isVid ? 'videos' : 'photos');
      onComplete(downloadUrl, isVid ? 'video' : 'image');
      toast({
        title: "Uploaded to Firebase Cloud Storage!",
        description: `${file.name} successfully stored in Firebase Storage.`,
      });
      return;
    } catch (err) {
      console.warn("Firebase Storage upload fallback to Data URL:", err);
    }

    // Local Data URL Fallback
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        onComplete(evt.target.result as string, isVid ? 'video' : 'image');
        toast({
          title: "Media File Loaded",
          description: `${file.name} successfully attached.`,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Slideshow Handlers
  const handleAddSlide = () => {
    const newSlide: SlideshowItem = {
      id: `slide-${Date.now()}`,
      title: "New Hero Slide ",
      titleHighlight: "Highlight Text",
      description: "Promoting hygiene, sanitation, and environmental protection in Rwanda.",
      imageUrl: "",
      mediaType: 'image'
    };
    setSlideshows([...slideshows, newSlide]);
    toast({
      title: "New Slide Added",
      description: "A new slide has been added to the hero slideshow. Please upload a photo/video file.",
    });
  };

  const handleDeleteSlide = (id: string) => {
    if (slideshows.length <= 1) {
      toast({
        title: "Action Restricted",
        description: "You must keep at least one active hero slide.",
        variant: "destructive"
      });
      return;
    }
    if (confirm("Are you sure you want to delete this slide from the slideshow?")) {
      setSlideshows(slideshows.filter(s => s.id !== id));
      toast({
        title: "Slide Removed",
        description: "Slide has been removed from the slideshow.",
      });
    }
  };

  // Gallery Handlers
  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      description: "New Sanitation Field Activity Caption",
      imageUrl: "",
      mediaType: 'image'
    };
    setGallery([...gallery, newItem]);
    toast({
      title: "Gallery Item Added",
      description: "New item added to gallery. Please upload your photo or video.",
    });
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      setGallery(gallery.filter(g => g.id !== id));
      toast({
        title: "Gallery Item Removed",
        description: "Item removed from gallery.",
      });
    }
  };

  // News Handlers
  const handleAddNewsItem = () => {
    const newItem: NewsItem = {
      id: `news-${Date.now()}`,
      title: "New Advocacy Update or Press Release",
      excerpt: "Short summary of the advocacy update or news story...",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      author: "ASSERWA Secretariat",
      tag: "Advocacy",
      imageUrl: "",
      mediaType: 'image'
    };
    setNews([...news, newItem]);
    toast({
      title: "Article Added",
      description: "New news article added. Please upload your photo/video file.",
    });
  };

  const handleDeleteNewsItem = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setNews(news.filter(n => n.id !== id));
      toast({
        title: "Article Removed",
        description: "Article was deleted.",
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = login(loginEmail, '');
    if (success) {
      toast({
        title: "Welcome Back, Admin!",
        description: `Successfully authenticated as ${loginEmail}.`,
      });
    } else {
      setLoginError(`Access Denied: "${loginEmail}" is not authorized as an admin user.`);
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    const success = addAdmin(newEmail, newName, newRole);
    if (success) {
      toast({
        title: "Admin User Added",
        description: `${newEmail} has been granted admin access.`,
      });
      setNewEmail('');
      setNewName('');
    } else {
      toast({
        title: "Failed to Add User",
        description: `User ${newEmail} is already registered as an admin.`,
        variant: "destructive"
      });
    }
  };

  const handleRemoveUser = (id: string, email: string) => {
    if (confirm(`Are you sure you want to revoke admin access for ${email}?`)) {
      const ok = removeAdmin(id);
      if (ok) {
        toast({
          title: "Admin Access Revoked",
          description: `Access for ${email} has been removed.`,
        });
      } else {
        toast({
          title: "Action Restricted",
          description: `Cannot remove primary Super Admin ${email}.`,
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        slideshows,
        aboutUs,
        objectives,
        services,
        memberNetwork,
        resources,
        news,
        gallery,
        contactInfo
      };
      localStorage.setItem('asserwa_cms_content_v4', JSON.stringify(dataToSave));
      localStorage.setItem('assserva_cms_content_v4', JSON.stringify(dataToSave));
      await saveContentToFirestore(dataToSave);
      toast({
        title: "Content Saved & Applied Live!",
        description: "All media, slideshows, gallery items, and news updates have been saved to Cloud Firestore and applied across all browsers worldwide.",
      });
    } catch (e) {
      toast({
        title: "Save Error",
        description: "Failed to persist content changes.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all content back to official brochure defaults?")) {
      resetToDefaults();
      toast({
        title: "Reset Complete",
        description: "All content has been restored to official brochure defaults.",
      });
    }
  };

  // If not logged in as admin, show Login Screen
  if (!currentAdmin) {
    return (
      <div className="bg-slate-50/50 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border border-slate-200 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-[#3b66b0] text-white p-8 text-center space-y-2">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
              Restricted Portal
            </span>
            <CardTitle className="font-headline text-2xl text-white">ASSERWA Admin Login</CardTitle>
            <CardDescription className="text-white/80 text-xs font-body">
              Sign in with your authorized admin email address
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-headline font-bold">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-xs font-bold font-headline text-slate-800">
                  Authorized Admin Email
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="tharushyamagara@gmail.com"
                  required
                  className="h-11 font-body text-sm"
                />
              </div>

              <Button type="submit" className="w-full bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-sm font-bold py-6 shadow-md">
                Authenticate & Enter Portal
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 text-center justify-center">
            <Link href="/" className="text-xs font-bold text-[#3b66b0] hover:underline">
              ← Return to Public Website
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3 py-0.5 rounded-full border border-[#3b66b0]/30 inline-block">
                Content Management System
              </span>
              <span className="text-xs font-headline font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {currentAdmin.email} ({currentAdmin.role})
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900">
              ASSERWA Admin Control Panel
            </h1>
            <p className="text-slate-500 font-body text-xs md:text-sm">
              Manage and edit all front-end content live across all site sections.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleReset} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-headline text-xs font-bold">
              Reset Defaults
            </Button>
            <Button onClick={handleSave} className="bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold px-6 shadow-md">
              Save All Changes
            </Button>
            <Button onClick={logout} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 font-headline text-xs font-bold">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tabbed Editor */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="flex flex-wrap h-auto p-1.5 bg-white border border-slate-200 rounded-2xl gap-1 justify-start">
            <TabsTrigger value="slideshows" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              1. Slideshows
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              2. About Us
            </TabsTrigger>
            <TabsTrigger value="objectives" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              3. Objectives
            </TabsTrigger>
            <TabsTrigger value="services" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              4. Services
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              5. Members Network
            </TabsTrigger>
            <TabsTrigger value="resources" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              6. Resources
            </TabsTrigger>
            <TabsTrigger value="news" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              7. Advocacy & News
            </TabsTrigger>
            <TabsTrigger value="gallery" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              8. Gallery
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              9. Contact Info
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl">
              10. Admin Users
            </TabsTrigger>
            <TabsTrigger value="visitors" className="text-xs font-bold font-headline py-2 px-3 data-[state=active]:bg-[#3b66b0] data-[state=active]:text-white rounded-xl flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6cb166]" />
              <span>11. Symposium 2026 Visitors</span>
              <span className="bg-[#6cb166] text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
                {visitors.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Slideshows */}
          <TabsContent value="slideshows">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline text-lg text-slate-900">
                    Hero Slideshow Manager
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Add new slides, upload photos/videos, or edit title, highlight, and description for each hero slide.
                  </CardDescription>
                </div>
                <Button onClick={handleAddSlide} className="bg-[#3b66b0] hover:bg-[#2e5291] text-white font-headline text-xs font-bold px-4 shrink-0 shadow-sm">
                  + Add New Slide
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {slideshows.map((slide, idx) => (
                  <div key={slide.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <h4 className="font-headline font-bold text-sm text-[#3b66b0]">Slide #{idx + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold h-8 px-3"
                      >
                        Delete Slide
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Main Title Prefix</Label>
                        <Input 
                          value={slide.title} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setSlideshows(prev => prev.map((s, i) => i === idx ? { ...s, title: val } : s));
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Title Highlight Text (Green)</Label>
                        <Input 
                          value={slide.titleHighlight} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setSlideshows(prev => prev.map((s, i) => i === idx ? { ...s, titleHighlight: val } : s));
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Slide Description</Label>
                      <Textarea 
                        value={slide.description} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setSlideshows(prev => prev.map((s, i) => i === idx ? { ...s, description: val } : s));
                        }}
                        className="bg-white text-xs min-h-[60px]"
                      />
                    </div>

                    {/* Media Type & Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200/80">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Media Format</Label>
                        <Select
                          value={slide.mediaType || 'image'}
                          onValueChange={(val: 'image' | 'video') => {
                            setSlideshows(prev => prev.map((s, i) => i === idx ? { ...s, mediaType: val } : s));
                          }}
                        >
                          <SelectTrigger className="bg-white text-xs h-9">
                            <SelectValue placeholder="Select Media Format" />
                          </SelectTrigger>
                          <SelectContent className="text-xs font-body">
                            <SelectItem value="image">Photo / Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-bold">Upload Photo or Video File</Label>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            handleMediaFileUpload(e, (dataUrl, detectedType) => {
                              setSlideshows(prev => prev.map((s, i) => i === idx ? { ...s, imageUrl: dataUrl, mediaType: detectedType } : s));
                            });
                          }}
                          className="bg-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3b66b0] file:text-white hover:file:bg-[#2e5291] cursor-pointer h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Or Media URL (Image or Video URL)</Label>
                      <Input 
                        value={slide.imageUrl} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setSlideshows(prev => prev.map((s, i) => i === idx ? { ...s, imageUrl: val } : s));
                        }}
                        placeholder="https://..."
                        className="bg-white text-xs font-mono"
                      />
                    </div>

                    {/* Media Preview Box */}
                    {slide.imageUrl && (
                      <div className="mt-2 p-3 bg-slate-100 rounded-xl border border-slate-200">
                        <Label className="text-[11px] font-bold text-slate-600 block mb-1.5">Media Preview</Label>
                        {slide.mediaType === 'video' || slide.imageUrl.startsWith('data:video') || slide.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={slide.imageUrl} controls className="max-h-40 rounded-lg border border-slate-300 bg-black" />
                        ) : (
                          <img src={slide.imageUrl} alt="Slide Preview" className="max-h-40 rounded-lg object-cover border border-slate-300" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: About Us */}
          <TabsContent value="about">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900">
                  About Us Section Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit header tag, title, description, mission, and objective scope.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Header Tag Badge</Label>
                    <Input 
                      value={aboutUs.headerTag} 
                      onChange={(e) => setAboutUs({ ...aboutUs, headerTag: e.target.value })}
                      className="bg-white text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Main Section Title</Label>
                    <Input 
                      value={aboutUs.title} 
                      onChange={(e) => setAboutUs({ ...aboutUs, title: e.target.value })}
                      className="bg-white text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Main Description Paragraph</Label>
                  <Textarea 
                    value={aboutUs.description} 
                    onChange={(e) => setAboutUs({ ...aboutUs, description: e.target.value })}
                    className="bg-white text-xs min-h-[80px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Main Mission Statement</Label>
                  <Textarea 
                    value={aboutUs.mission} 
                    onChange={(e) => setAboutUs({ ...aboutUs, mission: e.target.value })}
                    className="bg-white text-xs min-h-[60px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Main Objective Scope</Label>
                  <Textarea 
                    value={aboutUs.objectiveScope} 
                    onChange={(e) => setAboutUs({ ...aboutUs, objectiveScope: e.target.value })}
                    className="bg-white text-xs min-h-[60px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Objectives */}
          <TabsContent value="objectives">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900">
                  4 Main Objectives Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit title and bullet points for all four institutional objectives.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {objectives.map((obj, idx) => (
                  <div key={obj.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Objective Title</Label>
                      <Input 
                        value={obj.title} 
                        onChange={(e) => {
                          const updated = [...objectives];
                          updated[idx].title = e.target.value;
                          setObjectives(updated);
                        }}
                        className="bg-white text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Points (one per line)</Label>
                      <Textarea 
                        value={obj.points.join('\n')} 
                        onChange={(e) => {
                          const updated = [...objectives];
                          updated[idx].points = e.target.value.split('\n').filter(p => p.trim());
                          setObjectives(updated);
                        }}
                        className="bg-white text-xs min-h-[80px]"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Services */}
          <TabsContent value="services">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900">
                  Services Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit operational areas and service cards.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {services.map((srv, idx) => (
                  <div key={srv.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Service Title</Label>
                        <Input 
                          value={srv.title} 
                          onChange={(e) => {
                            const updated = [...services];
                            updated[idx].title = e.target.value;
                            setServices(updated);
                          }}
                          className="bg-white text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">CTA Button Text</Label>
                        <Input 
                          value={srv.cta} 
                          onChange={(e) => {
                            const updated = [...services];
                            updated[idx].cta = e.target.value;
                            setServices(updated);
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Service Description</Label>
                      <Textarea 
                        value={srv.description} 
                        onChange={(e) => {
                          const updated = [...services];
                          updated[idx].description = e.target.value;
                          setServices(updated);
                        }}
                        className="bg-white text-xs min-h-[60px]"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Members Network */}
          <TabsContent value="members">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900">
                  Member Companies Directory Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit member companies list.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {memberNetwork.map((net, idx) => (
                  <div key={net.region} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Title</Label>
                      <Input 
                        value={net.region} 
                        onChange={(e) => {
                          const updated = [...memberNetwork];
                          updated[idx].region = e.target.value;
                          setMemberNetwork(updated);
                        }}
                        className="bg-white text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Member Companies (one per line)</Label>
                      <Textarea 
                        value={net.companies.join('\n')} 
                        onChange={(e) => {
                          const updated = [...memberNetwork];
                          // Preserve all lines (including empty ones from pressing Enter)
                          // Only filter out blank entries when the value is read back
                          const lines = e.target.value.split('\n');
                          updated[idx].companies = lines;
                          setMemberNetwork(updated);
                        }}
                        onBlur={(e) => {
                          // Clean up empty lines when the user leaves the field
                          const updated = [...memberNetwork];
                          updated[idx].companies = e.target.value.split('\n').filter(c => c.trim());
                          setMemberNetwork(updated);
                        }}
                        className="bg-white text-xs min-h-[140px] font-mono"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: Resources */}
          <TabsContent value="resources">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900">
                  Documentation & Resources Manager
                </CardTitle>
                <CardDescription className="text-xs">Manage downloadable guidelines and manual entries.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {resources.map((res, idx) => (
                  <div key={res.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Document Title</Label>
                        <Input 
                          value={res.title} 
                          onChange={(e) => {
                            const updated = [...resources];
                            updated[idx].title = e.target.value;
                            setResources(updated);
                          }}
                          className="bg-white text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Document Category / Type</Label>
                        <Input 
                          value={res.type} 
                          onChange={(e) => {
                            const updated = [...resources];
                            updated[idx].type = e.target.value;
                            setResources(updated);
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Description</Label>
                      <Textarea 
                        value={res.description} 
                        onChange={(e) => {
                          const updated = [...resources];
                          updated[idx].description = e.target.value;
                          setResources(updated);
                        }}
                        className="bg-white text-xs min-h-[60px]"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 7: News */}
          <TabsContent value="news">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline text-lg text-slate-900">
                    Advocacy Updates & News Manager
                  </CardTitle>
                  <CardDescription className="text-xs">Manage press releases, advocacy articles, photos, and video media.</CardDescription>
                </div>
                <Button onClick={handleAddNewsItem} className="bg-[#3b66b0] hover:bg-[#2e5291] text-white font-headline text-xs font-bold px-4 shrink-0 shadow-sm">
                  + Add New Article
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {news.map((item, idx) => (
                  <div key={item.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-headline font-bold text-sm text-[#3b66b0]">Article #{idx + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNewsItem(item.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold h-8 px-3"
                      >
                        Delete Article
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Article Title</Label>
                        <Input 
                          value={item.title} 
                          onChange={(e) => {
                            const updated = [...news];
                            updated[idx].title = e.target.value;
                            setNews(updated);
                          }}
                          className="bg-white text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Publication Date</Label>
                        <Input 
                          value={item.date} 
                          onChange={(e) => {
                            const updated = [...news];
                            updated[idx].date = e.target.value;
                            setNews(updated);
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Author / Publisher</Label>
                        <Input 
                          value={item.author} 
                          onChange={(e) => {
                            const updated = [...news];
                            updated[idx].author = e.target.value;
                            setNews(updated);
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Tag / Category Badge</Label>
                        <Input 
                          value={item.tag} 
                          onChange={(e) => {
                            const updated = [...news];
                            updated[idx].tag = e.target.value;
                            setNews(updated);
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Article Excerpt</Label>
                      <Textarea 
                        value={item.excerpt} 
                        onChange={(e) => {
                          const updated = [...news];
                          updated[idx].excerpt = e.target.value;
                          setNews(updated);
                        }}
                        className="bg-white text-xs min-h-[60px]"
                      />
                    </div>

                    {/* Media Type & Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200/80">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Media Format</Label>
                        <Select
                          value={item.mediaType || 'image'}
                          onValueChange={(val: 'image' | 'video') => {
                            setNews(prev => prev.map((n, i) => i === idx ? { ...n, mediaType: val } : n));
                          }}
                        >
                          <SelectTrigger className="bg-white text-xs h-9">
                            <SelectValue placeholder="Select Media Format" />
                          </SelectTrigger>
                          <SelectContent className="text-xs font-body">
                            <SelectItem value="image">Photo / Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-bold">Upload Photo or Video File</Label>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            handleMediaFileUpload(e, (dataUrl, detectedType) => {
                              setNews(prev => prev.map((n, i) => i === idx ? { ...n, imageUrl: dataUrl, mediaType: detectedType } : n));
                            });
                          }}
                          className="bg-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3b66b0] file:text-white hover:file:bg-[#2e5291] cursor-pointer h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Or Media URL</Label>
                      <Input 
                        value={item.imageUrl} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setNews(prev => prev.map((n, i) => i === idx ? { ...n, imageUrl: val } : n));
                        }}
                        placeholder="https://..."
                        className="bg-white text-xs font-mono"
                      />
                    </div>

                    {/* Preview Box */}
                    {item.imageUrl && (
                      <div className="mt-2 p-3 bg-slate-100 rounded-xl border border-slate-200">
                        <Label className="text-[11px] font-bold text-slate-600 block mb-1.5">Article Media Preview</Label>
                        {item.mediaType === 'video' || item.imageUrl.startsWith('data:video') || item.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={item.imageUrl} controls className="max-h-40 rounded-lg border border-slate-300 bg-black" />
                        ) : (
                          <img src={item.imageUrl} alt="Article Preview" className="max-h-40 rounded-lg object-cover border border-slate-300" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 8: Gallery */}
          <TabsContent value="gallery">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline text-lg text-slate-900">
                    Sanitation Gallery Manager
                  </CardTitle>
                  <CardDescription className="text-xs">Manage photos, videos, and captions in the sanitation impact gallery.</CardDescription>
                </div>
                <Button onClick={handleAddGalleryItem} className="bg-[#3b66b0] hover:bg-[#2e5291] text-white font-headline text-xs font-bold px-4 shrink-0 shadow-sm">
                  + Add Gallery Item
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {gallery.map((gal, idx) => (
                  <div key={gal.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-headline font-bold text-sm text-[#3b66b0]">Gallery Item #{idx + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteGalleryItem(gal.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold h-8 px-3"
                      >
                        Delete Item
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Item Description / Caption</Label>
                      <Input 
                        value={gal.description} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setGallery(prev => prev.map((g, i) => i === idx ? { ...g, description: val } : g));
                        }}
                        className="bg-white text-xs font-bold"
                      />
                    </div>

                    {/* Media Type & Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-200/80">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Media Format</Label>
                        <Select
                          value={gal.mediaType || 'image'}
                          onValueChange={(val: 'image' | 'video') => {
                            setGallery(prev => prev.map((g, i) => i === idx ? { ...g, mediaType: val } : g));
                          }}
                        >
                          <SelectTrigger className="bg-white text-xs h-9">
                            <SelectValue placeholder="Select Media Format" />
                          </SelectTrigger>
                          <SelectContent className="text-xs font-body">
                            <SelectItem value="image">Photo / Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs font-bold">Upload Photo or Video File</Label>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            handleMediaFileUpload(e, (dataUrl, detectedType) => {
                              setGallery(prev => prev.map((g, i) => i === idx ? { ...g, imageUrl: dataUrl, mediaType: detectedType } : g));
                            });
                          }}
                          className="bg-white text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3b66b0] file:text-white hover:file:bg-[#2e5291] cursor-pointer h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Or Media URL (Photo or Video URL)</Label>
                      <Input 
                        value={gal.imageUrl} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setGallery(prev => prev.map((g, i) => i === idx ? { ...g, imageUrl: val } : g));
                        }}
                        placeholder="https://..."
                        className="bg-white text-xs font-mono"
                      />
                    </div>

                    {/* Preview Box */}
                    {gal.imageUrl && (
                      <div className="mt-2 p-3 bg-slate-100 rounded-xl border border-slate-200">
                        <Label className="text-[11px] font-bold text-slate-600 block mb-1.5">Gallery Media Preview</Label>
                        {gal.mediaType === 'video' || gal.imageUrl.startsWith('data:video') || gal.imageUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={gal.imageUrl} controls className="max-h-40 rounded-lg border border-slate-300 bg-black" />
                        ) : (
                          <img src={gal.imageUrl} alt="Gallery Preview" className="max-h-40 rounded-lg object-cover border border-slate-300" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 9: Contact */}
          <TabsContent value="contact">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900">
                  Official Contact Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit headquarters address, telephone, and email.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Telephone Number</Label>
                    <Input 
                      value={contactInfo.phone} 
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="bg-white text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Official Email Address</Label>
                    <Input 
                      value={contactInfo.email} 
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="bg-white text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Headquarters Full Address</Label>
                  <Textarea 
                    value={contactInfo.address} 
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="bg-white text-xs min-h-[70px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 10: Admin Users Management */}
          <TabsContent value="users">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white space-y-6">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900">
                  Admin User Access Manager
                </CardTitle>
                <CardDescription className="text-xs">
                  Authorized admin users who can log in and manage ASSERWA website content.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-8">
                {/* Form to Grant New Admin Access */}
                <form onSubmit={handleAddUserSubmit} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <h4 className="font-headline font-bold text-sm text-[#3b66b0]">Grant Admin Access to User</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">User Email Address</Label>
                      <Input
                        type="email"
                        placeholder="user@domain.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        className="bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Full Name</Label>
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Role Privilege</Label>
                      <Select value={newRole} onValueChange={(val: AdminUser['role']) => setNewRole(val)}>
                        <SelectTrigger className="bg-white text-xs h-9">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="text-xs font-body">
                          <SelectItem value="Super Admin">Super Admin</SelectItem>
                          <SelectItem value="Content Manager">Content Manager</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold px-6">
                    Grant Admin Access
                  </Button>
                </form>

                {/* Roster of Authorized Admin Users */}
                <div className="space-y-3">
                  <h4 className="font-headline font-bold text-sm text-slate-900">Authorized Admin Users Roster ({admins.length})</h4>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {admins.map((adm) => {
                      const isPrimarySuperAdmin = adm.email.toLowerCase() === 'tharushyamagara@gmail.com';
                      return (
                        <div key={adm.id} className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-headline font-bold text-sm text-slate-900">{adm.name}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isPrimarySuperAdmin ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {adm.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-body mt-0.5">{adm.email}</p>
                          </div>
                          <div>
                            {isPrimarySuperAdmin ? (
                              <span className="text-xs font-bold text-slate-400 italic">Primary Super Admin</span>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveUser(adm.id, adm.email)}
                                className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                              >
                                Revoke Access
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 11: Symposium 2026 Visitors */}
          <TabsContent value="visitors">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-[#3b66b0] to-[#2e5291] text-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-headline font-bold text-[#6cb166] border border-white/10">
                    <Sparkles className="w-3 h-3" />
                    <span>Africa Water & Sanitation Systems Leadership Symposium 2026</span>
                  </div>
                  <CardTitle className="font-headline text-lg md:text-xl text-white">
                    Booth Visitors Roster
                  </CardTitle>
                  <CardDescription className="text-white/80 text-xs font-body">
                    Live attendee registry submitted through the public booth registration page.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleExportCSV}
                    className="bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold px-4 py-2 shadow-md flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export to CSV / Excel</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Stats Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#3b66b0] text-white flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Visitors</span>
                      <span className="text-xl font-headline font-extrabold text-[#3b66b0]">{visitors.length}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6cb166] text-white flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Countries</span>
                      <span className="text-xl font-headline font-extrabold text-[#488443]">
                        {new Set(visitors.map(v => v.country).filter(Boolean)).size}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Organizations</span>
                      <span className="text-xl font-headline font-extrabold text-purple-700">
                        {new Set(visitors.map(v => v.organization).filter(Boolean)).size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Search by name, email, phone, country, or organization..."
                      value={visitorSearch}
                      onChange={(e) => setVisitorSearch(e.target.value)}
                      className="pl-10 text-xs bg-slate-50 border-slate-200 h-10"
                    />
                  </div>
                  {visitorSearch && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setVisitorSearch('')}
                      className="text-xs font-bold"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {/* Visitors Table / List */}
                {(() => {
                  const filtered = visitors.filter(v => {
                    if (!visitorSearch.trim()) return true;
                    const q = visitorSearch.toLowerCase();
                    return (
                      (v.fullName && v.fullName.toLowerCase().includes(q)) ||
                      (v.email && v.email.toLowerCase().includes(q)) ||
                      (v.phone && v.phone.toLowerCase().includes(q)) ||
                      (v.country && v.country.toLowerCase().includes(q)) ||
                      (v.organization && v.organization.toLowerCase().includes(q)) ||
                      (v.title && v.title.toLowerCase().includes(q))
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                        <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="font-headline font-bold text-slate-700 text-sm">
                          {visitorSearch ? "No visitors match your search criteria" : "No symposium visitors registered yet"}
                        </p>
                        <p className="text-xs text-slate-500 font-body">
                          Visitors will appear here instantly when registered at <Link href="/register" target="_blank" className="text-[#3b66b0] underline font-bold">/register</Link>.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-headline font-bold uppercase tracking-wider">
                            <tr>
                              <th className="py-3 px-4">Visitor</th>
                              <th className="py-3 px-4">Contact Phone</th>
                              <th className="py-3 px-4">Email</th>
                              <th className="py-3 px-4">Country</th>
                              <th className="py-3 px-4">Organization / Title</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-body bg-white">
                            {filtered.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3.5 px-4 font-headline font-bold text-slate-900">
                                  {v.fullName}
                                </td>
                                <td className="py-3.5 px-4 font-mono text-slate-700">
                                  {v.phone}
                                </td>
                                <td className="py-3.5 px-4 text-[#3b66b0]">
                                  {v.email}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-[11px] font-medium">
                                    {v.country}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">
                                  {v.organization ? (
                                    <div>
                                      <span className="font-semibold text-slate-800 block">{v.organization}</span>
                                      {v.title && <span className="text-[11px] text-slate-500">{v.title}</span>}
                                    </div>
                                  ) : (
                                    <span className="text-slate-400 italic">—</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                                  {v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteVisitor(v.id, v.fullName)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 text-xs h-7 px-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={handleSave} className="bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold px-8 shadow-lg">
            Save All Content Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
