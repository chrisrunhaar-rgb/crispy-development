"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { RESOURCES } from "@/lib/resources-data";
import { saveResourcesToDashboard } from "@/app/(marketing)/resources/actions";
import { trackResourceSaved } from "@/lib/ga-events";
import { T, SERIF, SANS } from "@/components/promo/PromoKit";

// Floating "Need help?" module finder for paid members on /resources and /dashboard.
// It only finds modules (via /api/library-search) and never gives advice.

type Pick = { slug: string; reason: string };
type Lang = "en" | "id";

// Messages store copy keys, not text, so the chat follows a language switch
type BotKey = "greet" | "helpful" | "refineAsk" | "saveAsk" | "saved" | "alreadySaved" | "none" | "error" | "limit";
type Msg =
  | { id: number; from: "bot"; key: BotKey }
  | { id: number; from: "user"; text: string }
  | { id: number; from: "bot"; key: "picks"; picks: Pick[] }
  | { id: number; from: "bot"; key: "crisis" };

// Omit that keeps the union apart, so each message shape is checked on its own
type NewMsg = Msg extends infer M ? (M extends Msg ? Omit<M, "id"> : never) : never;

// ask = first question, refine = adding words, feedback = Yes/Something else, save = Save button, end = only Start over
type Stage = "ask" | "loading" | "feedback" | "refine" | "save" | "saving" | "end";

type Stored = { msgs: Msg[]; stage: Stage; base: string; picks: Pick[]; inputStage: "ask" | "refine" };

const STORE_KEY = "crispy-chat-helper-v1";
const CONSENT_KEY = "cookie_consent"; // same key as components/CookieConsent.tsx
const MAX_CHARS = 1200; // same limit as /api/library-search

const COPY = {
  en: {
    bubble: "Need help?",
    title: "Find a module",
    dialog: "Module finder chat",
    greet: "Hi! Need help finding the right module? Tell me what you're facing.",
    placeholder: "e.g. my team avoids hard conversations",
    refinePlaceholder: "Add a few words",
    inputLabel: "Describe what you're facing",
    refineLabel: "Add a few words to sharpen the picks",
    picksIntro: "These modules fit what you described:",
    helpful: "Is this helpful, or were you looking for something else?",
    yes: "Yes",
    else: "Something else",
    refineAsk: "Sure. Tell me a bit more about what you're looking for.",
    saveAsk: "Shall I save these to My Pathway?",
    save: "Save",
    saving: "Saving...",
    saved: "Saved to My Pathway.",
    alreadySaved: "These are already in My Pathway.",
    toDashboard: "Go to Home",
    none: "Nothing in the library matches that closely. Could you describe it another way?",
    error: "Something went wrong on my side. Please try again in a minute.",
    limit: "You've reached today's limit of 20 searches. You can still browse the library, and this resets tomorrow.",
    crisisTitle: "It sounds like you're carrying something heavy.",
    crisisBody: "A module isn't the right next step for this. Please talk to someone today: a trusted friend, your pastor, or a local helpline. These directories list free, confidential helplines in your country.",
    send: "Send",
    thinking: "Looking...",
    restart: "Start over",
    close: "Close",
  },
  id: {
    bubble: "Butuh bantuan?",
    title: "Cari modul",
    dialog: "Obrolan pencari modul",
    greet: "Halo! Butuh bantuan menemukan modul yang tepat? Ceritakan apa yang sedang Anda hadapi.",
    placeholder: "mis. tim saya menghindari percakapan sulit",
    refinePlaceholder: "Tambahkan beberapa kata",
    inputLabel: "Ceritakan apa yang Anda hadapi",
    refineLabel: "Tambahkan beberapa kata agar pilihannya lebih tepat",
    picksIntro: "Modul ini cocok dengan situasi Anda:",
    helpful: "Apakah ini membantu, atau Anda mencari hal lain?",
    yes: "Ya",
    else: "Hal lain",
    refineAsk: "Baik. Ceritakan sedikit lagi apa yang Anda cari.",
    saveAsk: "Apakah modul ini saya simpan ke My Pathway Anda?",
    save: "Simpan",
    saving: "Menyimpan...",
    saved: "Sudah disimpan ke My Pathway Anda.",
    alreadySaved: "Modul ini sudah ada di My Pathway Anda.",
    toDashboard: "Buka Home",
    none: "Belum ada modul yang benar-benar cocok. Bisa Anda ceritakan dengan cara lain?",
    error: "Ada yang tidak beres di pihak kami. Silakan coba lagi sebentar lagi.",
    limit: "Anda sudah mencapai batas 20 pencarian hari ini. Anda tetap bisa menjelajah perpustakaan, dan batasnya diatur ulang besok.",
    crisisTitle: "Sepertinya Anda sedang menanggung sesuatu yang berat.",
    crisisBody: "Modul bukan langkah yang tepat untuk ini. Bicaralah dengan seseorang hari ini: sahabat yang Anda percayai, pendeta Anda, atau layanan bantuan setempat. Direktori ini memuat layanan bantuan gratis dan rahasia di negara Anda.",
    send: "Kirim",
    thinking: "Mencari...",
    restart: "Mulai lagi",
    close: "Tutup",
  },
};

const FRESH: Stored = { msgs: [{ id: 1, from: "bot", key: "greet" }], stage: "ask", base: "", picks: [], inputStage: "ask" };

function readStore(): Stored | null {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Stored;
    if (!Array.isArray(s.msgs) || s.msgs.length === 0) return null;
    // A search that was still running when the page changed is dropped back to its input
    if (s.stage === "loading") s.stage = s.inputStage;
    if (s.stage === "saving") s.stage = "save";
    return s;
  } catch {
    return null;
  }
}

function writeStore(s: Stored) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    // Private mode or blocked storage: the chat still works, it just isn't remembered
  }
}

function consentAnswered(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) !== null;
  } catch {
    return true;
  }
}

const CSS = `
.mch-bubble { position: fixed; right: 16px; bottom: calc(88px + env(safe-area-inset-bottom, 0px)); z-index: 150;
  display: inline-flex; align-items: center; gap: 0.5rem; min-height: 48px; padding: 0 1.15rem 0 0.95rem; border-radius: 999px; border: 0; cursor: pointer;
  background: ${T.orange}; color: ${T.navyDeep}; font-family: ${SANS}; font-size: 0.875rem; font-weight: 700;
  box-shadow: 0 6px 20px oklch(22% 0.10 260 / 0.22); transition: background-color 0.2s ease, transform 0.15s ease; }
.mch-bubble:hover { background: oklch(60% 0.155 45); }
.mch-bubble:active { transform: scale(0.96); }
.mch-bubble:focus-visible, .mch-panel :focus-visible { outline: 2px solid ${T.navy}; outline-offset: 2px; }
.mch-panel { position: fixed; right: 12px; bottom: calc(88px + env(safe-area-inset-bottom, 0px)); z-index: 150;
  width: min(380px, calc(100vw - 24px)); height: min(560px, calc(100dvh - 88px - env(safe-area-inset-bottom, 0px) - 24px));
  display: flex; flex-direction: column; background: ${T.offWhite}; border: 1px solid ${T.rule}; border-radius: 10px; overflow: hidden;
  box-shadow: 0 16px 48px oklch(22% 0.10 260 / 0.28); animation: mch-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes mch-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.mch-icon-btn { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; border: 0; background: transparent; color: ${T.onNavy}; cursor: pointer; }
.mch-icon-btn:hover { background: oklch(97% 0.005 80 / 0.12); }
.mch-panel .mch-icon-btn:focus-visible { outline-color: ${T.onNavy}; }
.mch-log { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; overscroll-behavior: contain; }
.mch-bot { align-self: flex-start; max-width: 92%; font-family: ${SANS}; font-size: 0.9rem; line-height: 1.55; color: ${T.charcoal}; margin: 0; }
.mch-user { align-self: flex-end; max-width: 85%; background: ${T.navy}; color: ${T.onNavy}; padding: 0.6rem 0.85rem; border-radius: 14px 14px 4px 14px;
  font-family: ${SANS}; font-size: 0.9rem; line-height: 1.5; margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
.mch-card { background: oklch(99.5% 0.002 80); border: 1px solid ${T.rule}; border-radius: 6px; padding: 0.75rem 0.85rem; display: flex; flex-direction: column; gap: 0.3rem; }
.mch-card a { font-family: ${SANS}; font-size: 0.9rem; font-weight: 700; color: ${T.navy}; text-decoration: underline; text-decoration-color: ${T.rule}; text-underline-offset: 3px;
  min-height: 44px; display: flex; align-items: center; margin: -0.6rem 0 -0.4rem; }
.mch-card a:hover { text-decoration-color: ${T.navy}; }
.mch-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.mch-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 1.1rem; border-radius: 999px; cursor: pointer;
  font-family: ${SANS}; font-size: 0.85rem; font-weight: 700; border: 1.5px solid ${T.navy}; background: transparent; color: ${T.navy}; text-decoration: none;
  transition: background-color 0.2s ease; }
.mch-btn:hover { background: oklch(30% 0.12 260 / 0.06); }
.mch-btn-primary { background: ${T.navy}; color: ${T.onNavy}; }
.mch-btn-primary:hover { background: ${T.navyMid}; }
.mch-btn[disabled] { opacity: 0.6; cursor: default; }
.mch-form { border-top: 1px solid ${T.rule}; padding: 0.6rem; background: oklch(99.5% 0.002 80); display: flex; align-items: flex-end; gap: 0.5rem; }
.mch-form textarea { flex: 1; border: 1px solid ${T.rule}; border-radius: 8px; resize: none; field-sizing: content; min-height: 44px; max-height: 7.5rem;
  padding: 0.6rem 0.75rem; font-family: ${SANS}; font-size: 1rem; line-height: 1.45; color: ${T.charcoal}; background: white; box-sizing: border-box; }
.mch-form textarea:focus { outline: none; border-color: ${T.navy}; box-shadow: 0 0 0 1px ${T.navy}; }
.mch-form textarea::placeholder { color: ${T.muted}; }
.mch-send { flex: none; width: 44px; height: 44px; border-radius: 50%; border: 0; cursor: pointer; display: grid; place-items: center; background: ${T.orange}; color: ${T.navyDeep};
  transition: background-color 0.2s ease; }
.mch-send:hover { background: oklch(60% 0.155 45); }
.mch-send[disabled] { background: ${T.rule}; cursor: default; }
.mch-dots { display: inline-flex; gap: 4px; align-items: center; padding: 0.4rem 0; }
.mch-dots span { width: 6px; height: 6px; border-radius: 50%; background: ${T.muted}; animation: mch-dot 1.1s ease-in-out infinite; }
.mch-dots span:nth-child(2) { animation-delay: 0.15s; } .mch-dots span:nth-child(3) { animation-delay: 0.3s; }
@keyframes mch-dot { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }
.mch-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (prefers-reduced-motion: reduce) {
  .mch-panel { animation: none; } .mch-bubble, .mch-send, .mch-btn { transition: none; } .mch-dots span { animation: none; opacity: 0.6; }
}
`;

export default function ModuleChatHelper({
  savedSlugs,
  onSaved,
}: {
  savedSlugs?: Iterable<string>;
  onSaved?: (slugs: string[]) => void;
}) {
  const { lang: siteLang } = useLanguage();
  const lang: Lang = siteLang === "id" ? "id" : "en";
  const c = COPY[lang];
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<Stored>(FRESH);
  const [input, setInput] = useState("");
  const [bannerUp, setBannerUp] = useState(true); // hidden until we know the cookie banner is gone
  const [justSaved, setJustSaved] = useState<Set<string>>(new Set());

  const bubbleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const nextId = useRef(2);

  // Restore the last chat from this browser session
  useEffect(() => {
    const s = readStore();
    if (s) {
      nextId.current = Math.max(0, ...s.msgs.map((m) => m.id)) + 1;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChat(s);
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) writeStore(chat);
  }, [chat]);

  // Stay out of the cookie banner's way: the bubble appears once consent has been answered
  useEffect(() => {
    if (consentAnswered()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBannerUp(false);
      return;
    }
    const timer = window.setInterval(() => {
      if (consentAnswered()) {
        setBannerUp(false);
        window.clearInterval(timer);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Keep the newest message in view
  useEffect(() => {
    if (open && logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [open, chat.msgs.length, chat.stage]);

  const showInput = chat.stage === "ask" || chat.stage === "refine" || chat.stage === "loading";

  // When the chat asks for a choice, move focus to it so keyboard users land on the buttons
  useEffect(() => {
    if (!open) return;
    if (chat.stage === "feedback" || chat.stage === "save" || chat.stage === "end") {
      const t = window.setTimeout(() => {
        const rows = logRef.current?.querySelectorAll<HTMLElement>(".mch-actions");
        rows?.[rows.length - 1]?.querySelector<HTMLElement>("button, a")?.focus();
      }, 30);
      return () => window.clearTimeout(t);
    }
  }, [open, chat.stage]);

  // Move focus into the panel when it opens
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
      else panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    }, 30);
    return () => window.clearTimeout(t);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => bubbleRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  function push(s: Stored, ...msgs: NewMsg[]): Msg[] {
    return [...s.msgs, ...msgs.map((m) => ({ ...m, id: nextId.current++ }) as Msg)];
  }

  async function runSearch(query: string, base: Stored) {
    const inputStage = base.inputStage;
    setChat({ ...base, stage: "loading" });
    try {
      const res = await fetch("/api/library-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, lang }),
      });
      if (res.status === 429) {
        setChat({ ...base, msgs: push(base, { from: "bot", key: "limit" }), stage: "end" });
        return;
      }
      if (!res.ok) {
        setChat({ ...base, msgs: push(base, { from: "bot", key: "error" }), stage: inputStage });
        return;
      }
      const data = (await res.json()) as { crisis: boolean; picks: Pick[] };
      if (data.crisis) {
        setChat({ ...base, msgs: push(base, { from: "bot", key: "crisis" }), stage: "end", base: "", picks: [] });
        return;
      }
      const picks = (data.picks ?? []).filter((p) => RESOURCES.some((r) => r.slug === p.slug)).slice(0, 4);
      if (picks.length === 0) {
        setChat({ ...base, msgs: push(base, { from: "bot", key: "none" }), stage: "ask", inputStage: "ask", base: "" });
        return;
      }
      setChat({
        ...base,
        msgs: push(base, { from: "bot", key: "picks", picks }, { from: "bot", key: "helpful" }),
        stage: "feedback",
        picks,
        base: query,
      });
    } catch {
      setChat({ ...base, msgs: push(base, { from: "bot", key: "error" }), stage: inputStage });
    }
  }

  function submit() {
    const text = input.trim();
    if (chat.stage !== "ask" && chat.stage !== "refine") return;
    const min = chat.stage === "ask" ? 3 : 2;
    if (text.length < min) {
      inputRef.current?.focus();
      return;
    }
    // A refinement keeps the original words and adds the new ones, within the API limit
    const query = chat.stage === "refine" && chat.base ? `${chat.base}\n\n${text}`.slice(0, MAX_CHARS) : text.slice(0, MAX_CHARS);
    const next: Stored = { ...chat, msgs: push(chat, { from: "user", text }) };
    setInput("");
    runSearch(query, next);
  }

  function answerYes() {
    const saved = new Set([...(savedSlugs ?? []), ...justSaved]);
    const allSaved = chat.picks.every((p) => saved.has(p.slug));
    setChat({
      ...chat,
      msgs: push(chat, { from: "user", text: c.yes }, { from: "bot", key: allSaved ? "alreadySaved" : "saveAsk" }),
      stage: allSaved ? "end" : "save",
    });
  }

  function answerElse() {
    setChat({
      ...chat,
      msgs: push(chat, { from: "user", text: c.else }, { from: "bot", key: "refineAsk" }),
      stage: "refine",
      inputStage: "refine",
    });
    window.setTimeout(() => inputRef.current?.focus(), 30);
  }

  async function save() {
    const saved = new Set([...(savedSlugs ?? []), ...justSaved]);
    const slugs = chat.picks.map((p) => p.slug).filter((s) => !saved.has(s));
    const before = chat;
    setChat({ ...before, stage: "saving" });
    const { error } = slugs.length ? await saveResourcesToDashboard(slugs) : { error: null };
    if (error) {
      setChat({ ...before, msgs: push(before, { from: "bot", key: "error" }), stage: "save" });
      return;
    }
    slugs.forEach((s) => trackResourceSaved(s, true));
    setJustSaved((prev) => new Set([...prev, ...slugs]));
    setChat({ ...before, msgs: push(before, { from: "bot", key: "saved" }), stage: "end" });
    if (onSaved) onSaved(slugs);
    else router.refresh();
  }

  function restart() {
    nextId.current = 2;
    setInput("");
    setChat(FRESH);
    window.setTimeout(() => inputRef.current?.focus(), 30);
  }

  if (pathname?.endsWith("/present")) return null;

  const loading = chat.stage === "loading";

  function renderMsg(m: Msg) {
    if (m.from === "user") return <p key={m.id} className="mch-user">{m.text}</p>;
    if (m.key === "picks") {
      return (
        <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignSelf: "stretch" }}>
          <p className="mch-bot">{c.picksIntro}</p>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {m.picks.map((p) => {
              const r = RESOURCES.find((x) => x.slug === p.slug);
              if (!r) return null;
              const title = lang === "id" && r.titleId ? r.titleId : r.title;
              return (
                <li key={p.slug} className="mch-card">
                  <Link href={`/resources/${p.slug}`}>{title}</Link>
                  <span style={{ fontFamily: SANS, fontSize: "0.82rem", lineHeight: 1.5, color: T.body }}>{p.reason}</span>
                </li>
              );
            })}
          </ol>
        </div>
      );
    }
    if (m.key === "crisis") {
      return (
        <div key={m.id} role="alert" style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignSelf: "stretch" }}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "1.2rem", lineHeight: 1.25, color: T.navy, margin: 0 }}>{c.crisisTitle}</p>
          <p className="mch-bot" style={{ maxWidth: "100%" }}>{c.crisisBody}</p>
          <div className="mch-actions">
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="mch-btn mch-btn-primary">findahelpline.com</a>
            <a href="https://befrienders.org" target="_blank" rel="noopener noreferrer" className="mch-btn">befrienders.org</a>
          </div>
        </div>
      );
    }
    if (m.key === "saved" || m.key === "alreadySaved") {
      return (
        <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
          <p className="mch-bot" role="status">{c[m.key]}</p>
          {pathname !== "/dashboard" && (
            <Link href="/dashboard" className="mch-btn mch-btn-primary">{c.toDashboard}</Link>
          )}
        </div>
      );
    }
    return <p key={m.id} className="mch-bot">{c[m.key]}</p>;
  }

  if (!open) {
    if (bannerUp) return null;
    return (
      <>
        <style>{CSS}</style>
        <button ref={bubbleRef} type="button" className="mch-bubble" aria-haspopup="dialog" aria-expanded={false} onClick={() => setOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5v-9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          {c.bubble}
        </button>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div ref={panelRef} className="mch-panel" role="dialog" aria-modal="false" aria-labelledby="mch-title">
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: T.navy, padding: "0.25rem 0.25rem 0.25rem 1rem" }}>
          <h2 id="mch-title" style={{ flex: 1, margin: 0, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: "1.25rem", color: T.onNavy }}>
            {c.title}
          </h2>
          <button type="button" className="mch-icon-btn" onClick={restart} aria-label={c.restart} title={c.restart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.35-5.65M4 4v4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="mch-icon-btn" onClick={close} aria-label={c.close} title={c.close}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div ref={logRef} className="mch-log" role="log" aria-live="polite" aria-label={c.dialog}>
          {chat.msgs.map(renderMsg)}

          {loading && (
            <div className="mch-dots" role="status" aria-label={c.thinking}>
              <span /><span /><span />
            </div>
          )}

          {chat.stage === "feedback" && (
            <div className="mch-actions">
              <button type="button" className="mch-btn mch-btn-primary" onClick={answerYes}>{c.yes}</button>
              <button type="button" className="mch-btn" onClick={answerElse}>{c.else}</button>
            </div>
          )}

          {(chat.stage === "save" || chat.stage === "saving") && (
            <div className="mch-actions">
              <button type="button" className="mch-btn mch-btn-primary" onClick={save} disabled={chat.stage === "saving"}>
                {chat.stage === "saving" ? c.saving : c.save}
              </button>
            </div>
          )}

          {chat.stage === "end" && (
            <div className="mch-actions">
              <button type="button" className="mch-btn" onClick={restart}>{c.restart}</button>
            </div>
          )}
        </div>

        {showInput && (
          <form className="mch-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <label htmlFor="mch-input" className="mch-sr">{chat.stage === "refine" ? c.refineLabel : c.inputLabel}</label>
            <textarea
              id="mch-input"
              ref={inputRef}
              rows={1}
              maxLength={600}
              enterKeyHint="send"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder={chat.stage === "refine" ? c.refinePlaceholder : c.placeholder}
            />
            <button type="submit" className="mch-send" aria-label={loading ? c.thinking : c.send} disabled={loading || input.trim().length < 2}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </>
  );
}
