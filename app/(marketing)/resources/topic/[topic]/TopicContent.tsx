"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Topic, Resource, Lang, LANG_LABELS } from "@/lib/resources-data";
import { saveResourceToDashboard } from "@/app/(marketing)/resources/actions";

const ALL_LANGS: Lang[] = ["en", "id", "nl"];

interface Props {
  topic: Topic;
  resources: Resource[];
  userId: string | null;
  savedResources: string[];
}

export default function TopicContent({ topic, resources, userId, savedResources: initialSaved }: Props) {
  const [langFilter, setLangFilter] = useState<Lang | null>(null);
  const [saved, setSaved] = useState<string[]>(initialSaved);

  const availableLangs = ALL_LANGS.filter(l =>
    resources.some(r => r.languages.includes(l))
  );

  const filtered = langFilter
    ? resources.filter(r => r.languages.includes(langFilter))
    : resources;

  return (
    <>
      {/* ── HEADER ── */}
      <section style={{
        borderBottom: "1px solid oklch(88% 0.008 80)",
        paddingTop: "clamp(2.5rem, 4vw, 4rem)",
        paddingBottom: "clamp(2rem, 3vw, 3rem)",
        background: "oklch(97% 0.005 80)",
      }}>
        <div className="container-wide">
          <Link
            href="/resources"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: "oklch(55% 0.008 260)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              marginBottom: "1.25rem",
            }}
          >
            ← All Topics
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", flexWrap: "wrap" }}>
            {/* Icon */}
            <div style={{
              width: "48px",
              height: "48px",
              background: "oklch(30% 0.12 260)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(65% 0.15 45)"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "22px", height: "22px" }}
              >
                <path d={topic.icon} />
              </svg>
            </div>

            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.375rem", fontSize: "0.62rem" }}>
                Resources · {topic.title}
              </p>
              <h1 style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 800,
                fontSize: "clamp(1.375rem, 3vw, 1.875rem)",
                color: "oklch(22% 0.005 260)",
                lineHeight: 1.15,
                marginBottom: "0.5rem",
              }}>
                {topic.title}
              </h1>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.9375rem",
                color: "oklch(52% 0.008 260)",
                lineHeight: 1.6,
                maxWidth: "48ch",
              }}>
                {topic.description}
              </p>
            </div>
          </div>

          {/* Language filter */}
          {availableLangs.length > 1 && (
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.75rem", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(58% 0.008 260)" }}>
                Language:
              </span>
              <button
                onClick={() => setLangFilter(null)}
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  padding: "0.3rem 0.75rem",
                  border: "1px solid",
                  borderColor: langFilter === null ? "oklch(30% 0.12 260)" : "oklch(82% 0.008 80)",
                  background: langFilter === null ? "oklch(30% 0.12 260)" : "transparent",
                  color: langFilter === null ? "oklch(97% 0.005 80)" : "oklch(48% 0.008 260)",
                  cursor: "pointer",
                }}
              >
                All
              </button>
              {availableLangs.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(langFilter === lang ? null : lang)}
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    padding: "0.3rem 0.75rem",
                    border: "1px solid",
                    borderColor: langFilter === lang ? "oklch(65% 0.15 45)" : "oklch(82% 0.008 80)",
                    background: langFilter === lang ? "oklch(65% 0.15 45)" : "transparent",
                    color: langFilter === lang ? "oklch(97% 0.005 80)" : "oklch(48% 0.008 260)",
                    cursor: "pointer",
                  }}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── RESOURCE LIST ── */}
      <section style={{ paddingBlock: "clamp(2.5rem, 4vw, 4rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          {filtered.length === 0 ? (
            <div style={{ paddingBlock: "3rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(55% 0.008 260)", lineHeight: 1.6 }}>
                No resources available in {langFilter ? LANG_LABELS[langFilter] : "this language"} yet.
                {" "}
                <button
                  onClick={() => setLangFilter(null)}
                  style={{ background: "none", border: "none", fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(30% 0.12 260)", fontWeight: 600, cursor: "pointer", padding: 0 }}
                >
                  See all languages →
                </button>
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)", maxWidth: "780px" }}>
              {filtered.map(resource => (
                <ResourceRow
                  key={resource.id}
                  resource={resource}
                  userId={userId}
                  isSaved={saved.includes(resource.slug ?? "")}
                  onSave={(slug) => setSaved(prev => [...prev, slug])}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ResourceRow({
  resource,
  userId,
  isSaved,
  onSave,
}: {
  resource: Resource;
  userId: string | null;
  isSaved: boolean;
  onSave: (slug: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [justSaved, setJustSaved] = useState(false);
  const isLocked = resource.gated && !userId;
  const hasPage = !!resource.slug;

  const btnBase: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.07em",
    padding: "0.4rem 0.875rem",
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    textDecoration: "none",
    display: "inline-block",
  };

  function handleSave() {
    if (!resource.slug) return;
    startTransition(async () => {
      await saveResourceToDashboard(resource.slug!);
      onSave(resource.slug!);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    });
  }

  return (
    <div style={{
      background: "oklch(99% 0.002 80)",
      padding: "1.25rem 1.5rem",
      opacity: isLocked ? 0.65 : 1,
    }}>
      {/* Top row: title + format badge + lock */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
        <h3 style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "0.9375rem",
          color: "oklch(22% 0.005 260)",
          lineHeight: 1.3,
          flex: "1 1 auto",
        }}>
          {resource.title}
        </h3>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "oklch(30% 0.12 260)",
            background: "oklch(30% 0.12 260 / 0.08)",
            padding: "0.2rem 0.5rem",
          }}>
            {resource.format}
          </span>
          {resource.gated && (
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "oklch(55% 0.008 260)",
            }}>
              Members only
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.8125rem",
        lineHeight: 1.6,
        color: "oklch(52% 0.008 260)",
        marginBottom: "0.875rem",
        maxWidth: "60ch",
      }}>
        {resource.description}
      </p>

      {/* Meta row: time + languages + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
        {/* Time */}
        <span style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "0.72rem",
          color: "oklch(58% 0.008 260)",
          whiteSpace: "nowrap",
        }}>
          {resource.time}
        </span>

        {/* Languages */}
        <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
          {resource.languages.map(lang => (
            <span
              key={lang}
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "oklch(42% 0.008 260)",
                background: "oklch(91% 0.005 80)",
                padding: "0.15rem 0.45rem",
              }}
            >
              {LANG_LABELS[lang]}
            </span>
          ))}
        </div>

        {/* Actions — pushed right */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Read/Download CTA */}
          {hasPage && !isLocked && (
            <Link href={`/resources/${resource.slug}`} style={{
              ...btnBase,
              background: "oklch(30% 0.12 260)",
              color: "oklch(97% 0.005 80)",
            }}>
              Read →
            </Link>
          )}
          {!userId && resource.gated && (
            <Link href="/signup?pathway=personal" style={{
              ...btnBase,
              background: "transparent",
              border: "1px solid oklch(65% 0.15 45)",
              color: "oklch(45% 0.12 45)",
            }}>
              Join to access
            </Link>
          )}
          {!hasPage && !resource.gated && (
            <span style={{ ...btnBase, color: "oklch(62% 0.008 260)", cursor: "default", padding: 0 }}>
              Coming soon
            </span>
          )}
          {!hasPage && resource.gated && userId && (
            <span style={{ ...btnBase, color: "oklch(62% 0.008 260)", cursor: "default", padding: 0 }}>
              Coming soon
            </span>
          )}

          {/* Add to Dashboard */}
          {userId && hasPage && !isLocked && (
            isSaved || justSaved ? (
              <span style={{
                ...btnBase,
                background: "oklch(45% 0.14 145 / 0.12)",
                color: "oklch(38% 0.12 145)",
                border: "1px solid oklch(45% 0.14 145 / 0.3)",
                cursor: "default",
              }}>
                ✓ In Dashboard
              </span>
            ) : (
              <button
                onClick={handleSave}
                disabled={isPending}
                style={{
                  ...btnBase,
                  background: "oklch(65% 0.15 45)",
                  color: "oklch(97% 0.005 80)",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? "Saving…" : "+ Dashboard"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
