"use client";

import type { ReactNode } from "react";
import { useState, useTransition, useEffect, Fragment } from "react";
import { trackResourceViewed, trackResourceSaved } from "@/lib/ga-events";
import { useLanguage } from "@/lib/LanguageContext";
import { saveResourceToDashboard } from "../actions";
import LangToggle from "@/components/LangToggle";
import SourcesDropdown from "@/components/SourcesDropdown";
import PresentLauncher from "@/components/PresentLauncher";
import OnePagerLauncher from "@/components/OnePagerLauncher";

// ── LANGUAGE ───────────────────────────────────────────────────────────────────

type Lang = "en" | "id";
type T = { en: string; id: string };

const tFn = (en: string, id: string, lang: Lang): string =>
  lang === "id" ? id : en;

// ── RICH TEXT ──────────────────────────────────────────────────────────────────
// **bold**  *italic*  ^n^ = amber superscript  ~~ref~~ = amber bold verse ref

function rich(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\^[^^]+\^|~~[^~]+~~)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("~~") && p.endsWith("~~")) return <span key={i} className="hc-verse">{p.slice(2, -2)}</span>;
    if (p.startsWith("^") && p.endsWith("^") && p.length > 2) return <sup key={i} className="hc-sup">{p.slice(1, -1)}</sup>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

// ── CONTENT ────────────────────────────────────────────────────────────────────

const INTRO: T[] = [
  {
    en: "Every team has conflict. People who work closely together will see things differently, and that is normal. What matters is what the team does with it.",
    id: "Setiap tim pernah mengalami konflik. Orang yang bekerja berdekatan pasti punya cara pandang yang berbeda, dan itu wajar. Yang penting adalah apa yang dilakukan tim dengan perbedaan itu.",
  },
  {
    en: "When a team names a conflict and works through it with respect, it becomes healthy conflict. Healthy conflict does not divide a team. It brings people closer together and helps them move forward as one.",
    id: "Ketika sebuah tim mengungkapkan konflik dan menyelesaikannya dengan saling menghormati, konflik itu menjadi konflik yang sehat. Konflik yang sehat tidak memecah belah tim. Konflik itu mendekatkan orang dan membantu mereka melangkah maju sebagai satu kesatuan.",
  },
  {
    en: "This module explains what healthy conflict is, why conflict often feels unsafe, and how to create a safe place where a team can face it.",
    id: "Modul ini menjelaskan apa itu konflik yang sehat, mengapa konflik sering terasa tidak aman, dan bagaimana menciptakan tempat yang aman agar tim dapat menghadapinya.",
  },
];

const OBJECTIVES: T[] = [
  { en: "Explain the difference between conflict and healthy conflict.", id: "Menjelaskan perbedaan antara konflik dan konflik yang sehat." },
  { en: "Recognise why conflict feels unsafe for people who have been hurt by unhealthy conflict in the past.", id: "Memahami mengapa konflik terasa tidak aman bagi orang yang pernah terluka oleh konflik yang tidak sehat." },
  { en: "Distinguish between giving way and avoiding, using three simple questions.", id: "Membedakan antara mengalah dan menghindar dengan tiga pertanyaan sederhana." },
  { en: "Describe the five rules for healthy conflict and what each one asks of you.", id: "Menjelaskan lima aturan untuk konflik yang sehat dan apa yang diminta oleh setiap aturan dari Anda." },
  { en: "Apply the rules to one conflict you have avoided, by naming it in a safe place this week.", id: "Menerapkan aturan itu pada satu konflik yang selama ini Anda hindari, dengan mengungkapkannya di tempat yang aman minggu ini." },
];

const DEFINITIONS: { src: T; quote: T; focus: T }[] = [
  {
    src: { en: "Merriam-Webster dictionary^1^", id: "Kamus Merriam-Webster^1^" },
    quote: {
      en: "Opposing action of incompatibles (as of divergent ideas, interests, or persons).",
      id: "Tindakan yang saling berlawanan antara hal-hal yang tidak dapat disatukan (misalnya gagasan, kepentingan, atau orang yang berbeda). (terjemahan bebas)",
    },
    focus: { en: "Focus: action. Conflict is something people do.", id: "Fokus: tindakan. Konflik adalah sesuatu yang dilakukan orang." },
  },
  {
    src: { en: "Kenneth Thomas (1992), as commonly paraphrased^2^", id: "Kenneth Thomas (1992), seperti yang umum dikutip secara ringkas^2^" },
    quote: {
      en: "A process that begins when one party perceives that another party has negatively affected, or is about to negatively affect, something that the first party cares about.",
      id: "Sebuah proses yang dimulai ketika satu pihak merasa bahwa pihak lain telah merugikan, atau akan merugikan, sesuatu yang dipedulikan pihak pertama. (terjemahan bebas)",
    },
    focus: { en: "Focus: perception. Conflict starts inside one person.", id: "Fokus: cara pandang. Konflik dimulai di dalam diri satu orang." },
  },
  {
    src: { en: "M. Afzalur Rahim (2002)^3^", id: "M. Afzalur Rahim (2002)^3^" },
    quote: {
      en: "An interactive process manifested in incompatibility, disagreement, or dissonance within or between social entities.",
      id: "Sebuah proses yang melibatkan interaksi dan tampak dalam ketidakcocokan, ketidaksepakatan, atau ketidakselarasan di dalam atau di antara pihak-pihak dalam masyarakat. (terjemahan bebas)",
    },
    focus: { en: "Focus: interaction. Conflict happens between people or groups.", id: "Fokus: interaksi. Konflik terjadi di antara orang atau kelompok." },
  },
];

const WHY_DEF: { title: T; body: T }[] = [
  {
    title: { en: "People who depend on each other", id: "Orang-orang yang saling bergantung" },
    body: {
      en: "In a team, the work connects people. A difference between them affects the work. That is why it cannot be ignored.",
      id: "Dalam sebuah tim, pekerjaan menghubungkan orang-orang. Perbedaan di antara mereka memengaruhi pekerjaan. Karena itu perbedaan itu tidak bisa diabaikan.",
    },
  },
  {
    title: { en: "See their goals, needs or views as opposed", id: "Merasa tujuan, kebutuhan, atau pandangan mereka saling bertentangan" },
    body: {
      en: "Conflict depends on how people see the difference.^2^ It can exist before anyone says a word.",
      id: "Konflik bergantung pada cara orang memandang perbedaan itu.^2^ Konflik bisa sudah ada sebelum ada yang mengucapkan sepatah kata pun.",
    },
  },
  {
    title: { en: "At least one of them feels it", id: "Setidaknya salah satu dari mereka merasakannya" },
    body: {
      en: "Researchers describe a stage called \"felt conflict\", when the difference starts to affect a person's emotions.^4^ Conflict can be one-sided. One person can carry it while the other does not know. It is still conflict, and it still affects the team.",
      id: "Para peneliti menyebut satu tahap sebagai \"konflik yang dirasakan\", yaitu ketika perbedaan mulai memengaruhi perasaan seseorang.^4^ Konflik bisa terjadi sepihak. Satu orang menanggungnya, sementara yang lain tidak tahu. Itu tetap konflik, dan tetap memengaruhi tim.",
    },
  },
];

const GAINS: { title: T; body: T }[] = [
  { title: { en: "Unity", id: "Kesatuan" }, body: { en: "The relationship is still whole. People are on the same side again.", id: "Hubungan tetap utuh. Orang kembali berada di pihak yang sama." } },
  { title: { en: "Clarity", id: "Kejelasan" }, body: { en: "People understand the problem and each other better than before.", id: "Orang memahami masalahnya dan memahami satu sama lain lebih baik daripada sebelumnya." } },
  { title: { en: "Trust", id: "Kepercayaan" }, body: { en: "People know they can disagree and still stay together.", id: "Orang tahu bahwa mereka boleh berbeda pendapat dan tetap bersama." } },
];

const UNSAFE: T[] = [
  {
    en: "Many people have lived through unhealthy conflict. It may have happened in a family, a school, a church or an earlier team. The conflict ended in shouting, blame or silence. A relationship broke. Someone lost a position or a place in the group.",
    id: "Banyak orang pernah mengalami konflik yang tidak sehat. Mungkin terjadi di keluarga, sekolah, gereja, atau tim sebelumnya. Konflik itu berakhir dengan teriakan, saling menyalahkan, atau diam. Sebuah hubungan rusak. Seseorang kehilangan jabatan atau tempatnya di dalam kelompok.",
  },
  {
    en: "People remember this. When a new conflict starts, the old fear comes back. They feel unsafe and afraid, even when the new team is different. So they stay quiet. To them, silence feels safer than speaking.",
    id: "Orang mengingat hal ini. Ketika konflik baru muncul, rasa takut yang lama kembali. Mereka merasa tidak aman dan takut, bahkan ketika tim yang baru berbeda. Maka mereka diam. Bagi mereka, diam terasa lebih aman daripada bicara.",
  },
  {
    en: "Research on teams supports this. Teams learn and grow when members believe it is safe to take risks with each other.^6^ When people think leaders do not welcome disagreement, they hold back their concerns.^7^ Many people hold back even when no one in their current team has punished them for speaking. They follow unspoken rules, such as \"do not embarrass the leader\". The risk is assumed, not experienced.^8^",
    id: "Penelitian tentang tim mendukung hal ini. Tim belajar dan bertumbuh ketika anggotanya yakin bahwa aman untuk mengambil risiko di depan satu sama lain.^6^ Ketika orang mengira pemimpin tidak menyambut perbedaan pendapat, mereka menahan kekhawatiran mereka.^7^ Banyak orang menahan diri, meskipun tidak ada yang pernah menghukum mereka di tim yang sekarang karena berbicara. Mereka mengikuti aturan tak tertulis, seperti \"jangan mempermalukan pemimpin\". Risikonya hanya dibayangkan, bukan dialami.^8^",
  },
  {
    en: "This is why a leader cannot only tell people to speak up. The fear is real, even when the danger is not. People need to see that this place is safe before they will name a conflict.",
    id: "Karena itu, seorang pemimpin tidak cukup hanya menyuruh orang untuk berbicara. Rasa takutnya nyata, meskipun bahayanya tidak. Orang perlu melihat sendiri bahwa tempat ini aman sebelum mereka mau mengungkapkan konflik.",
  },
];

const PILES: T = {
  en: "Conflict that is not named does not disappear. Small conflicts pile up. When emotions run high, they come out together, often over something small. Counsellors use the term \"gunnysacking\" for this: storing complaints in a sack until it bursts.^9^",
  id: "Konflik yang tidak diungkapkan tidak hilang. Konflik-konflik kecil menumpuk. Ketika emosi memuncak, semuanya keluar sekaligus, sering kali karena hal yang sepele. Para konselor menyebutnya \"gunnysacking\": menyimpan keluhan di dalam karung sampai karung itu robek.^9^",
};

const GROWS: T[] = [
  {
    en: "One model, used widely by mediators, describes conflict growing in nine stages.^10^ In the early stages, opinions harden, but people still want both sides to win. In the middle stages, each person wants to win and the other to lose. In the last stages, both sides are willing to lose, as long as the other side loses more. After a certain point, people cannot solve it alone. They need outside help.",
    id: "Satu model yang banyak dipakai para mediator menggambarkan konflik membesar dalam sembilan tahap.^10^ Pada tahap awal, pendapat mulai mengeras, tetapi kedua pihak masih ingin keduanya menang. Pada tahap tengah, masing-masing ingin menang dan ingin pihak lain kalah. Pada tahap akhir, kedua pihak rela rugi, asalkan pihak lain rugi lebih besar. Setelah titik tertentu, orang tidak dapat menyelesaikannya sendiri. Mereka membutuhkan bantuan dari luar.",
  },
  {
    en: "People who have lived through the later stages carry that memory. This is one reason why conflict feels unsafe. Healthy conflict names a difference in the early stages, while both people still want each other to win.",
    id: "Orang yang pernah mengalami tahap-tahap akhir membawa ingatan itu. Inilah salah satu alasan mengapa konflik terasa tidak aman. Konflik yang sehat mengungkapkan perbedaan pada tahap awal, ketika kedua pihak masih ingin satu sama lain menang.",
  },
];

type Block = { kind: "p" | "h4"; text: T } | { kind: "ul"; items: T[] };

type AccItem = { id: string; anchorId?: string; tag: T; title: T; blocks: Block[] };

const DIG_DEEPER: T = { en: "Dig deeper", id: "Pelajari lebih dalam" };

const UNSAFE_ACCORDIONS: AccItem[] = [
  {
    id: "giving-way",
    tag: DIG_DEEPER,
    title: { en: "Giving way is different from avoiding", id: "Mengalah berbeda dari menghindar" },
    blocks: [
      { kind: "p", text: {
        en: "From the outside, giving way and avoiding look the same. In both, a person stays quiet and lets the matter go. Conflict research shows that the reasons behind them are different.^11^",
        id: "Dari luar, mengalah dan menghindar tampak sama. Dalam keduanya, seseorang diam dan membiarkan persoalan berlalu. Penelitian tentang konflik menunjukkan bahwa alasan di baliknya berbeda.^11^",
      } },
      { kind: "p", text: {
        en: "**Giving way** comes from care for the other person. You choose to let the matter go, and it is settled for you. In many cultures, giving way is a sign of maturity and respect. It is a good thing, and it keeps many teams healthy.",
        id: "**Mengalah** lahir dari kepedulian terhadap orang lain. Anda memilih untuk melepaskan persoalan itu, dan bagi Anda persoalan itu selesai. Di banyak budaya, mengalah adalah tanda kedewasaan dan rasa hormat. Itu hal yang baik, dan menjaga banyak tim tetap sehat.",
      } },
      { kind: "p", text: {
        en: "**Avoiding** comes from fear or from wanting to escape. You stay silent, but the matter is still there. It stays with you and adds to the pile.",
        id: "**Menghindar** lahir dari rasa takut atau keinginan untuk lari. Anda diam, tetapi persoalannya masih ada. Persoalan itu tetap tinggal dalam diri Anda dan menambah tumpukan.",
      } },
      { kind: "h4", text: { en: "Three questions to tell them apart", id: "Tiga pertanyaan untuk membedakannya" } },
      { kind: "ul", items: [
        { en: "Was the matter named, at least to yourself and in prayer?", id: "Apakah persoalan itu sudah diungkapkan, setidaknya kepada diri sendiri dan dalam doa?" },
        { en: "Is it finished, with no bad feeling left?", id: "Apakah sudah selesai, tanpa rasa tidak enak yang tersisa?" },
        { en: "Has it stayed away, with no need to bring it back?", id: "Apakah persoalan itu tidak muncul lagi, tanpa perlu diungkit kembali?" },
      ] },
      { kind: "p", text: {
        en: "If the answer to all three is yes, you gave way. If the matter keeps coming back, or the bad feeling stays, it was avoiding. That conflict still needs to be named.",
        id: "Jika jawaban untuk ketiganya ya, Anda mengalah. Jika persoalan itu terus kembali, atau rasa tidak enak itu tetap ada, berarti Anda menghindar. Konflik itu masih perlu diungkapkan.",
      } },
    ],
  },
  {
    id: "face",
    anchorId: "mc-face",
    tag: DIG_DEEPER,
    title: { en: "Conflict, culture and face", id: "Konflik, budaya, dan muka" },
    blocks: [
      { kind: "p", text: {
        en: "\"Face\" is the respect and standing a person has in the eyes of others. In many cultures, direct confrontation in front of others causes loss of face for both people.",
        id: "\"Muka\" adalah kehormatan dan kedudukan seseorang di mata orang lain. Di banyak budaya, menghadapi orang secara langsung di depan orang lain membuat kedua pihak kehilangan muka.",
      } },
      { kind: "p", text: {
        en: "Face-negotiation theory studies how people protect face during conflict.^12^ In cultures that value the group, people often protect the other person's face. When they avoid conflict or give way, it often comes from concern for the other person. It does not come from a lack of care.",
        id: "Teori negosiasi muka (face-negotiation theory) mempelajari bagaimana orang menjaga muka selama konflik.^12^ Dalam budaya yang mengutamakan kelompok, orang sering menjaga muka orang lain. Ketika mereka menghindari konflik atau mengalah, hal itu sering lahir dari kepedulian terhadap orang lain. Bukan karena tidak peduli.",
      } },
      { kind: "p", text: {
        en: "This matters for leaders who work across cultures. A team member who stays quiet in a meeting may be protecting the group. Asking for open debate in front of everyone may feel unsafe to them.",
        id: "Hal ini penting bagi pemimpin yang bekerja lintas budaya. Anggota tim yang diam dalam rapat mungkin sedang menjaga kelompok. Meminta perdebatan terbuka di depan semua orang bisa terasa tidak aman bagi mereka.",
      } },
      { kind: "h4", text: { en: "Indirect naming is still naming", id: "Mengungkapkan secara tidak langsung tetap mengungkapkan" } },
      { kind: "p", text: {
        en: "Naming conflict does not have to be direct. It can happen in a private conversation, through a question, a story, or a trusted third person. The prophet Nathan named David's sin through a story (2 Samuel 12). What matters is that the conflict is named and not left hidden.",
        id: "Mengungkapkan konflik tidak harus dilakukan secara langsung. Bisa lewat percakapan pribadi, lewat pertanyaan, cerita, atau orang ketiga yang dipercaya. Nabi Natan mengungkapkan dosa Daud melalui sebuah cerita (2 Samuel 12). Yang penting, konflik itu diungkapkan dan tidak dibiarkan tersembunyi.",
      } },
    ],
  },
  {
    id: "task-relationship",
    tag: DIG_DEEPER,
    title: { en: "Conflict about the work and conflict about the person", id: "Konflik tentang pekerjaan dan konflik tentang pribadi" },
    blocks: [
      { kind: "p", text: { en: "Researchers separate two kinds of conflict in teams.^13^", id: "Para peneliti membedakan dua jenis konflik dalam tim.^13^" } },
      { kind: "p", text: {
        en: "**Task conflict** is a difference about the work: the plan, the method, or what to do first.",
        id: "**Konflik tugas** adalah perbedaan tentang pekerjaan: rencana, cara kerja, atau apa yang harus didahulukan.",
      } },
      { kind: "p", text: {
        en: "**Relationship conflict** is tension between the people themselves: dislike, irritation or hurt.",
        id: "**Konflik hubungan** adalah ketegangan antara orang-orangnya sendiri: rasa tidak suka, kesal, atau sakit hati.",
      } },
      { kind: "p", text: {
        en: "Relationship conflict harms teams. Research agrees on this.^14,15^ Task conflict is less simple. One large review found that it often harms team performance as well.^14^ A later review of 116 studies found that task conflict can help, for example in decision quality, when it stays separate from relationship conflict.^15^",
        id: "Konflik hubungan merugikan tim. Penelitian sepakat tentang hal ini.^14,15^ Konflik tugas tidak sesederhana itu. Satu tinjauan besar menemukan bahwa konflik tugas pun sering merugikan kinerja tim.^14^ Tinjauan yang lebih baru terhadap 116 penelitian menemukan bahwa konflik tugas dapat membantu, misalnya dalam mutu keputusan, selama konflik itu tetap terpisah dari konflik hubungan.^15^",
      } },
      { kind: "p", text: {
        en: "So conflict does not automatically make a team better. Handled well, it can. The rules later in this module help keep a difference about the work from turning into a conflict between people.",
        id: "Jadi, konflik tidak otomatis membuat tim lebih baik. Jika ditangani dengan baik, bisa. Aturan-aturan di bagian berikutnya membantu agar perbedaan tentang pekerjaan tidak berubah menjadi konflik antarpribadi.",
      } },
    ],
  },
];

const FURTHER_READING: { href: string; title: string; desc: T }[] = [
  {
    href: "https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf",
    title: "Psychological safety and learning behavior in work teams",
    desc: { en: "Amy Edmondson's original study of safety in teams (full paper, PDF).", id: "Penelitian asli Amy Edmondson tentang rasa aman dalam tim (naskah lengkap, PDF)." },
  },
  {
    href: "https://explore.psychsafety.com/n/detert-edmondson-2011/",
    title: "Implicit voice theories",
    desc: { en: "A summary of why people stay silent even when no one has punished them.", id: "Ringkasan tentang mengapa orang tetap diam meskipun tidak ada yang pernah menghukum mereka." },
  },
  {
    href: "https://rework.withgoogle.com/en/guides/understanding-team-effectiveness",
    title: "Understanding team effectiveness",
    desc: {
      en: "In an internal study of its own teams, Google found psychological safety was the most important of five team factors.^16^",
      id: "Dalam studi internal terhadap tim-timnya sendiri, Google menemukan bahwa rasa aman psikologis adalah yang terpenting dari lima faktor tim.^16^",
    },
  },
  {
    href: "https://www.news.cornell.edu/stories/2016/08/how-winning-teams-navigate-conflict-stay-course",
    title: "How winning teams navigate conflict",
    desc: { en: "A short summary of a study of 57 student project teams.", id: "Ringkasan singkat dari penelitian terhadap 57 tim proyek mahasiswa." },
  },
  {
    href: "https://www.beyondintractability.org/artsum/johnson-constructive",
    title: "Constructive controversy",
    desc: { en: "A summary of how groups can disagree in a structured way and reach better decisions.", id: "Ringkasan tentang bagaimana kelompok dapat berbeda pendapat secara teratur dan mencapai keputusan yang lebih baik." },
  },
  {
    href: "https://en.wikipedia.org/wiki/Friedrich_Glasl%27s_model_of_conflict_escalation",
    title: "Glasl's model of conflict escalation",
    desc: { en: "An overview of all nine stages.", id: "Gambaran umum dari kesembilan tahap." },
  },
];

const CONTRAST: { bad: T; good: T }[] = [
  { bad: { en: "Silence means peace", id: "Diam dianggap damai" }, good: { en: "Silence is a warning sign", id: "Diam adalah tanda peringatan" } },
  { bad: { en: "The problem stays hidden", id: "Masalah tetap tersembunyi" }, good: { en: "The problem is named early", id: "Masalah diungkapkan sejak dini" } },
  { bad: { en: "People talk about each other", id: "Orang membicarakan satu sama lain di belakang" }, good: { en: "People talk to each other", id: "Orang berbicara langsung satu sama lain" } },
  { bad: { en: "People adjust in private, before talking", id: "Orang menyesuaikan diri sendiri-sendiri, sebelum bicara" }, good: { en: "People adjust together, after talking", id: "Orang menyesuaikan diri bersama-sama, setelah bicara" } },
  { bad: { en: "Small problems pile up", id: "Masalah kecil menumpuk" }, good: { en: "Small problems are handled while they are small", id: "Masalah kecil ditangani selagi masih kecil" } },
  { bad: { en: "Trust slowly breaks down", id: "Kepercayaan perlahan runtuh" }, good: { en: "Trust grows", id: "Kepercayaan bertumbuh" } },
  { bad: { en: "Unity on the surface", id: "Kesatuan di permukaan saja" }, good: { en: "Unity that holds under pressure", id: "Kesatuan yang bertahan di bawah tekanan" } },
];

const SAFE_STEPS: { title: T; body: T }[] = [
  {
    title: { en: "Say that conflict is normal.", id: "Katakan bahwa konflik itu wajar." },
    body: { en: "Every team has it. Saying so removes the fear that conflict means the team is failing.", id: "Setiap tim mengalaminya. Dengan mengatakannya, rasa takut bahwa konflik berarti tim gagal akan hilang." },
  },
  {
    title: { en: "Explain the rules before the conversation starts.", id: "Jelaskan aturannya sebelum percakapan dimulai." },
    body: { en: "People need to know how a conflict will be handled before they risk naming one.", id: "Orang perlu tahu bagaimana konflik akan ditangani sebelum mereka berani mengungkapkannya." },
  },
  {
    title: { en: "Choose the time and the place.", id: "Pilih waktu dan tempatnya." },
    body: { en: "Set a time, find a calm and private setting, and when needed, invite a neutral third person.", id: "Tentukan waktu, cari suasana yang tenang dan pribadi, dan jika perlu, undang orang ketiga yang netral." },
  },
];

const RULES: { title: T; body: T }[] = [
  {
    title: { en: "Trust is a decision, not a feeling.", id: "Percaya adalah keputusan, bukan perasaan." },
    body: {
      en: "Come to the conversation ready to trust. You may not feel trust at this moment, and that is all right. You decide to trust the other person anyway. You do this because you want to move forward with this person. Where trust is low, people hear a disagreement about the work as a personal attack.^19^ Choosing to trust keeps the conversation about the problem.",
      id: "Datanglah ke percakapan itu dengan siap untuk percaya. Mungkin saat ini Anda tidak merasakan kepercayaan, dan itu tidak apa-apa. Anda tetap memutuskan untuk memercayai orang itu. Anda melakukannya karena Anda ingin melangkah maju bersamanya. Ketika kepercayaan rendah, orang menganggap perbedaan tentang pekerjaan sebagai serangan pribadi.^19^ Memilih untuk percaya menjaga percakapan tetap tentang masalahnya.",
    },
  },
  {
    title: { en: "There is no winner and no loser.", id: "Tidak ada pemenang dan tidak ada yang kalah." },
    body: {
      en: "The goal is not to win the argument. The goal is a better result for the team. If one person loses, the whole team loses something.",
      id: "Tujuannya bukan memenangkan perdebatan. Tujuannya adalah hasil yang lebih baik bagi tim. Jika satu orang kalah, seluruh tim kehilangan sesuatu.",
    },
  },
  {
    title: { en: "Talk about the problem, not the person.", id: "Bicarakan masalahnya, bukan orangnya." },
    body: {
      en: "Describe what happened and how it affects the work. Do not describe the other person's character. People can solve a problem together. A judgement about a person can only be defended.",
      id: "Ceritakan apa yang terjadi dan bagaimana hal itu memengaruhi pekerjaan. Jangan menilai watak orang lain. Orang bisa memecahkan masalah bersama-sama. Penilaian terhadap pribadi seseorang hanya akan dibela mati-matian.",
    },
  },
  {
    title: { en: "Listen until you can repeat the other person's view.", id: "Dengarkan sampai Anda bisa mengulang pandangan orang lain." },
    body: {
      en: "Before you answer, say back what you heard. Keep going until the other person agrees that you understood. You do not have to agree with them. You do have to understand them first.",
      id: "Sebelum menjawab, ulangi apa yang Anda dengar. Teruskan sampai orang itu mengatakan bahwa Anda sudah memahaminya. Anda tidak harus setuju dengannya. Tetapi Anda harus memahaminya lebih dahulu.",
    },
  },
  {
    title: { en: "Talk first, then adjust.", id: "Bicara dulu, baru menyesuaikan diri." },
    body: {
      en: "Do not quietly change your behaviour to get around the problem. Adjusting in silence is a form of avoiding. Talk first. Then both people adjust, based on what you agreed together.",
      id: "Jangan diam-diam mengubah perilaku Anda untuk menyiasati masalah. Menyesuaikan diri tanpa bicara adalah salah satu bentuk menghindar. Bicaralah lebih dahulu. Setelah itu kedua pihak menyesuaikan diri berdasarkan apa yang disepakati bersama.",
    },
  },
];

const NOT_LEADER: AccItem = {
  id: "not-leader",
  tag: { en: "If you are not the leader", id: "Jika Anda bukan pemimpin" },
  title: { en: "You can still name a conflict", id: "Anda tetap dapat mengungkapkan konflik" },
  blocks: [
    { kind: "p", text: {
      en: "You do not need a title to name a conflict. Start by raising it privately with the other person (Matthew 18:15). Use the same five rules, even if the other person has never heard of them.",
      id: "Anda tidak perlu jabatan untuk mengungkapkan konflik. Mulailah dengan membicarakannya secara pribadi dengan orang yang bersangkutan (Matius 18:15). Gunakan kelima aturan yang sama, meskipun orang itu belum pernah mendengarnya.",
    } },
    { kind: "p", text: {
      en: "If a private conversation does not feel safe, ask a trusted third person to help. You can also ask your leader to create a safe place for the conversation.",
      id: "Jika percakapan pribadi terasa tidak aman, mintalah bantuan orang ketiga yang Anda percaya. Anda juga dapat meminta pemimpin Anda menciptakan tempat yang aman untuk percakapan itu.",
    } },
    { kind: "p", text: {
      en: "If you are afraid to speak, ask yourself where the fear comes from. Is it this team, or an earlier experience? The answer can help you decide on the next step.",
      id: "Jika Anda takut berbicara, tanyakan pada diri sendiri dari mana rasa takut itu berasal. Dari tim ini, atau dari pengalaman sebelumnya? Jawabannya dapat membantu Anda menentukan langkah berikutnya.",
    } },
  ],
};

const STORY: T[] = [
  {
    en: "Two leaders worked together in a children's home in Southeast Asia. One came from abroad. The other came from the local community. Both were committed to the work. Both had a clear vision and strong ideas about how the home should run.",
    id: "Dua pemimpin bekerja bersama di sebuah panti asuhan di Asia Tenggara. Yang satu datang dari luar negeri. Yang lain berasal dari masyarakat setempat. Keduanya berkomitmen pada pekerjaan itu. Keduanya punya visi yang jelas dan gagasan yang kuat tentang bagaimana panti itu seharusnya dijalankan.",
  },
  {
    en: "From the first weeks, both of them knew that they saw things differently. They worked in different ways. They made decisions in different ways. They had different ideas about how to care for the children. None of this was hidden. They could both see the gap clearly.",
    id: "Sejak minggu-minggu pertama, keduanya tahu bahwa mereka memandang banyak hal secara berbeda. Cara kerja mereka berbeda. Cara mengambil keputusan mereka berbeda. Gagasan mereka tentang cara merawat anak-anak pun berbeda. Semua itu tidak disembunyikan. Keduanya melihat jarak di antara mereka dengan jelas.",
  },
  { en: "But they could not talk about it.", id: "Tetapi mereka tidak bisa membicarakannya." },
  {
    en: "The reason was not anger. They respected each other too much to say it. That respect stopped them from speaking. Neither wanted to damage what they had built. Neither wanted to make the other person uncomfortable. So they stayed careful and polite, and the gap stayed open.",
    id: "Penyebabnya bukan amarah. Mereka terlalu saling menghormati untuk mengatakannya. Rasa hormat itu menahan mereka untuk berbicara. Tidak ada yang mau merusak apa yang telah mereka bangun. Tidak ada yang mau membuat yang lain tidak nyaman. Jadi mereka tetap hati-hati dan sopan, dan jarak itu tetap terbuka.",
  },
];

const STORY_MOMENT: T = {
  en: "One day, a third person who knew them both sat down with them. He told them he wanted to bring them to a table where conflict was going to happen. He thought they needed it, and he thought it was safe.",
  id: "Suatu hari, seseorang yang mengenal keduanya duduk bersama mereka. Ia berkata bahwa ia ingin membawa mereka ke sebuah meja tempat konflik akan terjadi. Menurutnya mereka membutuhkannya, dan menurutnya tempat itu aman.",
};

const STORY_AFTER: T[] = [
  {
    en: "He set a few ground rules. It was not a long list. It was enough to explain what kind of conversation this would be.",
    id: "Ia menetapkan beberapa aturan dasar. Daftarnya tidak panjang. Cukup untuk menjelaskan percakapan macam apa ini nantinya.",
  },
  {
    en: "Then both leaders talked honestly. It was not comfortable. There were moments of real tension. There were also moments when one of them said something that the other really heard. Views that each had held for a long time began to soften.",
    id: "Lalu kedua pemimpin itu berbicara dengan jujur. Rasanya tidak nyaman. Ada saat-saat yang sungguh tegang. Ada juga saat ketika salah satu dari mereka mengatakan sesuatu yang benar-benar didengar oleh yang lain. Pandangan yang lama dipegang masing-masing mulai melunak.",
  },
  {
    en: "They did not solve everything. Some differences remained. But they left with something they did not have before: a way to talk with each other about the things that mattered. Their unity grew from that table. It grew because the conflict was finally allowed to be named.",
    id: "Tidak semuanya terselesaikan. Beberapa perbedaan tetap ada. Tetapi mereka pulang dengan sesuatu yang belum mereka miliki sebelumnya: cara untuk berbicara satu sama lain tentang hal-hal yang penting. Kesatuan mereka bertumbuh dari meja itu. Kesatuan itu bertumbuh karena konflik akhirnya boleh diungkapkan.",
  },
];

const LESSONS: T[] = [
  { en: "Respect can lead to silence. Silence did not protect their unity. It kept the gap open.", id: "Rasa hormat bisa berujung pada diam. Diam tidak melindungi kesatuan mereka. Diam justru membiarkan jarak itu tetap terbuka." },
  { en: "A third person created a safe place. Both leaders knew the conversation would be hard, and both knew it was safe.", id: "Seorang pihak ketiga menciptakan tempat yang aman. Kedua pemimpin tahu percakapan itu akan sulit, dan keduanya tahu tempat itu aman." },
  { en: "The ground rules came first, before anyone spoke.", id: "Aturan dasar ditetapkan lebih dahulu, sebelum ada yang berbicara." },
  { en: "Not everything was solved. Unity, clarity and trust still grew.", id: "Tidak semuanya terselesaikan. Namun kesatuan, kejelasan, dan kepercayaan tetap bertumbuh." },
];

const FAITH: T[] = [
  {
    en: "Paul tells us to work to keep the unity of the Spirit (~~Ephesians 4:3~~). Unity does not keep itself.",
    id: "Paulus mengajak kita berusaha memelihara kesatuan Roh (~~Efesus 4:3~~). Kesatuan tidak menjaga dirinya sendiri.",
  },
  {
    en: "He also writes: \"Be angry and do not sin; do not let the sun go down on your anger, and give no opportunity to the devil\" (~~Ephesians 4:26-27, ESV~~). Anger that is left alone gives the enemy room.",
    id: "Ia juga menulis: \"Apabila kamu menjadi marah, janganlah kamu berbuat dosa: janganlah matahari terbenam, sebelum padam amarahmu, dan janganlah beri kesempatan kepada Iblis\" (~~Efesus 4:26-27, TB~~). Kemarahan yang dibiarkan memberi ruang bagi musuh.",
  },
  {
    en: "Paul's warning is simple. Anger that is held in and never dealt with gives the enemy a foothold. The problem is not the quiet itself. It is what we leave unresolved. Conflict that is not named does not go away. It grows.",
    id: "Peringatan Paulus sederhana. Amarah yang dipendam dan tidak pernah diselesaikan memberi kesempatan kepada Iblis. Masalahnya bukan pada diam itu sendiri, tetapi pada apa yang kita biarkan tidak terselesaikan. Konflik yang tidak diungkapkan tidak hilang. Konflik itu terus membesar.",
  },
  {
    en: "Not all conflict comes from him. James says it starts in our own desires (~~James 4:1~~). We are responsible for our part.",
    id: "Tidak semua konflik berasal dari dia. Yakobus mengatakan bahwa konflik bermula dari keinginan kita sendiri (~~Yakobus 4:1~~). Kita bertanggung jawab atas bagian kita.",
  },
  {
    en: "God also tells his people not to hate a brother in the heart, but to speak to him honestly (~~Leviticus 19:17~~).",
    id: "Allah juga memerintahkan umat-Nya untuk tidak membenci saudara di dalam hati, tetapi menegurnya dengan jujur (~~Imamat 19:17~~).",
  },
  {
    en: "This is for differences between people who are safe with each other. If you are being harmed, bullied or abused, you do not have to face that person alone. Tell someone with authority to act, or a trusted person outside the situation.",
    id: "Ini berlaku untuk perbedaan di antara orang-orang yang aman satu sama lain. Jika Anda disakiti, dirundung, atau dianiaya, Anda tidak harus menghadapi orang itu sendirian. Beri tahu seseorang yang berwenang untuk bertindak, atau orang tepercaya di luar situasi itu.",
  },
];

const FAITH_CLOSE: T = {
  en: "Avoiding conflict is not peace. Healthy conflict names the problem early, in love, and directly with the person involved, in a way that honours them. That is how a team keeps its unity.",
  id: "Menghindari konflik bukanlah damai. Konflik yang sehat mengungkapkan masalah sejak dini, dengan kasih, dan langsung kepada orang yang bersangkutan, dengan cara yang menghormatinya. Dengan cara itulah sebuah tim menjaga kesatuannya.",
};

const REFLECT: T = {
  en: "Is there something unresolved in your team that is safe and right to name? What would it look like to name it in love this week?",
  id: "Apakah ada sesuatu yang belum terselesaikan dalam tim Anda yang aman dan tepat untuk diungkapkan? Seperti apa jadinya jika Anda mengungkapkannya dengan kasih minggu ini?",
};

const TAKEAWAYS: T[] = [
  {
    en: "Conflict is when people who depend on each other see their goals, needs or views as opposed, and at least one of them feels it.",
    id: "Konflik adalah ketika orang-orang yang saling bergantung merasa tujuan, kebutuhan, atau pandangan mereka saling bertentangan, dan setidaknya salah satu dari mereka merasakannya.",
  },
  {
    en: "Healthy conflict is conflict faced openly and with respect. Through it, people gain unity, clarity and trust, and continue together in unity.",
    id: "Konflik yang sehat adalah konflik yang dihadapi secara terbuka dan dengan saling menghormati. Melalui konflik itu, orang memperoleh kesatuan, kejelasan, dan kepercayaan, lalu melangkah bersama dalam kesatuan.",
  },
  {
    en: "Conflict feels unsafe for many people because of unhealthy conflict in the past. The fear is real, even when the danger is not.",
    id: "Konflik terasa tidak aman bagi banyak orang karena konflik yang tidak sehat di masa lalu. Rasa takutnya nyata, meskipun bahayanya tidak.",
  },
  {
    en: "Unnamed conflict does not go away. It piles up and comes out when emotions run high.",
    id: "Konflik yang tidak diungkapkan tidak hilang. Konflik itu menumpuk dan keluar ketika emosi memuncak.",
  },
  {
    en: "The leader creates a safe place and explains the rules before the conversation starts.",
    id: "Pemimpin menciptakan tempat yang aman dan menjelaskan aturannya sebelum percakapan dimulai.",
  },
  {
    en: "Trust is a decision, not a feeling. Choose to trust because you want to move forward together.",
    id: "Percaya adalah keputusan, bukan perasaan. Pilihlah untuk percaya karena Anda ingin melangkah maju bersama.",
  },
];

const SOURCES: string[] = [
  "Merriam-Webster. Conflict. merriam-webster.com/dictionary/conflict",
  "Thomas, K. W. (1992). Conflict and negotiation processes in organizations. In M. D. Dunnette and L. M. Hough (Eds.), Handbook of Industrial and Organizational Psychology, Vol. 3. Definition as commonly paraphrased.",
  "Rahim, M. A. (2002). Toward a theory of managing organizational conflict. International Journal of Conflict Management, 13(3), 206-235. https://www.emeraldinsight.com/doi/abs/10.1108/eb022874",
  "Pondy, L. R. (1967). Organizational conflict: Concepts and models. Administrative Science Quarterly, 12(2). https://public.websites.umich.edu/~lroot/ConflictMgtConceptMap/Pondy-Organizational-Conflict-1967.pdf",
  "Johnson, D. W., and Johnson, R. T. Constructive controversy. Summary at Beyond Intractability. Evidence comes mainly from education settings. https://www.beyondintractability.org/artsum/johnson-constructive",
  "Edmondson, A. C. (1999). Psychological safety and learning behavior in work teams. Administrative Science Quarterly, 44(2), 350-383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf",
  "Morrison, E. W., and Milliken, F. J. (2000). Organizational silence. Academy of Management Review, 25(4), 706-725. https://explore.psychsafety.com/n/morrison-milliken-2000/",
  "Detert, J. R., and Edmondson, A. C. (2011). Implicit voice theories. Academy of Management Journal, 54(3), 461-488. https://explore.psychsafety.com/n/detert-edmondson-2011/",
  "Bach, G. R., and Wyden, P. (1968). The Intimate Enemy. Practitioner term, not a tested research finding. https://en.wikipedia.org/wiki/Gunnysacking",
  "Glasl, F. (1982). Model of conflict escalation. Practitioner model used in mediation. https://en.wikipedia.org/wiki/Friedrich_Glasl%27s_model_of_conflict_escalation",
  "De Dreu, C. K. W., Evers, A., Beersma, B., Kluwer, E. S., and Nauta, A. (2001). A theory-based measure of conflict management strategies in the workplace. Journal of Organizational Behavior, 22(6), 645-668. https://emerald.com/insight/content/doi/10.1108/eb022817/full/html",
  "Oetzel, J. G., and Ting-Toomey, S. (2003). Face concerns in interpersonal conflict. Communication Research, 30(6), 599-624. https://www.ffri.hr/~ibrdar/komunikacija/seminari/Oetzel,%202003%20-%20Interpersonal%20conflict%20and%20face%20concerns.pdf",
  "Jehn, K. A. (1995). A multimethod examination of the benefits and detriments of intragroup conflict. Administrative Science Quarterly, 40, 256-282. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Negotiation_and_Conflict_Management/Jehn-ASQ-1995.pdf",
  "De Dreu, C. K. W., and Weingart, L. R. (2003). Task versus relationship conflict, team performance, and team member satisfaction. Journal of Applied Psychology, 88(4), 741-749. https://pubmed.ncbi.nlm.nih.gov/12940412/",
  "De Wit, F. R. C., Greer, L. L., and Jehn, K. A. (2012). The paradox of intragroup conflict: A meta-analysis. Journal of Applied Psychology, 97(2), 360-390. https://repub.eur.nl/pub/37902",
  "Google re:Work. Understanding team effectiveness (Project Aristotle). Internal company study, not peer-reviewed. https://rework.withgoogle.com/en/guides/understanding-team-effectiveness",
  "Behfar, K. J., Peterson, R. S., Mannix, E. A., and Trochim, W. M. K. (2008). The critical role of conflict resolution in teams. Journal of Applied Psychology, 93(1), 170-188. https://www.news.cornell.edu/stories/2016/08/how-winning-teams-navigate-conflict-stay-course",
  "Edmondson, A. C. (2018). The Fearless Organization. Wiley.",
  "Simons, T. L., and Peterson, R. S. (2000). Task conflict and relationship conflict in top management teams: The pivotal role of intragroup trust. Journal of Applied Psychology, 85(1), 102-111. https://randallspeterson.com/2000/06/17/task-conflict-and-relationship-conflict-in-top-management-teams-the-pivotal-role-of-intragroup-trust/",
];

// ── STYLES ─────────────────────────────────────────────────────────────────────

const CSS = `
.hc{--navy:oklch(22% 0.10 260);--navy-deep:oklch(18% 0.10 260);--amber:oklch(65% 0.15 45);--off:oklch(96% 0.005 80);--light:oklch(95% 0.008 80);--body:oklch(38% 0.05 260);--sub:oklch(52% 0.008 260);--muted:oklch(48% 0.04 260);--dim-navy:oklch(76% 0.03 80);--light-navy:oklch(88% 0.02 80);--card:oklch(99% 0.003 80);--line:oklch(84% 0.01 260);--callout-bg:oklch(97% 0.010 50);--callout-border:oklch(88% 0.030 50);--serif:var(--font-cormorant),'Cormorant Garamond',Georgia,serif;font-family:var(--font-montserrat),Montserrat,sans-serif;background:var(--off);color:var(--body);min-height:100vh}
.hc *{box-sizing:border-box}
.hc-wrap{max-width:720px;margin:0 auto;padding:0 16px}
.hc-sec{padding:clamp(56px,8vw,80px) 0}
.hc-a{background:var(--off)}
.hc-b{background:var(--light)}
.hc p{font-size:15px;line-height:1.85;margin:0 0 18px}
.hc-eyebrow{font-size:11px!important;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--amber);margin:0 0 12px!important;line-height:1.4!important}
.hc h2{font-family:var(--serif);font-weight:600;font-size:clamp(26px,3.5vw,38px);line-height:1.15;color:var(--navy);margin:0 0 20px}
.hc h3{font-family:var(--serif);font-weight:600;font-size:clamp(22px,2.8vw,28px);line-height:1.2;color:var(--navy);margin:36px 0 10px}
.hc h4{font-weight:700;font-size:14px;color:var(--navy);margin:20px 0 8px}
.hc-sup{font-size:.68em;font-weight:700;color:var(--amber);line-height:0;margin-left:1px}
.hc-verse{color:var(--amber);font-weight:700}
.hc-lede{font-size:clamp(15px,1.6vw,17px)!important}
/* hero */
.hc-hero{position:relative;overflow:hidden;background:var(--navy);padding:clamp(72px,10vw,96px) 0 clamp(64px,9vw,88px)}
.hc-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:.22;mix-blend-mode:luminosity;pointer-events:none}
.hc-hero .hc-wrap{position:relative;max-width:760px}
.hc-hero h1{font-family:var(--serif);font-weight:600;font-size:clamp(40px,6vw,72px);line-height:1.08;color:var(--off);margin:0 0 20px}
.hc-hero .hc-subline{font-family:var(--serif);font-style:italic;font-size:clamp(18px,2.2vw,23px);color:oklch(82% 0.025 80);line-height:1.6;max-width:600px;margin:0 0 32px}
.hc-save{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:10px 24px;border:none;border-radius:4px;background:var(--amber);color:var(--off);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}
.hc-save[aria-pressed="true"]{background:oklch(35% 0.05 260);cursor:default}
.hc-save svg{width:18px;height:18px}
.hc-save:focus-visible,.hc-acc-btn:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
/* objectives */
.hc-obj{background:var(--navy);padding:clamp(40px,6vw,56px) 0}
.hc-obj ul{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.hc-obj li{display:flex;gap:14px;align-items:flex-start;color:var(--dim-navy);font-size:14px;font-weight:500;line-height:1.7}
.hc-obj li::before{content:"";flex:0 0 3px;height:20px;background:var(--amber);margin-top:3px}
/* definitions */
.hc-defs{display:grid;gap:16px;margin:24px 0 32px}
.hc-def{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:22px 24px}
.hc-def .hc-src{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.hc-def blockquote{font-family:var(--serif);font-size:21px;line-height:1.45;color:var(--navy);margin:0 0 10px}
.hc-def .hc-focus{font-size:13px!important;color:var(--muted);margin:0!important;line-height:1.6!important}
.hc-ours{background:var(--navy);border-radius:8px;padding:clamp(24px,4vw,36px);margin:0 0 8px}
.hc-ours .hc-term{font-size:11px!important;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--amber);margin:0 0 8px!important}
.hc-ours .hc-def-text{font-family:var(--serif);font-size:clamp(22px,3vw,27px)!important;line-height:1.4!important;color:var(--light-navy);margin:0 0 24px!important}
.hc-ours .hc-def-text:last-child{margin-bottom:0!important}
.hc-num-list{list-style:none;margin:18px 0 0;padding:0;display:grid;gap:18px}
.hc-num-list li{display:flex;gap:16px;align-items:flex-start;font-size:15px;line-height:1.8}
.hc-num{flex:0 0 32px;height:32px;border-radius:50%;background:var(--navy);color:var(--off);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}
.hc-num-list strong{display:block;color:var(--navy);font-weight:700;margin-bottom:2px}
.hc-gain{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:18px 0}
.hc-gain>div{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:18px}
.hc-gain strong{display:block;font-family:var(--serif);font-size:22px;color:var(--navy);margin-bottom:6px}
.hc-gain span{font-size:14px;line-height:1.7}
.hc-callout{background:var(--callout-bg);border:1px solid var(--callout-border);border-radius:6px;padding:18px 22px;margin-top:24px}
.hc-callout p{margin:0!important}
.hc-callout strong{color:var(--navy)}
/* accordion */
.hc-acc{margin-top:32px;border-top:1px solid var(--line)}
.hc-acc-item{border-bottom:1px solid var(--line)}
.hc-acc-btn{width:100%;min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;background:none;border:none;cursor:pointer;text-align:left;font-family:inherit;font-size:15px;font-weight:600;color:var(--navy)}
.hc-acc-lead{display:flex;flex-direction:column;gap:4px}
.hc-acc-tag{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--amber)}
.hc-chev{flex:0 0 20px;width:20px;height:20px;color:var(--amber);transition:transform .3s}
.hc-acc-btn[aria-expanded="true"] .hc-chev{transform:rotate(180deg)}
.hc-acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s}
.hc-acc-panel.open{grid-template-rows:1fr}
.hc-acc-panel>div{overflow:hidden}
.hc-acc-inner{padding:0 0 22px}
.hc-acc-inner ul{margin:0 0 18px;padding-left:20px;font-size:15px;line-height:1.8}
.hc-acc-inner li{margin-bottom:6px}
.hc-reading{list-style:none;padding:0!important}
.hc-reading li{margin-bottom:14px!important}
.hc-reading a{color:var(--navy);font-weight:700;text-decoration:underline;text-decoration-color:var(--amber);text-underline-offset:3px}
/* visual */
.hcv{position:relative;container-type:inline-size}
.hcv img{width:100%;height:auto;display:block;border-radius:0 0 8px 8px}
.hcv .hcv-k{position:absolute;transform:translate(-50%,-50%);font-family:var(--font-montserrat),Montserrat,sans-serif;font-weight:700;font-size:clamp(10px,2.1cqw,16px);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;color:oklch(45% 0.13 258)}
.hcv .hcv-o{position:relative;z-index:1;background:#fefefe;border-radius:8px 8px 0 0;padding-top:1.4em;display:flex;flex-direction:column;align-items:center;gap:.2em;margin-bottom:-2.6cqw;font-family:var(--font-montserrat),Montserrat,sans-serif;font-weight:700;font-size:clamp(11px,2.3cqw,18px);letter-spacing:.08em;text-transform:uppercase;line-height:1.1;color:oklch(60% 0.17 45)}
.hc-caption{font-size:13px;color:var(--muted);margin-top:10px;line-height:1.6}
/* contrast */
.hc-contrast{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--card)}
.hc-contrast .hc-head{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:14px 18px;background:oklch(93% 0.008 80);color:var(--muted)}
.hc-contrast .hc-head.good{background:var(--navy);color:var(--amber)}
.hc-contrast .hc-cell{font-size:14px;line-height:1.6;padding:14px 18px;border-top:1px solid var(--line)}
.hc-contrast .hc-cell.good{font-weight:500;color:var(--navy);border-left:1px solid var(--line)}
.hc-cell-label{display:none}
/* rules */
.hc-rules{list-style:none;margin:24px 0 0;padding:0;display:grid;gap:26px}
.hc-rules li{display:grid;grid-template-columns:32px 1fr;gap:16px;align-items:start}
.hc-rule-main{font-weight:700!important;font-size:16px!important;color:var(--navy);margin:4px 0 6px!important;line-height:1.5!important}
.hc-note{font-size:13px!important;color:var(--sub);margin-top:24px!important;line-height:1.7!important}
/* story */
.hc-moment{font-family:var(--serif);font-style:italic;font-size:clamp(20px,2.4vw,24px)!important;line-height:1.5!important;color:var(--navy);border-left:none;margin:28px 0!important}
.hc-lessons{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:clamp(20px,3vw,28px);margin-top:28px}
.hc-lessons h3{margin-top:0!important}
.hc-lessons ul{margin:0;padding-left:20px;font-size:15px;line-height:1.8}
.hc-lessons li{margin-bottom:6px}
/* faith */
.hc-faith{background:var(--navy)}
.hc-faith h2{color:var(--off);font-size:clamp(22px,2.8vw,32px)}
.hc-faith p{color:var(--light-navy)}
.hc-faith .hc-faith-close{color:var(--off);font-weight:600}
.hc-reflect{background:var(--off);border-radius:8px;padding:clamp(20px,3vw,28px);margin-top:28px}
.hc-reflect .hc-reflect-text{font-family:var(--serif);font-size:22px!important;line-height:1.45!important;color:var(--navy);margin:0!important}
/* takeaways */
.hc-take{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.hc-take li{display:flex;gap:16px;align-items:flex-start;background:var(--off);border-radius:8px;padding:16px 18px;font-size:15px;line-height:1.75;color:var(--navy)}
@media (max-width:600px){
  .hc-gain{grid-template-columns:1fr}
  .hc-contrast{grid-template-columns:1fr}
  .hc-contrast .hc-head{display:none}
  .hc-contrast .hc-cell.good{border-left:none;border-top:none;padding-top:0;padding-bottom:18px}
  .hc-contrast .hc-cell.bad{padding-bottom:8px}
  .hc-cell-label{display:block;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;color:var(--muted)}
  .hc-cell.good .hc-cell-label{color:var(--amber)}
}
@media (prefers-reduced-motion:reduce){
  .hc-acc-panel,.hc-chev{transition:none}
}
`;

// ── ACCORDION ──────────────────────────────────────────────────────────────────

function Accordion({ items, lang, open, onToggle, extra }: {
  items: AccItem[];
  lang: Lang;
  open: Record<string, boolean>;
  onToggle: (id: string) => void;
  extra?: { item: AccItem; content: ReactNode };
}) {
  const all = extra ? [...items, extra.item] : items;
  return (
    <div className="hc-acc">
      {all.map((item) => {
        const isOpen = !!open[item.id];
        const panelId = `hc-panel-${item.id}`;
        const btnId = `hc-btn-${item.id}`;
        const custom = extra && item.id === extra.item.id ? extra.content : null;
        return (
          <div className="hc-acc-item" key={item.id} id={item.anchorId}>
            <button
              id={btnId}
              type="button"
              className="hc-acc-btn"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(item.id)}
            >
              <span className="hc-acc-lead">
                <span className="hc-acc-tag">{item.tag[lang]}</span>
                {item.title[lang]}
              </span>
              <svg className="hc-chev" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <div id={panelId} role="region" aria-labelledby={btnId} className={`hc-acc-panel${isOpen ? " open" : ""}`}>
              <div>
                <div className="hc-acc-inner">
                  {custom ?? item.blocks.map((b, i) => {
                    if (b.kind === "ul") {
                      return <ul key={i}>{b.items.map((it, j) => <li key={j}>{rich(it[lang])}</li>)}</ul>;
                    }
                    if (b.kind === "h4") return <h4 key={i}>{b.text[lang]}</h4>;
                    return <p key={i}>{rich(b.text[lang])}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────

type Props = { userId: string | null; isSaved: boolean; signupBanner?: ReactNode };

export default function HealthyConflictClient({ isSaved: initialSaved, signupBanner }: Props) {
  const { lang: ctxLang } = useLanguage();
  const lang = (ctxLang === "id" ? "id" : "en") as Lang;

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const t = (en: string, id: string) => tFn(en, id, lang);

  useEffect(() => {
    trackResourceViewed("healthy-conflict", "cross-cultural-leadership");
  }, []);

  function handleSave() {
    if (saved || isPending) return;
    startTransition(async () => {
      const res = await saveResourceToDashboard("healthy-conflict");
      if (res?.error === "Not authenticated") {
        window.location.href = "/signup";
        return;
      }
      if (res?.error) return;
      setSaved(true);
      trackResourceSaved("healthy-conflict", true);
    });
  }

  function toggle(id: string) {
    setOpen((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) {
        window.gtag?.("event", "concept_card_opened", { resource: "healthy-conflict", card: id });
      }
      return next;
    });
  }

  const furtherReading: AccItem = {
    id: "further-reading",
    tag: { en: "Further reading", id: "Bacaan lanjutan" },
    title: { en: "Where to learn more", id: "Untuk belajar lebih jauh" },
    blocks: [],
  };

  const labelBad = t("Avoiding conflict", "Menghindari konflik");
  const labelGood = t("Healthy conflict", "Konflik yang sehat");

  return (
    <div className="hc">
      <style>{CSS}</style>

      <LangToggle langs={["en", "id"]} extra={<>
        <OnePagerLauncher href="/resources/healthy-conflict/one-pager" lang={lang}
          title={{ en: "The five rules on one page", id: "Lima aturan dalam satu halaman" }}
          text={{ en: "Save, print or download a one-page summary to share with your team.", id: "Simpan, cetak, atau unduh ringkasan satu halaman untuk dibagikan kepada tim Anda." }} />
        <PresentLauncher href="/resources/healthy-conflict/present" lang={lang}
          title={{ en: "Teaching this to someone else?", id: "Mengajarkan ini kepada orang lain?" }}
          text={{ en: "Use the guided slideshow to walk your team through the five rules for healthy conflict.", id: "Gunakan slideshow terpandu untuk mengajak tim Anda melalui lima aturan untuk konflik yang sehat." }} />
      </>} />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <header className="hc-hero">
        <img src="/images/resources/healthy-conflict/hero.jpg" alt="" />
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("Cross-Cultural · Leadership", "Lintas Budaya · Kepemimpinan")}</p>
          <h1>{t("Healthy Conflict", "Konflik yang Sehat")}</h1>
          <p className="hc-subline">
            {t(
              "Conflict that is not named does not go away. It grows.",
              "Konflik yang tidak diungkapkan tidak hilang. Konflik itu terus membesar.",
            )}
          </p>
          <button
            type="button"
            className="hc-save"
            onClick={handleSave}
            disabled={saved || isPending}
            aria-pressed={saved}
            aria-label={saved
              ? t("Saved to My Pathway", "Tersimpan di Jalur Saya")
              : t("Save this module to My Pathway", "Simpan modul ini ke Jalur Saya")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3h12v18l-6-4.5L6 21z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <span>{saved ? t("Saved to My Pathway", "Tersimpan di Jalur Saya") : t("Save to My Pathway", "Simpan ke Jalur Saya")}</span>
          </button>
        </div>
      </header>

      {/* ── 2. INTRODUCTION ─────────────────────────────────────────────────── */}
      <section className="hc-sec hc-a">
        <div className="hc-wrap">
          {INTRO.map((p, i) => (
            <p key={i} className="hc-lede" style={i === INTRO.length - 1 ? { marginBottom: 0 } : undefined}>{p[lang]}</p>
          ))}
        </div>
      </section>

      {/* ── 3. AFTER THIS MODULE ────────────────────────────────────────────── */}
      <div className="hc-obj">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("After This Module", "Setelah Modul Ini")}</p>
          <ul>
            {OBJECTIVES.map((o, i) => <li key={i}>{o[lang]}</li>)}
          </ul>
        </div>
      </div>

      {/* ── 4. KEY TERMS ────────────────────────────────────────────────────── */}
      <section className="hc-sec hc-b">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("Key terms", "Istilah Kunci")}</p>
          <h2>{t("What is conflict?", "Apa itu konflik?")}</h2>
          <p>
            {t(
              "Researchers define conflict in different ways. Three definitions are widely used. Each one looks at a different part of conflict.",
              "Para peneliti mendefinisikan konflik dengan cara yang berbeda. Ada tiga definisi yang banyak dipakai. Masing-masing melihat bagian konflik yang berbeda.",
            )}
          </p>

          <div className="hc-defs">
            {DEFINITIONS.map((d, i) => (
              <div className="hc-def" key={i}>
                <div className="hc-src">{rich(d.src[lang])}</div>
                <blockquote>&ldquo;{d.quote[lang]}&rdquo;</blockquote>
                <p className="hc-focus">{d.focus[lang]}</p>
              </div>
            ))}
          </div>

          <div className="hc-ours">
            <p className="hc-term">{t("Conflict", "Konflik")}</p>
            <p className="hc-def-text">
              {t(
                "Conflict is when people who depend on each other see their goals, needs or views as opposed, and at least one of them feels it.",
                "Konflik adalah ketika orang-orang yang saling bergantung merasa tujuan, kebutuhan, atau pandangan mereka saling bertentangan, dan setidaknya salah satu dari mereka merasakannya.",
              )}
            </p>
            <p className="hc-term">{t("Healthy conflict", "Konflik yang sehat")}</p>
            <p className="hc-def-text">
              {t(
                "Healthy conflict is when people face a conflict openly and with respect, and through it gain unity, clarity and trust. After the conflict, they continue together in unity.",
                "Konflik yang sehat adalah ketika orang menghadapi konflik secara terbuka dan dengan saling menghormati, dan melalui konflik itu memperoleh kesatuan, kejelasan, dan kepercayaan. Setelah konflik, mereka melangkah bersama dalam kesatuan.",
              )}
            </p>
          </div>

          <h3>{t("Why this definition of conflict", "Mengapa definisi konflik ini")}</h3>
          <p>
            {t(
              "It takes one element from each of the three definitions above. It adds one element that matters for teams.",
              "Definisi ini mengambil satu unsur dari masing-masing tiga definisi di atas, lalu menambahkan satu unsur yang penting bagi tim.",
            )}
          </p>
          <ol className="hc-num-list">
            {WHY_DEF.map((w, i) => (
              <li key={i}>
                <span className="hc-num" aria-hidden="true">{i + 1}</span>
                <div><strong>{w.title[lang]}</strong>{rich(w.body[lang])}</div>
              </li>
            ))}
          </ol>

          <h3>{t("Why this definition of healthy conflict", "Mengapa definisi konflik yang sehat ini")}</h3>
          <p>
            {t(
              "The definition of healthy conflict describes the result. A conflict is healthy when people come out of it with more than they had before. They gain three things:",
              "Definisi konflik yang sehat menggambarkan hasilnya. Sebuah konflik disebut sehat ketika orang keluar darinya dengan lebih banyak daripada sebelumnya. Mereka memperoleh tiga hal:",
            )}
          </p>
          <div className="hc-gain">
            {GAINS.map((g, i) => (
              <div key={i}><strong>{g.title[lang]}</strong><span>{g.body[lang]}</span></div>
            ))}
          </div>
          <p style={{ marginTop: 18 }}>
            {rich(t(
              "Research on structured disagreement suggests that, handled well, conflict can lead to better decisions. This works best when people share a goal and follow clear rules.^5^",
              "Penelitian tentang perbedaan pendapat yang diatur dengan jelas menunjukkan bahwa konflik yang ditangani dengan baik dapat menghasilkan keputusan yang lebih baik. Hal ini paling berhasil ketika orang memiliki tujuan yang sama dan mengikuti aturan yang jelas.^5^",
            ))}
          </p>

          <div className="hc-callout">
            <p>
              {rich(t(
                "Conflict itself is not healthy or unhealthy. The word *healthy* describes what a team does with it.",
                "Konflik itu sendiri tidak sehat dan tidak tidak sehat. Kata *sehat* menggambarkan apa yang dilakukan tim terhadap konflik itu.",
              ))}
            </p>
          </div>
        </div>
      </section>

      {signupBanner}

      {/* ── 5. CONFLICT FEELS UNSAFE ────────────────────────────────────────── */}
      <section className="hc-sec hc-a" id="mc-unsafe">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("Why teams avoid conflict", "Mengapa Tim Menghindari Konflik")}</p>
          <h2>{t("Conflict feels unsafe", "Konflik terasa tidak aman")}</h2>
          {UNSAFE.map((p, i) => <p key={i}>{rich(p[lang])}</p>)}

          <h3>{t("Unnamed conflict piles up", "Konflik yang tidak diungkapkan akan menumpuk")}</h3>
          <p>{rich(PILES[lang])}</p>

          <h3>{t("How unhealthy conflict grows", "Bagaimana konflik yang tidak sehat membesar")}</h3>
          {GROWS.map((p, i) => <p key={i}>{rich(p[lang])}</p>)}

          <Accordion
            items={UNSAFE_ACCORDIONS}
            lang={lang}
            open={open}
            onToggle={toggle}
            extra={{
              item: furtherReading,
              content: (
                <ul className="hc-reading">
                  {FURTHER_READING.map((r, i) => (
                    <li key={i}>
                      <a href={r.href} target="_blank" rel="noopener noreferrer">{r.title}</a>. {rich(r.desc[lang])}
                    </li>
                  ))}
                </ul>
              ),
            }}
          />
        </div>
      </section>

      {/* ── 6. VISUAL ───────────────────────────────────────────────────────── */}
      <section className="hc-sec hc-b">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("See it", "Lihat gambarnya")}</p>
          <h2>{t("What healthy conflict looks like", "Seperti Apa Konflik yang Sehat")}</h2>
          <figure style={{ margin: 0 }}>
            <div className="hcv">
              <div className="hcv-o" aria-hidden="true">
                <div>{t("Unity", "Kesatuan")}</div>
                <div>{t("Clarity", "Kejelasan")}</div>
                <div>{t("Trust", "Kepercayaan")}</div>
              </div>
              <img
                src="/images/resources/healthy-conflict/healthy-conflict-visual.webp"
                alt={t(
                  "Two people at a table. Each line has a knot: the conflict. The lines meet in a safe place and go forward as one line to a good outcome.",
                  "Dua orang di sebuah meja. Setiap garis memiliki simpul, yaitu konflik. Kedua garis bertemu di tempat yang aman dan bergerak maju sebagai satu garis menuju hasil yang baik.",
                )}
              />
              <span className="hcv-k" aria-hidden="true" style={{ left: "32%", top: "86%" }}>{t("Conflict", "Konflik")}</span>
              <span className="hcv-k" aria-hidden="true" style={{ left: "67.6%", top: "86%" }}>{t("Conflict", "Konflik")}</span>
              <span className="hcv-k" aria-hidden="true" style={{ left: "50%", top: "79%" }}>{t("Safe place", "Tempat aman")}</span>
            </div>
            <figcaption className="hc-caption">
              {t(
                "Two lines come together in a safe place and go forward as one.",
                "Dua garis bertemu di tempat yang aman, lalu bergerak maju sebagai satu.",
              )}
            </figcaption>
          </figure>
          <p style={{ marginTop: 20 }}>
            {t(
              "Both people bring their knot, the conflict, to the table. They do not hide it. In the safe place they talk it through together. One line comes out and goes forward. They leave with unity, clarity and trust.",
              "Kedua orang membawa simpul mereka, yaitu konflik, ke meja. Mereka tidak menyembunyikannya. Di tempat yang aman, mereka membicarakannya bersama. Satu garis keluar dan bergerak maju. Mereka pulang dengan kesatuan, kejelasan, dan kepercayaan.",
            )}
          </p>

          <h3>{t("What avoiding conflict looks like", "Seperti Apa Menghindari Konflik")}</h3>
          <figure style={{ margin: 0 }}>
            <img
              src="/images/resources/healthy-conflict/conflict-avoidance.webp"
              alt={t(
                "Two people with arms crossed turn away from each other. Their lines pull apart in opposite directions.",
                "Dua orang bersedekap dan saling membelakangi. Garis mereka saling menjauh ke arah yang berlawanan.",
              )}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }}
            />
            <figcaption className="hc-caption">
              {t(
                "Avoiding conflict: each person turns away and the lines pull apart.",
                "Menghindari konflik: masing-masing berbalik dan garisnya saling menjauh.",
              )}
            </figcaption>
          </figure>
          <p style={{ marginTop: 20, marginBottom: 0 }}>
            {t(
              "The same two people, with the same knots. But now they cross their arms and turn away. Nobody says anything. Each person carries the knot away alone, and the lines pull apart. The conflict is not gone. It is only unspoken, and the distance between them keeps growing.",
              "Dua orang yang sama, dengan simpul yang sama. Tetapi sekarang mereka bersedekap dan saling membelakangi. Tidak ada yang berbicara. Masing-masing membawa simpulnya sendiri, dan garis mereka saling menjauh. Konfliknya tidak hilang. Konfliknya hanya tidak diucapkan, dan jarak di antara mereka terus bertambah.",
            )}
          </p>
        </div>
      </section>

      {/* ── 7. CONTRAST ─────────────────────────────────────────────────────── */}
      <section className="hc-sec hc-a">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("Compare", "Bandingkan")}</p>
          <h2>{t("Avoiding conflict and healthy conflict", "Menghindari Konflik dan Konflik yang Sehat")}</h2>
          <p>
            {t(
              "The same team can look very different, depending on what it does with conflict.",
              "Tim yang sama bisa tampak sangat berbeda, tergantung pada apa yang dilakukannya terhadap konflik.",
            )}
          </p>
          <div
            className="hc-contrast"
            role="table"
            aria-label={t("Avoiding conflict compared with healthy conflict", "Perbandingan antara menghindari konflik dan konflik yang sehat")}
          >
            <div role="rowgroup" style={{ display: "contents" }}>
              <div role="row" style={{ display: "contents" }}>
                <div className="hc-head bad" role="columnheader">{labelBad}</div>
                <div className="hc-head good" role="columnheader">{labelGood}</div>
              </div>
            </div>
            <div role="rowgroup" style={{ display: "contents" }}>
              {CONTRAST.map((row, i) => (
                <div role="row" style={{ display: "contents" }} key={i}>
                  <div className="hc-cell bad" role="cell">
                    <span className="hc-cell-label" aria-hidden="true">{labelBad}</span>
                    {row.bad[lang]}
                  </div>
                  <div className="hc-cell good" role="cell">
                    <span className="hc-cell-label" aria-hidden="true">{labelGood}</span>
                    {row.good[lang]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. CREATING A SAFE PLACE ────────────────────────────────────────── */}
      <section className="hc-sec hc-b">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("The leader's role", "Peran Pemimpin")}</p>
          <h2>{t("Creating a safe place", "Menciptakan Tempat yang Aman")}</h2>
          <p>
            {t(
              "A team will not name conflict until it feels safe to do so. The leader starts it, and the team builds it together.",
              "Sebuah tim tidak akan mengungkapkan konflik sebelum merasa aman untuk melakukannya. Pemimpin yang memulainya, dan tim membangunnya bersama-sama.",
            )}
          </p>
          <p>
            {rich(t(
              "Teams handle conflict better when they agree in advance how they will handle it. One study followed 57 student project teams. The teams that did well set clear rules for conflict and focused on facts, not on personalities.^17^",
              "Tim menangani konflik dengan lebih baik ketika mereka sepakat sejak awal tentang cara menanganinya. Satu penelitian mengikuti 57 tim proyek mahasiswa. Tim yang berhasil menetapkan aturan yang jelas untuk konflik dan berfokus pada fakta, bukan pada kepribadian.^17^",
            ))}
          </p>
          <ol className="hc-num-list">
            {SAFE_STEPS.map((s, i) => (
              <li key={i}>
                <span className="hc-num" aria-hidden="true">{i + 1}</span>
                <div><strong>{s.title[lang]}</strong>{s.body[lang]}</div>
              </li>
            ))}
          </ol>
          <div className="hc-callout">
            <p>
              {rich(t(
                "**Safe is not the same as comfortable.** A safe team still disagrees, and that can feel uncomfortable. Safe means people can disagree without fear of being punished for it.^18^",
                "**Aman tidak sama dengan nyaman.** Tim yang aman tetap berbeda pendapat, dan itu bisa terasa tidak nyaman. Aman berarti orang boleh berbeda pendapat tanpa takut dihukum karenanya.^18^",
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. FIVE RULES ───────────────────────────────────────────────────── */}
      <section className="hc-sec hc-a" id="mc-rules">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("The rules", "Aturannya")}</p>
          <h2>{t("Five rules for healthy conflict", "Lima Aturan untuk Konflik yang Sehat")}</h2>
          <p>
            {t(
              "The leader explains these rules before the conversation starts. Every person in the conversation agrees to them.",
              "Pemimpin menjelaskan aturan ini sebelum percakapan dimulai. Setiap orang dalam percakapan itu menyetujuinya.",
            )}
          </p>
          <ol className="hc-rules">
            {RULES.map((r, i) => (
              <li key={i}>
                <span className="hc-num" aria-hidden="true">{i + 1}</span>
                <div>
                  <p className="hc-rule-main">{r.title[lang]}</p>
                  <p style={{ marginBottom: 0 }}>{rich(r.body[lang])}</p>
                </div>
              </li>
            ))}
          </ol>

          <Accordion items={[NOT_LEADER]} lang={lang} open={open} onToggle={toggle} />

          <p className="hc-note">
            {t(
              "These rules are for differences between people who work together. They do not cover abuse, harassment, misconduct or safeguarding concerns. Those must be reported to the right person, not talked through as a conflict.",
              "Aturan ini untuk perbedaan di antara orang-orang yang bekerja bersama. Aturan ini tidak mencakup kekerasan, pelecehan, pelanggaran etika, atau masalah perlindungan anak dan orang yang rentan. Hal-hal itu harus dilaporkan kepada pihak yang tepat, bukan diselesaikan sebagai konflik biasa.",
            )}
          </p>
        </div>
      </section>

      {/* ── 9b. PUT IT INTO PRACTICE ────────────────────────────────────────── */}
      <section className="hc-sec hc-b" id="mc-practice">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("Put it into practice", "Terapkan dalam Praktik")}</p>
          <h2>{t("Make healthy conflict a team habit", "Jadikan Konflik yang Sehat Kebiasaan Tim")}</h2>
          <p>
            {t(
              "Do not wait until a conflict happens. Healthy conflict works best when it is a normal part of how the team works.",
              "Jangan menunggu sampai konflik terjadi. Konflik yang sehat paling berhasil ketika menjadi bagian biasa dari cara tim bekerja.",
            )}
          </p>
          <h3>{t("Ask the question in every meeting", "Ajukan pertanyaannya di setiap rapat")}</h3>
          <p>
            {t(
              "In every team meeting, ask one question: “Is there a conflict we need to resolve in a healthy way?” Ask it every time, even when you expect the answer to be no.",
              "Di setiap rapat tim, ajukan satu pertanyaan: “Apakah ada konflik yang perlu kita selesaikan dengan cara yang sehat?” Ajukan setiap kali, bahkan ketika Anda mengira jawabannya tidak ada.",
            )}
          </p>
          <h3>{t("Why the routine matters", "Mengapa rutinitas ini penting")}</h3>
          <p>
            {t(
              "When the question comes every meeting, the door is always open. People know they will have a regular chance to raise something, small or large, before it becomes a problem. Nobody has to find the courage to start the conversation alone. The whole team uses the same words and the same five rules, so everyone knows what healthy conflict means and what happens when someone speaks up.",
              "Ketika pertanyaan ini muncul di setiap rapat, pintunya selalu terbuka. Orang tahu mereka selalu punya kesempatan untuk mengangkat sesuatu, kecil atau besar, sebelum menjadi masalah. Tidak ada yang harus mengumpulkan keberanian untuk memulai percakapan sendirian. Seluruh tim memakai kata-kata yang sama dan lima aturan yang sama, sehingga semua orang tahu apa arti konflik yang sehat dan apa yang terjadi ketika seseorang angkat bicara.",
            )}
          </p>
          <h3>{t("The leader’s task", "Tugas pemimpin")}</h3>
          <p style={{ marginBottom: 0 }}>
            {t(
              "Building this habit is the leader’s job. You ask the question. You guide the conversation through the five rules. When you are part of a conflict yourself, you go first. When the team sees you handle conflict calmly and fairly, they learn it is safe to do the same. Over time the routine shapes the culture of the team.",
              "Membangun kebiasaan ini adalah tugas pemimpin. Andalah yang mengajukan pertanyaannya. Anda memandu percakapan melalui lima aturan. Ketika Anda sendiri menjadi bagian dari konflik, Anda yang memulai lebih dulu. Ketika tim melihat Anda menangani konflik dengan tenang dan adil, mereka belajar bahwa aman untuk melakukan hal yang sama. Lama-kelamaan, rutinitas ini membentuk budaya tim.",
            )}
          </p>
        </div>
      </section>

      {/* ── 10. FROM THE FIELD ──────────────────────────────────────────────── */}
      <section className="hc-sec hc-a">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("From the field", "Dari Lapangan")}</p>
          <h2>{t("An example: two leaders at one table", "Sebuah Contoh: Dua Pemimpin di Satu Meja")}</h2>
          {STORY.map((p, i) => <p key={i}>{p[lang]}</p>)}
          <p className="hc-moment">{STORY_MOMENT[lang]}</p>
          {STORY_AFTER.map((p, i) => <p key={i}>{p[lang]}</p>)}
          <div className="hc-lessons">
            <h3>{t("What this example shows", "Apa yang ditunjukkan contoh ini")}</h3>
            <ul>
              {LESSONS.map((l, i) => <li key={i}>{l[lang]}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 11. FAITH ANCHOR ────────────────────────────────────────────────── */}
      <section className="hc-sec hc-faith">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("Faith Anchor", "Pegangan Iman")}</p>
          <h2>{t("Silence is not peace", "Diam Bukan Damai")}</h2>
          {FAITH.map((p, i) => <p key={i}>{rich(p[lang])}</p>)}
          <p className="hc-faith-close">{FAITH_CLOSE[lang]}</p>
          <div className="hc-reflect">
            <p className="hc-eyebrow">{t("Reflect", "Renungkan")}</p>
            <p className="hc-reflect-text">{REFLECT[lang]}</p>
          </div>
        </div>
      </section>

      {/* ── 12. KEY TAKEAWAYS ───────────────────────────────────────────────── */}
      <section className="hc-sec hc-b">
        <div className="hc-wrap">
          <p className="hc-eyebrow">{t("Key takeaways", "Poin Penting")}</p>
          <h2>{t("What to remember", "Yang Perlu Diingat")}</h2>
          <ol className="hc-take">
            {TAKEAWAYS.map((k, i) => (
              <li key={i}>
                <span className="hc-num" aria-hidden="true">{i + 1}</span>
                <div>{k[lang]}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 13. SOURCES ─────────────────────────────────────────────────────── */}
      <SourcesDropdown sources={SOURCES} lang={lang} markerStyle="number" />
    </div>
  );
}
