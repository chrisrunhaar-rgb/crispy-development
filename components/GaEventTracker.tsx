"use client";

import { useEffect } from "react";
import { trackSignup, trackLogin } from "@/lib/ga-events";

interface Props {
  gaEvent?: string;
  pathway?: string;
}

export default function GaEventTracker({ gaEvent, pathway }: Props) {
  useEffect(() => {
    if (!gaEvent) return;
    if (gaEvent === "signup") {
      trackSignup(pathway || "personal");
    } else if (gaEvent === "login") {
      trackLogin();
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("ga");
    window.history.replaceState({}, "", url.toString());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
