"use client";

import { useEffect } from "react";
import { saveUserTimezone } from "@/app/auth/actions";

export default function TimezoneDetector({ savedTimezone }: { savedTimezone?: string | null }) {
  useEffect(() => {
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60; // UTC+8 = -480 min → +8
    const sign = offsetHours >= 0 ? "+" : "";
    const computed = `UTC${sign}${offsetHours}`;

    if (savedTimezone === computed) return; // already up to date

    saveUserTimezone(offsetHours).catch(() => {});
  }, [savedTimezone]);

  return null;
}
