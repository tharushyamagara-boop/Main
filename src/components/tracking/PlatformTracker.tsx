'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { capturePlatformAttribution } from '@/lib/tracking';

function TrackingListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Runs when visitor loads or navigates to any URL
    capturePlatformAttribution();
  }, [pathname, searchParams]);

  return null;
}

/**
 * Universal Platform Tracker Component
 * Wraps in Suspense so Next.js build and Turbopack SSR render without de-optimizing pages
 */
export function PlatformTracker() {
  return (
    <Suspense fallback={null}>
      <TrackingListener />
    </Suspense>
  );
}
