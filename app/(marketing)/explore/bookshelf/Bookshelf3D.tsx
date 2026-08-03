"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { motion, useScroll, useTransform } from "motion/react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Lang, Resource } from "@/lib/resources-data";
import { buildExploreShelves } from "@/lib/explore-topics";
import ModulePopup from "../ModulePopup";
import Scene from "./Scene";
import { buildCoverAtlas, type CoverAtlas } from "./covers";
import { pickProfile } from "./shelf-layout";
import { rigState } from "./rig";

const t = (en: string, id: string, lang: Lang) => (lang === "id" ? id : en);

export interface Bookshelf3DProps {
  userId: string | null;
  moduleStatuses: Record<string, string>;
  moduleCategories: Record<string, string>;
  onFallback: () => void;
}

export default function Bookshelf3D({
  userId,
  moduleStatuses,
  moduleCategories,
  onFallback,
}: Bookshelf3DProps) {
  // LanguageContext carries five locales; module content is EN + ID only.
  const { lang: uiLang } = useLanguage();
  const lang: Lang = uiLang === "id" ? "id" : "en";
  const scrollRef = useRef<HTMLDivElement>(null);

  const shelves = useMemo(
    () => buildExploreShelves(moduleCategories, moduleStatuses),
    [moduleCategories, moduleStatuses]
  );
  const count = shelves.length;

  const [atlas, setAtlas] = useState<CoverAtlas | null>(null);
  const [aspect, setAspect] = useState(1.6);
  const [active, setActive] = useState(0);
  const [dpr, setDpr] = useState(1.75);
  const [selected, setSelected] = useState<{ resource: Resource; hue: number } | null>(null);

  /* ---- responsive room profile ---- */
  useEffect(() => {
    const read = () => setAspect(window.innerWidth / Math.max(window.innerHeight, 1));
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  const profile = useMemo(() => pickProfile(aspect), [aspect]);

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, 1.75));
  }, []);

  /* ---- procedural cover atlas (canvas2d, no network, no image API) ---- */
  useEffect(() => {
    let cancelled = false;
    if (shelves.length === 0) return;
    buildCoverAtlas(shelves, lang)
      .then((a) => {
        if (!cancelled) setAtlas(a);
      })
      .catch(() => {
        if (!cancelled) onFallback();
      });
    return () => {
      cancelled = true;
    };
  }, [shelves, lang, onFallback]);

  /* ---- scroll → rig ---- */
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const revealOpacity = useTransform(scrollYProgress, (p) => {
    const st = rigState(p, count || 1);
    return Math.min(1, st.reveal * 1.4);
  });
  const revealScale = useTransform(scrollYProgress, (p) => {
    const st = rigState(p, count || 1);
    return 0.94 + st.reveal * 0.12;
  });
  const revealY = useTransform(scrollYProgress, (p) => {
    const st = rigState(p, count || 1);
    return (1 - st.reveal) * 26;
  });
  const hintOpacity = useTransform(scrollYProgress, (p) => (p > 0.02 ? 0 : 1));

  const handleActive = useCallback(
    (i: number) => setActive(i),
    []
  );
  const handlePick = useCallback(
    (shelfIndex: number, resourceIndex: number) => {
      const shelf = shelves[shelfIndex];
      const resource = shelf?.items[resourceIndex];
      if (resource) setSelected({ resource, hue: shelf.hue });
    },
    [shelves]
  );

  /* ---- lose the context → hand over to the 2D page rather than a black box ---- */
  const handleCreated = useCallback(
    ({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
      gl.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        onFallback();
      });
    },
    [onFallback]
  );

  const shelf = shelves[active];
  const topicLabel = shelf ? (lang === "id" ? shelf.labelId : shelf.label) : "";

  if (count === 0) return null;

  return (
    <div className="bookshelf-root">
      <div
        ref={scrollRef}
        className="bookshelf-scroll"
        style={{ height: `${count * 100}svh` }}
      >
        <div className="bookshelf-sticky">
          {/* camera z is non-zero so r3f's one-off lookAt(0,0,0) isn't degenerate;
              the rig overwrites position + rotation on the first frame anyway */}
          {atlas ? (
            <Canvas
              key={`${profile.shelfW}`}
              dpr={dpr}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              camera={{ fov: profile.fov, near: 0.1, far: profile.radius * 3.2, position: [0, 0, 0.01] }}
              onCreated={handleCreated}
              className="bookshelf-canvas"
            >
              <PerformanceMonitor
                onDecline={() => setDpr((d) => Math.max(1, d - 0.35))}
                flipflops={3}
              />
              <Scene
                shelves={shelves}
                atlas={atlas}
                profile={profile}
                progress={scrollYProgress}
                onPick={handlePick}
                onActiveChange={handleActive}
              />
            </Canvas>
          ) : (
            <div className="bookshelf-loading">
              <span>{t("Building the library…", "Menyusun perpustakaan…", lang)}</span>
            </div>
          )}

          {/* topic name: fades up large centre-screen, then recedes to the plate */}
          <motion.div
            className="bookshelf-topic"
            style={{ opacity: revealOpacity, scale: revealScale, y: revealY }}
            aria-hidden="true"
          >
            <span className="bookshelf-topic-index">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <h2>{topicLabel}</h2>
          </motion.div>

          {/* progress dots */}
          <div className="bookshelf-dots" aria-hidden="true">
            {shelves.map((s, i) => (
              <span
                key={s.key}
                className={i === active ? "is-active" : undefined}
                style={{ "--dot": `oklch(65% 0.15 ${s.hue})` } as React.CSSProperties}
              />
            ))}
          </div>

          <motion.p className="bookshelf-hint" style={{ opacity: hintOpacity }} aria-hidden="true">
            {t("Scroll to turn around the room", "Gulir untuk berputar di ruangan", lang)}
          </motion.p>

          <button type="button" className="bookshelf-escape" onClick={onFallback}>
            {t("Switch to simple view", "Beralih ke tampilan sederhana", lang)}
          </button>

          {/* Keyboard + screen-reader path to every module on show. */}
          <nav className="bookshelf-sr" aria-label={t("Library modules", "Modul perpustakaan", lang)}>
            {shelves.map((s) => (
              <div key={s.key}>
                <h3>{lang === "id" ? s.labelId : s.label}</h3>
                <ul>
                  {s.items.map((r) => (
                    <li key={r.id}>
                      <Link href={`/resources/${r.slug}`}>
                        {lang === "id" && r.titleId ? r.titleId : r.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <section className="bookshelf-outro">
        <p>
          {t(
            "Every book on those shelves is a full module — practical, field-tested, and free to start.",
            "Setiap buku di rak itu adalah modul lengkap — praktis, teruji di lapangan, dan gratis untuk dimulai.",
            lang
          )}
        </p>
        {userId ? (
          <Link href="/resources" className="btn-primary">
            {t("Continue exploring", "Lanjutkan menjelajah", lang)}
          </Link>
        ) : (
          <Link href="/membership" className="btn-primary">
            {t("Start free", "Mulai gratis", lang)}
          </Link>
        )}
      </section>

      {selected && (
        <ModulePopup
          resource={selected.resource}
          lang={lang}
          accentHue={selected.hue}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
