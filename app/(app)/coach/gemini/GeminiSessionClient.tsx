"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { LiveServerMessage, Session } from "@google/genai";
import Image from "next/image";

type WhiteboardState = {
  focus_today: string | null;
  key_insights: string[];
  values_named: string[];
  action_steps: string[];
  carrying_forward: string | null;
};

type Phase = "LAND" | "SEEK" | "EXPLORE" | "COMMIT" | "CARRY" | "COMPLETE";

const PHASE_LABELS: Record<Phase, string> = {
  LAND: "Landing",
  SEEK: "Setting Focus",
  EXPLORE: "Exploring",
  COMMIT: "Committing",
  CARRY: "Carrying Forward",
  COMPLETE: "Complete",
};

const PHASE_ORDER: Phase[] = ["LAND", "SEEK", "EXPLORE", "COMMIT", "CARRY", "COMPLETE"];

const GEMINI_MODEL = "gemini-2.5-flash-native-audio-latest";
const WARMUP_AT_SECONDS = 780;

const COACH_IMAGES: Record<string, string> = {
  Tara: "/images/coaches/tara.png",
  Ethan: "/images/coaches/ethan.png",
};

const COACH_SESSION_IMAGES: Record<string, string> = {
  Tara: "/images/coaches/tara-session.png",
  Ethan: "/images/coaches/ethan-session.png",
};

const PHASE_MIN_SECONDS: Partial<Record<Phase, number>> = {
  LAND: 30,
  SEEK: 60,
  EXPLORE: 120,
  COMMIT: 60,
  CARRY: 30,
};

type Props = {
  sessionId: string;
  coachName: string;
  coachVoice: string;
};

export default function GeminiSessionClient({ sessionId, coachName, coachVoice }: Props) {
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
      if (playTimeRef.current <= playCtx.currentTime + 0.05) {
        isAiSpeakingRef.current = false;
        setIsAiSpeaking(false);
      }
    };
  }

  const buildLiveConfig = useCallback((systemPrompt: string, voice: string) => ({
    responseModalities: [Modality.AUDIO],
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    systemInstruction: systemPrompt,
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
          const minSeconds = PHASE_MIN_SECONDS[currentPhase] ?? 0;
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
      sessionRef.current?.sendToolResponse({ functionResponses: responses });
    }
  }, [sessionId, updateWhiteboardLocal, handleSessionComplete]);

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
      `SESSION RECONNECTED (15-min limit reached — continue seamlessly, do not re-introduce yourself).`,
      `Current phase: ${currentPhase}.`,
      wb.focus_today ? `Focus today: ${wb.focus_today}.` : "",
      wb.key_insights.length ? `Key insights so far: ${wb.key_insights.join("; ")}.` : "",
      wb.values_named.length ? `Values named: ${wb.values_named.join("; ")}.` : "",
      wb.action_steps.length ? `Action steps so far: ${wb.action_steps.join("; ")}.` : "",
      recentTranscript ? `Recent conversation: ${recentTranscript}` : "",
      `Pick up naturally from the ${currentPhase} phase.`,
    ].filter(Boolean).join(" ");
    setTimeout(() => {
      sessionRef.current?.sendClientContent({
        turns: [{ role: "user", parts: [{ text: contextMsg }] }],
        turnComplete: true,
      });
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
        body: JSON.stringify({ coachName }),
      });
      if (!tokenRes.ok) {
        const body = await tokenRes.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Token error ${tokenRes.status}`);
      }
      const { apiKey, systemPrompt } = await tokenRes.json() as { apiKey: string; systemPrompt: string };
      systemPromptRef.current = systemPrompt;
      const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1alpha" } });
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
                setStatus("connecting");
                setErrorMsg("Reconnecting…");
                stopAudio();
                playContextRef.current?.close().catch(() => {});
                playContextRef.current = null;
                sessionRef.current = null;
                setTimeout(() => startSession(), 1000);
              }
            } else {
              setStatus("error");
              setErrorMsg(`Connection closed (code ${e.code}${e.reason ? `: ${e.reason}` : ""}).`);
            }
          },
        },
      });

      sessionRef.current = geminiSession;

      setTimeout(() => {
        sessionRef.current?.sendClientContent({
          turns: [{ role: "user", parts: [{ text: "Begin the session." }] }],
          turnComplete: true,
        });
      }, 800);

      worklet.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
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
    sessionRef.current?.sendClientContent({
      turns: [{ role: "user", parts: [{ text: "Let's close the session now." }] }],
    });
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
  const coachImage = COACH_IMAGES[coachName] ?? COACH_IMAGES.Tara;
  const coachSessionImage = COACH_SESSION_IMAGES[coachName] ?? COACH_SESSION_IMAGES.Tara;
  const hasWhiteboardContent = whiteboard.focus_today || whiteboard.key_insights.length > 0 || whiteboard.values_named.length > 0 || whiteboard.action_steps.length > 0 || whiteboard.carrying_forward;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 80px)", background: "oklch(18% 0.08 260)" }}>

      {/* Top banner */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.5rem",
        borderBottom: "1px solid oklch(28% 0.06 260)",
        background: "oklch(14% 0.06 260)",
        gap: "1rem", flexShrink: 0,
      }}>
        {/* Coach identity */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", border: "2px solid oklch(45% 0.08 150)", flexShrink: 0 }}>
            <Image src={coachImage} alt={coachName} width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: "white", lineHeight: 1 }}>{coachName}</p>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: "oklch(55% 0.008 260)", marginTop: "0.2rem", letterSpacing: "0.06em" }}>WayPoint</p>
          </div>
        </div>

        {/* Phase progress */}
        <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
          {PHASE_ORDER.filter(p => p !== "COMPLETE").map((p, i) => (
            <div key={p} style={{
              height: "3px",
              width: i < phaseIndex ? "24px" : i === phaseIndex ? "32px" : "16px",
              background: i < phaseIndex ? "oklch(60% 0.15 150)" : i === phaseIndex ? "oklch(90% 0.005 80)" : "oklch(32% 0.06 260)",
              transition: "all 0.4s ease",
            }} />
          ))}
          <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(58% 0.008 260)", marginLeft: "0.375rem" }}>
            {PHASE_LABELS[phase]}
          </span>
        </div>

        {/* Timer */}
        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", fontWeight: 600, color: "oklch(48% 0.008 260)", minWidth: "48px", textAlign: "right" }}>
          {status === "active" ? formatTime(elapsedSeconds) : ""}
        </div>
      </div>

      {/* Body — mic left, whiteboard right */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", flex: 1, overflow: "hidden" }}>

        {/* Left — voice interface with blended coach figure */}
        <div style={{
          position: "relative",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          alignItems: "center",
        }}>
          {/* Coach seated figure — blends into dark background via screen */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: "100%", maxWidth: "420px",
            height: "90%",
            pointerEvents: "none",
          }}>
            <Image
              src={coachSessionImage}
              alt={coachName}
              fill
              style={{
                objectFit: "contain",
                objectPosition: "bottom center",
                mixBlendMode: "screen",
                opacity: status === "active" ? (isAiSpeaking ? 1 : 0.82) : 0.55,
                transition: "opacity 0.6s ease",
              }}
            />
          </div>

          {/* Overlay gradient — fade coach at top so orb reads clearly */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "45%",
            background: "linear-gradient(to bottom, oklch(18% 0.08 260) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }} />

          {/* Orb + controls — float above the figure */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-start",
            paddingTop: "2.5rem", gap: "1.25rem",
            width: "100%",
          }}>
            {/* Mic orb */}
            <div style={{
              width: "140px", height: "140px", borderRadius: "50%",
              background: status === "active"
                ? (isAiSpeaking
                  ? "radial-gradient(circle, oklch(60% 0.18 150 / 0.35) 0%, oklch(60% 0.18 150 / 0.05) 70%)"
                  : "radial-gradient(circle, oklch(42% 0.10 150 / 0.3) 0%, oklch(42% 0.10 150 / 0.04) 70%)")
                : "radial-gradient(circle, oklch(28% 0.07 260 / 0.4) 0%, transparent 70%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.5s ease",
              animation: isAiSpeaking ? "pulse 1.8s ease-in-out infinite" : "none",
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: status === "active"
                  ? (isAiSpeaking ? "oklch(58% 0.18 150)" : isMuted ? "oklch(52% 0.15 25)" : "oklch(42% 0.12 150)")
                  : "oklch(32% 0.08 260)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.3s ease",
              }}>
                {status === "idle" || status === "error" ? <MicIcon color="oklch(65% 0.008 260)" /> :
                 status === "connecting" ? <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.55rem", color: "oklch(65% 0.008 260)", letterSpacing: "0.05em" }}>...</span> :
                 isAiSpeaking ? <WaveIcon color="white" /> :
                 isMuted ? <MicOffIcon color="white" /> :
                 <MicIcon color="white" />}
              </div>
            </div>

            {/* Status text */}
            <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.1rem", fontStyle: "italic", color: "oklch(72% 0.008 260)", textAlign: "center", maxWidth: "240px" }}>
              {status === "idle" && "Ready when you are."}
              {status === "connecting" && (errorMsg ?? "Connecting…")}
              {status === "active" && (isAiSpeaking ? `${coachName} is speaking…` : isMuted ? "Microphone paused." : "Listening…")}
              {status === "complete" && "Session complete."}
              {status === "error" && "Connection failed."}
            </p>

            {status === "active" && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: "oklch(42% 0.008 260)", textAlign: "center" }}>
                {isMuted ? "Tap Resume to continue" : "Speak naturally"}
              </p>
            )}

            {/* Controls */}
            <div style={{ display: "flex", gap: "0.875rem" }}>
              {status === "idle" && (
                <button onClick={startSession} style={btnStyle("primary")}>Start Session</button>
              )}
              {status === "active" && (
                <>
                  <button onClick={toggleMute} style={btnStyle(isMuted ? "primary" : "ghost")}>
                    {isMuted ? "Resume" : "Pause"}
                  </button>
                  <button onClick={endSession} style={btnStyle("secondary")}>End Session</button>
                </>
              )}
              {status === "complete" && (
                <a href="/coach" style={{ ...btnStyle("primary"), textDecoration: "none" }}>Back to WayPoint</a>
              )}
              {status === "error" && (
                <button onClick={startSession} style={btnStyle("primary")}>Try Again</button>
              )}
            </div>

            {status === "error" && errorMsg && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(62% 0.18 25)", textAlign: "center", maxWidth: "280px" }}>
                {errorMsg}
              </p>
            )}
          </div>

          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.88; }
            }
          `}</style>
        </div>

        {/* Right — lined paper whiteboard */}
        <div style={{
          background: "oklch(99% 0.008 80)",
          borderLeft: "1px solid oklch(88% 0.008 80)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Lined paper rules */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {Array.from({ length: 40 }, (_, i) => (
              <div key={i} style={{
                position: "absolute", left: 0, right: 0,
                top: `${44 + i * 32}px`,
                height: "1px",
                background: "oklch(86% 0.012 220 / 0.6)",
              }} />
            ))}
            {/* Red margin line */}
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: "52px",
              width: "1px",
              background: "oklch(72% 0.18 15 / 0.3)",
            }} />
          </div>

          {/* Header */}
          <div style={{
            padding: "0.875rem 1.25rem 0.875rem 4rem",
            borderBottom: "2px solid oklch(80% 0.012 220 / 0.6)",
            position: "relative",
            flexShrink: 0,
          }}>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)" }}>
              Session notes
            </p>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem 1.5rem 4rem", position: "relative" }}>
            {!hasWhiteboardContent && (
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(72% 0.008 260)", fontStyle: "italic", paddingTop: "0.5rem" }}>
                Your notes will appear here as the conversation unfolds.
              </p>
            )}

            {whiteboard.focus_today && (
              <WBEntry label="Focus" value={whiteboard.focus_today} />
            )}
            {whiteboard.key_insights.map((ins, i) => (
              <WBEntry key={i} label={i === 0 ? "Insights" : undefined} value={`• ${ins}`} indent />
            ))}
            {whiteboard.values_named.map((v, i) => (
              <WBEntry key={i} label={i === 0 ? "Values" : undefined} value={`• ${v}`} indent />
            ))}
            {whiteboard.action_steps.map((step, i) => (
              <WBEntry key={i} label={i === 0 ? "Action steps" : undefined} value={`${i + 1}. ${step}`} indent />
            ))}
            {whiteboard.carrying_forward && (
              <WBEntry label="Carrying forward" value={`"${whiteboard.carrying_forward}"`} italic />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function WBEntry({ label, value, indent, italic }: { label?: string; value: string; indent?: boolean; italic?: boolean }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      {label && (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.15 150)", marginBottom: "0.2rem", marginTop: "1rem" }}>
          {label}
        </p>
      )}
      <p style={{
        fontFamily: "var(--font-montserrat)", fontSize: "0.8125rem",
        color: "oklch(28% 0.008 260)", lineHeight: 1.65,
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
    border: variant === "secondary" || variant === "ghost" ? "1px solid oklch(45% 0.008 260)" : "none",
    cursor: "pointer",
    background: variant === "primary" ? "oklch(52% 0.18 150)" : "transparent",
    color: variant === "primary" ? "white" : "oklch(60% 0.008 260)",
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

function WaveIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
      <rect x="0" y="6" width="3" height="4" rx="1.5" fill={color} opacity="0.6">
        <animate attributeName="height" values="4;10;4" dur="1s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="y" values="6;3;6" dur="1s" repeatCount="indefinite" begin="0s" />
      </rect>
      <rect x="5" y="4" width="3" height="8" rx="1.5" fill={color}>
        <animate attributeName="height" values="8;14;8" dur="1s" repeatCount="indefinite" begin="0.15s" />
        <animate attributeName="y" values="4;1;4" dur="1s" repeatCount="indefinite" begin="0.15s" />
      </rect>
      <rect x="10" y="2" width="3" height="12" rx="1.5" fill={color}>
        <animate attributeName="height" values="12;6;12" dur="1s" repeatCount="indefinite" begin="0.3s" />
        <animate attributeName="y" values="2;5;2" dur="1s" repeatCount="indefinite" begin="0.3s" />
      </rect>
      <rect x="15" y="4" width="3" height="8" rx="1.5" fill={color}>
        <animate attributeName="height" values="8;14;8" dur="1s" repeatCount="indefinite" begin="0.45s" />
        <animate attributeName="y" values="4;1;4" dur="1s" repeatCount="indefinite" begin="0.45s" />
      </rect>
      <rect x="20" y="6" width="3" height="4" rx="1.5" fill={color} opacity="0.6">
        <animate attributeName="height" values="4;10;4" dur="1s" repeatCount="indefinite" begin="0.6s" />
        <animate attributeName="y" values="6;3;6" dur="1s" repeatCount="indefinite" begin="0.6s" />
      </rect>
    </svg>
  );
}
