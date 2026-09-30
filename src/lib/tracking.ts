'use client';

/**
 * Platform Acquisition & Referral Tracking Engine
 * Forum of Sewage Emptiers in Rwanda (ASSERWA)
 * 
 * Captures, normalizes, and stores user attribution across:
 * - Digital campaign parameters (UTM source, medium, campaign, content, term)
 * - Referral partner queries (ref, source, via, partner)
 * - HTTP document referrer (Google, LinkedIn, Twitter/X, WhatsApp, Partner portals)
 * - Device and platform metadata (Mobile, Tablet, Desktop, OS, Browser)
 * - First-touch and last-touch attribution tracking
 */

export interface PlatformAttribution {
  channel: string;          // Standardized channel name (e.g. "Google Search", "LinkedIn", "WASAC Partner")
  source?: string;           // utm_source or ref query param
  medium?: string;           // utm_medium (e.g. "cpc", "social", "referral", "email", "direct")
  campaign?: string;         // utm_campaign
  term?: string;             // utm_term
  content?: string;          // utm_content
  referrerUrl?: string;      // raw document.referrer
  referrerHost?: string;     // hostname of referrer
  landingPage?: string;      // Initial URL pathname + search query
  device?: string;           // e.g. "Mobile (Android)", "Desktop (Windows)"
  browser?: string;          // e.g. "Chrome", "Safari", "Edge", "Firefox"
  firstSeenAt: number;       // epoch ms timestamp of first visit
  lastSeenAt: number;        // epoch ms timestamp of current visit
  sessionCount: number;      // total visit sessions
}

const STORAGE_KEY_FIRST_TOUCH = 'asserwa_attribution_first_touch_v1';
const STORAGE_KEY_LAST_TOUCH = 'asserwa_attribution_last_touch_v1';
const STORAGE_KEY_SESSION = 'asserwa_attribution_session_v1';

/**
 * Standardize detection of user origin from search params and referrer URL
 */
export function detectPlatformChannel(
  params: URLSearchParams,
  referrer: string
): { channel: string; source?: string; medium?: string } {
  const utmSource = (params.get('utm_source') || params.get('source') || params.get('ref') || params.get('via') || params.get('partner') || '').toLowerCase().trim();
  const utmMedium = (params.get('utm_medium') || '').toLowerCase().trim();

  // 1. Explicit UTM Source or Partner Query
  if (utmSource) {
    if (utmSource.includes('google')) {
      return { channel: 'Google Search / Ads', source: utmSource, medium: utmMedium || 'cpc/search' };
    }
    if (utmSource.includes('linkedin')) {
      return { channel: 'LinkedIn', source: utmSource, medium: utmMedium || 'social' };
    }
    if (utmSource.includes('twitter') || utmSource === 'x' || utmSource.includes('t.co')) {
      return { channel: 'X (Twitter)', source: utmSource, medium: utmMedium || 'social' };
    }
    if (utmSource.includes('youtube') || utmSource.includes('yt')) {
      return { channel: 'YouTube', source: utmSource, medium: utmMedium || 'video' };
    }
    if (utmSource.includes('email') || utmSource.includes('newsletter') || utmSource.includes('mail')) {
      return { channel: 'Email', source: utmSource, medium: utmMedium || 'email' };
    }
    if (utmSource.includes('facebook') || utmSource.includes('fb') || utmSource.includes('instagram') || utmSource.includes('ig')) {
      return { channel: 'Facebook', source: utmSource, medium: utmMedium || 'social' };
    }
    if (utmSource.includes('wasac') || utmSource.includes('rura') || utmSource.includes('mininfra') || utmSource.includes('kigali')) {
      return { channel: 'Government / Municipal Partner (WASAC, RURA, City of Kigali)', source: utmSource, medium: utmMedium || 'partner-referral' };
    }
    if (utmSource.includes('whatsapp') || utmSource === 'wa') {
      return { channel: 'WhatsApp / Direct Messaging', source: utmSource, medium: utmMedium || 'direct-share' };
    }
    if (utmSource.includes('symposium') || utmSource.includes('booth') || utmSource.includes('event')) {
      return { channel: 'Rwanda Water & Sanitation Symposium 2026', source: utmSource, medium: utmMedium || 'event' };
    }
    if (utmSource.includes('member') || utmSource.includes('operator')) {
      return { channel: 'ASSERWA Member Company', source: utmSource, medium: utmMedium || 'member-referral' };
    }
    if (utmSource.includes('qr')) {
      return { channel: 'Physical QR Code / Flyer', source: utmSource, medium: utmMedium || 'offline-qr' };
    }
    // Capitalize custom source name
    return {
      channel: utmSource.charAt(0).toUpperCase() + utmSource.slice(1),
      source: utmSource,
      medium: utmMedium || 'campaign'
    };
  }

  // 2. Infer origin from document.referrer URL
  if (referrer) {
    try {
      const refUrl = new URL(referrer);
      const host = refUrl.hostname.toLowerCase();

      // Ignore internal site navigation
      if (typeof window !== 'undefined' && (host === window.location.hostname || host === 'localhost')) {
        return { channel: 'Direct Website Visit', medium: 'direct' };
      }

      if (host.includes('google.')) {
        return { channel: 'Google Search', source: 'google.com', medium: 'organic' };
      }
      if (host.includes('bing.') || host.includes('yahoo.') || host.includes('duckduckgo.')) {
        return { channel: 'Web Search Engine', source: host, medium: 'organic' };
      }
      if (host.includes('linkedin.') || host.includes('lnkd.in')) {
        return { channel: 'LinkedIn', source: 'linkedin.com', medium: 'social' };
      }
      if (host.includes('youtube.') || host.includes('youtu.be')) {
        return { channel: 'YouTube', source: 'youtube.com', medium: 'video' };
      }
      if (host.includes('mail.') || host.includes('outlook.') || host.includes('gmail.') || host.includes('webmail.')) {
        return { channel: 'Email', source: host, medium: 'email' };
      }
      if (host.includes('t.co') || host.includes('twitter.') || host.includes('x.com')) {
        return { channel: 'Twitter (X)', source: 'x.com', medium: 'social' };
      }
      if (host.includes('facebook.') || host.includes('fb.com') || host.includes('instagram.')) {
        return { channel: 'Facebook', source: host, medium: 'social' };
      }
      if (host.includes('whatsapp.')) {
        return { channel: 'WhatsApp / Direct Messaging', source: 'whatsapp.com', medium: 'direct-share' };
      }
      if (host.includes('wasac.rw') || host.includes('rura.rw') || host.includes('mininfra.gov.rw') || host.includes('kigalicity.gov.rw')) {
        return { channel: 'Government / Municipal Partner (WASAC, RURA, City of Kigali)', source: host, medium: 'partner-link' };
      }

      return {
        channel: `Referral: ${host.replace(/^www\./, '')}`,
        source: host,
        medium: 'referral'
      };
    } catch {
      // Invalid referrer URL string
    }
  }

  // 3. Fallback: Direct visit or bookmark
  return { channel: 'Direct Website Visit', medium: 'direct' };
}

/**
 * Detect client device category and OS from userAgent
 */
export function detectDeviceMetadata(): { device: string; browser: string } {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { device: 'Unknown', browser: 'Unknown' };
  }

  const ua = navigator.userAgent || '';
  let os = 'Unknown OS';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  const isMobile = /Mobi|Android|iPhone/i.test(ua);
  const isTablet = /Tablet|iPad/i.test(ua);
  const deviceType = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

  let browser = 'Browser';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';

  return {
    device: `${deviceType} (${os})`,
    browser
  };
}

/**
 * Capture and persist platform tracking attribution for current visitor
 */
export function capturePlatformAttribution(): PlatformAttribution | null {
  if (typeof window === 'undefined') return null;

  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const referrer = document.referrer || '';
    const now = Date.now();

    const { channel, source, medium } = detectPlatformChannel(params, referrer);
    const { device, browser } = detectDeviceMetadata();

    let referrerHost = '';
    if (referrer) {
      try {
        referrerHost = new URL(referrer).hostname;
      } catch {}
    }

    const currentAttribution: PlatformAttribution = {
      channel,
      source: source || (params.get('utm_source') || params.get('source') || undefined),
      medium: medium || (params.get('utm_medium') || undefined),
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined,
      referrerUrl: referrer || undefined,
      referrerHost: referrerHost || undefined,
      landingPage: `${window.location.pathname}${window.location.search}`,
      device,
      browser,
      firstSeenAt: now,
      lastSeenAt: now,
      sessionCount: 1
    };

    // 1. Session Storage Tracking (Current browser window session)
    try {
      sessionStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentAttribution));
    } catch {}

    // 2. Local Storage First-Touch Attribution (Keeps original origin on multi-day return)
    try {
      const existingFirstRaw = localStorage.getItem(STORAGE_KEY_FIRST_TOUCH);
      if (!existingFirstRaw) {
        localStorage.setItem(STORAGE_KEY_FIRST_TOUCH, JSON.stringify(currentAttribution));
      } else {
        // Increment session count on returning visitors
        const existing = JSON.parse(existingFirstRaw);
        existing.lastSeenAt = now;
        existing.sessionCount = (existing.sessionCount || 1) + 1;
        localStorage.setItem(STORAGE_KEY_FIRST_TOUCH, JSON.stringify(existing));
      }
    } catch {}

    // 3. Last-Touch Attribution (Most recent acquisition touchpoint)
    try {
      localStorage.setItem(STORAGE_KEY_LAST_TOUCH, JSON.stringify(currentAttribution));
    } catch {}

    return currentAttribution;
  } catch (err) {
    console.warn("Platform tracking capture error:", err);
    return null;
  }
}

/**
 * Retrieve stored platform attribution (prefers session/last-touch, falls back to first-touch)
 */
export function getStoredPlatformAttribution(): PlatformAttribution | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Try session storage
    const sessionRaw = sessionStorage.getItem(STORAGE_KEY_SESSION);
    if (sessionRaw) {
      return JSON.parse(sessionRaw);
    }

    // 2. Try last touch
    const lastRaw = localStorage.getItem(STORAGE_KEY_LAST_TOUCH);
    if (lastRaw) {
      return JSON.parse(lastRaw);
    }

    // 3. Try first touch
    const firstRaw = localStorage.getItem(STORAGE_KEY_FIRST_TOUCH);
    if (firstRaw) {
      return JSON.parse(firstRaw);
    }
  } catch {}

  // If nothing stored yet, capture on the fly
  return capturePlatformAttribution();
}
