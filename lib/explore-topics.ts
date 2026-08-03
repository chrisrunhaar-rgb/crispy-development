import { RESOURCES, type Resource } from "@/lib/resources-data";

/**
 * Canonical topic order + accent hues for the /explore library.
 *
 * Deliberately kept self-contained (rather than imported from
 * ExploreContent.tsx) so the 3D bookshelf and the 2D fallback can be edited
 * independently — copy work happens in ExploreContent, structural work here.
 * If a topic key/hue ever changes there, mirror it here.
 */
export interface ExploreTopic {
  key: string;
  label: string;
  labelId: string;
  hue: number;
}

export const EXPLORE_TOPICS: ExploreTopic[] = [
  { key: "assessments", label: "Assessments", labelId: "Asesmen", hue: 45 },
  { key: "cross-cultural", label: "Cross-Cultural", labelId: "Lintas Budaya", hue: 85 },
  { key: "leadership", label: "Leadership", labelId: "Kepemimpinan", hue: 125 },
  { key: "team-facilitation", label: "Team & Facilitation", labelId: "Tim & Fasilitasi", hue: 165 },
  { key: "personal-development", label: "Personal Development", labelId: "Pengembangan Diri", hue: 205 },
  { key: "thinking-tools", label: "Thinking Tools", labelId: "Alat Berpikir", hue: 245 },
  { key: "faith-calling", label: "Faith & Calling", labelId: "Iman & Panggilan", hue: 285 },
  { key: "self-care", label: "Self-Care & Resilience", labelId: "Perawatan Diri & Ketahanan", hue: 325 },
];

/** Mirrors ExploreContent.tsx / ResourcesContent.tsx derivation exactly. */
export function getLibraryCategory(
  resource: Resource,
  moduleCategories: Record<string, string>
): string {
  if (resource.slug && resource.slug in moduleCategories) {
    const cat = moduleCategories[resource.slug];
    return cat || "__hidden__";
  }
  if (resource.format === "Assessment") return "assessments";
  return resource.topics[0] ?? "personal-development";
}

export function getModuleAccess(
  slug: string | null,
  gated: boolean,
  moduleStatuses: Record<string, string>
): "development" | "live_free" | "live_paid" {
  if (!slug) return "development";
  const status = moduleStatuses[slug];
  if (status === "live_free") return "live_free";
  if (status === "live_paid") return "live_paid";
  if (status === "development") return "development";
  return gated ? "live_paid" : "live_free";
}

export interface ExploreShelf extends ExploreTopic {
  items: Resource[];
}

/**
 * Same filter as the 2D page: dev-stage modules never surface on public /explore.
 * Empty topics are dropped so the camera never turns to a bare shelf.
 */
export function buildExploreShelves(
  moduleCategories: Record<string, string>,
  moduleStatuses: Record<string, string>
): ExploreShelf[] {
  return EXPLORE_TOPICS.map((topic) => {
    const items = RESOURCES.filter((r) => {
      if (getLibraryCategory(r, moduleCategories) !== topic.key) return false;
      const access = getModuleAccess(r.slug, r.gated, moduleStatuses);
      return access === "live_free" || access === "live_paid";
    });
    return { ...topic, items };
  }).filter((shelf) => shelf.items.length > 0);
}
