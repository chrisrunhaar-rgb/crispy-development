"use client";

import { useSyncExternalStore } from "react";

// Tracks whether this visitor can still install Crispy as an app, and how.
// The browser's install event fires once, early, so it is caught here at module load
// instead of inside a component that may mount later (like the closed profile menu).

export type InstallMode =
  | "hidden"        // already running as an app, or no install route on this browser
  | "prompt"        // browser offers one-tap install (Android Chrome, desktop Chrome/Edge)
  | "ios"           // iPhone/iPad Safari or Chrome: Share → Add to Home Screen
  | "ios-inapp"     // inside Instagram, Gmail etc. on iPhone: open in Safari first
  | "android"       // Android browser without the one-tap prompt: menu → Add to Home screen
  | "android-inapp";// inside another app on Android: open in Chrome first

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const subs = new Set<() => void>();
const notify = () => subs.forEach(f => f());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    notify();
  });
}

function getMode(): InstallMode {
  const nav = navigator as Navigator & { standalone?: boolean };
  if (installed || nav.standalone || window.matchMedia("(display-mode: standalone)").matches) return "hidden";
  const ua = nav.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1);
  const inApp = /FBAN|FBAV|Instagram|Line\/|LinkedInApp|GSA\/|Twitter/i.test(ua);
  if (ios) return /Safari/i.test(ua) && !inApp ? "ios" : "ios-inapp";
  if (deferred) return "prompt";
  if (/android/i.test(ua)) return inApp || /; wv\)/.test(ua) ? "android-inapp" : "android";
  return "hidden";
}

function subscribe(cb: () => void) {
  subs.add(cb);
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", cb);
  return () => {
    subs.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

export function useInstallMode(): InstallMode {
  return useSyncExternalStore(subscribe, getMode, () => "hidden");
}

/** Shows the browser's own install box. Resolves true if the visitor accepted. */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const ev = deferred;
  deferred = null;
  await ev.prompt();
  const { outcome } = await ev.userChoice;
  if (outcome === "accepted") installed = true;
  notify();
  return outcome === "accepted";
}
