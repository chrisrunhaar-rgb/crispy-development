export type CoachLang = "en" | "id";

const strings = {
  en: {
    // Carousel — panels
    panelNames: ["Background", "Notes", "Coach", "Minutes"] as [string, string, string, string],
    yourAiCoach: "Your AI Coach",
    firstSessionReady: "Ready for your first session",
    sessionReady: (n: number, name: string) => `Session ${n} ready — ${name} remembers your sessions`,
    tapToChange: "tap to change",
    clickToChange: "click to change",

    // Carousel — Notes panel
    sessionNotes: "Session Notes",
    sessionCount: (n: number) => `${n} session${n !== 1 ? "s" : ""} — tap to expand`,
    noNotesEmpty: "Your session notes will appear here after your first coaching session.",
    noNotesThisSession: "No notes from this session.",
    viewFullSession: "View full session →",

    // Carousel — Background panel
    aboutYou: "About You",
    noBackgroundInfo: "No background info yet.",
    editBackgroundInfo: "Edit background info →",

    // Accordion note labels
    focus: "Focus",
    keyInsights: "Key insights",
    values: "Values",
    actions: "Actions",
    carryingForward: "Carrying forward",

    // Carousel — Minutes panel
    minLeft: "min left",
    minutesUsed: (used: number, granted: number) => `${used} of ${granted} minutes used`,
    addCoachingTime: "Add Coaching Time",
    bestValue: "Best Value",
    purchasesSoon: "Purchases available soon",

    // Carousel — header / misc
    backToCrispy: "← Crispy Leaders",
    beta: "BETA",
    freeTrial: "Free trial",
    trialComplete: "Trial complete",
    noCredit: "No coaching credit",
    minRemaining: (n: number) => `${n} min remaining`,
    chooseCoach: "Choose Your Coach",
    current: "Current",

    // SessionTypeSelector
    trialExhaustedMsg: "You need credits to start a session. Purchase coaching time to get started.",
    deep: "Deep",
    quick: "Quick",
    deepDesc: "~40 min · complex topics",
    quickDesc: "~10 min · single focus",
    deepType: "Complex topics",
    quickType: "Single focus",
    deepTime: "~40 min",
    quickTime: "~10 min",
    starting: "Starting…",
    startSession: (type: string) => `Start ${type} session →`,

    // GeminiSessionClient — phases
    phaseLabels: {
      LAND: "Landing",
      SEEK: "Setting Focus",
      EXPLORE: "Exploring",
      COMMIT: "Committing",
      CARRY: "Carrying Forward",
      COMPLETE: "Complete",
    } as Record<string, string>,

    // GeminiSessionClient — UI
    coachingSessionWith: (name: string) => `Coaching Session with ${name}`,
    readyWhenYouAre: "Make sure you are in a private space so we can talk freely.",
    connecting: "Connecting…",
    reconnecting: "Reconnecting…",
    aiSpeaking: (name: string) => `${name} is speaking…`,
    micPaused: "Microphone paused.",
    listening: "Listening…",
    closing: "Wrapping up — your coach is closing the session…",
    endConfirmPrompt: "End the session now?",
    endConfirmYes: "End session",
    endConfirmNo: "Keep going",
    notesSavedReassure: "Your notes are saved — review them any time.",
    minutesThisSession: (n: number) => `${n} min this session`,
    reviewNotes: "Review session notes",
    sessionComplete: "Session complete.",
    connectionFailed: "Connection failed.",
    tapResume: "Tap Resume to continue",
    speakNaturally: "Speak naturally",
    startSessionBtn: "Start Session",
    resume: "Resume",
    pause: "Pause",
    endSession: "End Session",

    // Manual mode (item 6)
    manualToggleOff: "Auto — coach responds when you pause",
    manualToggleOn: "Manual — I'll tap when I'm done",
    manualHelper: "Turn this on if you like to think out loud, pause, and gather your thoughts. The coach will wait until you tap “I'm done”.",
    imDone: "I'm done",
    manualActiveHint: "Take your time — tap “I'm done” when you've finished.",
    manualActiveWaiting: "Thank you — your coach is responding…",
    backToWayPoint: "Back to WayPoint",
    tryAgain: "Try Again",
    notesWillAppear: "Your notes will appear here as the conversation unfolds.",
    back: "← Back",

    // Notepad labels (also used in GeminiSessionClient)
    insights: "Insights",

    // Past session page (session/[id])
    wayPointSession: (n: number | null) => `WayPoint · Session ${n ?? "—"}`,
    nMinutes: (n: number) => `${n} minutes`,
    allSessions: "← All Sessions",
    noNotesYet: "No notes from this session yet.",
    myFocus: "My Focus",
    keyInsightsFull: "Key Insights",
    valuesNamed: "Values I Named",
    myActionSteps: "My Action Steps",
    whatICarriedForward: "What I Carried Forward",
    backToWayPointLink: "← Back to WayPoint",

    // Complete page (session/[id]/complete)
    sessionCompleteHeading: (n: number | null) => `Session ${n ?? "—"} complete.`,
    notesWillAppearSaved: "Your notes will appear here as they are saved.",
    reviewFullSession: "Review full session →",

    // Action Steps label in complete page
    actionSteps: "Action Steps",
    carryingForwardFull: "Carrying Forward",
  },

  id: {
    panelNames: ["Latar Belakang", "Catatan", "Coach", "Menit"] as [string, string, string, string],
    yourAiCoach: "AI Coach Anda",
    firstSessionReady: "Siap untuk sesi pertama Anda",
    sessionReady: (n: number, name: string) => `Sesi ${n} siap — ${name} mengingat percakapan Anda`,
    tapToChange: "ketuk untuk ganti",
    clickToChange: "klik untuk ganti",

    sessionNotes: "Catatan Sesi",
    sessionCount: (n: number) => `${n} sesi — ketuk untuk buka`,
    noNotesEmpty: "Catatan sesi Anda akan muncul di sini setelah sesi pelatihan pertama.",
    noNotesThisSession: "Tidak ada catatan dari sesi ini.",
    viewFullSession: "Lihat sesi lengkap →",

    aboutYou: "Tentang Anda",
    noBackgroundInfo: "Belum ada informasi latar belakang.",
    editBackgroundInfo: "Edit informasi →",

    focus: "Fokus",
    keyInsights: "Wawasan utama",
    values: "Nilai-nilai",
    actions: "Langkah aksi",
    carryingForward: "Dibawa ke depan",

    minLeft: "menit tersisa",
    minutesUsed: (used: number, granted: number) => `${used} dari ${granted} menit terpakai`,
    addCoachingTime: "Tambah Waktu Coaching",
    bestValue: "Terbaik",
    purchasesSoon: "Pembelian segera tersedia",

    backToCrispy: "← Crispy Leaders",
    beta: "BETA",
    freeTrial: "Uji coba gratis",
    trialComplete: "Uji coba selesai",
    noCredit: "Belum ada kredit coaching",
    minRemaining: (n: number) => `${n} menit tersisa`,
    chooseCoach: "Pilih Coach Anda",
    current: "Aktif",

    trialExhaustedMsg: "Anda membutuhkan kredit untuk memulai sesi. Beli waktu coaching untuk memulai.",
    deep: "Mendalam",
    quick: "Singkat",
    deepDesc: "~40 mnt · topik kompleks",
    quickDesc: "~10 mnt · fokus tunggal",
    deepType: "Topik kompleks",
    quickType: "Fokus tunggal",
    deepTime: "~40 mnt",
    quickTime: "~10 mnt",
    starting: "Memulai…",
    startSession: (type: string) => `Mulai sesi ${type} →`,

    phaseLabels: {
      LAND: "Pembukaan",
      SEEK: "Menetapkan Fokus",
      EXPLORE: "Eksplorasi",
      COMMIT: "Komitmen",
      CARRY: "Membawa ke Depan",
      COMPLETE: "Selesai",
    } as Record<string, string>,

    coachingSessionWith: (name: string) => `Sesi Coaching dengan ${name}`,
    readyWhenYouAre: "Pastikan Anda berada di tempat yang privat agar kita bisa berbicara bebas.",
    connecting: "Menghubungkan…",
    reconnecting: "Menghubungkan kembali…",
    aiSpeaking: (name: string) => `${name} sedang berbicara…`,
    micPaused: "Mikrofon dijeda.",
    listening: "Mendengarkan…",
    closing: "Menutup sesi — coach Anda sedang menyampaikan penutup…",
    endConfirmPrompt: "Akhiri sesi sekarang?",
    endConfirmYes: "Akhiri sesi",
    endConfirmNo: "Lanjutkan",
    notesSavedReassure: "Catatan Anda tersimpan — bisa dilihat kapan saja.",
    minutesThisSession: (n: number) => `${n} menit sesi ini`,
    reviewNotes: "Lihat catatan sesi",
    sessionComplete: "Sesi selesai.",
    connectionFailed: "Koneksi gagal.",
    tapResume: "Ketuk Lanjutkan untuk melanjutkan",
    speakNaturally: "Bicara dengan natural",
    startSessionBtn: "Mulai Sesi",
    resume: "Lanjutkan",
    pause: "Jeda",
    endSession: "Akhiri Sesi",

    // Manual mode (item 6)
    manualToggleOff: "Otomatis — coach merespons saat Anda berhenti",
    manualToggleOn: "Manual — saya akan ketuk saat selesai",
    manualHelper: "Aktifkan ini jika Anda suka berpikir sambil bicara, berhenti sejenak, dan menyusun pikiran. Coach akan menunggu sampai Anda mengetuk “Saya selesai”.",
    imDone: "Saya selesai",
    manualActiveHint: "Tidak perlu terburu-buru — ketuk “Saya selesai” saat Anda selesai.",
    manualActiveWaiting: "Terima kasih — coach Anda sedang merespons…",
    backToWayPoint: "Kembali ke WayPoint",
    tryAgain: "Coba Lagi",
    notesWillAppear: "Catatan Anda akan muncul di sini seiring percakapan berlangsung.",
    back: "← Kembali",

    insights: "Wawasan",

    wayPointSession: (n: number | null) => `WayPoint · Sesi ${n ?? "—"}`,
    nMinutes: (n: number) => `${n} menit`,
    allSessions: "← Semua Sesi",
    noNotesYet: "Belum ada catatan dari sesi ini.",
    myFocus: "Fokus Saya",
    keyInsightsFull: "Wawasan Utama",
    valuesNamed: "Nilai yang Saya Temukan",
    myActionSteps: "Langkah Aksi Saya",
    whatICarriedForward: "Yang Saya Bawa ke Depan",
    backToWayPointLink: "← Kembali ke WayPoint",

    sessionCompleteHeading: (n: number | null) => `Sesi ${n ?? "—"} selesai.`,
    notesWillAppearSaved: "Catatan Anda akan muncul di sini saat tersimpan.",
    reviewFullSession: "Lihat sesi lengkap →",

    actionSteps: "Langkah Aksi",
    carryingForwardFull: "Dibawa ke Depan",
  },
} as const;

export function useT(lang: CoachLang) {
  return strings[lang] ?? strings.en;
}
