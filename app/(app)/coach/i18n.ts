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

    // Crisis tap-to-connect card (welfare escalation, item 3/7)
    crisisTitle: "Talk to someone today",
    crisisBody: "What you shared matters more than this conversation can hold. These are real, vetted directories — not a bot — that connect you to a person now.",
    crisisPrimaryLabel: "Find a local helpline",
    crisisPrimaryUrl: "https://findahelpline.com",
    crisisBackupLabel: "Befrienders Worldwide (alternative)",
    crisisBackupUrl: "https://befrienders.org",
    crisisDismiss: "I'm okay for now, close this",

    // Coaching style toggle (item 4) — same modal as coach persona selection
    coachingStyleLabel: "Coaching style",
    coachingStyleDirect: "Direct — get to the point",
    coachingStyleRelational: "Relational — take your time",
    coachingStyleHelper: "Changes how your coach paces and phrases things. You can change this anytime.",

    // Coaching intensity toggle — second, independent axis alongside coaching style
    coachingIntensityLabel: "Coaching intensity",
    coachingIntensityFirm: "Firm — challenge me",
    coachingIntensityGentle: "Gentle — go easy",
    coachingIntensityHelper: "Independent of coaching style above — you can combine either with either. You can change this anytime.",

    // Post-session check-in (item 2) — 3-question modal
    checkinHeading: "Before you see your notes",
    checkinQ1: "How clear do you feel about your next step?",
    checkinQ2: "How understood did you feel by your coach?",
    checkinQ3: "How valuable was this session?",
    checkinSkip: "Skip",
    checkinClose: "Close",
    checkinNotePlaceholder: "Anything else, optional…",
    checkinSubmit: "Done — show my notes",
    checkinLow: "Not really",
    checkinHigh: "Very much",

    // Onboarding intro (coach/setup)
    onboardingWelcome: "Welcome to WayPoint.",
    onboardingWhatIsLabel: "What is WayPoint?",
    onboardingWhatIsBody: "WayPoint is a private coaching space, available whenever you need it. Your coach is an AI companion trained in professional coaching methods, for people navigating cross-cultural life and work. It's not a chatbot. It listens, asks good questions, and helps you find your own clarity.",
    onboardingMarkLabel: "The mark",
    onboardingMarkCompass: "The compass rose: orientation. Finding your footing in unfamiliar terrain.",
    onboardingMarkPin: "The location pin: destination. Knowing where you're headed.",
    onboardingMarkTagline: "WayPoint helps you find both.",
    onboardingSessionLabel: "What happens in a session?",
    onboardingSessionBody: "Sessions are voice-based: you speak, your coach responds. As you talk, notes build automatically, covering your focus, insights, values, and action steps. After each session, your notes are saved and your coach remembers them next time.",
    onboardingNotLabel: "What WayPoint is not",
    onboardingNotBody: "WayPoint is not therapy, counselling, or a substitute for a pastor, friend, or mental health professional. If you are in crisis, please reach out to a real person you trust.",
    onboardingPrivacyLabel: "Your privacy",
    onboardingPrivacyBody: "Your session transcripts and notes are private to you. They are never shared with your organisation or anyone else. You are always in control.",
    onboardingConsentPart1: "I understand that WayPoint is a coaching tool, not a mental health service, and I agree to the",
    onboardingTermsOfUseLabel: "terms of use",
    onboardingConsentPart2: "and",
    onboardingConfidentialityLabel: "confidentiality policy",
    onboardingConsentPart3: ". I agree that my voice will be processed by Google's AI to enable the coaching experience.",
    onboardingBeginBtn: "Begin my first session →",
    onboardingSaving: "Saving…",
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

    // Crisis tap-to-connect card (welfare escalation, item 3/7)
    crisisTitle: "Bicaralah dengan seseorang hari ini",
    crisisBody: "Apa yang Anda bagikan lebih penting daripada percakapan ini bisa tangani. Ini adalah direktori nyata dan terverifikasi — bukan bot — yang menghubungkan Anda dengan orang sungguhan sekarang.",
    crisisPrimaryLabel: "Temukan helpline lokal",
    crisisPrimaryUrl: "https://findahelpline.com",
    crisisBackupLabel: "Befrienders Worldwide (alternatif)",
    crisisBackupUrl: "https://befrienders.org",
    crisisDismiss: "Saya baik-baik saja untuk saat ini, tutup ini",

    // Coaching style toggle (item 4)
    coachingStyleLabel: "Gaya coaching",
    coachingStyleDirect: "Langsung — ke intinya",
    coachingStyleRelational: "Relasional — santai saja",
    coachingStyleHelper: "Mengubah cara coach Anda mengatur ritme dan menyampaikan sesuatu. Bisa diubah kapan saja.",

    // Coaching intensity toggle — second, independent axis alongside coaching style
    coachingIntensityLabel: "Intensitas coaching",
    coachingIntensityFirm: "Tegas — tantang saya",
    coachingIntensityGentle: "Lembut — pelan-pelan saja",
    coachingIntensityHelper: "Terpisah dari gaya coaching di atas — bisa dikombinasikan bebas. Bisa diubah kapan saja.",

    // Post-session check-in (item 2) — 3-question modal
    checkinHeading: "Sebelum Anda melihat catatan Anda",
    checkinQ1: "Seberapa jelas langkah berikutnya bagi Anda?",
    checkinQ2: "Seberapa dipahami perasaan Anda oleh coach?",
    checkinQ3: "Seberapa berharga sesi ini bagi Anda?",
    checkinSkip: "Lewati",
    checkinClose: "Tutup",
    checkinNotePlaceholder: "Hal lain, opsional…",
    checkinSubmit: "Selesai — tampilkan catatan saya",
    checkinLow: "Kurang begitu",
    checkinHigh: "Sangat",

    // Onboarding intro (coach/setup)
    onboardingWelcome: "Selamat datang di WayPoint.",
    onboardingWhatIsLabel: "Apa itu WayPoint?",
    onboardingWhatIsBody: "WayPoint adalah ruang coaching pribadi, tersedia kapan pun Anda membutuhkannya. Coach Anda adalah pendamping AI yang dilatih dengan metode coaching profesional, untuk orang-orang yang menjalani hidup dan pekerjaan lintas budaya. Ini bukan chatbot. WayPoint mendengarkan, mengajukan pertanyaan yang baik, dan membantu Anda menemukan kejernihan Anda sendiri.",
    onboardingMarkLabel: "Makna lambang",
    onboardingMarkCompass: "Kompas: arah. Menemukan pijakan di medan yang belum dikenal.",
    onboardingMarkPin: "Pin lokasi: tujuan. Mengetahui ke mana Anda melangkah.",
    onboardingMarkTagline: "WayPoint membantu Anda menemukan keduanya.",
    onboardingSessionLabel: "Apa yang terjadi dalam satu sesi?",
    onboardingSessionBody: "Sesi berlangsung lewat suara: Anda berbicara, coach Anda merespons. Saat Anda berbicara, catatan tersusun otomatis, mencakup fokus, wawasan, nilai, dan langkah aksi Anda. Setelah setiap sesi, catatan Anda tersimpan dan coach Anda akan mengingatnya di sesi berikutnya.",
    onboardingNotLabel: "Apa yang WayPoint bukan",
    onboardingNotBody: "WayPoint bukan terapi, konseling, atau pengganti pendeta, teman, atau tenaga profesional kesehatan mental. Jika Anda sedang dalam krisis, segera hubungi orang yang benar-benar bisa Anda percaya.",
    onboardingPrivacyLabel: "Privasi Anda",
    onboardingPrivacyBody: "Transkrip dan catatan sesi Anda bersifat pribadi. Tidak pernah dibagikan ke organisasi Anda atau siapa pun. Anda selalu memegang kendali.",
    onboardingConsentPart1: "Saya memahami bahwa WayPoint adalah alat coaching, bukan layanan kesehatan mental, dan saya menyetujui",
    onboardingTermsOfUseLabel: "syarat penggunaan",
    onboardingConsentPart2: "dan",
    onboardingConfidentialityLabel: "kebijakan kerahasiaan",
    onboardingConsentPart3: ". Saya menyetujui bahwa suara saya akan diproses oleh AI Google untuk mendukung pengalaman coaching ini.",
    onboardingBeginBtn: "Mulai sesi pertama saya →",
    onboardingSaving: "Menyimpan…",
  },
} as const;

export function useT(lang: CoachLang) {
  return strings[lang] ?? strings.en;
}
