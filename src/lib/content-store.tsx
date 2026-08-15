'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Default Brochure Data Constants
export const defaultSlideshows = [
  {
    id: 'slide-1',
    title: "Advancing Rwanda's ",
    titleHighlight: "Hygiene & Sanitation",
    description: "Let us work together to promote hygiene, sanitation, and environmental protection.",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 'slide-2',
    title: "Professionalizing ",
    titleHighlight: "Sanitation Service Providers",
    description: "ASSSERVA brings together sewage emptiers and sanitation practitioners in Rwanda to protect public health and safeguard the environment.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'slide-3',
    title: "Safeguarding Our ",
    titleHighlight: "Environment & Community Health",
    description: "Advocating for proper operation, maintenance, and construction of sanitation infrastructure across all provinces.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
  }
];

export const defaultAboutUs = {
  headerTag: "Official Profile",
  title: "Who is ASSSERVA?",
  description: "ASSSERVA (Association of Sewage Emptiers in Rwanda) is a non-governmental organization that brings together sewage emptiers and sanitation service providers in Rwanda.",
  mission: "To promote a culture of hygiene and sanitation among members and the wider community.",
  objectiveScope: "The organization works to improve sanitation services, protect public health, and safeguard the environment across all provinces of Rwanda.",
  imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
};

export const defaultObjectives = [
  {
    id: 'obj-1',
    title: "1. Environmental & Hygiene Promotion",
    color: "#6cb166",
    points: [
      "Promote environmental protection and sanitation practices.",
      "Promote hygiene and sanitation activities that improve the health and well-being of members and communities."
    ]
  },
  {
    id: 'obj-2',
    title: "2. Professional Development",
    color: "#3b66b0",
    points: [
      "Promote high professional standards among sewage emptiers and sanitation workers."
    ]
  },
  {
    id: 'obj-3',
    title: "3. Multi-Level Advocacy",
    color: "#6cb166",
    points: [
      "National government institutions advocacy.",
      "Local government institutions advocacy.",
      "Non-government stakeholders and partners representation."
    ]
  },
  {
    id: 'obj-4',
    title: "4. Sanitation Infrastructure",
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
    region: "Kigali City",
    description: "Capital & Central Administrative Operations",
    companies: ["Kyalin Services SARL", "Igisubizo Co. Ltd", "SANEC Co. Ltd", "Kant Kigali Ltd"]
  },
  {
    region: "Western Province (Uburengerazuba)",
    description: "Lake Kivu & Western Regional Providers",
    companies: ["UBTC Fast", "Timbe Best Co. Ltd", "Umucyo Best Technical Co."]
  },
  {
    region: "Northern Province (Amajyaruguru)",
    description: "Northern Region Service Providers",
    companies: ["Sanitec Co. Ltd", "Theophile"]
  },
  {
    region: "Southern Province (Amajyepfo)",
    description: "Southern Regional Operations",
    companies: ["UMOJA Co. Ltd", "Tabara Co. Ltd"]
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
    title: "ASSSERVA Organizational Charter",
    type: "Policy",
    size: "1.5 MB",
    description: "Code of professional standards and ethics for all member sewage emptiers in Rwanda."
  }
];

export const defaultNews = [
  {
    id: 'news-1',
    title: "ASSSERVA Conducts Regional Sanitation & Hygiene Workshop",
    excerpt: "Promoting high professional standards among sewage emptiers and sanitation practitioners in Rwanda.",
    date: "May 24, 2024",
    author: "ASSSERVA Secretariat",
    tag: "Advocacy",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'news-2',
    title: "Promoting Toilet Construction & Facility Maintenance",
    excerpt: "Workshops focusing on infrastructure maintenance and environmental protection in communities.",
    date: "June 12, 2024",
    author: "ASSSERVA Secretariat",
    tag: "Infrastructure",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 'news-3',
    title: "Multi-Level Stakeholder Advocacy Engagement",
    excerpt: "Advocating for sewage emptiers at national and local government institutions across provinces.",
    date: "June 05, 2024",
    author: "ASSSERVA Secretariat",
    tag: "Community",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
  }
];

export const defaultGallery = [
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
    description: "ASSSERVA Operational Headquarters & Administration",
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
  email: "assservarwanda@gmail.com",
  slogan: "Let us work together to promote hygiene, sanitation, and environmental protection.",
  sloganKinyarwanda: "Dukorere hamwe duharanira isuku, isukura no kurengera ibidukikije."
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

const STORAGE_KEY = 'assserva_cms_content_v1';

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

  // Load from localStorage on client side mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.slideshows) setSlideshows(parsed.slideshows);
        if (parsed.aboutUs) setAboutUs(parsed.aboutUs);
        if (parsed.objectives) setObjectives(parsed.objectives);
        if (parsed.services) setServices(parsed.services);
        if (parsed.memberNetwork) setMemberNetwork(parsed.memberNetwork);
        if (parsed.resources) setResources(parsed.resources);
        if (parsed.news) setNews(parsed.news);
        if (parsed.gallery) setGallery(parsed.gallery);
        if (parsed.contactInfo) setContactInfo(parsed.contactInfo);
      }
    } catch (e) {
      console.error("Error reading cms store from localStorage", e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
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
  }, [slideshows, aboutUs, objectives, services, memberNetwork, resources, news, gallery, contactInfo]);

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
