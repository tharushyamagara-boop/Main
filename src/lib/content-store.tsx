'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Default Brochure Data Constants
export const defaultSlideshows: SlideshowItem[] = [
  {
    id: 'slide-1',
    title: "Advancing Rwanda's ",
    titleHighlight: "Hygiene & Sanitation",
    description: "Let us work together to promote hygiene, sanitation, and environmental protection.",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80",
    mediaType: 'image'
  },
  {
    id: 'slide-2',
    title: "Professionalizing ",
    titleHighlight: "Sanitation Service Providers",
    description: "ASSERWA brings together sewage emptiers and sanitation practitioners in Rwanda to protect public health and safeguard the environment.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    mediaType: 'image'
  },
  {
    id: 'slide-3',
    title: "Safeguarding Our ",
    titleHighlight: "Environment & Community Health",
    description: "Advocating for proper operation, maintenance, and construction of sanitation infrastructure across all provinces.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    mediaType: 'image'
  }
];

export const defaultAboutUs = {
  headerTag: "Official Profile",
  title: "Who is ASSERWA?",
  description: "ASSERWA (Association of Sewage Emptiers in Rwanda) is a non-governmental organization that brings together sewage emptiers and sanitation service providers in Rwanda.",
  mission: "To promote a culture of hygiene and sanitation among members and the wider community.",
  objectiveScope: "The organization works to improve sanitation services, protect public health, and safeguard the environment across all provinces of Rwanda.",
  imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
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
      "SANEX COMPANY LTD"
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
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    mediaType: 'image'
  },
  {
    id: 'news-2',
    title: "Promoting Toilet Construction & Facility Maintenance",
    excerpt: "Workshops focusing on infrastructure maintenance and environmental protection in communities.",
    date: "June 12, 2024",
    author: "ASSERWA Secretariat",
    tag: "Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    mediaType: 'image'
  },
  {
    id: 'news-3',
    title: "Multi-Level Stakeholder Advocacy Engagement",
    excerpt: "Advocating for sewage emptiers at national and local government institutions across provinces.",
    date: "June 05, 2024",
    author: "ASSERWA Secretariat",
    tag: "Community",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    mediaType: 'image'
  }
];

export const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    description: "Modern Waste Treatment & Infrastructure Inspection",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'gal-2',
    description: "Environmental Safety & Field Compliance Verification",
    imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'gal-3',
    description: "ASSERWA Operational Headquarters & Administration",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'gal-4',
    description: "National Stakeholder & Partner Policy Consultation",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'gal-5',
    description: "Standardized Equipment & Health Protocols Verification",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'gal-6',
    description: "Community Hygiene & District Outreach Program",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80"
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
  
  setSlideshows: React.Dispatch<React.SetStateAction<typeof defaultSlideshows>>;
  setAboutUs: React.Dispatch<React.SetStateAction<typeof defaultAboutUs>>;
  setObjectives: React.Dispatch<React.SetStateAction<typeof defaultObjectives>>;
  setServices: React.Dispatch<React.SetStateAction<typeof defaultServices>>;
  setMemberNetwork: React.Dispatch<React.SetStateAction<typeof defaultMemberNetwork>>;
  setResources: React.Dispatch<React.SetStateAction<typeof defaultResources>>;
  setNews: React.Dispatch<React.SetStateAction<typeof defaultNews>>;
  setGallery: React.Dispatch<React.SetStateAction<typeof defaultGallery>>;
  setContactInfo: React.Dispatch<React.SetStateAction<typeof defaultContactInfo>>;
  
  resetToDefaults: () => void;
};

const ContentStoreContext = createContext<ContentStoreContextType | undefined>(undefined);

const STORAGE_KEY = 'asserwa_cms_content_v4';

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

  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount and listen for storage sync events live
  useEffect(() => {
    const loadStore = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || 
                      localStorage.getItem('assserva_cms_content_v4') || 
                      localStorage.getItem('assserva_cms_content_v3');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.slideshows)) setSlideshows(parsed.slideshows);
          if (parsed.aboutUs) setAboutUs(parsed.aboutUs);
          if (parsed.objectives) setObjectives(parsed.objectives);
          if (parsed.services) setServices(parsed.services);
          if (parsed.memberNetwork) setMemberNetwork(parsed.memberNetwork);
          if (parsed.resources) setResources(parsed.resources);
          if (Array.isArray(parsed.news)) setNews(parsed.news);
          if (Array.isArray(parsed.gallery)) setGallery(parsed.gallery);
          if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
        }
      } catch (e) {
        console.error("Error reading cms store from localStorage", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadStore();
    const handleStorageEvent = (e: StorageEvent) => {
      // Only reload on real cross-tab storage events with matching key
      if (e.key === STORAGE_KEY || e.key === 'assserva_cms_content_v4') {
        loadStore();
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Save to localStorage on change (only after initial load has completed)
  useEffect(() => {
    if (!isLoaded) return;
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Error saving cms store to localStorage", e);
    }
  }, [isLoaded, slideshows, aboutUs, objectives, services, memberNetwork, resources, news, gallery, contactInfo]);

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
        setSlideshows,
        setAboutUs,
        setObjectives,
        setServices,
        setMemberNetwork,
        setResources,
        setNews,
        setGallery,
        setContactInfo,
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
