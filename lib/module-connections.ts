export type ModuleConnection = {
  sourceSlug: string;
  sourceSectionId: string;
  targetSlug: string;
  targetTitle: string;
  targetTitle_id?: string;
  topic: string;
  topic_id?: string;
  angle: string;
  angle_id?: string;
};

export const MODULE_CONNECTIONS: ModuleConnection[] = [
  // Intercultural Communication → other modules (explicit text references)
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-dimensions",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    targetTitle_id: "Jarak Kekuasaan dalam Kepemimpinan",
    topic: "power distance and cultural communication",
    topic_id: "jarak kekuasaan dan komunikasi budaya",
    angle: "how power distance determines who speaks, who stays silent, and who gets heard",
    angle_id: "bagaimana jarak kekuasaan menentukan siapa yang berbicara, siapa yang diam, dan siapa yang didengar",
  },
  {
    sourceSlug: "intercultural-communication",
    sourceSectionId: "mc-faith-anchor",
    targetSlug: "giving-feedback-across-cultures",
    targetTitle: "Giving Feedback Across Cultures",
    targetTitle_id: "Memberikan Umpan Balik Lintas Budaya",
    topic: "speaking truth in ways that can be received",
    topic_id: "menyampaikan kebenaran dengan cara yang bisa diterima",
    angle: "why truth-telling fails cross-culturally — and how to deliver feedback that actually lands",
    angle_id: "mengapa kejujuran lintas budaya sering gagal — dan cara menyampaikan umpan balik yang benar-benar diterima",
  },

  // Sabbath Leadership → Understanding Burnout
  // (burnout stats section: 62.91% Southeast Asia, 71% field workers, framed as "cost of skipping Sabbath")
  {
    sourceSlug: "sabbath-leadership",
    sourceSectionId: "mc-burnout-stats",
    targetSlug: "understanding-burnout",
    targetTitle: "Understanding Burnout",
    targetTitle_id: "Memahami Burnout",
    topic: "the hidden cost of never stopping",
    topic_id: "biaya tersembunyi dari tidak pernah berhenti",
    angle: "what unaddressed burnout actually looks like in leaders — and how to recognise it before collapse",
    angle_id: "seperti apa burnout yang tidak ditangani pada pemimpin — dan cara mengenalinya sebelum terjadi keruntuhan",
  },

  // Sustainable Pace → Sabbath Leadership
  // (intro explicitly says "This is not the Sabbath module — that is about theological rest")
  {
    sourceSlug: "sustainable-pace",
    sourceSectionId: "mc-sabbath-ref",
    targetSlug: "sabbath-leadership",
    targetTitle: "Sabbath Leadership",
    targetTitle_id: "Kepemimpinan Sabat",
    topic: "Sabbath rest as a leadership practice",
    topic_id: "istirahat Sabat sebagai praktik kepemimpinan",
    angle: "the theological foundation and practical rhythm of Sabbath that this module points toward",
    angle_id: "fondasi teologis dan ritme praktis Sabat yang ditunjuk oleh modul ini",
  },

  // Sustainable Pace → Understanding Burnout
  // (Section V cites 62.91% burnout rates among cross-cultural workers)
  {
    sourceSlug: "sustainable-pace",
    sourceSectionId: "mc-burnout-data",
    targetSlug: "understanding-burnout",
    targetTitle: "Understanding Burnout",
    targetTitle_id: "Memahami Burnout",
    topic: "burnout rates among cross-cultural workers",
    topic_id: "tingkat burnout di antara pekerja lintas budaya",
    angle: "the research on what burnout looks like — and how to read the signals before your body breaks",
    angle_id: "penelitian tentang seperti apa burnout — dan cara membaca sinyal-sinyal sebelum tubuh Anda menyerah",
  },

  // Healthy Conflict → Power Distance
  // (Research section explicitly cites Hofstede's Power Distance Index with country scores)
  {
    sourceSlug: "healthy-conflict",
    sourceSectionId: "mc-research",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    targetTitle_id: "Jarak Kekuasaan dalam Kepemimpinan",
    topic: "how power distance shapes conflict and silence",
    topic_id: "bagaimana jarak kekuasaan membentuk konflik dan keheningan",
    angle: "Hofstede's framework for understanding why silence in high-PDI cultures is not disengagement — it is respect",
    angle_id: "kerangka Hofstede untuk memahami mengapa keheningan dalam budaya PDI tinggi bukan ketidaktertarikan — melainkan rasa hormat",
  },

  // DISC → Big Five
  // (About DISC section explicitly names "Big Five personality framework" as the cross-cultural benchmark)
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-about",
    targetSlug: "big-five",
    targetTitle: "Big Five Personality",
    targetTitle_id: "Kepribadian Big Five",
    topic: "cross-cultural validity of personality frameworks",
    topic_id: "validitas lintas budaya dari kerangka kepribadian",
    angle: "why the Big Five is more rigorously validated across cultures than DISC — and what that means for your team",
    angle_id: "mengapa Big Five lebih ketat divalidasi lintas budaya dibanding DISC — dan apa artinya bagi tim Anda",
  },

  // DISC → Understanding High-Context Cultures
  // (disc-D cross-cultural note explicitly says "In high-context cultures, the D-type's directness can feel aggressive")
  {
    sourceSlug: "disc",
    sourceSectionId: "disc-D",
    targetSlug: "understanding-high-context",
    targetTitle: "Understanding High-Context Cultures",
    targetTitle_id: "Memahami Budaya Konteks Tinggi",
    topic: "how D-type directness lands in high-context cultures",
    topic_id: "bagaimana ketegasan tipe-D ditanggapi dalam budaya konteks tinggi",
    angle: "why direct, task-focused communication often creates friction in high-context settings — and what to do instead",
    angle_id: "mengapa komunikasi langsung dan berorientasi tugas sering menciptakan gesekan dalam budaya konteks tinggi — dan apa yang harus dilakukan",
  },

  // Cultural Intelligence → Emotional Intelligence
  // (Section 2 explicitly says "Emotional intelligence helps you read people; cultural intelligence helps you read context")
  {
    sourceSlug: "cultural-intelligence",
    sourceSectionId: "mc-what-cq",
    targetSlug: "emotional-intelligence",
    targetTitle: "Emotional Intelligence",
    targetTitle_id: "Kecerdasan Emosional",
    topic: "EQ vs CQ — what each does and why you need both",
    topic_id: "EQ vs CQ — apa fungsinya masing-masing dan mengapa Anda butuh keduanya",
    angle: "how emotional intelligence and cultural intelligence work together — and what breaks when you have one without the other",
    angle_id: "bagaimana kecerdasan emosional dan kultural bekerja bersama — dan apa yang rusak jika hanya punya salah satunya",
  },

  // Attention Retention → Storytelling Leadership
  // (Learning Methods section lists "Storytelling" as Method 04 with full description)
  {
    sourceSlug: "attention-retention",
    sourceSectionId: "mc-methods",
    targetSlug: "storytelling-leadership",
    targetTitle: "Storytelling in Leadership",
    targetTitle_id: "Bercerita dalam Kepemimpinan",
    topic: "storytelling as a learning method",
    topic_id: "bercerita sebagai metode pembelajaran",
    angle: "how to use narrative-driven teaching to embed concepts in ways people actually remember",
    angle_id: "cara menggunakan pengajaran berbasis narasi untuk menanamkan konsep yang benar-benar diingat orang",
  },

  // Influential Leadership Framework → Cultural Intelligence
  // (Pillar 5 is explicitly titled "Cultural Intelligence (CQ)" with full CQ framework description)
  {
    sourceSlug: "influential-leadership-framework",
    sourceSectionId: "mc-cq",
    targetSlug: "cultural-intelligence",
    targetTitle: "Cultural Intelligence (CQ)",
    targetTitle_id: "Kecerdasan Budaya (CQ)",
    topic: "cultural intelligence as a pillar of leadership influence",
    topic_id: "kecerdasan budaya sebagai pilar pengaruh kepemimpinan",
    angle: "the framework, dimensions, and developmental pathway for building genuine CQ",
    angle_id: "kerangka, dimensi, dan jalur pengembangan untuk membangun CQ yang nyata",
  },

  // Wheel of Life → Sabbath Leadership
  // (Relaxation dimension explicitly asks "Do you regularly take Sabbath rest?")
  {
    sourceSlug: "wheel-of-life",
    sourceSectionId: "mc-rest",
    targetSlug: "sabbath-leadership",
    targetTitle: "Sabbath Leadership",
    targetTitle_id: "Kepemimpinan Sabat",
    topic: "Sabbath rest as a dimension of a whole leader",
    topic_id: "istirahat Sabat sebagai dimensi pemimpin yang utuh",
    angle: "the theological and practical case for building rest into your rhythm as a leader",
    angle_id: "alasan teologis dan praktis untuk membangun istirahat dalam ritme Anda sebagai pemimpin",
  },

  // Understanding Burnout → Sabbath Leadership
  // (1 Kings 19 Elijah section: "God's first response to burnout is physical. Rest before duty.")
  {
    sourceSlug: "understanding-burnout",
    sourceSectionId: "mc-elijah",
    targetSlug: "sabbath-leadership",
    targetTitle: "Sabbath Leadership",
    targetTitle_id: "Kepemimpinan Sabat",
    topic: "rest as God's first response to burnout",
    topic_id: "istirahat sebagai respons pertama Tuhan terhadap kelelahan",
    angle: "the theological and practical case for building Sabbath rest into your leadership rhythm",
    angle_id: "alasan teologis dan praktis untuk membangun istirahat Sabat dalam ritme kepemimpinan Anda",
  },

  // Johari Window → Power Distance
  // (Long-form section explicitly discusses Hofstede power distance research on upward feedback norms)
  {
    sourceSlug: "johari-window",
    sourceSectionId: "mc-cross-cultural",
    targetSlug: "power-distance",
    targetTitle: "Power Distance in Leadership",
    targetTitle_id: "Jarak Kekuasaan dalam Kepemimpinan",
    topic: "how power distance affects upward feedback and blind spots",
    topic_id: "bagaimana jarak kekuasaan memengaruhi umpan balik ke atas dan titik buta",
    angle: "why high power-distance cultures make leader blind spots larger — and what to do about it",
    angle_id: "mengapa budaya jarak kekuasaan tinggi memperbesar titik buta pemimpin — dan apa yang harus dilakukan",
  },

  // Leaders Are Readers → Cultural Intelligence
  // (Movement 2 cites Castano & Kidd research: reading builds "empathy and perspective-taking" — "exactly what cross-cultural work demands")
  {
    sourceSlug: "leaders-are-readers",
    sourceSectionId: "lar-movement-2",
    targetSlug: "cultural-intelligence",
    targetTitle: "Cultural Intelligence (CQ)",
    targetTitle_id: "Kecerdasan Budaya (CQ)",
    topic: "empathy and perspective-taking in cross-cultural work",
    topic_id: "empati dan pengambilan perspektif dalam pekerjaan lintas budaya",
    angle: "the research behind how reading builds your capacity to understand people from other cultures — and the CQ framework that puts it into practice",
    angle_id: "penelitian di balik bagaimana membaca membangun kapasitasmu untuk memahami orang dari budaya lain — dan kerangka CQ yang mempraktikkannya",
  },

  // Leaders Are Readers → Fixed vs Growth Mindset
  // (Movement 1 explicitly: "identity-based habits stick" + "behaviour follows identity" — the identity-shift framing is core to growth mindset)
  {
    sourceSlug: "leaders-are-readers",
    sourceSectionId: "lar-movement-1",
    targetSlug: "fixed-growth-mindset",
    targetTitle: "Fixed vs Growth Mindset",
    targetTitle_id: "Pola Pikir Tetap vs Berkembang",
    topic: "identity-based habits and behaviour change",
    topic_id: "kebiasaan berbasis identitas dan perubahan perilaku",
    angle: "how your belief about who you are determines what you do — and how a growth mindset reframes the reader's identity",
    angle_id: "bagaimana keyakinanmu tentang siapa dirimu menentukan apa yang kamu lakukan — dan bagaimana pola pikir berkembang membingkai ulang identitas pembaca",
  },
];

export function getConnectionsForSection(
  slug: string,
  sectionId: string
): ModuleConnection[] {
  return MODULE_CONNECTIONS.filter(
    (c) => c.sourceSlug === slug && c.sourceSectionId === sectionId
  );
}

export function getConnectionsForModule(slug: string): ModuleConnection[] {
  return MODULE_CONNECTIONS.filter((c) => c.sourceSlug === slug);
}
