"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

// Full-screen viewer for a module's one-page summary image, with a control bar
// styled like the slideshow's: Save image, Print, Download PDF, EN/ID, Close.
// Files: public/images/resources/<slug>/one-pager-{en,id}.{png,pdf}.
// Add the slug to lib/one-pager-slugs.ts so the tiles show the image icon.

type Lang = "en" | "id";
type Bi = { en: string; id: string };

const ink = "oklch(14% 0.05 260)";
const offWhite = "oklch(96% 0.005 80)";
const orange = "oklch(65% 0.15 45)";
const sans = "var(--font-montserrat), Montserrat, sans-serif";

export default function OnePagerViewer({ slug, title }: { slug: string; title: Bi }) {
  const { lang: ctxLang, setLang } = useLanguage();
  const lang: Lang = ctxLang === "id" ? "id" : "en";
  const t = (en: string, id: string) => (lang === "id" ? id : en);
  const [status, setStatus] = useState("");

  const base = `/images/resources/${slug}/one-pager-${lang}`;
  const png = `${base}.png`;
  const pdf = `${base}.pdf`;
  const fileName = `${t(title.en, title.id)} - Crispy Development`;
  const moduleHref = `/resources/${slug}`;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const download = (href: string, name: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Phones: the share sheet has "Save image" (iOS) and "Save to Photos".
  // Elsewhere, or if sharing is not possible, the PNG downloads.
  async function saveImage() {
    try {
      const touch = window.matchMedia("(pointer: coarse)").matches;
      if (touch && navigator.canShare) {
        const blob = await (await fetch(png)).blob();
        const file = new File([blob], `${fileName}.png`, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: fileName });
          return;
        }
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") return;
    }
    download(png, `${fileName}.png`);
    setStatus(t("Image saved to your downloads", "Gambar tersimpan di unduhan"));
  }

  function downloadPdf() {
    download(pdf, `${fileName}.pdf`);
    setStatus(t("PDF saved to your downloads", "PDF tersimpan di unduhan"));
  }

  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => setStatus(""), 2500);
    return () => clearTimeout(id);
  }, [status]);

  const pill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minWidth: 44, height: 44, padding: "0 12px",
    background: "transparent", border: "none", borderRadius: 10, color: offWhite, cursor: "pointer", fontFamily: sans, fontWeight: 700, fontSize: 13, textDecoration: "none",
  };
  const sep = <span aria-hidden="true" style={{ width: 1, height: 24, background: "oklch(100% 0 0 / 0.18)", margin: "0 4px" }} />;
  const icon = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

  return (
    <div className="op-root" style={{ position: "fixed", inset: 0, zIndex: 1000, background: ink, fontFamily: sans }}>
      <style>{`
        @media (hover: hover) { .op-pill:not([aria-pressed="true"]):hover { background: oklch(100% 0 0 / 0.12) !important; } }
        .op-pill:focus-visible { outline: 2px solid ${orange}; outline-offset: 2px; }
        .op-scroll { position: absolute; inset: 0; overflow: auto; display: flex; justify-content: center; align-items: flex-start; padding: 24px 16px 96px; }
        .op-img { display: block; width: auto; height: auto; max-width: 100%; max-height: calc(100dvh - 120px); margin: auto; background: white; border-radius: 4px; box-shadow: 0 30px 80px oklch(0% 0 0 / 0.45); }
        .op-lbl { display: inline; }
        @media (max-width: 640px) {
          .op-scroll { padding: 12px 12px 88px; }
          .op-img { max-height: none; }
          .op-lbl { display: none; }
        }
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body { height: auto !important; overflow: visible !important; background: white !important; }
          body * { visibility: hidden !important; }
          .op-root { position: static !important; background: white !important; }
          .op-scroll { position: static !important; padding: 0 !important; overflow: visible !important; display: block !important; }
          .op-img, .op-img * { visibility: visible !important; }
          .op-img { position: fixed; left: 0; top: 0; width: 210mm !important; height: 297mm !important; max-width: none !important; max-height: none !important; margin: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
        }
      `}</style>

      <div className="op-scroll">
        <img key={lang} className="op-img" src={png}
          alt={t(`${title.en}: one-page summary`, `${title.id}: ringkasan satu halaman`)} />
      </div>

      <span aria-live="polite" style={{ position: "absolute", left: "50%", bottom: 84, transform: "translateX(-50%)", fontSize: 13, color: offWhite, background: "oklch(15% 0.04 260 / 0.9)", padding: status ? "8px 14px" : 0, borderRadius: 999, whiteSpace: "nowrap", pointerEvents: "none" }}>
        {status}
      </span>

      {/* Control bar */}
      <div role="toolbar" aria-label={t("Image controls", "Kontrol gambar")}
        style={{ position: "absolute", left: "50%", bottom: 16, transform: "translateX(-50%) scale(0.86)", transformOrigin: "bottom center", maxWidth: "calc(100vw / 0.86 - 16px)",
          display: "flex", alignItems: "center", gap: 2, padding: 6, borderRadius: 16, background: "oklch(18% 0.05 260 / 0.88)", backdropFilter: "blur(12px)", boxShadow: "0 12px 40px oklch(0% 0 0 / 0.4)", whiteSpace: "nowrap" }}>
        <button type="button" className="op-pill" style={pill} onClick={saveImage} aria-label={t("Save image", "Simpan gambar")}>
          <svg {...icon}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          <span className="op-lbl" aria-hidden="true">{t("Save", "Simpan")}</span>
        </button>
        <button type="button" className="op-pill" style={pill} onClick={() => window.print()} aria-label={t("Print", "Cetak")}>
          <svg {...icon}><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6 14h12v7H6z" /></svg>
          <span className="op-lbl" aria-hidden="true">{t("Print", "Cetak")}</span>
        </button>
        <button type="button" className="op-pill" style={pill} onClick={downloadPdf} aria-label={t("Download PDF", "Unduh PDF")}>
          <svg {...icon}><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></svg>
          <span className="op-lbl" aria-hidden="true">PDF</span>
        </button>
        {sep}
        <div role="group" aria-label={t("Language", "Bahasa")} style={{ display: "inline-flex", gap: 2, background: "oklch(100% 0 0 / 0.08)", borderRadius: 10, padding: 2 }}>
          {(["en", "id"] as Lang[]).map(l => (
            <button key={l} type="button" className="op-pill" aria-pressed={lang === l} onClick={() => setLang(l)}
              style={{ ...pill, height: 40, background: lang === l ? orange : "transparent" }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {sep}
        <Link href={moduleHref} className="op-pill" style={pill} aria-label={t("Close", "Tutup")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          <span className="op-lbl" aria-hidden="true">{t("Close", "Tutup")}</span>
        </Link>
      </div>
    </div>
  );
}
