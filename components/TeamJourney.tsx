"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { unlockNextTeamStep, lockTeamStep, finalizeTeamStep } from "@/app/(app)/dashboard/team-actions";

export type StepCompletion = {
  user_id: string;
  step_number: number;
  completed_at: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
};

type Step = {
  number: number;
  title: string;
  description: string;
  type: "article" | "assessment" | "workshop";
  icon: string;
  collectsData: boolean;
  dataLabel: string | null;
  comingSoon?: boolean;
  contentUrl?: string;
};

const BASE_JOURNEY_STEPS: Step[] = [
  {
    number: 1,
    title: "Team Foundations",
    description: "Establish your team's identity, values, and shared expectations for the journey ahead. What kind of team do we want to be?",
    type: "article",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/team-foundations",
  },
  {
    number: 2,
    title: "Team Purpose & Vision",
    description: "Clarify why your team exists and where you're heading together. A shared vision is the foundation of everything that follows.",
    type: "workshop",
    icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/team-purpose-vision",
  },
  {
    number: 3,
    title: "Getting to Know Each Other",
    description: "Every person on your team carries a unique story, background, and context. Make space to truly see one another.",
    type: "workshop",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/know-each-other",
  },
  {
    number: 4,
    title: "Communication Culture",
    description: "How does your team talk, listen, and disagree? Establish shared norms for healthy, cross-cultural communication.",
    type: "article",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    collectsData: true,
    dataLabel: "Comm Style",
    contentUrl: "/team/communication-culture",
  },
  {
    number: 5,
    title: "Trust & Psychological Safety",
    description: "Build the foundation that makes everything else possible. Teams that feel safe take risks, speak up, and grow together.",
    type: "workshop",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    collectsData: true,
    dataLabel: "Trust Score",
    contentUrl: "/team/trust-psychological-safety",
  },
  {
    number: 6,
    title: "Roles & Contribution",
    description: "Clarify who does what, why, and how. When roles are clear and gifts are recognised, teams unlock their full potential.",
    type: "article",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    collectsData: true,
    dataLabel: "Contribution Zone",
    contentUrl: "/team/roles-contribution",
  },
  {
    number: 7,
    title: "Navigating Conflict",
    description: "Conflict is inevitable — how you handle it defines your culture. Learn to turn tension into growth rather than fracture.",
    type: "workshop",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    collectsData: true,
    dataLabel: "Conflict Style",
    contentUrl: "/team/navigating-conflict",
  },
  {
    number: 8,
    title: "Decision Making Together",
    description: "Who decides, and how? Build a shared decision-making culture that honours everyone while keeping the team moving forward.",
    type: "article",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/decision-making",
  },
  {
    number: 9,
    title: "Accountability & Follow-Through",
    description: "Commitments made, commitments kept. Build a culture where people own their responsibilities and support each other to deliver.",
    type: "workshop",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/accountability",
  },
  {
    number: 10,
    title: "Forward Together",
    description: "Celebrate how far you've come and set your next horizon. A healthy team never stops growing — this is where you begin again.",
    type: "workshop",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    collectsData: false,
    dataLabel: null,
    contentUrl: "/team/forward-together",
  },
];

// Assessment add-on steps — each has an insertAfter position (base step number after which it slots in)
type AssessmentDef = Omit<Step, "number"> & { insertAfter: number };

const ASSESSMENT_STEP_DEFS: Record<string, AssessmentDef> = {
  // After step 3 "Getting to Know Each Other" — personal insights that deepen first impressions
  "wheel-of-life": {
    title: "Wheel of Life",
    description: "See where each team member is thriving and where they need support. Leaders who truly know their people lead them better.",
    type: "assessment",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    collectsData: true,
    dataLabel: "Life Balance",
    contentUrl: "/resources/wheel-of-life",
    insertAfter: 3,
  },
  "enneagram": {
    title: "Enneagram",
    description: "Understand the core motivations and growth paths of each team member. The Enneagram reveals what drives people at the deepest level.",
    type: "assessment",
    icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    collectsData: true,
    dataLabel: "Enneagram Type",
    contentUrl: "/resources/enneagram",
    insertAfter: 3,
  },
  // After step 4 "Communication Culture" — behavioural & personality styles shape how teams communicate
  "disc": {
    title: "DISC Profiles",
    description: "Map your team's behavioural styles — who drives, who influences, who supports, who analyses. Use your differences as strengths.",
    type: "assessment",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    collectsData: true,
    dataLabel: "DISC Type",
    contentUrl: "/resources/disc",
    insertAfter: 4,
  },
  "three-thinking-styles": {
    title: "Three Thinking Styles",
    description: "Understand how each person processes information and makes decisions — and how your styles complement each other.",
    type: "assessment",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    collectsData: true,
    dataLabel: "Thinking Style",
    contentUrl: "/resources/three-thinking-styles",
    insertAfter: 4,
  },
  "myers-briggs": {
    title: "Myers-Briggs (MBTI)",
    description: "Explore personality types and how your team members are energised, perceive the world, and make decisions.",
    type: "assessment",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    collectsData: true,
    dataLabel: "MBTI Type",
    contentUrl: "/resources/myers-briggs",
    insertAfter: 4,
  },
  "16-personalities": {
    title: "16 Personalities",
    description: "In-depth personality profiles that reveal how your team members think, feel, and interact in work and relationships.",
    type: "assessment",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    collectsData: true,
    dataLabel: "Personality",
    contentUrl: "/resources/16-personalities",
    insertAfter: 4,
  },
  "big-five": {
    title: "Big Five (OCEAN)",
    description: "The gold standard in personality research — measure Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism across your team.",
    type: "assessment",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    collectsData: true,
    dataLabel: "OCEAN Profile",
    contentUrl: "/resources/big-five",
    insertAfter: 4,
  },
  // After step 5 "Trust & Psychological Safety" — spiritual gifts are shared most freely in a safe team
  "karunia-rohani": {
    title: "Karunia Rohani",
    description: "Discover each team member's spiritual gifts and how they're uniquely wired to serve and contribute within the team.",
    type: "assessment",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    collectsData: true,
    dataLabel: "Gift Profile",
    contentUrl: "/resources/karunia-rohani",
    insertAfter: 5,
  },
};

function buildJourneySteps(selectedAssessments: string[]): Step[] {
  const steps: Omit<Step, "number">[] = [];

  for (const baseStep of BASE_JOURNEY_STEPS) {
    steps.push(baseStep);
    // Insert any selected assessments that belong after this base step
    selectedAssessments
      .filter(id => ASSESSMENT_STEP_DEFS[id]?.insertAfter === baseStep.number)
      .forEach(id => steps.push(ASSESSMENT_STEP_DEFS[id]));
  }

  // Renumber sequentially after insertions
  return steps.map((s, i) => ({ ...s, number: i + 1 } as Step));
}

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  assessment: "Assessment",
  workshop: "Workshop",
};

// Type badge colors — subdued, brand-safe
const TYPE_BADGE: Record<string, { color: string; bg: string }> = {
  article:    { color: "oklch(38% 0.10 260)", bg: "oklch(38% 0.10 260 / 0.08)" },
  assessment: { color: "oklch(40% 0.10 290)", bg: "oklch(40% 0.10 290 / 0.08)" },
  workshop:   { color: "oklch(38% 0.12 145)", bg: "oklch(38% 0.12 145 / 0.08)" },
};

export default function TeamJourney({
  teamId,
  teamName,
  leaderName,
  leaderUserId,
  currentStep,
  teamMembers,
  stepCompletions,
  isLeader,
  finalizedSteps = [],
  selectedAssessments = [],
}: {
  teamId: string;
  teamName: string;
  leaderName?: string;
  leaderUserId?: string;
  currentStep: number;
  teamMembers: TeamMember[];
  stepCompletions: StepCompletion[];
  isLeader: boolean;
  finalizedSteps?: number[];
  selectedAssessments?: string[];
}) {
  const JOURNEY_STEPS = buildJourneySteps(selectedAssessments);

  const [expandedStep, setExpandedStep] = useState<number>(currentStep);
  const [localCurrentStep, setLocalCurrentStep] = useState(currentStep);
  const [isPending, startTransition] = useTransition();
  const [isLockPending, startLockTransition] = useTransition();
  const [isFinalizePending, startFinalizeTransition] = useTransition();
  const [localFinalizedSteps, setLocalFinalizedSteps] = useState<number[]>(finalizedSteps);

  // Build combined display list: leader first, then members
  const displayMembers: (TeamMember & { isLeader?: boolean })[] = [
    ...(leaderUserId && leaderName ? [{ id: leaderUserId, name: leaderName, email: "", isLeader: true }] : []),
    ...teamMembers,
  ];

  // Build a completion map: step_number → Set of user_ids who completed
  const completionMap = new Map<number, Set<string>>();
  for (const sc of stepCompletions) {
    if (!completionMap.has(sc.step_number)) {
      completionMap.set(sc.step_number, new Set());
    }
    completionMap.get(sc.step_number)!.add(sc.user_id);
  }

  // Overall journey progress (based on all participants: leader + members)
  const allParticipantCount = Math.max(displayMembers.length, 1);
  const unlockedSteps = JOURNEY_STEPS.filter(s => s.number <= localCurrentStep);
  const totalCompletions = unlockedSteps.reduce((sum, s) => {
    const completedCount = completionMap.get(s.number)?.size ?? 0;
    return sum + completedCount;
  }, 0);
  const maxCompletions = unlockedSteps.length * allParticipantCount;
  const overallPct = maxCompletions > 0 ? Math.round((totalCompletions / maxCompletions) * 100) : 0;

  function handleUnlock() {
    const next = localCurrentStep + 1;
    startTransition(async () => {
      const result = await unlockNextTeamStep(teamId, next);
      if (!result.error) {
        setLocalCurrentStep(next);
        setExpandedStep(next);
      }
    });
  }

  function handleLock() {
    const prev = localCurrentStep - 1;
    startLockTransition(async () => {
      const result = await lockTeamStep(teamId, prev);
      if (!result.error) {
        setLocalCurrentStep(prev);
        setExpandedStep(prev);
      }
    });
  }

  function handleFinalize(stepNumber: number, currentlyFinalized: boolean) {
    startFinalizeTransition(async () => {
      const result = await finalizeTeamStep(teamId, stepNumber, !currentlyFinalized);
      if (!result.error) {
        setLocalFinalizedSteps(prev =>
          currentlyFinalized ? prev.filter(n => n !== stepNumber) : [...prev, stepNumber]
        );
      }
    });
  }

  return (
    <div>

      {/* ── Journey header — navy ── */}
      <div style={{
        background: "oklch(30% 0.12 260)",
        padding: "2rem 1.75rem 1.75rem",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "oklch(65% 0.15 45)",
              marginBottom: "0.625rem",
            }}>
              The Journey
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "1.75rem",
              color: "oklch(97% 0.005 80)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}>
              {teamName}
            </h2>
            <p style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "0.975rem",
              color: "oklch(66% 0.04 260)",
              lineHeight: 1.5,
            }}>
              {leaderName && <span>Led by {leaderName} · </span>}
              {teamMembers.length} {teamMembers.length === 1 ? "member" : "members"} · Step {localCurrentStep} of {JOURNEY_STEPS.length}{selectedAssessments.length > 0 ? ` · ${selectedAssessments.length} assessment${selectedAssessments.length !== 1 ? "s" : ""} added` : ""}
            </p>
          </div>

          <div style={{ textAlign: "right", flexShrink: 0, paddingTop: "0.125rem" }}>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "3rem",
              color: "oklch(97% 0.005 80)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}>
              {overallPct}<span style={{ fontSize: "1.25rem", fontWeight: 300, color: "oklch(55% 0.04 260)" }}>%</span>
            </p>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "0.52rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "oklch(50% 0.04 260)",
              marginTop: "0.25rem",
            }}>Team Progress</p>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: "3px",
          background: "oklch(22% 0.10 260)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "oklch(65% 0.15 45)",
            transform: `scaleX(${overallPct / 100})`,
            transformOrigin: "left center",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }} />
        </div>
      </div>

      {/* ── Journey steps — cinematic path ── */}
      <div style={{ border: "1px solid oklch(86% 0.008 80)", borderTop: "none", background: "white" }}>

        {JOURNEY_STEPS.map((step, idx) => {
          const isUnlocked = step.number <= localCurrentStep;
          const isActive = step.number === localCurrentStep;
          const completedUsers = completionMap.get(step.number) ?? new Set<string>();
          const completedCount = completedUsers.size;
          const totalMembers = displayMembers.length;
          const allDone = totalMembers > 0 && completedCount >= totalMembers;
          const isExpanded = expandedStep === step.number;

          const stepStatus: "completed" | "active" | "locked" =
            allDone && step.number < localCurrentStep ? "completed"
            : isUnlocked ? "active"
            : "locked";

          // Path segment flow conditions (for CSS animation)
          const topFlow    = idx > 0 && step.number <= localCurrentStep;
          const bottomFlow = idx < JOURNEY_STEPS.length - 1 && step.number < localCurrentStep;

          const isAssessmentStep = step.type === "assessment";

          return (
            <div key={step.number}>
            <div
              className="journey-step-enter"
              style={{
                animationDelay: `${idx * 38}ms`,
                borderTop: idx === 0 ? "none" : "1px solid oklch(91% 0.005 80)",
                background: isAssessmentStep ? "oklch(99% 0.018 45 / 0.4)" : undefined,
              }}
            >
              {/* ── Step header row ── */}
              <div
                onClick={() => isUnlocked && setExpandedStep(isExpanded ? -1 : step.number)}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  cursor: isUnlocked ? "pointer" : "default",
                  opacity: stepStatus === "locked" ? 0.28 : 1,
                  background: "white",
                  transition: "opacity 0.2s ease",
                  minHeight: isActive ? "68px" : "54px",
                }}
              >

                {/* ── Cinematic path column ── */}
                <div style={{
                  width: "54px",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                }}>

                  {/* Top line */}
                  <div
                    className={topFlow ? "journey-path-flow" : undefined}
                    style={{
                      flex: 1,
                      width: "1.5px",
                      minHeight: "10px",
                      background: idx === 0 ? "transparent"
                        : topFlow ? "oklch(65% 0.15 45)"
                        : "oklch(88% 0.006 80)",
                    }}
                  />

                  {/* Node */}
                  {(() => {
                    const isFinalized = localFinalizedSteps.includes(step.number);
                    const showGreen = isFinalized || stepStatus === "completed";
                    return (
                      <div
                        className={isActive && !showGreen ? "journey-node-pulse" : undefined}
                        style={{
                          width: "17px",
                          height: "17px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: showGreen
                            ? "oklch(52% 0.14 145)"
                            : isActive
                            ? "oklch(65% 0.15 45)"
                            : "transparent",
                          border: `1.5px solid ${
                            showGreen ? "oklch(52% 0.14 145)"
                            : isActive ? "oklch(65% 0.15 45)"
                            : "oklch(82% 0.005 80)"
                          }`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "background 0.3s ease, border-color 0.3s ease",
                          position: "relative",
                          zIndex: 1,
                        }}
                      >
                        {showGreen && (
                          <svg viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth={2.5}
                            strokeLinecap="round" strokeLinejoin="round"
                            style={{ width: "7px", height: "7px" }}>
                            <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                          </svg>
                        )}
                        {isActive && !showGreen && (
                          <div style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "white",
                          }} />
                        )}
                      </div>
                    );
                  })()}

                  {/* Bottom line */}
                  <div
                    className={bottomFlow ? "journey-path-flow" : undefined}
                    style={{
                      flex: 1,
                      width: "1.5px",
                      minHeight: "10px",
                      background: idx === JOURNEY_STEPS.length - 1 ? "transparent"
                        : bottomFlow ? "oklch(65% 0.15 45)"
                        : "oklch(88% 0.006 80)",
                    }}
                  />
                </div>

                {/* Step number — editorial */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  paddingRight: "0.875rem",
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 900,
                    fontSize: "1.125rem",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: isActive
                      ? "oklch(65% 0.15 45)"
                      : localFinalizedSteps.includes(step.number) ? "oklch(52% 0.14 145)"
                      : stepStatus === "completed" ? "oklch(52% 0.14 145)"
                      : "oklch(82% 0.005 80)",
                    transition: "color 0.25s ease",
                  }}>
                    {String(step.number).padStart(2, "0")}
                  </span>
                </div>

                {/* Title + badges + member pills */}
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: "0.75rem" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: isActive ? 700 : stepStatus === "completed" ? 600 : 500,
                    fontSize: isActive ? "1.0625rem" : "0.9375rem",
                    color: isActive ? "oklch(22% 0.005 260)"
                      : localFinalizedSteps.includes(step.number) ? "oklch(28% 0.005 260)"
                      : stepStatus === "completed" ? "oklch(28% 0.005 260)"
                      : isUnlocked ? "oklch(25% 0.005 260)"
                      : "oklch(55% 0.008 260)",
                    lineHeight: 1.25,
                    letterSpacing: isActive ? "-0.01em" : "0",
                    marginBottom: "0.3rem",
                    transition: "all 0.25s ease",
                  }}>
                    {step.title}
                  </p>

                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: TYPE_BADGE[step.type].color,
                      background: TYPE_BADGE[step.type].bg,
                      padding: "2px 7px",
                      flexShrink: 0,
                    }}>
                      {TYPE_LABELS[step.type]}
                    </span>

                    {step.comingSoon && isUnlocked && (
                      <span style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "oklch(58% 0.10 45)",
                        background: "oklch(58% 0.10 45 / 0.1)",
                        padding: "2px 7px",
                        flexShrink: 0,
                      }}>
                        Content soon
                      </span>
                    )}

                    {isUnlocked && totalMembers > 0 && (
                      <div style={{ display: "flex", gap: "3px", alignItems: "center", marginLeft: "0.25rem" }}>
                        {displayMembers.map(m => (
                          <div
                            key={m.id}
                            title={`${m.name}: ${completedUsers.has(m.id) ? "Completed" : "Pending"}`}
                            style={{
                              width: "26px",
                              height: "4px",
                              background: completedUsers.has(m.id)
                                ? "oklch(52% 0.14 145)"
                                : "oklch(86% 0.006 80)",
                              transition: "background 0.25s ease",
                            }}
                          />
                        ))}
                        <span style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.6rem",
                          color: "oklch(56% 0.008 260)",
                          marginLeft: "0.375rem",
                          fontWeight: 500,
                        }}>
                          {completedCount}/{totalMembers}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: status icon + chevron */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0, paddingRight: "1.375rem" }}>
                  {stepStatus === "completed" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="oklch(52% 0.14 145)" strokeWidth={2.5}
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ width: "16px", height: "16px", flexShrink: 0 }}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {stepStatus === "locked" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="oklch(72% 0.005 260)" strokeWidth={1.5}
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ width: "14px", height: "14px", flexShrink: 0 }}>
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {isUnlocked && (
                    <svg viewBox="0 0 16 16" fill="none"
                      stroke="oklch(60% 0.006 260)"
                      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
                      style={{
                        width: "13px", height: "13px",
                        transition: "transform 0.2s ease",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  )}
                </div>
              </div>

              {/* ── Expanded detail panel ── */}
              {isExpanded && isUnlocked && (
                <div
                  className="edit-panel-reveal"
                  style={{
                    borderTop: "1px solid oklch(90% 0.006 80)",
                    background: isActive ? "oklch(99% 0.01 50)" : "oklch(98.5% 0.002 80)",
                    padding: "1.75rem 1.75rem 2rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.75rem",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Watermark step number — cinematic depth */}
                  {isActive && (
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        bottom: "-1.75rem",
                        right: "1rem",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 900,
                        fontSize: "clamp(6rem, 18vw, 10rem)",
                        color: "oklch(30% 0.12 260 / 0.06)",
                        lineHeight: 1,
                        userSelect: "none",
                        pointerEvents: "none",
                        letterSpacing: "-0.06em",
                      }}
                    >
                      {String(step.number).padStart(2, "0")}
                    </div>
                  )}

                  {/* Description + content button row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "oklch(35% 0.008 260)",
                      lineHeight: 1.7,
                      maxWidth: "56ch",
                      flex: 1,
                      minWidth: "200px",
                    }}>
                      {step.description}
                    </p>
                    {step.contentUrl && (
                      <Link
                        href={step.contentUrl}
                        style={{
                          fontFamily: "var(--font-montserrat)",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          background: "oklch(65% 0.15 45)",
                          color: "white",
                          textDecoration: "none",
                          padding: "0.55rem 1.125rem",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      >
                        Open Content →
                      </Link>
                    )}
                  </div>

                  {/* Member results grid — always off-white for readability */}
                  {displayMembers.length > 0 && (
                    <div>
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        letterSpacing: "0.13em",
                        textTransform: "uppercase",
                        color: "oklch(54% 0.008 260)",
                        marginBottom: "0.625rem",
                      }}>
                        Team Progress
                      </p>

                      <div style={{
                        background: "oklch(98.5% 0.003 80)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1px",
                        outline: "1px solid oklch(88% 0.006 80)",
                      }}>
                        {displayMembers.map(member => {
                          const done = completedUsers.has(member.id);
                          const initial = member.name[0]?.toUpperCase() ?? "?";
                          return (
                            <div
                              key={member.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.875rem",
                                padding: "0.625rem 0.875rem",
                                background: done
                                  ? "oklch(52% 0.14 145 / 0.07)"
                                  : "oklch(98.5% 0.003 80)",
                                transition: "background 0.2s ease",
                              }}
                            >
                              <div style={{
                                width: "30px",
                                height: "30px",
                                flexShrink: 0,
                                background: done ? "oklch(52% 0.14 145)" : "oklch(86% 0.006 80)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "background 0.2s ease",
                              }}>
                                {done ? (
                                  <svg viewBox="0 0 24 24" fill="none"
                                    stroke="white" strokeWidth={2.5}
                                    strokeLinecap="round" strokeLinejoin="round"
                                    style={{ width: "14px", height: "14px" }}>
                                    <path d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span style={{
                                    fontFamily: "var(--font-montserrat)",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    color: "oklch(52% 0.008 260)",
                                  }}>
                                    {initial}
                                  </span>
                                )}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                  fontFamily: "var(--font-montserrat)",
                                  fontWeight: 600,
                                  fontSize: "0.85rem",
                                  color: done ? "oklch(28% 0.005 260)" : "oklch(38% 0.008 260)",
                                  transition: "color 0.15s ease",
                                }}>
                                  {member.name}
                                </p>
                                {"isLeader" in member && member.isLeader && (
                                  <p style={{
                                    fontFamily: "var(--font-montserrat)",
                                    fontSize: "0.55rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "oklch(65% 0.15 45)",
                                    marginTop: "0.1rem",
                                  }}>
                                    Leader
                                  </p>
                                )}
                              </div>

                              <span style={{
                                fontFamily: "var(--font-montserrat)",
                                fontSize: "0.58rem",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: done ? "oklch(42% 0.13 145)" : "oklch(62% 0.008 260)",
                                transition: "color 0.15s ease",
                              }}>
                                {done ? "Completed" : "Pending"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Leader unlock controls */}
                  {isLeader && isActive && localCurrentStep < JOURNEY_STEPS.length && (
                    <div>
                      <div style={{ height: "1px", background: "oklch(88% 0.008 80)", marginBottom: "1.25rem" }} />
                      <p style={{
                        fontFamily: "var(--font-montserrat)",
                        fontSize: "0.72rem",
                        color: "oklch(52% 0.008 260)",
                        marginBottom: "0.875rem",
                        lineHeight: 1.5,
                      }}>
                        Unlocking notifies your team and opens the next step.
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={handleUnlock}
                          disabled={isPending}
                          style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            background: allDone ? "oklch(65% 0.15 45)" : "transparent",
                            color: allDone ? "white" : "oklch(30% 0.12 260)",
                            border: `1.5px solid ${allDone ? "oklch(65% 0.15 45)" : "oklch(30% 0.12 260)"}`,
                            padding: "0.575rem 1.375rem",
                            cursor: isPending ? "wait" : "pointer",
                            opacity: isPending ? 0.55 : 1,
                            transition: "all 0.15s ease",
                          }}
                        >
                          {isPending ? "Unlocking…" : `Unlock Step ${localCurrentStep + 1} →`}
                        </button>

                        {!allDone && teamMembers.length > 0 && (
                          <p style={{
                            fontFamily: "var(--font-montserrat)",
                            fontSize: "0.72rem",
                            color: "oklch(58% 0.008 260)",
                            lineHeight: 1.5,
                          }}>
                            {completedCount}/{teamMembers.length} members done — you can still unlock early
                          </p>
                        )}
                      </div>

                      {/* Finalize step — leader only */}
                      {isLeader && isUnlocked && (
                        <div style={{ marginTop: "0.875rem" }}>
                          <button
                            type="button"
                            onClick={() => handleFinalize(step.number, localFinalizedSteps.includes(step.number))}
                            disabled={isFinalizePending}
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              letterSpacing: "0.07em",
                              textTransform: "uppercase",
                              background: localFinalizedSteps.includes(step.number)
                                ? "oklch(52% 0.14 145 / 0.1)"
                                : "transparent",
                              color: localFinalizedSteps.includes(step.number)
                                ? "oklch(42% 0.13 145)"
                                : "oklch(50% 0.008 260)",
                              border: `1.5px solid ${localFinalizedSteps.includes(step.number) ? "oklch(52% 0.14 145 / 0.4)" : "oklch(82% 0.006 80)"}`,
                              padding: "0.45rem 1rem",
                              cursor: isFinalizePending ? "wait" : "pointer",
                              opacity: isFinalizePending ? 0.55 : 1,
                              transition: "all 0.15s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.375rem",
                            }}
                          >
                            {localFinalizedSteps.includes(step.number) ? (
                              <>
                                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: "10px", height: "10px" }}>
                                  <path d="M1.5 6l3 3 6-6" />
                                </svg>
                                Step Finalized — Undo
                              </>
                            ) : isFinalizePending ? "Finalizing…" : "Finalize Step ✓"}
                          </button>
                        </div>
                      )}

                      {/* Lock step back — leader only */}
                      {localCurrentStep > 1 && (
                        <div style={{ marginTop: "0.875rem" }}>
                          <button
                            type="button"
                            onClick={handleLock}
                            disabled={isLockPending}
                            style={{
                              fontFamily: "var(--font-montserrat)",
                              fontSize: "0.62rem",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                              background: "transparent",
                              color: "oklch(56% 0.008 260)",
                              border: "none",
                              padding: 0,
                              cursor: isLockPending ? "wait" : "pointer",
                              opacity: isLockPending ? 0.5 : 1,
                              textDecoration: "underline",
                              textDecorationColor: "currentColor",
                              textUnderlineOffset: "3px",
                            }}
                          >
                            {isLockPending ? "Locking…" : `← Lock step ${localCurrentStep} again`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Journey complete message */}
                  {isLeader && localCurrentStep === JOURNEY_STEPS.length && step.number === JOURNEY_STEPS.length && (
                    <div style={{ borderTop: "1px solid oklch(88% 0.008 80)", paddingTop: "1.25rem" }}>
                      <p style={{
                        fontFamily: "var(--font-cormorant)",
                        fontStyle: "italic",
                        fontSize: "1.1rem",
                        color: "oklch(42% 0.12 145)",
                        lineHeight: 1.5,
                      }}>
                        Your team has completed the full journey. Well done.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
