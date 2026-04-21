"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { markResourceRead } from "@/app/(marketing)/resources/actions";

export default function ScrollTracker() {
  const pathname = usePathname();
  const firedRef = useRef(false);

  const slug = pathname.startsWith("/resources/")
    ? pathname.replace("/resources/", "").split("/")[0]
    : null;

  useEffect(() => {
    if (!slug) return;
    firedRef.current = false;

    const check = () => {
      if (firedRef.current) return;
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total > 0 && scrolled / total >= 0.8) {
        firedRef.current = true;
        markResourceRead(slug);
      }
    };

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, [slug]);

  return null;
}
