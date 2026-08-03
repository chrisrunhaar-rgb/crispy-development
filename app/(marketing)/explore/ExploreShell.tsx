"use client";

import { useCallback, useEffect, useState } from "react";
import nextDynamic from "next/dynamic";
import ExploreContent from "./ExploreContent";

// The 3D room is ~700KB of three.js — never in the 2D path's bundle.
const Bookshelf3D = nextDynamic(() => import("./bookshelf/Bookshelf3D"), { ssr: false });

interface Props {
  userId: string | null;
  moduleStatuses: Record<string, string>;
  moduleCategories: Record<string, string>;
  moduleFormats: Record<string, string[]>;
}

type Mode = "pending" | "3d" | "2d";

/** Cheap, disposable probe — a real context, immediately released. */
function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl =
      (c.getContext("webgl2") as WebGL2RenderingContext | null) ??
      (c.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return false;
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function ExploreShell(props: Props) {
  // SSR and first paint always render the real 2D page, so no-JS crawlers and
  // slow devices get full content immediately.
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get("view");
    if (forced === "2d") {
      setMode("2d");
      return;
    }
    if (forced === "3d") {
      setMode("3d");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMemory = typeof memory === "number" && memory < 2;

    setMode(reduced || lowMemory || !hasWebGL() ? "2d" : "3d");
  }, []);

  const fallback = useCallback(() => setMode("2d"), []);

  if (mode === "3d") {
    return (
      <Bookshelf3D
        userId={props.userId}
        moduleStatuses={props.moduleStatuses}
        moduleCategories={props.moduleCategories}
        onFallback={fallback}
      />
    );
  }

  return <ExploreContent {...props} />;
}
