"use client";

import { useEffect, useRef, useState, useCallback } from "react";

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

export default function SessionClient({ sessionId }: { sessionId: string }) {
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
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionClosedRef = useRef(false);

  const updateWhiteboardLocal = useCallback((section: string, content: string) => {
    setWhiteboard(prev => {
      switch (section) {
        case "focus_today":
          return { ...prev, focus_today: content };
        case "key_insight":
          if (prev.key_insights.includes(content)) return prev;
          return { ...prev, key_insights: [...prev.key_insights, content] };
        case "value_named":
          if (prev.values_named.includes(content)) return prev;
          return { ...prev, values_named: [...prev.values_named, content] };
        case "action_step":
          if (prev.action_steps.includes(content)) return prev;
          return { ...prev, action_steps: [...prev.action_steps, content] };
        case "carrying_forward":
          return { ...prev, carrying_forward: content };
        default:
          return prev;
      }
    });

    // Persist to server
    fetch("/api/coach/whiteboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, section, content }),
    }).catch(() => {});
  }, [sessionId]);

  const handleDataChannelMessage = useCallback((event: MessageEvent) => {
    let msg: Record<string, unknown>;
    try { msg = JSON.parse(event.data); } catch { return; }

    const type = msg.type as string;

    // Track AI thinking + speech state
    if (type === "response.created" || type === "response.output_item.added") { setIsAiThinking(true); setIsAiSpeaking(false); }
    if (type === "response.audio.delta") { setIsAiThinking(false); setIsAiSpeaking(true); }
    if (type === "response.audio.done") setIsAiSpeaking(false);
    if (type === "response.done") { setIsAiThinking(false); setIsAiSpeaking(false); }

    // Handle function calls from the model
    if (type === "response.function_call_arguments.done") {
      const name = msg.name as string;
      const args = JSON.parse(msg.arguments as string);

      if (name === "update_whiteboard") {
        updateWhiteboardLocal(args.section, args.content);
      }

      if (name === "advance_phase") {
        const newPhase = args.phase as Phase;
        setPhase(newPhase);
        fetch("/api/coach/session", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, phase: newPhase }),
        }).catch(() => {});

        if (newPhase === "COMPLETE") {
          handleSessionComplete();
        }
      }

      // Send function call result back
      if (dcRef.current?.readyState === "open") {
        dcRef.current.send(JSON.stringify({
          type: "conversation.item.create",
          item: {
            type: "function_call_output",
            call_id: msg.call_id,
            output: JSON.stringify({ ok: true }),
          },
        }));
        dcRef.current.send(JSON.stringify({ type: "response.create" }));
      }
    }
  }, [sessionId, updateWhiteboardLocal]); // handleSessionComplete added below

  const handleSessionComplete = useCallback(() => {
    if (sessionClosedRef.current) return;
    sessionClosedRef.current = true;

    const duration = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : null;

    fetch("/api/coach/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        complete: true,
        ...(duration && { duration_seconds: duration }),
      }),
    }).catch(() => {});

    setStatus("complete");
    if (timerRef.current) clearInterval(timerRef.current);
    pcRef.current?.close();
  }, [sessionId]);

  const startSession = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg(null);

    try {
      // Get ephemeral token
      const tokenRes = await fetch("/api/coach/realtime-token", { method: "POST" });
      if (!tokenRes.ok) {
        const body = await tokenRes.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? `Token error ${tokenRes.status}`);
      }
      const { client_secret } = await tokenRes.json();

      // Get mic
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micErr) {
        const name = micErr instanceof Error ? micErr.name : "";
        if (name === "NotFoundError" || name === "DevicesNotFoundError") {
          throw new Error("No microphone found. Please connect a mic or allow access in browser settings.");
        }
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          throw new Error("Microphone access denied. Please allow microphone access in your browser settings.");
        }
        throw micErr;
      }
      setIsMicActive(true);
      streamRef.current = stream;

      // Setup WebRTC
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Audio output
      const audio = new Audio();
      audio.autoplay = true;
      audioRef.current = audio;
      pc.ontrack = e => { audio.srcObject = e.streams[0]; };

      // Mic input
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      // Data channel for events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.onmessage = handleDataChannelMessage;

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client_secret.value}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!sdpRes.ok) {
        const errText = await sdpRes.text().catch(() => "");
        throw new Error(`WebRTC ${sdpRes.status}: ${errText.slice(0, 200)}`);
      }
      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setStatus("active");
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);

    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setIsMicActive(false);
    }
  }, [handleDataChannelMessage]);

  const toggleMute = useCallback(() => {
    if (!streamRef.current) return;
    const newMuted = !isMuted;
    streamRef.current.getAudioTracks().forEach(t => { t.enabled = !newMuted; });
    setIsMuted(newMuted);
  }, [isMuted]);

  const endSession = useCallback(() => {
    if (dcRef.current?.readyState === "open") {
      // Signal the model to wrap up
      dcRef.current.send(JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "Let's close the session now." }],
        },
      }));
      dcRef.current.send(JSON.stringify({ type: "response.create" }));
    }
    setTimeout(() => handleSessionComplete(), 3000);
  }, [handleSessionComplete]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      pcRef.current?.close();
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const phaseIndex = PHASE_ORDER.indexOf(phase);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 340px",
      gap: 0,
      height: "calc(100dvh - 80px)",
      background: "oklch(97% 0.005 80)",
    }}>

      {/* Left — voice interface */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "oklch(22% 0.12 260)",
        position: "relative",
      }}>

        {/* Phase progress */}
        <div style={{
          position: "absolute",
          top: "1.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "0.375rem",
          alignItems: "center",
        }}>
          {PHASE_ORDER.filter(p => p !== "COMPLETE").map((p, i) => (
            <div key={p} style={{
              height: "3px",
              width: i < phaseIndex ? "28px" : i === phaseIndex ? "36px" : "20px",
              background: i < phaseIndex
                ? "oklch(65% 0.15 45)"
                : i === phaseIndex
                ? "oklch(97% 0.005 80)"
                : "oklch(40% 0.06 260)",
              transition: "all 0.4s ease",
            }} />
          ))}
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.65rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "oklch(70% 0.008 260)",
            marginLeft: "0.25rem",
          }}>
            {PHASE_LABELS[phase]}
          </span>
        </div>

        {/* Timer */}
        {status === "active" && (
          <div style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            fontFamily: "var(--font-montserrat)",
            fontSize: "0.75rem",
            color: "oklch(55% 0.008 260)",
            fontWeight: 600,
          }}>
            {formatTime(elapsedSeconds)}
          </div>
        )}

        {/* Main voice orb */}
        <div style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: status === "active"
            ? (isAiSpeaking
              ? "radial-gradient(circle, oklch(65% 0.15 45 / 0.3) 0%, oklch(65% 0.15 45 / 0.05) 70%)"
              : isAiThinking
              ? "radial-gradient(circle, oklch(55% 0.12 200 / 0.25) 0%, oklch(55% 0.12 200 / 0.05) 70%)"
              : "radial-gradient(circle, oklch(50% 0.10 260 / 0.3) 0%, oklch(50% 0.10 260 / 0.05) 70%)")
            : "radial-gradient(circle, oklch(35% 0.08 260 / 0.4) 0%, transparent 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.5s ease",
          animation: isAiSpeaking ? "pulse 1.8s ease-in-out infinite" : isAiThinking ? "throb 1.2s ease-in-out infinite" : "none",
          marginBottom: "2.5rem",
          position: "relative",
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: status === "active"
              ? (isAiSpeaking ? "oklch(65% 0.15 45)" : isAiThinking ? "oklch(50% 0.12 200)" : isMuted ? "oklch(55% 0.15 25)" : "oklch(55% 0.10 260)")
              : "oklch(40% 0.08 260)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.3s ease",
          }}>
            {status === "idle" || status === "error" ? (
              <MicIcon color="oklch(75% 0.008 260)" />
            ) : status === "connecting" ? (
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.6rem", color: "oklch(75% 0.008 260)", letterSpacing: "0.05em" }}>...</span>
            ) : isAiSpeaking ? (
              <WaveIcon color="white" />
            ) : isAiThinking ? (
              <ThinkingIcon color="white" />
            ) : isMuted ? (
              <MicOffIcon color="white" />
            ) : (
              <MicIcon color="white" />
            )}
          </div>
        </div>

        {/* Status text */}
        <p style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "1.25rem",
          fontStyle: "italic",
          color: "oklch(80% 0.008 260)",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}>
          {status === "idle" && "Ready when you are."}
          {status === "connecting" && "Connecting…"}
          {status === "active" && (isAiSpeaking ? "WayPoint is speaking…" : isAiThinking ? "WayPoint is thinking…" : isMuted ? "Microphone paused." : "Listening…")}
          {status === "complete" && "Session complete."}
          {status === "error" && "Connection failed."}
        </p>

        {isMicActive && status === "active" && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(50% 0.008 260)", marginBottom: "2rem" }}>
            {isMuted ? "Mic paused — tap Pause to resume" : "Microphone active · Speak naturally"}
          </p>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {status === "idle" && (
            <button onClick={startSession} style={btnStyle("primary")}>
              Start Session
            </button>
          )}
          {status === "active" && (
            <>
              <button onClick={toggleMute} style={btnStyle(isMuted ? "primary" : "ghost")}>
                {isMuted ? "Resume" : "Pause"}
              </button>
              <button onClick={endSession} style={btnStyle("secondary")}>
                End Session
              </button>
            </>
          )}
          {status === "complete" && (
            <a href="/coach" style={{ ...btnStyle("primary"), textDecoration: "none" }}>
              Back to WayPoint
            </a>
          )}
          {status === "error" && (
            <button onClick={startSession} style={btnStyle("primary")}>
              Try Again
            </button>
          )}
        </div>

        {errorMsg && (
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.75rem", color: "oklch(65% 0.18 25)", marginTop: "1rem", textAlign: "center" }}>
            {errorMsg}
          </p>
        )}

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.06); opacity: 0.85; }
          }
          @keyframes throb {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.03); opacity: 1; }
          }
        `}</style>
      </div>

      {/* Right — whiteboard */}
      <div style={{
        background: "white",
        borderLeft: "1px solid oklch(88% 0.008 80)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid oklch(93% 0.005 80)",
          background: "oklch(98% 0.003 80)",
        }}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(55% 0.008 260)" }}>
            Whiteboard
          </p>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(70% 0.008 260)", marginTop: "0.2rem" }}>
            Updates live during your session
          </p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>

          <WhiteboardSection
            label="My Focus Today"
            empty="Will appear once you set your focus."
          >
            {whiteboard.focus_today && (
              <p style={wbTextStyle}>{whiteboard.focus_today}</p>
            )}
          </WhiteboardSection>

          <WhiteboardSection
            label="Key Insights"
            empty="Discoveries will appear here as you talk."
          >
            {whiteboard.key_insights.map((ins, i) => (
              <BulletItem key={i} text={ins} />
            ))}
          </WhiteboardSection>

          <WhiteboardSection
            label="Values I Named"
            empty="What matters to you will surface here."
          >
            {whiteboard.values_named.map((v, i) => (
              <BulletItem key={i} text={v} />
            ))}
          </WhiteboardSection>

          <WhiteboardSection
            label="My Action Steps"
            empty="Your commitments will appear here."
          >
            {whiteboard.action_steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.375rem" }}>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", fontWeight: 700, color: "oklch(65% 0.15 45)", marginTop: "0.15rem", minWidth: "14px" }}>
                  {i + 1}.
                </span>
                <p style={wbTextStyle}>{step}</p>
              </div>
            ))}
          </WhiteboardSection>

          <WhiteboardSection
            label="What I'm Carrying Forward"
            empty="Your most significant takeaway."
          >
            {whiteboard.carrying_forward && (
              <p style={{ ...wbTextStyle, fontStyle: "italic", color: "oklch(35% 0.08 260)" }}>
                &ldquo;{whiteboard.carrying_forward}&rdquo;
              </p>
            )}
          </WhiteboardSection>
        </div>
      </div>
    </div>
  );
}

function WhiteboardSection({
  label,
  empty,
  children,
}: {
  label: string;
  empty: string;
  children: React.ReactNode;
}) {
  const hasContent = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "oklch(65% 0.15 45)",
        marginBottom: "0.5rem",
      }}>
        {label}
      </p>
      {hasContent ? children : (
        <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.775rem", color: "oklch(72% 0.008 260)", fontStyle: "italic" }}>
          {empty}
        </p>
      )}
    </div>
  );
}

function BulletItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", marginBottom: "0.375rem" }}>
      <span style={{ color: "oklch(65% 0.15 45)", marginTop: "0.15rem", fontSize: "0.7rem" }}>•</span>
      <p style={wbTextStyle}>{text}</p>
    </div>
  );
}

const wbTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "0.8125rem",
  color: "oklch(30% 0.008 260)",
  lineHeight: 1.6,
  margin: 0,
};

function btnStyle(variant: "primary" | "secondary" | "ghost"): React.CSSProperties {
  return {
    fontFamily: "var(--font-montserrat)",
    fontWeight: 700,
    fontSize: "0.8rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0.875rem 2rem",
    border: variant === "secondary" || variant === "ghost" ? "1px solid oklch(50% 0.008 260)" : "none",
    cursor: "pointer",
    background: variant === "primary" ? "oklch(65% 0.15 45)" : "transparent",
    color: variant === "primary" ? "white" : "oklch(65% 0.008 260)",
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

function ThinkingIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {[0, 1, 2].map(i => (
        <circle key={i} cx={6 + i * 6} cy="12" r="2.5" fill={color}>
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
          <animate attributeName="cy" values="12;10;12" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
        </circle>
      ))}
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
