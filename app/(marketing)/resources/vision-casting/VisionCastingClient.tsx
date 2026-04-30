"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import {
  Lang,
  ChannelId,
  pageHero,
  compassIntro,
  channels,
  fiveTestsIntro,
  fiveTests,
  auditResultTemplate,
  facilitationToolsIntro,
  facilitationTools,
  resourceCards,
  cta,
  ui,
} from "./content";

// ─── Types & Helpers ──────────────────────────────────────────────────────────

type LangCode = "en" | "id" | "nl";

type Props = { userPathway: string | null; isSaved: boolean };

// ─── Flip Card Data ───────────────────────────────────────────────────────────

type FlipCard = {
  title: { en: string; id: string; nl: string };
  back: { en: string; id: string; nl: string };
};

const FLIP_CARDS: FlipCard[] = [
  {
    title: {
      en: "What Vision Actually Is",
      id: "Apa Sebenarnya Visi Itu",
      nl: "Wat Visie Werkelijk Is",
    },
    back: {
      en: "Vision is a clear mental picture of what could be, fuelled by the conviction that it should be. It is not a goal, not a strategy, and not a mission statement. Vision is a living picture that moves people toward a preferred future. Without it, leaders manage — with it, they mobilise.",
      id: "Visi adalah gambaran mental yang jelas tentang apa yang bisa ada, didorong oleh keyakinan bahwa itu seharusnya ada. Ini bukan tujuan, bukan strategi, dan bukan pernyataan misi. Visi adalah gambaran hidup yang menggerakkan orang menuju masa depan yang lebih baik.",
      nl: "Visie is een helder mentaal beeld van wat zou kunnen zijn, gevoed door de overtuiging dat het zo moet zijn. Het is geen doel, geen strategie en geen missieverklaring. Visie is een levend beeld dat mensen beweegt naar een gewenste toekomst.",
    },
  },
  {
    title: {
      en: "The Four Channels",
      id: "Empat Saluran",
      nl: "De Vier Kanalen",
    },
    back: {
      en: "God speaks vision through four channels: Passion (what you cannot put down), Dreams (what stirs your imagination), Revelation (what God speaks directly), and Others (what your team sees that you cannot). Most leaders only use one or two. The strongest visions draw from all four.",
      id: "Allah berbicara visi melalui empat saluran: Gairah (yang tidak bisa Anda tinggalkan), Mimpi (yang menggerakkan imajinasi Anda), Wahyu (apa yang Allah ucapkan langsung), dan Sesama (apa yang tim Anda lihat yang tidak bisa Anda lihat). Visi terkuat menggali dari keempat-empatnya.",
      nl: "God spreekt visie door vier kanalen: Passie (wat je niet kunt neerleggen), Dromen (wat je verbeelding beweegt), Openbaring (wat God rechtstreeks spreekt), en Anderen (wat je team ziet dat jij niet ziet). De sterkste visies putten uit alle vier.",
    },
  },
  {
    title: {
      en: "Vision and the Great Commission",
      id: "Visi dan Amanat Agung",
      nl: "Visie en de Grote Opdracht",
    },
    back: {
      en: "For a cross-cultural Christian leader, every team vision sits inside the Great Commission — Jesus' ongoing call to make disciples of every nation. Your specific vision is a small piece of God's larger vision for the world. Knowing this is the difference between leading a project and stewarding a calling.",
      id: "Bagi seorang pemimpin Kristen lintas budaya, setiap visi tim berada di dalam Amanat Agung — panggilan Yesus yang terus-menerus untuk menjadikan semua bangsa murid-Nya. Visi spesifik Anda adalah bagian kecil dari visi Allah yang lebih besar untuk dunia.",
      nl: "Voor een interculturele christelijke leider ligt elke teamvisie binnen de Grote Opdracht — Jezus' voortdurende roep om van alle volken discipelen te maken. Jouw specifieke visie is een klein stukje van Gods grotere visie voor de wereld.",
    },
  },
  {
    title: {
      en: "How to Test a Vision",
      id: "Cara Menguji Visi",
      nl: "Hoe Visie te Testen",
    },
    back: {
      en: "Not every strong feeling is God-given vision. Five tests help distinguish a God-originated vision from a good idea or personal ambition: Time (does it survive months of prayer?), Scripture (does it align with God's character?), Community (have trusted people confirmed it?), Sacrifice (are you willing to pay the cost?), and Fruit (what is it producing?).",
      id: "Tidak setiap perasaan kuat adalah visi yang diberikan Allah. Lima pengujian membantu membedakan visi yang berasal dari Allah: Waktu, Kitab Suci, Komunitas, Pengorbanan, dan Buah.",
      nl: "Niet elk sterk gevoel is door God gegeven visie. Vijf testen helpen onderscheid te maken: Tijd, Schrift, Gemeenschap, Opoffering en Vrucht.",
    },
  },
  {
    title: {
      en: "How Team Leaders Cast Vision",
      id: "Cara Pemimpin Tim Menebar Visi",
      nl: "Hoe Teamleiders Visie Uitdragen",
    },
    back: {
      en: "Vision must be repeated seven to ten times before it settles. Use story, not slides. Invite people in — don't announce to them. In cross-cultural teams, vision must be framed collectively ('what we will do together'), not as a hero-leader announcement. The vision that emerges from the team together is almost always larger than the one you started with.",
      id: "Visi harus diulangi tujuh hingga sepuluh kali sebelum menetap. Gunakan cerita, bukan slide. Undang orang masuk — jangan umumkan kepada mereka. Dalam tim lintas budaya, visi harus dibingkai secara kolektif.",
      nl: "Visie moet zeven tot tien keer worden herhaald voordat het landt. Gebruik verhalen, geen slides. Nodig mensen uit — kondig niet aan. In interculturele teams moet visie collectief worden geframed: 'wat we samen zullen doen'.",
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function VisionCastingClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as LangCode;

  // Helper
  const t = (field: Lang): string => field[lang];

  // ─── Save to Dashboard ───────────────────────────────────────────
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (saved) return;
    setSaved(true); // optimistic
    startTransition(async () => {
      await saveResourceToDashboard("vision-casting");
    });
  }

  // ─── Flip Cards ─────────────────────────────────────────────────
  const [activeFlipCard, setActiveFlipCard] = useState<number | null>(null);

  function handleFlipCard(index: number) {
    setActiveFlipCard((prev) => (prev === index ? null : index));
  }

  // ─── Vision Compass ─────────────────────────────────────────────
  const [activeChannel, setActiveChannel] = useState<ChannelId>("passion");

  const activeChannelData = channels.find((c) => c.id === activeChannel) ?? channels[0];

  // ─── Discernment Audit ──────────────────────────────────────────
  const [visionInput, setVisionInput] = useState("");
  const [responses, setResponses] = useState<Record<string, "yes" | "not-yet" | "unsure" | null>>(
    Object.fromEntries(fiveTests.map((ft) => [ft.id, null]))
  );
  const [auditSaved, setAuditSaved] = useState(false);
  const [auditPending, startAuditTransition] = useTransition();

  const allAnswered = fiveTests.every((ft) => responses[ft.id] !== null);
  const showResult = allAnswered;

  function handleResponse(testId: string, value: "yes" | "not-yet" | "unsure") {
    setResponses((prev) => ({ ...prev, [testId]: value }));
  }

  function handleSaveAudit() {
    if (auditSaved) return;
    setAuditSaved(true);
    startAuditTransition(async () => {
      await saveResourceToDashboard("vision-casting-audit");
    });
  }

  // Compute result
  const strongTests = fiveTests.filter((ft) => responses[ft.id] === "yes");
  const watchTests = fiveTests.filter(
    (ft) => responses[ft.id] === "not-yet" || responses[ft.id] === "unsure"
  );

  function getAuditResult(): string {
    if (strongTests.length === 5) {
      return t(auditResultTemplate.allClear);
    }
    const strongNames = strongTests.map((ft) => t(ft.title)).join(", ");
    const watchNames = watchTests.map((ft) => t(ft.title)).join(", ");
    let result = "";
    if (strongTests.length > 0) {
      result += t(auditResultTemplate.strongSigns).replace("{tests}", strongNames) + " ";
    }
    if (watchTests.length > 0) {
      result += t(auditResultTemplate.areasToWatch).replace("{tests}", watchNames);
    }
    return result.trim();
  }

  const threeMonthNote: Lang = {
    en: "Return to this audit in three months. Vision is tested by time.",
    id: "Kembali ke audit ini dalam tiga bulan. Visi diuji oleh waktu.",
    nl: "Keer over drie maanden terug naar deze audit. Visie wordt getoetst door de tijd.",
  };

  // ─── Style constants ─────────────────────────────────────────────
  const navy = "oklch(22% 0.10 260)";
  const orange = "oklch(65% 0.15 45)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const charcoal = "oklch(38% 0.05 260)";

  const cormorant = "Cormorant Garamond, Georgia, serif";
  const montserrat = "Montserrat, sans-serif";

  // Direction button positions relative to compass container
  // Container is 360px wide, 340px tall on desktop
  const directionButtonStyle = (dir: "N" | "S" | "E" | "W", isActive: boolean, accentColor: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontFamily: montserrat,
      fontSize: 11,
      fontWeight: 700,
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      color: isActive ? accentColor : charcoal,
      padding: "6px 10px",
      borderRadius: 4,
      transition: "color 0.2s ease",
      whiteSpace: "nowrap" as const,
    };
    if (dir === "N") return { ...base, top: 0, left: "50%", transform: "translateX(-50%)" };
    if (dir === "S") return { ...base, bottom: 0, left: "50%", transform: "translateX(-50%)" };
    if (dir === "E") return { ...base, right: 0, top: "50%", transform: "translateY(-50%)" };
    // W
    return { ...base, left: 0, top: "50%", transform: "translateY(-50%)" };
  };

  // Compass glow positions
  const glowStyle = (dir: "N" | "S" | "E" | "W", accentColor: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      width: 100,
      height: 100,
      borderRadius: "50%",
      background: accentColor,
      opacity: 0.2,
      pointerEvents: "none",
      transition: "opacity 0.3s ease",
    };
    if (dir === "N") return { ...base, top: 20, left: "50%", transform: "translateX(-50%)" };
    if (dir === "S") return { ...base, bottom: 20, left: "50%", transform: "translateX(-50%)" };
    if (dir === "E") return { ...base, right: 20, top: "50%", transform: "translateY(-50%)" };
    return { ...base, left: 20, top: "50%", transform: "translateY(-50%)" };
  };

  // Resource type label
  function getTypeLabel(type: "book" | "video" | "module"): string {
    if (type === "book") return t(ui.labels.book);
    if (type === "video") return t(ui.labels.video);
    return t(ui.labels.module);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: montserrat, background: offWhite, minHeight: "100vh" }}>

      {/* ── SECTION 1: NAVY HERO ────────────────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <LangToggle />

        <p style={{
          color: orange,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 20,
          marginTop: 24,
          fontFamily: montserrat,
        }}>
          {t(pageHero.tag)}
        </p>

        <h1 style={{
          fontFamily: cormorant,
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 600,
          color: offWhite,
          margin: "0 auto 24px",
          maxWidth: 800,
          lineHeight: 1.08,
        }}>
          {t(pageHero.title)}
        </h1>

        <p style={{
          fontFamily: cormorant,
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontStyle: "italic",
          color: "oklch(80% 0.02 80)",
          maxWidth: 600,
          margin: "0 auto 16px",
          lineHeight: 1.55,
        }}>
          {t(pageHero.scripture)}
          <span style={{ display: "block", marginTop: 6, fontSize: "clamp(10px, 1.2vw, 12px)", fontStyle: "normal", color: orange, fontFamily: montserrat, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {t(pageHero.scriptureRef)}
          </span>
        </p>

        <p style={{
          fontFamily: cormorant,
          fontSize: "clamp(20px, 2.8vw, 28px)",
          fontStyle: "italic",
          color: "oklch(92% 0.01 80)",
          maxWidth: 680,
          margin: "0 auto 40px",
          lineHeight: 1.45,
        }}>
          {t(pageHero.caption)}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={handleSave}
            disabled={saved || isPending}
            style={{
              padding: "13px 28px",
              borderRadius: 6,
              border: "none",
              cursor: saved ? "default" : "pointer",
              fontFamily: montserrat,
              fontSize: 14,
              fontWeight: 700,
              background: saved ? "oklch(45% 0.06 260)" : orange,
              color: offWhite,
              letterSpacing: "0.04em",
              transition: "background 0.2s ease",
            }}>
            {saved ? t(ui.buttons.savedToDashboard) : t(ui.buttons.saveToDashboard)}
          </button>

          <span style={{
            color: "oklch(65% 0.03 260)",
            fontSize: 13,
            fontFamily: montserrat,
            fontWeight: 500,
          }}>
            8 min read
          </span>
        </div>
      </div>

      {/* ── SECTION 2: INTRO + FLIP CARDS ──────────────────────────── */}
      <div style={{ background: offWhite, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <p style={{ fontSize: 16, color: charcoal, lineHeight: 1.8, marginBottom: 20, fontFamily: montserrat }}>
            {t(pageHero.intro1)}
          </p>
          <p style={{ fontSize: 16, color: charcoal, lineHeight: 1.8, marginBottom: 64, fontFamily: montserrat }}>
            {t(pageHero.intro2)}
          </p>

          <h2 style={{
            fontFamily: cormorant,
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 600,
            color: navy,
            marginBottom: 12,
            textAlign: "center",
            lineHeight: 1.15,
          }}>
            {lang === "en" ? "Five Things Worth Knowing" : lang === "id" ? "Lima Hal yang Perlu Diketahui" : "Vijf Dingen om te Weten"}
          </h2>
          <p style={{ textAlign: "center", color: charcoal, fontSize: 14, fontFamily: montserrat, marginBottom: 48, lineHeight: 1.6 }}>
            {lang === "en" ? "Click any card to reveal what's on the back." : lang === "id" ? "Klik kartu mana saja untuk melihat isinya." : "Klik op een kaart om de achterkant te zien."}
          </p>

          {/* Flip cards grid: 2+3 on desktop, 1-col on mobile */}
          <style>{`
            .vc-flip-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
            .vc-flip-grid .vc-flip-card:last-child {
              grid-column: 1 / -1;
            }
            @media (max-width: 640px) {
              .vc-flip-grid {
                grid-template-columns: 1fr;
              }
              .vc-flip-grid .vc-flip-card:last-child {
                grid-column: 1;
              }
            }
            .vc-compass-layout {
              display: flex;
              flex-direction: row;
              gap: 48px;
              align-items: flex-start;
            }
            @media (max-width: 700px) {
              .vc-compass-layout {
                flex-direction: column;
                align-items: center;
              }
            }
            .vc-resources-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            @media (max-width: 900px) {
              .vc-resources-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (max-width: 560px) {
              .vc-resources-grid {
                grid-template-columns: 1fr;
              }
            }
            .vc-tools-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
            @media (max-width: 640px) {
              .vc-tools-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>

          <div className="vc-flip-grid">
            {FLIP_CARDS.map((card, index) => {
              const isActive = activeFlipCard === index;
              return (
                <div
                  key={index}
                  className="vc-flip-card"
                  onClick={() => handleFlipCard(index)}
                  style={{
                    perspective: "1000px",
                    cursor: "pointer",
                    minHeight: 200,
                  }}
                >
                  <div style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    minHeight: 200,
                    transition: "transform 0.45s ease",
                    transformStyle: "preserve-3d",
                    transform: isActive ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}>
                    {/* FRONT */}
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: navy,
                      borderRadius: 12,
                      padding: "32px 28px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}>
                      <div style={{
                        fontFamily: cormorant,
                        fontSize: "clamp(52px, 8vw, 72px)",
                        fontWeight: 600,
                        color: orange,
                        lineHeight: 1,
                        marginBottom: 12,
                      }}>
                        {index + 1}
                      </div>
                      <h3 style={{
                        fontFamily: cormorant,
                        fontSize: "clamp(20px, 2.5vw, 26px)",
                        fontWeight: 600,
                        color: offWhite,
                        margin: 0,
                        lineHeight: 1.2,
                      }}>
                        {card.title[lang]}
                      </h3>
                      <p style={{
                        fontFamily: montserrat,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "oklch(60% 0.05 260)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginTop: 16,
                        marginBottom: 0,
                      }}>
                        {lang === "en" ? "Click to read →" : lang === "id" ? "Klik untuk baca →" : "Klik om te lezen →"}
                      </p>
                    </div>

                    {/* BACK */}
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      background: offWhite,
                      border: `1px solid oklch(88% 0.01 80)`,
                      borderRadius: 12,
                      padding: "28px 28px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}>
                      <h4 style={{
                        fontFamily: montserrat,
                        fontSize: 13,
                        fontWeight: 700,
                        color: orange,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 12,
                        marginTop: 0,
                      }}>
                        {card.title[lang]}
                      </h4>
                      <p style={{
                        fontFamily: montserrat,
                        fontSize: 14,
                        color: charcoal,
                        lineHeight: 1.75,
                        margin: 0,
                      }}>
                        {card.back[lang]}
                      </p>
                      <p style={{
                        fontFamily: montserrat,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "oklch(65% 0.05 260)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginTop: 16,
                        marginBottom: 0,
                      }}>
                        {lang === "en" ? "← Click to flip back" : lang === "id" ? "← Klik untuk balik" : "← Klik om terug te draaien"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: VISION COMPASS ──────────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: cormorant,
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 600,
            color: navy,
            textAlign: "center",
            marginBottom: 16,
            lineHeight: 1.15,
          }}>
            {t(ui.sectionTitles.visionCompass)}
          </h2>
          <p style={{
            textAlign: "center",
            color: charcoal,
            fontSize: 16,
            fontFamily: montserrat,
            lineHeight: 1.75,
            maxWidth: 640,
            margin: "0 auto 56px",
          }}>
            {t(compassIntro)}
          </p>

          <div className="vc-compass-layout">
            {/* LEFT: Compass interaction zone */}
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Compass container — positioned for directional buttons + logo */}
              <div style={{
                position: "relative",
                width: 340,
                height: 340,
              }}>
                {/* Direction buttons */}
                {channels.map((ch) => {
                  const isActive = activeChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannel(ch.id)}
                      style={directionButtonStyle(ch.direction, isActive, ch.colorAccent)}
                      aria-pressed={isActive}
                    >
                      {ch.direction} — {t(ch.label)}
                    </button>
                  );
                })}

                {/* Logo image centered in container */}
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 200,
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {/* Glow effect behind logo for active channel */}
                  {channels.map((ch) => (
                    <div
                      key={ch.id}
                      style={{
                        ...glowStyle(ch.direction, ch.colorAccent),
                        opacity: activeChannel === ch.id ? 0.22 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  ))}

                  <Image
                    src="/logo-icon.png"
                    width={200}
                    height={200}
                    alt="Vision Compass"
                    style={{ position: "relative", zIndex: 1 }}
                  />
                </div>
              </div>

              <p style={{
                textAlign: "center",
                color: charcoal,
                fontSize: 12,
                fontFamily: montserrat,
                marginTop: 16,
                lineHeight: 1.5,
                maxWidth: 260,
              }}>
                {lang === "en" ? "Select a direction to explore that channel" : lang === "id" ? "Pilih arah untuk menjelajahi saluran tersebut" : "Kies een richting om dat kanaal te verkennen"}
              </p>
            </div>

            {/* RIGHT: Active channel panel */}
            <div
              key={activeChannel}
              style={{
                flex: 1,
                minWidth: 0,
                animation: "fadeIn 0.3s ease",
              }}
            >
              <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(6px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              {/* Channel label */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
                <span style={{
                  fontFamily: montserrat,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: activeChannelData.colorAccent,
                }}>
                  {activeChannelData.direction}
                </span>
                <h3 style={{
                  fontFamily: cormorant,
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 600,
                  color: navy,
                  margin: 0,
                  lineHeight: 1.1,
                }}>
                  {t(activeChannelData.label)}
                </h3>
              </div>

              <p style={{
                fontFamily: cormorant,
                fontSize: 18,
                fontStyle: "italic",
                color: activeChannelData.colorAccent,
                marginBottom: 20,
                marginTop: 0,
                lineHeight: 1.4,
              }}>
                {t(activeChannelData.tagline)}
              </p>

              <p style={{
                fontFamily: montserrat,
                fontSize: 15,
                color: charcoal,
                lineHeight: 1.8,
                marginBottom: 28,
              }}>
                {t(activeChannelData.body)}
              </p>

              {/* Biblical Anchor */}
              <div style={{
                borderLeft: `3px solid ${activeChannelData.colorAccent}`,
                paddingLeft: 20,
                marginBottom: 24,
              }}>
                <p style={{
                  fontFamily: montserrat,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: charcoal,
                  marginBottom: 4,
                  marginTop: 0,
                }}>
                  {t(ui.labels.biblicalAnchor)}
                </p>
                <p style={{
                  fontFamily: montserrat,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: orange,
                  marginBottom: 10,
                  marginTop: 0,
                }}>
                  {t(activeChannelData.biblicalAnchorTitle)}
                </p>
                <p style={{
                  fontFamily: cormorant,
                  fontSize: 17,
                  fontStyle: "italic",
                  color: charcoal,
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {t(activeChannelData.biblicalFigure)}
                </p>
              </div>

              {/* Diagnostic Question */}
              <div style={{
                background: offWhite,
                borderRadius: 8,
                padding: "16px 20px",
                marginBottom: 16,
              }}>
                <p style={{
                  fontFamily: montserrat,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: charcoal,
                  marginBottom: 8,
                  marginTop: 0,
                }}>
                  {t(ui.labels.diagnosticQuestion)}
                </p>
                <p style={{
                  fontFamily: montserrat,
                  fontSize: 15,
                  fontWeight: 700,
                  color: navy,
                  lineHeight: 1.55,
                  margin: 0,
                }}>
                  {t(activeChannelData.diagnosticQuestion)}
                </p>
              </div>

              {/* First Step */}
              <div style={{
                background: offWhite,
                borderRadius: 8,
                padding: "16px 20px",
              }}>
                <p style={{
                  fontFamily: montserrat,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: charcoal,
                  marginBottom: 8,
                  marginTop: 0,
                }}>
                  {t(ui.labels.firstStep)}
                </p>
                <p style={{
                  fontFamily: montserrat,
                  fontSize: 14,
                  color: charcoal,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {t(activeChannelData.firstStepPractice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: DISCERNMENT AUDIT ───────────────────────────── */}
      <div style={{ background: offWhite, padding: "80px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: cormorant,
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 600,
            color: navy,
            textAlign: "center",
            marginBottom: 16,
            lineHeight: 1.15,
          }}>
            {t(ui.sectionTitles.fiveTests)}
          </h2>
          <p style={{
            textAlign: "center",
            color: charcoal,
            fontSize: 16,
            fontFamily: montserrat,
            lineHeight: 1.75,
            maxWidth: 640,
            margin: "0 auto 48px",
          }}>
            {t(fiveTestsIntro)}
          </p>

          {/* Vision Input */}
          <div style={{ marginBottom: 48 }}>
            <label style={{
              display: "block",
              fontFamily: montserrat,
              fontSize: 14,
              fontWeight: 700,
              color: navy,
              marginBottom: 10,
              lineHeight: 1.5,
            }}>
              {lang === "en"
                ? "Write down the vision you are currently sensing:"
                : lang === "id"
                ? "Tuliskan visi yang sedang Anda rasakan saat ini:"
                : "Schrijf de visie op die u momenteel ervaart:"}
            </label>
            <textarea
              value={visionInput}
              onChange={(e) => setVisionInput(e.target.value.slice(0, 500))}
              rows={4}
              placeholder={
                lang === "en"
                  ? "Describe the vision, concern, or calling you are testing…"
                  : lang === "id"
                  ? "Jelaskan visi, kekhawatiran, atau panggilan yang Anda uji…"
                  : "Beschrijf de visie, bezorgdheid of roeping die u test…"
              }
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 8,
                border: `2px solid oklch(85% 0.015 260)`,
                fontFamily: montserrat,
                fontSize: 15,
                color: charcoal,
                lineHeight: 1.65,
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
                background: "white",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => { e.target.style.borderColor = navy; }}
              onBlur={(e) => { e.target.style.borderColor = "oklch(85% 0.015 260)"; }}
            />
            <p style={{
              fontFamily: montserrat,
              fontSize: 12,
              color: "oklch(60% 0.03 260)",
              textAlign: "right",
              marginTop: 4,
            }}>
              {visionInput.length}/500
            </p>
          </div>

          {/* Five Tests */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {fiveTests.map((test) => {
              const response = responses[test.id];
              return (
                <div key={test.id} style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "28px 32px",
                  border: `1px solid oklch(90% 0.01 80)`,
                }}>
                  <p style={{
                    fontFamily: montserrat,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: orange,
                    marginBottom: 6,
                    marginTop: 0,
                  }}>
                    {t(test.title)}
                  </p>
                  <p style={{
                    fontFamily: montserrat,
                    fontSize: 17,
                    fontWeight: 600,
                    color: navy,
                    lineHeight: 1.45,
                    marginBottom: 10,
                    marginTop: 0,
                  }}>
                    {t(test.question)}
                  </p>
                  <p style={{
                    fontFamily: montserrat,
                    fontSize: 13,
                    color: charcoal,
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    marginBottom: 20,
                    marginTop: 0,
                  }}>
                    {t(test.helpText)}
                  </p>

                  {/* Response pills */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {(["yes", "not-yet", "unsure"] as const).map((val) => {
                      const isSelected = response === val;
                      const label =
                        val === "yes"
                          ? t(ui.labels.yes)
                          : val === "not-yet"
                          ? lang === "en" ? "Not yet" : lang === "id" ? "Belum" : "Nog niet"
                          : t(ui.labels.unsure);
                      return (
                        <button
                          key={val}
                          onClick={() => handleResponse(test.id, val)}
                          style={{
                            padding: "9px 20px",
                            borderRadius: 24,
                            border: "none",
                            cursor: "pointer",
                            fontFamily: montserrat,
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            background: isSelected ? orange : lightGray,
                            color: isSelected ? offWhite : charcoal,
                            transition: "background 0.15s ease, color 0.15s ease",
                          }}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result */}
          {showResult && (
            <div style={{
              marginTop: 48,
              background: "oklch(28% 0.09 260)",
              borderRadius: 12,
              padding: "36px 36px",
            }}>
              <p style={{
                fontFamily: montserrat,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: orange,
                marginBottom: 16,
                marginTop: 0,
              }}>
                {t(ui.labels.yourResults)}
              </p>
              <p style={{
                fontFamily: cormorant,
                fontSize: "clamp(17px, 2.2vw, 22px)",
                color: offWhite,
                lineHeight: 1.7,
                margin: "0 0 20px",
              }}>
                {getAuditResult()}
              </p>
              <p style={{
                fontFamily: cormorant,
                fontSize: 16,
                fontStyle: "italic",
                color: "oklch(70% 0.03 80)",
                lineHeight: 1.6,
                margin: "0 0 28px",
              }}>
                {t(threeMonthNote)}
              </p>

              <button
                onClick={handleSaveAudit}
                disabled={auditSaved || auditPending}
                style={{
                  padding: "12px 24px",
                  borderRadius: 6,
                  border: "none",
                  cursor: auditSaved ? "default" : "pointer",
                  fontFamily: montserrat,
                  fontSize: 13,
                  fontWeight: 700,
                  background: auditSaved ? "oklch(45% 0.06 260)" : orange,
                  color: offWhite,
                  letterSpacing: "0.04em",
                }}>
                {auditSaved ? t(ui.buttons.savedToDashboard) : t(ui.buttons.saveToDashboard)}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 5: FACILITATION TOOLS ──────────────────────────── */}
      <div style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: cormorant,
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 600,
            color: navy,
            textAlign: "center",
            marginBottom: 16,
            lineHeight: 1.15,
          }}>
            {t(ui.sectionTitles.facilitationTools)}
          </h2>
          <p style={{
            textAlign: "center",
            color: charcoal,
            fontSize: 16,
            fontFamily: montserrat,
            lineHeight: 1.75,
            maxWidth: 640,
            margin: "0 auto 48px",
          }}>
            {t(facilitationToolsIntro)}
          </p>

          <div className="vc-tools-grid">
            {facilitationTools.map((tool) => (
              <div key={tool.id} style={{
                background: offWhite,
                borderRadius: 12,
                padding: "28px 28px",
              }}>
                <div style={{
                  fontFamily: cormorant,
                  fontSize: 52,
                  fontWeight: 600,
                  color: orange,
                  lineHeight: 1,
                  marginBottom: 12,
                }}>
                  {tool.number}
                </div>
                <h3 style={{
                  fontFamily: montserrat,
                  fontSize: 18,
                  fontWeight: 700,
                  color: navy,
                  marginBottom: 16,
                  marginTop: 0,
                  lineHeight: 1.3,
                }}>
                  {t(tool.title)}
                </h3>

                {/* Purpose tag */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  <span style={{
                    fontFamily: montserrat,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: orange,
                    background: "oklch(97% 0.02 45)",
                    padding: "3px 10px",
                    borderRadius: 12,
                  }}>
                    {t(ui.labels.purpose)}: {t(tool.purpose)}
                  </span>
                </div>

                {/* Duration tag */}
                <div style={{ marginBottom: 20 }}>
                  <span style={{
                    fontFamily: montserrat,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: charcoal,
                    background: "oklch(90% 0.005 80)",
                    padding: "3px 10px",
                    borderRadius: 12,
                  }}>
                    {t(ui.labels.duration)}: {t(tool.duration)}
                  </span>
                </div>

                <p style={{
                  fontFamily: montserrat,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: navy,
                  marginBottom: 8,
                  marginTop: 0,
                }}>
                  {t(ui.labels.howItWorks)}
                </p>
                <p style={{
                  fontFamily: montserrat,
                  fontSize: 14,
                  color: charcoal,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {t(tool.instructions)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 6: RESOURCES ───────────────────────────────────── */}
      <div style={{ background: navy, padding: "80px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: cormorant,
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 600,
            color: offWhite,
            textAlign: "center",
            marginBottom: 48,
            lineHeight: 1.15,
          }}>
            {t(ui.sectionTitles.resources)}
          </h2>

          {/* Featured video — Andy Stanley Visioneering */}
          <div style={{ maxWidth: 720, margin: "0 auto 64px" }}>
            <p style={{
              fontFamily: montserrat,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: orange,
              marginBottom: 14,
              textAlign: "center",
            }}>
              {lang === "en" ? "Watch" : lang === "id" ? "Tonton" : "Bekijk"}
            </p>
            <p style={{
              fontFamily: cormorant,
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontWeight: 600,
              color: offWhite,
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 1.3,
            }}>
              Andy Stanley — Visioneering
            </p>
            <div style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              <iframe
                src="https://www.youtube.com/embed/eK_pMaDqy64"
                title="Andy Stanley — Visioneering"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>

          <div className="vc-resources-grid">
            {resourceCards.map((card, i) => {
              const isExternal = card.href !== "#" && card.href.startsWith("http");
              const hasLink = card.href !== "#";

              const cardInner = (
                <div style={{
                  background: "oklch(28% 0.09 260)",
                  borderRadius: 12,
                  padding: "24px 24px",
                  height: "100%",
                  boxSizing: "border-box",
                  transition: hasLink ? "background 0.2s ease" : undefined,
                  cursor: hasLink ? "pointer" : "default",
                }}>
                  <span style={{
                    fontFamily: montserrat,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: orange,
                    display: "block",
                    marginBottom: 10,
                  }}>
                    {getTypeLabel(card.type)}
                  </span>
                  <h4 style={{
                    fontFamily: montserrat,
                    fontSize: 16,
                    fontWeight: 700,
                    color: offWhite,
                    marginBottom: 6,
                    marginTop: 0,
                    lineHeight: 1.35,
                  }}>
                    {card.title}
                  </h4>
                  <p style={{
                    fontFamily: montserrat,
                    fontSize: 13,
                    color: orange,
                    marginBottom: 12,
                    marginTop: 0,
                    lineHeight: 1.4,
                  }}>
                    {card.meta}
                  </p>
                  <p style={{
                    fontFamily: montserrat,
                    fontSize: 14,
                    color: "oklch(85% 0.01 80)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {card.description}
                  </p>
                  {!hasLink && (
                    <p style={{
                      fontFamily: montserrat,
                      fontSize: 12,
                      color: "oklch(55% 0.04 260)",
                      marginTop: 12,
                      marginBottom: 0,
                      fontStyle: "italic",
                    }}>
                      {lang === "en" ? "(link coming soon)" : lang === "id" ? "(tautan segera hadir)" : "(link binnenkort beschikbaar)"}
                    </p>
                  )}
                </div>
              );

              if (isExternal) {
                return (
                  <a key={i} href={card.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    {cardInner}
                  </a>
                );
              }
              if (hasLink) {
                return (
                  <Link key={i} href={card.href} style={{ textDecoration: "none" }}>
                    {cardInner}
                  </Link>
                );
              }
              return <div key={i}>{cardInner}</div>;
            })}
          </div>

          {/* CTA */}
          <div style={{
            textAlign: "center",
            marginTop: 64,
            paddingTop: 56,
            borderTop: `1px solid oklch(32% 0.08 260)`,
          }}>
            <h3 style={{
              fontFamily: cormorant,
              fontSize: "clamp(24px, 3.5vw, 38px)",
              fontWeight: 600,
              color: offWhite,
              marginBottom: 16,
              lineHeight: 1.2,
            }}>
              {t(cta.heading)}
            </h3>
            <p style={{
              fontFamily: montserrat,
              fontSize: 16,
              color: "oklch(82% 0.01 80)",
              lineHeight: 1.75,
              maxWidth: 560,
              margin: "0 auto 32px",
            }}>
              {t(cta.body)}
            </p>
            <Link
              href="/resources"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                background: orange,
                color: offWhite,
                borderRadius: 6,
                fontFamily: montserrat,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}>
              {t(cta.buttonLabel)}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
