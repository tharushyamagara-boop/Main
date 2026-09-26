'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveContentToFirestore, subscribeToFirestoreContent } from '@/lib/firebase';

export type SlideshowItem = {
  id: string;
  title: string;
  titleHighlight: string;
  description: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
};

export type GalleryItem = {
  id: string;
  description: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tag: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
};

export type NavMenuItem = {
  id: string;
  name: string;
  href: string;
  visible: boolean;
  isBadge?: boolean;
};

export const defaultNavMenuItems: NavMenuItem[] = [
  { id: 'menu-home', name: 'HOME', href: '/', visible: true },
  { id: 'menu-about', name: 'ABOUT US', href: '/about', visible: true },
  { id: 'menu-objectives', name: 'OBJECTIVES', href: '/compliance', visible: true },
  { id: 'menu-services', name: 'SERVICES', href: '/services', visible: true },
  { id: 'menu-members', name: 'MEMBER NETWORK', href: '/dashboard', visible: true },
  { id: 'menu-resources', name: 'RESOURCES', href: '/resources', visible: true },
  { id: 'menu-news', name: 'ADVOCACY & NEWS', href: '/news', visible: true },
  { id: 'menu-gallery', name: 'GALLERY', href: '/gallery', visible: true },
  { id: 'menu-symposium', name: 'SYMPOSIUM 2026', href: '/register', visible: true, isBadge: true },
  { id: 'menu-contact', name: 'CONTACT', href: '/contact', visible: true },
];

// Default Brochure Data Constants
export const defaultSlideshows: SlideshowItem[] = [
  {
    id: 'slide-1',
    title: "Advancing Rwanda's ",
    titleHighlight: "Hygiene & Sanitation",
    description: "Let us work together to promote hygiene, sanitation, and environmental protection.",
    imageUrl: "",
    mediaType: 'image'
  },
  {
    id: 'slide-2',
    title: "Professionalizing ",
    titleHighlight: "Sanitation Service Providers",
    description: "ASSERWA brings together sewage emptiers and sanitation practitioners in Rwanda to protect public health and safeguard the environment.",
    imageUrl: "",
    mediaType: 'image'
  },
  {
    id: 'slide-3',
    title: "Safeguarding Our ",
    titleHighlight: "Environment & Community Health",
    description: "Advocating for proper operation, maintenance, and construction of sanitation infrastructure across all provinces.",
    imageUrl: "",
    mediaType: 'image'
  }
];

export const defaultAboutUs = {
  headerTag: "Official Profile",
  title: "Who is ASSERWA?",
  description: "ASSERWA (Forum of Sewage Emptiers in Rwanda) is a non-governmental organization that brings together sewage emptiers and sanitation service providers in Rwanda.",
  mission: "To promote a culture of hygiene and sanitation among members and the wider community.",
  objectiveScope: "The organization works to improve sanitation services, protect public health, and safeguard the environment across all provinces of Rwanda.",
  imageUrl: ""
};

export const defaultObjectives = [
  {
    id: 'obj-1',
    title: "Environmental & Hygiene Promotion",
    color: "#6cb166",
    points: [
      "Promote environmental protection and sanitation practices.",
      "Promote hygiene and sanitation activities that improve the health and well-being of members and communities."
    ]
  },
  {
    id: 'obj-2',
    title: "Professional Development",
    color: "#3b66b0",
    points: [
      "Promote high professional standards among sewage emptiers and sanitation workers."
    ]
  },
  {
    id: 'obj-3',
    title: "Multi-Level Advocacy",
    color: "#6cb166",
    points: [
      "National government institutions advocacy.",
      "Local government institutions advocacy.",
      "Non-government stakeholders and partners representation."
    ]
  },
  {
    id: 'obj-4',
    title: "Sanitation Infrastructure",
    color: "#3b66b0",
    points: [
      "Advocate for the construction of toilets and sanitation facilities.",
      "Promote proper operation and maintenance of toilets and sanitation infrastructure."
    ]
  }
];

export const defaultServices = [
  {
    id: 'srv-1',
    title: "Environmental & Hygiene Promotion",
    description: "Promoting environmental protection, sanitation practices, and community hygiene to improve health and well-being.",
    link: "/compliance",
    cta: "View Objectives"
  },
  {
    id: 'srv-2',
    title: "Professional Development",
    description: "Promoting high professional standards among sewage emptiers and sanitation workers across Rwanda.",
    link: "/about",
    cta: "Learn More"
  },
  {
    id: 'srv-3',
    title: "Institutional Advocacy",
    description: "Advocating for sanitation practitioners at national government institutions, local government bodies, and non-government stakeholders.",
    link: "/contact",
    cta: "Partner With Us"
  },
  {
    id: 'srv-[#3b66b0]',
    title: "Sanitation Infrastructure",
    description: "Advocating for toilet construction and promoting proper operation and maintenance of sanitation facilities.",
    link: "/dashboard",
    cta: "View Member Network"
  }
];

export const defaultMemberNetwork = [
  {
    region: "Official Member Companies",
    description: "Full roster of ASSERWA certified member companies and sanitation service providers in Rwanda",
    companies: [
      "Kigali Septic Service",
      "Nganila Co LTD",
      "Kadja Business LTD",
      "Sanity Rwanda",
      "Sewage septic services",
      "Kanguka Business company Ltd",
      "Dachris company Ltd",
      "Sima Vidura",
      "Camel Motor Group Ltd",
      "Pit Vidura",
      "SANEX COMPANY LTD",
      "Midas Spare parts and Service Ltd",
      "Certified Company"
    ]
  }
];

export const defaultResources = [
  {
    id: 'res-1',
    title: "Sanitation & Hygiene Guidelines",
    type: "Regulation",
    size: "4.2 MB",
    description: "Official guidelines for sewage management, hygiene promotion, and environmental protection in Rwanda."
  },
  {
    id: 'res-2',
    title: "Toilet Maintenance & Operations Manual",
    type: "Technical Guide",
    size: "8.1 MB",
    description: "Operational standards for toilet construction, safe fecal sludge handling, and facility maintenance."
  },
  {
    id: 'res-3',
    title: "Environmental Protection Standard",
    type: "Report",
    size: "5.5 MB",
    description: "Frameworks safeguarding public health and water sources from untreated wastewater."
  },
  {
    id: 'res-4',
    title: "ASSERWA Organizational Charter",
    type: "Policy",
    size: "1.5 MB",
    description: "Code of professional standards and ethics for all member sewage emptiers in Rwanda."
  }
];

export const defaultNews: NewsItem[] = [
  {
    id: 'news-1',
    title: "ASSERWA Conducts Regional Sanitation & Hygiene Workshop",
    excerpt: "Promoting high professional standards among sewage emptiers and sanitation practitioners in Rwanda.",
    date: "May 24, 2024",
    author: "ASSERWA Secretariat",
    tag: "Advocacy",
    imageUrl: "",
    mediaType: 'image'
  },
  {
    id: 'news-2',
    title: "Promoting Toilet Construction & Facility Maintenance",
    excerpt: "Workshops focusing on infrastructure maintenance and environmental protection in communities.",
    date: "June 12, 2024",
    author: "ASSERWA Secretariat",
    tag: "Infrastructure",
    imageUrl: "",
    mediaType: 'image'
  },
  {
    id: 'news-3',
    title: "Multi-Level Stakeholder Advocacy Engagement",
    excerpt: "Advocating for sewage emptiers at national and local government institutions across provinces.",
    date: "June 05, 2024",
    author: "ASSERWA Secretariat",
    tag: "Community",
    imageUrl: "",
    mediaType: 'image'
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    description: "Modern Waste Treatment & Infrastructure Inspection",
    imageUrl: ""
  },
  {
    id: 'gal-2',
    description: "Environmental Safety & Field Compliance Verification",
    imageUrl: ""
  },
  {
    id: 'gal-3',
    description: "ASSERWA Operational Headquarters & Administration",
    imageUrl: ""
  },
  {
    id: 'gal-4',
    description: "National Stakeholder & Partner Policy Consultation",
    imageUrl: ""
  },
  {
    id: 'gal-5',
    description: "Standardized Equipment & Health Protocols Verification",
    imageUrl: ""
  },
  {
    id: 'gal-6',
    description: "Community Hygiene & District Outreach Program",
    imageUrl: ""
  }
];

export const defaultContactInfo = {
  address: "Irembo House, Gishushu Road, Nyarutarama Village, Rukiri Cell / Public Cell, Remera Sector, Gasabo District, Kigali City, Rwanda",
  phone: "+250 784 246 216",
  email: "asserwarwanda@gmail.com"
};

type ContentStoreContextType = {
  slideshows: typeof defaultSlideshows;
  aboutUs: typeof defaultAboutUs;
  objectives: typeof defaultObjectives;
  services: typeof defaultServices;
  memberNetwork: typeof defaultMemberNetwork;
  resources: typeof defaultResources;
  news: typeof defaultNews;
  gallery: typeof defaultGallery;
  contactInfo: typeof defaultContactInfo;
  navMenuItems: NavMenuItem[];
  
  setSlideshows: React.Dispatch<React.SetStateAction<typeof defaultSlideshows>>;
  setAboutUs: React.Dispatch<React.SetStateAction<typeof defaultAboutUs>>;
  setObjectives: React.Dispatch<React.SetStateAction<typeof defaultObjectives>>;
  setServices: React.Dispatch<React.SetStateAction<typeof defaultServices>>;
  setMemberNetwork: React.Dispatch<React.SetStateAction<typeof defaultMemberNetwork>>;
  setResources: React.Dispatch<React.SetStateAction<typeof defaultResources>>;
  setNews: React.Dispatch<React.SetStateAction<typeof defaultNews>>;
  setGallery: React.Dispatch<React.SetStateAction<typeof defaultGallery>>;
  setContactInfo: React.Dispatch<React.SetStateAction<typeof defaultContactInfo>>;
  setNavMenuItems: React.Dispatch<React.SetStateAction<NavMenuItem[]>>;

  toggleMenuVisibility: (id: string) => void;
  updateMenuItem: (id: string, updates: Partial<NavMenuItem>) => void;
  addMenuItem: (item: Omit<NavMenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  reorderMenuItems: (fromIndex: number, toIndex: number) => void;
  resetNavMenuItems: () => void;
  resetToDefaults: () => void;
};

const ContentStoreContext = createContext<ContentStoreContextType | undefined>(undefined);

const STORAGE_KEY = 'asserwa_cms_content_v4';

const cleanUnsplashUrl = (url: string) => {
  if (url && url.includes("images.unsplash.com")) return "";
  return url || "";
};

const sanitizeItems = <T extends { imageUrl?: string }>(items: T[]): T[] => {
  return items.map(item => ({
    ...item,
    imageUrl: cleanUnsplashUrl(item.imageUrl || "")
  }));
};

const mergeNavMenuItems = (savedItems: any[]): NavMenuItem[] => {
  if (!Array.isArray(savedItems)) return defaultNavMenuItems;

  const loadedMap = new Map<string, any>();
  savedItems.forEach(item => {
    if (item && typeof item === 'object') {
      if (item.id) loadedMap.set(item.id, item);
      if (item.href) loadedMap.set(item.href, item);
    }
  });

  const mergedDefaults = defaultNavMenuItems.map(def => {
    const saved = loadedMap.get(def.id) || loadedMap.get(def.href);
    if (!saved) return def;
    return {
      ...def,
      name: typeof saved.name === 'string' && saved.name.trim() ? saved.name : def.name,
      visible: typeof saved.visible === 'boolean' ? saved.visible : true,
      isBadge: typeof saved.isBadge === 'boolean' ? saved.isBadge : def.isBadge
    };
  });

  const customItems: NavMenuItem[] = savedItems.filter((item: any) => 
    item && item.id && !defaultNavMenuItems.some(def => def.id === item.id || def.href === item.href)
  ).map((item: any) => ({
    id: item.id || `menu-${Date.now()}`,
    name: item.name || 'Menu Item',
    href: item.href || '/',
    visible: typeof item.visible === 'boolean' ? item.visible : true,
    isBadge: Boolean(item.isBadge)
  }));

  return [...mergedDefaults, ...customItems];
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [slideshows, setSlideshows] = useState(defaultSlideshows);
  const [aboutUs, setAboutUs] = useState(defaultAboutUs);
  const [objectives, setObjectives] = useState(defaultObjectives);
  const [services, setServices] = useState(defaultServices);
  const [memberNetwork, setMemberNetwork] = useState(defaultMemberNetwork);
  const [resources, setResources] = useState(defaultResources);
  const [news, setNews] = useState(defaultNews);
  const [gallery, setGallery] = useState(defaultGallery);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [navMenuItems, setNavMenuItems] = useState<NavMenuItem[]>(defaultNavMenuItems);

  const toggleMenuVisibility = (id: string) => {
    setNavMenuItems(prev => prev.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
  };

  const updateMenuItem = (id: string, updates: Partial<NavMenuItem>) => {
    setNavMenuItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const addMenuItem = (item: Omit<NavMenuItem, 'id'>) => {
    const newItem: NavMenuItem = {
      ...item,
      id: `menu-custom-${Date.now()}`
    };
    setNavMenuItems(prev => [...prev, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    setNavMenuItems(prev => prev.filter(m => m.id !== id));
  };

  const reorderMenuItems = (fromIndex: number, toIndex: number) => {
    setNavMenuItems(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const resetNavMenuItems = () => {
    setNavMenuItems(defaultNavMenuItems);
  };

  // Load from localStorage on mount & subscribe to live Firebase Cloud Firestore updates
  useEffect(() => {
    const loadStore = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || 
                      localStorage.getItem('assserva_cms_content_v4') || 
                      localStorage.getItem('assserva_cms_content_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.slideshows)) setSlideshows(sanitizeItems(parsed.slideshows));
          if (parsed.aboutUs) setAboutUs({ ...parsed.aboutUs, imageUrl: cleanUnsplashUrl(parsed.aboutUs.imageUrl) });
          if (parsed.objectives) setObjectives(parsed.objectives);
          if (parsed.services) setServices(parsed.services);
          if (parsed.memberNetwork) setMemberNetwork(parsed.memberNetwork);
          if (parsed.resources) setResources(parsed.resources);
          if (Array.isArray(parsed.news)) setNews(sanitizeItems(parsed.news));
          if (Array.isArray(parsed.gallery)) setGallery(sanitizeItems(parsed.gallery));
          if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
          if (Array.isArray(parsed.navMenuItems)) {
            setNavMenuItems(mergeNavMenuItems(parsed.navMenuItems));
          }
        }
      } catch (e) {
        console.error("Error reading cms store from localStorage", e);
      }
    };

    loadStore();

    // Live subscription to Firebase Cloud Firestore database
    const unsubscribe = subscribeToFirestoreContent((data) => {
      if (!data) return;
      if (Array.isArray(data.slideshows)) setSlideshows(sanitizeItems(data.slideshows));
      if (data.aboutUs) setAboutUs({ ...data.aboutUs, imageUrl: cleanUnsplashUrl(data.aboutUs.imageUrl) });
      if (data.objectives) setObjectives(data.objectives);
      if (data.services) setServices(data.services);
      if (data.memberNetwork) setMemberNetwork(data.memberNetwork);
      if (data.resources) setResources(data.resources);
      if (Array.isArray(data.news)) setNews(sanitizeItems(data.news));
      if (Array.isArray(data.gallery)) setGallery(sanitizeItems(data.gallery));
      if (data.contactInfo) setContactInfo(data.contactInfo);
      if (Array.isArray(data.navMenuItems)) {
        setNavMenuItems(mergeNavMenuItems(data.navMenuItems));
      }

      // Save remote Firestore snapshot to local cache
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {}
    });

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === 'assserva_cms_content_v4') {
        loadStore();
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const resetToDefaults = () => {
    setSlideshows(defaultSlideshows);
    setAboutUs(defaultAboutUs);
    setObjectives(defaultObjectives);
    setServices(defaultServices);
    setMemberNetwork(defaultMemberNetwork);
    setResources(defaultResources);
    setNews(defaultNews);
    setGallery(defaultGallery);
    setContactInfo(defaultContactInfo);
    setNavMenuItems(defaultNavMenuItems);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ContentStoreContext.Provider
      value={{
        slideshows,
        aboutUs,
        objectives,
        services,
        memberNetwork,
        resources,
        news,
        gallery,
        contactInfo,
        navMenuItems,
        setSlideshows,
        setAboutUs,
        setObjectives,
        setServices,
        setMemberNetwork,
        setResources,
        setNews,
        setGallery,
        setContactInfo,
        setNavMenuItems,
        toggleMenuVisibility,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        reorderMenuItems,
        resetNavMenuItems,
        resetToDefaults
      }}
    >
      {children}
    </ContentStoreContext.Provider>
  );
}

export function useContentStore() {
  const context = useContext(ContentStoreContext);
  if (!context) {
    throw new Error('useContentStore must be used within a ContentProvider');
  }
  return context;
}
