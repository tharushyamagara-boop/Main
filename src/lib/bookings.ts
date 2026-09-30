import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs 
} from "firebase/firestore";
import { db } from "./firebase";

import { PlatformAttribution } from "./tracking";

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceType: string;
  locationUrl: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentDateFormatted: string; // e.g. "Monday, Oct 12, 2026"
  preferredTime: string; // e.g. "Morning (8:00 AM - 12:00 PM)"
  referralSource: string; // e.g. "Google Search", "LinkedIn", "Word of Mouth", "Others: ..."
  attribution?: PlatformAttribution; // Platform digital acquisition metadata
  description: string;
  assignedMemberId?: string; // ASSERWA member company ID performing service
  assignedMemberName?: string; // ASSERWA member company name
  assignedMemberWebsite?: string; // ASSERWA member company website
  status: BookingStatus;
  createdAt: number;
  updatedAt: number;
}

export type BookingInput = Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: BookingStatus;
  attribution?: PlatformAttribution;
  assignedMemberId?: string;
  assignedMemberName?: string;
  assignedMemberWebsite?: string;
};

export const SERVICE_OPTIONS = [
  {
    id: "liquid-waste-collection",
    name: "Liquid Waste Collection and Transport",
    badge: "Vacuum Trucks",
    description: "Modern vacuum trucks for efficient waste collection, serving schools, hospitals, hotels, and commercial buildings."
  },
  {
    id: "decentralized-treatment-systems",
    name: "Installation of Decentralized Wastewater Treatment Systems",
    badge: "Clean Water Reuse",
    description: "Advanced systems for clean water reuse in irrigation, cleaning, flushing, and eco-friendly solutions using activated sludge technology."
  },
  {
    id: "maintenance-consultancy",
    name: "Maintenance & Consultancy",
    badge: "Quarterly Service",
    description: "Quarterly maintenance services and expert advice for optimal wastewater management."
  },
  {
    id: "sanitation-projects-partnerships",
    name: "Sanitation Projects and Partnerships",
    badge: "Public Health",
    description: "Collaborating with government and private organizations and promoting public health and hygiene."
  }
];

export const TIME_SLOT_OPTIONS = [
  { id: "morning", label: "Morning (8:00 AM - 12:00 PM)", description: "Best for early residential service" },
  { id: "afternoon", label: "Afternoon (12:00 PM - 4:00 PM)", description: "Standard business hours" },
  { id: "evening", label: "Evening (4:00 PM - 7:00 PM)", description: "Late afternoon & after-hours" },
  { id: "emergency", label: "Emergency / Immediate Dispatch (24/7)", description: "Urgent dispatch team standby" }
];

export const REFERRAL_SOURCE_OPTIONS = [
  "LinkedIn",
  "Email",
  "Google Search",
  "YouTube",
  "Facebook",
  "Twitter (X)",
  "WhatsApp / Direct Messaging",
  "Word of Mouth / Colleague Recommendation",
  "ASSERWA Member Company",
  "Government / Municipal Partner (WASAC, RURA, City of Kigali)",
  "Rwanda Water & Sanitation Symposium 2026",
  "Direct Website Visit",
  "Others"
];

export const BOOKINGS_COLLECTION = "bookings";
export const LOCAL_BOOKINGS_CACHE_KEY = "asserwa_bookings_cache_v3";

/* =========================================================================
   CLIENT LIFECYCLE & LOYALTY TIER SYSTEM
   - Potential Client: 0 completed bookings (only pending, confirmed, or cancelled)
   - Client: 1 - 4 completed bookings
   - Regular Client: 5 or more completed bookings
   ========================================================================= */

export type ClientTier = 'potential' | 'client' | 'regular';

export interface ClientTierInfo {
  tier: ClientTier;
  label: string; // 'Potential Client' | 'Client' | 'Regular Client'
  completedCount: number;
  totalBookingsCount: number;
  badgeColorClass: string;
  nextTierProgress?: {
    remainingForNextTier: number;
    targetTier: string;
    percentage: number;
  };
}

/**
 * Calculates the loyalty tier of a service requester based on their total completed bookings
 */
export function calculateClientTier(
  identifier: { email?: string; phone?: string; customerName?: string },
  allBookings: Booking[]
): ClientTierInfo {
  const normEmail = (identifier.email || '').trim().toLowerCase();
  const normPhone = (identifier.phone || '').trim().replace(/[\s\-+]/g, '');

  const clientBookings = allBookings.filter(b => {
    const bEmail = (b.email || '').trim().toLowerCase();
    const bPhone = (b.phone || '').trim().replace(/[\s\-+]/g, '');
    const matchEmail = normEmail && bEmail && bEmail === normEmail;
    const matchPhone = normPhone && bPhone && bPhone.endsWith(normPhone.slice(-8));
    return matchEmail || matchPhone;
  });

  const totalBookingsCount = clientBookings.length;
  const completedCount = clientBookings.filter(b => b.status === 'completed').length;

  if (completedCount >= 5) {
    return {
      tier: 'regular',
      label: 'Regular Client',
      completedCount,
      totalBookingsCount,
      badgeColorClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    };
  } else if (completedCount >= 1) {
    return {
      tier: 'client',
      label: 'Client',
      completedCount,
      totalBookingsCount,
      badgeColorClass: 'bg-blue-50 text-[#3b66b0] border-blue-200',
      nextTierProgress: {
        remainingForNextTier: 5 - completedCount,
        targetTier: 'Regular Client',
        percentage: Math.round((completedCount / 5) * 100)
      }
    };
  } else {
    return {
      tier: 'potential',
      label: 'Potential Client',
      completedCount: 0,
      totalBookingsCount,
      badgeColorClass: 'bg-amber-50 text-amber-900 border-amber-200',
      nextTierProgress: {
        remainingForNextTier: 1,
        targetTier: 'Client',
        percentage: 0
      }
    };
  }
}

export interface ClientProfileSummary {
  clientId: string; // Unique key (email or phone)
  customerName: string;
  email: string;
  phone: string;
  tier: ClientTier;
  tierLabel: string;
  completedCount: number;
  totalBookingsCount: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
  firstBookingDate: number;
  lastBookingDate: number;
  declaredSources: string[];
  bookings: Booking[];
}

/**
 * Aggregates all bookings by customer identity to build CRM customer profiles
 */
export function aggregateClientProfiles(allBookings: Booking[]): ClientProfileSummary[] {
  const map = new Map<string, Booking[]>();

  for (const b of allBookings) {
    const key = (b.email || b.phone || b.customerName).trim().toLowerCase();
    if (!key) continue;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(b);
  }

  const profiles: ClientProfileSummary[] = [];

  map.forEach((bList, key) => {
    // Sort bookings desc by createdAt
    const sorted = [...bList].sort((a, b) => b.createdAt - a.createdAt);
    const primary = sorted[0];
    const completedCount = sorted.filter(b => b.status === 'completed').length;
    const pendingCount = sorted.filter(b => b.status === 'pending').length;
    const confirmedCount = sorted.filter(b => b.status === 'confirmed').length;
    const cancelledCount = sorted.filter(b => b.status === 'cancelled').length;

    let tier: ClientTier = 'potential';
    let tierLabel = 'Potential Client';
    if (completedCount >= 5) {
      tier = 'regular';
      tierLabel = 'Regular Client';
    } else if (completedCount >= 1) {
      tier = 'client';
      tierLabel = 'Client';
    }

    const declaredSources = Array.from(new Set(sorted.map(b => b.referralSource).filter(Boolean)));

    profiles.push({
      clientId: key,
      customerName: primary.customerName,
      email: primary.email,
      phone: primary.phone,
      tier,
      tierLabel,
      completedCount,
      totalBookingsCount: sorted.length,
      pendingCount,
      confirmedCount,
      cancelledCount,
      firstBookingDate: sorted[sorted.length - 1].createdAt,
      lastBookingDate: sorted[0].createdAt,
      declaredSources,
      bookings: sorted
    });
  });

  return profiles.sort((a, b) => {
    const rank: Record<ClientTier, number> = { regular: 3, client: 2, potential: 1 };
    if (rank[b.tier] !== rank[a.tier]) {
      return rank[b.tier] - rank[a.tier];
    }
    return b.completedCount - a.completedCount;
  });
}

/* =========================================================================
   DECLARED SOURCE FREQUENCY TRACKING
   - Tracks how many times customers declared they found ASSERWA via
     LinkedIn, Email, Google Search, YouTube, Facebook, Twitter, etc.
   ========================================================================= */

export interface DeclaredSourceFrequency {
  source: string;
  count: number;
  percentage: number;
  completedCount: number;
  conversionRate: number;
  uniqueRequesters: number;
}

export function normalizeDeclaredSource(rawSource: string): string {
  if (!rawSource) return "Direct Visit";
  const s = rawSource.toLowerCase().trim();
  if (s.includes("linkedin")) return "LinkedIn";
  if (s.includes("email") || s.includes("newsletter") || s.includes("mail")) return "Email";
  if (s.includes("google") || s.includes("search")) return "Google Search";
  if (s.includes("youtube") || s.includes("video")) return "YouTube";
  if (s.includes("facebook") || s.includes("instagram") || s.includes("meta")) return "Facebook";
  if (s.includes("twitter") || s === "x" || s.includes("(x)")) return "Twitter (X)";
  if (s.includes("whatsapp") || s.includes("wa")) return "WhatsApp";
  if (s.includes("mouth") || s.includes("referral") || s.includes("colleague")) return "Word of Mouth";
  if (s.includes("symposium") || s.includes("event") || s.includes("conference")) return "Symposium 2026";
  if (s.includes("partner") || s.includes("member") || s.includes("wasac") || s.includes("rura") || s.includes("kigali")) return "Partner / Member";
  if (s.includes("direct") || s.includes("website")) return "Direct Visit";
  return "Others";
}

export function calculateDeclaredSourceFrequencies(bookings: Booking[]): DeclaredSourceFrequency[] {
  const total = bookings.length;
  const groups: Record<string, { count: number; completedCount: number; customers: Set<string> }> = {};

  const prioritySources = [
    "LinkedIn",
    "Email",
    "Google Search",
    "YouTube",
    "Facebook",
    "Twitter (X)",
    "WhatsApp",
    "Word of Mouth",
    "Partner / Member",
    "Symposium 2026",
    "Direct Visit",
    "Others"
  ];

  prioritySources.forEach(src => {
    groups[src] = { count: 0, completedCount: 0, customers: new Set() };
  });

  bookings.forEach(b => {
    const normalized = normalizeDeclaredSource(b.referralSource || b.attribution?.channel || '');
    if (!groups[normalized]) {
      groups[normalized] = { count: 0, completedCount: 0, customers: new Set() };
    }
    groups[normalized].count += 1;
    if (b.status === 'completed') {
      groups[normalized].completedCount += 1;
    }
    const customerKey = (b.email || b.phone || b.customerName).toLowerCase().trim();
    if (customerKey) {
      groups[normalized].customers.add(customerKey);
    }
  });

  const results: DeclaredSourceFrequency[] = Object.entries(groups).map(([source, data]) => {
    const percentage = total > 0 ? Math.round((data.count / total) * 100) : 0;
    const conversionRate = data.count > 0 ? Math.round((data.completedCount / data.count) * 100) : 0;
    return {
      source,
      count: data.count,
      percentage,
      completedCount: data.completedCount,
      conversionRate,
      uniqueRequesters: data.customers.size
    };
  });

  // Sort by count descending, then priority list
  return results.sort((a, b) => b.count - a.count);
}

// Enriched sample bookings showcasing Regular Clients (5+ completed), Clients (1-4), and Potential Clients (0)
export const SAMPLE_SEED_BOOKINGS: Booking[] = [
  // Jean Paul Habimana (REGULAR CLIENT - 5 completed + 1 confirmed)
  {
    id: "bk-2026-101",
    customerName: "Jean Paul Habimana",
    email: "jp.habimana@kigalihotels.rw",
    phone: "+250 788 123 456",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9440727,30.0618851",
    appointmentDate: "2026-10-05",
    appointmentDateFormatted: "Monday, Oct 5, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "LinkedIn",
    description: "Scheduled modern vacuum truck extraction for hotel grease traps and primary commercial waste chamber.",
    status: "confirmed",
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    updatedAt: Date.now() - 1000 * 60 * 60 * 4
  },
  {
    id: "bk-2026-102",
    customerName: "Jean Paul Habimana",
    email: "jp.habimana@kigalihotels.rw",
    phone: "+250 788 123 456",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9440727,30.0618851",
    appointmentDate: "2026-09-20",
    appointmentDateFormatted: "Sunday, Sep 20, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "LinkedIn",
    description: "Bi-weekly emptying for guest wing commercial septic vault.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 9
  },
  {
    id: "bk-2026-103",
    customerName: "Jean Paul Habimana",
    email: "jp.habimana@kigalihotels.rw",
    phone: "+250 788 123 456",
    serviceType: "Maintenance & Consultancy",
    locationUrl: "https://www.google.com/maps?q=-1.9440727,30.0618851",
    appointmentDate: "2026-09-01",
    appointmentDateFormatted: "Tuesday, Sep 1, 2026",
    preferredTime: "Afternoon (12:00 PM - 4:00 PM)",
    referralSource: "LinkedIn",
    description: "Quarterly grease trap calibration and environmental compliance inspection.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 27
  },
  {
    id: "bk-2026-104",
    customerName: "Jean Paul Habimana",
    email: "jp.habimana@kigalihotels.rw",
    phone: "+250 788 123 456",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9440727,30.0618851",
    appointmentDate: "2026-08-15",
    appointmentDateFormatted: "Saturday, Aug 15, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "LinkedIn",
    description: "Vacuum tanker service for conference center wastewater tank.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 44
  },
  {
    id: "bk-2026-105",
    customerName: "Jean Paul Habimana",
    email: "jp.habimana@kigalihotels.rw",
    phone: "+250 788 123 456",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9440727,30.0618851",
    appointmentDate: "2026-08-01",
    appointmentDateFormatted: "Saturday, Aug 1, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "LinkedIn",
    description: "Scheduled commercial waste evacuation.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 59
  },
  {
    id: "bk-2026-106",
    customerName: "Jean Paul Habimana",
    email: "jp.habimana@kigalihotels.rw",
    phone: "+250 788 123 456",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9440727,30.0618851",
    appointmentDate: "2026-07-15",
    appointmentDateFormatted: "Wednesday, Jul 15, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "LinkedIn",
    description: "Initial commercial vacuum truck dispatch.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 75,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 74
  },

  // Dr. Emmanuel Gasana (CLIENT - 2 completed + 1 pending)
  {
    id: "bk-2026-201",
    customerName: "Dr. Emmanuel Gasana",
    email: "e.gasana@kigaliclinc.org",
    phone: "+250 788 554 433",
    serviceType: "Maintenance & Consultancy",
    locationUrl: "https://www.google.com/maps?q=-1.9620,30.0880",
    appointmentDate: "2026-10-04",
    appointmentDateFormatted: "Sunday, Oct 4, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "Email",
    description: "Quarterly preventative maintenance inspection and technical audit for clinic wastewater line.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    updatedAt: Date.now() - 1000 * 60 * 60 * 6
  },
  {
    id: "bk-2026-202",
    customerName: "Dr. Emmanuel Gasana",
    email: "e.gasana@kigaliclinc.org",
    phone: "+250 788 554 433",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9620,30.0880",
    appointmentDate: "2026-09-12",
    appointmentDateFormatted: "Saturday, Sep 12, 2026",
    preferredTime: "Afternoon (12:00 PM - 4:00 PM)",
    referralSource: "Email",
    description: "Medical wing sewage disposal with certified sanitation manifest.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 17
  },
  {
    id: "bk-2026-203",
    customerName: "Dr. Emmanuel Gasana",
    email: "e.gasana@kigaliclinc.org",
    phone: "+250 788 554 433",
    serviceType: "Maintenance & Consultancy",
    locationUrl: "https://www.google.com/maps?q=-1.9620,30.0880",
    appointmentDate: "2026-10-12",
    appointmentDateFormatted: "Monday, Oct 12, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "Email",
    description: "Upcoming routine inspection.",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 12
  },

  // Marie Claire Mukamana (POTENTIAL CLIENT - 0 completed, 1 pending)
  {
    id: "bk-2026-301",
    customerName: "Marie Claire Mukamana",
    email: "mukamana.claire@gmail.com",
    phone: "+250 783 998 771",
    serviceType: "Installation of Decentralized Wastewater Treatment Systems",
    locationUrl: "https://www.google.com/maps?q=-1.9575,30.1127",
    appointmentDate: "2026-10-06",
    appointmentDateFormatted: "Tuesday, Oct 6, 2026",
    preferredTime: "Afternoon (12:00 PM - 4:00 PM)",
    referralSource: "Google Search",
    description: "Consultation and feasibility inspection for activated sludge decentralized treatment system for irrigation reuse.",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 18
  },

  // Patrick Ndayisaba (POTENTIAL CLIENT - 0 completed, 1 pending via LinkedIn)
  {
    id: "bk-2026-401",
    customerName: "Patrick Ndayisaba",
    email: "patrick.nda@constructionrw.com",
    phone: "+250 722 888 120",
    serviceType: "Sanitation Projects and Partnerships",
    locationUrl: "https://www.google.com/maps?q=-1.9701,30.0754",
    appointmentDate: "2026-10-08",
    appointmentDateFormatted: "Thursday, Oct 8, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "LinkedIn",
    description: "Joint institutional public sanitation partnership project assessment for secondary school campus.",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5
  },

  // David Kayinamura (CLIENT - 1 completed via YouTube)
  {
    id: "bk-2026-501",
    customerName: "David Kayinamura",
    email: "d.kayinamura@kigalilogistics.rw",
    phone: "+250 788 443 210",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9650,30.0900",
    appointmentDate: "2026-09-25",
    appointmentDateFormatted: "Friday, Sep 25, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "YouTube",
    description: "Warehouse distribution center vacuum pumping.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4
  },

  // Grace Ingabire (POTENTIAL CLIENT - 0 completed, 1 pending via Facebook)
  {
    id: "bk-2026-601",
    customerName: "Grace Ingabire",
    email: "grace.ingabire@ecowash.rw",
    phone: "+250 788 332 119",
    serviceType: "Installation of Decentralized Wastewater Treatment Systems",
    locationUrl: "https://www.google.com/maps?q=-1.9510,30.0720",
    appointmentDate: "2026-10-09",
    appointmentDateFormatted: "Friday, Oct 9, 2026",
    preferredTime: "Afternoon (12:00 PM - 4:00 PM)",
    referralSource: "Facebook",
    description: "Eco-friendly car wash wastewater reuse facility inspection.",
    status: "pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3
  },

  // Christian Karangwa (CLIENT - 1 completed via Twitter/X)
  {
    id: "bk-2026-701",
    customerName: "Christian Karangwa",
    email: "c.karangwa@rwandabiz.rw",
    phone: "+250 788 665 544",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9390,30.0550",
    appointmentDate: "2026-09-29",
    appointmentDateFormatted: "Tuesday, Sep 29, 2026",
    preferredTime: "Morning (8:00 AM - 12:00 PM)",
    referralSource: "Twitter (X)",
    description: "Office complex main sump cleanout.",
    status: "completed",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },

  // Alice Uwera (CANCELLED - 0 completed, 1 cancelled)
  {
    id: "bk-2026-801",
    customerName: "Alice Uwera",
    email: "alice.uwera@gmail.com",
    phone: "+250 788 777 222",
    serviceType: "Liquid Waste Collection and Transport",
    locationUrl: "https://www.google.com/maps?q=-1.9480,30.0650",
    appointmentDate: "2026-09-28",
    appointmentDateFormatted: "Monday, Sep 28, 2026",
    preferredTime: "Evening (4:00 PM - 7:00 PM)",
    referralSource: "WhatsApp / Direct Messaging",
    description: "Postponed residential vacuum truck service appointment.",
    status: "cancelled",
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 40
  }
];

/**
 * Gets cached bookings from localStorage
 */
export function getLocalBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_CACHE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Failed to read local bookings cache", e);
  }
  return [];
}

/**
 * Saves bookings to localStorage
 */
export function setLocalBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_BOOKINGS_CACHE_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.warn("Failed to write local bookings cache", e);
  }
}

// Shared singleton subscription to prevent duplicate WebChannel listen streams and avoid Firestore internal assertion collisions
let activeBookingsUnsubscribe: (() => void) | null = null;
const bookingSubscribers = new Set<(bookings: Booking[]) => void>();
let latestBookingsCache: Booking[] = [];

/**
 * Real-time listener for bookings collection with cache fallback and singleton stream management
 */
export function subscribeToBookings(onUpdate: (bookings: Booking[]) => void): () => void {
  // Deliver cached or seed data immediately for instant zero-lag render
  if (latestBookingsCache.length > 0) {
    onUpdate(latestBookingsCache);
  } else {
    const cached = getLocalBookings();
    const hasCache = typeof window !== 'undefined' && localStorage.getItem(LOCAL_BOOKINGS_CACHE_KEY) !== null;
    if (hasCache) {
      latestBookingsCache = cached;
      onUpdate(cached);
    } else if (typeof window !== 'undefined') {
      latestBookingsCache = SAMPLE_SEED_BOOKINGS;
      setLocalBookings(SAMPLE_SEED_BOOKINGS);
      onUpdate(SAMPLE_SEED_BOOKINGS);
    }
  }

  // Register this subscriber callback
  bookingSubscribers.add(onUpdate);

  // If already listening, don't create a second onSnapshot stream
  if (!activeBookingsUnsubscribe) {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION);
      const q = query(bookingsRef, orderBy("createdAt", "desc"));

      activeBookingsUnsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          latestBookingsCache = [];
          setLocalBookings([]);
          bookingSubscribers.forEach(cb => cb([]));
          return;
        }

        const list: Booking[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            customerName: data.customerName || '',
            email: data.email || '',
            phone: data.phone || '',
            serviceType: data.serviceType || '',
            locationUrl: data.locationUrl || '',
            appointmentDate: data.appointmentDate || '',
            appointmentDateFormatted: data.appointmentDateFormatted || data.appointmentDate || '',
            preferredTime: data.preferredTime || '',
            referralSource: data.referralSource || '',
            attribution: data.attribution || undefined,
            description: data.description || '',
            assignedMemberId: data.assignedMemberId || undefined,
            assignedMemberName: data.assignedMemberName || undefined,
            assignedMemberWebsite: data.assignedMemberWebsite || undefined,
            status: (data.status as BookingStatus) || 'pending',
            createdAt: typeof data.createdAt === 'number' ? data.createdAt : (data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now()),
            updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : (data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now())
          });
        });

        latestBookingsCache = list;
        setLocalBookings(list);
        bookingSubscribers.forEach(cb => cb(list));
      }, (error) => {
        console.warn("Firestore bookings listener subscription notice:", error);
      });
    } catch (err) {
      console.warn("Failed to initialize bookings subscription:", err);
    }
  }

  // Return unsubscribe handler for this specific component
  return () => {
    bookingSubscribers.delete(onUpdate);
    if (bookingSubscribers.size === 0 && activeBookingsUnsubscribe) {
      activeBookingsUnsubscribe();
      activeBookingsUnsubscribe = null;
    }
  };
}

/**
 * Creates and persists a new booking
 */
export async function createBookingRecord(input: BookingInput): Promise<Booking> {
  const now = Date.now();
  const newBooking: Booking = {
    ...input,
    id: `bk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: input.status || 'pending',
    createdAt: now,
    updatedAt: now
  };

  // 1. Immediately write to local cache
  const cached = getLocalBookings();
  const updatedList = [newBooking, ...cached.filter(b => b.id !== newBooking.id)];
  latestBookingsCache = updatedList;
  setLocalBookings(updatedList);

  // 2. Persist to Firestore
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      customerName: newBooking.customerName,
      email: newBooking.email,
      phone: newBooking.phone,
      serviceType: newBooking.serviceType,
      locationUrl: newBooking.locationUrl,
      appointmentDate: newBooking.appointmentDate,
      appointmentDateFormatted: newBooking.appointmentDateFormatted,
      preferredTime: newBooking.preferredTime,
      referralSource: newBooking.referralSource,
      attribution: newBooking.attribution || null,
      description: newBooking.description,
      assignedMemberId: newBooking.assignedMemberId || null,
      assignedMemberName: newBooking.assignedMemberName || null,
      assignedMemberWebsite: newBooking.assignedMemberWebsite || null,
      status: newBooking.status,
      createdAt: newBooking.createdAt,
      updatedAt: newBooking.updatedAt
    });

    // Update with Firestore ID if generated
    newBooking.id = docRef.id;
    const finalCached = updatedList.map(b => b.createdAt === now ? { ...b, id: docRef.id } : b);
    latestBookingsCache = finalCached;
    setLocalBookings(finalCached);
  } catch (err) {
    console.warn("Firestore booking create write warning (local cache preserved):", err);
  }

  return newBooking;
}

/**
 * Updates a booking's status
 */
export async function updateBookingStatusRecord(id: string, status: BookingStatus): Promise<boolean> {
  const now = Date.now();

  // 1. Update local cache
  const cached = getLocalBookings();
  let found = false;
  const updated = cached.map(b => {
    if (b.id === id) {
      found = true;
      return { ...b, status, updatedAt: now };
    }
    return b;
  });
  if (found) {
    latestBookingsCache = updated;
    setLocalBookings(updated);
  }

  // 2. Update Firestore
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      updatedAt: now
    });
    return true;
  } catch (err) {
    console.warn("Firestore status update warning:", err);
    return false;
  }
}

/**
 * Deletes a booking record
 */
export async function deleteBookingRecord(id: string): Promise<boolean> {
  // 1. Update local cache
  const cached = getLocalBookings();
  const filtered = cached.filter(b => b.id !== id);
  latestBookingsCache = filtered;
  setLocalBookings(filtered);

  // 2. Delete from Firestore
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn("Firestore booking delete warning:", err);
    return false;
  }
}

/**
 * Fallback direct fetcher for cloud functions / API
 */
export async function fetchAllBookingsDirect(): Promise<Booking[]> {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const list: Booking[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          customerName: data.customerName || '',
          email: data.email || '',
          phone: data.phone || '',
          serviceType: data.serviceType || '',
          locationUrl: data.locationUrl || '',
          appointmentDate: data.appointmentDate || '',
          appointmentDateFormatted: data.appointmentDateFormatted || data.appointmentDate || '',
          preferredTime: data.preferredTime || '',
          referralSource: data.referralSource || '',
          attribution: data.attribution || undefined,
          description: data.description || '',
          assignedMemberId: data.assignedMemberId || undefined,
          assignedMemberName: data.assignedMemberName || undefined,
          assignedMemberWebsite: data.assignedMemberWebsite || undefined,
          status: (data.status as BookingStatus) || 'pending',
          createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
          updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now()
        });
      });
      return list;
    }
  } catch (err) {
    console.warn("Direct fetch error:", err);
  }
  return getLocalBookings();
}
