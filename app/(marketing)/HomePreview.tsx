"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/LanguageContext";
import {
  T, SERIF, SANS, KIT_CSS, Eyebrow, h2Style, bodyStyle, Caption,
  BrowserFrame, PhoneFrame, LazyVideo, PrimaryLink,
} from "@/components/promo/PromoKit";

/* ─────────────────────────────────────────────────────────────────────────────
   Home page. Same light visual system as the Personal and Team pathway pages,
   classes prefixed .hp.
   ───────────────────────────────────────────────────────────────────────── */
const HOME_VIDEO = {
  webm: "/videos/personal-module-flow.webm",
  mp4: "/videos/personal-module-flow.mp4",
  poster: "/images/personal-promo/module-flow-poster.jpg",
};

const COPY = {
  en: {
    hero: {
      eyebrow: "Crispy Development",
      title: "Raising leaders who cross cultures.",
      subline: "Practical training for leaders who serve far from home. Short modules, honest assessments and a My Pathway page that keeps your growth in one place, for you or for your whole team.",
      cta: "Set up your free account",
      ctaIn: "Go to Home",
    },
    paths: {
      label: "Two pathways",
      whyLabel: "Why",
      howLabel: "How",
      title: "Grow on your own, or grow together.",
      body: "Both pathways open the full library of 50+ modules and all eight assessments. The difference is who you bring with you.",
      personal: {
        name: "Personal Pathway",
        what: "Know how you lead.",
        why: "Leading far from home stretches you in ways you can't always see. Growth starts when you understand your own patterns.",
        how: "Eight assessments, 50+ short modules and a My Pathway page that keeps your notes and progress together.",
        cta: "Explore Personal",
      },
      team: {
        name: "Team Pathway",
        what: "Lead a team that understands each other.",
        why: "Cross-cultural teams lose a lot of energy to misunderstanding. When people see how their colleagues work, conflict becomes conversation.",
        how: "Everyone gets their own My Pathway page. You see the whole team's results side by side, ready for your next team meeting.",
        cta: "Explore Team",
      },
    },
    inside: {
      label: "Inside the platform",
      title: "Your own development pathway.",
      points: [
        "50+ modules, most of them 15 to 25 minutes",
        "8 assessments, every result saved",
        "Your own notes on every module",
        "Read in English or Bahasa Indonesia",
      ],
      caption: "Read on your computer or your phone. Every module has short sections, plain language and something practical to try.",
      phoneAlt: "A Wheel of Life result on a phone, with a score for each life area.",
    },
    waypoint: {
      label: "WayPoint",
      title: "A private space to think out loud.",
      body: "WayPoint is our AI voice coach. It doesn't give advice. We believe you already carry the answers inside you, and WayPoint helps you find them. Pick a coach, talk for as long as you need, and keep what you learn.",
      cta: "Meet WayPoint",
      alt: "Tara, one of the WayPoint coaches, in a warm and quiet room.",
    },
    cta: {
      title: "Take your first step today.",
      options: ["Set up your free account", "Choose your pathway", "Explore the full library waiting for you"],
    },
    dashAlt: "My Pathway with saved modules, assessment results and progress.",
  },
  id: {
    hero: {
      eyebrow: "Crispy Development",
      title: "Raising leaders who cross cultures.",
      subline: "Pelatihan praktis bagi pemimpin yang melayani jauh dari rumah. Modul singkat, asesmen yang jujur, dan halaman Jalur Saya yang menyimpan pertumbuhan Anda di satu tempat, untuk Anda sendiri atau untuk seluruh tim Anda.",
      cta: "Buat akun gratis Anda",
      ctaIn: "Buka Home",
    },
    paths: {
      label: "Dua jalur",
      whyLabel: "Mengapa",
      howLabel: "Bagaimana",
      title: "Bertumbuh sendiri, atau bertumbuh bersama.",
      body: "Kedua jalur membuka seluruh perpustakaan berisi 50+ modul dan kedelapan asesmen. Bedanya adalah siapa yang Anda ajak.",
      personal: {
        name: "Jalur Pribadi",
        what: "Kenali cara Anda memimpin.",
        why: "Memimpin jauh dari rumah menguji Anda dengan cara yang tidak selalu terlihat. Pertumbuhan dimulai saat Anda memahami pola Anda sendiri.",
        how: "Delapan asesmen, 50+ modul singkat, dan halaman Jalur Saya yang menyimpan catatan serta kemajuan Anda di satu tempat.",
        cta: "Lihat Jalur Pribadi",
      },
      team: {
        name: "Jalur Tim",
        what: "Pimpin tim yang saling memahami.",
        why: "Tim lintas budaya banyak kehilangan tenaga karena salah paham. Saat setiap orang melihat cara rekannya bekerja, konflik berubah menjadi percakapan.",
        how: "Setiap orang mendapat halaman Jalur Saya sendiri. Anda melihat hasil seluruh tim berdampingan, siap untuk pertemuan tim berikutnya.",
        cta: "Lihat Jalur Tim",
      },
    },
    inside: {
      label: "Di dalam platform",
      title: "Jalur pengembangan pribadi Anda.",
      points: [
        "50+ modul, sebagian besar 15 sampai 25 menit",
        "8 asesmen, setiap hasil tersimpan",
        "Catatan pribadi di setiap modul",
        "Baca dalam Bahasa Inggris atau Bahasa Indonesia",
      ],
      caption: "Baca di komputer atau ponsel. Setiap modul punya bagian-bagian singkat, bahasa sederhana, dan sesuatu yang praktis untuk dicoba.",
      phoneAlt: "Hasil Roda Kehidupan di ponsel, dengan skor untuk setiap area kehidupan.",
    },
    waypoint: {
      label: "WayPoint",
      title: "Ruang pribadi untuk berpikir dengan suara.",
      body: "WayPoint adalah pelatih suara AI kami. WayPoint tidak memberi nasihat. Kami percaya Anda sudah membawa jawabannya di dalam diri Anda, dan WayPoint membantu Anda menemukannya. Pilih pelatih, berbicaralah selama yang Anda perlukan, dan simpan apa yang Anda pelajari.",
      cta: "Kenali WayPoint",
      alt: "Tara, salah satu pelatih WayPoint, di ruangan yang hangat dan tenang.",
    },
    cta: {
      title: "Ambil langkah pertama Anda hari ini.",
      options: ["Buat akun gratis Anda", "Pilih jalur Anda", "Jelajahi seluruh perpustakaan yang menanti Anda"],
    },
    dashAlt: "Jalur Saya dengan modul tersimpan, hasil asesmen, dan kemajuan.",
  },
} as const;

const CSS = `
.hp { display: flex; flex-direction: column; gap: clamp(4rem, 9vw, 7.5rem); }
.hp-hero, .hp-split, .hp-cta, .hp-wp, .hp-inside { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(2rem, 5vw, 4rem); }
.hp-cta-opt { display: flex; align-items: center; gap: 1rem; padding: 1.1rem 0.25rem; font-family: ${SANS}; font-weight: 600; font-size: 1rem; color: ${T.navy}; text-decoration: none; transition: color 0.2s ease; }
.hp-cta-opt:hover { color: ${T.orangeDeep}; }
.hp-cta-opt:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 3px; }
.hp-cta-pick { color: ${T.orangeDeep}; text-decoration: none; font-size: 0.9rem; white-space: nowrap; }
.hp-cta-pick:hover { color: ${T.navy}; }
.hp-cta-pick:focus-visible { outline: 2px solid ${T.orange}; outline-offset: 3px; }
.hp-paths { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
.hp-points { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0 2rem; list-style: none; margin: 0; padding: 0; }
.hp-shots { position: relative; }
.hp-phone { display: none; }
.hp-card { transition: border-color 0.2s ease, transform 0.2s ease; }
.hp-card:hover { border-color: ${T.navy} !important; }
@media (min-width: 560px) {
  .hp-points { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 760px) {
  .hp-paths { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 960px) {
  .hp-hero { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: center; }
  .hp-split { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .hp-inside { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); align-items: center; }
  .hp-wp { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: center; }
  .hp-cta { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: start; }
  .hp-shots { padding-right: 4rem; padding-bottom: 2.5rem; }
  .hp-phone { display: block; position: absolute; right: 0; bottom: 0; width: 9.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .hp-card { transition: none; }
}
`;

function PathCard({ href, name, what, why, how, cta, accent, whyLabel, howLabel }: { href: string; name: string; what: string; why: string; how: string; cta: string; accent: string; whyLabel: string; howLabel: string }) {
  const sub = { margin: "0 0 0.3rem", fontFamily: SANS, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: accent };
  return (
    <article className="hp-card" style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "clamp(1.5rem, 3vw, 2.25rem)", border: `1px solid ${T.rule}`, borderTop: `3px solid ${accent}`, borderRadius: 2, background: T.offWhite }}>
      <h3 style={{ margin: 0, fontFamily: SANS, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.muted }}>{name}</h3>
      <p style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.9rem, 3.6vw, 2.5rem)", lineHeight: 1.1, color: T.navy, textWrap: "balance" }}>{what}</p>
      <div>
        <p style={sub}>{whyLabel}</p>
        <p style={{ ...bodyStyle, fontSize: "0.94rem" }}>{why}</p>
      </div>
      <div style={{ flex: 1 }}>
        <p style={sub}>{howLabel}</p>
        <p style={{ ...bodyStyle, fontSize: "0.94rem" }}>{how}</p>
      </div>
      <div style={{ paddingTop: "0.25rem" }}>
        <PrimaryLink href={href} tone={accent === T.orange ? "orange" : "navy"}>{cta}</PrimaryLink>
      </div>
    </article>
  );
}

export default function HomePreview() {
  const { lang: rawLang } = useLanguage();
  const lang = rawLang === "id" ? "id" : "en";
  const c = COPY[lang];
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    createClient().auth.getSession().then(({ data }) => {
      if (data.session) setSignedIn(true);
    });
  }, []);

  return (
    <div className="container-wide" style={{ paddingBlock: "clamp(3rem, 7vw, 5.5rem)" }}>
      <div className="hp" lang={lang}>
        <style>{KIT_CSS + CSS}</style>

        {/* ── 1. Hero ── */}
        <section className="hp-hero" aria-labelledby="hp-hero-title">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="pk-rise"><Eyebrow>{c.hero.eyebrow}</Eyebrow></div>
            <h1 id="hp-hero-title" className="pk-rise" style={{
              fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, margin: 0,
              fontSize: "clamp(2.6rem, 5.6vw, 4.2rem)", lineHeight: 1.02, letterSpacing: "-0.01em",
              color: T.navy, textWrap: "balance", animationDelay: "80ms",
            }}>
              {c.hero.title}
            </h1>
            <p className="pk-rise" style={{ ...bodyStyle, fontSize: "1.02rem", maxWidth: "46ch", animationDelay: "160ms" }}>{c.hero.subline}</p>
            <div className="pk-rise" style={{ animationDelay: "240ms", paddingTop: "0.25rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem 1.5rem" }}>
              <PrimaryLink href={signedIn ? "/dashboard" : "/signup"}>{signedIn ? c.hero.ctaIn : c.hero.cta}</PrimaryLink>
            </div>
          </div>
          <figure className="pk-rise hp-shots" style={{ margin: "0 auto", width: "100%", maxWidth: "34rem", animationDelay: "200ms" }}>
            <BrowserFrame aspect="886 / 905">
              <Image src="/images/personal-promo/dashboard.jpg" alt={c.dashAlt} fill priority sizes="(min-width: 960px) 480px, 100vw" style={{ objectFit: "cover", objectPosition: "top" }} />
            </BrowserFrame>
            <div className="hp-phone">
              <PhoneFrame src="/images/personal-promo/wheel-result.jpg" alt={c.inside.phoneAlt} maxWidth="9.5rem" />
            </div>
          </figure>
        </section>

        {/* ── 2. Two pathways ── */}
        <section aria-labelledby="hp-paths-title" style={{ borderTop: `1px solid ${T.rule}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)", display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>
          <div className="hp-split">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Eyebrow>{c.paths.label}</Eyebrow>
              <h2 id="hp-paths-title" style={h2Style()}>{c.paths.title}</h2>
            </div>
            <p style={{ ...bodyStyle, alignSelf: "end" }}>{c.paths.body}</p>
          </div>
          <div className="hp-paths">
            <PathCard href="/personal" accent={T.navy} whyLabel={c.paths.whyLabel} howLabel={c.paths.howLabel} {...c.paths.personal} />
            <PathCard href="/team" accent={T.orange} whyLabel={c.paths.whyLabel} howLabel={c.paths.howLabel} {...c.paths.team} />
          </div>
        </section>

        {/* ── 3. Inside the platform ── */}
        <section aria-labelledby="hp-inside-title" style={{ background: T.band, padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
          <div className="hp-inside">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Eyebrow>{c.inside.label}</Eyebrow>
              <h2 id="hp-inside-title" style={h2Style()}>{c.inside.title}</h2>
              <ul className="hp-points">
                {c.inside.points.map((pt, i) => (
                  <li key={i} style={{ borderTop: `1px solid ${T.ruleOnBand}`, padding: "1rem 0 1.25rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                    <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.5rem", lineHeight: 1, color: T.navyMid }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: SANS, fontSize: "0.9rem", fontWeight: 600, lineHeight: 1.5, color: T.charcoal }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <figure style={{ margin: "0 auto", width: "100%", maxWidth: "27rem" }}>
              <BrowserFrame aspect="720 / 716" url="crispyleaders.com/resources">
                <LazyVideo video={HOME_VIDEO} label={c.inside.caption} />
              </BrowserFrame>
              <Caption>{c.inside.caption}</Caption>
            </figure>
          </div>
        </section>

        {/* ── 4. WayPoint ── */}
        <section aria-labelledby="hp-wp-title" style={{ border: `1px solid ${T.rule}`, borderTop: `3px solid ${T.orange}`, padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
          <div className="hp-wp">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Image src="/images/waypoint/waypoint-banner-transp.png" alt="WayPoint" width={7086} height={2362} style={{ width: "min(13rem, 60%)", height: "auto" }} />
              <h2 id="hp-wp-title" style={{ ...h2Style(), marginTop: "0.5rem" }}>{c.waypoint.title}</h2>
              <p style={bodyStyle}>{c.waypoint.body}</p>
              <div style={{ paddingTop: "0.5rem" }}>
                <PrimaryLink href="/waypoint" tone="orange">{c.waypoint.cta}</PrimaryLink>
              </div>
            </div>
            <div style={{ position: "relative", aspectRatio: "1024 / 576", borderRadius: 4, overflow: "hidden", boxShadow: "0 40px 70px -40px oklch(30% 0.12 260 / 0.45)" }}>
              <Image src="/images/coaches/tara-room.jpg" alt={c.waypoint.alt} fill sizes="(min-width: 960px) 480px, 100vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </section>

        {/* ── 5. Closing CTA ── */}
        <section aria-labelledby="hp-cta-title" className="hp-cta" style={{ borderTop: `1px solid ${T.navy}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
          <h2 id="hp-cta-title" style={{ ...h2Style(), fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)", lineHeight: 1.06 }}>{c.cta.title}</h2>
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {c.cta.options.map((label, i) => (
              <li key={label} style={{ borderBottom: `1px solid ${T.rule}`, ...(i === 0 ? { borderTop: `1px solid ${T.rule}` } : {}) }}>
                {i === 1 ? (
                  <div className="hp-cta-opt" style={{ flexWrap: "wrap" }}>
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.6rem", color: T.orange, width: "1.75rem", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1 }}>{label}</span>
                    <span style={{ display: "flex", gap: "1.25rem" }}>
                      <Link href="/personal" className="hp-cta-pick">{c.paths.personal.name} <span aria-hidden>&rarr;</span></Link>
                      <Link href="/team" className="hp-cta-pick">{c.paths.team.name} <span aria-hidden>&rarr;</span></Link>
                    </span>
                  </div>
                ) : (
                  <Link href={i === 0 ? (signedIn ? "/dashboard" : "/signup") : "/resources"} className="hp-cta-opt">
                    <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.6rem", color: T.orange, width: "1.75rem", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ flex: 1 }}>{i === 0 && signedIn ? c.hero.ctaIn : label}</span>
                    <span aria-hidden style={{ color: T.orange }}>&rarr;</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
