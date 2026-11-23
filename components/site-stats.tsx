"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageview } from "@/lib/track";

/** Counts a page view on every route change for MASFIG's own statistics (Admin > Tracking). Renders nothing. */
export function SiteStats() {
  const pathname = usePathname();
  useEffect(() => {
    trackPageview();
  }, [pathname]);
  return null;
}
