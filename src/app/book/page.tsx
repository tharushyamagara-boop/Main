'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { format, isBefore, startOfToday } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  ChevronRight, 
  RotateCcw, 
  ExternalLink, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Building2,
  Globe,
  Star,
  Check,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  SERVICE_OPTIONS, 
  TIME_SLOT_OPTIONS, 
  REFERRAL_SOURCE_OPTIONS,
  Booking,
  createBookingRecord
} from '@/lib/bookings';
import { 
  MemberCompany, 
  subscribeToMemberCompanies 
} from '@/lib/members';
import { getStoredPlatformAttribution, PlatformAttribution } from '@/lib/tracking';
import { useToast } from '@/hooks/use-toast';

const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export default function BookServicePage() {
  const { toast } = useToast();
  // Form input states
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(SERVICE_OPTIONS[0].name);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(undefined);
  const [preferredTime, setPreferredTime] = useState(TIME_SLOT_OPTIONS[0].label);
  const [referralSource, setReferralSource] = useState(REFERRAL_SOURCE_OPTIONS[0]);
  const [customReferral, setCustomReferral] = useState('');
  const [description, setDescription] = useState('');
  const [locationUrl, setLocationUrl] = useState('');

  // Member Companies State
  const [memberCompanies, setMemberCompanies] = useState<MemberCompany[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  // Platform Tracking & Attribution states
  const [attribution, setAttribution] = useState<PlatformAttribution | null>(null);
  const [detectedOriginNote, setDetectedOriginNote] = useState<string>('');

  // GPS Geolocation states
  const [isLocating, setIsLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [geoMessage, setGeoMessage] = useState('');
  const [detectedCoords, setDetectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Submission & Success states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  // Subscribe to real-time ASSERWA Member Companies
  useEffect(() => {
    const unsub = subscribeToMemberCompanies((data) => {
      const activeList = data.filter(m => m.active !== false);
      setMemberCompanies(activeList);

      // Check if URL specifies a memberId to pre-select
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryMemberId = params.get('memberId');
        if (queryMemberId && activeList.some(m => m.id === queryMemberId)) {
          setSelectedMemberId(queryMemberId);
        }
      }
    });
    return () => unsub();
  }, []);

  // Compute selected member company profile for sidebar loading
  const selectedMember = useMemo(() => {
    if (!selectedMemberId || selectedMemberId === 'auto') return null;
    return memberCompanies.find(m => m.id === selectedMemberId) || null;
  }, [selectedMemberId, memberCompanies]);

  // Set default appointment date to tomorrow and initialize platform tracking
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow);

    const attr = getStoredPlatformAttribution();
    if (attr) {
      setAttribution(attr);
      if (attr.channel && attr.channel !== 'Direct Website Visit') {
        const matchedOption = REFERRAL_SOURCE_OPTIONS.find(opt => 
          opt.toLowerCase().includes(attr.channel.toLowerCase()) || 
          attr.channel.toLowerCase().includes(opt.toLowerCase())
        );

        if (matchedOption) {
          setReferralSource(matchedOption);
          setDetectedOriginNote(`Detected arrival channel: ${attr.channel}`);
        } else {
          setReferralSource('Others');
          setCustomReferral(attr.channel);
          setDetectedOriginNote(`Detected arrival channel: ${attr.channel}`);
        }
      }
    }
  }, []);

  // Geolocation Handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoMessage('Geolocation is not supported by your browser. Please enter your physical address or maps link manually.');
      return;
    }

    setIsLocating(true);
    setGeoStatus('idle');
    setGeoMessage('Contacting GPS satellite & device sensors...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        
        setLocationUrl(mapsUrl);
        setDetectedCoords({ lat, lng });
        setGeoStatus('success');
        setGeoMessage(`GPS Pinpoint Acquired: (${lat.toFixed(5)}, ${lng.toFixed(5)}) with accuracy ±${Math.round(position.coords.accuracy)}m`);
        setIsLocating(false);
        setFormErrors(prev => {
          const updated = { ...prev };
          delete updated.locationUrl;
          return updated;
        });
      },
      (error) => {
        setIsLocating(false);
        setGeoStatus('error');
        let errMsg = 'Failed to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          errMsg = 'Location permission denied. Please allow location access or type your address manually below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errMsg = 'Location position unavailable. Please enter your address manually.';
        } else if (error.code === error.TIMEOUT) {
          errMsg = 'Location request timed out. Please enter your address manually.';
        }
        setGeoMessage(errMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Form Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name or company name.';
    }

    if (!email.trim() || !RFC5322_EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please provide a valid email address (e.g. name@domain.com).';
    }

    if (!phone.trim() || phone.trim().length < 7) {
      errors.phone = 'Please provide an active phone number for dispatch driver contact.';
    }

    if (!serviceType) {
      errors.serviceType = 'Please select a sanitation service category.';
    }

    if (!locationUrl.trim()) {
      errors.locationUrl = 'Please provide your dispatch address or click "Use Current GPS Location".';
    }

    if (!appointmentDate) {
      errors.appointmentDate = 'Please select your preferred service date.';
    } else if (isBefore(appointmentDate, startOfToday())) {
      errors.appointmentDate = 'Appointment date cannot be in the past.';
    }

    if (!selectedMemberId || selectedMemberId === 'auto') {
      errors.selectedMemberId = 'Please select a service provider company.';
    }

    if (referralSource === 'Others' && !customReferral.trim()) {
      errors.customReferral = 'Please specify how you heard about ASSERWA.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorKey = Object.keys(formErrors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    if (!appointmentDate) return;

    const formattedDate = format(appointmentDate, 'EEEE, MMM d, yyyy');
    const isoDate = format(appointmentDate, 'yyyy-MM-dd');
    const finalReferral = referralSource === 'Others' ? `Others: ${customReferral.trim()}` : referralSource;

    const assignedMemberId = selectedMember ? selectedMember.id : '';
    const assignedMemberName = selectedMember ? selectedMember.name : '';
    const assignedMemberWebsite = selectedMember ? (selectedMember.websiteUrl || '') : '';

    const payload = {
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      serviceType,
      locationUrl: locationUrl.trim(),
      appointmentDate: isoDate,
      appointmentDateFormatted: formattedDate,
      preferredTime,
      referralSource: finalReferral,
      attribution: attribution || undefined,
      description: description.trim(),
      assignedMemberId,
      assignedMemberName,
      assignedMemberWebsite
    };

    try {
      const booking = await createBookingRecord(payload as any);
      setSubmittedBooking(booking);
    } catch (err: any) {
      console.error("Booking submission error:", err);
      toast({
        title: "Booking Failed",
        description: err.message || "We could not process your booking at this time. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Form
  const handleReset = () => {
    setCustomerName('');
    setEmail('');
    setPhone('');
    setServiceType(SERVICE_OPTIONS[0].name);
    setSelectedMemberId('auto');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow);
    setPreferredTime(TIME_SLOT_OPTIONS[0].label);
    setReferralSource(REFERRAL_SOURCE_OPTIONS[0]);
    setCustomReferral('');
    setDescription('');
    setLocationUrl('');
    setGeoStatus('idle');
    setGeoMessage('');
    setFormErrors({});
    setSubmittedBooking(null);
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedBooking) {
    return (
      <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#3b66b0] p-6 text-white text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-200">
                  Service Request Confirmed
                </span>
                <h1 className="text-xl sm:text-2xl font-headline font-bold">
                  Thank You, {submittedBooking.customerName}!
                </h1>
                <p className="text-xs text-blue-100 mt-1">
                  Your sanitation dispatch request has been safely registered in the central ASSERWA dispatch system.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#3b66b0] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-900">
                    Booking Reference ID: <span className="font-mono text-sm text-[#3b66b0]">#{submittedBooking.id}</span>
                  </span>
                  <p className="mt-0.5 text-slate-600">
                    We have dispatched an automated confirmation to <strong className="text-slate-900">{submittedBooking.email}</strong>. The assigned service provider team will verify your appointment.
                  </p>
                </div>
              </div>

              {/* Appointment Recap Card */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/60 space-y-4">
                <h3 className="text-xs font-bold font-headline uppercase tracking-wider text-slate-500">
                  Appointment Recap Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-[#3b66b0] flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Selected Service</p>
                      <p className="font-semibold text-slate-900">{submittedBooking.serviceType}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-[#16a34a] flex items-center justify-center shrink-0">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Scheduled Date</p>
                      <p className="font-semibold text-slate-900">{submittedBooking.appointmentDateFormatted}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Arrival Time Slot</p>
                      <p className="font-semibold text-slate-900">{submittedBooking.preferredTime}</p>
                    </div>
                  </div>

                  {/* Assigned Service Provider Member Company */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/80 text-[#3b66b0] flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Assigned Service Provider</p>
                      <p className="font-semibold text-slate-900">{submittedBooking.assignedMemberName || "ASSERWA Central Dispatch"}</p>
                      {submittedBooking.assignedMemberWebsite && submittedBooking.assignedMemberWebsite.startsWith('http') && (
                        <a
                          href={submittedBooking.assignedMemberWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#3b66b0] hover:underline font-semibold flex items-center gap-1 mt-0.5"
                        >
                          <span>Visit Provider Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location recap */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="font-medium">Target Service Location:</span>
                    <span className="truncate max-w-[200px] sm:max-w-[320px] font-mono text-[11px] text-slate-800">
                      {submittedBooking.locationUrl}
                    </span>
                  </div>
                  {submittedBooking.locationUrl.startsWith('http') && (
                    <a 
                      href={submittedBooking.locationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#3b66b0] hover:text-[#2d5292] font-semibold underline shrink-0"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {submittedBooking.description && (
                  <div className="pt-3 border-t border-slate-200/80">
                    <p className="text-xs text-slate-500 font-medium">Problem Statement:</p>
                    <p className="text-xs text-slate-700 mt-1 italic bg-white p-2.5 rounded border border-slate-200">
                      "{submittedBooking.description}"
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Options */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full sm:w-auto text-slate-700 border-slate-300 hover:bg-slate-100"
                >
                  <Link href="/">
                    Return to Homepage
                  </Link>
                </Button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button 
                    onClick={handleReset}
                    variant="secondary"
                    className="w-full sm:w-auto flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Book Another Service</span>
                  </Button>

                  <Button 
                    asChild 
                    className="w-full sm:w-auto bg-[#3b66b0] hover:bg-[#2b4c85] text-white"
                  >
                    <Link href="/services">
                      Explore All Services
                    </Link>
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  }

  // MAIN CLIENT BOOKING FORM WITH MEMBER COMPANY SIDEBAR
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight text-slate-900">
            Schedule Sanitation Service
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Book professional liquid waste evacuation and exhauster services across Rwanda.
          </p>
        </div>
      </section>

      {/* Main Booking Container with Sticky Member Profile Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Booking Form (8 Columns) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden p-5 sm:p-6 space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="customerName" className="text-xs font-semibold text-slate-700">
                      Full Name / Organization *
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Jean Paul Habimana / Hotel Des Mille Collines"
                      className={cn("h-10 text-xs sm:text-sm bg-slate-50/50", formErrors.customerName && "border-red-500")}
                    />
                    {formErrors.customerName && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.customerName}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+250 788 000 000"
                      className={cn("h-10 text-xs sm:text-sm bg-slate-50/50", formErrors.phone && "border-red-500")}
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@organization.rw"
                      className={cn("h-10 text-xs sm:text-sm bg-slate-50/50", formErrors.email && "border-red-500")}
                    />
                    {formErrors.email && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Service Selection */}
                  <div className="space-y-1">
                    <Label htmlFor="serviceType" className="text-xs font-semibold text-slate-700">
                      Sanitation Service *
                    </Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger id="serviceType" className="h-10 text-xs sm:text-sm bg-slate-50/50">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {SERVICE_OPTIONS.map((srv) => (
                          <SelectItem key={srv.id} value={srv.name} className="py-2">
                            <span className="font-medium text-slate-900 text-xs sm:text-sm">{srv.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Provider Selection */}
                  <div className="space-y-1">
                    <Label htmlFor="selectedMemberId" className="text-xs font-semibold text-slate-700">
                      Service Provider *
                    </Label>
                    <Select 
                      value={selectedMemberId} 
                      onValueChange={(val) => {
                        setSelectedMemberId(val);
                        setFormErrors(prev => {
                          const updated = { ...prev };
                          delete updated.selectedMemberId;
                          return updated;
                        });
                      }}
                    >
                      <SelectTrigger id="selectedMemberId" className={cn("h-10 text-xs sm:text-sm bg-slate-50/50", formErrors.selectedMemberId && "border-red-500")}>
                        <SelectValue placeholder="Select a service provider" />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {memberCompanies.map((member) => (
                          <SelectItem key={member.id} value={member.id} className="py-2">
                            <span className="font-medium text-slate-900 text-xs sm:text-sm">{member.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.selectedMemberId && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.selectedMemberId}</span>
                      </p>
                    )}
                  </div>

                  {/* Location Address with GPS */}
                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="locationUrl" className="text-xs font-semibold text-slate-700">
                        Location Address / Google Maps Link *
                      </Label>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={isLocating}
                        className="text-xs font-medium text-[#3b66b0] hover:text-[#2b4c85] inline-flex items-center gap-1 transition-colors"
                      >
                        <Navigation className={cn("w-3.5 h-3.5", isLocating && "animate-spin text-amber-500")} />
                        <span>{isLocating ? "Getting GPS..." : "Auto-fill with GPS"}</span>
                      </button>
                    </div>
                    <Input
                      id="locationUrl"
                      type="text"
                      value={locationUrl}
                      onChange={(e) => setLocationUrl(e.target.value)}
                      placeholder="e.g. KN 5 Rd, Nyarugenge, Kigali or Google Maps link"
                      className={cn("h-10 text-xs sm:text-sm bg-slate-50/50", formErrors.locationUrl && "border-red-500")}
                    />
                    {geoStatus === 'success' && (
                      <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{geoMessage}</span>
                      </p>
                    )}
                    {geoStatus === 'error' && (
                      <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{geoMessage}</span>
                      </p>
                    )}
                    {formErrors.locationUrl && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.locationUrl}</span>
                      </p>
                    )}
                  </div>

                  {/* Service Date */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Service Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-10 justify-start text-left text-xs sm:text-sm font-normal bg-slate-50/50 border-slate-200",
                            !appointmentDate && "text-slate-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-[#3b66b0]" />
                          {appointmentDate ? format(appointmentDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <Calendar
                          mode="single"
                          selected={appointmentDate}
                          onSelect={setAppointmentDate}
                          disabled={(date) => isBefore(date, startOfToday())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Arrival Window */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-700">Preferred Arrival Window *</Label>
                    <Select value={preferredTime} onValueChange={setPreferredTime}>
                      <SelectTrigger className="h-10 text-xs sm:text-sm bg-slate-50/50">
                        <SelectValue placeholder="Choose arrival window" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOT_OPTIONS.map((slot) => (
                          <SelectItem key={slot.id} value={slot.label} className="py-2 text-xs sm:text-sm">
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Referral Source */}
                  <div className={cn("space-y-1", referralSource !== 'Others' && "sm:col-span-2")}>
                    <Label className="text-xs font-semibold text-slate-700">How did you discover ASSERWA? *</Label>
                    <Select value={referralSource} onValueChange={setReferralSource}>
                      <SelectTrigger className="h-10 text-xs sm:text-sm bg-slate-50/50">
                        <SelectValue placeholder="Select referral channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {REFERRAL_SOURCE_OPTIONS.map((source) => (
                          <SelectItem key={source} value={source} className="py-2 text-xs sm:text-sm">
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {referralSource === 'Others' && (
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">Please specify *</Label>
                      <Input
                        type="text"
                        value={customReferral}
                        onChange={(e) => setCustomReferral(e.target.value)}
                        placeholder="e.g. Radio broadcast, Exhibition..."
                        className="h-10 text-xs sm:text-sm bg-slate-50/50"
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs font-semibold text-slate-700">Additional Instructions / Site Notes</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Septic tank size, access notes, or special requirements (optional)..."
                      className="min-h-[60px] h-[60px] text-xs sm:text-sm bg-slate-50/50 py-2"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-1">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-bold text-sm h-11 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Queueing Dispatch..." : "Confirm Service Booking"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

              </div>
            </form>
          </div>

          {/* Member Company Profile Sidebar (4 Columns, Sticky on Desktop) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            
            {/* If a specific member company is selected */}
            {selectedMember ? (
              <div className="bg-white border-2 border-[#3b66b0]/30 rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in duration-300">
                <div className="flex items-start gap-3">
                  {selectedMember.logoUrl ? (
                    <img
                      src={selectedMember.logoUrl}
                      alt={selectedMember.name}
                      className="w-14 h-14 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b66b0] to-[#1e3a6e] text-white flex items-center justify-center font-bold text-lg font-headline shrink-0 shadow-xs">
                      {selectedMember.logoText || selectedMember.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-headline font-bold text-slate-900 text-base leading-snug">
                      {selectedMember.name}
                    </h3>
                    <p className="text-xs text-[#3b66b0] font-semibold mt-0.5">
                      {selectedMember.category}
                    </p>
                  </div>
                </div>

                {selectedMember.briefDescription && (
                  <p className="text-xs font-medium text-slate-800 leading-relaxed border-l-2 border-[#3b66b0] pl-2.5 py-0.5">
                    {selectedMember.briefDescription}
                  </p>
                )}

                {selectedMember.description && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    {selectedMember.description}
                  </p>
                )}

                {/* Clickable Website Link or Fallback */}
                {selectedMember.showWebsite !== false &&
                 selectedMember.websiteUrl && 
                 selectedMember.websiteUrl.trim() !== '' && 
                 selectedMember.websiteUrl !== '#' && 
                 selectedMember.websiteUrl.startsWith('http') ? (
                  <div className="pt-1">
                    <a
                      href={selectedMember.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#3b66b0] hover:bg-[#2b4c85] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all group"
                    >
                      <Globe className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform" />
                      <span>Visit Company Official Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <p className="text-[10px] text-slate-400 text-center mt-1.5 font-mono">
                      {selectedMember.websiteUrl.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                    <p className="text-xs font-medium text-slate-600">
                      Profile information not available / No company website available
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* When no provider is selected yet */
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <Badge className="bg-blue-50 text-[#3b66b0] border-blue-200 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Member Network</span>
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {memberCompanies.length} Members
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-slate-900 text-base">
                    Select a Service Provider
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Choose an ASSERWA member company from the dropdown to load their profile, operational capabilities, and official website.
                  </p>
                </div>

                {/* Member Network Preview Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Member Companies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {memberCompanies.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setSelectedMemberId(m.id);
                          setFormErrors(prev => {
                            const updated = { ...prev };
                            delete updated.selectedMemberId;
                            return updated;
                          });
                        }}
                        className="text-[11px] bg-slate-50 hover:bg-blue-50 hover:text-[#3b66b0] text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg transition-colors text-left truncate max-w-[170px]"
                        title={`Select ${m.name} to view profile`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <p>
                    Tip: Click any member company above to select them and load their profile.
                  </p>
                </div>

                <div className="pt-1">
                  <Button asChild variant="outline" size="sm" className="w-full text-xs text-slate-700 border-slate-200">
                    <Link href="/dashboard" target="_blank" className="flex items-center justify-center gap-1.5">
                      <span>Browse Full Member Directory</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
