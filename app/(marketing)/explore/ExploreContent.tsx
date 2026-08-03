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
    hookEn:
      "Self-awareness is the one advantage no framework, strategy, or technique can substitute for. You can learn every leadership model available and still lead poorly if you don't understand your own default patterns: how you're wired to think, what motivates you, where your blind spots sit, and what you actually need from the people around you. This section is a set of structured assessments, not personality trivia, that give you a clear, honest picture of yourself as a leader: your behavioral style, your thinking style, your time orientation, your spiritual gifts, your rhythms of rest. None of these are a verdict on who you are. They're a starting point, a way of naming what's true so you can lead from clarity instead of guesswork. Take them seriously enough to be honest, and use what you find to lead the people around you a little better than you did before.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Asesmen. Teks tema dari CLEO akan menggantikan baris ini.",
  },
  {
    key: "cross-cultural",
    label: "Cross-Cultural",
    labelId: "Lintas Budaya",
    hue: 85,
    hookEn:
      "You can misread a room in your own culture. Cross an ocean and the odds get worse. A pause that reads as agreement might be a form of respect. Silence in a meeting might be someone thinking, not someone checking out. Directness that feels honest in one office reads as an insult in another. None of this makes you a bad leader. It makes you a leader who is missing a layer of information everyone around you can already see. Cultural intelligence is not about memorizing a list of dos and don'ts for forty countries. It is a way of paying attention, testing your assumptions, and staying curious instead of certain. The best cross-cultural leaders in history, starting with Jesus meeting a Samaritan woman at a well, didn't just tolerate difference. They read it, respected it, and let it shape how they served. This section gives you the same practical skill.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Lintas Budaya. Teks contoh CLEO akan menggantikan baris ini.",
  },
  {
    key: "leadership",
    label: "Leadership",
    labelId: "Kepemimpinan",
    hue: 125,
    hookEn:
      "Leadership training tends to hand you a title and a technique, then leave you to work out everything else on your own. What nobody prepares you for is how much leadership actually depends on things that were never on the org chart: how to read the room above you, how to cast a vision people can actually see, how to hand real responsibility to someone younger before you feel ready to let go. Add a cross-cultural layer and the stakes go up again, because the tools that worked in your last context might not translate at all. This section is built around what actually changes people's behavior, not just their thinking: perspective on where you sit in the bigger picture, models for serving instead of just directing, and the discipline of raising up leaders who will eventually lead better than you did. Leadership here means responsibility carried well, for the people in front of you and the ones coming after.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Kepemimpinan. Teks tema dari CLEO akan menggantikan baris ini.",
  },
  {
    key: "team-facilitation",
    label: "Team & Facilitation",
    labelId: "Tim & Fasilitasi",
    hue: 165,
    hookEn:
      "Most team problems never look like team problems until it's too late. A pattern of unfinished meetings. A conflict that gets smoothed over instead of resolved. A training session everyone nods through and nobody remembers a week later. The skill most leaders are missing isn't more meetings. It's better ones: a way to separate ideas from evaluation, disagreement from disrespect, reflection from just moving on to the next thing. Facilitating well across a multicultural team raises the difficulty further, because the same silence that signals disengagement in one culture might signal careful thought in another, and conflict that looks healthy in one room can feel like a threat in the next. This section gives you concrete tools, not vague advice, for running better meetings, working through conflict productively, and building the kind of team health that survives contact with real pressure and real difference.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Tim & Fasilitasi. Teks tema dari CLEO akan menggantikan baris ini.",
  },
  {
    key: "personal-development",
    label: "Personal Development",
    labelId: "Pengembangan Diri",
    hue: 205,
    hookEn:
      "Growth doesn't happen because you decided to try harder. It happens because you built something, a habit, a mindset, a way of seeing yourself, that holds up under pressure. Most of what keeps leaders stuck isn't a lack of information. It's an unexamined mindset, a goal with no structure behind it, procrastination that gets mistaken for laziness when it's really fear in disguise. This section is a set of practical tools for the inner work leadership actually requires: understanding how mindset shapes your response to failure, learning to set goals that survive contact with a busy week, recognizing blind spots before someone else has to point them out, and building the kind of self-awareness that makes you easier to lead and easier to be led by. None of it is complicated. Most of it is a matter of naming what's actually happening and choosing, deliberately, what to do next.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Pengembangan Diri. Teks tema dari CLEO akan menggantikan baris ini.",
  },
  {
    key: "thinking-tools",
    label: "Thinking Tools",
    labelId: "Alat Berpikir",
    hue: 245,
    hookEn:
      "Every decision you make runs through a mind that is faster than it is accurate. It fills in gaps with assumptions, jumps to conclusions from partial data, and defends its first impression long after the evidence has changed. This isn't a character flaw. It's how every human brain is built, and the leaders who lead best aren't the ones with fewer blind spots. They're the ones who've learned to catch their own thinking in the act. This section is a small toolkit for exactly that: tracing your reasoning back to the facts that actually started it, naming the biases that quietly distort your judgment, and making better decisions when you don't have all the information you'd like. In cross-cultural leadership, where the data you're reading often comes filtered through an unfamiliar context, this kind of clear thinking isn't optional. It's the difference between leading from evidence and leading from assumption.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Alat Berpikir. Teks tema dari CLEO akan menggantikan baris ini.",
    // Small topic — gets a pull-quote alongside the single column list.
    pullQuoteEn:
      "Your first read of a situation is rarely your best one. Good thinking means waiting for the second.",
    pullQuoteId:
      "Kesan pertamamu tentang sebuah situasi jarang menjadi yang terbaik. Berpikir jernih berarti mau menunggu kesan berikutnya.",
  },
  {
    key: "faith-calling",
    label: "Faith & Calling",
    labelId: "Iman & Panggilan",
    hue: 285,
    hookEn:
      "Somewhere between the call you said yes to and the life you're actually living, most leaders hit a gap they didn't expect. The plan isn't as clear as it felt at the start. The pace is higher than the soul can sustain. The identity you built your calling on gets tested the moment it stops being convenient. This section isn't about performing more faith or trying harder to feel something you don't. It's about the actual practices that keep leaders rooted when the ground moves: silence instead of constant noise, community instead of isolation, and a theology of calling that has room for uncertainty without falling apart. The leaders in scripture who lasted, Daniel, Esther, Nehemiah, rarely had the full plan before they took the next step. What they had was a rootedness that didn't depend on always knowing what came next. That is what this section is built to help you build too.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Iman & Panggilan. Teks tema dari CLEO akan menggantikan baris ini.",
  },
  {
    key: "self-care",
    label: "Self-Care & Resilience",
    labelId: "Perawatan Diri & Ketahanan",
    hue: 325,
    hookEn:
      "Nobody plans to burn out. It happens gradually, one skipped rest day and one ignored warning sign at a time, until the person who used to have capacity for everyone else has none left for themselves. Self-care gets dismissed as indulgence by leaders who were taught that sacrifice is the whole job. But a leader who cannot sustain their own health cannot sustain anyone else's either, and the cost of that shows up in families, teams, and the work itself. This section covers the practical architecture of a sustainable life: transitions handled well instead of just survived, families protected from the pressure a leader absorbs, and rhythms of rest that are less about escaping the work and more about being able to keep doing it for decades, not just years. Longevity was never a personality trait some leaders have and others don't. It's built, deliberately, the same way everything else worth having is built.",
    // TODO: LINGO copy — no Indonesian translation of CLEO's theme hook exists yet; placeholder retained
    hookId: "Teks placeholder untuk Perawatan Diri & Ketahanan. Teks tema dari CLEO akan menggantikan baris ini.",
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
