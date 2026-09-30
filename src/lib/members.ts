import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from "firebase/firestore";
import { db } from "./firebase";

export interface MemberCompany {
  id: string;
  name: string;
  category: string;
  description: string;
  briefDescription?: string;
  websiteUrl: string;
  logoUrl?: string;
  phone: string;
  email: string;
  headquarters: string;
  fleet: string;
  services: string[];
  verified: boolean;
  active: boolean;
  establishedYear?: number;
  logoText?: string;
  updatedAt?: number;
}

export function generateCompanyLogoSvg(name: string, logoText?: string, bgColor: string = "#3b66b0"): string {
  const initials = (logoText || (name ? name.substring(0, 3) : "ASW")).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="grad_${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="#1e3a6e" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="28" fill="url(#grad_${initials})" />
    <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-dasharray="4 3"/>
    <text x="60" y="66" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" letter-spacing="1.5">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getMemberLogo(member: Partial<MemberCompany>): string {
  if (member.logoUrl && member.logoUrl.trim().length > 0) {
    return member.logoUrl;
  }
  return generateCompanyLogoSvg(member.name || "Member", member.logoText);
}

export const MEMBERS_COLLECTION = "member_companies";
export const LOCAL_MEMBERS_CACHE_KEY = "asserwa_member_companies_v3";

export const DEFAULT_MEMBER_COMPANIES: MemberCompany[] = [
  {
    id: "mem-kigali-septic",
    name: "Kigali Septic Service",
    category: "Vacuum Truck Haulage & Rapid Evacuation",
    description: "Premier sewage evacuation provider in Rwanda with modern vacuum trucks, high-capacity holding tanks, and 24/7 commercial emergency response.",
    briefDescription: "High-capacity vacuum truck evacuation and 24/7 emergency sewage pumping for commercial and residential facilities.",
    websiteUrl: "https://kigaliseptic.rw",
    logoUrl: generateCompanyLogoSvg("Kigali Septic Service", "KSS", "#3b66b0"),
    phone: "+250 788 312 940",
    email: "dispatch@kigaliseptic.rw",
    headquarters: "Nyarugenge, Kigali",
    fleet: "8 Heavy Vacuum Tankers (15,000L - 20,000L)",
    services: [
      "Liquid Waste Collection and Transport",
      "Commercial Holding Tank Evacuation",
      "Emergency 24/7 Pumping"
    ],
    verified: true,
    active: true,
    establishedYear: 2016,
    logoText: "KSS"
  },
  {
    id: "mem-nganila",
    name: "Nganila Co LTD",
    category: "Decentralized Wastewater Treatment Systems",
    description: "Engineering-grade sewage infrastructure contractor specializing in activated sludge bio-digesters, clean water recycling, and institutional wastewater facilities.",
    briefDescription: "Engineered wastewater bio-digesters, clean water treatment recycling, and institutional drainage infrastructure.",
    websiteUrl: "https://nganilagroup.rw",
    logoUrl: generateCompanyLogoSvg("Nganila Co LTD", "NGL", "#1e3a8a"),
    phone: "+250 788 450 120",
    email: "info@nganilagroup.rw",
    headquarters: "Kicukiro, Kigali",
    fleet: "5 Vacuum Tankers & Treatment Unit Transport",
    services: [
      "Installation of Decentralized Wastewater Treatment Systems",
      "Maintenance & Consultancy",
      "Industrial Waste Logistics"
    ],
    verified: true,
    active: true,
    establishedYear: 2018,
    logoText: "NGL"
  },
  {
    id: "mem-sanity-rwanda",
    name: "Sanity Rwanda",
    category: "Eco-Friendly Sanitation & Clean Water Recycling",
    description: "Sustainable sanitation enterprise delivering scheduled quarterly maintenance, greywater filtration, and hospital hygiene solutions.",
    briefDescription: "Eco-friendly hospital and residential sanitation maintenance, greywater filtration, and bio-waste treatment.",
    websiteUrl: "https://sanityrwanda.com",
    logoUrl: generateCompanyLogoSvg("Sanity Rwanda", "SRW", "#059669"),
    phone: "+250 785 220 900",
    email: "contact@sanityrwanda.com",
    headquarters: "Gasabo, Kigali",
    fleet: "6 Vacuum Units & Mobile Sludge Testing Kits",
    services: [
      "Maintenance & Consultancy",
      "Liquid Waste Collection and Transport",
      "Sanitation Projects and Partnerships"
    ],
    verified: true,
    active: true,
    establishedYear: 2019,
    logoText: "SRW"
  },
  {
    id: "mem-kadja",
    name: "Kadja Business LTD",
    category: "Commercial & Industrial Wastewater Logistics",
    description: "High-volume wastewater haulage serving schools, hotels, industrial zones, and manufacturing campuses across Kigali and the Eastern Province.",
    briefDescription: "Bulk wastewater transport and exhauster haulage for hotels, schools, manufacturing hubs, and industrial zones.",
    websiteUrl: "https://kadjabusiness.rw",
    logoUrl: generateCompanyLogoSvg("Kadja Business LTD", "KBL", "#4338ca"),
    phone: "+250 788 678 333",
    email: "operations@kadjabusiness.rw",
    headquarters: "Kicukiro, Kigali",
    fleet: "7 High-capacity Exhauster Trucks",
    services: [
      "Liquid Waste Collection and Transport",
      "Industrial Sludge Transport",
      "Quarterly Maintenance Service"
    ],
    verified: true,
    active: true,
    establishedYear: 2017,
    logoText: "KBL"
  },
  {
    id: "mem-sewage-septic",
    name: "Sewage Septic Services",
    category: "Municipal Waste Emptiers & Treatment Logistics",
    description: "Fully certified emptier operating under City of Kigali and RURA sanitation mandates for residential estates and multi-story commercial facilities.",
    briefDescription: "City of Kigali certified septic emptying, high-pressure jetting, and drain clearing for residential estates.",
    websiteUrl: "https://sewageseptic.rw",
    logoUrl: generateCompanyLogoSvg("Sewage Septic Services", "SSS", "#0284c7"),
    phone: "+250 788 901 234",
    email: "support@sewageseptic.rw",
    headquarters: "Nyarugenge, Kigali",
    fleet: "4 High-pressure Jetting & Vacuum Trucks",
    services: [
      "Liquid Waste Collection and Transport",
      "Septic Desnagging & Drain Clearing"
    ],
    verified: true,
    active: true,
    establishedYear: 2015,
    logoText: "SSS"
  },
  {
    id: "mem-pit-vidura",
    name: "Pit Vidura",
    category: "Dense Urban & Inaccessible Sludge Evacuation",
    description: "Award-winning specialist in dense urban settlements and hard-to-reach pit latrines using specialized semi-mechanized portable evacuation pumps.",
    briefDescription: "Pioneering specialized portable sludge evacuation for high-density informal settlements and narrow terrains.",
    websiteUrl: "https://pitvidura.com",
    logoUrl: generateCompanyLogoSvg("Pit Vidura", "PVD", "#0d9488"),
    phone: "+250 788 112 244",
    email: "hello@pitvidura.com",
    headquarters: "Gasabo, Kigali",
    fleet: "3 Mobile Sludge Tanks & Portable Evacuators",
    services: [
      "Liquid Waste Collection and Transport",
      "Sanitation Projects and Partnerships",
      "Community Sanitation Operations"
    ],
    verified: true,
    active: true,
    establishedYear: 2016,
    logoText: "PVD"
  },
  {
    id: "mem-sanex",
    name: "SANEX COMPANY LTD",
    category: "Integrated Environmental & Wastewater Engineering",
    description: "High-pressure pipe jetting, sewage desnagging, vacuum emptying, and environmental impact assessments for large institutional campuses.",
    briefDescription: "Comprehensive pipe inspection cameras, high-pressure sewer jetting, and institutional wastewater engineering.",
    websiteUrl: "https://sanexrwanda.com",
    logoUrl: generateCompanyLogoSvg("SANEX COMPANY LTD", "SNX", "#2563eb"),
    phone: "+250 788 776 543",
    email: "info@sanexrwanda.com",
    headquarters: "Kicukiro, Kigali",
    fleet: "6 Vacuum Trucks & Pipe Inspection Cameras",
    services: [
      "Liquid Waste Collection and Transport",
      "Installation of Decentralized Wastewater Treatment Systems",
      "Maintenance & Consultancy"
    ],
    verified: true,
    active: true,
    establishedYear: 2020,
    logoText: "SNX"
  },
  {
    id: "mem-camel-motor",
    name: "Camel Motor Group Ltd",
    category: "Heavy Vehicle Fleet Transport & Sanitation Logistics",
    description: "Extensive heavy fleet logistics carrying massive bulk liquid waste across Kigali, Southern, and Northern provinces with GPS fleet telematics.",
    briefDescription: "Heavy vehicle bulk wastewater logistics and inter-provincial liquid transport with GPS telematics monitoring.",
    websiteUrl: "https://camelmotorgroup.rw",
    logoUrl: generateCompanyLogoSvg("Camel Motor Group Ltd", "CMG", "#b45309"),
    phone: "+250 788 998 811",
    email: "dispatch@camelmotorgroup.rw",
    headquarters: "Gasabo, Kigali",
    fleet: "10 Vacuum Haulers (Up to 25,000L)",
    services: [
      "Liquid Waste Collection and Transport",
      "Bulk Wastewater Provincial Haulage"
    ],
    verified: true,
    active: true,
    establishedYear: 2014,
    logoText: "CMG"
  },
  {
    id: "mem-kanguka",
    name: "Kanguka Business Company Ltd",
    category: "Residential Septic Drainage & Treatment",
    description: "Affordable domestic sewage pumping, grease trap maintenance, and scheduled household tank draining with rapid dispatch times.",
    briefDescription: "Fast, reliable household septic emptying, grease trap clearing, and neighborhood sanitation drainage.",
    websiteUrl: "https://kanguka-business.rw",
    logoUrl: generateCompanyLogoSvg("Kanguka Business Company Ltd", "KBC", "#15803d"),
    phone: "+250 788 443 322",
    email: "service@kanguka-business.rw",
    headquarters: "Nyarugenge, Kigali",
    fleet: "4 Vacuum Trucks",
    services: [
      "Liquid Waste Collection and Transport",
      "Residential Septic Draining"
    ],
    verified: true,
    active: true,
    establishedYear: 2019,
    logoText: "KBC"
  },
  {
    id: "mem-dachris",
    name: "Dachris Company Ltd",
    category: "Quarterly Maintenance & Bio-Enzymatic Treatments",
    description: "Routine scheduled inspections, bacterial enzyme treatments, and septic odor suppression for hotels, guest houses, and commercial facilities.",
    briefDescription: "Bio-enzymatic bacterial tank conditioning, odor neutralizers, and quarterly commercial service contracts.",
    websiteUrl: "https://dachris.rw",
    logoUrl: generateCompanyLogoSvg("Dachris Company Ltd", "DCL", "#4b5563"),
    phone: "+250 788 554 433",
    email: "info@dachris.rw",
    headquarters: "Kicukiro, Kigali",
    fleet: "3 Vacuum Trucks & Bio-Chemical Delivery Units",
    services: [
      "Maintenance & Consultancy",
      "Sanitation Projects and Partnerships"
    ],
    verified: true,
    active: true,
    establishedYear: 2021,
    logoText: "DCL"
  },
  {
    id: "mem-sima-vidura",
    name: "Sima Vidura",
    category: "Urban Sanitation Pumping & Sludge Transfer",
    description: "Citywide vacuum pumping services collaborating with district authorities for clean, hygienic public and private sanitation facilities.",
    briefDescription: "District-level municipal sludge transfers and licensed sanitation disposal operations across urban sectors.",
    websiteUrl: "https://simavidura.rw",
    logoUrl: generateCompanyLogoSvg("Sima Vidura", "SVD", "#0369a1"),
    phone: "+250 788 665 544",
    email: "operations@simavidura.rw",
    headquarters: "Gasabo, Kigali",
    fleet: "4 Vacuum Haulers",
    services: [
      "Liquid Waste Collection and Transport",
      "Sanitation Projects and Partnerships"
    ],
    verified: true,
    active: true,
    establishedYear: 2018,
    logoText: "SVD"
  },
  {
    id: "mem-midas",
    name: "Midas Spare Parts and Service Ltd",
    category: "Sanitation Vehicle Fleet Maintenance & Overhaul",
    description: "Specialized vacuum pump repairs, tanker parts, pressure valve overhauls, and mobile emergency breakdown support for all ASSERWA members.",
    briefDescription: "Specialized vacuum pump rebuilds, high-pressure valves, tanker fleet spare parts, and roadside mechanic dispatch.",
    websiteUrl: "https://midas-sanitation.rw",
    logoUrl: generateCompanyLogoSvg("Midas Spare Parts and Service Ltd", "MSS", "#6b21a8"),
    phone: "+250 788 223 344",
    email: "parts@midas-sanitation.rw",
    headquarters: "Nyarugenge, Kigali",
    fleet: "2 Mobile Mechanical Units & 1 Vacuum Tanker",
    services: [
      "Maintenance & Consultancy",
      "Sanitation Projects and Partnerships"
    ],
    verified: true,
    active: true,
    establishedYear: 2017,
    logoText: "MSS"
  }
];

// Helper to retrieve members from local cache
export function getLocalMemberCompanies(): MemberCompany[] {
  if (typeof window === "undefined") return DEFAULT_MEMBER_COMPANIES;
  try {
    const raw = localStorage.getItem(LOCAL_MEMBERS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Initialize cache
    localStorage.setItem(LOCAL_MEMBERS_CACHE_KEY, JSON.stringify(DEFAULT_MEMBER_COMPANIES));
    return DEFAULT_MEMBER_COMPANIES;
  } catch (e) {
    return DEFAULT_MEMBER_COMPANIES;
  }
}

// Helper to save member companies to local cache
export function setLocalMemberCompanies(members: MemberCompany[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_MEMBERS_CACHE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error("Failed to save member companies to local cache:", e);
  }
}

// Real-time Firestore subscriber with dual-write resilience
export function subscribeToMemberCompanies(callback: (members: MemberCompany[]) => void): () => void {
  // Emit local cache immediately
  const localData = getLocalMemberCompanies();
  callback(localData);

  let unsubscribe = () => {};

  try {
    const colRef = collection(db, MEMBERS_COLLECTION);
    unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudMembers: MemberCompany[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudMembers.push({
              id: docSnap.id,
              name: data.name || "Member Company",
              category: data.category || "Sanitation Provider",
              description: data.description || "",
              briefDescription: data.briefDescription || (data.description ? data.description.substring(0, 120) : ""),
              websiteUrl: data.websiteUrl || "#",
              logoUrl: data.logoUrl || generateCompanyLogoSvg(data.name || "Member", data.logoText),
              phone: data.phone || "",
              email: data.email || "",
              headquarters: data.headquarters || "Kigali, Rwanda",
              fleet: data.fleet || "Vacuum Truck Hauler",
              services: Array.isArray(data.services) ? data.services : ["Liquid Waste Collection and Transport"],
              verified: data.verified !== false,
              active: data.active !== false,
              establishedYear: data.establishedYear,
              logoText: data.logoText || (data.name ? data.name.substring(0, 3).toUpperCase() : "MEM"),
              updatedAt: data.updatedAt || Date.now()
            });
          });

          // Sort alphabetically by name
          cloudMembers.sort((a, b) => a.name.localeCompare(b.name));
          setLocalMemberCompanies(cloudMembers);
          callback(cloudMembers);
        } else {
          setLocalMemberCompanies([]);
          callback([]);
        }
      },
      (error) => {
        console.warn("Firestore member companies listener notice; utilizing active local cache:", error);
        callback(localData);
      }
    );
  } catch (err) {
    console.warn("Firestore initialization notice for member companies:", err);
    callback(localData);
  }

  return unsubscribe;
}

// Seed default members to Firestore if empty
async function seedDefaultMemberCompaniesToFirestore() {
  try {
    for (const mem of DEFAULT_MEMBER_COMPANIES) {
      const docRef = doc(db, MEMBERS_COLLECTION, mem.id);
      await setDoc(docRef, { ...mem, updatedAt: Date.now() }, { merge: true });
    }
  } catch (e) {
    console.warn("Notice: Member companies seeded to local cache; cloud sync standby.");
  }
}

// Save or Update a Member Company
export async function saveMemberCompanyRecord(member: MemberCompany): Promise<boolean> {
  const localList = getLocalMemberCompanies();
  const existingIdx = localList.findIndex(m => m.id === member.id);
  let updatedList: MemberCompany[];

  const updatedMember: MemberCompany = {
    ...member,
    logoText: member.logoText || member.name.substring(0, 3).toUpperCase(),
    updatedAt: Date.now()
  };

  if (existingIdx >= 0) {
    updatedList = [...localList];
    updatedList[existingIdx] = updatedMember;
  } else {
    updatedList = [updatedMember, ...localList];
  }

  // Update local cache immediately
  setLocalMemberCompanies(updatedList);

  // Sync to Firestore
  try {
    const docRef = doc(db, MEMBERS_COLLECTION, member.id);
    await setDoc(docRef, updatedMember, { merge: true });
  } catch (e) {
    console.warn("Firestore member update failed:", e);
    return false;
  }

  return true;
}

// Delete a Member Company
export async function deleteMemberCompanyRecord(id: string): Promise<boolean> {
  const localList = getLocalMemberCompanies();
  const filtered = localList.filter(m => m.id !== id);
  setLocalMemberCompanies(filtered);

  try {
    const docRef = doc(db, MEMBERS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore member delete failed:", e);
    return false;
  }

  return true;
}

// Toggle Member Visibility (Show / Hide)
export async function toggleMemberVisibility(id: string): Promise<boolean> {
  const localList = getLocalMemberCompanies();
  const target = localList.find(m => m.id === id);
  if (!target) return false;

  const newActiveState = target.active === false ? true : false;
  const updatedTarget: MemberCompany = {
    ...target,
    active: newActiveState,
    updatedAt: Date.now()
  };

  return saveMemberCompanyRecord(updatedTarget);
}

// Direct fetch fallback
export async function fetchAllMemberCompaniesDirect(): Promise<MemberCompany[]> {
  try {
    const colRef = collection(db, MEMBERS_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const members: MemberCompany[] = [];
      snap.forEach(d => {
        members.push({ id: d.id, ...d.data() } as MemberCompany);
      });
      members.sort((a, b) => a.name.localeCompare(b.name));
      setLocalMemberCompanies(members);
      return members;
    }
  } catch (e) {
    // fallback
  }
  return getLocalMemberCompanies();
}
