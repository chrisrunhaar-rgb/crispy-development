"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleGenAI, Modality, Type, ThinkingLevel, StartSensitivity, EndSensitivity } from "@google/genai";
import type { LiveServerMessage, Session, LiveConnectConfig } from "@google/genai";
import Image from "next/image";
import { useT, type CoachLang } from "../i18n";

type WhiteboardState = {
  focus_today: string | null;
  key_insights: string[];
  values_named: string[];
  action_steps: string[];
  carrying_forward: string | null;
};

type Phase = "LAND" | "SEEK" | "EXPLORE" | "COMMIT" | "CARRY" | "COMPLETE";

// Phase labels are now sourced from i18n (s.phaseLabels) — this constant removed

const PHASE_ORDER: Phase[] = ["LAND", "SEEK", "EXPLORE", "COMMIT", "CARRY", "COMPLETE"];

const GEMINI_MODEL = "gemini-3.1-flash-live-preview";
const WARMUP_AT_SECONDS = 780;

const COACH_ROOM_IMAGES: Record<string, string> = {
  Tara: "/images/coaches/tara-room.jpg",
  Ethan: "/images/coaches/ethan-room.jpg",
};

const PHASE_MIN_SECONDS_DEEP: Partial<Record<Phase, number>> = {
  LAND: 180,
  SEEK: 300,
  EXPLORE: 600,
  COMMIT: 300,
  CARRY: 180,
};

// Nominal session budgets (spec §6 / §5). No booked-length field is confirmed on wp_sessions
// (spec OPEN item), so total_minutes derives from sessionType only: quick = 10, deep = 45.
const NOMINAL_TOTAL_MINUTES: Record<"quick" | "deep", number> = { quick: 10, deep: 45 };

// Deep-session phase bands by elapsed % (spec §3 table). Quick uses stage bands instead.
function deepPhaseHint(pct: number): string {
  if (pct < 10) return "OPEN";
  if (pct < 35) return "EXPLORE";
  if (pct < 60) return "DEEPEN";
  if (pct < 75) return "SHIFT";
  if (pct < 90) return "COMMIT";
  return "CLOSE";
}

// Quick-session stage bands by elapsed % (spec §6 table).
function quickStageHint(pct: number): string {
  if (pct < 40) return "opening";
  if (pct < 80) return "deepening";
  return "closing";
}

// Build the private "[time note]" line injected before a model turn (spec §6). Never shown to user.
function buildTimeNote(elapsedSec: number, sessionType: "quick" | "deep"): string {
  const total = NOMINAL_TOTAL_MINUTES[sessionType];
  const elapsedMin = elapsedSec / 60;
  const remaining = Math.max(0, Math.round(total - elapsedMin));
  const pct = Math.min(100, Math.max(0, (elapsedMin / total) * 100));
  return sessionType === "quick"
    ? `[time note] About ${remaining} min left of a ${total}-min session. Stage: ${quickStageHint(pct)}.`
    : `[time note] About ${remaining} min left of a ${total}-min session. phase: ${deepPhaseHint(pct)}.`;
}

const PHASE_MIN_SECONDS_QUICK: Partial<Record<Phase, number>> = {
  LAND: 60,
  EXPLORE: 300,  // 5 min minimum — quick session core work
  COMMIT: 120,   // 2 min minimum
  CARRY: 60,
};

type Props = {
  sessionId: string;
  coachName: string;
  coachVoice: string;
  sessionType?: "deep" | "quick";
  lang?: CoachLang;
};

export default function GeminiSessionClient({ sessionId, coachName, coachVoice, sessionType = "deep", lang = "en" }: Props) {
  const s = useT(lang);
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "complete" | "error">("idle");
  const [phase, setPhase] = useState<Phase>("LAND");
  const [whiteboard, setWhiteboard] = useState<WhiteboardState>({
    focus_today: null,
    key_insights: [],
    values_named: [],
    action_steps: [],
    carrying_forward: null,
  });
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // MANUAL MODE (item 6): off by default. When on, the user controls turn-taking by tapping
  // "I'm done" — the coach waits fully and only responds after the manual activity-end signal.
  const [manualMode, setManualMode] = useState(false);
  const manualModeRef = useRef(false);
  // True briefly after the user taps "I'm done" until the coach starts replying — drives button state.
  const [awaitingCoach, setAwaitingCoach] = useState(false);

  // CLOSING SEQUENCE (msg 12991): when the user ends the session, we ask the coach to give a proper
  // spoken closing (short summary + notes-are-saved + warm goodbye) and wait for it to finish — instead
  // of hard-cutting after a fixed 3s. isClosing also hides the other controls so nothing overlaps.
  const [isClosing, setIsClosing] = useState(false);
  // Confirm tap before ending (extra #1) — stops accidental ends. Tapping End Session arms this; the
  // user then confirms ("End session") or cancels ("Keep going").
  const [confirmEnd, setConfirmEnd] = useState(false);

  // CRISIS TAP-TO-CONNECT (items 3/7): visible, not passive. Fires when flag_concern reports
  // self_harm or acute_crisis. Stays up until the person dismisses it — never auto-hides.
  const [crisisVisible, setCrisisVisible] = useState(false);
  const closingRef = useRef(false);          // closing sequence has begun
  const closingSpokeRef = useRef(false);     // coach has produced closing audio (guards premature complete)
  const closingFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isMutedRef = useRef(false);
  const elapsedSecondsRef = useRef(0);
  const isAiSpeakingRef = useRef(false);
  const phaseRef = useRef<Phase>("LAND");
  const whiteboardRef = useRef<WhiteboardState>({ focus_today: null, key_insights: [], values_named: [], action_steps: [], carrying_forward: null });

  const sessionRef = useRef<Session | null>(null);
  const warmupSessionRef = useRef<Session | null>(null);
  const warmupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionClosedRef = useRef(false);

  const micContextRef = useRef<AudioContext | null>(null);
  const playContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const playTimeRef = useRef<number>(0);
  // Tracks every AudioBufferSourceNode currently scheduled/playing so playback can actually be
  // stopped (not just have its clock reset) on pause (item 6a) and interrupt/End Session (item 9).
  const activeAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseStartTimeRef = useRef<number>(Date.now());

  const lastTimeNoteAtRef = useRef<number>(-999);
  const transcriptRef = useRef<string[]>([]);
  const aiRef = useRef<GoogleGenAI | null>(null);
  const systemPromptRef = useRef<string>("");
  const reconnectContextRef = useRef<string | null>(null);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const updateWhiteboardLocal = useCallback((section: string, content: string) => {
    setWhiteboard(prev => {
      let next: WhiteboardState;
      switch (section) {
        case "focus_today":
          next = { ...prev, focus_today: content }; break;
        case "key_insight":
          if (prev.key_insights.includes(content)) return prev;
          next = { ...prev, key_insights: [...prev.key_insights, content] }; break;
        case "value_named":
          if (prev.values_named.includes(content)) return prev;
          next = { ...prev, values_named: [...prev.values_named, content] }; break;
        case "action_step":
          if (prev.action_steps.includes(content)) return prev;
          next = { ...prev, action_steps: [...prev.action_steps, content] }; break;
        case "carrying_forward":
          next = { ...prev, carrying_forward: content }; break;
        default:
          return prev;
      }
      whiteboardRef.current = next;
      return next;
    });
    fetch("/api/coach/whiteboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, section, content }),
    }).catch(() => {});
  }, [sessionId]);

  const handleSessionComplete = useCallback(() => {
    if (sessionClosedRef.current) return;
    sessionClosedRef.current = true;
    const duration = startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : null;
    fetch("/api/coach/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, complete: true, ...(duration && { duration_seconds: duration }) }),
    }).catch(() => {});
    setStatus("complete");
    if (timerRef.current) clearInterval(timerRef.current);
    if (warmupTimerRef.current) clearTimeout(warmupTimerRef.current);
    if (closingFallbackRef.current) clearTimeout(closingFallbackRef.current);
    sessionRef.current?.close();
    warmupSessionRef.current?.close();
    stopAudio();
  }, [sessionId]);

  function stopAudio() {
    workletRef.current?.disconnect();
    workletRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    micContextRef.current?.close().catch(() => {});
    micContextRef.current = null;
  }

  function playPcmChunk(base64: string) {
    const playCtx = playContextRef.current;
    if (!playCtx) return;
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float32[i] = int16[i] / 32768;
    const buffer = playCtx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    const src = playCtx.createBufferSource();
    src.buffer = buffer;
    src.connect(playCtx.destination);
    const now = playCtx.currentTime;
    const startAt = Math.max(now, playTimeRef.current);
    src.start(startAt);
    playTimeRef.current = startAt + buffer.duration;
    activeAudioSourcesRef.current.push(src);
    src.onended = () => {
      activeAudioSourcesRef.current = activeAudioSourcesRef.current.filter(s => s !== src);
      if (playTimeRef.current <= playCtx.currentTime + 0.15) {
        isAiSpeakingRef.current = false;
        setIsAiSpeaking(false);
      }
    };
  }

  // Stop and clear all queued/playing coach audio right now. AudioBufferSourceNode has no pause —
  // once scheduled, only .stop() actually silences it. Used on pause (item 6a, so the coach doesn't
  // keep talking after "Pause" is tapped) and on interrupt / End Session (item 9, so the tail of a
  // cut-off sentence can't keep playing underneath the next turn's audio).
  function stopCoachAudio() {
    const sources = activeAudioSourcesRef.current;
    activeAudioSourcesRef.current = [];
    for (const src of sources) {
      src.onended = null;
      try { src.stop(); } catch { /* already stopped or never started */ }
    }
    playTimeRef.current = playContextRef.current?.currentTime ?? 0;
  }

  const buildLiveConfig = useCallback((systemPrompt: string, voice: string, manual: boolean): LiveConnectConfig => ({
    responseModalities: [Modality.AUDIO],
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    systemInstruction: systemPrompt,
    generationConfig: { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } },
    realtimeInputConfig: manual
      ? {
          // MANUAL MODE (item 6): automatic turn detection is OFF. Turn-taking is driven by the
          // user tapping "I'm done", which fires sendRealtimeInput({ activityEnd: {} }). The coach
          // only responds after that signal — it never fills the silence or cuts the person off.
          automaticActivityDetection: { disabled: true },
        }
      : {
          // AUTOMATIC MODE (item 5, default for everyone): calmer turn-taking so the coach waits
          // longer before replying and is less likely to interrupt. silenceDurationMs raised from
          // 500 → 1800ms and endOfSpeechSensitivity lowered to LOW. This gives reflective coachees
          // room to pause mid-thought without being cut off.
          automaticActivityDetection: {
            disabled: false,
            startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
            endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
            prefixPaddingMs: 20,
            silenceDurationMs: 1800,
          },
        },
    tools: [{
      functionDeclarations: [
        {
          name: "update_whiteboard",
          description: "Update the coaching whiteboard. Call throughout the session whenever something meaningful surfaces.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              section: { type: Type.STRING, enum: ["focus_today", "key_insight", "value_named", "action_step", "carrying_forward"] },
              content: { type: Type.STRING, description: "Concise text — one sentence max." },
            },
            required: ["section", "content"],
          },
        },
        {
          name: "flag_concern",
          description: "Silently log a welfare concern. Call this once per category per session whenever self_harm, acute_crisis, or severe_burnout language surfaces (see SCOPE & SAFETY in your instructions) — in addition to, not instead of, redirecting the person verbally in the moment. NEVER announce this call, mention logging, or say anything that reveals a system action is happening. This is invisible to the coachee.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING, enum: ["self_harm", "acute_crisis", "severe_burnout"] },
              note: { type: Type.STRING, description: "One factual sentence, no diagnosis, for QA follow-up only." },
            },
            required: ["category", "note"],
          },
        },
        {
          name: "advance_phase",
          description: "Signal the session is moving to the next phase. Only call this when the phase work is genuinely done — not after a set time, but after the work is done. LAND: only advance after listening fully and reflecting what you heard. SEEK: only advance after completing FIRE (Focus + Importance + Result questions — all three). EXPLORE: only advance after asking 'What else?' at least twice AND exploring at least two Q360 angles AND a meaningful insight has surfaced. COMMIT: only advance after asking three times for the coachee's own ideas AND at least one concrete action step is on the whiteboard. CARRY: only advance to COMPLETE after the coachee has named their own takeaway (update_whiteboard carrying_forward must be called first). A fast, deep conversation is fine — but skipping the work is not.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              phase: { type: Type.STRING, enum: ["LAND", "SEEK", "EXPLORE", "COMMIT", "CARRY", "COMPLETE"] },
            },
            required: ["phase"],
          },
        },
      ],
    }],
  }), []);

  // When manual mode is on, append an instruction so the coach waits fully and never fills silence.
  // Localised for ID users so the coach doesn't code-switch to English (TALI's open item).
  const manualModeInstruction = lang === "id"
    ? `\n\n## MODE MANUAL AKTIF\nOrang ini mengendalikan giliran bicara sendiri. Tunggu sepenuhnya sampai mereka selesai — jangan pernah mengisi keheningan, jangan memotong, jangan mendorong mereka untuk berbicara. Kamu hanya akan merespons setelah mereka memberi sinyal bahwa mereka selesai. Saat merespons, pertimbangkan keseluruhan yang mereka bagikan, bukan hanya kalimat terakhir.`
    : `\n\n## MANUAL MODE ACTIVE\nThis person controls their own turn-taking. Wait fully until they are finished — never fill the silence, never interrupt, never prompt them to keep talking. You will only respond after they signal they are done. When you do respond, reflect on the whole of what they shared, not just their last sentence.`;

  const effectiveSystemPrompt = useCallback(
    (basePrompt: string, manual: boolean) => manual ? basePrompt + manualModeInstruction : basePrompt,
    [manualModeInstruction],
  );

  const handleMessage = useCallback((message: LiveServerMessage) => {
    if (message.serverContent?.modelTurn?.parts) {
      for (const part of message.serverContent.modelTurn.parts) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inlineData = (part as any).inlineData;
        if (inlineData?.data && !isMutedRef.current) {
          // While paused, drop incoming audio for the in-flight turn instead of queuing it — the
          // model may keep streaming server-side, but nothing should play locally until resumed
          // (item 6a). Muted-but-received chunks are simply discarded, not buffered for later.
          isAiSpeakingRef.current = true;
          setIsAiSpeaking(true);
          setAwaitingCoach(false);
          if (closingRef.current) closingSpokeRef.current = true;
          playPcmChunk(inlineData.data as string);
        }
        if (part.text) transcriptRef.current.push(part.text);
      }
    }
    if (message.serverContent?.interrupted) {
      // Interrupt (including a forced-close from End Session mid-speech) must actually stop and
      // clear whatever coach audio is queued/playing, not just reset the scheduling clock — otherwise
      // the tail of the cut-off sentence keeps playing underneath the next turn's audio (item 9).
      stopCoachAudio();
      isAiSpeakingRef.current = false;
      setIsAiSpeaking(false);
    }
    if (message.serverContent?.turnComplete) {
      isAiSpeakingRef.current = false;
      setIsAiSpeaking(false);
      // CLOSING SEQUENCE: the coach has just finished its closing turn. Let the final audio drain from
      // the play buffer, then complete the session. Guarded by closingSpokeRef so a stray turnComplete
      // before the coach actually speaks the closing can't cut it off. A hard fallback (set in
      // endSession) still completes the session if no closing audio ever arrives.
      if (closingRef.current && closingSpokeRef.current && !sessionClosedRef.current) {
        const playCtx = playContextRef.current;
        const drainMs = playCtx ? Math.max(0, (playTimeRef.current - playCtx.currentTime) * 1000) : 0;
        setTimeout(() => handleSessionComplete(), drainMs + 1200);
        return;
      }
      // TIME-NOTE INJECTION (item 3 / spec §6). The coach just finished a turn; inject a private
      // time note so it sits in context before the model's next completion. Throttled to once per
      // ~25s of elapsed time to avoid spamming on rapid back-and-forth. Never shown to the user.
      // In MANUAL MODE, any realtimeInput — even a private text note — counts as a turn and makes
      // the coach speak before the person has tapped "I'm done". So skip the auto time-note here in
      // manual mode; it is instead bundled into signalDone() just before activityEnd.
      const nowSec = elapsedSecondsRef.current;
      if (!sessionClosedRef.current && !closingRef.current && !manualModeRef.current && nowSec - lastTimeNoteAtRef.current >= 25) {
        lastTimeNoteAtRef.current = nowSec;
        sessionRef.current?.sendRealtimeInput({ text: buildTimeNote(nowSec, sessionType) });
      }
      // MANUAL MODE: the coach has just finished its turn. Open the person's turn explicitly so their
      // streamed mic audio is bracketed activityStart…activityEnd. Auto turn-detection is disabled in
      // manual mode, so without this open bracket the "I'm done" tap (activityEnd) has no real turn to
      // close and the coach's turn-taking is undefined.
      if (!sessionClosedRef.current && manualModeRef.current && !closingRef.current) {
        sessionRef.current?.sendRealtimeInput({ activityStart: {} });
      }
    }
    if (message.toolCall?.functionCalls) {
      const responses = message.toolCall.functionCalls.map(call => {
        const args = (call.args ?? {}) as Record<string, string>;

        if (call.name === "update_whiteboard") {
          updateWhiteboardLocal(args.section, args.content);
        }

        if (call.name === "flag_concern") {
          // Fire-and-forget — never blocks the live session, never surfaces to the model as anything
          // other than "ok". Welfare escalation (item 3): logs to wp_concern_flags (service-role only,
          // QA use only — never wired to analytics) and emails Chris via /api/coach/flag.
          fetch("/api/coach/flag", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, category: args.category, note: args.note }),
          }).catch(() => {});
          // Tap-to-connect UI (item 7, EDEN condition a): visible, not passive, for the two categories
          // where immediate human help matters most. severe_burnout is a refer-not-coach case handled
          // verbally by the model — it does not need the crisis card.
          if (args.category === "self_harm" || args.category === "acute_crisis") {
            setCrisisVisible(true);
          }
        }

        if (call.name === "advance_phase") {
          const newPhase = args.phase as Phase;
          const currentPhase = phaseRef.current;
          const currentIndex = PHASE_ORDER.indexOf(currentPhase);
          const requestedIndex = PHASE_ORDER.indexOf(newPhase);

          if (requestedIndex !== currentIndex + 1) {
            const nextPhase = PHASE_ORDER[currentIndex + 1];
            return {
              id: call.id ?? "", name: call.name ?? "",
              response: { result: "invalid", message: `Cannot skip phases. Next phase is ${nextPhase}. Complete ${currentPhase} first.` },
            };
          }

          const phaseMinSeconds = sessionType === "quick" ? PHASE_MIN_SECONDS_QUICK : PHASE_MIN_SECONDS_DEEP;
          const minSeconds = phaseMinSeconds[currentPhase] ?? 0;
          const secondsInPhase = (Date.now() - phaseStartTimeRef.current) / 1000;

          if (secondsInPhase < minSeconds) {
            const remaining = Math.ceil(minSeconds - secondsInPhase);
            return {
              id: call.id ?? "", name: call.name ?? "",
              response: { result: "too_early", message: `Not yet — ${remaining} more seconds in ${currentPhase}. Do not go quiet. Ask a follow-up question, invite them to go deeper on something they said, or explore what's beneath the surface. Keep the conversation alive.` },
            };
          }

          phaseStartTimeRef.current = Date.now();
          phaseRef.current = newPhase;
          setPhase(newPhase);
          fetch("/api/coach/session", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, phase: newPhase }),
          }).catch(() => {});

          // PHASE-GATED CONTEXT (item 7): the WIN check-in (return sessions) happens before this
          // transition, while PREVIOUS SESSION CONTEXT is still fully live in the system prompt.
          // Once the coachee actually moves from LAND into SEEK, that check-in is done — fire a
          // one-time steering note right at this phase boundary so the model commits to whatever
          // NEW focus gets named instead of drifting back into old notes. This is enforced at the
          // exact phase transition in code, not left to prompt wording alone.
          if (currentPhase === "LAND" && newPhase === "SEEK") {
            const steeringNote = lang === "id"
              ? `[catatan teknis — jangan dibacakan] Check-in WIN (jika ada) sudah selesai. Mulai sekarang, jangan mengangkat atau merujuk catatan maupun topik dari sesi sebelumnya kecuali orang ini sendiri yang membawanya kembali. Fokus penuh pada apa yang mereka katakan ingin mereka bahas hari ini — sekalipun itu topik baru yang berbeda dari sebelumnya.`
              : `[technical note — do not read aloud] The WIN check-in (if any) is done. From this point forward, do not bring up or reference previous session notes or past topics unless the coachee themselves raises them again. Commit fully to whatever focus they name today, even if it differs from before.`;
            sessionRef.current?.sendRealtimeInput({ text: steeringNote });
          }

          if (newPhase === "COMPLETE") handleSessionComplete();
        }

        return { id: call.id ?? "", name: call.name ?? "", response: { result: "ok" } };
      });
      if (!sessionClosedRef.current) {
        sessionRef.current?.sendToolResponse({ functionResponses: responses });
      }
    }
  }, [sessionId, sessionType, updateWhiteboardLocal, handleSessionComplete, lang]);

  const scheduleWarmup = useCallback(() => {
    if (warmupTimerRef.current) clearTimeout(warmupTimerRef.current);
    warmupTimerRef.current = setTimeout(async () => {
      const ai = aiRef.current;
      if (!ai || sessionClosedRef.current) return;
      try {
        const manual = manualModeRef.current;
        const ws = await ai.live.connect({
          model: GEMINI_MODEL,
          config: buildLiveConfig(effectiveSystemPrompt(systemPromptRef.current, manual), coachVoice, manual),
          callbacks: {
            onopen: () => {},
            onmessage: handleMessage,
            onerror: () => { warmupSessionRef.current = null; },
            onclose: () => { if (warmupSessionRef.current === ws) warmupSessionRef.current = null; },
          },
        });
        warmupSessionRef.current = ws;
      } catch { /* silent */ }
    }, WARMUP_AT_SECONDS * 1000);
  }, [buildLiveConfig, handleMessage, coachVoice, effectiveSystemPrompt]);

  const switchToWarmup = useCallback(() => {
    const ws = warmupSessionRef.current;
    if (!ws) return false;
    warmupSessionRef.current = null;
    sessionRef.current = ws;
    const wb = whiteboardRef.current;
    const currentPhase = phaseRef.current;
    const recentTranscript = transcriptRef.current.slice(-20).join(" ... ");
    const contextMsg = [
      `TECHNICAL NOTE (not for the coachee): The connection was briefly interrupted and has resumed. Do NOT say "Welcome back", "I'm back", "we got disconnected", or any phrase that acknowledges a break. Do NOT greet. Simply continue the conversation mid-thought as if nothing happened.`,
      `Current phase: ${currentPhase}.`,
      wb.focus_today ? `Focus today: ${wb.focus_today}.` : "",
      wb.key_insights.length ? `Key insights so far: ${wb.key_insights.join("; ")}.` : "",
      wb.values_named.length ? `Values named: ${wb.values_named.join("; ")}.` : "",
      wb.action_steps.length ? `Action steps so far: ${wb.action_steps.join("; ")}.` : "",
      recentTranscript ? `Recent conversation: ${recentTranscript}` : "",
      `Pick up naturally from the ${currentPhase} phase — no acknowledgement of any break.`,
    ].filter(Boolean).join(" ");
    setTimeout(() => {
      sessionRef.current?.sendRealtimeInput({ text: contextMsg });
    }, 300);
    scheduleWarmup();
    return true;
  }, [scheduleWarmup]);

  const startSession = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg(null);
    sessionClosedRef.current = false;
    try {
      const tokenRes = await fetch("/api/coach/gemini-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coachName, sessionType }),
      });
      if (!tokenRes.ok) {
        const body = await tokenRes.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Token error ${tokenRes.status}`);
      }
      const { ephemeralToken, systemPrompt } = await tokenRes.json() as { ephemeralToken: string; systemPrompt: string };
      systemPromptRef.current = systemPrompt;
      const ai = new GoogleGenAI({ apiKey: ephemeralToken, httpOptions: { apiVersion: "v1alpha" } });
      aiRef.current = ai;

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: false,
        });
      } catch (micErr) {
        const name = micErr instanceof Error ? micErr.name : "";
        if (name === "NotFoundError" || name === "DevicesNotFoundError")
          throw new Error("No microphone found. Please connect a mic or allow access in browser settings.");
        if (name === "NotAllowedError" || name === "PermissionDeniedError")
          throw new Error("Microphone access denied. Please allow microphone access in your browser settings.");
        throw micErr;
      }
      streamRef.current = stream;

      const micCtx = new AudioContext({ sampleRate: 16000 });
      micContextRef.current = micCtx;
      await micCtx.audioWorklet.addModule("/audio-worklet-processor.js");
      const micSource = micCtx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(micCtx, "pcm-capture");
      micSource.connect(worklet);
      workletRef.current = worklet;

      const playCtx = new AudioContext({ sampleRate: 24000 });
      playContextRef.current = playCtx;
      playTimeRef.current = 0;

      const manual = manualModeRef.current;
      const geminiSession = await ai.live.connect({
        model: GEMINI_MODEL,
        config: buildLiveConfig(effectiveSystemPrompt(systemPrompt, manual), coachVoice, manual),
        callbacks: {
          onopen: () => {
            setStatus("active");
            if (!startTimeRef.current) {
              startTimeRef.current = Date.now();
              phaseStartTimeRef.current = Date.now();
              timerRef.current = setInterval(() => {
                if (!isMutedRef.current) {
                  elapsedSecondsRef.current += 1;
                  setElapsedSeconds(elapsedSecondsRef.current);
                }
              }, 1000);
            }
            scheduleWarmup();
          },
          onmessage: handleMessage,
          onerror: (e: ErrorEvent) => {
            console.error("Gemini Live error:", e);
            sessionClosedRef.current = true;
            setStatus("error");
            setErrorMsg("Connection lost. Please try again.");
          },
          onclose: (e: CloseEvent) => {
            // sessionClosedRef is only ever set true by OUR OWN intentional closes (handleSessionComplete,
            // the terminal-error branch below). So any close that reaches this point was NOT something we
            // asked for — it's unexpected, whether that's GoAway (max session length, reason contains
            // "GoAway"/"session durat"), an idle/silence timeout (a different reason/code Gemini Live
            // sends — the exact string isn't documented reliably enough to match on), or a network drop.
            // Reconnect for all of them rather than only GoAway-labeled closes, so an idle session
            // doesn't just die with no recovery (item 6b). This is still a single bounded retry: if the
            // reconnect attempt itself fails, startSession()'s own catch surfaces a real error.
            if (sessionClosedRef.current) return;
            if (switchToWarmup()) {
              setErrorMsg(null);
            } else {
              const wb = whiteboardRef.current;
              const currentPhase = phaseRef.current;
              const recentTranscript = transcriptRef.current.slice(-20).join(" ... ");
              reconnectContextRef.current = [
                `TECHNICAL NOTE (not for the coachee): The connection was briefly interrupted and has resumed. Do NOT say "Welcome back", "I'm back", "we got disconnected", or any phrase that acknowledges a break. Do NOT greet. Simply continue the conversation mid-thought as if nothing happened.`,
                `Current phase: ${currentPhase}.`,
                wb.focus_today ? `Focus today: ${wb.focus_today}.` : "",
                wb.key_insights.length ? `Key insights so far: ${wb.key_insights.join("; ")}.` : "",
                wb.values_named.length ? `Values named: ${wb.values_named.join("; ")}.` : "",
                wb.action_steps.length ? `Action steps so far: ${wb.action_steps.join("; ")}.` : "",
                recentTranscript ? `Recent conversation: ${recentTranscript}` : "",
                `Pick up naturally from the ${currentPhase} phase — no acknowledgement of any break.`,
              ].filter(Boolean).join(" ");
              setStatus("connecting");
              setErrorMsg("Reconnecting…");
              stopAudio();
              playContextRef.current?.close().catch(() => {});
              playContextRef.current = null;
              sessionRef.current = null;
              setTimeout(() => startSession(), 1000);
            }
          },
        },
      });

      sessionRef.current = geminiSession;

      const resumeCtx = reconnectContextRef.current;
      reconnectContextRef.current = null;
      setTimeout(() => {
        sessionRef.current?.sendRealtimeInput({ text: resumeCtx ?? "Begin the session." });
      }, 800);

      worklet.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
        // Safety valve: if isAiSpeaking is stuck (AI audio ended 2s+ ago), reset it
        const playCtx2 = playContextRef.current;
        if (isAiSpeakingRef.current && playCtx2 && playCtx2.currentTime > playTimeRef.current + 2.0) {
          isAiSpeakingRef.current = false;
          setIsAiSpeaking(false);
        }
        if (isMutedRef.current || isAiSpeakingRef.current || closingRef.current || sessionClosedRef.current) return;
        const int16 = new Int16Array(e.data);
        const uint8 = new Uint8Array(int16.buffer);
        let binary = "";
        for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
        const base64 = btoa(binary);
        sessionRef.current?.sendRealtimeInput({ audio: { data: base64, mimeType: "audio/pcm;rate=16000" } });
      };

    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      stopAudio();
    }
  }, [buildLiveConfig, handleMessage, scheduleWarmup, switchToWarmup, coachName, coachVoice, effectiveSystemPrompt]);

  const toggleMute = useCallback(() => {
    if (!streamRef.current) return;
    const newMuted = !isMutedRef.current;
    isMutedRef.current = newMuted;
    streamRef.current.getAudioTracks().forEach(t => { t.enabled = !newMuted; });
    if (newMuted) {
      // Pause must stop the coach's own audio too, not just the mic (item 6a) — without this the
      // coach keeps talking into a "paused" session. Any further chunks for this turn are dropped
      // above in handleMessage until resumed.
      stopCoachAudio();
      isAiSpeakingRef.current = false;
      setIsAiSpeaking(false);
    }
    setIsMuted(newMuted);
  }, []);

  const endSession = useCallback(() => {
    if (sessionClosedRef.current || closingRef.current) return;
    if (!sessionRef.current) { handleSessionComplete(); return; }
    closingRef.current = true;
    closingSpokeRef.current = false;
    setIsClosing(true);

    // CRITICAL: kill the mic the instant closing begins. stopAudio() tears down only the mic capture
    // chain (worklet + stream + 16k AudioContext) — the 24k playback AudioContext is separate and keeps
    // playing the closing. Without this, in auto mode the mic resumes streaming the moment the closing
    // turn's turnComplete flips isAiSpeaking false; the VAD then picks up ambient sound and triggers a
    // SECOND coach turn (a second closing story), which handleSessionComplete later cuts mid-sentence.
    // No mic input → exactly one closing turn → clean drain. (Root cause of the double-closing bug.)
    stopAudio();
    // Also stop any coach audio still queued/playing from the turn that was just cut off — otherwise
    // its tail can play underneath the closing audio that's about to start (item 9). The "interrupted"
    // server message usually does this too, but End Session shouldn't depend on that message arriving.
    stopCoachAudio();

    // Ask the coach for a PROPER spoken closing. CRITICAL: the closing must reflect ONLY what actually
    // happened. The whiteboard is the record of what surfaced — the coach fills it via update_whiteboard
    // as the person speaks. If it is empty, nothing was discussed (e.g. the person said nothing and
    // tapped End), so a summary closing would FABRICATE content ("you wanted to focus on admin" when no
    // such thing was ever said). Pick the closing variant by whether the whiteboard holds real content,
    // and forbid invention either way.
    const wb = whiteboardRef.current;
    const hasContent = !!(
      wb.focus_today ||
      wb.key_insights.length ||
      wb.values_named.length ||
      wb.action_steps.length ||
      wb.carrying_forward
    );

    const closeInstruction = hasContent
      ? (lang === "id"
        ? `[catatan teknis — bukan untuk diucapkan kata demi kata] Sesi berakhir sekarang karena orang ini menekan "Akhiri Sesi". Berikan penutupan yang singkat dan hangat — jangan memulai topik baru dan jangan bertanya apa pun. Dalam dua sampai tiga kalimat: sebutkan hal utama yang BENAR-BENAR mereka katakan hari ini dan apa yang mereka bawa ke depan, ingatkan bahwa catatan sesi mereka sudah tersimpan dan bisa dilihat kapan saja, lalu ucapkan selamat tinggal yang tulus dan menguatkan. PENTING: rujuk hanya pada apa yang benar-benar dibicarakan. Jangan pernah mengarang atau menebak topik, fokus, atau keputusan yang tidak mereka sebutkan.`
        : `[technical note — do not read aloud] The session is ending now because this person tapped "End Session". Give a brief, warm closing — do not open any new topic and do not ask any questions. In two or three sentences: name the main thing they ACTUALLY said today and what they are carrying forward, remind them their session notes are saved and they can review them any time, then give a genuine, encouraging goodbye. IMPORTANT: reference only what was actually discussed. Never invent or guess a topic, focus, or decision they did not raise.`)
      : (lang === "id"
        ? `[catatan teknis — bukan untuk diucapkan kata demi kata] Sesi berakhir sekarang karena orang ini menekan "Akhiri Sesi", dan belum ada yang benar-benar dibicarakan dalam sesi ini. JANGAN merangkum, JANGAN menyebutkan topik, fokus, atau keputusan apa pun — tidak ada yang dibagikan, jadi mengarang apa pun akan salah. Cukup ucapkan selamat tinggal yang hangat dan singkat dalam satu atau dua kalimat, sampaikan bahwa mereka bisa kembali kapan saja saat siap untuk berbicara, dan tidak perlu lebih dari itu.`
        : `[technical note — do not read aloud] The session is ending now because this person tapped "End Session", and nothing was actually discussed in this session. Do NOT summarise, and do NOT mention any topic, focus, or decision — nothing was shared, so inventing anything would be wrong. Simply give a warm, brief goodbye in one or two sentences, let them know they can come back any time they are ready to talk, and leave it at that.`);

    sessionRef.current.sendRealtimeInput({ text: closeInstruction });
    // In manual mode automatic turn-detection is off, so the close text alone would never trigger a
    // reply — close the turn explicitly so the coach speaks its closing.
    if (manualModeRef.current) {
      sessionRef.current.sendRealtimeInput({ activityEnd: {} });
    }

    // Hard fallback: if no closing audio ever arrives, complete anyway after 22s so the user is never
    // stuck on the closing screen. The normal path completes earlier, right after the coach finishes.
    closingFallbackRef.current = setTimeout(() => handleSessionComplete(), 22000);
  }, [handleSessionComplete, lang]);

  // MANUAL MODE: user taps "I'm done" → send manual activity-end signal so the coach responds
  // only after the tap (spec item 6). @google/genai exposes activityEnd on sendRealtimeInput.
  const signalDone = useCallback(() => {
    if (!sessionRef.current || sessionClosedRef.current) return;
    // Manual mode skips the auto time-note (it would trigger a turn), so fold it in here as context
    // for the upcoming reply — text first, then activityEnd closes the turn so the coach responds once.
    const nowSec = elapsedSecondsRef.current;
    if (nowSec - lastTimeNoteAtRef.current >= 25) {
      lastTimeNoteAtRef.current = nowSec;
      sessionRef.current.sendRealtimeInput({ text: buildTimeNote(nowSec, sessionType) });
    }
    sessionRef.current.sendRealtimeInput({ activityEnd: {} });
    setAwaitingCoach(true);
    // Clear the awaiting state once the coach starts speaking (or after a short timeout fallback).
    setTimeout(() => setAwaitingCoach(false), 4000);
  }, [sessionType]);

  // Toggle manual mode (only meaningful before the session starts — locked once active).
  const toggleManualMode = useCallback(() => {
    setManualMode(prev => {
      const next = !prev;
      manualModeRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (warmupTimerRef.current) clearTimeout(warmupTimerRef.current);
      sessionRef.current?.close();
      warmupSessionRef.current?.close();
      stopAudio();
      playContextRef.current?.close().catch(() => {});
    };
  }, []);

  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement | null;
    const html = document.documentElement;
    const prevPadding = main?.style.paddingBottom ?? "";
    const prevOverflow = html.style.overflow;
    if (main) main.style.paddingBottom = "0";
    html.style.overflow = "hidden";
    return () => {
      if (main) main.style.paddingBottom = prevPadding;
      html.style.overflow = prevOverflow;
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const phaseIndex = PHASE_ORDER.indexOf(phase);
  const coachRoomImage = COACH_ROOM_IMAGES[coachName] ?? COACH_ROOM_IMAGES.Tara;
  const hasWhiteboardContent = whiteboard.focus_today || whiteboard.key_insights.length > 0 || whiteboard.values_named.length > 0 || whiteboard.action_steps.length > 0 || whiteboard.carrying_forward;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 80px - env(safe-area-inset-bottom, 0px))", overflow: "hidden", background: "#0a0e19", position: "relative" }}>

      {/* Top header */}
      <div style={{
        position: "relative", zIndex: 10, flexShrink: 0,
        padding: "0.625rem 1.25rem 0.5rem",
        background: "#1B3A6B",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}>
        {/* Title row */}
        <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.15rem", color: "oklch(65% 0.15 45)", lineHeight: 1.2, margin: "0 0 0.5rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {s.coachingSessionWith(coachName)}
        </p>

        {/* Phase + controls row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          {/* Logo + phase dots + label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
            <Image src="/images/waypoint/waypoint-logo-blue.png" alt="WayPoint" width={18} height={18} style={{ opacity: 0.8, flexShrink: 0 }} />
            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
              {PHASE_ORDER.filter(p => p !== "COMPLETE").map((p, i) => (
                <div key={p} style={{
                  height: "3px", borderRadius: "2px",
                  width: i < phaseIndex ? "20px" : i === phaseIndex ? "28px" : "14px",
                  background: i < phaseIndex ? "oklch(60% 0.15 150)" : i === phaseIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.14)",
                  transition: "all 0.4s ease",
                }} />
              ))}
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", marginLeft: "0.25rem", whiteSpace: "nowrap" }}>
                {s.phaseLabels[phase] ?? phase}
              </span>
            </div>
          </div>

          {/* Timer + Back */}
          <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>
              {status === "active" ? formatTime(elapsedSeconds) : ""}
            </div>
            <a href="/coach" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.04em" }}>{s.back}</a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="session-body" style={{ position: "relative", zIndex: 5, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Voice area — photo + controls (flex: 1 on desktop, 50dvh on mobile) */}
        <div className="session-voice-area" style={{ position: "relative", flex: 1, overflow: "hidden" }}>

        {/* Room photo */}
        <Image
          src={coachRoomImage}
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(145deg, rgba(6,10,20,0.72) 0%, rgba(6,10,20,0.35) 55%, rgba(6,10,20,0.62) 100%)",
        }} />

        {/* WayPoint mark — hidden on mobile */}
        <div className="session-waypoint-mark" style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", zIndex: 8, pointerEvents: "none" }}>
          <Image src="/images/waypoint/waypoint-logo-transp.png" alt="WayPoint" width={280} height={280} style={{ opacity: 0.85 }} />
        </div>

        {/* Voice controls — centered over room photo */}
        <div style={{ position: "absolute", inset: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>

          {/* Mic orb */}
          <div style={{
            width: "140px", height: "140px", borderRadius: "50%",
            background: status === "active"
              ? (isAiSpeaking
                ? "radial-gradient(circle, rgba(100,200,140,0.38) 0%, rgba(100,200,140,0.06) 70%)"
                : "radial-gradient(circle, rgba(60,140,100,0.32) 0%, rgba(60,140,100,0.04) 70%)")
              : "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.5s ease",
            animation: isAiSpeaking ? "pulse 1.8s ease-in-out infinite" : "none",
          }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: status === "active"
                ? (isAiSpeaking ? "oklch(58% 0.18 150)" : isMuted ? "oklch(52% 0.15 25)" : "oklch(42% 0.12 150)")
                : "rgba(255,255,255,0.12)",
              backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.3s ease",
            }}>
              {status === "idle" || status === "error" ? <MicIcon color="rgba(255,255,255,0.55)" /> :
               status === "connecting" ? <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>...</span> :
               isAiSpeaking ? <WaveIcon color="white" speaking={true} /> :
               isMuted ? <MicOffIcon color="white" /> :
               <MicIcon color="white" />}
            </div>
          </div>

          {/* Status text */}
          {status === "idle" ? (
            <div style={{ textAlign: "center", maxWidth: "260px", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.5 }}>
                {s.readyWhenYouAre}
              </p>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                {lang === "id" ? "Siap saat Anda siap." : "Ready when you are."}
              </p>

              {/* MANUAL MODE TOGGLE (item 6) — off by default, locked once the session starts */}
              <button
                type="button"
                onClick={toggleManualMode}
                aria-pressed={manualMode}
                style={{
                  marginTop: "0.5rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  background: "transparent", border: "none", cursor: "pointer", padding: "0.25rem",
                  fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "rgba(255,255,255,0.7)",
                }}
              >
                <span style={{
                  width: "34px", height: "20px", borderRadius: "10px", flexShrink: 0,
                  background: manualMode ? "oklch(65% 0.15 45)" : "rgba(255,255,255,0.2)",
                  position: "relative", transition: "background 0.2s ease",
                }}>
                  <span style={{
                    position: "absolute", top: "2px", left: manualMode ? "16px" : "2px",
                    width: "16px", height: "16px", borderRadius: "50%", background: "white",
                    transition: "left 0.2s ease",
                  }} />
                </span>
                <span>{manualMode ? s.manualToggleOn : s.manualToggleOff}</span>
              </button>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", color: "rgba(255,255,255,0.42)", margin: "0.1rem 0 0", lineHeight: 1.45, maxWidth: "260px" }}>
                {s.manualHelper}
              </p>
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.75)", textAlign: "center", maxWidth: "240px" }}>
              {status === "connecting" && (errorMsg ?? s.connecting)}
              {status === "active" && (isClosing ? s.closing : confirmEnd ? s.endConfirmPrompt : isAiSpeaking ? s.aiSpeaking(coachName) : isMuted ? s.micPaused : s.listening)}
              {status === "complete" && s.sessionComplete}
              {status === "error" && s.connectionFailed}
            </p>
          )}

          {status === "active" && !isClosing && !confirmEnd && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "rgba(255,255,255,0.32)", textAlign: "center" }}>
              {isMuted ? s.tapResume : manualMode ? (awaitingCoach ? s.manualActiveWaiting : s.manualActiveHint) : s.speakNaturally}
            </p>
          )}

          {/* Complete screen — reassure notes saved + minutes used (extras #2, #3) */}
          {status === "complete" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
                {s.minutesThisSession(Math.max(1, Math.round(elapsedSeconds / 60)))}
              </p>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "rgba(255,255,255,0.42)", textAlign: "center", maxWidth: "260px" }}>
                {s.notesSavedReassure}
              </p>
            </div>
          )}

          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            {status === "active" && manualMode && !isClosing && !confirmEnd && (
              <button
                onClick={signalDone}
                disabled={awaitingCoach}
                style={{ ...btnStyle("primary"), opacity: awaitingCoach ? 0.55 : 1, cursor: awaitingCoach ? "default" : "pointer" }}
              >
                {s.imDone}
              </button>
            )}
            <div style={{ display: "flex", gap: "0.875rem" }}>
            {status === "idle" && <button onClick={startSession} style={btnStyle("primary")}>{s.startSessionBtn}</button>}
            {status === "active" && !isClosing && !confirmEnd && (
              <>
                <button onClick={toggleMute} style={btnStyle(isMuted ? "primary" : "ghost")}>{isMuted ? s.resume : s.pause}</button>
                <button onClick={() => setConfirmEnd(true)} style={btnStyle("secondary")}>{s.endSession}</button>
              </>
            )}
            {status === "active" && !isClosing && confirmEnd && (
              <>
                <button onClick={() => setConfirmEnd(false)} style={btnStyle("primary")}>{s.endConfirmNo}</button>
                <button onClick={() => { setConfirmEnd(false); endSession(); }} style={btnStyle("secondary")}>{s.endConfirmYes}</button>
              </>
            )}
            {status === "complete" && <a href={`/coach/session/${sessionId}/complete`} style={{ ...btnStyle("primary"), textDecoration: "none" }}>{s.reviewNotes}</a>}
            {status === "error" && <button onClick={startSession} style={btnStyle("primary")}>{s.tryAgain}</button>}
            </div>
          </div>

          {status === "error" && errorMsg && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(62% 0.18 25)", textAlign: "center", maxWidth: "280px" }}>
              {errorMsg}
            </p>
          )}
          </div>
        </div>

        </div>{/* end session-voice-area */}

        {/* Floating notepad panel */}
        <div className="session-notepad-panel" style={{ position: "absolute", right: "1.25rem", top: "3rem", width: "400px", height: "calc(100% - 6rem)", display: "flex", zIndex: 8 }}>
          {/* Ring binder outer wrapper */}
          <div style={{
            display: "flex", flexDirection: "row",
            height: "100%", flex: 1,
            borderRadius: "2px 2px 4px 4px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}>

            {/* Left spine */}
            <div style={{
              width: "44px", flexShrink: 0,
              background: "linear-gradient(to right, #090909, #181818 40%, #111)",
              display: "flex", flexDirection: "column", alignItems: "center",
              paddingBlock: "20px",
              justifyContent: "space-around",
              gap: 0,
              borderRadius: "2px 0 0 4px",
            }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{
                  width: "22px", height: "22px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 40% 35%, #d4d4d4, #888 45%, #444 75%, #222)",
                  border: "2px solid #333",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.15)",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "9px", height: "9px", borderRadius: "50%",
                    background: "#050505",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.9)",
                  }} />
                </div>
              ))}
            </div>

            {/* Paper area */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              overflow: "hidden", background: "white",
            }}>

              {/* Notepad label area */}
              <div style={{ padding: "1rem 1.25rem 0.5rem", borderBottom: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }}>
                <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(80,72,60,0.45)", margin: 0 }}>
                  {s.sessionNotes}
                </p>
              </div>

              {/* Scrollable notes content */}
              <div style={{
                flex: 1, overflowY: "auto",
                padding: "0 1.25rem 1.75rem",
                lineHeight: "28px",
                fontSize: "0.8125rem",
                fontFamily: "var(--font-montserrat)",
                backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, rgba(180, 205, 235, 0.45) 27px, rgba(180, 205, 235, 0.45) 28px)",
                backgroundSize: "100% 28px",
              }}>
                {!hasWhiteboardContent && (
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "rgba(100,90,80,0.38)", fontStyle: "italic", margin: "28px 0 0" }}>
                    {s.notesWillAppear}
                  </p>
                )}
                {whiteboard.focus_today && <WBEntry label={s.focus} value={whiteboard.focus_today} />}
                {whiteboard.key_insights.map((ins, i) => (
                  <WBEntry key={i} label={i === 0 ? s.insights : undefined} value={`• ${ins}`} indent />
                ))}
                {whiteboard.values_named.map((v, i) => (
                  <WBEntry key={i} label={i === 0 ? s.values : undefined} value={`• ${v}`} indent />
                ))}
                {whiteboard.action_steps.map((step, i) => (
                  <WBEntry key={i} label={i === 0 ? s.actions : undefined} value={`${i + 1}. ${step}`} indent />
                ))}
                {whiteboard.carrying_forward && (
                  <WBEntry label={s.carryingForward} value={`"${whiteboard.carrying_forward}"`} italic />
                )}
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Crisis card — tap-to-connect welfare overlay. Fires on self_harm/acute_crisis flag_concern
          calls. Stays up until the person dismisses it — never auto-hides (EDEN condition a). */}
      {crisisVisible && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(10,14,25,0.82)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
        }}>
          <div style={{
            width: "100%", maxWidth: "380px",
            background: "#fdfaf3",
            borderRadius: "6px",
            padding: "1.75rem 1.5rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            textAlign: "center",
          }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.35rem", color: "oklch(40% 0.1 30)", margin: "0 0 0.75rem" }}>
              {s.crisisTitle}
            </p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", lineHeight: 1.6, color: "rgba(40,35,28,0.82)", margin: "0 0 1.5rem" }}>
              {s.crisisBody}
            </p>
            <a href={s.crisisPrimaryUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", fontWeight: 700,
              color: "#fff", background: "oklch(65% 0.15 45)", textDecoration: "none",
              borderRadius: "4px", padding: "0.7rem 1rem", marginBottom: "0.6rem",
            }}>
              {s.crisisPrimaryLabel}
            </a>
            <a href={s.crisisBackupUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "block", fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600,
              color: "oklch(40% 0.1 30)", textDecoration: "none",
              border: "1px solid rgba(40,35,28,0.2)", borderRadius: "4px", padding: "0.65rem 1rem", marginBottom: "1rem",
            }}>
              {s.crisisBackupLabel}
            </a>
            <button onClick={() => setCrisisVisible(false)} style={{
              fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "rgba(40,35,28,0.5)",
              background: "none", border: "none", cursor: "pointer", textDecoration: "underline",
            }}>
              {s.crisisDismiss}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.88; }
        }
        @keyframes waveBar1 { 0%,100%{height:4px} 50%{height:18px} }
        @keyframes waveBar2 { 0%,100%{height:8px} 50%{height:22px} }
        @keyframes waveBar3 { 0%,100%{height:14px} 50%{height:10px} }
        @keyframes waveBar4 { 0%,100%{height:6px} 50%{height:20px} }
        @keyframes waveBar5 { 0%,100%{height:10px} 50%{height:5px} }
        @media (max-width: 768px) {
          .session-voice-area {
            flex: none !important;
            height: 50dvh !important;
          }
          .session-notepad-panel {
            position: relative !important;
            right: auto !important;
            top: auto !important;
            width: 100% !important;
            height: 50dvh !important;
            padding: 12px 16px 16px 8px !important;
          }
          .session-waypoint-mark {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function WBEntry({ label, value, indent, italic }: { label?: string; value: string; indent?: boolean; italic?: boolean }) {
  return (
    <div style={{ marginBottom: 0 }}>
      {label && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(60,110,70,0.7)", margin: "28px 0 0" }}>
          {label}
        </p>
      )}
      <p style={{
        fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem",
        color: "rgba(40,35,28,0.82)", lineHeight: "28px",
        paddingLeft: indent ? "0.5rem" : 0,
        fontStyle: italic ? "italic" : "normal",
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  );
}

function btnStyle(variant: "primary" | "secondary" | "ghost"): React.CSSProperties {
  return {
    fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.75rem",
    letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.8rem 1.75rem",
    borderRadius: 12,
    border: variant === "secondary" || variant === "ghost" ? "1px solid rgba(255,255,255,0.3)" : "none",
    cursor: "pointer",
    background: variant === "primary" ? "oklch(65% 0.15 45)" : "rgba(255,255,255,0.08)",
    color: variant === "primary" ? "white" : "rgba(255,255,255,0.65)",
    backdropFilter: "blur(8px)",
    display: "inline-block",
  };
}

function MicIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function MicOffIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function WaveIcon({ color, speaking }: { color: string; speaking?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ alignSelf: "center" }}>
      <rect x="1" y="10" width="3" height="4" rx="1.5" fill={color} opacity="0.6"
        style={speaking ? { animation: "waveBar1 0.6s ease-in-out infinite" } : undefined} />
      <rect x="6" y="8" width="3" height="8" rx="1.5" fill={color}
        style={speaking ? { animation: "waveBar2 0.6s ease-in-out infinite 0.1s" } : undefined} />
      <rect x="11" y="5" width="3" height="14" rx="1.5" fill={color}
        style={speaking ? { animation: "waveBar3 0.6s ease-in-out infinite 0.2s" } : undefined} />
      <rect x="16" y="8" width="3" height="8" rx="1.5" fill={color}
        style={speaking ? { animation: "waveBar4 0.6s ease-in-out infinite 0.15s" } : undefined} />
      <rect x="21" y="10" width="3" height="4" rx="1.5" fill={color} opacity="0.6"
        style={speaking ? { animation: "waveBar5 0.6s ease-in-out infinite 0.05s" } : undefined} />
    </svg>
  );
}
