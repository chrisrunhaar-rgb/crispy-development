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
  LAND: 30,
  SEEK: 60,
  EXPLORE: 120,
  COMMIT: 60,
  CARRY: 30,
};

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

  const isMutedRef = useRef(false);
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

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseStartTimeRef = useRef<number>(Date.now());

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
    src.onended = () => {
      if (playTimeRef.current <= playCtx.currentTime + 0.15) {
        isAiSpeakingRef.current = false;
        setIsAiSpeaking(false);
      }
    };
  }

  const buildLiveConfig = useCallback((systemPrompt: string, voice: string): LiveConnectConfig => ({
    responseModalities: [Modality.AUDIO],
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    systemInstruction: systemPrompt,
    generationConfig: { thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL } },
    realtimeInputConfig: {
      automaticActivityDetection: {
        disabled: false,
        startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
        endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_HIGH,
        prefixPaddingMs: 20,
        silenceDurationMs: 500,
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

  const handleMessage = useCallback((message: LiveServerMessage) => {
    if (message.serverContent?.modelTurn?.parts) {
      for (const part of message.serverContent.modelTurn.parts) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const inlineData = (part as any).inlineData;
        if (inlineData?.data) {
          isAiSpeakingRef.current = true;
          setIsAiSpeaking(true);
          playPcmChunk(inlineData.data as string);
        }
        if (part.text) transcriptRef.current.push(part.text);
      }
    }
    if (message.serverContent?.interrupted) {
      playTimeRef.current = 0;
      isAiSpeakingRef.current = false;
      setIsAiSpeaking(false);
    }
    if (message.serverContent?.turnComplete) {
      isAiSpeakingRef.current = false;
      setIsAiSpeaking(false);
    }
    if (message.toolCall?.functionCalls) {
      const responses = message.toolCall.functionCalls.map(call => {
        const args = (call.args ?? {}) as Record<string, string>;

        if (call.name === "update_whiteboard") {
          updateWhiteboardLocal(args.section, args.content);
        }

        if (call.name === "advance_phase") {
          const newPhase = args.phase as Phase;
          const currentPhase = phaseRef.current;
          const phaseMinSeconds = sessionType === "quick" ? PHASE_MIN_SECONDS_QUICK : PHASE_MIN_SECONDS_DEEP;
          const minSeconds = phaseMinSeconds[currentPhase] ?? 0;
          const secondsInPhase = (Date.now() - phaseStartTimeRef.current) / 1000;

          if (secondsInPhase < minSeconds) {
            const remaining = Math.ceil(minSeconds - secondsInPhase);
            return {
              id: call.id ?? "", name: call.name ?? "",
              response: { result: "too_early", message: `Stay in ${currentPhase} for at least ${remaining} more seconds. Ask another question.` },
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
          if (newPhase === "COMPLETE") handleSessionComplete();
        }

        return { id: call.id ?? "", name: call.name ?? "", response: { result: "ok" } };
      });
      if (!sessionClosedRef.current) {
        sessionRef.current?.sendToolResponse({ functionResponses: responses });
      }
    }
  }, [sessionId, sessionType, updateWhiteboardLocal, handleSessionComplete]);

  const scheduleWarmup = useCallback(() => {
    if (warmupTimerRef.current) clearTimeout(warmupTimerRef.current);
    warmupTimerRef.current = setTimeout(async () => {
      const ai = aiRef.current;
      if (!ai || sessionClosedRef.current) return;
      try {
        const ws = await ai.live.connect({
          model: GEMINI_MODEL,
          config: buildLiveConfig(systemPromptRef.current, coachVoice),
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
  }, [buildLiveConfig, handleMessage, coachVoice]);

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

      const geminiSession = await ai.live.connect({
        model: GEMINI_MODEL,
        config: buildLiveConfig(systemPrompt, coachVoice),
        callbacks: {
          onopen: () => {
            setStatus("active");
            if (!startTimeRef.current) {
              startTimeRef.current = Date.now();
              phaseStartTimeRef.current = Date.now();
              timerRef.current = setInterval(() => {
                if (!isMutedRef.current) setElapsedSeconds(s => s + 1);
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
            if (sessionClosedRef.current) return;
            const isGoAway = e.reason.includes("GoAway") || e.reason.includes("session durat");
            if (isGoAway) {
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
            } else {
              sessionClosedRef.current = true;
              setStatus("error");
              setErrorMsg(`Connection closed (code ${e.code}${e.reason ? `: ${e.reason}` : ""}).`);
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
        if (isMutedRef.current || isAiSpeakingRef.current) return;
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
  }, [buildLiveConfig, handleMessage, scheduleWarmup, switchToWarmup, coachName, coachVoice]);

  const toggleMute = useCallback(() => {
    if (!streamRef.current) return;
    const newMuted = !isMutedRef.current;
    isMutedRef.current = newMuted;
    streamRef.current.getAudioTracks().forEach(t => { t.enabled = !newMuted; });
    setIsMuted(newMuted);
  }, []);

  const endSession = useCallback(() => {
    sessionRef.current?.sendRealtimeInput({ text: "Let's close the session now." });
    setTimeout(() => handleSessionComplete(), 3000);
  }, [handleSessionComplete]);

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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const phaseIndex = PHASE_ORDER.indexOf(phase);
  const coachRoomImage = COACH_ROOM_IMAGES[coachName] ?? COACH_ROOM_IMAGES.Tara;
  const hasWhiteboardContent = whiteboard.focus_today || whiteboard.key_insights.length > 0 || whiteboard.values_named.length > 0 || whiteboard.action_steps.length > 0 || whiteboard.carrying_forward;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 80px)", overflow: "hidden", background: "#0a0e19", position: "relative" }}>

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
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontStyle: "italic", color: "rgba(255,255,255,0.75)", textAlign: "center", maxWidth: "240px" }}>
              {status === "connecting" && (errorMsg ?? s.connecting)}
              {status === "active" && (isAiSpeaking ? s.aiSpeaking(coachName) : isMuted ? s.micPaused : s.listening)}
              {status === "complete" && s.sessionComplete}
              {status === "error" && s.connectionFailed}
            </p>
          )}

          {status === "active" && (
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "rgba(255,255,255,0.32)", textAlign: "center" }}>
              {isMuted ? s.tapResume : s.speakNaturally}
            </p>
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: "0.875rem" }}>
            {status === "idle" && <button onClick={startSession} style={btnStyle("primary")}>{s.startSessionBtn}</button>}
            {status === "active" && (
              <>
                <button onClick={toggleMute} style={btnStyle(isMuted ? "primary" : "ghost")}>{isMuted ? s.resume : s.pause}</button>
                <button onClick={endSession} style={btnStyle("secondary")}>{s.endSession}</button>
              </>
            )}
            {status === "complete" && <a href={`/coach/session/${sessionId}/complete`} style={{ ...btnStyle("primary"), textDecoration: "none" }}>{s.backToWayPoint}</a>}
            {status === "error" && <button onClick={startSession} style={btnStyle("primary")}>{s.tryAgain}</button>}
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
    borderRadius: 999,
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
