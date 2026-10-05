"use client";

import { useState } from "react";
import Link from "next/link";
import { RESOURCES } from "@/lib/resources-data";
import { saveResourcesToDashboard } from "./actions";
import { trackResourceSaved } from "@/lib/ga-events";
import { T, SERIF, SANS, Eyebrow, PrimaryLink } from "@/components/promo/PromoKit";

type Pick = { slug: string; reason: string };
type Status = "idle" | "loading" | "done" | "crisis" | "error" | "limit";

const COPY = {
  en: {
    eyebrow: "Ask the library",
    question: "What are you facing right now?",
    hint: "Describe it in a sentence or two. We'll point you to the modules that fit.",
    placeholder: "For example: my team avoids hard conversations and small issues keep growing.",
    find: "Find modules",
    finding: "Looking...",
    picksFor: "Modules that fit what you described",
    none: "Nothing in the library matches that closely. Try describing it another way.",
    addAll: "Add these to my dashboard",
    adding: "Adding...",
    added: "Added to your dashboard",
    signup: "Create a free account to save these",
    more: "Tell me more",
    moreLabel: "Add more detail to sharpen the picks",
    morePlaceholder: "What else is going on?",
    refine: "Update picks",
    reset: "Start over",
    error: "The search isn't working right now. Please try again in a minute, or use the keyword search.",
    limit: "You've reached today's limit of 20 searches. The keyword search still works, and this resets tomorrow.",
    crisisTitle: "It sounds like you're carrying something heavy.",
    crisisBody: "A module isn't the right next step for this. Please talk to someone today: a trusted friend, your pastor, or a local helpline. These directories list free, confidential helplines in your country.",
    crisisBack: "Back to the search",
  },
  id: {
    eyebrow: "Tanya perpustakaan",
    question: "Apa yang sedang Anda hadapi saat ini?",
    hint: "Ceritakan dalam satu atau dua kalimat. Kami akan menunjukkan modul yang cocok.",
    placeholder: "Contoh: tim saya menghindari percakapan sulit dan masalah kecil terus membesar.",
    find: "Cari modul",
    finding: "Mencari...",
    picksFor: "Modul yang cocok dengan situasi Anda",
    none: "Belum ada modul yang benar-benar cocok. Coba ceritakan dengan cara lain.",
    addAll: "Tambahkan ke dasbor saya",
    adding: "Menambahkan...",
    added: "Sudah ditambahkan ke dasbor",
    signup: "Buat akun gratis untuk menyimpannya",
    more: "Ceritakan lebih banyak",
    moreLabel: "Tambahkan detail agar pilihannya lebih tepat",
    morePlaceholder: "Apa lagi yang sedang terjadi?",
    refine: "Perbarui pilihan",
    reset: "Mulai lagi",
    error: "Pencarian sedang tidak berfungsi. Coba lagi sebentar lagi, atau gunakan pencarian kata kunci.",
    limit: "Anda sudah mencapai batas 20 pencarian hari ini. Pencarian kata kunci tetap bisa dipakai, dan batasnya diatur ulang besok.",
    crisisTitle: "Sepertinya Anda sedang menanggung sesuatu yang berat.",
    crisisBody: "Modul bukan langkah yang tepat untuk ini. Bicaralah dengan seseorang hari ini: sahabat yang Anda percayai, pendeta Anda, atau layanan bantuan setempat. Direktori ini memuat layanan bantuan gratis dan rahasia di negara Anda.",
    crisisBack: "Kembali ke pencarian",
  },
};

const fieldStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "0.85rem 1rem",
  fontFamily: SANS, fontSize: "0.95rem", lineHeight: 1.5, color: T.charcoal,
  background: "oklch(99.5% 0.002 80)", border: `1px solid ${T.rule}`, borderRadius: 2, resize: "vertical",
};

function buttonStyle(primary: boolean): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48,
    padding: "0.75rem 1.4rem", borderRadius: 2, cursor: "pointer",
    fontFamily: SANS, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
    background: primary ? T.navy : "transparent", color: primary ? T.onNavy : T.navy,
    border: `1.5px solid ${T.navy}`,
  };
}

export default function LibraryAiSearch({
  lang,
  userId,
  savedSlugs,
  onSaved,
}: {
  lang: "en" | "id";
  userId: string | null;
  savedSlugs: Set<string>;
  onSaved: (slugs: string[]) => void;
}) {
  const c = COPY[lang];
  const [query, setQuery] = useState("");
  const [extra, setExtra] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [picks, setPicks] = useState<Pick[]>([]);
  const [saving, setSaving] = useState(false);

  async function search(text: string) {
    if (text.trim().length < 3) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/library-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, lang }),
      });
      if (res.status === 429) return setStatus("limit");
      if (!res.ok) return setStatus("error");
      const data = (await res.json()) as { crisis: boolean; picks: Pick[] };
      if (data.crisis) return setStatus("crisis");
      setPicks(data.picks);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setQuery("");
    setExtra("");
    setShowMore(false);
    setPicks([]);
    setStatus("idle");
  }

  async function addAll() {
    const slugs = picks.map((p) => p.slug).filter((s) => !savedSlugs.has(s));
    if (slugs.length === 0) return;
    setSaving(true);
    const { error } = await saveResourcesToDashboard(slugs);
    setSaving(false);
    if (error) return setStatus("error");
    slugs.forEach((s) => trackResourceSaved(s, true));
    onSaved(slugs);
  }

  const allSaved = picks.length > 0 && picks.every((p) => savedSlugs.has(p.slug));
  const loading = status === "loading";

  return (
    <section
      aria-label={c.eyebrow}
      style={{ background: T.band, padding: "clamp(1.5rem, 4vw, 2.5rem)", display: "flex", flexDirection: "column", gap: "1.1rem" }}
    >
      <Eyebrow>{c.eyebrow}</Eyebrow>

      {status === "crisis" ? (
        <div role="alert" style={{ display: "flex", flexDirection: "column", gap: "0.9rem", maxWidth: "44rem" }}>
          <h2 style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: T.navy, margin: 0 }}>
            {c.crisisTitle}
          </h2>
          <p style={{ fontFamily: SANS, fontSize: "0.95rem", lineHeight: 1.6, color: T.body, margin: 0 }}>{c.crisisBody}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="pk-btn" style={{ ...buttonStyle(true), textDecoration: "none" }}>findahelpline.com</a>
            <a href="https://befrienders.org" target="_blank" rel="noopener noreferrer" style={{ ...buttonStyle(false), textDecoration: "none" }}>befrienders.org</a>
          </div>
          <button onClick={reset} style={{ alignSelf: "flex-start", background: "none", border: "none", padding: "0.5rem 0", minHeight: 44, cursor: "pointer", fontFamily: SANS, fontSize: "0.85rem", fontWeight: 600, color: T.muted, textDecoration: "underline" }}>
            {c.crisisBack}
          </button>
        </div>
      ) : (
        <>
          <form
            onSubmit={(e) => { e.preventDefault(); setShowMore(false); setExtra(""); search(query); }}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "44rem" }}
          >
            <label htmlFor="lib-ai-q" style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.5rem, 3vw, 2rem)", color: T.navy, lineHeight: 1.15 }}>
              {c.question}
            </label>
            <p style={{ fontFamily: SANS, fontSize: "0.85rem", color: T.muted, margin: 0 }}>{c.hint}</p>
            <textarea
              id="lib-ai-q"
              className="lib-search"
              rows={3}
              maxLength={600}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={c.placeholder}
              style={fieldStyle}
            />
            <div>
              <button type="submit" className="pk-btn" disabled={loading || query.trim().length < 3} style={{ ...buttonStyle(true), opacity: loading || query.trim().length < 3 ? 0.6 : 1 }}>
                {loading && !showMore ? c.finding : c.find}
              </button>
            </div>
          </form>

          <div aria-live="polite">
            {status === "error" && <p style={{ fontFamily: SANS, fontSize: "0.9rem", color: T.body, margin: 0 }}>{c.error}</p>}
            {status === "limit" && <p style={{ fontFamily: SANS, fontSize: "0.9rem", color: T.body, margin: 0 }}>{c.limit}</p>}

            {(status === "done" || (status === "loading" && showMore)) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "0.5rem" }}>
                {picks.length === 0 ? (
                  <p style={{ fontFamily: SANS, fontSize: "0.9rem", color: T.body, margin: 0 }}>{c.none}</p>
                ) : (
                  <>
                    <p style={{ fontFamily: SANS, fontSize: "0.8rem", fontWeight: 600, color: T.muted, margin: 0 }}>{c.picksFor}</p>
                    <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 16rem), 1fr))" }}>
                      {picks.map((p, i) => {
                        const r = RESOURCES.find((x) => x.slug === p.slug);
                        if (!r) return null;
                        const title = lang === "id" && r.titleId ? r.titleId : r.title;
                        return (
                          <li key={p.slug} style={{ background: "oklch(99.5% 0.002 80)", border: `1px solid ${T.rule}`, borderTop: `3px solid ${T.orange}`, padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                            <span style={{ fontFamily: SANS, fontSize: "0.7rem", fontWeight: 700, color: T.orangeDeep }}>{i + 1}</span>
                            <Link href={`/resources/${p.slug}`} className="pk-link" style={{ fontFamily: SANS, fontSize: "0.95rem", fontWeight: 700, color: T.navy }}>
                              {title}
                            </Link>
                            <p style={{ fontFamily: SANS, fontSize: "0.85rem", lineHeight: 1.55, color: T.body, margin: 0 }}>{p.reason}</p>
                          </li>
                        );
                      })}
                    </ol>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                      {userId ? (
                        <button type="button" onClick={addAll} disabled={saving || allSaved} className="pk-btn" style={{ ...buttonStyle(true), opacity: saving ? 0.6 : 1, cursor: allSaved ? "default" : "pointer" }}>
                          {allSaved ? `✓ ${c.added}` : saving ? c.adding : c.addAll}
                        </button>
                      ) : (
                        <PrimaryLink href="/signup">{c.signup}</PrimaryLink>
                      )}
                      {!showMore && (
                        <button type="button" onClick={() => setShowMore(true)} style={buttonStyle(false)}>{c.more}</button>
                      )}
                      <button type="button" onClick={reset} style={{ background: "none", border: "none", minHeight: 44, cursor: "pointer", fontFamily: SANS, fontSize: "0.85rem", fontWeight: 600, color: T.muted, textDecoration: "underline" }}>
                        {c.reset}
                      </button>
                    </div>
                  </>
                )}

                {showMore && (
                  <form
                    onSubmit={(e) => { e.preventDefault(); if (extra.trim()) search(`${query}\n\n${extra}`); }}
                    style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "44rem" }}
                  >
                    <label htmlFor="lib-ai-more" style={{ fontFamily: SANS, fontSize: "0.85rem", fontWeight: 600, color: T.navy }}>{c.moreLabel}</label>
                    <textarea id="lib-ai-more" className="lib-search" rows={2} maxLength={600} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={c.morePlaceholder} style={fieldStyle} />
                    <div>
                      <button type="submit" className="pk-btn" disabled={loading || !extra.trim()} style={{ ...buttonStyle(true), opacity: loading || !extra.trim() ? 0.6 : 1 }}>
                        {loading ? c.finding : c.refine}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
