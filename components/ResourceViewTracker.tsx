"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackResourceViewed, type ResourceCategory } from "@/lib/ga-events";

const SLUG_TO_CATEGORY: Record<string, ResourceCategory> = {
  "disc": "assessments",
  "enneagram": "assessments",
  "big-five": "assessments",
  "karunia-rohani": "assessments",
  "16-personalities": "assessments",
  "5languages": "assessments",
  "three-thinking-styles": "assessments",
  "wheel-of-life": "assessments",
  "cultural-intelligence": "cross-cultural-leadership",
  "understanding-high-context": "cross-cultural-leadership",
  "power-distance": "cross-cultural-leadership",
  "time-and-culture": "cross-cultural-leadership",
  "giving-feedback-across-cultures": "cross-cultural-leadership",
  "intercultural-communication": "cross-cultural-leadership",
  "building-trust-across-cultures": "cross-cultural-leadership",
  "cognitive-biases": "thinking-decisions",
  "six-thinking-hats": "thinking-decisions",
  "ladder-of-inference": "thinking-decisions",
  "decision-making": "thinking-decisions",
  "smart-goals": "thinking-decisions",
  "emotional-intelligence": "personal-growth",
  "fixed-growth-mindset": "personal-growth",
  "escaping-the-comfort-zone": "personal-growth",
  "identity-under-pressure": "personal-growth",
  "sustainable-pace": "personal-growth",
  "understanding-burnout": "personal-growth",
  "sabbath-leadership": "personal-growth",
  "overcoming-procrastination": "personal-growth",
  "johari-window": "personal-growth",
  "leaders-are-readers": "personal-growth",
};

export function ResourceViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const parts = pathname.split("/").filter(Boolean);
    const resourcesIdx = parts.indexOf("resources");
    if (resourcesIdx >= 0 && parts.length > resourcesIdx + 1) {
      const slug = parts[resourcesIdx + 1];
      const category: ResourceCategory = SLUG_TO_CATEGORY[slug] ?? "leadership";
      trackResourceViewed(slug, category);
    }
  }, [pathname]);

  return null;
}
