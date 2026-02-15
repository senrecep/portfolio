"use client";

import { useEffect } from "react";
import { initContentProtection } from "@/lib/content-protection";

const isProduction = process.env.NODE_ENV === "production";

export function ContentProtection(): null {
  useEffect(() => {
    const cleanup = initContentProtection({
      enableSecurity: isProduction,
      enableDragScroll: true,
    });
    return cleanup;
  }, []);

  return null;
}
