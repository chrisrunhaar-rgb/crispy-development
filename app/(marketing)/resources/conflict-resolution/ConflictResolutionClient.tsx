"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";

type Lang = "en" | "id" | "nl";
const tFn = (en: string, id: string, nl: string, lang: Lang) =>
  lang === "en" ? en : lang === "id" ? id : nl;

const conflictSources = [
  { number: "1", en_title: "Value differences", id_title: "Perbedaan nilai", nl_title: "Waardenverschillen", en_desc: "Cultures prioritise different things — individual vs. collective, task vs. relationship, directness vs. harmony. When these priorities collide in a team, conflict follows. The root is rarely personal but is often mistaken for it.", id_desc: "Budaya memprioritaskan hal yang berbeda — individu vs. kolektif, tugas vs. hubungan, keterusterangan vs. harmoni. Ketika prioritas-prioritas ini bertabrakan dalam tim, konflik mengikutinya.", nl_desc: "Culturen geven prioriteit aan verschillende dingen — individueel vs. collectief, taak vs. relatie, directheid vs. harmonie. Wanneer deze prioriteiten botsen in een team, volgt conflict." },
  { number: "2", en_title: "Communication misreads", id_title: "Kesalahan membaca komunikasi", nl_title: "Communicatiemissers", en_desc: "Indirect communication is misread as evasion. Silence is misread as agreement. Bluntness is misread as aggression. Most cross-cultural conflicts begin not with bad intent but with misread signals.", id_desc: "Komunikasi tidak langsung disalahartikan sebagai penghindaran. Diam disalahartikan sebagai persetujuan. Keterusterangan disalahartikan sebagai agresi. Sebagian besar konflik lintas budaya tidak dimulai dengan niat buruk tetapi dengan sinyal yang disalahbaca.", nl_desc: "Indirecte communicatie wordt als ontwijking misgelezen. Stilte wordt als instemming misgelezen. Directheid wordt als agressie misgelezen. De meeste interculturele conflicten beginnen niet met kwade intentie maar met misgelezen signalen." },
  { number: "3", en_title: "Role and authority ambiguity", id_title: "Ambiguitas peran dan otoritas", nl_title: "Rol- en gezagsambiguïteit", en_desc: "Cross-cultural teams often lack clarity about who has authority over what, and whose cultural norms should govern team behaviour. This ambiguity breeds resentment. Clarity about structure — agreed upon together — prevents much conflict.", id_desc: "Tim lintas budaya sering kali kekurangan kejelasan tentang siapa yang memiliki otoritas atas apa, dan norma budaya siapa yang harus mengatur perilaku tim. Ambiguitas ini menimbulkan kebencian.", nl_desc: "Interculturele teams missen vaak duidelijkheid over wie gezag heeft over wat, en wiens culturele normen het teamgedrag moeten bepalen. Deze ambiguïteit kweekt wrok." },
  { number: "4", en_title: "Unspoken expectations", id_title: "Harapan yang tidak diucapkan", nl_title: "Onuitgesproken verwachtingen", en_desc: "Every person carries assumptions about how a good team works, how a good leader behaves, and how conflict should be handled. When those assumptions differ and are never surfaced, they collide invisibly — and the resulting tension is blamed on personalities rather than cultural programming.", id_desc: "Setiap orang membawa asumsi tentang bagaimana tim yang baik bekerja, bagaimana pemimpin yang baik berperilaku, dan bagaimana konflik harus ditangani.", nl_desc: "Iedereen draagt aannames mee over hoe een goed team werkt, hoe een goede leider zich gedraagt en hoe conflict moet worden aangepakt. Wanneer die aannames verschillen en nooit worden blootgelegd, botsen ze onzichtbaar." },
];

const tkStyles = [
  { style: "Competing", id_style: "Bersaing", nl_style: "Concurrerend", en_desc: "High assertiveness, low cooperation. Useful in crises but damages relationships over time.", id_desc: "Assertivitas tinggi, kerjasama rendah. Berguna dalam krisis tetapi merusak hubungan dari waktu ke waktu.", nl_desc: "Hoge assertiviteit, lage samenwerking. Nuttig in crises maar schaadt relaties over tijd." },
  { style: "Accommodating", id_style: "Mengalah", nl_style: "Accommoderend", en_desc: "Low assertiveness, high cooperation. Prioritises relationship but can allow problems to fester.", id_desc: "Assertivitas rendah, kerjasama tinggi. Memprioritaskan hubungan tetapi dapat membiarkan masalah membusuk.", nl_desc: "Lage assertiviteit, hoge samenwerking. Geeft prioriteit aan relatie maar kan problemen laten etteren." },
  { style: "Avoiding", id_style: "Menghindari", nl_style: "Vermijdend", en_desc: "Low assertiveness, low cooperation. Sometimes strategic — often just delay.", id_desc: "Assertivitas rendah, kerjasama rendah. Kadang-kadang strategis — sering kali hanya penundaan.", nl_desc: "Lage assertiviteit, lage samenwerking. Soms strategisch — vaak gewoon uitstel." },
  { style: "Collaborating", id_style: "Berkolaborasi", nl_style: "Collaborerend", en_desc: "High assertiveness, high cooperation. The ideal — but requires trust, time, and cultural safety.", id_desc: "Assertivitas tinggi, kerjasama tinggi. Yang ideal — tetapi memerlukan kepercayaan, waktu, dan keamanan budaya.", nl_desc: "Hoge assertiviteit, hoge samenwerking. Het ideaal — maar vereist vertrouwen, tijd en culturele veiligheid." },
  { style: "Compromising", id_style: "Berkompromi", nl_style: "Compromittend", en_desc: "Moderate assertiveness, moderate cooperation. Both parties give something — neither fully wins.", id_desc: "Assertivitas sedang, kerjasama sedang. Kedua pihak memberikan sesuatu — tidak ada yang sepenuhnya menang.", nl_desc: "Matige assertiviteit, matige samenwerking. Beide partijen geven iets — geen van beiden wint volledig." },
];

const resolutionSteps = [
  { number: "1", en: "Pause before acting — name the conflict to yourself privately. What is actually at stake, and is this cultural or personal?", id: "Berhenti sebelum bertindak — sebutkan konflik itu kepada diri sendiri secara pribadi. Apa yang sebenarnya dipertaruhkan, dan apakah ini budaya atau pribadi?", nl: "Pauzeer voor je handelt — benoem het conflict voor jezelf privé. Wat staat er werkelijk op het spel, en is dit cultureel of persoonlijk?" },
  { number: "2", en: "Seek to understand before being understood — listen to their experience of events without defending your own first.", id: "Usahakan memahami sebelum dipahami — dengarkan pengalaman mereka tentang peristiwa tanpa terlebih dahulu mempertahankan Anda sendiri.", nl: "Probeer te begrijpen voor je begrepen wordt — luister naar hun ervaring van gebeurtenissen zonder eerst je eigen te verdedigen." },
  { number: "3", en: "Name what you observed without attributing motive — 'I noticed X' rather than 'You clearly intended Y.'", id: "Sebutkan apa yang Anda amati tanpa mengatribusikan motif — 'Saya perhatikan X' daripada 'Anda jelas bermaksud Y.'", nl: "Benoem wat je hebt waargenomen zonder motief toe te schrijven — 'Ik merkte X op' in plaats van 'Je bedoelde duidelijk Y.'" },
  { number: "4", en: "Agree on what a healthy outcome would look like for both parties — not who is right, but what is good.", id: "Sepakati seperti apa hasil yang sehat bagi kedua belah pihak — bukan siapa yang benar, tetapi apa yang baik.", nl: "Spreek af hoe een gezond resultaat voor beide partijen eruit zou zien — niet wie gelijk heeft, maar wat goed is." },
  { number: "5", en: "Follow up — conflict resolution is not one conversation. Name what you agreed, check back, and honour the other person's courage in engaging.", id: "Tindak lanjut — penyelesaian konflik bukan satu percakapan. Sebutkan apa yang Anda sepakati, periksa kembali, dan hormati keberanian orang lain dalam terlibat.", nl: "Volg op — conflictoplossing is niet één gesprek. Benoem wat je bent overeengekomen, kom terug, en eer de moed van de ander om te engageren." },
];

const reflectionQuestions = [
  { roman: "I", en: "What is your default conflict style? Where did you learn it — culture, family, or experience?", id: "Apa gaya konflik default Anda? Di mana Anda mempelajarinya — budaya, keluarga, atau pengalaman?", nl: "Wat is jouw standaard conflictstijl? Waar heb je het geleerd — cultuur, familie of ervaring?" },
  { roman: "II", en: "Is there a conflict in your team right now that is being attributed to personality but might actually be cultural?", id: "Apakah ada konflik dalam tim Anda saat ini yang dikaitkan dengan kepribadian tetapi mungkin sebenarnya budaya?", nl: "Is er nu een conflict in je team dat aan persoonlijkheid wordt toegeschreven maar eigenlijk cultureel kan zijn?" },
  { roman: "III", en: "How does your culture's view of face and honour affect how conflict gets handled — or avoided — in your team?", id: "Bagaimana pandangan budaya Anda tentang muka dan kehormatan memengaruhi cara konflik ditangani — atau dihindari — dalam tim Anda?", nl: "Hoe beïnvloedt de kijk van je cultuur op gezicht en eer hoe conflict wordt behandeld — of vermeden — in je team?" },
  { roman: "IV", en: "What would Matthew 18:15-17 look like applied to a cross-cultural team conflict?", id: "Seperti apa Matius 18:15-17 diterapkan pada konflik tim lintas budaya?", nl: "Hoe zou Matteüs 18:15-17 eruit zien toegepast op een intercultureel teamconflict?" },
  { roman: "V", en: "When did avoiding conflict cost you more than engaging it would have?", id: "Kapan menghindari konflik membebani Anda lebih dari terlibat di dalamnya?", nl: "Wanneer heeft het vermijden van conflict je meer gekost dan het aangaan ervan zou hebben gedaan?" },
  { roman: "VI", en: "Who do you need to initiate a conflict-resolution conversation with this week? What is the first step?", id: "Dengan siapa Anda perlu memulai percakapan penyelesaian konflik minggu ini? Apa langkah pertamanya?", nl: "Met wie moet je deze week een conflictoplossingsgesprek initiëren? Wat is de eerste stap?" },
];

type Props = { userPathway: string | null; isSaved: boolean };

export default function ConflictResolutionClient({ userPathway, isSaved: initialSaved }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const t = (en: string, id: string, nl: string) => tFn(en, id, nl, lang);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard("conflict-resolution");
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
      <div style={{ background: lightGray, borderBottom: "1px solid oklch(90% 0.01 80)", padding: "10px 24px", display: "flex", gap: 8, justifyContent: "flex-end" }}>
        {(["en", "id", "nl"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "4px 14px", borderRadius: 4, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600, background: lang === l ? navy : "transparent", color: lang === l ? offWhite : bodyText }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: navy, padding: "80px 24px 72px", textAlign: "center" }}>
        <p style={{ color: orange, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          {t("Team Leadership", "Kepemimpinan Tim", "Teamleiderschap")}
        </p>
        <h1 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: offWhite, margin: "0 auto 20px", maxWidth: 760, lineHeight: 1.15 }}>
          {t("Conflict Resolution Across Cultures", "Resolusi Konflik Lintas Budaya", "Conflictoplossing Across Culturen")}
        </h1>
        <p style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "oklch(85% 0.03 80)", maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.6, fontStyle: "italic" }}>
          {t(
            '"Most cross-cultural conflict is not about bad people — it is about unrecognised difference meeting unmet expectation."',
            '"Sebagian besar konflik lintas budaya bukan tentang orang jahat — ini tentang perbedaan yang tidak diakui bertemu harapan yang tidak terpenuhi."',
            '"De meeste interculturele conflicten gaan niet over slechte mensen — ze gaan over onherkend verschil dat onvervulde verwachting ontmoet."'
          )}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={handleSave} disabled={saved || isPending} style={{ padding: "12px 28px", borderRadius: 6, border: "none", cursor: saved ? "default" : "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 700, background: saved ? "oklch(55% 0.08 260)" : orange, color: offWhite }}>
            {saved ? t("Saved", "Tersimpan", "Opgeslagen") : t("Save to Dashboard", "Simpan ke Dasbor", "Opslaan in Dashboard")}
          </button>
          <Link href="/resources" style={{ padding: "12px 28px", borderRadius: 6, border: "1px solid oklch(50% 0.05 260)", fontFamily: "Montserrat, sans-serif", fontSize: 14, fontWeight: 600, color: offWhite, textDecoration: "none" }}>
            {t("All Resources", "Semua Sumber", "Alle Bronnen")}
          </Link>
        </div>
      </div>

      <div style={{ padding: "72px 24px", maxWidth: 760, margin: "0 auto" }}>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, marginBottom: 20 }}>
          {t(
            "Conflict in cross-cultural teams is not exceptional — it is inevitable. Different value systems, communication styles, and expectations will produce friction. The question is not whether conflict will arise but whether you have the tools to navigate it well when it does.",
            "Konflik dalam tim lintas budaya bukan pengecualian — itu tidak terhindarkan. Sistem nilai yang berbeda, gaya komunikasi, dan harapan akan menghasilkan gesekan. Pertanyaannya bukan apakah konflik akan muncul tetapi apakah Anda memiliki alat untuk menavigasinya dengan baik.",
            "Conflict in interculturele teams is niet uitzonderlijk — het is onvermijdelijk. Verschillende waardesystemen, communicatiestijlen en verwachtingen zullen wrijving veroorzaken. De vraag is niet of conflict zal ontstaan maar of je de tools hebt om er goed door te navigeren."
          )}
        </p>
        <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75 }}>
          {t(
            "Understanding the sources of cross-cultural conflict — and the range of styles people bring to resolving it — equips leaders to move from reactive damage control to proactive, wise resolution.",
            "Memahami sumber-sumber konflik lintas budaya — dan berbagai gaya yang dibawa orang untuk menyelesaikannya — membekali pemimpin untuk beralih dari pengendalian kerusakan reaktif ke resolusi yang proaktif dan bijak.",
            "Het begrijpen van de bronnen van intercultureel conflict — en de reeks stijlen die mensen meebrengen om het op te lossen — rust leiders toe om van reactieve schadebeheersing over te stappen naar proactieve, wijze oplossing."
          )}
        </p>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 48, textAlign: "center" }}>
            {t("4 Sources of Cross-Cultural Conflict", "4 Sumber Konflik Lintas Budaya", "4 Bronnen van Intercultureel Conflict")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {conflictSources.map((s) => (
              <div key={s.number} style={{ background: offWhite, borderRadius: 12, padding: "32px 36px", display: "flex", gap: 28, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 52, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 40, flexShrink: 0 }}>{s.number}</div>
                <div>
                  <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 18, fontWeight: 700, color: navy, marginBottom: 10 }}>
                    {lang === "en" ? s.en_title : lang === "id" ? s.id_title : s.nl_title}
                  </h3>
                  <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>
                    {lang === "en" ? s.en_desc : lang === "id" ? s.id_desc : s.nl_desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("Thomas-Kilmann: 5 Conflict Styles", "Thomas-Kilmann: 5 Gaya Konflik", "Thomas-Kilmann: 5 Conflictstijlen")}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {tkStyles.map((s, i) => (
              <div key={i} style={{ background: lightGray, borderRadius: 12, padding: "24px 24px" }}>
                <h3 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 16, fontWeight: 700, color: navy, marginBottom: 8 }}>
                  {lang === "en" ? s.style : lang === "id" ? s.id_style : s.nl_style}
                </h3>
                <p style={{ fontSize: 14, color: bodyText, lineHeight: 1.7, margin: 0 }}>
                  {lang === "en" ? s.en_desc : lang === "id" ? s.id_desc : s.nl_desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: lightGray, padding: "72px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: 28, fontWeight: 800, color: navy, marginBottom: 40, textAlign: "center" }}>
            {t("5 Steps to Resolve Conflict", "5 Langkah Menyelesaikan Konflik", "5 Stappen om Conflict op te Lossen")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {resolutionSteps.map((s) => (
              <div key={s.number} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontSize: 44, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 36, flexShrink: 0 }}>{s.number}</div>
                <p style={{ fontSize: 16, color: bodyText, lineHeight: 1.75, margin: 0, paddingTop: 6 }}>
                  {lang === "en" ? s.en : lang === "id" ? s.id : s.nl}
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
          {t("Browse All Resources", "Jelajahi Semua Sumber", "Bekijk Alle Bronnen")}
        </Link>
      </div>
    </div>
  );
}
