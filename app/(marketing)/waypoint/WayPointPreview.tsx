"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import {
  T, SERIF, SANS, KIT_CSS, Eyebrow, h2Style, bodyStyle, PrimaryLink, TextLink,
} from "@/components/promo/PromoKit";

/* ─────────────────────────────────────────────────────────────────────────────
   WayPoint page. Same light visual system as the home and pathway pages,
   classes prefixed .wpp.
   ───────────────────────────────────────────────────────────────────────── */
const COPY = {
  en: {
    hero: {
      eyebrow: "WayPoint · AI voice coaching",
      badge: "Beta",
      title: "A private space to think out loud.",
      body: "WayPoint is our AI voice coach. It doesn't give advice. We believe you already carry the answers inside you, and WayPoint helps you find them. Talk it through, out loud, whenever you need to.",
      ctaIn: "Open WayPoint",
      ctaOut: "Start with a free account",
      secondary: "See how it works",
      alt: "Tara, one of the WayPoint coaches, in a warm and quiet room.",
    },
    why: {
      label: "Why WayPoint",
      title: "You already have the answers.",
      body: "WayPoint doesn't coach you by telling you what to do. It makes room for you to hear what you already know.",
      points: [
        { label: "Not advice", title: "Good questions, not ready answers", body: "WayPoint listens and asks. You think and discover. The wisdom you need is often already there. The work is finding it." },
        { label: "Completely confidential", title: "What you say stays with you", body: "Your conversation is private. No one at Crispy Development reads it. Coaching only works when the space is safe, so we built it that way from the start." },
        { label: "Faith-rooted", title: "Bring your whole self", body: "Faith is welcome here. Not pushed, simply present. WayPoint makes room for the spiritual side of cross-cultural leadership." },
        { label: "Always available", title: "There when you need it", body: "No scheduling and no waiting list. In a season of change, carrying tension from the week, or just needing space to think, open a conversation." },
      ],
    },
    coaches: {
      label: "Two coaches",
      title: "Pick the voice that suits you.",
      body: "Both coaches ask good questions. They just ask them differently. You can switch whenever you like.",
      list: [
        { name: "Tara", style: "Warm, reflective, clarity-focused", img: "/images/coaches/tara-room.jpg", alt: "Tara, a WayPoint coach, in a warm and quiet room." },
        { name: "Ethan", style: "Direct, strategic, action-oriented", img: "/images/coaches/ethan-room.jpg", alt: "Ethan, a WayPoint coach, in a calm study." },
      ],
    },
    how: {
      label: "How it works",
      title: "Simple, and you stay in charge.",
      steps: [
        { title: "Create a free account", body: "It takes a minute. No card needed to sign up." },
        { title: "Choose your coach", body: "Tara or Ethan. Then start talking about whatever is on your mind." },
        { title: "Keep what you learn", body: "Take the key thoughts with you, and come back whenever you need to." },
      ],
      priceLabel: "Coaching hours",
      priceNote: "Buy hours once and use them whenever you like. No subscription.",
      prices: [
        { hours: "1 hour", price: "$10", note: "" },
        { hours: "3 hours", price: "$25", note: "" },
        { hours: "5 hours", price: "$37", note: "Best value" },
      ],
    },
    mark: {
      label: "The WayPoint mark",
      items: [
        { label: "Compass rose", title: "Orientation.", body: "Finding your footing in unfamiliar terrain." },
        { label: "Location pin", title: "Destination.", body: "Knowing where you're headed." },
      ],
      close: "WayPoint helps you find both.",
    },
    care: {
      text: "WayPoint is a thinking tool. It does not replace pastoral care, human community or professional support. If you are in crisis, please reach out to someone near you.",
      linksLabel: "Find help near you:",
    },
    cta: {
      title: "Ready to think out loud?",
      bodyIn: "WayPoint is waiting in your account. Pick a coach and start.",
      bodyOut: "Create a free account, pick a coach and start your first conversation.",
      library: "Browse the library",
    },
  },
  id: {
    hero: {
      eyebrow: "WayPoint · Coaching suara AI",
      badge: "Beta",
      title: "Ruang pribadi untuk berpikir dengan bersuara.",
      body: "WayPoint adalah pelatih suara AI kami. WayPoint tidak memberi nasihat. Kami percaya Anda sudah membawa jawabannya di dalam diri Anda, dan WayPoint membantu Anda menemukannya. Bicarakan dengan bersuara, kapan pun Anda perlu.",
      ctaIn: "Buka WayPoint",
      ctaOut: "Mulai dengan akun gratis",
      secondary: "Lihat cara kerjanya",
      alt: "Tara, salah satu pelatih WayPoint, di ruangan yang hangat dan tenang.",
    },
    why: {
      label: "Mengapa WayPoint",
      title: "Anda sudah memiliki jawabannya.",
      body: "WayPoint tidak melatih Anda dengan memberi tahu apa yang harus dilakukan. WayPoint memberi ruang agar Anda bisa mendengar apa yang sudah Anda ketahui.",
      points: [
        { label: "Bukan nasihat", title: "Pertanyaan yang baik, bukan jawaban siap pakai", body: "WayPoint mendengarkan dan bertanya. Anda berpikir dan menemukan. Hikmat yang Anda butuhkan sering sudah ada. Tugasnya adalah menemukannya." },
        { label: "Sepenuhnya rahasia", title: "Apa yang Anda katakan tetap milik Anda", body: "Percakapan Anda bersifat pribadi. Tidak ada seorang pun di Crispy Development yang membacanya. Coaching hanya berhasil bila ruangnya aman, jadi kami membangunnya seperti itu sejak awal." },
        { label: "Berakar pada iman", title: "Bawa diri Anda sepenuhnya", body: "Iman diterima di sini. Tidak dipaksakan, hanya hadir. WayPoint memberi ruang bagi sisi rohani dari kepemimpinan lintas budaya." },
        { label: "Selalu tersedia", title: "Ada saat Anda membutuhkannya", body: "Tanpa jadwal dan tanpa daftar tunggu. Saat masa transisi, saat membawa beban dari minggu ini, atau saat butuh ruang untuk berpikir, mulailah percakapan." },
      ],
    },
    coaches: {
      label: "Dua pelatih",
      title: "Pilih suara yang cocok untuk Anda.",
      body: "Kedua pelatih mengajukan pertanyaan yang baik, hanya dengan cara yang berbeda. Anda bisa berganti kapan saja.",
      list: [
        { name: "Tara", style: "Hangat, reflektif, berfokus pada kejelasan", img: "/images/coaches/tara-room.jpg", alt: "Tara, pelatih WayPoint, di ruangan yang hangat dan tenang." },
        { name: "Ethan", style: "Lugas, strategis, berorientasi tindakan", img: "/images/coaches/ethan-room.jpg", alt: "Ethan, pelatih WayPoint, di ruang kerja yang tenang." },
      ],
    },
    how: {
      label: "Cara kerjanya",
      title: "Sederhana, dan Anda tetap memegang kendali.",
      steps: [
        { title: "Buat akun gratis", body: "Hanya butuh satu menit. Tidak perlu kartu untuk mendaftar." },
        { title: "Pilih pelatih Anda", body: "Tara atau Ethan. Lalu mulailah berbicara tentang apa pun yang ada di pikiran Anda." },
        { title: "Simpan apa yang Anda pelajari", body: "Bawa pemikiran penting bersama Anda, dan kembalilah kapan pun Anda perlu." },
      ],
      priceLabel: "Jam coaching",
      priceNote: "Beli jam sekali dan gunakan kapan saja. Tanpa langganan.",
      prices: [
        { hours: "1 jam", price: "$10", note: "" },
        { hours: "3 jam", price: "$25", note: "" },
        { hours: "5 jam", price: "$37", note: "Paling hemat" },
      ],
    },
    mark: {
      label: "Logo WayPoint",
      items: [
        { label: "Mawar kompas", title: "Orientasi.", body: "Menemukan pijakan di medan yang asing." },
        { label: "Penanda lokasi", title: "Tujuan.", body: "Mengetahui ke mana Anda menuju." },
      ],
      close: "WayPoint membantu Anda menemukan keduanya.",
    },
    care: {
      text: "WayPoint adalah alat berpikir. WayPoint tidak menggantikan pendampingan pastoral, komunitas, atau bantuan profesional. Jika Anda sedang dalam krisis, hubungi seseorang di dekat Anda.",
      linksLabel: "Cari bantuan di dekat Anda:",
    },
    cta: {
      title: "Siap berpikir dengan bersuara?",
      bodyIn: "WayPoint sudah menunggu di akun Anda. Pilih pelatih dan mulailah.",
      bodyOut: "Buat akun gratis, pilih pelatih, dan mulai percakapan pertama Anda.",
      library: "Jelajahi perpustakaan",
    },
  },
} as const;

const CSS = `
.wpp { display: flex; flex-direction: column; gap: clamp(4rem, 9vw, 7.5rem); }
.wpp-hero, .wpp-split, .wpp-cta, .wpp-how { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(2rem, 5vw, 4rem); }
.wpp-grid2 { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1.25rem; }
.wpp-steps { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; list-style: none; margin: 0; padding: 0; }
.wpp-prices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; }
.wpp-mark { display: grid; grid-template-columns: minmax(0, 1fr); gap: clamp(2rem, 5vw, 4rem); align-items: center; }
@media (min-width: 700px) {
  .wpp-grid2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 960px) {
  .wpp-hero { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); align-items: center; }
  .wpp-split { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
  .wpp-how { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: start; }
  .wpp-cta { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); align-items: start; }
  .wpp-mark { grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); }
}
`;

export default function WayPointPreview({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { lang: rawLang } = useLanguage();
  const lang = rawLang === "id" ? "id" : "en";
  const c = COPY[lang];
  const startHref = isLoggedIn ? "/coach" : "/signup?redirectTo=/coach";
  const startLabel = isLoggedIn ? c.hero.ctaIn : c.hero.ctaOut;

  return (
    <div className="container-wide" style={{ paddingBlock: "clamp(3rem, 7vw, 5.5rem)" }}>
      <div className="wpp" lang={lang}>
        <style>{KIT_CSS + CSS}</style>

        {/* ── 1. Hero ── */}
        <section className="wpp-hero" aria-labelledby="wpp-hero-title">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Image className="pk-rise" src="/images/waypoint/waypoint-banner-transp.png" alt="WayPoint" width={7086} height={2362} priority style={{ width: "min(14rem, 65%)", height: "auto" }} />
            <div className="pk-rise" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", animationDelay: "60ms" }}>
              <Eyebrow>{c.hero.eyebrow}</Eyebrow>
              <span style={{ fontFamily: SANS, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.onNavy, background: T.orangeDeep, padding: "0.22rem 0.6rem", borderRadius: 2 }}>
                {c.hero.badge}
              </span>
            </div>
            <h1 id="wpp-hero-title" className="pk-rise" style={{
              fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, margin: 0,
              fontSize: "clamp(2.6rem, 5.6vw, 4.2rem)", lineHeight: 1.02, letterSpacing: "-0.01em",
              color: T.navy, textWrap: "balance", animationDelay: "120ms",
            }}>
              {c.hero.title}
            </h1>
            <p className="pk-rise" style={{ ...bodyStyle, fontSize: "1.02rem", maxWidth: "48ch", animationDelay: "180ms" }}>{c.hero.body}</p>
            <div className="pk-rise" style={{ animationDelay: "240ms", paddingTop: "0.25rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem 1.5rem" }}>
              <PrimaryLink href={startHref} tone="orange">{startLabel}</PrimaryLink>
              <TextLink href="#wpp-how-title">{c.hero.secondary}</TextLink>
            </div>
          </div>
          <div className="pk-rise" style={{ position: "relative", aspectRatio: "1024 / 576", borderRadius: 4, overflow: "hidden", boxShadow: "0 40px 70px -40px oklch(30% 0.12 260 / 0.45)", animationDelay: "200ms" }}>
            <Image src="/images/coaches/tara-room.jpg" alt={c.hero.alt} fill priority sizes="(min-width: 960px) 560px, 100vw" style={{ objectFit: "cover" }} />
          </div>
        </section>

        {/* ── 2. Why WayPoint ── */}
        <section aria-labelledby="wpp-why-title" style={{ borderTop: `1px solid ${T.rule}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)", display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>
          <div className="wpp-split">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Eyebrow>{c.why.label}</Eyebrow>
              <h2 id="wpp-why-title" style={h2Style()}>{c.why.title}</h2>
            </div>
            <p style={{ ...bodyStyle, alignSelf: "end" }}>{c.why.body}</p>
          </div>
          <div className="wpp-grid2">
            {c.why.points.map((pt, i) => (
              <article key={pt.label} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "clamp(1.5rem, 3vw, 2.25rem)", border: `1px solid ${T.rule}`, borderTop: `3px solid ${i % 2 === 0 ? T.navy : T.orange}`, borderRadius: 2, background: T.offWhite }}>
                <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.muted }}>
                  <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.1rem", letterSpacing: 0, color: T.navyMid, marginRight: "0.6rem" }}>{String(i + 1).padStart(2, "0")}</span>
                  {pt.label}
                </p>
                <h3 style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.4rem, 2.4vw, 1.7rem)", lineHeight: 1.15, color: T.navy }}>{pt.title}</h3>
                <p style={{ ...bodyStyle, fontSize: "0.92rem" }}>{pt.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 3. Coaches ── */}
        <section aria-labelledby="wpp-coach-title" style={{ background: T.band, padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 4.5vw, 3.5rem)", display: "flex", flexDirection: "column", gap: "clamp(2rem, 4vw, 3rem)" }}>
          <div className="wpp-split">
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Eyebrow>{c.coaches.label}</Eyebrow>
              <h2 id="wpp-coach-title" style={h2Style()}>{c.coaches.title}</h2>
            </div>
            <p style={{ ...bodyStyle, alignSelf: "end" }}>{c.coaches.body}</p>
          </div>
          <div className="wpp-grid2">
            {c.coaches.list.map(coach => (
              <figure key={coach.name} style={{ margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ position: "relative", aspectRatio: "1024 / 576", borderRadius: 4, overflow: "hidden", boxShadow: "0 30px 60px -40px oklch(30% 0.12 260 / 0.45)" }}>
                  <Image src={coach.img} alt={coach.alt} fill sizes="(min-width: 700px) 50vw, 100vw" style={{ objectFit: "cover" }} />
                </div>
                <figcaption style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "1.9rem", lineHeight: 1.1, color: T.navy }}>{coach.name}</span>
                  <span style={{ fontFamily: SANS, fontSize: "0.88rem", fontWeight: 600, color: T.body }}>{coach.style}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── 4. How it works + hours ── */}
        <section aria-labelledby="wpp-how-title" className="wpp-how" style={{ scrollMarginTop: "6rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Eyebrow>{c.how.label}</Eyebrow>
            <h2 id="wpp-how-title" style={{ ...h2Style(), scrollMarginTop: "6rem" }}>{c.how.title}</h2>
            <ol className="wpp-steps">
              {c.how.steps.map((step, i) => (
                <li key={step.title} style={{ borderTop: `1px solid ${T.rule}`, padding: "1.1rem 0 1.25rem", display: "grid", gridTemplateColumns: "2.5rem minmax(0, 1fr)", gap: "0.25rem 0.75rem" }}>
                  <span aria-hidden="true" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "1.5rem", lineHeight: 1, color: T.navyMid }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <span style={{ fontFamily: SANS, fontSize: "0.95rem", fontWeight: 700, color: T.charcoal }}>{step.title}</span>
                    <span style={{ fontFamily: SANS, fontSize: "0.9rem", lineHeight: 1.65, color: T.body }}>{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div style={{ border: `1px solid ${T.rule}`, borderTop: `3px solid ${T.orange}`, borderRadius: 2, padding: "clamp(1.5rem, 3vw, 2.25rem)", display: "flex", flexDirection: "column", gap: "1.25rem", background: T.offWhite }}>
            <h3 style={{ margin: 0, fontFamily: SANS, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: T.muted }}>{c.how.priceLabel}</h3>
            <div className="wpp-prices">
              {c.how.prices.map(p => (
                <div key={p.hours} style={{ display: "flex", flexDirection: "column", gap: "0.35rem", padding: "1rem 0.75rem", border: `1px solid ${p.note ? T.orange : T.rule}`, borderRadius: 2, textAlign: "center" }}>
                  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.9rem, 4vw, 2.4rem)", lineHeight: 1, color: T.navy }}>{p.price}</span>
                  <span style={{ fontFamily: SANS, fontSize: "0.8rem", fontWeight: 600, color: T.body }}>{p.hours}</span>
                  {p.note && <span style={{ fontFamily: SANS, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.orangeDeep }}>{p.note}</span>}
                </div>
              ))}
            </div>
            <p style={{ ...bodyStyle, fontSize: "0.88rem" }}>{c.how.priceNote}</p>
            <div>
              <PrimaryLink href={startHref} tone="orange">{startLabel}</PrimaryLink>
            </div>
          </div>
        </section>

        {/* ── 5. The mark ── */}
        <section aria-label={c.mark.label} style={{ background: T.navyDeep, padding: "clamp(2.5rem, 6vw, 4.5rem) clamp(1.25rem, 4.5vw, 3.5rem)" }}>
          <div className="wpp-mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/waypoint/waypoint-logo-circle.png" alt="" style={{ width: "100%", maxWidth: "16rem", height: "auto", display: "block", margin: "0 auto" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", borderLeft: `2px solid oklch(65% 0.15 45 / 0.45)`, paddingLeft: "clamp(1.25rem, 3vw, 2.5rem)" }}>
              <Eyebrow onDark>{c.mark.label}</Eyebrow>
              {c.mark.items.map(item => (
                <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: T.orange }}>{item.label}</p>
                  <p style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.5rem, 2.5vw, 1.9rem)", lineHeight: 1.1, color: T.onNavy }}>{item.title}</p>
                  <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.9rem", lineHeight: 1.7, color: T.onNavyBody }}>{item.body}</p>
                </div>
              ))}
              <p style={{ margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)", lineHeight: 1.2, color: T.onNavy }}>{c.mark.close}</p>
            </div>
          </div>
        </section>

        {/* ── 6. Care note ── */}
        <aside style={{ maxWidth: "66ch", padding: "1.5rem 1.75rem", background: T.band, borderLeft: `3px solid ${T.orange}`, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ ...bodyStyle, fontSize: "0.9rem" }}>{c.care.text}</p>
          <p style={{ margin: 0, fontFamily: SANS, fontSize: "0.88rem", color: T.body, display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem", alignItems: "baseline" }}>
            <span>{c.care.linksLabel}</span>
            <a className="pk-link" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: T.navy }}>findahelpline.com</a>
            <a className="pk-link" href="https://befrienders.org" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: T.navy }}>befrienders.org</a>
          </p>
        </aside>

        {/* ── 7. Closing CTA ── */}
        <section aria-labelledby="wpp-cta-title" className="wpp-cta" style={{ borderTop: `1px solid ${T.navy}`, paddingTop: "clamp(2.5rem, 5vw, 3.5rem)" }}>
          <h2 id="wpp-cta-title" style={{ ...h2Style(), fontSize: "clamp(2.2rem, 4.6vw, 3.4rem)", lineHeight: 1.06 }}>{c.cta.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "flex-start" }}>
            <p style={bodyStyle}>{isLoggedIn ? c.cta.bodyIn : c.cta.bodyOut}</p>
            <PrimaryLink href={startHref} tone="orange">{startLabel}</PrimaryLink>
            <TextLink href="/resources">{c.cta.library}</TextLink>
          </div>
        </section>
      </div>
    </div>
  );
}
