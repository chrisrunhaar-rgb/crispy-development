"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

// ── LANGUAGE ───────────────────────────────────────────────────────────────────

type Lang = "en" | "id";

const tFn = (en: string, id: string, lang: Lang): string =>
  lang === "id" ? id : en;

// ── BRAND TOKENS ───────────────────────────────────────────────────────────────

const navy        = "oklch(22% 0.10 260)";
const navyDeep    = "oklch(18% 0.10 260)";
const amber       = "oklch(65% 0.15 45)";
const amberDim    = "oklch(65% 0.15 45 / 0.12)";
const offWhite    = "oklch(97% 0.005 80)";
const lightGray   = "oklch(95% 0.008 80)";
const mutedGray   = "oklch(93% 0.008 80)";
const bodyText    = "oklch(38% 0.05 260)";
const subText     = "oklch(52% 0.008 260)";
const dimOnNavy   = "oklch(76% 0.03 80)";
const lightOnNavy = "oklch(88% 0.02 80)";
const serif       = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";

// ── CONTENT DATA ───────────────────────────────────────────────────────────────

const CONTRAST_AVOIDANCE = [
  "The meeting ends but nothing is actually decided.",
  "You sense tension but no one names it.",
  "You walk on eggshells because you have learned that honesty has a cost.",
  "Frustration builds quietly over months until something breaks.",
  "Relationships feel polite but never quite close.",
];

const CONTRAST_HEALTHY = [
  "Disagreement comes to the surface before it becomes a crisis.",
  "People say what they actually think, and the team hears it.",
  "Trust deepens because people know where they actually stand.",
  "Decisions stick because everyone had a real voice in them.",
  "Relationships are honest enough to be genuinely close.",
];

const TEACHING_SECTIONS = [
  {
    title: { en: "Why we avoid it", id: "Mengapa kita menghindarinya" }, // TODO: ID translation
    bg: offWhite,
    paragraphs: [
      {
        en: "Conflict avoidance is not laziness. It is usually an intelligent, culturally rational response to a real social risk.",
        id: "Conflict avoidance is not laziness. It is usually an intelligent, culturally rational response to a real social risk.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "In high-context cultures, and this includes most of the contexts where cross-cultural workers operate, direct confrontation can rupture the very things a person is trying to protect: relationship, respect, belonging, face. Staying silent is not passive. It is an active strategy for preserving what matters. A team member who goes quiet in a meeting is not necessarily disengaged. They may be doing exactly what their culture has taught them to do: protect the group by not introducing a point of tension.",
        id: "In high-context cultures, and this includes most of the contexts where cross-cultural workers operate, direct confrontation can rupture the very things a person is trying to protect: relationship, respect, belonging, face. Staying silent is not passive. It is an active strategy for preserving what matters. A team member who goes quiet in a meeting is not necessarily disengaged. They may be doing exactly what their culture has taught them to do: protect the group by not introducing a point of tension.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "The problem is not the instinct. The problem is when that instinct operates in every situation, including ones where the silence is slowly poisoning the team.",
        id: "The problem is not the instinct. The problem is when that instinct operates in every situation, including ones where the silence is slowly poisoning the team.", // TODO: ID translation
        pullQuote: false,
      },
    ],
  },
  {
    title: { en: "What avoidance actually costs", id: "Apa yang sebenarnya hilang dari penghindaran" }, // TODO: ID translation
    bg: lightGray,
    paragraphs: [
      {
        en: "Unaddressed conflict does not disappear. It relocates.",
        id: "Unaddressed conflict does not disappear. It relocates.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "It moves from the meeting room into side conversations. From side conversations into fixed positions. From fixed positions into a quiet, steady erosion of trust. The team learns that honest disagreement is not safe. So they stop offering it. They give you their public agreement and keep their real opinions private. And at that point, you lose access to the best thinking of the people you are leading.",
        id: "It moves from the meeting room into side conversations. From side conversations into fixed positions. From fixed positions into a quiet, steady erosion of trust. The team learns that honest disagreement is not safe. So they stop offering it. They give you their public agreement and keep their real opinions private. And at that point, you lose access to the best thinking of the people you are leading.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "The cost is not just relational. It is strategic. Decisions made without honest input are weaker decisions. A direction that everyone nodded at but no one believed in will not hold under pressure. And in cross-cultural ministry contexts, where the pressures are real and the stakes are high, weak alignment breaks down at exactly the worst moment.",
        id: "The cost is not just relational. It is strategic. Decisions made without honest input are weaker decisions. A direction that everyone nodded at but no one believed in will not hold under pressure. And in cross-cultural ministry contexts, where the pressures are real and the stakes are high, weak alignment breaks down at exactly the worst moment.", // TODO: ID translation
        pullQuote: false,
      },
    ],
  },
  {
    title: { en: "The reframe", id: "Merubah sudut pandang" }, // TODO: ID translation
    bg: offWhite,
    paragraphs: [
      {
        en: "Here is the shift that changes everything: conflict is not the opposite of harmony. It is often the path to it.",
        id: "Here is the shift that changes everything: conflict is not the opposite of harmony. It is often the path to it.", // TODO: ID translation
        pullQuote: true,
      },
      {
        en: "Real unity is not the absence of disagreement. It is the result of working through disagreement in a way that leaves people feeling heard, respected, and genuinely part of a shared decision. The team that has never had an honest argument is not a close team. It is a careful team. There is a difference.",
        id: "Real unity is not the absence of disagreement. It is the result of working through disagreement in a way that leaves people feeling heard, respected, and genuinely part of a shared decision. The team that has never had an honest argument is not a close team. It is a careful team. There is a difference.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "Peace that has not been tested is fragile. Peace that has come through honest conflict has weight to it. It can hold when the environment gets difficult, because the people involved have already proven to each other that they can handle hard conversations without the relationship falling apart.",
        id: "Peace that has not been tested is fragile. Peace that has come through honest conflict has weight to it. It can hold when the environment gets difficult, because the people involved have already proven to each other that they can handle hard conversations without the relationship falling apart.", // TODO: ID translation
        pullQuote: false,
      },
    ],
  },
  {
    title: { en: "What good conflict looks like", id: "Seperti apa konflik yang sehat" }, // TODO: ID translation
    bg: lightGray,
    paragraphs: [
      {
        en: "Productive conflict has a texture that is different from destructive conflict, and a leader needs to be able to recognise both.",
        id: "Productive conflict has a texture that is different from destructive conflict, and a leader needs to be able to recognise both.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "Destructive conflict is personal. It attacks character rather than engaging with ideas. It escalates without resolution. It leaves people feeling unsafe, diminished, or dismissed. This is the conflict most people are trying to avoid, and rightly so.",
        id: "Destructive conflict is personal. It attacks character rather than engaging with ideas. It escalates without resolution. It leaves people feeling unsafe, diminished, or dismissed. This is the conflict most people are trying to avoid, and rightly so.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "Productive conflict is about the issue, not the person.",
        id: "Productive conflict is about the issue, not the person.", // TODO: ID translation
        pullQuote: true,
      },
      {
        en: "It is curious rather than combative. It tolerates disagreement without requiring immediate resolution. It stays in the room, meaning people do not withdraw into silence or take the argument sideways into other relationships. And it ends with both parties having a clearer picture than they started with, even if they have not fully resolved their differences.",
        id: "It is curious rather than combative. It tolerates disagreement without requiring immediate resolution. It stays in the room, meaning people do not withdraw into silence or take the argument sideways into other relationships. And it ends with both parties having a clearer picture than they started with, even if they have not fully resolved their differences.", // TODO: ID translation
        pullQuote: false,
      },
      {
        en: "The leader's job is not to prevent conflict. It is to create the conditions where the productive kind becomes possible and the destructive kind loses its oxygen.",
        id: "The leader's job is not to prevent conflict. It is to create the conditions where the productive kind becomes possible and the destructive kind loses its oxygen.", // TODO: ID translation
        pullQuote: false,
      },
    ],
  },
];

const CONCEPT_CARDS = [
  {
    number: 1,
    title: {
      en: "Name what is coming before it arrives",
      id: "Name what is coming before it arrives", // TODO: ID translation
    },
    body: {
      en: "Before any difficult conversation, tell the people in the room that conflict is going to happen and that it is supposed to. When people are not surprised by tension, they are less likely to react to it as a threat.",
      id: "Before any difficult conversation, tell the people in the room that conflict is going to happen and that it is supposed to. When people are not surprised by tension, they are less likely to react to it as a threat.", // TODO: ID translation
    },
    script: {
      en: "\"I want us to expect that we are going to disagree today. That is actually the goal. If we leave without having disagreed, we probably have not gone deep enough.\"",
      id: "\"I want us to expect that we are going to disagree today. That is actually the goal. If we leave without having disagreed, we probably have not gone deep enough.\"", // TODO: ID translation
    },
  },
  {
    number: 2,
    title: {
      en: "Conflict means listening, not just speaking",
      id: "Conflict means listening, not just speaking", // TODO: ID translation
    },
    body: {
      en: "A conflict conversation that is only about getting your position across is not conflict, it is performance. Productive conflict requires that each person genuinely tries to understand why the other person holds their view.",
      id: "A conflict conversation that is only about getting your position across is not conflict, it is performance. Productive conflict requires that each person genuinely tries to understand why the other person holds their view.", // TODO: ID translation
    },
    script: {
      en: "\"Before you respond, tell me if you understood what they were saying. Not whether you agree. Whether you understood.\"",
      id: "\"Before you respond, tell me if you understood what they were saying. Not whether you agree. Whether you understood.\"", // TODO: ID translation
    },
  },
  {
    number: 3,
    title: {
      en: "The goal is a broader picture, not a winner",
      id: "The goal is a broader picture, not a winner", // TODO: ID translation
    },
    body: {
      en: "When two people with different perspectives engage honestly, both of them usually see something they could not see alone. The goal of the conflict table is not to determine who is right. It is to build a more complete picture than either person brought in.",
      id: "When two people with different perspectives engage honestly, both of them usually see something they could not see alone. The goal of the conflict table is not to determine who is right. It is to build a more complete picture than either person brought in.", // TODO: ID translation
    },
    script: {
      en: "\"Let us hold both of these views at the same time for a moment and see what we can see from that position.\"",
      id: "\"Let us hold both of these views at the same time for a moment and see what we can see from that position.\"", // TODO: ID translation
    },
  },
  {
    number: 4,
    title: {
      en: "Changing your mind is a sign of strength",
      id: "Changing your mind is a sign of strength", // TODO: ID translation
    },
    body: {
      en: "In many cultural contexts, publicly changing your position feels like a loss of face. A good leader names this directly and reframes it before the conversation starts.",
      id: "In many cultural contexts, publicly changing your position feels like a loss of face. A good leader names this directly and reframes it before the conversation starts.", // TODO: ID translation
    },
    script: {
      en: "\"If you walk out of this conversation thinking differently than you walked in, that is exactly what is supposed to happen. That is not weakness. That is what it looks like when two people actually think together.\"",
      id: "\"If you walk out of this conversation thinking differently than you walked in, that is exactly what is supposed to happen. That is not weakness. That is what it looks like when two people actually think together.\"", // TODO: ID translation
    },
  },
  {
    number: 5,
    title: {
      en: "Prepare the room before you need it",
      id: "Prepare the room before you need it", // TODO: ID translation
    },
    body: {
      en: "A leader cannot create safety in the middle of conflict if they have not built it beforehand. Trust is the infrastructure of productive disagreement. The time to invest in relationship, shared values, and honest communication is before the hard conversation is needed, not when you are already in it.",
      id: "A leader cannot create safety in the middle of conflict if they have not built it beforehand. Trust is the infrastructure of productive disagreement. The time to invest in relationship, shared values, and honest communication is before the hard conversation is needed, not when you are already in it.", // TODO: ID translation
    },
    script: {
      en: "\"Part of my job as a leader is to make sure that when we hit a hard moment together, we already have enough trust in the room to handle it.\"",
      id: "\"Part of my job as a leader is to make sure that when we hit a hard moment together, we already have enough trust in the room to handle it.\"", // TODO: ID translation
    },
  },
];

const FIELD_STORY_PARAGRAPHS = [
  {
    en: "Two leaders were working together in a children's home in Southeast Asia. One came from abroad, one from the local community. Both were deeply committed to the work. Both brought clear vision and strong convictions about how things should run.",
    id: "Two leaders were working together in a children's home in Southeast Asia. One came from abroad, one from the local community. Both were deeply committed to the work. Both brought clear vision and strong convictions about how things should run.", // TODO: ID translation
    climax: false,
  },
  {
    en: "And both of them knew, from the first weeks, that they saw things differently.",
    id: "And both of them knew, from the first weeks, that they saw things differently.", // TODO: ID translation
    climax: false,
  },
  {
    en: "Their working styles were different. Their assumptions about decision-making were different. Their instincts about how to care for the children were different. None of this was hidden from them. They were intelligent people. They could see the gap clearly.",
    id: "Their working styles were different. Their assumptions about decision-making were different. Their instincts about how to care for the children were different. None of this was hidden from them. They were intelligent people. They could see the gap clearly.", // TODO: ID translation
    climax: false,
  },
  {
    en: "What they could not do was talk about it.",
    id: "What they could not do was talk about it.", // TODO: ID translation
    climax: false,
  },
  {
    en: "The reason was not hostility. It was the opposite. They respected each other deeply. And that respect had become a barrier. Neither wanted to damage what they had built. Neither wanted to cause the other person discomfort. So they stayed careful. They stayed polite. And the gap stayed open.",
    id: "The reason was not hostility. It was the opposite. They respected each other deeply. And that respect had become a barrier. Neither wanted to damage what they had built. Neither wanted to cause the other person discomfort. So they stayed careful. They stayed polite. And the gap stayed open.", // TODO: ID translation
    climax: false,
  },
  {
    en: "One day, a third person who knew them both well sat down with them and said something simple: \"I want to bring you to a table where conflict is going to happen. I think you need it, and I think it is safe.\"",
    id: "One day, a third person who knew them both well sat down with them and said something simple: \"I want to bring you to a table where conflict is going to happen. I think you need it, and I think it is safe.\"", // TODO: ID translation
    climax: true,
  },
  {
    en: "He set some ground rules. Not a long list. Just enough to name what kind of conversation this was going to be.",
    id: "He set some ground rules. Not a long list. Just enough to name what kind of conversation this was going to be.", // TODO: ID translation
    climax: false,
  },
  {
    en: "Then both of them talked. Honestly. It was not comfortable. There were moments of real friction. But there were also moments where one of them said something that visibly landed for the other person, where a position they had held softened because they had actually heard a different view.",
    id: "Then both of them talked. Honestly. It was not comfortable. There were moments of real friction. But there were also moments where one of them said something that visibly landed for the other person, where a position they had held softened because they had actually heard a different view.", // TODO: ID translation
    climax: false,
  },
  {
    en: "They did not resolve everything. Some of their differences remained. But they left with something they had not had before: a way of talking to each other about the things that mattered. Unity grew from that table. Not because the conflict disappeared, but because it was finally allowed to exist.",
    id: "They did not resolve everything. Some of their differences remained. But they left with something they had not had before: a way of talking to each other about the things that mattered. Unity grew from that table. Not because the conflict disappeared, but because it was finally allowed to exist.", // TODO: ID translation
    climax: false,
  },
];

const FAITH_ANCHOR_PARAGRAPHS = [
  {
    en: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Ephesians 4:15</span> is often quoted in pieces: &ldquo;speaking the truth in love.&rdquo; But the full context matters. Paul is describing what it looks like for a body to grow up into maturity. Speaking truth in love is not a communication style. It is a description of how community develops towards health. Silence, in that framework, is not neutrality. It is a withdrawal from the process of growth.
      </>
    ),
    id: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Efesus 4:15</span> sering dikutip secara sepotong: &ldquo;berkata benar dalam kasih.&rdquo; Tetapi konteks penuhnya penting. Paulus menggambarkan seperti apa ketika sebuah tubuh bertumbuh menjadi dewasa. Berkata benar dalam kasih bukan gaya komunikasi. Itu adalah deskripsi bagaimana komunitas berkembang menuju kesehatan. Diam, dalam kerangka itu, bukan netralitas. Itu adalah penarikan diri dari proses pertumbuhan.
      </> // TODO: ID translation — placeholder used above
    ),
    elevated: false,
  },
  {
    en: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Proverbs 27:17</span> says that iron sharpens iron. That is not a comfortable image. Iron against iron produces friction, heat, and spark. It produces something better than what either piece was before the contact. The sharpening requires the friction.
      </>
    ),
    id: (
      <>
        <span style={{ color: amber, fontWeight: 700 }}>Amsal 27:17</span> berkata bahwa besi mengasah besi. Itu bukan gambaran yang nyaman. Besi melawan besi menghasilkan gesekan, panas, dan percikan. Itu menghasilkan sesuatu yang lebih baik dari apa yang masing-masing benda sebelum bersentuhan. Penajaman membutuhkan gesekan.
      </> // TODO: ID translation — placeholder used above
    ),
    elevated: false,
  },
  {
    en: (
      <>
        Confrontation, when it is rooted in genuine care for the other person and the shared work, is an act of covenant love. It says: I care about you enough to be honest with you. I care about what we are building together enough to name what is wrong.
      </>
    ),
    id: (
      <>
        Konfrontasi, ketika berakar pada kepedulian tulus terhadap orang lain dan pekerjaan bersama, adalah tindakan kasih perjanjian. Ini berkata: Saya cukup peduli pada Anda untuk jujur kepada Anda. Saya cukup peduli tentang apa yang kita bangun bersama untuk menyebutkan apa yang salah.
      </> // TODO: ID translation — placeholder used above
    ),
    elevated: false,
  },
  {
    en: (
      <>
        Silence, in the face of genuine dysfunction, is not kindness. It protects your own comfort at the expense of the person, the team, and the mission you share. The leader who avoids hard conversations is not protecting anyone. They are choosing their own peace over the health of the people they lead.
      </>
    ),
    id: (
      <>
        Diam, di hadapan disfungsi yang nyata, bukanlah kebaikan. Itu melindungi kenyamanan Anda sendiri dengan mengorbankan orang, tim, dan misi yang Anda bagi. Pemimpin yang menghindari percakapan sulit tidak melindungi siapa pun. Mereka memilih kedamaian mereka sendiri di atas kesehatan orang yang mereka pimpin.
      </> // TODO: ID translation — placeholder used above
    ),
    elevated: true,
  },
];

const REFLECTION_QUESTIONS = [
  {
    en: "What conversation have you been avoiding, and what has that silence cost? Not in theory, but specifically: what has it cost the person, the relationship, the team, or the work?",
    id: "What conversation have you been avoiding, and what has that silence cost? Not in theory, but specifically: what has it cost the person, the relationship, the team, or the work?", // TODO: ID translation
  },
  {
    en: "Think of a leader you have seen handle conflict well. What did they do that made it feel different from destructive conflict? What can you apply from how they handled it?",
    id: "Think of a leader you have seen handle conflict well. What did they do that made it feel different from destructive conflict? What can you apply from how they handled it?", // TODO: ID translation
  },
  {
    en: "Where in your current context is polite agreement substituting for honest engagement? What would it take to make honest disagreement feel safe there?",
    id: "Where in your current context is polite agreement substituting for honest engagement? What would it take to make honest disagreement feel safe there?", // TODO: ID translation
  },
];

const KEY_TAKEAWAYS = [
  {
    en: "Name the problem out loud to your team before your next difficult conversation: \"We are going to disagree in this conversation, and that is the goal.\"",
    id: "Name the problem out loud to your team before your next difficult conversation: \"We are going to disagree in this conversation, and that is the goal.\"", // TODO: ID translation
  },
  {
    en: "Identify one relationship in your current team where silence has become the default, and ask for a real conversation this week, not to resolve everything, but to begin.",
    id: "Identify one relationship in your current team where silence has become the default, and ask for a real conversation this week, not to resolve everything, but to begin.", // TODO: ID translation
  },
  {
    en: "Build trust before you need it: invest in one relational moment this week with someone you may eventually need to have a hard conversation with.",
    id: "Build trust before you need it: invest in one relational moment this week with someone you may eventually need to have a hard conversation with.", // TODO: ID translation
  },
];

// ── COMPONENT ──────────────────────────────────────────────────────────────────

type Props = { userId: string | null; isSaved: boolean };

export default function HealthyConflictClient({ isSaved: initialSaved }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [reflections, setReflections] = useState<Record<number, string>>({});

  const t = (en: string, id: string) => tFn(en, id, lang);

  function handleSave() {
    if (saved || isPending) return;
    startTransition(async () => {
      await saveResourceToDashboard("healthy-conflict");
      setSaved(true);
    });
  }

  function toggleCard(index: number) {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  // ── RESPONSIVE CONTRAST CARD GRID ─────────────────────────────────────────
  // We detect window width with a simple CSS media query approach via inline styles.
  // Since this is inline-only, we use a fixed 2-col grid that stacks via min-width.

  return (
    <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle langs={["en", "id"]} />

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <div style={{
        background: navy,
        padding: "clamp(72px, 10vw, 96px) 24px clamp(64px, 9vw, 88px)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: amber,
        }} />
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 20,
          }}>
            {t("Cross-Cultural · Leadership", "Lintas Budaya · Kepemimpinan")}
          </p>

          <h1 style={{
            fontFamily: serif,
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 600,
            color: offWhite,
            lineHeight: 1.08,
            margin: "0 0 24px",
          }}>
            {t(
              "Creating Healthy Conflict: An Underrated Leadership Skill",
              "Menciptakan Konflik yang Sehat: Keahlian Kepemimpinan yang Diremehkan", // TODO: ID translation
            )}
          </h1>

          <p style={{
            fontFamily: serif,
            fontSize: "clamp(17px, 2vw, 21px)",
            fontWeight: 400,
            color: "oklch(82% 0.025 80)",
            lineHeight: 1.75,
            fontStyle: "italic",
            maxWidth: 600,
            marginBottom: 32,
          }}>
            {t(
              "Most leaders know how to keep the peace. Fewer know how to break it in a way that builds something better.",
              "Most leaders know how to keep the peace. Fewer know how to break it in a way that builds something better.", // TODO: ID translation
            )}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={handleSave}
              disabled={saved || isPending}
              style={{
                padding: "12px 28px",
                background: saved ? "oklch(35% 0.05 260)" : amber,
                color: offWhite,
                border: "none",
                borderRadius: 0,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: saved ? "default" : "pointer",
              }}
            >
              {saved
                ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard")
                : t("Save to Dashboard", "Simpan ke Dashboard")}
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. INTRODUCTION ──────────────────────────────────────────────────── */}
      <div style={{ background: offWhite, padding: "clamp(56px, 8vw, 80px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 20,
          }}>
            {t(
              "There is a particular silence that cross-cultural leaders know well. The meeting ends. Heads nod. Everyone smiles. You walk out feeling like something was resolved. And then nothing changes.",
              "There is a particular silence that cross-cultural leaders know well. The meeting ends. Heads nod. Everyone smiles. You walk out feeling like something was resolved. And then nothing changes.", // TODO: ID translation
            )}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 20,
          }}>
            {t(
              "Underneath that silence is usually a conversation that never happened. A disagreement that no one named. A frustration that went underground instead of onto the table.",
              "Underneath that silence is usually a conversation that never happened. A disagreement that no one named. A frustration that went underground instead of onto the table.", // TODO: ID translation
            )}
          </p>

          <img
            src="/images/resources/healthy-conflict/conflict-table.jpg"
            alt="Two pairs of hands at a table — the setting of honest conversation"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              margin: "8px 0 28px",
              borderLeft: `4px solid ${amber}`,
            }}
          />

          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 20,
          }}>
            {t(
              "This is not a failure of character. In many of the cultures where cross-cultural leaders work, silence is the respectful response. Raising a direct objection can feel like an attack. Holding your position publicly can be heard as a refusal to submit. The instinct to protect relational harmony is not weakness, it is wisdom shaped by culture, community, and history.",
              "This is not a failure of character. In many of the cultures where cross-cultural leaders work, silence is the respectful response. Raising a direct objection can feel like an attack. Holding your position publicly can be heard as a refusal to submit. The instinct to protect relational harmony is not weakness, it is wisdom shaped by culture, community, and history.", // TODO: ID translation
            )}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: "oklch(30% 0.12 260)",
            lineHeight: 1.85,
            marginBottom: 20,
            fontStyle: "italic",
            marginTop: 8,
          }}>
            {t(
              "But instincts, however culturally appropriate, have consequences.",
              "But instincts, however culturally appropriate, have consequences.", // TODO: ID translation
            )}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(15px, 1.6vw, 17px)",
            fontWeight: 400,
            color: bodyText,
            lineHeight: 1.85,
            marginBottom: 0,
          }}>
            {t(
              "This module is about what happens when healthy conflict is missing, what it actually looks like when it is present, and how a leader can create the conditions where honest disagreement becomes the thing that builds trust rather than destroys it.",
              "This module is about what happens when healthy conflict is missing, what it actually looks like when it is present, and how a leader can create the conditions where honest disagreement becomes the thing that builds trust rather than destroys it.", // TODO: ID translation
            )}
          </p>
        </div>
      </div>

      {/* ── 3. LEARNING OUTCOME ──────────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 24,
          }}>
            {t("After This Module", "Setelah Modul Ini")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              t(
                "Recognise when conflict avoidance is costing your team more than the conflict itself would.",
                "Recognise when conflict avoidance is costing your team more than the conflict itself would.", // TODO: ID translation
              ),
              t(
                "Distinguish between destructive conflict and productive conflict, and describe what makes the difference.",
                "Distinguish between destructive conflict and productive conflict, and describe what makes the difference.", // TODO: ID translation
              ),
              t(
                "Create a structured, culturally aware space where honest disagreement can happen safely.",
                "Create a structured, culturally aware space where honest disagreement can happen safely.", // TODO: ID translation
              ),
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 3,
                  height: 20,
                  background: amber,
                  flexShrink: 0,
                  marginTop: 3,
                }} />
                <p style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: bodyText,
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. CONTRAST CARD ─────────────────────────────────────────────────── */}
      <div style={{ background: offWhite, padding: "clamp(56px, 8vw, 72px) 24px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: subText,
            marginBottom: 28,
          }}>
            {t("Avoidance vs. Healthy Conflict", "Penghindaran vs. Konflik Sehat")}
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 0,
          }}>
            {/* Left — Avoidance */}
            <div style={{
              background: mutedGray,
              padding: "36px 32px",
              borderRight: "1px solid oklch(88% 0.008 80)",
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: subText,
                marginBottom: 20,
              }}>
                {t("Avoidance", "Penghindaran")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CONTRAST_AVOIDANCE.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: subText,
                      flexShrink: 0,
                      marginTop: 7,
                    }} />
                    <p style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: 14,
                      fontWeight: 400,
                      color: subText,
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Healthy Conflict */}
            <div style={{
              background: offWhite,
              padding: "36px 32px",
              borderTop: `3px solid ${amber}`,
              borderLeft: `3px solid ${amber}`,
            }}>
              <p style={{
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: amber,
                marginBottom: 20,
              }}>
                {t("Healthy Conflict", "Konflik Sehat")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CONTRAST_HEALTHY.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: amber,
                      flexShrink: 0,
                      marginTop: 7,
                    }} />
                    <p style={{
                      fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: bodyText,
                      lineHeight: 1.65,
                      margin: 0,
                    }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. TEACHING — 4 SECTIONS ─────────────────────────────────────────── */}
      {TEACHING_SECTIONS.map((section, si) => (
        <div key={si}>
          {si === 1 && (
            <div style={{ height: 3, background: amber, maxWidth: 120, margin: "0 auto" }} />
          )}
          {si === 2 && (
            <div style={{ height: 8, background: navy }} />
          )}
        <div style={{ background: section.bg, padding: "clamp(56px, 7vw, 80px) 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: "clamp(18px, 2.2vw, 24px)",
              fontWeight: 800,
              color: navy,
              marginBottom: 24,
            }}>
              {lang === "id" ? section.title.id : section.title.en}
            </h2>

            {section.paragraphs.map((para, pi) =>
              para.pullQuote ? (
                <div key={pi} style={{
                  fontFamily: serif,
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontStyle: "italic",
                  color: navy,
                  borderLeft: `3px solid ${amber}`,
                  paddingLeft: 20,
                  margin: "28px 0",
                  lineHeight: 1.6,
                }}>
                  {lang === "id" ? para.id : para.en}
                </div>
              ) : (
                <p key={pi} style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: "clamp(14px, 1.5vw, 16px)",
                  fontWeight: 400,
                  color: bodyText,
                  lineHeight: 1.85,
                  marginBottom: 20,
                }}>
                  {lang === "id" ? para.id : para.en}
                </p>
              )
            )}
          </div>
        </div>
        </div>
      ))}

      {/* ── 6. CONCEPT CARDS — THE CONFLICT TABLE ────────────────────────────── */}
      <div style={{ background: navy, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 12,
          }}>
            {t("The Conflict Table", "Meja Konflik")}
          </p>

          <h2 style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(20px, 2.8vw, 28px)",
            fontWeight: 800,
            color: offWhite,
            marginBottom: 40,
          }}>
            {t(
              "5 Elements of a Safe Space",
              "5 Elemen Ruang yang Aman", // TODO: ID translation
            )}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONCEPT_CARDS.map((card, ci) => {
              const isOpen = !!expandedCards[ci];
              return (
                <div
                  key={ci}
                  style={{
                    background: "oklch(28% 0.10 260)",
                    border: `1px solid ${isOpen ? amber : "oklch(32% 0.10 260)"}`,
                    borderTop: isOpen ? `2px solid ${amber}` : undefined,
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => toggleCard(ci)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <span style={{
                        fontFamily: serif,
                        fontSize: 32,
                        fontWeight: 700,
                        color: amber,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}>
                        {card.number}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: offWhite,
                        lineHeight: 1.3,
                      }}>
                        {lang === "id" ? card.title.id : card.title.en}
                      </span>
                    </div>
                    <span style={{
                      color: amber,
                      fontSize: 20,
                      fontWeight: 700,
                      flexShrink: 0,
                      lineHeight: 1,
                    }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 24px 24px" }}>
                      <p style={{
                        fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                        fontSize: 14,
                        color: dimOnNavy,
                        lineHeight: 1.8,
                        marginBottom: 20,
                      }}>
                        {lang === "id" ? card.body.id : card.body.en}
                      </p>
                      <div style={{
                        background: amberDim,
                        padding: "14px 18px",
                        borderLeft: `3px solid ${amber}`,
                      }}>
                        <p style={{
                          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: amber,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: 8,
                        }}>
                          {t("You might say:", "Anda bisa berkata:")}
                        </p>
                        <p style={{
                          fontFamily: serif,
                          fontSize: 15,
                          fontStyle: "italic",
                          color: lightOnNavy,
                          lineHeight: 1.7,
                          margin: 0,
                        }}>
                          {lang === "id" ? card.script.id : card.script.en}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 7. FIELD STORY ───────────────────────────────────────────────────── */}
      <div style={{ background: navyDeep, padding: "clamp(80px, 11vw, 112px) 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 16,
          }}>
            {t("Field Story", "Kisah Lapangan")}
          </p>

          <h2 style={{
            fontFamily: serif,
            fontSize: "clamp(26px, 3.5vw, 38px)",
            fontWeight: 600,
            color: offWhite,
            marginBottom: 40,
          }}>
            {t("Two Leaders, One Table", "Dua Pemimpin, Satu Meja")}
          </h2>

          <div style={{
            height: 1,
            background: "oklch(35% 0.08 260)",
            margin: "0 0 40px",
          }} />

          {FIELD_STORY_PARAGRAPHS.map((para, pi) =>
            para.climax ? (
              <div key={pi} style={{
                borderLeft: `3px solid ${amber}`,
                paddingLeft: 24,
                margin: "32px 0",
              }}>
                <p style={{
                  fontFamily: serif,
                  fontSize: "clamp(17px, 1.9vw, 20px)",
                  color: lightOnNavy,
                  lineHeight: 1.85,
                  fontStyle: "italic",
                  margin: 0,
                }}>
                  {lang === "id" ? para.id : para.en}
                </p>
              </div>
            ) : (
              <p key={pi} style={{
                fontFamily: serif,
                fontSize: "clamp(17px, 1.9vw, 20px)",
                color: "oklch(84% 0.02 80)",
                lineHeight: 1.85,
                marginBottom: 24,
              }}>
                {lang === "id" ? para.id : para.en}
              </p>
            )
          )}
        </div>
      </div>

      {/* ── 8. QUOTE HIGHLIGHT ───────────────────────────────────────────────── */}
      <section style={{ background: offWhite, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Navy quote container */}
          <div style={{ background: navy, padding: "clamp(40px, 6vw, 56px) 44px", marginBottom: 32 }}>
            <p style={{
              fontFamily: serif,
              fontSize: "clamp(24px, 3.2vw, 36px)",
              fontWeight: 600,
              color: offWhite,
              fontStyle: "italic",
              marginBottom: 16,
              lineHeight: 1.3,
              textAlign: "center",
            }}>
              &ldquo;{t("Faithful are the wounds of a friend.", "Setia adalah luka seorang sahabat.")}&rdquo;
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: amber,
              textTransform: "uppercase",
              letterSpacing: "0.10em",
              textAlign: "center",
              marginBottom: 0,
            }}>
              {t("Proverbs 27:6", "Amsal 27:6")}
            </p>
            <div style={{ width: 48, height: 2, background: amber, margin: "20px auto 0" }} />
          </div>
          {/* Commentary paragraph — stays on offWhite below navy box */}
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 15,
            color: bodyText,
            lineHeight: 1.8,
            textAlign: "left",
          }}>
            {t(
              "A friend who only tells you what you want to hear is not actually serving you. In leadership, the most loving thing you can sometimes do for a colleague is to say the thing that is true, even when it is uncomfortable. That is what faithful wounds look like.",
              "A friend who only tells you what you want to hear is not actually serving you. In leadership, the most loving thing you can sometimes do for a colleague is to say the thing that is true, even when it is uncomfortable. That is what faithful wounds look like.", // TODO: ID translation
            )}
          </p>
        </div>
      </section>

      {/* ── 9. FAITH ANCHOR ──────────────────────────────────────────────────── */}
      <div style={{ background: navy, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 12,
          }}>
            {t("Faith Anchor", "Jangkar Iman")}
          </p>

          <h2 style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(20px, 2.8vw, 28px)",
            fontWeight: 800,
            color: offWhite,
            marginBottom: 36,
          }}>
            {t("Sharpened by Honest Contact", "Diasah oleh Kontak yang Jujur")} {/* TODO: ID translation */}
          </h2>

          {FAITH_ANCHOR_PARAGRAPHS.map((para, pi) => (
            <p key={pi} style={{
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 15,
              color: para.elevated ? "oklch(88% 0.02 80)" : dimOnNavy,
              lineHeight: 1.85,
              marginBottom: pi < FAITH_ANCHOR_PARAGRAPHS.length - 1 ? 20 : 0,
            }}>
              {lang === "id" ? para.id : para.en}
            </p>
          ))}
        </div>
      </div>

      {/* ── 10. REFLECTION QUESTIONS ─────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "clamp(64px, 9vw, 88px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: subText,
            marginBottom: 12,
          }}>
            {t("Reflection", "Refleksi")}
          </p>

          <h2 style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(18px, 2.2vw, 24px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 40,
          }}>
            {t("Questions to Sit With", "Pertanyaan untuk Direnungkan")} {/* TODO: ID translation */}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {REFLECTION_QUESTIONS.map((q, qi) => (
              <div key={qi} style={{
                background: offWhite,
                padding: "28px 28px 24px",
              }}>
                <div style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}>
                  <span style={{
                    fontFamily: serif,
                    fontSize: 36,
                    fontWeight: 700,
                    color: amber,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}>
                    {qi + 1}
                  </span>
                  <p style={{
                    fontFamily: serif,
                    fontSize: "clamp(16px, 1.8vw, 18px)",
                    fontStyle: "italic",
                    color: navy,
                    lineHeight: 1.75,
                    margin: 0,
                  }}>
                    {lang === "id" ? q.id : q.en}
                  </p>
                </div>
                <textarea
                  value={reflections[qi] ?? ""}
                  onChange={(e) =>
                    setReflections((prev) => ({ ...prev, [qi]: e.target.value }))
                  }
                  placeholder={t("Your reflection...", "Refleksi Anda...")}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontFamily: serif,
                    fontSize: 15,
                    color: bodyText,
                    background: offWhite,
                    border: "1px solid oklch(88% 0.01 80)",
                    borderRadius: 0,
                    resize: "vertical",
                    lineHeight: 1.75,
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 11. KEY TAKEAWAY ─────────────────────────────────────────────────── */}
      <div style={{
        background: offWhite,
        padding: "clamp(64px, 9vw, 88px) 24px",
        borderTop: `3px solid ${amber}`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 12,
          }}>
            {t("Key Takeaway", "Poin Utama")}
          </p>

          <h2 style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: "clamp(18px, 2.2vw, 24px)",
            fontWeight: 800,
            color: navy,
            marginBottom: 36,
          }}>
            {t("Three things to do this week", "Tiga hal yang perlu dilakukan minggu ini")} {/* TODO: ID translation */}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {KEY_TAKEAWAYS.map((item, ii) => (
              <div key={ii} style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "20px 24px",
                background: lightGray,
              }}>
                <div style={{
                  width: 3,
                  alignSelf: "stretch",
                  background: amber,
                  flexShrink: 0,
                }} />
                <p style={{
                  fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: bodyText,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {lang === "id" ? item.id : item.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 12. FURTHER READING ──────────────────────────────────────────────── */}
      <div style={{ background: lightGray, padding: "clamp(48px, 7vw, 64px) 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: amber,
            marginBottom: 8,
          }}>
            {t("Further Reading", "Bacaan Lebih Lanjut")}
          </p>
          <p style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontSize: 13,
            color: subText,
            lineHeight: 1.6,
            marginBottom: 28,
          }}>
            {t(
              "Sources and recommended books that inform this module.",
              "Sumber dan buku yang menjadi dasar modul ini.",
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                author: "Patrick Lencioni",
                title: "The Five Dysfunctions of a Team",
                year: "2002",
                note: t(
                  "Identifies fear of conflict as the second of five dysfunctions that undermine team performance. The most accessible treatment of why productive conflict is missing in most organisations.",
                  "Mengidentifikasi ketakutan terhadap konflik sebagai disfungsi kedua dari lima yang merusak kinerja tim.",
                ),
              },
              {
                author: "Erin Meyer",
                title: "The Culture Map",
                year: "2014",
                note: t(
                  "Chapter 7 maps how cultures differ on disagreeing — from direct confrontation norms (Netherlands, France, Israel) to strong avoidance cultures (Japan, Indonesia, Thailand). Essential reading for cross-cultural leaders.",
                  "Bab 7 memetakan bagaimana budaya berbeda dalam hal ketidaksetujuan — dari budaya konfrontasi langsung hingga budaya penghindaran.",
                ),
              },
              {
                author: "Peter Scazzero",
                title: "The Emotionally Healthy Leader",
                year: "2015",
                note: t(
                  "Addresses the unique dynamics of conflict avoidance in faith-based organisations, where spiritual language is often used to suppress legitimate disagreement.",
                  "Membahas dinamika unik penghindaran konflik dalam organisasi berbasis iman.",
                ),
              },
              {
                author: "Speed Leas",
                title: "Moving Your Church Through Conflict",
                year: "1985",
                note: t(
                  "A practitioner's map of five levels of conflict in Christian community — from healthy problem-solving through intractable war. A foundational text for ministry leaders navigating team tension.",
                  "Peta praktisi dari lima tingkat konflik dalam komunitas Kristen.",
                ),
              },
            ].map((ref, ri) => (
              <div key={ri} style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: "20px 20px",
                background: offWhite,
              }}>
                <div style={{
                  width: 3,
                  alignSelf: "stretch",
                  background: amber,
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: bodyText,
                    lineHeight: 1.5,
                    margin: "0 0 2px",
                  }}>
                    {ref.author} — <em>{ref.title}</em> ({ref.year})
                  </p>
                  <p style={{
                    fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                    fontSize: 13,
                    fontWeight: 400,
                    color: subText,
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {ref.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 13. CTA FOOTER ───────────────────────────────────────────────────── */}
      <div style={{
        background: navy,
        padding: "clamp(56px, 8vw, 80px) 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: "clamp(20px, 3vw, 30px)",
          fontWeight: 800,
          color: offWhite,
          marginBottom: 16,
        }}>
          {t("Keep Growing", "Terus Bertumbuh")}
        </h2>

        <p style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          fontSize: 15,
          color: dimOnNavy,
          lineHeight: 1.75,
          maxWidth: 520,
          margin: "0 auto 40px",
        }}>
          {t(
            "Explore more resources to deepen your cross-cultural leadership.",
            "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", // TODO: ID translation
          )}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/resources"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              background: amber,
              color: offWhite,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            {t("← Content Library", "← Perpustakaan Konten")}
          </Link>
          <Link
            href="/resources/cultural-intelligence"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              border: `1px solid oklch(45% 0.05 260)`,
              color: offWhite,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              borderRadius: 0,
            }}
          >
            Cultural Intelligence →
          </Link>
        </div>
      </div>
    </div>
  );
}
