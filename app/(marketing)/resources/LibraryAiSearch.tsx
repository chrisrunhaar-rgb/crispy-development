"use client";

import { useState } from "react";
import Link from "next/link";
import { RESOURCES } from "@/lib/resources-data";
import { saveResourcesToDashboard } from "./actions";
import { trackResourceSaved } from "@/lib/ga-events";
import { T, SERIF, SANS } from "@/components/promo/PromoKit";

type Pick = { slug: string; reason: string };
type Status = "idle" | "loading" | "done" | "crisis" | "error" | "limit";

const COPY = {
  en: {
    eyebrow: "Ask the library",
    question: "What are you facing right now?",
        placeholder: "e.g. my team avoids hard conversations",
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
        placeholder: "mis. tim saya menghindari percakapan sulit",
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

function buttonStyle(primary: boolean): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48,
    padding: "0.75rem 1.4rem", borderRadius: 2, cursor: "pointer",
    fontFamily: SANS, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
    background: primary ? T.navy : "transparent", color: primary ? T.onNavy : T.navy,
    border: `1.5px solid ${T.navy}`,
  };
}

// Rounded buttons for the results row, same family as the round arrow
function pillStyle(primary: boolean): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48,
    padding: "0.75rem 1.5rem", borderRadius: 999, cursor: "pointer",
    fontFamily: SANS, fontSize: "0.85rem", fontWeight: 700,
    background: primary ? T.orange : "transparent", color: T.navy,
    border: primary ? `1.5px solid ${T.orange}` : `1.5px solid ${T.navy}`,
  };
}

// White field that grows with the text (field-sizing), with a fixed brand-orange arrow centred on the right
const BOX_CSS = `
.lib-ai-box { position: relative; background: oklch(99.5% 0.002 80); border: 1px solid ${T.rule}; border-radius: 4px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.lib-ai-box:focus-within { border-color: ${T.navy}; box-shadow: 0 0 0 1px ${T.navy}; }
.lib-ai-box textarea { display: block; width: 100%; box-sizing: border-box; border: 0; outline: 0; background: transparent; resize: none;
  field-sizing: content; min-height: 3.4rem; max-height: 10rem; padding: 0.9rem 4rem 0.9rem 1rem;
  font-family: ${SANS}; font-size: 1rem; line-height: 1.5; color: ${T.charcoal}; }
.lib-ai-box textarea::placeholder { color: ${T.muted}; }
.lib-ai-box button { position: absolute; right: 0.6rem; top: 50%; translate: 0 -50%; width: 44px; height: 44px; border-radius: 50%; border: 0; cursor: pointer;
  display: grid; place-items: center; background: ${T.orange}; color: ${T.navy}; transition: background-color 0.2s ease, transform 0.15s ease; }
.lib-ai-box button:hover { background: oklch(60% 0.155 45); }
.lib-ai-box button:active { transform: scale(0.94); }
.lib-ai-box button:focus-visible { outline: 2px solid ${T.navy}; outline-offset: 2px; }
.lib-ai-spin { width: 18px; height: 18px; border-radius: 50%; border: 2.4px solid currentColor; border-right-color: transparent; animation: lib-ai-spin 0.8s linear infinite; }
@keyframes lib-ai-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .lib-ai-box, .lib-ai-box button { transition: none; } .lib-ai-spin { animation-duration: 2s; } }
`;

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
  const ready = query.trim().length >= 3;

  function submitMain() {
    if (!ready || loading) return document.getElementById("lib-ai-q")?.focus();
    setShowMore(false);
    setExtra("");
    search(query);
  }

  return (
    <section
      aria-label={c.eyebrow}
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <style>{BOX_CSS}</style>

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
            onSubmit={(e) => { e.preventDefault(); submitMain(); }}
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
          >
            <label htmlFor="lib-ai-q" style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "1.3rem", color: T.navy, lineHeight: 1.2 }}>
              {c.question}
            </label>
            {/* Chat-style box: the text gets the full width, the send arrow sits in the corner */}
            <div className="lib-ai-box">
              <textarea
                id="lib-ai-q"
                rows={2}
                maxLength={600}
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitMain(); } }}
                placeholder={c.placeholder}
              />
              <button type="submit" aria-label={loading && !showMore ? c.finding : c.find} disabled={loading}>
                {loading && !showMore ? (
                  <span className="lib-ai-spin" aria-hidden="true" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
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
                        <button type="button" onClick={addAll} disabled={saving || allSaved} style={{ ...pillStyle(true), opacity: saving ? 0.6 : 1, cursor: allSaved ? "default" : "pointer" }}>
                          {allSaved ? `✓ ${c.added}` : saving ? c.adding : c.addAll}
                        </button>
                      ) : (
                        <Link href="/signup" style={{ ...pillStyle(true), textDecoration: "none" }}>{c.signup}</Link>
                      )}
                      {!showMore && (
                        <button type="button" onClick={() => setShowMore(true)} style={pillStyle(false)}>{c.more}</button>
                      )}
                      <button type="button" onClick={reset} style={{ background: "none", border: "none", minHeight: 44, cursor: "pointer", fontFamily: SANS, fontSize: "0.85rem", fontWeight: 600, color: T.muted, textDecoration: "underline" }}>
                        {c.reset}
                      </button>
                    </div>
                  </>
                )}

                {showMore && (
                  <form
                    onSubmit={(e) => { e.preventDefault(); if (loading) return; if (!extra.trim()) return document.getElementById("lib-ai-more")?.focus(); search(`${query}\n\n${extra}`); }}
                    style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "44rem" }}
                  >
                    <label htmlFor="lib-ai-more" style={{ fontFamily: SANS, fontSize: "0.85rem", fontWeight: 600, color: T.navy }}>{c.moreLabel}</label>
                    <div className="lib-ai-box">
                      <textarea
                        id="lib-ai-more"
                        rows={2}
                        maxLength={600}
                        enterKeyHint="search"
                        value={extra}
                        onChange={(e) => setExtra(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
                        placeholder={c.morePlaceholder}
                      />
                      <button type="submit" aria-label={loading ? c.finding : c.refine} disabled={loading}>
                        {loading ? (
                          <span className="lib-ai-spin" aria-hidden="true" />
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
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
