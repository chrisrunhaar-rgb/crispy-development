"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";

type Lang = "en" | "id" | "nl";

const t = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const ZONES = [
  {
    key: "comfort",
    num: "01",
    color: "oklch(42% 0.14 260)",
    colorBg: "oklch(42% 0.14 260 / 0.08)",
    colorBorder: "oklch(42% 0.14 260 / 0.25)",
    titleEn: "Comfort Zone",
    titleId: "Zona Nyaman",
    titleNl: "Comfortzone",
    tagEn: "Feeling safe and in control",
    tagId: "Merasa aman dan terkendali",
    tagNl: "Veilig en in controle voelen",
    descEn: "Most of us are familiar with the comfort zone — the place where we feel safe and secure, doing things we know well that require little effort. It can be a great place to rest, but it can also prevent us from trying new things and expanding our horizons.",
    descId: "Sebagian besar dari kita familiar dengan zona nyaman — tempat di mana kita merasa aman dan terjamin, melakukan hal-hal yang kita kuasai dengan sedikit usaha. Ini bisa menjadi tempat yang baik untuk beristirahat, tetapi juga dapat mencegah kita mencoba hal baru dan memperluas cakrawala.",
    descNl: "De meesten van ons kennen de comfortzone — de plek waar we ons veilig en zeker voelen, dingen doen die we goed kennen met weinig inspanning. Het kan een geweldige plek zijn om te rusten, maar het kan ons ook beletten nieuwe dingen te proberen en onze horizon te verbreden.",
    listEn: ["Feeling safe and in control", "Making excuses", "Avoiding opportunities"],
    listId: ["Merasa aman dan terkendali", "Mencari-cari alasan", "Menghindari peluang"],
    listNl: ["Veilig en in controle voelen", "Excuses maken", "Kansen vermijden"],
  },
  {
    key: "fear",
    num: "02",
    color: "oklch(50% 0.14 25)",
    colorBg: "oklch(50% 0.14 25 / 0.08)",
    colorBorder: "oklch(50% 0.14 25 / 0.25)",
    titleEn: "Fear Zone",
    titleId: "Zona Ketakutan",
    titleNl: "Angstzone",
    tagEn: "Facing challenges outside your usual experience",
    tagId: "Menghadapi tantangan di luar pengalaman biasa",
    tagNl: "Uitdagingen buiten je gebruikelijke ervaring aangaan",
    descEn: "The fear zone is the opposite of the comfort zone — the place where we feel scared or uncertain. Stepping in can be daunting, but it can also lead to growth and learning. If you're able to push through the fear zone, that's where the magic starts to happen.",
    descId: "Zona ketakutan adalah kebalikan dari zona nyaman — tempat di mana kita merasa takut atau tidak pasti. Melangkah masuk bisa terasa berat, tetapi ini juga bisa mengarah pada pertumbuhan. Jika kamu mampu mendorong diri melewati zona ketakutan, di sinilah keajaiban mulai terjadi.",
    descNl: "De angstzone is het tegenovergestelde van de comfortzone — de plek waar we ons bang of onzeker voelen. Erin stappen kan ontmoedigend zijn, maar het kan ook leiden tot groei en leren. Als je de angstzone kunt doorbreken, begint daar de magie te gebeuren.",
    listEn: ["Low self-confidence", "Affected by others' opinions", "Making excuses", "Avoiding opportunities"],
    listId: ["Rendah diri", "Terpengaruh pendapat orang lain", "Mencari-cari alasan", "Menghindari peluang"],
    listNl: ["Laag zelfvertrouwen", "Beïnvloed door andermans mening", "Excuses maken", "Kansen vermijden"],
  },
  {
    key: "learning",
    num: "03",
    color: "oklch(48% 0.14 145)",
    colorBg: "oklch(48% 0.14 145 / 0.08)",
    colorBorder: "oklch(48% 0.14 145 / 0.25)",
    titleEn: "Learning Zone",
    titleId: "Zona Pembelajaran",
    titleNl: "Leerzone",
    tagEn: "Growing through discomfort",
    tagId: "Bertumbuh melalui ketidaknyamanan",
    tagNl: "Groeien door ongemak",
    descEn: "The learning zone sits between the comfort and fear zones. Here we push ourselves to try new things and may feel inadequate or uncomfortable. This is often the best place to be when learning something new or developing a skill. These feelings are your internal signal that you're on the path of growth.",
    descId: "Zona pembelajaran berada di antara zona nyaman dan ketakutan. Di sini kita mendorong diri untuk mencoba hal baru dan mungkin merasa tidak mampu atau tidak nyaman. Inilah tempat terbaik untuk mempelajari sesuatu yang baru atau mengembangkan keterampilan. Perasaan-perasaan ini adalah sinyal internal bahwa kamu sedang berada di jalur pertumbuhan.",
    descNl: "De leerzone bevindt zich tussen de comfort- en angstzone. Hier dagen we onszelf uit om nieuwe dingen te proberen en kunnen we ons ontoereikend of ongemakkelijk voelen. Dit is vaak de beste plek bij het leren van iets nieuws of het ontwikkelen van een vaardigheid. Deze gevoelens zijn je interne signaal dat je op het pad van groei bent.",
    listEn: ["Try new things", "Acquire new skills", "Deal with problems"],
    listId: ["Mencoba hal baru", "Memperoleh keterampilan baru", "Menghadapi masalah"],
    listNl: ["Nieuwe dingen proberen", "Nieuwe vaardigheden opdoen", "Problemen aanpakken"],
  },
  {
    key: "growth",
    num: "04",
    color: "oklch(52% 0.14 45)",
    colorBg: "oklch(52% 0.14 45 / 0.08)",
    colorBorder: "oklch(52% 0.14 45 / 0.25)",
    titleEn: "Growth Zone",
    titleId: "Zona Pertumbuhan",
    titleNl: "Groeizone",
    tagEn: "Living with purpose and clear vision",
    tagId: "Hidup dengan tujuan dan visi yang jelas",
    tagNl: "Leven met doel en heldere visie",
    descEn: "Once you push yourself to stay in the learning zone for prolonged periods of time, you start to reach the Growth zone. This is where your fears abide and you feel like you have clear vision forward. What seemed impossible before will now seem very doable.",
    descId: "Setelah mendorong diri untuk bertahan di zona pembelajaran dalam waktu yang lebih lama, kamu mulai mencapai zona pertumbuhan. Di sinilah ketakutanmu mereda dan kamu merasa memiliki visi yang jelas ke depan. Apa yang tampak mustahil sebelumnya kini akan terasa sangat bisa dilakukan.",
    descNl: "Wanneer je jezelf dwingt om langere tijd in de leerzone te blijven, bereik je de groeizone. Hier nemen je angsten af en voel je dat je een heldere visie hebt op de toekomst. Wat voorheen onmogelijk leek, zal nu zeer haalbaar lijken.",
    listEn: ["Set new goals", "Find your purpose", "Live your dreams"],
    listId: ["Menetapkan tujuan baru", "Menemukan tujuan hidupmu", "Menjalani impianmu"],
    listNl: ["Nieuwe doelen stellen", "Je doel ontdekken", "Je dromen leven"],
  },
];

const QUESTIONS = [
  {
    num: "I",
    en: "What are some of the things in your life that you'd like to do but feel uncomfortable doing?",
    id: "Apa hal-hal dalam hidupmu yang ingin kamu lakukan tetapi merasa tidak nyaman melakukannya?",
    nl: "Welke dingen in je leven zou je willen doen maar voel je je ongemakkelijk bij om te doen?",
  },
  {
    num: "II",
    en: "What fears are holding you back? What kind of thoughts does doing this bring into mind? What do you think will happen if you do it anyway?",
    id: "Ketakutan apa yang menghambatmu? Pikiran apa yang muncul ketika memikirkan hal ini? Apa yang menurutmu akan terjadi jika kamu tetap melakukannya?",
    nl: "Welke angsten houden je tegen? Welke gedachten komen er in je op als je eraan denkt? Wat denk je dat er zal gebeuren als je het toch doet?",
  },
  {
    num: "III",
    en: "What are you missing out on by letting your thoughts and fears hold you back? (For example: experiences, skills, relationships.)",
    id: "Apa yang kamu lewatkan karena membiarkan pikiran dan ketakutanmu menghambatmu? (Misalnya: pengalaman, keterampilan, hubungan.)",
    nl: "Wat mis je door je gedachten en angsten je te laten tegenhouden? (Bijvoorbeeld: ervaringen, vaardigheden, relaties.)",
  },
  {
    num: "IV",
    en: "What would happen in your life if you decided not to listen to your fears and do the things that are making you uncomfortable? What kind of person would you then be? What would you be able to achieve?",
    id: "Apa yang akan terjadi dalam hidupmu jika kamu memutuskan untuk tidak mendengarkan ketakutanmu dan melakukan hal-hal yang membuatmu tidak nyaman? Seperti apa dirimu nantinya? Apa yang akan kamu capai?",
    nl: "Wat zou er in je leven gebeuren als je besloot niet naar je angsten te luisteren en de dingen te doen die je ongemakkelijk maken? Wat voor persoon zou je dan zijn? Wat zou je kunnen bereiken?",
  },
  {
    num: "V",
    en: "What small steps could you start taking to make yourself face your fears? If you were to embrace the discomfort and do it anyway, what would you do?",
    id: "Langkah kecil apa yang bisa kamu mulai ambil untuk menghadapi ketakutanmu? Jika kamu merangkul ketidaknyamanan dan tetap melakukannya, apa yang akan kamu lakukan?",
    nl: "Welke kleine stappen kun je nemen om jezelf je angsten onder ogen te laten zien? Als je het ongemak zou omarmen en het toch zou doen, wat zou je dan doen?",
  },
];

export default function ComfortZoneClient({
  userPathway,
  isSaved: isSavedProp,
}: {
  userPathway: string | null;
  isSaved: boolean;
}) {
  const { lang: _ctxLang } = useLanguage();
  const lang = (_ctxLang === "id" || _ctxLang === "nl" ? _ctxLang : "en") as Lang;
  const [saved, setSaved] = useState(isSavedProp);
  const [isPending, startTransition] = useTransition();
  const showAddToDashboard = userPathway !== null;

  function handleSave() {
    startTransition(async () => {
      const result = await saveResourceToDashboard("escaping-the-comfort-zone");
      if (!result.error) setSaved(true);
    });
  }

  return (
    <>
      <LangToggle />
      {/* ── HERO ── */}
      <section style={{
        background: "oklch(22% 0.10 260)",
        paddingTop: "clamp(2.5rem, 4vw, 4rem)",
        paddingBottom: "clamp(2.5rem, 4vw, 4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide" style={{ position: "relative" }}>
          <Link href="/resources" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", color: "oklch(62% 0.04 260)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem", marginBottom: "1.5rem" }}>
            ← Content Library
          </Link>


          <span className="pathway-badge" style={{ background: "oklch(65% 0.15 45 / 0.15)", color: "oklch(82% 0.08 60)", marginBottom: "1.25rem", display: "inline-flex" }}>
            {t("Personal Growth", "Pertumbuhan Pribadi", "Persoonlijke Groei", lang)}
          </span>

          <p style={{ color: "oklch(65% 0.15 45)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>
            {t("Personal Development · Worksheet", "Pengembangan Pribadi · Lembar Kerja", "Persoonlijke Ontwikkeling · Werkblad", lang)}
          </p>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600, lineHeight: 1.08, color: "oklch(97% 0.005 80)", marginBottom: "1.5rem", maxWidth: "16ch" }}>
            {lang === "en"
              ? <>{`Escaping the`}<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Comfort Zone.</span></>
              : lang === "id"
              ? <>{`Keluar dari`}<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Zona Nyaman.</span></>
              : <>{`Ontsnappen aan de`}<br /><span style={{ color: "oklch(65% 0.15 45)" }}>Comfortzone.</span></>}
          </h1>
          <p className="t-tagline" style={{ color: "oklch(72% 0.04 260)", maxWidth: "52ch", marginBottom: "2rem" }}>
            {t(
              "Identify where your comfort zone ends and growth begins. Fear and personal growth go hand in hand — the discomfort you feel is the signal.",
              "Identifikasi di mana batas zona nyamanmu dan pertumbuhan dimulai. Ketakutan dan pertumbuhan pribadi berjalan beriringan — ketidaknyamanan yang kamu rasakan adalah sinyal itu.",
              "Identificeer waar je comfortzone eindigt en groei begint. Angst en persoonlijke groei gaan hand in hand — het ongemak dat je voelt is het signaal.",
              lang
            )}
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            {showAddToDashboard && (
              saved ? (
                <Link href="/dashboard" style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(72% 0.14 145)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  ✓ {t("In your dashboard", "Di dashboard Anda", "In uw dashboard", lang)}
                </Link>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", color: "oklch(97% 0.005 80)", background: isPending ? "oklch(40% 0.10 260)" : "oklch(30% 0.12 260)", border: "none", padding: "0.625rem 1.25rem", cursor: isPending ? "wait" : "pointer", transition: "background 0.15s" }}
                >
                  {isPending
                    ? t("Saving…", "Menyimpan…", "Opslaan…", lang)
                    : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "start" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
                {t("About This Exercise", "Tentang Latihan Ini", "Over Deze Oefening", lang)}
              </p>
              <h2 className="t-section" style={{ marginBottom: "1.25rem" }}>
                {lang === "en"
                  ? <>Four zones.<br />One journey.</>
                  : lang === "id"
                  ? <>Empat zona.<br />Satu perjalanan.</>
                  : <>Vier zones.<br />Één reis.</>}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", maxWidth: "52ch" }}>
                {t(
                  "This exercise helps you identify where your personal comfort zone ends. Realize that fear and personal growth go hand in hand — having fears and making mistakes is normal. Reflect on what you're missing out on, and what actions you can take to reach the growth zone.",
                  "Latihan ini membantu kamu mengidentifikasi di mana batas zona nyaman pribadimu. Sadari bahwa ketakutan dan pertumbuhan pribadi berjalan beriringan — memiliki rasa takut dan membuat kesalahan adalah hal yang normal. Renungkan apa yang kamu lewatkan, dan langkah apa yang bisa diambil untuk mencapai zona pertumbuhan.",
                  "Deze oefening helpt je te identificeren waar je persoonlijke comfortzone eindigt. Besef dat angst en persoonlijke groei hand in hand gaan — angsten hebben en fouten maken is normaal. Bedenk wat je mist, en welke acties je kunt ondernemen om de groeizone te bereiken.",
                  lang
                )}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {ZONES.map((zone) => (
                <a key={zone.key} href={`#zone-${zone.key}`} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.875rem 1.125rem",
                  background: zone.colorBg, border: `1px solid ${zone.colorBorder}`,
                  textDecoration: "none", transition: "transform 0.2s ease",
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "none")}
                >
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.6rem", color: zone.color, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>{zone.num}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", fontWeight: 700, color: zone.color }}>{t(zone.titleEn, zone.titleId, zone.titleNl, lang)}</div>
                    <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: "oklch(58% 0.008 260)", marginTop: "0.1rem" }}>{t(zone.tagEn, zone.tagId, zone.tagNl, lang)}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "oklch(65% 0.008 260)" }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUR ZONES ── */}
      {ZONES.map((zone, i) => (
        <section key={zone.key} id={`zone-${zone.key}`} style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: i % 2 === 0 ? "oklch(99% 0.002 80)" : "oklch(97% 0.005 80)" }}>
          <div className="container-wide">
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(88% 0.008 80)" }}>
              <div style={{ background: "white", padding: "2rem 2.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem", alignItems: "start" }}>
                  <div>
                    <p className="t-label" style={{ color: zone.color, marginBottom: "0.5rem", fontSize: "0.6rem" }}>
                      {`${zone.num} / 04 — ${t("Zone", "Zona", "Zone", lang)}`}
                    </p>
                    <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)", color: "oklch(22% 0.005 260)", marginBottom: "0.375rem", lineHeight: 1.1 }}>
                      {t(zone.titleEn, zone.titleId, zone.titleNl, lang)}
                    </h2>
                    <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1rem", fontStyle: "italic", color: zone.color, marginBottom: "1.25rem" }}>
                      {t(zone.tagEn, zone.tagId, zone.tagNl, lang)}
                    </p>
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)" }}>
                      {t(zone.descEn, zone.descId, zone.descNl, lang)}
                    </p>
                  </div>
                  <div style={{ background: zone.colorBg, padding: "1.5rem 1.75rem", border: `1px solid ${zone.colorBorder}` }}>
                    <p className="t-label" style={{ color: zone.color, marginBottom: "1rem", fontSize: "0.6rem" }}>
                      {t("Characteristics", "Karakteristik", "Kenmerken", lang)}
                    </p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {(lang === "en" ? zone.listEn : lang === "id" ? zone.listId : zone.listNl).map(item => (
                        <li key={item} style={{ display: "flex", gap: "0.75rem", fontFamily: "var(--font-montserrat)", fontSize: "0.875rem", color: "oklch(32% 0.008 260)", lineHeight: 1.5 }}>
                          <span style={{ color: zone.color, fontWeight: 700, flexShrink: 0 }}>+</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── CONCENTRIC CIRCLE INSIGHT ── */}
      <section style={{ paddingBlock: "clamp(3rem, 5vw, 5rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "center" }}>
            <div>
              <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
                {t("Key Insight", "Wawasan Utama", "Belangrijkste Inzicht", lang)}
              </p>
              <h2 className="t-section" style={{ marginBottom: "1.25rem" }}>
                {t(
                  "Growth doesn't replace fear — it expands around it.",
                  "Pertumbuhan tidak menggantikan ketakutan — ia berkembang di sekitarnya.",
                  "Groei vervangt angst niet — het breidt zich eromheen uit.",
                  lang
                )}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)" }}>
                {t(
                  "Notice how the comfort and fear zones are the smallest. Staying inside keeps your future small. But the growth zone still encompasses the fear and comfort zones — even as you grow, you will still experience fears. It's just that your comfort zone expands as you spend more time in the learning and growth zones.",
                  "Perhatikan bagaimana zona nyaman dan ketakutan adalah yang terkecil. Tetap di dalamnya membuat masa depanmu menjadi kecil. Namun zona pertumbuhan masih mencakup zona ketakutan dan kenyamanan — bahkan saat kamu bertumbuh, kamu masih akan mengalami ketakutan. Hanya saja zona nyamanmu berkembang seiring semakin banyak waktu yang kamu habiskan di zona pembelajaran dan pertumbuhan.",
                  "Merk op hoe de comfort- en angstzone het kleinst zijn. Daarin blijven maakt je toekomst klein. Maar de groeizone omvat nog steeds de angst- en comfortzones — ook als je groeit, zul je nog steeds angsten ervaren. Je comfortzone breidt alleen uit naarmate je meer tijd doorbrengt in de leer- en groeizone.",
                  lang
                )}
              </p>
            </div>

            <div style={{ position: "relative", width: "100%", maxWidth: "480px", margin: "0 auto" }}>
              <Image
                src={lang === "id" ? "/resources/comfort-zone-diagram-id.png" : "/resources/comfort-zone-diagram-en.png"}
                alt={t("Comfort Zone diagram — four concentric circles", "Diagram Zona Nyaman — empat lingkaran konsentris", "Comfortzone diagram — vier concentrische cirkels", lang)}
                width={480}
                height={480}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── REFLECTION QUESTIONS ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(22% 0.10 260)", position: "relative" }}>
        <div style={{ position: "absolute", left: "clamp(1.5rem, 5vw, 4rem)", top: "clamp(4rem, 7vw, 7rem)", bottom: "clamp(4rem, 7vw, 7rem)", width: "3px", background: "oklch(65% 0.15 45)" }} />
        <div className="container-wide">
          <div style={{ paddingLeft: "2.5rem" }}>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem", fontSize: "0.62rem" }}>
              {t("Reflection Worksheet", "Lembar Refleksi", "Reflectiewerkblad", lang)}
            </p>
            <h2 className="t-section" style={{ color: "oklch(97% 0.005 80)", marginBottom: "0.75rem" }}>
              {t(
                "Five questions worth sitting with.",
                "Lima pertanyaan yang layak direnungkan.",
                "Vijf vragen om bij stil te staan.",
                lang
              )}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", color: "oklch(65% 0.04 260)", marginBottom: "3rem", maxWidth: "52ch" }}>
              {t(
                "Download the PDF to complete this as a written worksheet. Or work through these questions in a journal, with a coach, or in your peer group.",
                "Unduh PDF untuk mengisi lembar kerja ini secara tertulis. Atau kerjakan pertanyaan-pertanyaan ini dalam jurnal, bersama pelatih, atau dalam kelompok temanmu.",
                "Download de PDF om dit als schriftelijk werkblad in te vullen. Of werk deze vragen door in een dagboek, met een coach, of in je peergroep.",
                lang
              )}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "oklch(40% 0.008 260 / 0.3)" }}>
              {QUESTIONS.map((q) => (
                <div key={q.num} style={{ background: "oklch(28% 0.10 260)", padding: "1.75rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "var(--font-montserrat)", fontWeight: 800, fontSize: "0.7rem", color: "oklch(65% 0.15 45)", letterSpacing: "0.08em", flexShrink: 0, paddingTop: "0.15rem", minWidth: "1.75rem" }}>{q.num}</span>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.7, color: "oklch(78% 0.04 260)", margin: 0 }}>
                    {t(q.en, q.id, q.nl, lang)}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ paddingBlock: "clamp(4rem, 7vw, 7rem)", background: "oklch(97% 0.005 80)" }}>
        <div className="container-wide" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
          <div>
            <p className="t-label" style={{ color: "oklch(65% 0.15 45)", marginBottom: "0.875rem" }}>
              {t("More in the Library", "Lebih Banyak di Perpustakaan", "Meer in de Bibliotheek", lang)}
            </p>
            <h2 className="t-section" style={{ marginBottom: "1rem" }}>
              {lang === "en"
                ? <>Part of the full<br />content library.</>
                : lang === "id"
                ? <>Bagian dari perpustakaan<br />konten lengkap.</>
                : <>Onderdeel van de volledige<br />contentbibliotheek.</>}
            </h2>
            <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9375rem", lineHeight: 1.75, color: "oklch(42% 0.008 260)", marginBottom: "2rem", maxWidth: "48ch" }}>
              {t(
                "Escaping the Comfort Zone is one of many resources in the Crispy Development library — tools, frameworks, and reflections built for cross-cultural leaders.",
                "Keluar dari Zona Nyaman adalah salah satu dari banyak sumber daya dalam perpustakaan Crispy Development — alat, kerangka kerja, dan refleksi yang dibangun untuk pemimpin lintas budaya.",
                "Ontsnappen aan de Comfortzone is een van de vele bronnen in de Crispy Development bibliotheek — tools, kaders en reflecties gebouwd voor interculturele leiders.",
                lang
              )}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {!showAddToDashboard ? (
                <Link href="/signup" className="btn-primary">{t("Join the Community →", "Bergabung →", "Word lid →", lang)}</Link>
              ) : saved ? (
                <Link href="/dashboard" className="btn-primary">{t("Go to Dashboard →", "Ke Dashboard →", "Naar Dashboard →", lang)}</Link>
              ) : (
                <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ border: "none", cursor: isPending ? "wait" : "pointer" }}>
                  {isPending
                    ? t("Saving…", "Menyimpan…", "Opslaan…", lang)
                    : t("Save to Dashboard", "Simpan ke Dashboard", "Opslaan in Dashboard", lang)}
                </button>
              )}
              <Link href="/resources" className="btn-outline-navy">{t("Browse the Library", "Jelajahi Perpustakaan", "Verken de Bibliotheek", lang)}</Link>
            </div>
          </div>
          <div>
            <div style={{ background: "oklch(30% 0.12 260)", padding: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.375rem", fontStyle: "italic", color: "oklch(78% 0.04 260)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                {t(
                  "\"Fear and personal growth go hand in hand. The discomfort you feel is the signal that you're on the path.\"",
                  "\"Ketakutan dan pertumbuhan pribadi berjalan beriringan. Ketidaknyamanan yang kamu rasakan adalah sinyal bahwa kamu sedang berada di jalur yang benar.\"",
                  "\"Angst en persoonlijke groei gaan hand in hand. Het ongemak dat je voelt is het signaal dat je op het juiste pad bent.\"",
                  lang
                )}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "oklch(65% 0.15 45)" }} />
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "oklch(65% 0.15 45)", textTransform: "uppercase" }}>Crispy Development</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
