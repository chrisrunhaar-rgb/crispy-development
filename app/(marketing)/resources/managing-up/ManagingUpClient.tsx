"use client";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const leaderNeeds = [
  { number: "1", en_title: "Clarity, not confusion", id_title: "Kejelasan, bukan kebingungan", nl_title: "Duidelijkheid, geen verwarring", en_desc: "Your leader needs to know the state of what you are responsible for — without having to dig for it. This means proactive updates, concise reporting, and flagging problems early. The person who makes their leader's job easier earns trust quickly.", id_desc: "Pemimpin Anda perlu mengetahui keadaan apa yang Anda tanggung jawabi — tanpa harus menggalinya. Ini berarti pembaruan proaktif, pelaporan yang ringkas, dan tanda masalah awal.", nl_desc: "Je leider moet de staat van wat jij verantwoordelijk voor bent kennen — zonder daarvoor te moeten graven. Dit betekent proactieve updates, beknopte rapportage en vroeg signaleren van problemen." },
  { number: "2", en_title: "Honest intelligence, not flattery", id_title: "Kecerdasan yang jujur, bukan sanjungan", nl_title: "Eerlijke informatie, geen vleierij", en_desc: "Leaders lose touch with reality when the people around them only tell them what they want to hear. Giving your leader accurate, honest information — even when it is uncomfortable — is a form of respect. Telling them what they want to hear is a form of sabotage.", id_desc: "Pemimpin kehilangan kontak dengan realitas ketika orang-orang di sekitar mereka hanya memberi tahu mereka apa yang ingin mereka dengar. Memberikan pemimpin Anda informasi yang akurat dan jujur — bahkan ketika itu tidak nyaman — adalah bentuk penghormatan.", nl_desc: "Leiders verliezen contact met de werkelijkheid wanneer de mensen om hen heen hen alleen vertellen wat ze willen horen. Je leider accurate, eerlijke informatie geven — zelfs wanneer het ongemakkelijk is — is een vorm van respect." },
  { number: "3", en_title: "Solutions, not just problems", id_title: "Solusi, bukan hanya masalah", nl_title: "Oplossingen, niet alleen problemen", en_desc: "Anyone can bring problems to a leader. Leaders value people who bring problems AND a proposed way forward. Even if your suggestion is not used, coming with a solution signals that you are thinking at the right level and not just offloading.", id_desc: "Siapa saja bisa membawa masalah ke pemimpin. Pemimpin menghargai orang yang membawa masalah DAN cara maju yang diusulkan. Bahkan jika saran Anda tidak digunakan, datang dengan solusi memberi sinyal bahwa Anda berpikir pada tingkat yang tepat.", nl_desc: "Iedereen kan problemen bij een leider brengen. Leiders waarderen mensen die problemen brengen EN een voorgestelde weg vooruit. Zelfs als je suggestie niet wordt gebruikt, signaleert komen met een oplossing dat je op het juiste niveau denkt." },
  { number: "4", en_title: "Reliability and follow-through", id_title: "Keandalan dan tindak lanjut", nl_title: "Betrouwbaarheid en opvolging", en_desc: "Every leader carries a mental register of 'people I can count on' and 'people I have to chase.' The fastest way to gain influence with your leader is to be ruthlessly reliable — do what you say, when you said it, to the standard you agreed.", id_desc: "Setiap pemimpin membawa daftar mental 'orang yang bisa saya andalkan' dan 'orang yang harus saya kejar.' Cara tercepat untuk mendapatkan pengaruh dengan pemimpin Anda adalah menjadi sangat andal — lakukan apa yang Anda katakan, kapan Anda mengatakannya, sesuai standar yang Anda setujui.", nl_desc: "Elke leider draagt een mentaal register van 'mensen die ik kan vertrouwen' en 'mensen die ik moet achtervolgen.' De snelste manier om invloed te winnen bij je leider is meedogenloos betrouwbaar te zijn." },
];

const principles = [
  { number: "1", en: "Understand your leader's goals, pressures, and blind spots — and align your communication accordingly.", id: "Pahami tujuan, tekanan, dan titik buta pemimpin Anda — dan selaraskan komunikasi Anda sesuai.", nl: "Begrijp de doelen, druk en blinde vlekken van je leider — en stem je communicatie daarop af." },
  { number: "2", en: "Match your communication medium to the message — not everything needs an email; not everything can wait.", id: "Sesuaikan media komunikasi Anda dengan pesan — tidak semua butuh email; tidak semua bisa menunggu.", nl: "Pas je communicatiemedium aan het bericht aan — niet alles heeft een e-mail nodig; niet alles kan wachten." },
  { number: "3", en: "Pick the right moment — a leader under pressure will not hear well. Timing is part of communicating upward.", id: "Pilih momen yang tepat — pemimpin yang berada di bawah tekanan tidak akan mendengar dengan baik. Waktu adalah bagian dari berkomunikasi ke atas.", nl: "Kies het juiste moment — een leider onder druk zal niet goed luisteren. Timing is deel van opwaarts communiceren." },
  { number: "4", en: "Disagree respectfully and privately — raise concerns in private; once a decision is made, support it publicly.", id: "Tidak setuju dengan hormat dan pribadi — angkat kekhawatiran secara pribadi; setelah keputusan dibuat, dukung secara publik.", nl: "Wees het respectvol en privé oneens — breng zorgen privé naar voren; zodra een beslissing is genomen, steun die publiekelijk." },
  { number: "5", en: "Keep your leader off guard only on good surprises — no leader should hear bad news from someone else first.", id: "Buat pemimpin Anda tidak terganggu hanya pada kejutan yang baik — tidak ada pemimpin yang harus mendengar berita buruk dari orang lain lebih dulu.", nl: "Houd je leider alleen verrasst met goede verrassingen — geen leider mag slecht nieuws als eerste van iemand anders horen." },
];

const commonMistakes = [
  { en: "Waiting to be asked — proactive communication is managing up; reactive communication is just surviving.", id: "Menunggu ditanya — komunikasi proaktif adalah managing up; komunikasi reaktif hanyalah bertahan.", nl: "Wachten tot je gevraagd wordt — proactieve communicatie is managing up; reactieve communicatie is gewoon overleven." },
  { en: "Overloading your leader with detail — they need the headline and the options, not the full narrative.", id: "Membebani pemimpin Anda dengan detail — mereka membutuhkan judul utama dan pilihan, bukan narasi lengkap.", nl: "Je leider overladen met detail — ze hebben de kop en de opties nodig, niet het volledige verhaal." },
  { en: "Making your leader look bad in front of others — even if you are right, this destroys the relationship.", id: "Membuat pemimpin Anda terlihat buruk di depan orang lain — bahkan jika Anda benar, ini menghancurkan hubungan.", nl: "Je leider slecht laten uitkomen voor anderen — zelfs als je gelijk hebt, vernietigt dit de relatie." },
  { en: "Managing sideways but not upward — great peer relationships don't substitute for managing your leader relationship.", id: "Mengelola ke samping tetapi tidak ke atas — hubungan rekan yang baik tidak menggantikan mengelola hubungan pemimpin Anda.", nl: "Zijwaarts managen maar niet opwaarts — goede collegaale relaties vervangen het beheren van je leidersrelatie niet." },
];

const reflectionQuestions = [
  { roman: "I", en: "Does your leader trust your judgment? How do you know? What evidence supports or challenges that?", id: "Apakah pemimpin Anda mempercayai penilaian Anda? Bagaimana Anda tahu? Bukti apa yang mendukung atau menantang itu?", nl: "Vertrouwt je leider jouw oordeel? Hoe weet je dat? Welk bewijs ondersteunt of daagt dat uit?" },
  { roman: "II", en: "What does your leader most need from you right now that you are not currently providing?", id: "Apa yang paling dibutuhkan pemimpin Anda dari Anda saat ini yang tidak Anda berikan?", nl: "Wat heeft je leider momenteel het meest van jou nodig dat je momenteel niet levert?" },
  { roman: "III", en: "Have you ever given a leader bad news too late? What were the consequences, and what would you do differently?", id: "Pernahkah Anda memberikan pemimpin berita buruk terlambat? Apa konsekuensinya, dan apa yang akan Anda lakukan secara berbeda?", nl: "Heb je ooit te laat slecht nieuws aan een leider gegeven? Wat waren de gevolgen, en wat zou je anders doen?" },
  { roman: "IV", en: "How does your cultural context shape expectations about how one communicates with those in authority?", id: "Bagaimana konteks budaya Anda membentuk harapan tentang cara seseorang berkomunikasi dengan mereka yang berkuasa?", nl: "Hoe vormt jouw culturele context verwachtingen over hoe men communiceert met degenen in gezag?" },
  { roman: "V", en: "What is one thing you have been avoiding raising with your leader? What would faithfulness require you to do?", id: "Apa satu hal yang Anda hindari untuk diangkat dengan pemimpin Anda? Apa yang kesetiaan mengharuskan Anda lakukan?", nl: "Wat is één ding dat je hebt vermeden bij je leider te bespreken? Wat zou trouw van je vereisen?" },
  { roman: "VI", en: "How does submitting to authority (Romans 13, 1 Peter 2) shape your theology of managing up?", id: "Bagaimana tunduk pada otoritas (Roma 13, 1 Petrus 2) membentuk teologi Anda tentang managing up?", nl: "Hoe vormt onderwerping aan autoriteit (Romeinen 13, 1 Petrus 2) jouw theologie van managing up?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function ManagingUpClient({ userPathway, isSaved: initialSaved }: Props) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("managing-up");
      setSaved(true);
    });
  }

  const navy = "oklch(22% 0.10 260)";
  const offWhite = "oklch(97% 0.005 80)";
  const lightGray = "oklch(95% 0.008 80)";
  const orange = "oklch(65% 0.15 45)";
  const bodyText = "oklch(38% 0.05 260)";

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", background: offWhite, minHeight: "100vh" }}>
      <LangToggle />

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Leadership · Guide", "Kepemimpinan · Panduan", "Leiderschap · Gids")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Managing Up", "Mengelola ke Atas", "Managing Up")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Managing up is not about pleasing your leader — it is about serving the mission through the relationship."',
            '"Mengelola ke atas bukan tentang menyenangkan pemimpin Anda — ini tentang melayani misi melalui hubungan."',
            '"Managing up gaat niet over je leider pleasen — het gaat over de missie dienen via de relatie."'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("✓ Saved to Dashboard", "✓ Tersimpan di Dashboard", "✓ Opgeslagen in Dashboard") : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard")}
          </button>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "'Managing up' is one of those phrases that makes some leaders uncomfortable — as if it implies manipulation. But at its core, managing up simply means taking responsibility for the quality of the relationship between you and your leader, rather than waiting for them to manage it.",
            "'Mengelola ke atas' adalah salah satu frasa yang membuat beberapa pemimpin tidak nyaman — seolah-olah itu mengimplikasikan manipulasi. Tetapi pada intinya, mengelola ke atas berarti mengambil tanggung jawab untuk kualitas hubungan antara Anda dan pemimpin Anda.",
            "'Managing up' is een van die uitdrukkingen die sommige leiders oncomfortabel maakt — alsof het manipulatie impliceert. Maar in de kern betekent managing up simpelweg verantwoordelijkheid nemen voor de kwaliteit van de relatie tussen jou en je leider."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "In cross-cultural contexts, managing up is further complicated by different cultural expectations around deference, directness, and the proper way to communicate upward. Understanding what your leader needs — and how to deliver it in a way that works in your context — is a learnable and essential skill.",
            "Dalam konteks lintas budaya, mengelola ke atas semakin diperumit oleh harapan budaya yang berbeda seputar kepatuhan, keterusterangan, dan cara yang tepat untuk berkomunikasi ke atas.",
            "In interculturele contexten wordt managing up verder gecompliceerd door verschillende culturele verwachtingen rondom eerbied, directheid en de juiste manier om opwaarts te communiceren."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("4 Things Your Leader Needs from You", "4 Hal yang Dibutuhkan Pemimpin Anda dari Anda", "4 Dingen die je Leider van Jou Nodig Heeft")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {leaderNeeds.map((n) => (
              <div key={n.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{n.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? n.en_title : lang === "id" ? n.id_title : n.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? n.en_desc : lang === "id" ? n.id_desc : n.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("5 Principles for Communicating Upward", "5 Prinsip untuk Berkomunikasi ke Atas", "5 Principes voor Opwaartse Communicatie")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {principles.map((p) => (
            <div key={p.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{p.number}</div>
              <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                {lang === "en" ? p.en : lang === "id" ? p.id : p.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 24, fontWeight: 800, color: navy, marginBottom: 24, textAlign: "center" }}>
            {t("Common Mistakes", "Kesalahan Umum", "Veelgemaakte Fouten")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {commonMistakes.map((m, i) => (
              <div key={i} style={{ background: offWhite, borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ color: orange, fontSize: 18, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✗</div>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                  {lang === "en" ? m.en : lang === "id" ? m.id : m.nl}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
          {t("Reflection Questions", "Pertanyaan Refleksi", "Reflectievragen")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {reflectionQuestions.map((q) => (
            <div key={q.roman} style={{ background: lightGray, borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 22, fontWeight: 700, color: orange, minWidth: 28, flexShrink: 0 }}>{q.roman}</div>
              <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                {lang === "en" ? q.en : lang === "id" ? q.id : q.nl}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: navy, padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: offWhite, marginBottom: 16 }}>
          {t("Keep Growing", "Terus Bertumbuh", "Blijf Groeien")}
        </h2>
        <p style={{ color: "oklch(80% 0.03 80)", fontSize: 16, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 32px" }}>
          {t("Explore more resources to deepen your cross-cultural leadership.", "Jelajahi lebih banyak sumber untuk memperdalam kepemimpinan lintas budaya Anda.", "Verken meer bronnen om je intercultureel leiderschap te verdiepen.")}
        </p>
        <Link href="/resources" style={{ display: "inline-block", padding: "14px 32px", background: orange, color: offWhite, borderRadius: 6, fontFamily: "Montserrat, sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          {t("← Content Library", "← Perpustakaan Konten", "← Contentbibliotheek")}
        </Link>
      </div>
    </div>
  );
}
