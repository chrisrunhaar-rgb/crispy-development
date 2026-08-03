"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import nextDynamic from "next/dynamic";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { useLanguage } from "@/lib/LanguageContext";
import { RESOURCES, Resource, Lang } from "@/lib/resources-data";
import TopicSection, { ExploreSection } from "./TopicSection";

// Popup lazy-mounts on first click — not all 54 resources pre-render a modal.
const ModulePopup = nextDynamic(() => import("./ModulePopup"), { ssr: false });

const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

interface Props {
  userId: string | null;
  moduleStatuses: Record<string, string>;
  moduleCategories: Record<string, string>;
  moduleFormats: Record<string, string[]>;
}

// Mirrors ResourcesContent.tsx's section order + derivation exactly, so a resource
// appears in exactly one section here too (assessments are never duplicated under
// their topic — see getLibraryCategory below, same logic as the library page).
const SECTION_META: Omit<ExploreSection, "items">[] = [
  {
    key: "assessments",
    label: "Assessments",
    labelId: "Asesmen",
    hue: 45,
    hookEn: "See your default patterns clearly, then lead from clarity instead of guesswork.",
    hookId: "Kenali pola dasarmu dengan jelas, lalu pimpin dari kejelasan, bukan tebakan.",
  },
  {
    key: "cross-cultural",
    label: "Cross-Cultural",
    labelId: "Lintas Budaya",
    hue: 85,
    hookEn: "The room reads differently across cultures. Learn to read it right.",
    hookId: "Setiap budaya punya cara membaca ruang yang berbeda. Pelajari cara membacanya dengan tepat.",
  },
  {
    key: "leadership",
    label: "Leadership",
    labelId: "Kepemimpinan",
    hue: 125,
    hookEn: "What the org chart never taught you about actually leading people.",
    hookId: "Hal-hal yang tidak diajarkan struktur organisasi tentang benar-benar memimpin orang.",
  },
  {
    key: "team-facilitation",
    label: "Team & Facilitation",
    labelId: "Tim & Fasilitasi",
    hue: 165,
    hookEn: "Better meetings, real conflict resolved, teams that hold up under pressure.",
    hookId: "Rapat yang lebih baik, konflik yang benar-benar selesai, tim yang tahan tekanan.",
  },
  {
    key: "personal-development",
    label: "Personal Development",
    labelId: "Pengembangan Diri",
    hue: 205,
    hookEn: "Habits and mindsets that hold up under a busy week, not just good intentions.",
    hookId: "Kebiasaan dan pola pikir yang bertahan di tengah minggu yang sibuk, bukan sekadar niat baik.",
  },
  {
    key: "thinking-tools",
    label: "Thinking Tools",
    labelId: "Alat Berpikir",
    hue: 245,
    hookEn: "Your first read of a situation is rarely your best one.",
    hookId: "Kesan pertamamu jarang menjadi yang terbaik.",
  },
  {
    key: "faith-calling",
    label: "Faith & Calling",
    labelId: "Iman & Panggilan",
    hue: 285,
    hookEn: "Rootedness that doesn't depend on always knowing what happens next.",
    hookId: "Keteguhan yang tidak bergantung pada selalu tahu apa yang akan terjadi.",
  },
  {
    key: "self-care",
    label: "Self-Care & Resilience",
    labelId: "Perawatan Diri & Ketahanan",
    hue: 325,
    hookEn: "Sustainable rhythms for a leader who plans to last decades, not years.",
    hookId: "Ritme berkelanjutan untuk pemimpin yang ingin bertahan puluhan tahun, bukan hanya beberapa tahun.",
  },
];

// Duplicated from ResourcesContent.tsx intentionally (Decision 4, 2026-08-03 plan) — keep
// this in sync if that file's derivation logic ever changes. Assessments are excluded from
// topic sections by falling into the "assessments" bucket here, same as the library page.
function getLibraryCategory(resource: Resource, moduleCategories: Record<string, string>): string {
  if (resource.slug && resource.slug in moduleCategories) {
    const cat = moduleCategories[resource.slug];
    return cat || "__hidden__"; // "" = explicitly unset → hidden from all sections
  }
  if (resource.format === "Assessment") return "assessments";
  return resource.topics[0] ?? "personal-development";
}

function getModuleAccess(
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

export default function ExploreContent({
  userId,
  moduleStatuses,
  moduleCategories,
  moduleFormats,
}: Props) {
  const { lang } = useLanguage();
  const [selected, setSelected] = useState<Resource | null>(null);
  const [selectedHue, setSelectedHue] = useState(45);

  const sections: ExploreSection[] = useMemo(() => {
    return SECTION_META.map((meta) => {
      const items = RESOURCES.filter((r) => {
        if (getLibraryCategory(r, moduleCategories) !== meta.key) return false;
        // /explore is public with no login wall — dev-stage modules never surface here,
        // unlike /resources which shows them greyed-out "COMING SOON" to signed-in members.
        const access = getModuleAccess(r.slug, r.gated, moduleStatuses);
        return access === "live_free" || access === "live_paid";
      });
      return { ...meta, items };
    }).filter((section) => section.items.length > 0);
  }, [moduleCategories, moduleStatuses]);

  const handleSelect = useCallback((resource: Resource, hue: number) => {
    setSelected(resource);
    setSelectedHue(hue);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="explore-snap-container">
        <motion.section
          className="explore-hero"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container-wide">
            <span
              className="t-label"
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "oklch(65% 0.15 45)",
              }}
            >
              {t("The Library", "Perpustakaan", lang)}
            </span>
            <h1
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                lineHeight: 1.1,
                margin: "0.75rem 0 1rem",
              }}
            >
              {t(
                "Everything is here. You just haven't found it yet.",
                "Semuanya sudah ada di sini. Kamu saja yang belum menemukannya.",
                lang
              )}
            </h1>
            <p style={{ maxWidth: "560px", fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.85 }}>
              {t(
                "Fifty-four guides, assessments, and worksheets across eight topics, built for Christian leaders navigating life and leadership across cultures. Explore the whole library below, then go deeper on what matters most to you.",
                "Lima puluh empat panduan, asesmen, dan lembar kerja dalam delapan topik, dibuat untuk pemimpin Kristen yang menjalani hidup dan kepemimpinan lintas budaya. Jelajahi seluruh perpustakaan di bawah ini, lalu dalami lebih jauh apa yang paling penting bagimu.",
                lang
              )}
            </p>
          </div>
        </motion.section>

        {sections.map((section) => (
          <TopicSection
            key={section.key}
            section={section}
            lang={lang}
            moduleFormats={moduleFormats}
            onSelect={(resource) => handleSelect(resource, section.hue)}
          />
        ))}

        <section className="explore-cta">
          <div className="container-wide" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", margin: 0 }}>
              {t(
                "The rest of the library is waiting.",
                "Bagian lain dari perpustakaan ini masih menunggumu.",
                lang
              )}
            </h2>
            {userId ? (
              <Link href="/resources" className="btn-primary">
                {t("Continue exploring", "Lanjutkan menjelajah", lang)}
              </Link>
            ) : (
              <Link href="/membership" className="btn-primary">
                {t("Start free", "Mulai gratis", lang)}
              </Link>
            )}
          </div>
        </section>
      </div>

      {selected && (
        <ModulePopup
          resource={selected}
          lang={lang}
          accentHue={selectedHue}
          onClose={() => setSelected(null)}
        />
      )}
    </MotionConfig>
  );
}
