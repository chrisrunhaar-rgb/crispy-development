"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrainingPart, ContentBlock } from "./types";

interface Props {
  part: TrainingPart;
  allParts: TrainingPart[];
  tool: string; // "teams" | "zoom"
  baseUrl: string; // "/resources/teams-training" | "/resources/zoom-training"
  accentColor?: string; // tailwind class like "bg-[#605CFF]" for Zoom
  altLangUrl?: string; // base URL for the alternate language version
  currentLang?: string; // e.g. "EN" or "ID"
  altLang?: string; // e.g. "EN" or "ID"
  lang?: "en" | "id";
}

const UI = {
  en: {
    allParts: "All Parts",
    progress: "Progress",
    training: (tool: string) => tool === "zoom" ? "Zoom Training" : "Microsoft Teams Training",
    partOf: (n: number, total: number) => `Part ${n} of ${total}`,
    whatYouWillLearn: "What you'll learn",
    knowledgeCheck: "Knowledge Check",
    howDidItGo: (n: number) => `How did Part ${n} go?`,
    tickInstruction: "Tick each box once you're confident. Come back and untick if you need a reminder.",
    done: "✓ Done",
    understood: "💡 Understood",
    partComplete: (n: number) => `Part ${n} complete!`,
    nextPartReady: "Ready for the next part?",
    allDone: "You've completed the entire training!",
    backToResources: "Back to Resources",
    partLabel: (n: number) => `Part ${n}:`,
    screenshot: "Screenshot",
    tip: "Tip",
    note: "Note",
    warning: "Important",
    copy: "Copy",
    disclaimer: (tool: string) =>
      tool === "zoom"
        ? "This course is independently created by Crispy Leaders and is not affiliated with or endorsed by Zoom Video Communications, Inc. Zoom and its logo are trademarks of their respective owners."
        : "This course is independently created by Crispy Leaders and is not affiliated with or endorsed by Microsoft Corporation. Microsoft Teams and its logo are trademarks of their respective owners.",
  },
  id: {
    allParts: "Semua Bagian",
    progress: "Kemajuan",
    training: (tool: string) => tool === "zoom" ? "Pelatihan Zoom" : "Pelatihan Microsoft Teams",
    partOf: (n: number, total: number) => `Bagian ${n} dari ${total}`,
    whatYouWillLearn: "Yang akan Anda pelajari",
    knowledgeCheck: "Pemeriksaan Pengetahuan",
    howDidItGo: (n: number) => `Bagaimana Bagian ${n} berjalan?`,
    tickInstruction: "Centang setiap kotak jika Anda sudah yakin. Kembali dan hapus centang jika butuh pengingat.",
    done: "✓ Selesai",
    understood: "💡 Dipahami",
    partComplete: (n: number) => `Bagian ${n} selesai!`,
    nextPartReady: "Siap untuk bagian berikutnya?",
    allDone: "Anda telah menyelesaikan seluruh pelatihan!",
    backToResources: "Kembali ke Sumber Daya",
    partLabel: (n: number) => `Bagian ${n}:`,
    screenshot: "Tangkapan Layar",
    tip: "Tips",
    note: "Catatan",
    warning: "Penting",
    copy: "Salin",
    disclaimer: (tool: string) =>
      tool === "zoom"
        ? "Kursus ini dibuat secara independen oleh Crispy Leaders dan tidak berafiliasi dengan atau didukung oleh Zoom Video Communications, Inc. Zoom dan logonya adalah merek dagang dari pemiliknya masing-masing."
        : "Kursus ini dibuat secara independen oleh Crispy Leaders dan tidak berafiliasi dengan atau didukung oleh Microsoft Corporation. Microsoft Teams dan logonya adalah merek dagang dari pemiliknya masing-masing.",
  },
};

const STORAGE_KEY_PREFIX = "training-progress-";

function loadProgress(tool: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PREFIX + tool) ?? "{}");
  } catch {
    return {};
  }
}

function saveProgress(tool: string, p: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY_PREFIX + tool, JSON.stringify(p));
}

let bulletCounter = 0;

function BlockContent({
  block,
  procedural,
  stepIndex,
  t,
}: {
  block: ContentBlock;
  procedural?: boolean;
  stepIndex?: number;
  t: (typeof UI)["en"] | (typeof UI)["id"];
}) {
  if (block.type === "h3") {
    return (
      <h3 className="text-xs font-bold uppercase tracking-widest text-orange font-montserrat mt-6 mb-2">
        {block.text}
      </h3>
    );
  }

  if (block.type === "body") {
    return (
      <p
        className={`text-charcoal leading-relaxed mb-3 ${
          block.lead ? "text-[16px] font-medium text-navy/80" : "text-[14.5px]"
        }`}
      >
        {block.text}
      </p>
    );
  }

  if (block.type === "bullet") {
    if (procedural && stepIndex !== undefined) {
      return (
        <div className="flex gap-3 mb-3 items-start">
          <div className="shrink-0 w-6 h-6 rounded-full bg-navy text-white text-[11px] font-bold font-montserrat flex items-center justify-center mt-0.5">
            {stepIndex + 1}
          </div>
          <p className="text-[14.5px] text-charcoal leading-relaxed flex-1">
            {block.bold ? (
              <>
                <span className="font-semibold text-navy">{block.bold}</span>
                {block.text.startsWith(block.bold)
                  ? block.text.slice(block.bold.length)
                  : " — " + block.text}
              </>
            ) : (
              block.text
            )}
          </p>
        </div>
      );
    }
    return (
      <div className="flex gap-3 mb-2 items-start">
        <span className="text-orange mt-[6px] shrink-0 text-[8px]">▶</span>
        <p className="text-[14.5px] text-charcoal leading-relaxed">
          {block.bold ? (
            <>
              <span className="font-semibold text-navy">{block.bold}</span>
              {block.text.startsWith(block.bold)
                ? block.text.slice(block.bold.length)
                : " — " + block.text}
            </>
          ) : (
            block.text
          )}
        </p>
      </div>
    );
  }

  if (block.type === "screenshot") {
    if (block.imageUrl) {
      return (
        <figure className="my-5 rounded-xl overflow-hidden border border-light-gray shadow-sm">
          <div className="relative w-full bg-off-white" style={{ minHeight: "180px" }}>
            <img
              src={block.imageUrl}
              alt={block.description}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          <figcaption className="px-4 py-2.5 bg-off-white border-t border-light-gray">
            <p className="text-[11px] text-charcoal/50 italic">{block.description}</p>
          </figcaption>
        </figure>
      );
    }
    return (
      <div className="my-5 rounded-xl border-2 border-dashed border-light-gray bg-off-white p-5 flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center text-lg">
          📸
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-navy/40 mb-1 font-montserrat">
            {t.screenshot}
          </p>
          <p className="text-[13px] text-charcoal/60 italic">{block.description}</p>
        </div>
      </div>
    );
  }

  if (block.type === "tip") {
    return (
      <div className="my-4 rounded-xl overflow-hidden">
        <div className="flex gap-3 bg-orange/10 border border-orange/20 rounded-xl p-4">
          <div className="shrink-0 text-xl">💡</div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange font-montserrat mb-1">
              {t.tip}
            </p>
            <p className="text-[14px] text-charcoal leading-relaxed">{block.text}</p>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "note") {
    return (
      <div className="my-4 rounded-xl overflow-hidden">
        <div className="flex gap-3 bg-navy/5 border border-navy/15 rounded-xl p-4">
          <div className="shrink-0 text-xl">ℹ️</div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-navy font-montserrat mb-1">
              {t.note}
            </p>
            <p className="text-[14px] text-charcoal leading-relaxed">{block.text}</p>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "warning") {
    return (
      <div className="my-4 rounded-xl overflow-hidden">
        <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="shrink-0 text-xl">⚠️</div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-700 font-montserrat mb-1">
              {t.warning}
            </p>
            <p className="text-[14px] text-charcoal leading-relaxed">{block.text}</p>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "table") {
    const is2Col = block.headers.length === 2;
    return (
      <div className="my-5 overflow-x-auto rounded-xl border border-light-gray shadow-sm">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-navy text-white">
              {block.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left font-semibold font-montserrat text-[11px] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-off-white"}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-3 text-charcoal border-b border-light-gray/70 ${
                      ci === 0 ? "font-semibold text-navy" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "url") {
    const display = block.label ?? block.url;
    return (
      <div className="my-4 flex items-center gap-3 bg-navy/5 border border-navy/15 rounded-xl px-4 py-3">
        <span className="shrink-0 text-navy/40 text-base">🔗</span>
        <code className="flex-1 text-[13px] font-mono text-navy break-all">{block.url}</code>
        <button
          type="button"
          title="Copy URL"
          onClick={() => {
            navigator.clipboard.writeText(block.url).catch(() => {});
          }}
          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold font-montserrat uppercase tracking-wider text-navy/40 hover:text-navy transition-colors px-2 py-1 rounded-lg hover:bg-navy/10"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {t.copy}
        </button>
      </div>
    );
  }

  return null;
}

function ZoomLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#2D8CFF" />
      <rect x="6" y="14" width="24" height="20" rx="4" fill="white" />
      <path d="M30 20L42 13V35L30 28V20Z" fill="white" />
    </svg>
  );
}

function TeamsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#6264A7" />
      <circle cx="32" cy="14" r="5" fill="white" />
      <path d="M38 22H26a2 2 0 00-2 2v9a7 7 0 0014 0v-9a2 2 0 00-2-2z" fill="white" />
      <circle cx="18" cy="17" r="6" fill="white" fillOpacity="0.85" />
      <path d="M6 38c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

export default function TrainingPartView({ part, allParts, tool, baseUrl, altLangUrl, currentLang, altLang, lang = "en" }: Props) {
  const t = UI[lang];
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setProgress(loadProgress(tool));
  }, [tool]);

  const toggleItem = useCallback(
    (id: string) => {
      const next = { ...progress, [id]: !progress[id] };
      setProgress(next);
      saveProgress(tool, next);
    },
    [progress, tool]
  );

  // Progress math
  const allItems = allParts.flatMap((p) => p.endChecklist);
  const totalItems = allItems.length;
  const completedItems = allItems.filter((item) => progress[item.id]).length;
  const overallPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const partItems = part.endChecklist;
  const partCompleted = partItems.filter((item) => progress[item.id]).length;
  const partPct = partItems.length > 0 ? Math.round((partCompleted / partItems.length) * 100) : 0;
  const isPartDone = partCompleted === partItems.length && partItems.length > 0;

  const prevPart = allParts.find((p) => p.number === part.number - 1);
  const nextPart = allParts.find((p) => p.number === part.number + 1);

  return (
    <div className="min-h-screen bg-off-white">
      {/* Top nav */}
      <div className="bg-navy text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-14">
          <button
            className="lg:hidden shrink-0 text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle parts list"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="shrink-0">
            <span className="font-montserrat font-extrabold text-white text-sm tracking-wide">CRISPY</span>
          </Link>
          <span className="text-white/30 hidden sm:block">|</span>
          <span className="font-montserrat font-semibold text-white/80 text-sm hidden sm:block truncate">
            {t.training(tool)}
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-3 shrink-0">
            {altLangUrl && currentLang && altLang && (
              <Link
                href={`${altLangUrl}/${part.number}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/20 hover:border-white/60 hover:bg-white/10 transition-colors"
                title={`Switch to ${altLang} version`}
              >
                <span className="text-[10px] font-bold font-montserrat uppercase tracking-wider text-white/40">{currentLang}</span>
                <span className="text-white/20 text-[10px]">/</span>
                <span className="text-[10px] font-bold font-montserrat uppercase tracking-wider text-white/80">{altLang}</span>
              </Link>
            )}
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-white/40 font-montserrat uppercase tracking-wider">{t.progress}</p>
              <p className="text-xs font-bold text-white">{overallPct}%</p>
            </div>
            <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-72 bg-white border-r border-light-gray overflow-y-auto z-30 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40 font-montserrat mb-4">
              {t.allParts}
            </p>
            <nav className="space-y-1">
              {allParts.map((p) => {
                const done = p.endChecklist.filter((item) => progress[item.id]).length;
                const pct = p.endChecklist.length > 0
                  ? Math.round((done / p.endChecklist.length) * 100)
                  : 0;
                const isActive = p.number === part.number;
                const isComplete = done === p.endChecklist.length && p.endChecklist.length > 0;

                return (
                  <Link
                    key={p.number}
                    href={`${baseUrl}/${p.number}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? "bg-navy text-white" : "hover:bg-off-white text-charcoal"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-montserrat ${
                        isComplete
                          ? "bg-green-100 text-green-700"
                          : isActive
                          ? "bg-white/20 text-white"
                          : "bg-navy/10 text-navy/60"
                      }`}
                    >
                      {isComplete ? "✓" : p.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-semibold font-montserrat truncate ${isActive ? "text-white" : "text-navy"}`}>
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className={`flex-1 h-1 rounded-full overflow-hidden ${isActive ? "bg-white/20" : "bg-light-gray"}`}>
                          <div
                            className={`h-full rounded-full transition-all ${isActive ? "bg-orange" : "bg-orange/70"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] shrink-0 ${isActive ? "text-white/50" : "text-charcoal/40"}`}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Part hero */}
          <div className="bg-navy text-white px-6 py-10 lg:px-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                {tool === "zoom" ? (
                  <ZoomLogo className="w-9 h-9 shrink-0" />
                ) : (
                  <TeamsLogo className="w-9 h-9 shrink-0" />
                )}
                <span className="text-white/40 text-[11px] font-montserrat uppercase tracking-widest">
                  {t.training(tool)}
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange font-montserrat mb-2">
                {t.partOf(part.number, allParts.length)}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-montserrat leading-tight mb-2">
                {part.title}
              </h1>
              <p className="font-cormorant text-xl italic text-white/60 mb-8">
                {part.subtitle}
              </p>

              {/* What you'll learn */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-widest text-orange/80 font-montserrat mb-3">
                  {t.whatYouWillLearn}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {part.whatYouWillLearn.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-orange mt-0.5 shrink-0 text-xs">✦</span>
                      <span className="text-[13px] text-white/80 leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 lg:px-10">
            <div className="max-w-2xl">
              {part.sections.map((section) => {
                let stepIndex = 0;
                return (
                  <div key={section.id} className="mb-8">
                    {/* Section heading */}
                    <h2 className="text-lg font-bold text-navy font-montserrat mb-4 pb-2 border-b border-light-gray">
                      {section.title}
                    </h2>
                    {/* Blocks */}
                    {section.blocks.map((block, i) => {
                      const isBullet = block.type === "bullet";
                      const currentStep = isBullet && section.procedural ? stepIndex++ : 0;
                      if (!isBullet) stepIndex = 0; // reset on non-bullet (resets on h3/body etc)
                      return (
                        <BlockContent
                          key={i}
                          block={block}
                          procedural={section.procedural && isBullet}
                          stepIndex={isBullet && section.procedural ? currentStep : undefined}
                          t={t}
                        />
                      );
                    })}
                  </div>
                );
              })}

              {/* ─── End checklist ─── */}
              <div className="mt-10 mb-8 rounded-2xl border-2 border-navy/15 overflow-hidden">
                <div className="bg-navy px-6 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-orange font-montserrat mb-0.5">
                    {t.knowledgeCheck}
                  </p>
                  <h3 className="text-lg font-bold text-white font-montserrat">
                    {t.howDidItGo(part.number)}
                  </h3>
                  <p className="text-sm text-white/60 mt-1">
                    {t.tickInstruction}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="bg-off-white px-6 py-3 border-b border-light-gray flex items-center gap-3">
                  <div className="flex-1 h-2 bg-light-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange rounded-full transition-all duration-500"
                      style={{ width: `${partPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-navy/60 font-montserrat shrink-0">
                    {partCompleted} / {partItems.length}
                  </span>
                </div>

                {/* Checklist items */}
                <div className="bg-white divide-y divide-light-gray/60">
                  {partItems.map((item) => {
                    const checked = !!progress[item.id];
                    return (
                      <label
                        key={item.id}
                        className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-off-white transition-colors"
                      >
                        <div className="shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => toggleItem(item.id)}
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              checked
                                ? "bg-green-500 border-green-500"
                                : "border-light-gray hover:border-navy bg-white"
                            }`}
                          >
                            {checked && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className={`text-[14px] leading-snug transition-colors ${checked ? "text-charcoal/40 line-through" : "text-charcoal"}`}>
                            {item.text}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-montserrat ${
                              item.type === "implemented"
                                ? "bg-orange/10 text-orange"
                                : "bg-navy/10 text-navy/60"
                            }`}
                          >
                            {item.type === "implemented" ? t.done : t.understood}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Complete state */}
                {isPartDone && (
                  <div className="bg-green-50 border-t border-green-200 px-6 py-4 flex items-center gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="font-bold text-green-800 font-montserrat text-sm">
                        {t.partComplete(part.number)}
                      </p>
                      <p className="text-[13px] text-green-700">
                        {nextPart ? t.nextPartReady : t.allDone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-light-gray">
                {prevPart ? (
                  <Link
                    href={`${baseUrl}/${prevPart.number}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-light-gray hover:border-navy hover:text-navy text-charcoal/60 transition-colors text-sm font-semibold font-montserrat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">{t.partLabel(prevPart.number)}</span> {prevPart.title}
                  </Link>
                ) : (
                  <div />
                )}

                {nextPart ? (
                  <Link
                    href={`${baseUrl}/${nextPart.number}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy hover:bg-navy/90 text-white text-sm font-bold font-montserrat shadow-sm transition-colors"
                  >
                    Next: {nextPart.title}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href="/resources"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange hover:bg-orange/90 text-white text-sm font-bold font-montserrat shadow-sm transition-colors"
                  >
                    {t.backToResources}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
              <p className="text-[10px] text-charcoal/25 text-center mt-10 mb-2 leading-relaxed">
                {t.disclaimer(tool)}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
