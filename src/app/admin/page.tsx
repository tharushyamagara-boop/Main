'use client';

import { useState } from 'react';
import { useContentStore } from '@/lib/content-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Settings, Save, RotateCcw, Image as ImageIcon, FileText, ShieldCheck, Users, Wrench, Phone, Newspaper, Eye } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState('slideshows');

  const handleSave = () => {
    toast({
      title: "Content Saved Successfully!",
      description: "All changes have been saved and applied live to the front-end website.",
    });
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

  return (
    <div className="bg-slate-50/50 py-12 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-headline font-bold uppercase tracking-widest text-[#3b66b0] bg-[#3b66b0]/10 px-3 py-0.5 rounded-full border border-[#3b66b0]/30 inline-flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Content Management System
            </span>
            <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-slate-900">
              ASSSERVA Admin Control Panel
            </h1>
            <p className="text-slate-500 font-body text-xs md:text-sm">
              Manage and edit all front-end content live across all 9 site sections.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleReset} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-headline text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset Defaults
            </Button>
            <Button onClick={handleSave} className="bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold px-6 shadow-md">
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save All Changes
            </Button>
            <Button asChild variant="outline" className="border-slate-300 text-slate-700 font-headline text-xs font-bold">
              <Link href="/">
                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Site
              </Link>
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
              9. Contact & Slogan
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Slideshows */}
          <TabsContent value="slideshows">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#3b66b0]" /> Hero Slideshow Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit title, highlight text, description, and background image URL for each hero slide.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {slideshows.map((slide, idx) => (
                  <div key={slide.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <h4 className="font-headline font-bold text-sm text-[#3b66b0]">Slide #{idx + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Main Title Prefix</Label>
                        <Input 
                          value={slide.title} 
                          onChange={(e) => {
                            const updated = [...slideshows];
                            updated[idx].title = e.target.value;
                            setSlideshows(updated);
                          }}
                          className="bg-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold">Title Highlight Text (Green)</Label>
                        <Input 
                          value={slide.titleHighlight} 
                          onChange={(e) => {
                            const updated = [...slideshows];
                            updated[idx].titleHighlight = e.target.value;
                            setSlideshows(updated);
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
                          const updated = [...slideshows];
                          updated[idx].description = e.target.value;
                          setSlideshows(updated);
                        }}
                        className="bg-white text-xs min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Image URL</Label>
                      <Input 
                        value={slide.imageUrl} 
                        onChange={(e) => {
                          const updated = [...slideshows];
                          updated[idx].imageUrl = e.target.value;
                          setSlideshows(updated);
                        }}
                        className="bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: About Us */}
          <TabsContent value="about">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3b66b0]" /> About Us Page Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit title, description, mission, and objective scope for the About page.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Badge Header Tag</Label>
                  <Input 
                    value={aboutUs.headerTag} 
                    onChange={(e) => setAboutUs({ ...aboutUs, headerTag: e.target.value })}
                    className="bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Page Title</Label>
                  <Input 
                    value={aboutUs.title} 
                    onChange={(e) => setAboutUs({ ...aboutUs, title: e.target.value })}
                    className="bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Who is ASSSERVA Overview</Label>
                  <Textarea 
                    value={aboutUs.description} 
                    onChange={(e) => setAboutUs({ ...aboutUs, description: e.target.value })}
                    className="bg-white text-xs min-h-[80px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Main Mission</Label>
                  <Textarea 
                    value={aboutUs.mission} 
                    onChange={(e) => setAboutUs({ ...aboutUs, mission: e.target.value })}
                    className="bg-white text-xs min-h-[60px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Main Objective & Scope</Label>
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
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#6cb166]" /> 4 Organization Objectives Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit official objectives and points.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {objectives.map((obj, idx) => (
                  <div key={obj.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Objective Title #{idx + 1}</Label>
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
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Bullet Points (comma separated or multiline)</Label>
                      <Textarea 
                        value={obj.points.join('\n')} 
                        onChange={(e) => {
                          const updated = [...objectives];
                          updated[idx].points = e.target.value.split('\n').filter(p => p.trim() !== '');
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
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#3b66b0]" /> Services & Offerings Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit service cards, titles, descriptions, and CTA links.</CardDescription>
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
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#6cb166]" /> Member Companies Directory Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit member companies per province/region.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {memberNetwork.map((net, idx) => (
                  <div key={net.region} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Region Name</Label>
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
                          updated[idx].companies = e.target.value.split('\n').filter(c => c.trim() !== '');
                          setMemberNetwork(updated);
                        }}
                        className="bg-white text-xs min-h-[80px]"
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
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3b66b0]" /> Documentation & Manuals Manager
                </CardTitle>
                <CardDescription className="text-xs">Manage technical guides and publications.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {resources.map((res, idx) => (
                  <div key={res.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 col-span-2">
                        <Label className="text-xs font-bold">Resource Title</Label>
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
                        <Label className="text-xs font-bold">Type Tag</Label>
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

          {/* Tab 7: Advocacy & News */}
          <TabsContent value="news">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-[#6cb166]" /> Advocacy & News Articles Manager
                </CardTitle>
                <CardDescription className="text-xs">Add, edit, or remove press releases and workshop reports.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {news.map((item, idx) => (
                  <div key={item.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
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
                        <Label className="text-xs font-bold">Tag Category</Label>
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
                      <Label className="text-xs font-bold">Excerpt Summary</Label>
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
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 8: Gallery */}
          <TabsContent value="gallery">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#3b66b0]" /> Impact Gallery Manager
                </CardTitle>
                <CardDescription className="text-xs">Manage field documentation photos and captions.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {gallery.map((gal, idx) => (
                  <div key={gal.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Photo Caption / Description #{idx + 1}</Label>
                      <Input 
                        value={gal.description} 
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[idx].description = e.target.value;
                          setGallery(updated);
                        }}
                        className="bg-white text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold">Image URL</Label>
                      <Input 
                        value={gal.imageUrl} 
                        onChange={(e) => {
                          const updated = [...gallery];
                          updated[idx].imageUrl = e.target.value;
                          setGallery(updated);
                        }}
                        className="bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 9: Contact & Slogan */}
          <TabsContent value="contact">
            <Card className="shadow-md border border-slate-200 rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b p-6">
                <CardTitle className="font-headline text-lg text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#6cb166]" /> Official Contact & Slogan Manager
                </CardTitle>
                <CardDescription className="text-xs">Edit headquarters address, telephone, email, and slogan.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Official English Slogan</Label>
                  <Input 
                    value={contactInfo.slogan} 
                    onChange={(e) => setContactInfo({ ...contactInfo, slogan: e.target.value })}
                    className="bg-white text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Official Kinyarwanda Slogan</Label>
                  <Input 
                    value={contactInfo.sloganKinyarwanda} 
                    onChange={(e) => setContactInfo({ ...contactInfo, sloganKinyarwanda: e.target.value })}
                    className="bg-white text-xs font-bold"
                  />
                </div>
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
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={handleSave} className="bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-xs font-bold px-8 shadow-lg">
            <Save className="w-4 h-4 mr-2" /> Save All Content Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
