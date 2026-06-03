"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const CHAPTERS = [
  { title: "Deep Inside Our Hearts", topics: ["Deep Inside Our Hearts","Being Before Doing","Depth Takes Time","Me or Him","Inside Out"] },
  { title: "Character", topics: ["Humility","Authenticity","Listening","Serving","Leading Generously"] },
  { title: "Suffering", topics: ["Suffering","Suffering and Freedom","Suffering in Ministry","Spiritual Warfare"] },
  { title: "Transformation", topics: ["Transformation","Transformation of Our Hearts","Transformation of Our Thinking","Transformation of Our Priorities","Transformation of Our Relationships","Prioritizing Transformation"] },
  { title: "Managing the Shadow Side", topics: ["Managing the Shadow Side","Strengths and Liabilities","The Righteous Struggle","Counsel, Time and Prayer","Common Vulnerabilities","Antidotes to the Shadow Side"] },
  { title: "Emotional Intelligence", topics: ["Emotional Intelligence","Insecurity and Defensiveness","Control and Narcissism","Enmeshment and Anger","Growing EQ"] },
  { title: "Leading from Who God Made Me to Be", topics: ["Biography and Leadership","Convergence","Uniquely Called and Qualified","Understanding Our Life Themes","Leadership Style and Individual Design","Team, Legacy, and Succession"] },
  { title: "Choosing Intentionality", topics: ["A Theology of Time","Powerful Choices","Distraction Management","Scheduling Proactively","Personal Development","Altitude, Standard Work, and Prayer"] },
  { title: "Thinking Like a Contrarian", topics: ["Thinking Like a Contrarian","Leverage","The Lens of Leadership","Thinking Gray, Simplicity, and Wisdom"] },
  { title: "Living with the Freedom of Clarity", topics: ["Knowing Who God Made Me to Be","Knowing What God Has Called Me to Do","Being Comfortable in My Own Skin","The Clarity of Saying No","A Cause Worth Giving Your Life To","Unfinished Business, Accountability, and Freedom"] },
  { title: "Powerful Transparency", topics: ["The Power of Transparency","The Barriers to Transparency","The Authentic Self","Presence and Transparency in Failure","Staying Transparent with Yourself"] },
  { title: "Guarding Our Hearts", topics: ["The Wellspring of Life","People and Our Hearts","Success and Our Hearts","The Truly Authentic Life"] },
];

const STEPS = [
  { num: "01", en: ["Read","Each day one focused topic from Deep Influence, adapted for cross-cultural contexts."], id: ["Baca","Setiap hari satu topik dari Deep Influence, diadaptasi untuk konteks lintas budaya."] },
  { num: "02", en: ["Reflect","2–3 personal reflection questions to sit with before your group meets."], id: ["Renungkan","2–3 pertanyaan refleksi pribadi sebelum kelompok Anda berkumpul."] },
  { num: "03", en: ["Discuss","Share your responses openly. This is where the real growth happens."], id: ["Diskusikan","Bagikan jawaban Anda secara terbuka. Di sinilah pertumbuhan nyata terjadi."] },
  { num: "04", en: ["Apply","One practical implementation challenge for your group to work on together."], id: ["Terapkan","Satu tantangan implementasi praktis untuk dikerjakan bersama."] },
];

type ModalKey = "challenge" | "topics" | "signup" | null;

export default function ChallengeContent() {
  const { lang } = useLanguage();
  const [modal, setModal] = useState<ModalKey>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");
  const isId = lang === "id";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: "influential-leadership-challenge" }) });
      setStatus(res.ok ? "done" : "error");
    } catch { setStatus("error"); }
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(22px) scale(0.97)} to{opacity:1;transform:none} }
        .ch-page {
          position: fixed; inset: 0;
          background-image: url('/iceberg-full.jpg');
          background-size: 70%;
          background-repeat: no-repeat;
          background-position: center center;
          background-color: oklch(14% 0.09 260);
          display: flex; flex-direction: column;
          align-items: center; justify-content: space-between;
          padding: calc(env(safe-area-inset-top, 0px) + clamp(2rem,5vw,4.5rem)) clamp(1.5rem,4vw,4rem) calc(env(safe-area-inset-bottom, 0px) + clamp(2rem,4vw,3.5rem));
        }
        @media (max-width:640px) {
          .ch-page { background-size: 130%; background-position: center 38%; }
        }
        .ch-tiles { display:flex; flex-direction:column; gap:clamp(0.5rem,1vw,0.75rem); align-items:flex-end; }
        .ch-tile {
          background: oklch(22% 0.10 260 / 0.72);
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border: 1px solid oklch(65% 0.15 45 / 0.35);
          border-radius: 8px;
          padding: 0.65rem 1.25rem;
          cursor: pointer;
          font-family: var(--font-montserrat); font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.04em; color: oklch(97% 0.005 80);
          transition: background .18s ease, border-color .18s ease, transform .18s cubic-bezier(.34,1.56,.64,1);
          width: 160px; text-align: center;
        }
        .ch-tile:hover { background:oklch(27% 0.12 260 / 0.90); border-color:oklch(65% 0.15 45 / 0.65); transform:translateY(-2px); }
        .ch-tile-cta { background:oklch(65% 0.15 45); border-color:oklch(65% 0.15 45); color:oklch(22% 0.10 260); font-weight:800; }
        .ch-tile-cta:hover { background:oklch(60% 0.14 45); border-color:oklch(60% 0.14 45); }
        .ch-overlay { position:fixed; inset:0; z-index:900; background:oklch(5% 0.08 260 / 0.85); backdrop-filter:blur(10px); display:flex; align-items:center; justify-content:center; padding:1.25rem; animation:fadeIn .18s ease; }
        .ch-modal { background:oklch(14% 0.09 260); border:1px solid oklch(97% 0.005 80 / 0.09); border-top:3px solid oklch(65% 0.15 45); border-radius:12px; width:100%; max-width:560px; max-height:88vh; display:flex; flex-direction:column; animation:slideUp .24s cubic-bezier(.22,1,.36,1); box-shadow:0 40px 80px oklch(3% 0.10 260 / 0.65); overflow:hidden; }
        .ch-modal-head { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; padding:1.5rem 1.625rem 1.125rem; border-bottom:1px solid oklch(97% 0.005 80 / 0.07); flex-shrink:0; }
        .ch-modal-body { overflow-y:auto; padding:1.25rem 1.625rem 1.75rem; flex:1; }
        .ch-modal-body::-webkit-scrollbar{width:3px} .ch-modal-body::-webkit-scrollbar-thumb{background:oklch(65% 0.15 45 / 0.35);border-radius:2px}
        .ch-close { background:none; border:none; color:oklch(48% 0.03 260); font-size:1.4rem; line-height:1; padding:.2rem .4rem; cursor:pointer; flex-shrink:0; transition:color .15s ease; }
        .ch-close:hover { color:oklch(97% 0.005 80); }
        .ch-chapter { color:oklch(65% 0.15 45); font-family:var(--font-montserrat); font-size:0.62rem; font-weight:800; letter-spacing:0.16em; text-transform:uppercase; margin:0 0 0.45rem; }
        .ch-input { font-family:var(--font-montserrat); font-size:.9375rem; color:oklch(97% 0.005 80); background:oklch(97% 0.005 80 / 0.07); border:1px solid oklch(97% 0.005 80 / 0.18); border-radius:6px 0 0 6px; padding:.8rem 1.125rem; flex:1; min-width:0; outline:none; }
        .ch-input::placeholder{color:oklch(97% 0.005 80 / 0.32)} .ch-input:focus{border-color:oklch(65% 0.15 45 / 0.65)}
        .ch-btn { font-family:var(--font-montserrat); font-weight:800; font-size:.78rem; letter-spacing:.08em; text-transform:uppercase; color:oklch(22% 0.10 260); background:oklch(65% 0.15 45); border:none; border-radius:0 6px 6px 0; padding:.8rem 1.375rem; cursor:pointer; flex-shrink:0; transition:background .15s ease; }
        .ch-btn:hover{background:oklch(60% 0.14 45)} .ch-btn:disabled{opacity:.6;cursor:default}
      `}</style>

      <div className="ch-page">
        {/* Title */}
        <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
          <h1 style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontWeight:600, fontSize:"clamp(1.75rem,5vw,4rem)", lineHeight:1.05, color:"oklch(22% 0.10 260)", margin:"0 0 0.625rem", textShadow:"0 1px 6px oklch(97% 0.005 80 / 0.5)" }}>
            {isId ? "Tantangan Kepemimpinan Berpengaruh" : "The Influential Leadership Challenge"}
          </h1>
          <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"clamp(0.85rem,1.6vw,1.05rem)", color:"oklch(65% 0.15 45)", margin:0, maxWidth:"48ch", lineHeight:1.65, fontWeight:600 }}>
            {isId ? <>Pemimpin berpengaruh bukan dibentuk oleh keterampilan mereka,<br />melainkan oleh siapa mereka di dalam.</> : <>Influential leaders aren&apos;t shaped by their skills,<br />they are shaped by who they are inside.</>}
          </p>
        </div>

        {/* Bottom row: back left, tiles right */}
        <div style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative", zIndex:1 }}>
          {/* Back — plain text, bottom-left */}
          <Link href="/" style={{ fontFamily:"var(--font-montserrat)", fontWeight:600, fontSize:"0.72rem", letterSpacing:"0.06em", color:"oklch(75% 0.025 260)", textDecoration:"none", textShadow:"0 1px 6px oklch(4% 0.08 260 / 0.8)" }}>
            ← {isId ? "Kembali ke Crispy" : "Back to Crispy"}
          </Link>
          {/* Tiles — stacked, bottom-right */}
          <div className="ch-tiles">
            <button type="button" className="ch-tile" onClick={() => setModal("challenge")}>{isId ? "Tantangannya" : "The Challenge"}</button>
            <button type="button" className="ch-tile" onClick={() => setModal("topics")}>{isId ? "Topik" : "Topics"}</button>
            <Link href="/challenge/solo" className="ch-tile ch-tile-cta" style={{ textDecoration: "none", display: "block" }}>{isId ? "Daftar Sekarang" : "Sign Up Now"}</Link>
          </div>
        </div>
      </div>

      {modal && (
        <div className="ch-overlay" role="dialog" aria-modal="true" onClick={() => setModal(null)}>
          <div className="ch-modal" onClick={e => e.stopPropagation()}>

            {modal === "challenge" && (<>
              <div className="ch-modal-head">
                <div>
                  <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"oklch(65% 0.15 45)", margin:"0 0 0.3rem" }}>{isId ? "Tentang Tantangan" : "About the Challenge"}</p>
                  <h2 style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontWeight:600, fontSize:"clamp(1.3rem,2.5vw,1.65rem)", color:"oklch(97% 0.005 80)", margin:0, lineHeight:1.1 }}>{isId ? "Tantangan Kepemimpinan Berpengaruh" : "The Influential Leadership Challenge"}</h2>
                </div>
                <button className="ch-close" onClick={() => setModal(null)}>×</button>
              </div>
              <div className="ch-modal-body">
                <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.875rem", lineHeight:1.8, color:"oklch(72% 0.025 260)", margin:"0 0 1.625rem" }}>
                  {isId ? "Perjalanan 60 hari yang dipandu berdasarkan Deep Influence karya T.J. Addington. Setiap hari: satu topik, pertanyaan refleksi pribadi, dan tantangan implementasi kelompok. Kepemimpinan terbaik tidak dimulai dari keterampilan — melainkan dari dalam." : "A free 60-day guided journey based on T.J. Addington's Deep Influence. Each day: a focused topic, personal reflection questions, and a group implementation challenge. The best leadership does not begin with skills — it begins on the inside."}
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem", marginBottom:"1.625rem" }}>
                  {STEPS.map(s => {
                    const c = isId ? s.id : s.en;
                    return (
                      <div key={s.num}>
                        <span style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontWeight:600, fontSize:"1.75rem", color:"oklch(65% 0.15 45)", display:"block", lineHeight:1, marginBottom:"0.3rem" }}>{s.num}</span>
                        <div style={{ width:"22px", height:"2px", background:"oklch(65% 0.15 45)", marginBottom:"0.45rem" }} />
                        <p style={{ fontFamily:"var(--font-montserrat)", fontWeight:700, fontSize:"0.9375rem", color:"oklch(97% 0.005 80)", margin:"0 0 0.25rem" }}>{c[0]}</p>
                        <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.825rem", lineHeight:1.7, color:"oklch(66% 0.025 260)", margin:0 }}>{c[1]}</p>
                      </div>
                    );
                  })}
                </div>
                <blockquote style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontSize:"1.1rem", lineHeight:1.55, color:"oklch(78% 0.025 260)", borderLeft:"2px solid oklch(65% 0.15 45)", paddingLeft:"1rem", margin:"0 0 1.375rem" }}>
                  {isId ? "\"Di atas segalanya, jagalah hatimu, karena dari situlah terpancar kehidupan.\" — Amsal 4:23" : "\"Above all else, guard your heart, for everything you do flows from it.\" — Proverbs 4:23"}
                </blockquote>
                <Link href="/challenge" style={{ fontFamily:"var(--font-montserrat)", fontWeight:800, fontSize:"0.78rem", letterSpacing:"0.08em", textTransform:"uppercase", color:"oklch(22% 0.10 260)", background:"oklch(65% 0.15 45)", borderRadius:"4px", padding:"0.75rem 1.75rem", textDecoration:"none", display:"inline-block" }}>
                  {isId ? "Ikuti Tantangan Sekarang →" : "Join Challenge Now →"}
                </Link>
              </div>
            </>)}

            {modal === "topics" && (<>
              <div className="ch-modal-head">
                <div>
                  <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"oklch(65% 0.15 45)", margin:"0 0 0.3rem" }}>62 {isId ? "Topik" : "Topics"}</p>
                  <h2 style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontWeight:600, fontSize:"clamp(1.3rem,2.5vw,1.65rem)", color:"oklch(97% 0.005 80)", margin:0, lineHeight:1.1 }}>{isId ? "Setiap hari satu topik." : "Each day one topic."}</h2>
                </div>
                <button className="ch-close" onClick={() => setModal(null)}>×</button>
              </div>
              <div className="ch-modal-body">
                {CHAPTERS.map(ch => (
                  <div key={ch.title} style={{ marginBottom:"1.25rem" }}>
                    <p className="ch-chapter">{ch.title}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:"0.18rem" }}>
                      {ch.topics.map(t => (
                        <p key={t} style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.875rem", lineHeight:1.5, color:"oklch(76% 0.025 260)", margin:0, paddingLeft:"0.625rem", borderLeft:"1px solid oklch(97% 0.005 80 / 0.07)" }}>{t}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {modal === "signup" && (<>
              <div className="ch-modal-head">
                <div>
                  <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.58rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"oklch(65% 0.15 45)", margin:"0 0 0.3rem" }}>{isId ? "Gratis Sepenuhnya" : "Completely Free"}</p>
                  <h2 style={{ fontFamily:"var(--font-cormorant)", fontStyle:"italic", fontWeight:600, fontSize:"clamp(1.3rem,2.5vw,1.65rem)", color:"oklch(97% 0.005 80)", margin:0, lineHeight:1.1 }}>{isId ? "Mulai perjalanan 60 hari Anda." : "Start your 60-day journey."}</h2>
                </div>
                <button className="ch-close" onClick={() => setModal(null)}>×</button>
              </div>
              <div className="ch-modal-body">
                <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.875rem", lineHeight:1.75, color:"oklch(68% 0.025 260)", margin:"0 0 1.375rem" }}>
                  {isId ? "Daftarkan email Anda dan kami akan kirimkan konten Hari 1. Lakukan bersama tim Anda." : "Enter your email and we'll send you Day 1. Do this with your team."}
                </p>
                {status === "done" ? (
                  <div style={{ background:"oklch(65% 0.15 45 / 0.12)", border:"1px solid oklch(65% 0.15 45 / 0.3)", borderRadius:"8px", padding:"1.125rem 1.375rem" }}>
                    <p style={{ fontFamily:"var(--font-montserrat)", fontWeight:700, fontSize:"0.9375rem", color:"oklch(65% 0.15 45)", margin:"0 0 0.25rem" }}>{isId ? "Anda sudah terdaftar!" : "You're in!"}</p>
                    <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.85rem", color:"oklch(66% 0.025 260)", margin:0 }}>{isId ? "Periksa email Anda untuk Hari 1." : "Check your email for Day 1. Welcome."}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display:"flex" }}>
                      <input type="email" required className="ch-input" placeholder={isId ? "Alamat email Anda" : "Your email address"} value={email} onChange={e => setEmail(e.target.value)} />
                      <button type="submit" className="ch-btn" disabled={status==="loading"}>{status==="loading" ? "…" : (isId ? "Ikuti →" : "Join →")}</button>
                    </div>
                    {status === "error" && <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.75rem", color:"oklch(65% 0.22 25)", marginTop:"0.5rem" }}>{isId ? "Terjadi kesalahan." : "Something went wrong. Try again."}</p>}
                    <p style={{ fontFamily:"var(--font-montserrat)", fontSize:"0.68rem", color:"oklch(42% 0.025 260)", marginTop:"0.6rem" }}>{isId ? "Tidak ada spam. Berhenti berlangganan kapan saja." : "No spam. Unsubscribe any time."}</p>
                  </form>
                )}
              </div>
            </>)}

          </div>
        </div>
      )}
    </>
  );
}
