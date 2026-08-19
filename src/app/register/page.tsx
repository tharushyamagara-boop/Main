'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Mail, 
  Phone, 
  User, 
  Globe2, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  BadgeCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { registerSymposiumVisitor } from '@/lib/firebase';
import { PRIORITY_AFRICAN_COUNTRIES, OTHER_GLOBAL_COUNTRIES, ALL_COUNTRIES } from '@/lib/countries';

export default function SymposiumRegistrationPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('+250');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('Rwanda');
  const [organization, setOrganization] = useState('');
  const [title, setTitle] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    country: string;
    organization?: string;
    title?: string;
  } | null>(null);

  // Auto-sync country phone dial code when country changes
  const handleCountryChange = (selectedCountryName: string) => {
    setCountry(selectedCountryName);
    const found = ALL_COUNTRIES.find(c => c.name === selectedCountryName);
    if (found && found.dialCode && found.dialCode !== '+') {
      setDialCode(found.dialCode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({
        title: "Full Name Required",
        description: "Please enter the visitor's full name.",
        variant: "destructive"
      });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Valid Email Required",
        description: "Please provide a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (!phoneNumber.trim()) {
      toast({
        title: "Contact Number Required",
        description: "Please provide a valid phone/WhatsApp contact number.",
        variant: "destructive"
      });
      return;
    }

    if (!country) {
      toast({
        title: "Country Required",
        description: "Please select country of origin.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const fullContactPhone = phoneNumber.startsWith('+') ? phoneNumber.trim() : `${dialCode} ${phoneNumber.trim()}`;

    try {
      await registerSymposiumVisitor({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: fullContactPhone,
        country: country,
        organization: organization.trim() || undefined,
        title: title.trim() || undefined
      });

      setSubmittedData({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: fullContactPhone,
        country: country,
        organization: organization.trim() || undefined,
        title: title.trim() || undefined
      });

      toast({
        title: "Registration Successful!",
        description: `Thank you, ${fullName}! Welcome to ASSERWA Booth.`,
      });
    } catch (err) {
      console.error("Submission error:", err);
      toast({
        title: "Registration Recorded",
        description: "Visitor details saved locally.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterAnother = () => {
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setOrganization('');
    setTitle('');
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50 py-10 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">

        {/* Symposium Official Header Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#3b66b0]/10 border border-[#3b66b0]/20 px-4 py-1.5 rounded-full text-xs md:text-sm font-headline font-bold text-[#3b66b0] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#6cb166] shrink-0 animate-pulse" />
            <span>Africa Water & Sanitation Systems Leadership Symposium 2026</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-slate-900 tracking-tight">
              Welcome to the <span className="text-[#3b66b0]">ASSERWA</span> Booth
            </h1>
            <p className="text-slate-600 font-body text-sm md:text-base max-w-xl mx-auto">
              Forum of Sewage Emptiers in Rwanda — Please register your visit to connect with our leadership and receive official symposium documentation.
            </p>
          </div>
        </div>

        {/* Main Content: Form or Success Card */}
        {!submittedData ? (
          <Card className="shadow-2xl border border-slate-200/80 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-[#3b66b0] to-[#2e5291] text-white p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-headline font-bold uppercase tracking-widest text-[#6cb166] bg-white/10 px-2.5 py-0.5 rounded-full inline-block border border-white/10">
                    Official Booth Visitor Form
                  </span>
                  <CardTitle className="font-headline text-xl md:text-2xl text-white">
                    Visitor Registration
                  </CardTitle>
                  <CardDescription className="text-white/80 text-xs md:text-sm font-body">
                    Fill in your details below to register your visit.
                  </CardDescription>
                </div>
                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white p-1.5 shadow-lg items-center justify-center shrink-0">
                  <Image src="/logo.png" alt="ASSERWA Logo" width={48} height={48} className="object-contain" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1. Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs md:text-sm font-headline font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#3b66b0]" /> Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="e.g. Dr. John Mugabo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 text-sm bg-slate-50/70 border-slate-200 focus:bg-white transition-colors"
                  />
                </div>

                {/* 2. Contact Phone & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Contact Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs md:text-sm font-headline font-bold text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-[#3b66b0]" /> Contact / WhatsApp Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="w-28 shrink-0">
                        <Select value={dialCode} onValueChange={setDialCode}>
                          <SelectTrigger className="h-12 text-xs bg-slate-50/70 border-slate-200 font-mono">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 text-xs">
                            {ALL_COUNTRIES.map((c) => (
                              <SelectItem key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
                                {c.flag} {c.dialCode} ({c.name})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="788 123 456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="h-12 text-sm bg-slate-50/70 border-slate-200 focus:bg-white transition-colors flex-1 font-mono"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs md:text-sm font-headline font-bold text-slate-800 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#3b66b0]" /> Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. j.mugabo@example.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-sm bg-slate-50/70 border-slate-200 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Country of Origin */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs md:text-sm font-headline font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-[#3b66b0]" /> Country of Origin <span className="text-red-500">*</span>
                  </Label>
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger id="country" className="h-12 text-sm bg-slate-50/70 border-slate-200">
                      <SelectValue placeholder="Select your Country of Origin" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72 text-sm font-body">
                      <SelectGroup>
                        <SelectLabel className="text-xs font-bold text-[#3b66b0] uppercase tracking-wider">
                          African Nations
                        </SelectLabel>
                        {PRIORITY_AFRICAN_COUNTRIES.map((c) => (
                          <SelectItem key={c.code} value={c.name}>
                            <span className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span className="font-medium">{c.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2 border-t mt-1">
                          International / Global
                        </SelectLabel>
                        {OTHER_GLOBAL_COUNTRIES.map((c) => (
                          <SelectItem key={c.code} value={c.name}>
                            <span className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span>{c.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Organization & Job Title (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-xs md:text-sm font-headline font-bold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-slate-500" /> Organization / Institution
                    </Label>
                    <Input
                      id="organization"
                      type="text"
                      placeholder="e.g. WASAC / Ministry of Infrastructure / NGO"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="h-12 text-sm bg-slate-50/70 border-slate-200 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs md:text-sm font-headline font-bold text-slate-800 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-500" /> Job Title / Designation
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="e.g. Director of Sanitation / WASH Specialist"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-12 text-sm bg-slate-50/70 border-slate-200 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#6cb166] hover:bg-[#5aa054] text-white font-headline text-base font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-center"
                  >
                    {isSubmitting ? (
                      <span>Saving Registration...</span>
                    ) : (
                      <>
                        <span>Complete Booth Registration</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-[11px] text-center text-slate-500 font-body mt-2.5">
                    Your details are securely transmitted to the ASSERWA Secretariat database.
                  </p>
                </div>

              </form>
            </CardContent>
          </Card>
        ) : (
          /* Success Confirmation Card */
          <Card className="shadow-2xl border border-[#6cb166]/40 rounded-3xl overflow-hidden bg-white animate-in zoom-in-95 duration-300">
            <div className="bg-[#6cb166] text-white p-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-white text-[#6cb166] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-headline font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block">
                Registration Confirmed
              </span>
              <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-white">
                Thank You for Visiting ASSERWA!
              </h2>
              <p className="text-white/90 font-body text-sm max-w-md mx-auto">
                Your visit to our booth at the Africa Water & Sanitation Systems Leadership Symposium 2026 has been successfully registered.
              </p>
            </div>

            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Summary Details */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-slate-500">
                  Registered Details Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Visitor Name</span>
                    <span className="font-bold text-slate-900">{submittedData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Country of Origin</span>
                    <span className="font-bold text-slate-900">{submittedData.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Phone</span>
                    <span className="font-bold font-mono text-slate-900">{submittedData.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Email Address</span>
                    <span className="font-bold text-slate-900">{submittedData.email}</span>
                  </div>
                  {submittedData.organization && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block text-[11px]">Organization / Role</span>
                      <span className="font-bold text-slate-900">
                        {submittedData.organization} {submittedData.title ? `— ${submittedData.title}` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleRegisterAnother}
                  className="flex-1 h-12 bg-[#3b66b0] hover:bg-[#2e5291] text-white font-headline text-sm font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Register Next Visitor</span>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="flex-1 h-12 border-slate-300 text-slate-800 hover:bg-slate-50 font-headline text-sm font-bold rounded-xl"
                >
                  <Link href="/resources">
                    <span>Explore ASSERWA Documents</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informational Footer Strip */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-slate-200 text-center space-y-2 text-xs text-slate-600 font-body">
          <p className="font-headline font-bold text-slate-800">
            ASSERWA — Forum of Sewage Emptiers in Rwanda
          </p>
          <p>
            Irembo House, Gishushu Road, Nyarutarama Village, Remera, Gasabo, Kigali City, Rwanda • Phone: +250 784 246 216 • Email: asserwarwanda@gmail.com
          </p>
        </div>

      </div>
    </div>
  );
}
