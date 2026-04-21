import { TrainingPart } from "@/components/Training/types";

const IMG = {
  chat: "/training/teams/3 — Chat interface (Part 3).png",
  createTeam: "/training/teams/4 — Channels list (Part 4).png",
  instantMeeting: "/training/teams/1 — Home screen (Part 1).png",
  scheduleMeeting: "/training/teams/5 — New Meeting form (Part 5).png",
  joinMeeting: "/training/teams/6 — Pre-join screen (Part 6).png",
  files: "/training/teams/7 — Files tab (Part 7).png",
  unifiedInterface: "/training/teams/2 — Left navigation (Part 2).png",
};

export const TEAMS_PARTS_ID: TrainingPart[] = [
  {
    number: 1,
    title: "Memulai",
    subtitle: "Menginstal, masuk, dan membuka Teams untuk pertama kalinya",
    whatYouWillLearn: [
      "Apa itu Microsoft Teams dan bagaimana perannya dalam pekerjaan Anda",
      "Cara menginstal Teams di komputer desktop dan ponsel Anda",
      "Cara masuk menggunakan akun kerja Anda",
      "Apa yang akan Anda temui saat pertama kali membuka Teams",
    ],
    sections: [
      {
        id: "t1-what",
        title: "Apa itu Microsoft Teams?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Microsoft Teams adalah platform komunikasi dan kolaborasi yang terintegrasi dalam Microsoft 365 — platform ini menggabungkan obrolan, rapat video, penyimpanan file, dan integrasi aplikasi dalam satu tempat.",
          },
          {
            type: "body",
            text: "Anggap saja ini sebagai pusat kerja tim Anda. Daripada bolak-balik antara email, aplikasi panggilan video terpisah, sistem penyimpanan file, dan alat perpesanan, Teams menggabungkan semuanya ke dalam satu aplikasi. Anda bisa mengirim pesan ke rekan kerja, langsung melakukan panggilan video, mengedit dokumen bersama, dan memeriksa kalender — tanpa harus keluar dari jendela Teams.",
          },
          {
            type: "body",
            text: "Teams digunakan oleh organisasi dari berbagai skala — mulai dari organisasi nirlaba kecil hingga perusahaan multinasional. Jika organisasi Anda menggunakan Microsoft 365 (sebelumnya Office 365), kemungkinan besar Anda sudah memiliki akses ke Teams.",
          },
          {
            type: "tip",
            text: "Teams bukan hanya untuk perusahaan besar. Banyak tim kecil, gereja, dan lembaga keagamaan menggunakannya sebagai alat komunikasi utama mereka. Jika organisasi Anda sudah berlangganan Microsoft 365, Teams sudah termasuk tanpa biaya tambahan.",
          },
        ],
      },
      {
        id: "t1-install",
        title: "Menginstal Teams",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Untuk menggunakan Teams di komputer Anda, Anda perlu menginstal aplikasi desktop. Ini adalah proses satu kali yang memakan waktu sekitar 3 menit. Ikuti langkah-langkah di bawah ini.",
          },
          { type: "h3", text: "Desktop (Windows atau Mac)" },
          {
            type: "url",
            url: "https://www.microsoft.com/en-us/microsoft-teams/download-app",
            label: "Unduh Microsoft Teams",
          },
          {
            type: "bullet",
            bold: "Buka halaman unduhan",
            text: "Buka halaman unduhan menggunakan tautan di atas di browser web Anda.",
          },
          {
            type: "bullet",
            bold: "Klik 'Unduh untuk desktop'",
            text: "Klik 'Unduh untuk desktop' — cari tombol yang sesuai dengan sistem operasi Anda (Windows atau Mac).",
          },
          {
            type: "bullet",
            bold: "Jalankan file penginstal",
            text: "Jalankan file penginstal setelah selesai diunduh. Di Windows, klik dua kali file .exe. Di Mac, klik dua kali file .pkg.",
          },
          {
            type: "bullet",
            bold: "Ikuti langkah-langkah di layar",
            text: "Ikuti langkah-langkah di layar untuk menyelesaikan instalasi. Anda mungkin diminta untuk mengizinkan aplikasi melakukan perubahan pada komputer Anda — klik Ya atau Izinkan.",
          },
          {
            type: "bullet",
            bold: "Teams akan terbuka secara otomatis",
            text: "Teams akan terbuka secara otomatis setelah instalasi selesai dan membawa Anda ke layar masuk.",
          },
          {
            type: "screenshot",
            description: "Aplikasi desktop Microsoft Teams — layar beranda setelah masuk",
            imageUrl: IMG.instantMeeting,
          },
          { type: "h3", text: "Ponsel (iPhone atau Android)" },
          {
            type: "body",
            text: "Teams juga tersedia sebagai aplikasi seluler, sehingga Anda dapat tetap terhubung saat jauh dari meja kerja. Aplikasi ini berfungsi di iPhone dan Android.",
          },
          {
            type: "bullet",
            bold: "Buka App Store atau Google Play",
            text: "Buka App Store (di iPhone) atau Google Play Store (di Android).",
          },
          {
            type: "bullet",
            bold: "Cari 'Microsoft Teams'",
            text: "Cari 'Microsoft Teams' — pastikan untuk menginstal aplikasi resmi dari Microsoft Corporation.",
          },
          {
            type: "bullet",
            bold: "Ketuk Dapatkan atau Instal",
            text: "Ketuk Dapatkan (iPhone) atau Instal (Android) dan tunggu hingga unduhan selesai.",
          },
        ],
      },
      {
        id: "t1-signin",
        title: "Masuk",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Setelah Teams terinstal, Anda perlu masuk. Ini menghubungkan aplikasi ke akun Microsoft 365 Anda sehingga Teams mengetahui siapa Anda dan organisasi mana yang Anda ikuti.",
          },
          {
            type: "bullet",
            bold: "Buka Teams",
            text: "Buka Teams di perangkat Anda — Anda akan melihat layar masuk.",
          },
          {
            type: "bullet",
            bold: "Masukkan alamat email kantor Anda",
            text: "Masukkan alamat email kantor Anda — ini adalah email yang diberikan oleh organisasi Anda (misalnya yourname@yourorganisation.com).",
          },
          {
            type: "bullet",
            bold: "Klik Masuk",
            text: "Klik Masuk dan masukkan kata sandi Anda saat diminta.",
          },
          {
            type: "bullet",
            bold: "Setujui otentikasi dua faktor",
            text: "Setujui otentikasi dua faktor jika organisasi Anda menggunakannya — Anda mungkin menerima kode melalui SMS atau permintaan di ponsel Anda untuk menyetujui masuk.",
          },
          {
            type: "note",
            text: "Jika Anda tidak dapat masuk, hubungi administrator TI Anda. Mereka harus telah membuat akun Teams untuk Anda di dalam akun Microsoft 365 organisasi Anda. Tanpa ini, Anda tidak dapat masuk.",
          },
          {
            type: "tip",
            text: "Masuk baik di desktop maupun ponsel Anda. Pesan dan rapat akan disinkronkan di semua perangkat Anda secara real-time — sehingga Anda tidak akan pernah melewatkan pemberitahuan saat jauh dari meja kerja.",
          },
        ],
      },
      {
        id: "t1-setup",
        title: "Pengaturan Pertama Kali",
        blocks: [
          {
            type: "body",
            text: "Saat pertama kali masuk ke Teams, mungkin akan muncul beberapa pertanyaan pengaturan dan panduan singkat. Berikut ini yang akan Anda temui:",
          },
          {
            type: "bullet",
            text: "Teams mungkin meminta Anda mengunduh aplikasi desktop jika Anda pertama kali masuk melalui browser web — lakukan ini untuk pengalaman terbaik.",
          },
          {
            type: "bullet",
            text: "Klik Izinkan pemberitahuan saat diminta. Tanpa pemberitahuan, Anda tidak akan tahu kapan pesan atau panggilan masuk.",
          },
          {
            type: "bullet",
            text: "Teams akan menampilkan ruang kerja utama Anda — Anda akan melihat bilah sisi kiri dengan ikon untuk Aktivitas, Obrolan, Tim, Kalender, dan lainnya.",
          },
          {
            type: "tip",
            text: "Jangan bingung dengan antarmuka saat pertama kali membuka aplikasi. Anda hanya perlu menggunakan sebagian kecil dari antarmuka tersebut untuk sebagian besar pekerjaan. Pelatihan ini akan memandu Anda melalui setiap bagian secara bertahap.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t1-c1", text: "Saya telah menginstal Microsoft Teams di komputer desktop saya", type: "implemented" },
      { id: "t1-c2", text: "Saya telah menginstal Microsoft Teams di perangkat seluler saya", type: "implemented" },
      { id: "t1-c3", text: "Saya dapat masuk dengan sukses menggunakan email kantor saya", type: "implemented" },
      { id: "t1-c4", text: "Saya memahami bahwa Teams adalah bagian dari Microsoft 365 dan memerlukan akun organisasi", type: "understood" },
      { id: "t1-c5", text: "Saya telah mengizinkan Teams untuk mengirimkan pemberitahuan kepada saya", type: "implemented" },
    ],
  },

  {
    number: 2,
    title: "Antarmuka",
    subtitle: "Menjelajahi Teams — dengan cepat dan percaya diri",
    whatYouWillLearn: [
      "Fungsi setiap ikon di bilah navigasi kiri",
      "Cara menggunakan bilah pencarian untuk menemukan apa pun dengan cepat",
      "Cara mengatur status ketersediaan Anda",
      "Perbedaan tata letak seluler dengan desktop",
    ],
    sections: [
      {
        id: "t2-overview",
        title: "Memahami Tata Letak",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Saat Anda membuka Teams, Anda akan melihat ruang kerja yang terdiri dari beberapa bagian. Yang paling penting adalah bilah navigasi di sebelah kiri — inilah cara Anda berpindah antar bagian yang berbeda di Teams.",
          },
          {
            type: "body",
            text: "Bayangkan seperti tata letak gedung perkantoran: bilah samping kiri adalah direktori yang memberi tahu Anda apa saja yang ada di setiap lantai. Klik ikon untuk membuka bagian tersebut. Semua yang Anda butuhkan dapat dijangkau dari bilah samping ini hanya dengan satu atau dua klik.",
          },
        ],
      },
      {
        id: "t2-nav",
        title: "Bilah Navigasi Kiri",
        blocks: [
          {
            type: "screenshot",
            description: "Microsoft Teams — antarmuka terpadu baru yang menampilkan bilah navigasi kiri",
            imageUrl: IMG.unifiedInterface,
          },
          {
            type: "body",
            text: "Berikut adalah fungsi masing-masing ikon di bilah sisi kiri:",
          },
          {
            type: "bullet",
            bold: "Aktivitas",
            text: "Aktivitas — umpan notifikasi Anda. Setiap @mention yang ditujukan kepada Anda, setiap balasan atas pesan Anda, dan setiap reaksi yang diberikan seseorang terhadap postingan Anda akan muncul di sini. Periksa bagian ini terlebih dahulu saat Anda membuka Teams.",
          },
          {
            type: "bullet",
            bold: "Obrolan",
            text: "Obrolan — semua percakapan teks satu lawan satu dan grup Anda. Di sinilah Anda melakukan percakapan pribadi, bukan di saluran tim.",
          },
          {
            type: "bullet",
            bold: "Tim",
            text: "Tim — semua tim dan saluran yang Anda ikuti. Di sinilah kolaborasi grup berlangsung.",
          },
          {
            type: "bullet",
            bold: "Kalender",
            text: "Kalender — jadwal rapat Anda, terhubung langsung ke kalender Outlook Anda. Jadwalkan rapat dan ikuti panggilan dari sini.",
          },
          {
            type: "bullet",
            bold: "Panggilan",
            text: "Panggilan — lakukan panggilan audio atau video langsung dari Teams, dan lihat riwayat panggilan Anda.",
          },
          {
            type: "bullet",
            bold: "File",
            text: "File — akses semua file yang dibagikan kepada Anda di seluruh Teams dan OneDrive di satu tempat.",
          },
          {
            type: "tip",
            text: "Umpan Aktivitas (ikon lonceng) adalah titik awal Anda setiap hari. Umpan ini menampilkan segala hal yang perlu Anda perhatikan — sebutan, balasan, dan reaksi — tanpa Anda harus memeriksa setiap obrolan dan saluran satu per satu.",
          },
        ],
      },
      {
        id: "t2-search",
        title: "Bilah Pencarian",
        blocks: [
          {
            type: "body",
            text: "Di bagian atas layar Teams, Anda akan menemukan bilah pencarian. Ini adalah salah satu fitur paling berguna di seluruh aplikasi — gunakan untuk mencari orang, pesan lama, file, dan tim.",
          },
          {
            type: "bullet",
            text: "Untuk mencari seseorang: ketik nama mereka dan tekan Enter. Anda kemudian dapat mengirim pesan atau memulai panggilan langsung dari hasil pencarian.",
          },
          {
            type: "bullet",
            text: "Untuk mencari pesan lama: ketik kata atau frasa, dan Teams akan menampilkan semua percakapan di mana kata tersebut muncul.",
          },
          {
            type: "bullet",
            text: "Untuk mencari file: ketik nama file dan Teams akan menunjukkan di mana file tersebut disimpan.",
          },
          {
            type: "tip",
            text: "Tekan Ctrl+F (Windows) atau Cmd+F (Mac) untuk mencari di dalam obrolan atau percakapan saluran tertentu, bukan mencari di seluruh Teams.",
          },
        ],
      },
      {
        id: "t2-profile",
        title: "Profil dan Status Anda",
        blocks: [
          {
            type: "body",
            text: "Foto profil Anda (atau inisial Anda jika belum mengatur foto) muncul di sudut kanan atas Teams. Klik foto tersebut untuk mengakses pengaturan dan mengatur status ketersediaan Anda.",
          },
          {
            type: "body",
            text: "Status Anda adalah lingkaran kecil berwarna di sebelah foto profil Anda. Status ini memberi tahu rekan kerja Anda apakah Anda tersedia untuk merespons. Anda harus terus memperbarui status ini sepanjang hari.",
          },
          {
            type: "bullet",
            bold: "Tersedia",
            text: "Tersedia — lingkaran hijau. Anda bebas membalas pesan dan panggilan.",
          },
          {
            type: "bullet",
            bold: "Sibuk",
            text: "Sibuk — lingkaran merah. Anda sedang dalam rapat atau fokus pada pekerjaan. Pesan diterima tetapi Anda mungkin tidak dapat langsung membalas.",
          },
          {
            type: "bullet",
            bold: "Jangan Ganggu",
            text: "Jangan Ganggu — lingkaran merah dengan garis. Notifikasi dimatikan sepenuhnya. Gunakan ini saat Anda membutuhkan waktu fokus tanpa gangguan.",
          },
          {
            type: "bullet",
            bold: "Tidak Ada di Tempat",
            text: "Tidak Ada di Tempat — jam kuning. Teams mengatur ini secara otomatis saat komputer Anda tidak aktif. Anda juga dapat mengaturnya secara manual.",
          },
          {
            type: "tip",
            text: "Tetapkan pesan status untuk memberi konteks kepada rekan kerja Anda — misalnya, 'Sedang mengikuti pelatihan hingga pukul 15.00' atau 'Sedang mengerjakan proposal — memeriksa pesan pada pukul 14.00'. Klik foto profil Anda, lalu 'Tetapkan pesan status'.",
          },
        ],
      },
      {
        id: "t2-mobile",
        title: "Di Ponsel — Bilah Navigasi Bawah",
        blocks: [
          {
            type: "body",
            text: "Di aplikasi seluler Teams (iPhone atau Android), navigasi bekerja secara berbeda. Alih-alih bilah sisi kiri, Anda memiliki deretan ikon di bagian bawah layar: Aktivitas, Obrolan, Tim, Kalender, dan Lainnya.",
          },
          {
            type: "body",
            text: "Ketuk ikon mana pun untuk beralih ke bagian tersebut. Kontennya sama seperti di desktop — pesan, tim, dan kalender Anda semuanya disinkronkan secara instan di seluruh perangkat.",
          },
          {
            type: "note",
            text: "Beberapa fitur hanya tersedia di aplikasi desktop — misalnya, membuat tim baru, menginstal aplikasi pihak ketiga, dan beberapa fitur manajemen rapat. Aplikasi seluler paling cocok untuk tetap terhubung saat bepergian, sedangkan aplikasi desktop adalah alat yang sangat lengkap untuk memimpin rapat dan mengelola pekerjaan.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t2-c1", text: "Saya dapat mengidentifikasi fungsi setiap ikon di bilah navigasi kiri", type: "understood" },
      { id: "t2-c2", text: "Saya tahu cara mencari orang, pesan, atau file di Teams", type: "understood" },
      { id: "t2-c3", text: "Saya telah mengatur status saya untuk mencerminkan ketersediaan saya saat ini", type: "implemented" },
      { id: "t2-c4", text: "Saya memahami perbedaan antara tata letak navigasi desktop dan seluler", type: "understood" },
    ],
  },

  {
    number: 3,
    title: "Obrolan",
    subtitle: "Percakapan satu lawan satu dan grup — cepat, profesional, dan terorganisir",
    whatYouWillLearn: [
      "Perbedaan antara obrolan dan saluran tim",
      "Cara memulai obrolan pribadi dengan satu orang atau grup",
      "Cara memformat pesan, berbagi file, dan menggunakan @mentions",
      "Cara bereaksi dan membalas pesan tertentu",
      "Cara mengedit atau menghapus pesan setelah mengirimnya",
    ],
    sections: [
      {
        id: "t3-what-is-chat",
        title: "Apa itu Obrolan di Teams?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Obrolan di Teams adalah pesan pribadi — percakapan antara Anda dan satu orang lain, atau antara Anda dan sekelompok kecil orang. Bayangkan seperti aplikasi pesan di ponsel Anda, tetapi di lingkungan kerja Anda.",
          },
          {
            type: "body",
            text: "Obrolan berbeda dengan posting di saluran tim (yang akan Anda pelajari di Bagian 4). Obrolan bersifat pribadi — hanya orang-orang yang terlibat dalam percakapan yang dapat melihat pesan-pesan tersebut. Posting di saluran terlihat oleh semua orang di tim.",
          },
          {
            type: "body",
            text: "Gunakan obrolan untuk: pertanyaan singkat kepada rekan kerja, diskusi pribadi, komunikasi satu lawan satu, dan percakapan kelompok kecil. Gunakan saluran untuk informasi yang harus dilihat seluruh tim.",
          },
        ],
      },
      {
        id: "t3-new",
        title: "Memulai Obrolan Baru",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Memulai obrolan sangatlah mudah. Anda dapat menghubungi siapa pun di organisasi Anda selama mereka memiliki akun Teams.",
          },
          {
            type: "screenshot",
            description: "Antarmuka obrolan Teams — percakapan satu lawan satu dan grup",
            imageUrl: IMG.chat,
          },
          {
            type: "bullet",
            bold: "Klik ikon Obrolan",
            text: "Klik ikon Obrolan di bilah navigasi kiri untuk membuka bagian obrolan.",
          },
          {
            type: "bullet",
            bold: "Klik ikon buat pesan",
            text: "Klik ikon buat pesan (pensil atau tombol 'Obrolan baru') di bagian atas daftar obrolan.",
          },
          {
            type: "bullet",
            bold: "Ketik nama seseorang",
            text: "Ketik nama seseorang di kolom 'Kepada' di bagian atas. Teams akan menyarankan orang-orang dari organisasi Anda saat Anda mengetik — klik orang yang tepat dari daftar dropdown.",
          },
          {
            type: "bullet",
            bold: "Ketik pesan Anda dan tekan Enter",
            text: "Ketik pesan Anda di kotak penulisan di bagian bawah dan tekan Enter untuk mengirim.",
          },
          {
            type: "tip",
            text: "Anda dapat memulai panggilan suara atau video langsung dari obrolan mana pun dengan mengklik ikon telepon atau kamera di kanan atas percakapan. Tidak perlu menjadwalkan — panggilan akan langsung dimulai.",
          },
        ],
      },
      {
        id: "t3-compose",
        title: "Apa yang Dapat Anda Kirim dalam Obrolan",
        blocks: [
          {
            type: "body",
            text: "Obrolan di Teams mendukung lebih dari sekadar teks biasa. Kotak penulisan di bagian bawah setiap obrolan memiliki deretan ikon yang membuka fitur-fitur tambahan.",
          },
          {
            type: "bullet",
            bold: "Format",
            text: "Format — klik ikon A atau tekan Shift+Ctrl+X untuk memperluas bilah alat pemformatan. Anda dapat menambahkan teks tebal, miring, daftar poin, judul, dan teks yang disorot — berguna untuk mengirim informasi yang terstruktur.",
          },
          {
            type: "bullet",
            bold: "Lampirkan file",
            text: "Lampirkan file — klik ikon penjepit kertas untuk membagikan dokumen dari komputer atau OneDrive Anda. Penerima dapat membukanya langsung di Teams tanpa mengunduhnya.",
          },
          {
            type: "bullet",
            bold: "Emoji",
            text: "Emoji — klik ikon wajah tersenyum untuk menelusuri emoji dan stiker. Ini membantu menjaga nada yang hangat dan manusiawi dalam komunikasi tertulis.",
          },
          {
            type: "bullet",
            bold: "@Mention",
            text: "@Mention — ketik @ diikuti dengan nama seseorang untuk mengirimkan pemberitahuan langsung kepada mereka, meskipun mereka tidak sedang aktif memantau obrolan. Nama mereka akan muncul dengan sorotan dalam pesan.",
          },
          {
            type: "tip",
            text: "Gunakan @mention saat ada hal yang benar-benar membutuhkan perhatian seseorang. Mereka akan menerima pemberitahuan meskipun telah membisukan obrolan tersebut. Gunakan @mention hanya untuk hal-hal yang benar-benar memerlukan tanggapan — bukan untuk setiap pesan.",
          },
        ],
      },
      {
        id: "t3-react",
        title: "Reaksi dan Balasan",
        blocks: [
          {
            type: "body",
            text: "Dua fitur membantu menjaga percakapan obrolan tetap teratur dan menghindari kekacauan: reaksi dan balasan berurutan.",
          },
          {
            type: "body",
            text: "Reaksi adalah emoji kecil yang dapat Anda letakkan pada pesan apa pun — jempol ke atas, hati, wajah tertawa, atau lainnya. Fitur ini memungkinkan Anda menanggapi pesan tanpa mengirim balasan terpisah. Untuk bereaksi: arahkan kursor ke pesan mana pun (atau tekan lama di ponsel) dan klik emoji yang muncul.",
          },
          {
            type: "body",
            text: "Balasan berurutan memungkinkan Anda menanggapi pesan tertentu sebelumnya, bukan hanya mengetik di bagian bawah obrolan. Hal ini membuat percakapan tetap mudah dibaca. Untuk membalas pesan tertentu: arahkan kursor ke pesan tersebut dan klik panah Balas yang muncul.",
          },
          {
            type: "note",
            text: "Dalam obrolan grup yang ramai, selalu gunakan fungsi Balas saat menanggapi pesan tertentu. Tanpa fungsi ini, tanggapan Anda akan muncul di bagian bawah obrolan tanpa konteks, dan orang lain mungkin tidak tahu apa yang Anda tanggapi.",
          },
        ],
      },
      {
        id: "t3-group",
        title: "Obrolan Grup",
        blocks: [
          {
            type: "body",
            text: "Obrolan grup adalah percakapan antara tiga orang atau lebih. Cara kerjanya sama persis seperti obrolan satu lawan satu, tetapi dengan banyak peserta. Obrolan grup dapat menampung hingga 250 orang.",
          },
          {
            type: "body",
            text: "Untuk membuat obrolan grup: mulai obrolan baru dan tambahkan nama-nama di kolom 'Kepada' sebelum Anda mengirim pesan pertama.",
          },
          {
            type: "bullet",
            text: "Beri nama grup — klik ikon pensil di sebelah nama obrolan di bagian atas untuk menambahkan judul yang bermakna (misalnya 'Perencanaan Anggaran Q3'). Ini memudahkan pencarian di kemudian hari.",
          },
          {
            type: "bullet",
            text: "Tambahkan seseorang ke grup yang sudah ada — klik ikon orang di kanan atas obrolan, ketik nama orang tersebut, lalu klik Tambahkan.",
          },
          {
            type: "bullet",
            text: "Sematkan obrolan grup — klik kanan obrolan di daftar Anda dan pilih Sematkan. Obrolan yang disematkan akan muncul di bagian atas daftar obrolan Anda sehingga Anda dapat menemukannya dengan cepat.",
          },
        ],
      },
      {
        id: "t3-edit",
        title: "Mengedit dan Menghapus Pesan",
        blocks: [
          {
            type: "body",
            text: "Tidak seperti email, Anda dapat mengedit atau menghapus pesan di Teams setelah mengirimnya. Ini berguna jika Anda menemukan kesalahan ketik atau mengirim sesuatu ke orang yang salah.",
          },
          {
            type: "bullet",
            bold: "Edit pesan",
            text: "Edit pesan — arahkan kursor ke pesan Anda, klik tiga titik (...), lalu klik Edit. Perbarui teks dan tekan Enter. Label kecil 'Diedit' akan muncul sehingga penerima tahu bahwa pesan tersebut telah diubah.",
          },
          {
            type: "bullet",
            bold: "Hapus pesan",
            text: "Hapus pesan — arahkan kursor ke pesan tersebut, klik tiga titik (...), lalu klik Hapus. Pesan tersebut akan diganti dengan 'Pesan ini telah dihapus'.",
          },
          {
            type: "note",
            text: "Anda hanya dapat mengedit atau menghapus pesan Anda sendiri. Anda tidak dapat mengedit atau menghapus pesan yang dikirim oleh orang lain.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t3-c1", text: "Saya telah memulai setidaknya satu obrolan baru dengan rekan kerja", type: "implemented" },
      { id: "t3-c2", text: "Saya memahami perbedaan antara obrolan dan saluran tim", type: "understood" },
      { id: "t3-c3", text: "Saya tahu cara @menyebutkan seseorang untuk menarik perhatiannya", type: "understood" },
      { id: "t3-c4", text: "Saya dapat membalas pesan tertentu menggunakan fitur balasan berurutan", type: "understood" },
      { id: "t3-c5", text: "Saya bisa melampirkan file dalam obrolan", type: "implemented" },
      { id: "t3-c6", text: "Saya tahu cara membuat obrolan grup dan memberi nama padanya", type: "understood" },
    ],
  },

  {
    number: 4,
    title: "Tim dan Saluran",
    subtitle: "Mengatur pekerjaan Anda agar semua orang tetap berada di halaman yang sama",
    whatYouWillLearn: [
      "Perbedaan antara Tim dan Saluran — dan mengapa hal ini penting",
      "Kapan menggunakan saluran Standar, Pribadi, atau Bersama",
      "Cara memposting di saluran dan menjaga agar utas tetap teratur",
      "Cara membuat Tim baru atau menambahkan Saluran",
    ],
    sections: [
      {
        id: "t4-concepts",
        title: "Memahami Tim dan Saluran",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Salah satu konsep terpenting di Microsoft Teams adalah hubungan antara Tim dan Saluran. Memahami hal ini adalah kunci untuk menjaga pekerjaan Anda tetap terorganisir.",
          },
          {
            type: "body",
            text: "Tim adalah ruang kerja untuk sekelompok orang tertentu — sebuah departemen, proyek, kementerian, atau kelompok kerja lainnya. Saluran adalah ruang topik khusus di dalam tim tersebut.",
          },
          {
            type: "body",
            text: "Bayangkan Tim sebagai sebuah gedung dan Saluran sebagai ruangan-ruangan di dalamnya. Gedung tersebut diperuntukkan bagi kelompok tertentu (tim Anda); setiap ruangan memiliki tujuan tertentu (topik yang akan dibahas).",
          },
          {
            type: "body",
            text: "Contoh: Tim = 'Program Pengembangan Kepemimpinan'. Saluran = Umum, Catatan Fasilitator, Sumber Daya Peserta, Doa & Dorongan, Logistik.",
          },
          {
            type: "screenshot",
            description: "Bagian Tim Microsoft Teams — sebuah tim yang diperluas menampilkan daftar salurannya",
            imageUrl: IMG.createTeam,
          },
        ],
      },
      {
        id: "t4-channel-types",
        title: "Jenis-jenis Saluran",
        blocks: [
          {
            type: "body",
            text: "Tidak semua saluran bekerja dengan cara yang sama. Teams menawarkan tiga jenis saluran, masing-masing memiliki tujuan yang berbeda.",
          },
          { type: "h3", text: "Saluran Standar" },
          {
            type: "body",
            text: "Saluran standar dapat dilihat dan diakses oleh setiap anggota tim. Semua anggota dapat membaca dan memposting. Ini adalah jenis default — gunakan untuk sebagian besar percakapan tim, pengumuman, dan sumber daya bersama.",
          },
          { type: "h3", text: "Saluran Pribadi" },
          {
            type: "body",
            text: "Saluran pribadi hanya terlihat oleh anggota tertentu yang Anda undang. Saluran ini menampilkan ikon gembok kecil di sebelah nama saluran. Gunakan saluran pribadi untuk diskusi sensitif — misalnya, topik SDM, percakapan tentang kinerja, atau perencanaan rahasia — yang hanya boleh dilihat oleh sebagian anggota tim.",
          },
          { type: "h3", text: "Saluran Bersama" },
          {
            type: "body",
            text: "Saluran bersama dapat mencakup orang-orang dari luar organisasi Anda — berguna untuk kemitraan eksternal, proyek bersama, atau bekerja sama dengan kontraktor. Peserta eksternal bergabung dengan saluran tanpa perlu menjadi anggota penuh organisasi Microsoft 365 Anda.",
          },
          {
            type: "tip",
            text: "Mulailah dengan sejumlah kecil saluran yang jelas dan diberi nama dengan tepat. Terlalu banyak saluran akan membebani anggota tim dan mengurangi keterlibatan. Aturan yang baik: jika Anda tidak memeriksa saluran setidaknya sekali seminggu, saluran tersebut mungkin belum perlu ada.",
          },
        ],
      },
      {
        id: "t4-posting",
        title: "Memposting di Saluran",
        blocks: [
          {
            type: "body",
            text: "Posting saluran mirip dengan pengumuman papan buletin digital — terlihat oleh semua orang di tim, dan dirancang untuk dibaca dan didiskusikan sebagai kelompok. Posting ini berbeda dari pesan obrolan pribadi.",
          },
          {
            type: "bullet",
            text: "Klik saluran di bilah sisi kiri, lalu ketik pesan Anda di kotak tulis di bagian bawah dan tekan Enter untuk memposting.",
          },
          {
            type: "bullet",
            text: "Klik Balas di bawah postingan yang sudah ada untuk menambahkan tanggapan Anda dalam sebuah utas. Hal ini membuat percakapan tetap mudah dibaca — semua balasan tetap dikelompokkan bersama.",
          },
          {
            type: "bullet",
            text: "Klik 'Percakapan baru' untuk memulai postingan baru dan terpisah yang bukan merupakan balasan dari postingan yang sudah ada.",
          },
          {
            type: "tip",
            text: "Jaga agar saluran tetap fokus pada topiknya. Gunakan saluran Umum untuk pengumuman tim yang luas. Gunakan saluran khusus untuk topik tertentu. Jika percakapan bersifat pribadi atau hanya relevan bagi satu orang, gunakan Obrolan sebagai gantinya.",
          },
        ],
      },
      {
        id: "t4-create",
        title: "Membuat Tim Baru",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Jika organisasi Anda belum memiliki tim yang dibentuk, atau jika Anda memulai proyek baru yang membutuhkan ruang kerja tersendiri, Anda dapat membuatnya.",
          },
          {
            type: "bullet",
            bold: "Klik ikon Tim",
            text: "Klik ikon Tim di bilah navigasi kiri untuk membuka bagian Tim.",
          },
          {
            type: "bullet",
            bold: "Klik 'Gabung atau buat tim'",
            text: "Klik 'Gabung atau buat tim' di bagian bawah daftar tim, lalu pilih 'Buat tim'.",
          },
          {
            type: "bullet",
            bold: "Pilih Pribadi atau Publik",
            text: "Pilih Pribadi (hanya orang yang diundang yang dapat bergabung) atau Publik (siapa pun di organisasi Anda dapat menemukannya dan bergabung).",
          },
          {
            type: "bullet",
            bold: "Beri nama dan deskripsi untuk tim Anda",
            text: "Beri nama dan deskripsi untuk tim Anda — sebutkan secara spesifik. 'Kepemimpinan Lintas Budaya 2026' lebih baik daripada 'Kepemimpinan'.",
          },
          {
            type: "bullet",
            bold: "Tambahkan anggota",
            text: "Tambahkan anggota dengan mengetikkan nama mereka. Mereka akan menerima pemberitahuan bahwa mereka telah ditambahkan ke tim.",
          },
          {
            type: "note",
            text: "Di beberapa organisasi, hanya administrator TI yang dapat membuat tim baru. Jika Anda mendapatkan pesan kesalahan saat mencoba membuat tim, hubungi departemen TI Anda.",
          },
        ],
      },
      {
        id: "t4-channel",
        title: "Menambahkan Saluran Baru",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Setelah tim terbentuk, menambahkan saluran dapat dilakukan dengan cepat dan dapat dilakukan oleh pemilik tim mana pun.",
          },
          {
            type: "bullet",
            bold: "Arahkan kursor ke nama tim",
            text: "Arahkan kursor ke nama tim di daftar Tim dan klik tiga titik (...) yang muncul.",
          },
          {
            type: "bullet",
            bold: "Pilih 'Tambahkan saluran'",
            text: "Pilih 'Tambahkan saluran' dari menu.",
          },
          {
            type: "bullet",
            bold: "Beri nama saluran",
            text: "Beri nama saluran dengan jelas — gunakan nama deskriptif yang memberi tahu anggota secara tepat untuk apa saluran tersebut (mis. 'Sumber Daya Sesi', 'Logistik & Perjalanan').",
          },
          {
            type: "bullet",
            bold: "Pilih 'Standar' atau 'Pribadi'",
            text: "Pilih 'Standar' atau 'Pribadi' tergantung pada siapa yang boleh mengaksesnya, lalu klik 'Tambahkan'.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t4-c1", text: "Saya memahami perbedaan antara Tim dan Saluran", type: "understood" },
      { id: "t4-c2", text: "Saya tahu kapan harus menggunakan saluran Standar, Pribadi, dan Bersama", type: "understood" },
      { id: "t4-c3", text: "Saya bisa membuat postingan di saluran dan membalas utas yang sudah ada", type: "implemented" },
      { id: "t4-c4", text: "Saya tahu cara membuat tim baru atau menambahkan saluran", type: "understood" },
    ],
  },

  {
    number: 5,
    title: "Rapat",
    subtitle: "Menjadwalkan, bergabung, dan berpartisipasi dalam rapat Teams",
    whatYouWillLearn: [
      "Tiga jenis rapat Teams dan kapan masing-masing digunakan",
      "Cara menjadwalkan rapat dari Kalender",
      "Cara bergabung dalam rapat dari tautan, kalender, atau saluran",
      "Fungsi setiap tombol di bilah kontrol rapat",
      "Cara berbagi layar dan merekam rapat",
    ],
    sections: [
      {
        id: "t5-types",
        title: "Tiga Jenis Rapat Teams",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Teams mendukung tiga cara berbeda untuk memulai rapat, masing-masing sesuai dengan situasi yang berbeda. Mengetahui cara mana yang harus digunakan akan menghemat waktu dan menghindari kebingungan.",
          },
          {
            type: "bullet",
            bold: "Rapat terjadwal",
            text: "Rapat terjadwal — direncanakan sebelumnya melalui Kalender Teams. Anda menentukan waktunya, mengundang peserta, dan Teams akan mengirimkan undangan kalender secara otomatis. Cocok untuk rapat tim rutin, sesi pelatihan, dan segala hal yang direncanakan lebih dari beberapa jam sebelumnya.",
          },
          {
            type: "bullet",
            bold: "Rapat saluran",
            text: "Rapat saluran — terkait dengan saluran tertentu dan terlihat oleh semua anggota tim di saluran tersebut. Siapa pun dapat bergabung tanpa undangan individu. Cocok untuk diskusi tim terbuka yang terbuka bagi semua anggota tim.",
          },
          {
            type: "bullet",
            bold: "Bertemu sekarang",
            text: "Bertemu sekarang — rapat instan dan tidak terjadwal yang Anda mulai segera. Tidak ada undangan yang dikirim — Anda membagikan tautan secara manual kepada siapa pun yang ingin Anda undang. Cocok untuk panggilan spontan atau pengecekan cepat.",
          },
        ],
      },
      {
        id: "t5-schedule",
        title: "Menjadwalkan Rapat",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Menjadwalkan sebelumnya adalah pendekatan paling profesional untuk rapat yang direncanakan. Peserta akan menerima undangan kalender yang menyertakan tautan rapat — tidak ada yang perlu mengejar Anda untuk mendapatkan detailnya.",
          },
          {
            type: "screenshot",
            description: "Kalender Microsoft Teams — formulir Rapat Baru terbuka",
            imageUrl: IMG.scheduleMeeting,
          },
          {
            type: "bullet",
            bold: "Klik Kalender",
            text: "Klik Kalender di bilah navigasi kiri untuk membuka tampilan kalender Anda.",
          },
          {
            type: "bullet",
            bold: "Klik 'Pertemuan baru'",
            text: "Klik 'Pertemuan baru' di sudut kanan atas.",
          },
          {
            type: "bullet",
            bold: "Isi detail rapat",
            text: "Isi detail rapat — berikan judul yang jelas, tentukan tanggal, waktu mulai, dan perkiraan waktu berakhir.",
          },
          {
            type: "bullet",
            bold: "Tambahkan peserta",
            text: "Tambahkan peserta dengan mengetikkan nama atau alamat email di kolom 'Tambahkan peserta yang diperlukan'. Teams akan menyarankan orang-orang dari organisasi Anda saat Anda mengetik.",
          },
          {
            type: "bullet",
            bold: "Tambahkan agenda",
            text: "Tambahkan agenda di kotak deskripsi — bahkan daftar poin singkat tentang topik-topik yang akan dibahas dapat membantu peserta mempersiapkan diri dan menjaga agar rapat tetap fokus.",
          },
          {
            type: "bullet",
            bold: "Klik Simpan",
            text: "Klik Simpan — undangan kalender akan dikirim secara otomatis ke semua peserta, lengkap dengan tautan rapat.",
          },
          {
            type: "tip",
            text: "Sertakan agenda dalam setiap undangan rapat — meskipun singkat. Penelitian secara konsisten menunjukkan bahwa rapat dengan agenda yang jelas berlangsung lebih singkat dan menghasilkan hasil yang lebih baik.",
          },
        ],
      },
      {
        id: "t5-join",
        title: "Bergabung dalam Rapat",
        blocks: [
          {
            type: "body",
            text: "Ada beberapa cara untuk bergabung dalam rapat Teams. Cara yang paling umum adalah melalui undangan kalender, tetapi Anda juga mungkin menerima tautan melalui email atau pesan.",
          },
          {
            type: "screenshot",
            description: "Bergabung dalam rapat Teams — layar pra-bergabung dengan pratinjau audio dan video",
            imageUrl: IMG.joinMeeting,
          },
          { type: "h3", text: "Dari Undangan Kalender" },
          {
            type: "body",
            text: "Buka Kalender Teams Anda, klik entri rapat, lalu klik Gabung. Layar pra-gabung akan muncul di mana Anda dapat memeriksa kamera dan mikrofon Anda sebelum masuk.",
          },
          { type: "h3", text: "Dari Tautan Rapat" },
          {
            type: "body",
            text: "Klik tautan 'Klik di sini untuk bergabung dengan rapat' di undangan email Anda. Browser Anda akan terbuka dan Teams akan diluncurkan. Anda akan melihat layar pra-bergabung yang sama untuk memeriksa pengaturan Anda.",
          },
          { type: "h3", text: "Dari Saluran" },
          {
            type: "body",
            text: "Jika rapat diposting di saluran, temukan postingan rapat tersebut dan klik Gabung. Cara ini berlaku untuk rapat saluran yang terbuka untuk semua anggota tim.",
          },
          {
            type: "tip",
            text: "Layar pra-bergabung adalah kesempatan Anda untuk mengaktifkan atau menonaktifkan kamera dan mikrofon sebelum orang lain melihat atau mendengar Anda. Manfaatkanlah — jangan langsung masuk begitu saja.",
          },
        ],
      },
      {
        id: "t5-controls",
        title: "Bilah Kontrol Rapat",
        blocks: [
          {
            type: "body",
            text: "Setelah Anda masuk ke dalam rapat, bilah alat akan muncul di bagian bawah layar Anda. Ini adalah panel kontrol Anda untuk segala hal yang terjadi dalam rapat.",
          },
          {
            type: "bullet",
            bold: "Mikrofon",
            text: "Mikrofon — klik untuk mematikan atau mengaktifkan mikrofon Anda. Saat dimatikan, ikon akan berubah menjadi merah. Matikan mikrofon Anda saat tidak berbicara untuk mengurangi kebisingan latar belakang.",
          },
          {
            type: "bullet",
            bold: "Kamera",
            text: "Kamera — klik untuk mengaktifkan atau menonaktifkan video Anda. Mengaktifkan kamera Anda akan membangun hubungan dan kepercayaan, terutama dalam lingkungan lintas budaya.",
          },
          {
            type: "bullet",
            bold: "Bagikan konten",
            text: "Bagikan konten — tampilkan layar Anda, jendela terbuka tertentu, atau presentasi PowerPoint kepada semua orang dalam rapat.",
          },
          {
            type: "bullet",
            bold: "Reaksi",
            text: "Reaksi — angkat tangan, kirim tepuk tangan, hati, atau reaksi emoji lainnya tanpa harus mengaktifkan mikrofon.",
          },
          {
            type: "bullet",
            bold: "Peserta",
            text: "Peserta — lihat siapa saja yang ada dalam rapat, kelola peserta, dan lihat siapa saja yang ada di ruang tunggu.",
          },
          {
            type: "bullet",
            bold: "Obrolan",
            text: "Obrolan — buka panel obrolan dalam rapat untuk mengirim pesan, berbagi tautan, atau mengajukan pertanyaan tanpa mengganggu pembicara.",
          },
          {
            type: "bullet",
            bold: "Keluar",
            text: "Keluar — klik ikon telepon merah untuk keluar dari rapat. Jika Anda adalah penyelenggara, Anda akan ditanya apakah ingin mengakhiri rapat untuk semua orang atau hanya keluar sendiri.",
          },
          {
            type: "tip",
            text: "Sebelum membagikan layar Anda, tutup tab browser pribadi, email, atau dokumen pribadi yang tidak ingin dilihat orang lain. Bagikan jendela tertentu jika memungkinkan, daripada seluruh desktop Anda.",
          },
        ],
      },
      {
        id: "t5-record",
        title: "Merekam Rapat",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Anda dapat merekam rapat Teams untuk membuat video yang dapat ditinjau oleh peserta nanti. Perekaman ini mencakup video, audio, dan konten layar yang dibagikan.",
          },
          {
            type: "bullet",
            bold: "Klik Lainnya di bilah kontrol",
            text: "Klik Lainnya (...) di bilah kontrol di bagian bawah layar.",
          },
          {
            type: "bullet",
            bold: "Pilih 'Mulai merekam'",
            text: "Pilih 'Mulai merekam' dari menu.",
          },
          {
            type: "bullet",
            bold: "Semua peserta akan diberi tahu",
            text: "Semua peserta akan diberi tahu secara otomatis bahwa rapat sedang direkam — sebuah spanduk akan muncul di layar semua orang.",
          },
          {
            type: "bullet",
            bold: "Hentikan perekaman",
            text: "Hentikan perekaman melalui Lainnya (...) → Hentikan perekaman. File akan disimpan secara otomatis.",
          },
          {
            type: "bullet",
            bold: "Temukan tautan rekaman",
            text: "Temukan tautan rekaman di obrolan rapat setelah rapat berakhir. Untuk rapat saluran, file disimpan ke SharePoint. Untuk rapat pribadi, file disimpan ke OneDrive.",
          },
          {
            type: "note",
            text: "Anda mungkin memerlukan izin dari administrator TI untuk merekam. Beberapa organisasi membatasi perekaman hanya untuk penyelenggara, atau memerlukan persetujuan. Hubungi tim TI Anda jika opsi tersebut tidak tersedia.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t5-c1", text: "Saya memahami tiga jenis rapat Teams dan kapan harus menggunakan masing-masing", type: "understood" },
      { id: "t5-c2", text: "Saya telah menjadwalkan rapat Teams dan mengirim undangan", type: "implemented" },
      { id: "t5-c3", text: "Saya dapat bergabung dalam rapat dari entri kalender, tautan, dan posting saluran", type: "understood" },
      { id: "t5-c4", text: "Saya dapat mengidentifikasi semua tombol di bilah kontrol rapat", type: "understood" },
      { id: "t5-c5", text: "Saya tahu cara mematikan suara sendiri dan menyalakan atau mematikan kamera", type: "implemented" },
    ],
  },

  {
    number: 6,
    title: "Memimpin Rapat Tim",
    subtitle: "Pimpin dengan percaya diri — kendalikan ruang rapat, libatkan kelompok, dan hargai waktu semua orang",
    whatYouWillLearn: [
      "Tiga peran dalam rapat: Penyelenggara, Pemateri, dan Peserta",
      "Cara mengelola ruang tunggu",
      "Cara membisukan peserta dan mengelola izin",
      "Cara menggunakan Spotlight dan Ruang Diskusi",
      "Praktik terbaik lintas budaya untuk rapat yang inklusif",
    ],
    sections: [
      {
        id: "t6-prep",
        title: "Sebelum Rapat — Persiapan",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Rapat yang berjalan lancar hampir selalu merupakan rapat yang dipersiapkan dengan baik. 15 menit yang Anda investasikan sebelum rapat sering kali menghemat 30 menit selama rapat berlangsung.",
          },
          {
            type: "bullet",
            text: "Jadwalkan rapat di Teams dan tambahkan semua peserta yang diperlukan — mereka akan menerima undangan kalender otomatis.",
          },
          {
            type: "bullet",
            text: "Tulis agenda yang jelas di deskripsi rapat — setidaknya, cantumkan topik-topik dan berapa lama waktu yang direncanakan untuk masing-masing topik.",
          },
          {
            type: "bullet",
            text: "Bagikan dokumen apa pun yang perlu dibaca peserta sebelumnya dengan melampirkannya ke undangan rapat atau mempostingnya di saluran yang relevan.",
          },
          {
            type: "bullet",
            text: "Uji audio dan kamera Anda 5 menit sebelum rapat dimulai — jangan sampai menemukan masalah teknis setelah rapat dimulai.",
          },
          {
            type: "tip",
            text: "Kirimkan agenda setidaknya 24 jam sebelumnya. Rapat dengan agenda yang jelas biasanya berlangsung lebih singkat dan menghasilkan keputusan yang lebih baik — peserta datang dengan persiapan yang matang daripada harus menyesuaikan diri selama rapat.",
          },
        ],
      },
      {
        id: "t6-roles",
        title: "Peran dalam Rapat — Siapa yang Bisa Melakukan Apa",
        blocks: [
          {
            type: "body",
            text: "Setiap rapat Teams memiliki tiga jenis peserta, masing-masing dengan izin yang berbeda. Memahami peran-peran ini membantu Anda menjalankan rapat dengan tingkat kontrol yang tepat.",
          },
          { type: "h3", text: "Penyelenggara" },
          {
            type: "body",
            text: "Orang yang menjadwalkan rapat. Memiliki kendali penuh: dapat mengubah pengaturan rapat, menerima dan mengeluarkan peserta, memulai perekaman, dan mengakhiri rapat untuk semua orang.",
          },
          { type: "h3", text: "Pembicara" },
          {
            type: "body",
            text: "Dapat membagikan konten, membisukan orang lain, dan mengelola peserta. Penyelenggara dapat mempromosikan peserta mana pun menjadi Pembicara, atau membatasi hak Pembicara hanya untuk orang-orang tertentu. Gunakan ini jika Anda memiliki rekan fasilitator yang perlu membagikan layarnya atau mengelola ruang rapat.",
          },
          { type: "h3", text: "Peserta" },
          {
            type: "body",
            text: "Dapat berpartisipasi dalam rapat, menggunakan obrolan, dan bereaksi. Tidak dapat membagikan konten atau mengelola peserta lain kecuali dipromosikan oleh penyelenggara.",
          },
          {
            type: "body",
            text: "Untuk mengubah peran seseorang selama rapat: buka panel Orang → klik kanan nama mereka → pilih 'Jadikan presenter' atau 'Jadikan peserta'.",
          },
        ],
      },
      {
        id: "t6-lobby",
        title: "Mengelola Lobi",
        blocks: [
          {
            type: "body",
            text: "Lobi adalah area tunggu tempat peserta menunggu sebelum diizinkan masuk ke rapat. Ini memberi Anda kendali atas siapa yang masuk dan kapan — mirip dengan ruang tunggu di Zoom.",
          },
          {
            type: "body",
            text: "Anda dapat mengatur siapa yang masuk ke lobi dan siapa yang dapat melewatinya di pengaturan rapat. Sebagai penyelenggara, Anda yang mengizinkan (atau menolak) setiap orang yang menunggu di lobi.",
          },
          {
            type: "bullet",
            text: "Sebelum rapat: buka rapat di Kalender Anda → Edit → Opsi rapat → atur 'Siapa yang dapat melewati lobi' sesuai preferensi Anda (misalnya Hanya saya, Orang yang saya undang, atau Semua orang).",
          },
          {
            type: "bullet",
            text: "Selama rapat: klik Orang di bilah kontrol. Bagian lobi di bagian atas menunjukkan siapa yang sedang menunggu. Klik Izinkan untuk mengizinkan mereka masuk, atau Tolak untuk menolak mereka.",
          },
          {
            type: "tip",
            text: "Untuk sesi pelatihan yang hanya mengundang peserta tertentu, atur 'Siapa yang dapat melewati lobi' menjadi 'Orang yang saya undang'. Dengan cara ini, peserta eksternal akan masuk ke lobi, tetapi rekan kerja internal Anda dapat langsung bergabung.",
          },
        ],
      },
      {
        id: "t6-mute",
        title: "Menonaktifkan Suara Peserta",
        blocks: [
          {
            type: "body",
            text: "Sebagai penyelenggara atau pembicara rapat, Anda dapat membisukan peserta mana pun — berguna saat suara latar mengganggu kelompok, atau saat Anda perlu mengambil alih kendali kembali.",
          },
          {
            type: "bullet",
            text: "Mematikan suara satu orang — buka 'Peserta' → arahkan kursor ke nama mereka → klik ikon mikrofon → 'Mematikan suara peserta'.",
          },
          {
            type: "bullet",
            text: "Menonaktifkan suara semua orang sekaligus — buka Orang → klik 'Nonaktifkan suara semua'. Peserta masih dapat mengaktifkan kembali suara mereka kecuali Anda menonaktifkan izin tersebut.",
          },
          {
            type: "bullet",
            text: "Mencegah peserta mengaktifkan kembali mikrofon mereka sendiri — klik Lainnya (...) → Opsi rapat → nonaktifkan 'Izinkan mikrofon untuk peserta'. Anda sekarang mengontrol kapan setiap orang berbicara.",
          },
          {
            type: "note",
            text: "Membisukan peserta tanpa peringatan dapat terasa mendadak dalam beberapa konteks budaya. Pertimbangkan untuk mengumumkannya terlebih dahulu: 'Untuk mengurangi kebisingan latar belakang, saya akan membisukan semua orang. Silakan gunakan Raise Hand jika Anda ingin berbicara.'",
          },
        ],
      },
      {
        id: "t6-breakout",
        title: "Ruang Diskusi",
        blocks: [
          {
            type: "body",
            text: "Ruang breakout di Teams berfungsi sama seperti di Zoom — Anda membagi rapat utama menjadi kelompok-kelompok kecil untuk berdiskusi, lalu mengumpulkan semua orang kembali. Hanya penyelenggara rapat yang dapat membuat ruang breakout.",
          },
          {
            type: "bullet",
            text: "Klik Lainnya (...) di bilah kontrol → pilih Ruang breakout.",
          },
          {
            type: "bullet",
            text: "Pilih jumlah ruang dan cara menugaskan peserta — secara otomatis (acak) atau manual (Anda yang menentukan siapa yang masuk ke mana).",
          },
          {
            type: "bullet",
            text: "Klik Buka ruang untuk mengirim semua orang ke kelompok breakout mereka. Peserta akan menerima undangan otomatis untuk bergabung ke ruang mereka.",
          },
          {
            type: "bullet",
            text: "Klik Tutup ruang untuk membawa semua orang kembali ke rapat utama — peserta memiliki waktu 60 detik untuk kembali.",
          },
          {
            type: "tip",
            text: "Berikan tugas yang jelas kepada setiap kelompok breakout sebelum membuka ruang — pertanyaan spesifik untuk didiskusikan, masalah yang harus diselesaikan, atau hasil kerja singkat yang harus dihasilkan. Kelompok tanpa tugas yang jelas cenderung cepat kehilangan fokus.",
          },
        ],
      },
      {
        id: "t6-multicultural",
        title: "Praktik Terbaik untuk Rapat Multikultural",
        blocks: [
          {
            type: "body",
            text: "Memimpin rapat dengan peserta dari latar belakang budaya yang berbeda membutuhkan perhatian ekstra. Apa yang terasa normal dalam satu budaya bisa terasa kasar atau membingungkan dalam budaya lain.",
          },
          {
            type: "bullet",
            text: "Mulailah tepat waktu dan patuhi agenda — hal ini menunjukkan rasa hormat terhadap waktu semua orang, terlepas dari latar belakang budayanya.",
          },
          {
            type: "bullet",
            text: "Buka dengan sesi perkenalan singkat — satu menit per orang: 'Bagaimana kabarmu minggu ini?' Hal ini membangun koneksi dan membantu orang-orang beralih dari aktivitas sebelumnya.",
          },
          {
            type: "bullet",
            text: "Ajaklah peserta yang lebih pendiam untuk berbagi — dalam beberapa budaya, berbicara tanpa diajak secara langsung dianggap tidak pantas. Gunakan Raise Hand atau panggil orang secara langsung: 'Liu Wei, bagaimana menurutmu?'",
          },
          {
            type: "bullet",
            text: "Saat berbagi layar, jelaskan apa yang Anda lakukan — tidak semua orang dapat melihat layar Anda dengan jelas karena perbedaan ukuran layar, kecepatan koneksi, atau gangguan penglihatan.",
          },
          {
            type: "bullet",
            text: "Akhiri dengan poin tindakan yang jelas — sebutkan siapa yang melakukan apa dan kapan. Tuliskan ini di obrolan rapat agar ada catatan tertulis yang dapat dirujuk oleh semua orang.",
          },
          {
            type: "tip",
            text: "Untuk tim yang tersebar di berbagai zona waktu, atur jadwal rapat secara bergiliran agar orang yang sama tidak selalu berada di slot pagi hari atau malam hari. Jadwal bergiliran yang sederhana menunjukkan bahwa waktu setiap orang dihargai secara setara.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t6-c1", text: "Saya memahami perbedaan antara peran Penyelenggara, Pemateri, dan Peserta", type: "understood" },
      { id: "t6-c2", text: "Saya tahu cara mengelola ruang tunggu dan mengizinkan peserta masuk", type: "understood" },
      { id: "t6-c3", text: "Saya dapat membisukan peserta satu per satu atau semua peserta sekaligus", type: "implemented" },
      { id: "t6-c4", text: "Saya tahu cara membuat dan mengelola Ruang Diskusi", type: "understood" },
      { id: "t6-c5", text: "Saya telah menerapkan setidaknya satu praktik terbaik multikultural dalam rapat", type: "implemented" },
    ],
  },

  {
    number: 7,
    title: "File",
    subtitle: "Berbagi, mengedit bersama, dan mencari dokumen — tanpa lampiran email",
    whatYouWillLearn: [
      "Cara berbagi file di obrolan atau saluran",
      "Di mana file disimpan dan cara menemukannya",
      "Bagaimana beberapa orang dapat mengedit dokumen yang sama secara bersamaan",
      "Cara mengakses semua file tim Anda di satu tempat",
    ],
    sections: [
      {
        id: "t7-why",
        title: "Mengapa Menggunakan File di Teams?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Salah satu masalah paling umum dalam kerja tim adalah kebingungan versi — banyak salinan dokumen yang sama beredar melalui email, tidak ada yang tahu mana yang terbaru, dan perubahan hilang saat dua orang menyimpan secara bersamaan.",
          },
          {
            type: "body",
            text: "Teams mengatasi hal ini dengan menyimpan semua berkas yang dibagikan di satu tempat terpusat (SharePoint atau OneDrive, terintegrasi ke dalam Teams). Semua orang bekerja pada berkas yang sama, semua perubahan disimpan secara otomatis, dan Anda selalu dapat melihat siapa yang mengubah apa.",
          },
        ],
      },
      {
        id: "t7-chat",
        title: "Berbagi File di Obrolan",
        procedural: true,
        blocks: [
          {
            type: "screenshot",
            description: "Mengunggah dan berbagi file di obrolan Microsoft Teams",
            imageUrl: IMG.files,
          },
          {
            type: "bullet",
            bold: "Buka obrolan atau saluran",
            text: "Buka obrolan atau saluran tempat Anda ingin membagikan file tersebut.",
          },
          {
            type: "bullet",
            bold: "Klik ikon penjepit kertas (Lampirkan)",
            text: "Klik ikon penjepit kertas (Lampirkan) di kotak penulisan pesan.",
          },
          {
            type: "bullet",
            bold: "Pilih sumber Anda",
            text: "Pilih sumber Anda — Unggah dari komputer saya (pilih file dari hard drive Anda), OneDrive (file yang sudah disimpan di cloud), atau Teams dan Saluran (file yang sudah dibagikan di Teams).",
          },
          {
            type: "bullet",
            bold: "Pilih file dan kirim",
            text: "Pilih file dan kirim — penerima akan melihatnya muncul di obrolan sebagai kartu pratinjau. Mereka dapat mengklik untuk membukanya langsung di Teams tanpa mengunduhnya.",
          },
          {
            type: "tip",
            text: "Saat Anda membagikan file di Teams, Anda membagikan tautan ke file asli — bukan salinannya. Ini berarti setiap perubahan yang Anda buat langsung terlihat oleh semua orang yang memiliki akses. Hanya ada satu versi.",
          },
        ],
      },
      {
        id: "t7-channel-files",
        title: "File di Saluran — Tab File",
        blocks: [
          {
            type: "body",
            text: "Setiap saluran di Teams memiliki tab File. Di sinilah semua dokumen yang dibagikan dalam postingan saluran tersebut disimpan, diatur, dan dapat diakses oleh setiap anggota tim. Anggap saja sebagai folder bersama untuk saluran tersebut.",
          },
          {
            type: "bullet",
            text: "Klik tab File di bagian atas saluran mana pun untuk menelusuri semua file yang dibagikan — Anda akan melihat dokumen yang diurutkan berdasarkan tanggal, dengan yang terbaru di bagian atas.",
          },
          {
            type: "bullet",
            text: "Klik Baru untuk membuat file Word, Excel, atau PowerPoint baru langsung di dalam Teams — tidak perlu membuka aplikasi Office secara terpisah.",
          },
          {
            type: "bullet",
            text: "Klik Unggah untuk menambahkan file yang sudah ada dari komputer Anda langsung ke penyimpanan saluran.",
          },
          {
            type: "note",
            text: "File yang dibagikan di tab Posting saluran secara otomatis disimpan di tab File. Anda tidak perlu menambahkannya dua kali. Tab File hanyalah tampilan terorganisir dari semua yang telah dibagikan di saluran tersebut.",
          },
        ],
      },
      {
        id: "t7-coedit",
        title: "Mengedit Dokumen Bersama-sama",
        blocks: [
          {
            type: "body",
            text: "Salah satu fitur paling hebat di Teams adalah kemampuan bagi banyak orang untuk mengedit file Word, Excel, atau PowerPoint yang sama secara bersamaan — secara real time, di dalam Teams, tanpa perlu saling mengirim file melalui email.",
          },
          {
            type: "body",
            text: "Untuk mengedit bersama: klik file Office apa pun yang dibagikan di saluran atau obrolan. File tersebut akan terbuka di dalam Teams menggunakan editor bawaan. Anda akan melihat kursor berwarna dari editor lain bergerak di dalam dokumen saat mereka mengetik. Semua perubahan disimpan secara otomatis.",
          },
          {
            type: "tip",
            text: "Pengeditan bersama secara real-time menghilangkan masalah 'final_v3_REALLY_FINAL.docx' secara permanen. Hanya ada satu file, semua orang mengerjakannya bersama-sama, dan riwayat versi disimpan secara otomatis — Anda selalu dapat kembali ke versi sebelumnya jika diperlukan.",
          },
        ],
      },
      {
        id: "t7-find-files",
        title: "Mencari File di Seluruh Tim",
        blocks: [
          {
            type: "body",
            text: "Jika Anda tidak ingat di saluran mana file tersebut dibagikan, gunakan bagian File di bilah navigasi sebelah kiri. Bagian ini menampilkan semua file yang dibagikan di seluruh tim dan obrolan Anda dalam satu tampilan.",
          },
          {
            type: "body",
            text: "Anda juga dapat menggunakan bilah pencarian di bagian atas Teams untuk mencari file berdasarkan nama — Teams akan menampilkan file tersebut beserta saluran atau obrolan asalnya.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t7-c1", text: "Saya telah membagikan file di obrolan atau saluran", type: "implemented" },
      { id: "t7-c2", text: "Saya tahu di mana menemukan tab File di dalam saluran", type: "understood" },
      { id: "t7-c3", text: "Saya memahami cara kerja pengeditan bersama dan mengapa hal itu menghilangkan kebingungan versi", type: "understood" },
      { id: "t7-c4", text: "Saya tahu cara mencari file di seluruh tim saya", type: "understood" },
    ],
  },

  {
    number: 8,
    title: "Pemberitahuan dan Status",
    subtitle: "Tetap terinformasi tanpa kewalahan — hilangkan gangguan, fokus pada hal yang penting",
    whatYouWillLearn: [
      "Empat jenis pemberitahuan di Teams dan kapan masing-masing muncul",
      "Cara mengatur pengaturan notifikasi Anda",
      "Cara membisukan saluran yang ramai tanpa kehilangan akses ke saluran tersebut",
      "Cara menggunakan status Anda untuk menunjukkan ketersediaan Anda",
    ],
    sections: [
      {
        id: "t8-problem",
        title: "Masalah Pemberitahuan",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Tim dapat dengan cepat menjadi membingungkan jika Anda tidak mengatur pemberitahuan dengan cermat. Secara default, setiap pesan di setiap saluran akan memberi tahu Anda — dan jika Anda tergabung dalam beberapa tim aktif, hal ini menjadi sulit dikendalikan.",
          },
          {
            type: "body",
            text: "Kabar baiknya adalah Teams memberi Anda kontrol yang sangat detail atas apa yang memberi tahu Anda dan bagaimana caranya. Meluangkan 5 menit untuk pengaturan pemberitahuan Anda akan membuat Teams terasa tenang dan mudah dikelola, bukan seperti banjir gangguan.",
          },
        ],
      },
      {
        id: "t8-types",
        title: "Jenis-jenis Pemberitahuan",
        blocks: [
          {
            type: "body",
            text: "Teams menggunakan empat metode pemberitahuan yang berbeda. Masing-masing dapat dikonfigurasi secara terpisah:",
          },
          {
            type: "bullet",
            bold: "Banner",
            text: "Banner — notifikasi pop-up yang muncul di sudut layar Anda, bahkan saat Teams berada di latar belakang. Jenis yang paling mengganggu.",
          },
          {
            type: "bullet",
            bold: "Feed",
            text: "Feed — pemberitahuan muncul tanpa suara di feed Aktivitas Anda (ikon lonceng). Anda akan melihatnya saat membuka Teams berikutnya, tetapi tidak mengganggu Anda saat ini.",
          },
          {
            type: "bullet",
            bold: "Email",
            text: "Email — Teams dapat mengirimkan email ringkasan yang merangkum pesan yang terlewat. Berguna jika Anda offline dalam waktu lama.",
          },
          {
            type: "bullet",
            bold: "Lambang",
            text: "Lambang — angka pada ikon Teams di bilah tugas yang menunjukkan jumlah item yang belum dibaca.",
          },
        ],
      },
      {
        id: "t8-configure",
        title: "Mengonfigurasi Pemberitahuan Anda",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Berikut cara mengakses pengaturan notifikasi Anda dan seperti apa konfigurasi yang disarankan untuk sebagian besar pengguna.",
          },
          {
            type: "bullet",
            bold: "Buka Pengaturan",
            text: "Buka Pengaturan dengan mengklik foto profil Anda di pojok kanan atas, lalu pilih Pengaturan.",
          },
          {
            type: "bullet",
            bold: "Klik Pemberitahuan",
            text: "Klik Pemberitahuan di menu sebelah kiri panel pengaturan.",
          },
          {
            type: "bullet",
            bold: "Sesuaikan setiap jenis pemberitahuan",
            text: "Sesuaikan setiap jenis pemberitahuan — Anda akan melihat bagian untuk @sebutan, balasan atas pesan Anda, pesan saluran, rapat, dan lainnya.",
          },
          {
            type: "tip",
            text: "Titik awal yang disarankan: atur @mentions dan pesan langsung ke Banner (agar Anda tidak melewatkan kontak langsung). Atur pesan saluran ke Feed saja (tanpa pop-up). Ini berarti percakapan aktif tidak akan mengganggu Anda, tetapi siapa pun yang benar-benar membutuhkan Anda tetap dapat menghubungi Anda.",
          },
        ],
      },
      {
        id: "t8-mute-channel",
        title: "Menonaktifkan Saluran yang Ramai",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Beberapa saluran menghasilkan banyak pesan — pengumuman umum, percakapan santai, atau pembaruan yang berguna tetapi tidak mendesak. Anda dapat membisukan saluran untuk menghentikan penerimaan notifikasi darinya sambil tetap memiliki akses penuh untuk membaca kontennya kapan pun Anda mau.",
          },
          {
            type: "bullet",
            bold: "Klik kanan nama saluran",
            text: "Klik kanan nama saluran di daftar Teams Anda.",
          },
          {
            type: "bullet",
            bold: "Pilih 'Nonaktifkan suara saluran'",
            text: "Pilih 'Nonaktifkan suara saluran' dari menu.",
          },
          {
            type: "body",
            text: "Ikon saluran akan tampak sedikit abu-abu untuk menunjukkan bahwa saluran tersebut telah dibisukan. Anda masih dapat menavigasi ke sana dan membaca semuanya — Anda hanya tidak akan menerima pemberitahuan apa pun dari saluran tersebut.",
          },
          {
            type: "note",
            text: "Menonaktifkan suara saluran tidak akan menonaktifkan @mentions. Jika seseorang secara langsung @mention Anda di saluran yang dinonaktifkan suaranya, Anda tetap akan menerima notifikasi.",
          },
        ],
      },
      {
        id: "t8-status",
        title: "Menggunakan Status Anda Secara Efektif",
        blocks: [
          {
            type: "body",
            text: "Status Anda adalah alat komunikasi yang sederhana namun ampuh. Jika Anda terus memperbaruinya, rekan kerja Anda akan tahu apakah ini waktu yang tepat untuk menghubungi Anda — sehingga mengurangi gangguan bagi Anda dan rasa frustrasi bagi mereka.",
          },
          {
            type: "bullet",
            bold: "Tersedia",
            text: "Tersedia — lingkaran hijau. Anda sedang di meja kerja dan bebas untuk merespons.",
          },
          {
            type: "bullet",
            bold: "Sibuk",
            text: "Sibuk — lingkaran merah. Anda sedang dalam rapat atau fokus bekerja. Pesan diterima tetapi Anda akan membalasnya nanti.",
          },
          {
            type: "bullet",
            bold: "Jangan Ganggu",
            text: "Jangan Ganggu — lingkaran merah dengan garis. Semua notifikasi dibisukan. Gunakan ini untuk sesi kerja intensif atau saat Anda sedang presentasi dan tidak boleh diganggu.",
          },
          {
            type: "bullet",
            bold: "Segera Kembali",
            text: "Segera Kembali — jam kuning. Anda sedang pergi sebentar dan akan segera kembali.",
          },
          {
            type: "bullet",
            bold: "Tidak Ada di Tempat",
            text: "Tidak Ada di Tempat — jam kuning. Teams mengatur ini secara otomatis saat komputer Anda tidak aktif untuk sementara waktu. Anda juga dapat mengaturnya secara manual.",
          },
          {
            type: "tip",
            text: "Tambahkan pesan status untuk memberikan konteks: 'Sedang mengikuti pelatihan hingga pukul 15.00 — akan memeriksa pesan pada pukul 14.00' atau 'Waktu kerja intensif hingga siang hari'. Klik foto profil Anda → Atur pesan status. Hal ini memberikan informasi yang dibutuhkan rekan kerja Anda untuk memutuskan apakah pesan mereka dapat ditunda.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t8-c1", text: "Saya telah mengatur pengaturan notifikasi saya untuk mengurangi gangguan", type: "implemented" },
      { id: "t8-c2", text: "Saya tahu cara membisukan saluran yang ramai sambil tetap mengaksesnya", type: "understood" },
      { id: "t8-c3", text: "Saya selalu memperbarui status saya agar mencerminkan ketersediaan saya dengan akurat", type: "implemented" },
      { id: "t8-c4", text: "Saya memahami arti setiap warna status bagi rekan kerja saya", type: "understood" },
    ],
  },

  {
    number: 9,
    title: "Desktop vs. Seluler",
    subtitle: "Memanfaatkan setiap versi secara maksimal — mengetahui kapan harus menggunakan yang mana",
    whatYouWillLearn: [
      "Fitur apa saja yang hanya tersedia di aplikasi desktop",
      "Kasus penggunaan terbaik untuk setiap versi",
      "Tips praktis untuk menggunakan Teams secara efektif di ponsel Anda",
    ],
    sections: [
      {
        id: "t9-overview",
        title: "Dua Alat, Satu Platform",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Teams dapat digunakan baik di komputer desktop maupun ponsel Anda, dan pesan, rapat, serta file Anda akan langsung tersinkronisasi di antara keduanya. Namun, kedua versi ini tidak identik — masing-masing memiliki kelebihan yang tidak dimiliki oleh yang lain.",
          },
          {
            type: "body",
            text: "Aplikasi desktop adalah versi dengan fitur lengkap — dirancang untuk pekerjaan mendalam, memimpin rapat, mengelola tim, dan mengedit file. Aplikasi seluler dioptimalkan untuk tetap terhubung saat bepergian — balasan cepat, bergabung dalam rapat, dan memeriksa notifikasi saat Anda jauh dari meja kerja.",
          },
          {
            type: "body",
            text: "Anda tidak perlu memilih salah satu — gunakan keduanya. Pahami saja keunggulan masing-masing sehingga Anda dapat menggunakan alat yang tepat pada saat yang tepat.",
          },
        ],
      },
      {
        id: "t9-compare",
        title: "Perbandingan Berdampingan",
        blocks: [
          {
            type: "table",
            headers: ["Fitur", "Aplikasi Desktop", "Aplikasi Seluler"],
            rows: [
              ["Navigasi", "Bilah samping kiri dengan ikon", "Bilah tab bawah"],
              ["Obrolan dan Saluran", "Akses penuh", "Akses penuh"],
              ["Kontrol rapat", "Kontrol penuh", "Kontrol penuh"],
              ["Berbagi layar", "Penuh — jendela apa pun atau layar penuh", "Hanya layar ponsel"],
              ["Ruang diskusi", "Pengelolaan penuh", "Dapat bergabung, pengelolaan terbatas"],
              ["Instal aplikasi pihak ketiga", "Ya", "Tidak tersedia — hanya desktop"],
              ["Pembuatan file", "Buat dokumen Word/Excel/PowerPoint di dalam Teams", "Hanya dapat dilihat dan diedit"],
              ["Pemburaman latar belakang", "Ya", "Ya (pada perangkat yang didukung)"],
              ["Pintasan keyboard", "Banyak pintasan yang tersedia", "Tidak berlaku"],
              ["Terbaik untuk", "Bekerja secara mendalam, memimpin rapat, mengedit file", "Balasan cepat, bergabung dalam rapat saat bepergian"],
            ],
          },
        ],
      },
      {
        id: "t9-mobile-tips",
        title: "Memanfaatkan Teams di Ponsel Secara Maksimal",
        blocks: [
          {
            type: "body",
            text: "Aplikasi seluler lebih mumpuni daripada yang disadari banyak orang. Berikut beberapa tips agar aplikasi ini berfungsi dengan baik untuk Anda:",
          },
          {
            type: "bullet",
            text: "Geser ke kanan pada pesan di obrolan atau saluran untuk membalasnya dengan cepat tanpa perlu mencari tombol Balas.",
          },
          {
            type: "bullet",
            text: "Ketuk dan tahan pada pesan apa pun untuk melihat semua opsi yang tersedia — bereaksi, membalas, menyalin, meneruskan, atau menyimpan.",
          },
          {
            type: "bullet",
            text: "Gunakan widget di layar beranda ponsel Anda (tersedia untuk iPhone dan Android) untuk melihat rapat mendatang secara langsung tanpa membuka aplikasi.",
          },
          {
            type: "bullet",
            text: "Sesuaikan pengaturan notifikasi seluler secara terpisah dari desktop — Anda mungkin ingin notifikasi banner di seluler tetapi hanya notifikasi Feed di desktop, atau sebaliknya.",
          },
          {
            type: "tip",
            text: "Rekomendasi: gunakan aplikasi desktop sebagai alat kerja utama Anda untuk memimpin rapat, mengedit file, dan mengelola tim. Gunakan aplikasi seluler untuk tetap terhubung saat Anda jauh dari meja kerja — tetapi tahan godaan untuk mengelola pekerjaan yang rumit dari ponsel Anda.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t9-c1", text: "Saya memahami fitur mana saja yang hanya tersedia di aplikasi desktop", type: "understood" },
      { id: "t9-c2", text: "Saya telah menginstal dan mengonfigurasi Teams di desktop dan ponsel", type: "implemented" },
      { id: "t9-c3", text: "Saya tahu kapan harus menggunakan aplikasi desktop dan kapan harus menggunakan aplikasi seluler", type: "understood" },
    ],
  },

  {
    number: 10,
    title: "Referensi Cepat",
    subtitle: "Pintasan, tugas umum, dan apa yang harus dilakukan jika terjadi masalah",
    whatYouWillLearn: [
      "Semua pintasan keyboard penting untuk aplikasi desktop",
      "Panduan langkah demi langkah untuk tugas-tugas paling umum",
      "Cara mengatasi masalah yang paling sering terjadi",
    ],
    sections: [
      {
        id: "t10-shortcuts",
        title: "Pintasan Keyboard (Aplikasi Desktop)",
        blocks: [
          {
            type: "body",
            text: "Pintasan keyboard memungkinkan Anda menavigasi Teams lebih cepat tanpa harus mencari-cari di menu. Anda tidak perlu menghafal semuanya — mulailah dengan 3 atau 4 pintasan yang paling sering Anda gunakan.",
          },
          {
            type: "table",
            headers: ["Tindakan", "Pintasan (Windows / Mac)"],
            rows: [
              ["Mulai obrolan baru", "Ctrl+N / Cmd+N"],
              ["Buka Pencarian", "Ctrl+E / Cmd+E"],
              ["Pindah ke tim atau saluran", "Ctrl+G / Cmd+G"],
              ["Mematikan/mengaktifkan suara dalam rapat", "Ctrl+Shift+M / Cmd+Shift+M"],
              ["Aktifkan/nonaktifkan kamera dalam rapat", "Ctrl+Shift+O / Cmd+Shift+O"],
              ["Mengangkat atau menurunkan tangan", "Ctrl+Shift+K / Cmd+Shift+K"],
              ["Mulai berbagi layar", "Ctrl+Shift+E / Cmd+Shift+E"],
              ["Menerima panggilan masuk", "Ctrl+Shift+A / Cmd+Shift+A"],
              ["Menolak panggilan masuk", "Ctrl+Shift+D / Cmd+Shift+D"],
              ["Buka umpan Aktivitas", "Ctrl+1 / Cmd+1"],
              ["Buka Obrolan", "Ctrl+2 / Cmd+2"],
              ["Buka bagian Tim", "Ctrl+3 / Cmd+3"],
              ["Buka Kalender", "Ctrl+4 / Cmd+4"],
            ],
          },
        ],
      },
      {
        id: "t10-tasks",
        title: "Tugas Umum — Panduan Langkah Cepat",
        blocks: [
          {
            type: "body",
            text: "Gunakan ini sebagai panduan referensi cepat saat Anda lupa langkah-langkah untuk tugas umum.",
          },
          { type: "h3", text: "Kirim pesan ke seseorang" },
          {
            type: "body",
            text: "Obrolan → ikon pensil (tulis) → ketik nama di kolom Kepada → ketik pesan → tekan Enter.",
          },
          { type: "h3", text: "Mulai rapat instan" },
          {
            type: "body",
            text: "Kalender → tombol 'Bertemu sekarang' (kanan atas) → Mulai rapat → bagikan tautan kepada peserta.",
          },
          { type: "h3", text: "Bagikan layar Anda dalam rapat" },
          {
            type: "body",
            text: "Di dalam rapat → tombol Bagikan konten di bilah kontrol → pilih Layar, Jendela, atau PowerPoint → klik Bagikan.",
          },
          { type: "h3", text: "Temukan file yang dibagikan seseorang" },
          {
            type: "body",
            text: "File (navigasi kiri) → telusuri berdasarkan tim dan saluran, atau gunakan bilah pencarian di bagian atas Teams.",
          },
          { type: "h3", text: "Ubah status Anda" },
          {
            type: "body",
            text: "Foto profil (kanan atas) → klik status Anda saat ini → pilih status baru dari menu tarik-turun.",
          },
          { type: "h3", text: "Menonaktifkan suara saluran yang ramai" },
          {
            type: "body",
            text: "Klik kanan nama saluran di daftar Teams → pilih 'Mute channel'.",
          },
        ],
      },
      {
        id: "t10-trouble",
        title: "Pemecahan Masalah Cepat",
        blocks: [
          {
            type: "body",
            text: "Sebagian besar masalah Teams termasuk dalam beberapa kategori saja. Berikut cara cepat mengatasi masalah yang paling umum.",
          },
          {
            type: "bullet",
            bold: "Tidak dapat mendengar audio dalam rapat",
            text: "Tidak dapat mendengar audio dalam rapat — klik Lainnya (...) → Pengaturan perangkat → periksa apakah speaker yang benar telah dipilih. Periksa juga volume sistem komputer Anda.",
          },
          {
            type: "bullet",
            bold: "Kamera tidak berfungsi",
            text: "Kamera tidak berfungsi — klik Lainnya (...) → Pengaturan perangkat → pilih kamera yang benar. Jika masih tidak berfungsi, periksa pengaturan privasi komputer Anda (Windows: Pengaturan → Privasi → Kamera; Mac: Preferensi Sistem → Privasi → Kamera).",
          },
          {
            type: "bullet",
            bold: "Pesan tidak dimuat",
            text: "Pesan tidak dimuat — klik foto profil Anda → Keluar, lalu masuk kembali. Jika masalah berlanjut, tutup dan mulai ulang aplikasi Teams.",
          },
          {
            type: "bullet",
            bold: "Tidak menerima notifikasi",
            text: "Tidak menerima notifikasi — buka Pengaturan → Notifikasi dan pastikan preferensi Anda sudah diatur dengan benar. Periksa juga pengaturan notifikasi sistem komputer Anda — Teams mungkin telah diblokir di tingkat sistem.",
          },
          {
            type: "bullet",
            bold: "Teams berjalan lambat",
            text: "Teams berjalan lambat — periksa pembaruan (klik ... di dekat profil Anda → Periksa pembaruan). Memulai ulang Teams sering kali juga menyelesaikan masalah kinerja.",
          },
          {
            type: "tip",
            text: "Selalu perbarui Teams. Klik tiga titik (...) di dekat foto profil Anda → Periksa pembaruan. Pembaruan memperbaiki sebagian besar bug dan kerentanan keamanan yang diketahui — aplikasi yang sudah ketinggalan zaman akan berjalan lebih lambat dan kurang aman.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t10-c1", text: "Saya telah menghafal setidaknya 3 pintasan keyboard yang akan saya gunakan secara rutin", type: "implemented" },
      { id: "t10-c2", text: "Saya tahu cara menemukan tindakan yang paling umum tanpa harus mencarinya", type: "understood" },
      { id: "t10-c3", text: "Saya tahu langkah-langkah awal yang harus diambil ketika ada sesuatu yang tidak berfungsi", type: "understood" },
      { id: "t10-c4", text: "Saya merasa percaya diri menggunakan Microsoft Teams untuk pekerjaan sehari-hari dan rapat tim", type: "understood" },
    ],
  },
];
