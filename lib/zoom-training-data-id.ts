import { TrainingPart } from "@/components/Training/types";

const IMG = {
  desktop: "/training/zoom/zoom-home-screen.png",
  toolbar: "/training/zoom/zoom-screenshare-toolbar.png",
  video: "/training/zoom/zoom-settings-video.png",
  audio: "/training/zoom/zoom-settings-audio.png",
  gallery: "/training/zoom/zoom-gallery-view.png",
  breakout: "/training/zoom/zoom-breakout-rooms.png",
  chat: "/training/zoom/zoom-chat-panel.png",
  recording: "/training/zoom/zoom-recording.png",
  hostControls: "/training/zoom/zoom-host-controls.png",
  whiteboard: "/training/zoom/zoom-whiteboard.png",
  security: "/training/zoom/zoom-security.png",
};

export const ZOOM_PARTS_ID: TrainingPart[] = [
  {
    number: 1,
    title: "Memulai dengan Zoom",
    subtitle: "Instal, masuk, dan jelajahi ruang rapat digital baru Anda",
    whatYouWillLearn: [
      "Apa itu Zoom dan mengapa begitu banyak organisasi menggunakannya",
      "Cara mengunduh dan menginstal aplikasi desktop Zoom",
      "Cara masuk dengan akun kerja atau pribadi",
      "Cara menavigasi layar beranda Zoom",
      "Perbedaan antara paket gratis dan berbayar",
    ],
    sections: [
      {
        id: "p1-what-is-zoom",
        title: "Apa itu Zoom?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Zoom adalah platform konferensi video yang memungkinkan Anda bertemu tatap muka dengan siapa pun di dunia — dari laptop, tablet, atau ponsel Anda.",
          },
          {
            type: "body",
            text: "Bayangkan Zoom sebagai ruang rapat virtual. Alih-alih semua orang bepergian ke lokasi fisik yang sama, Anda masing-masing membuka Zoom di perangkat Anda sendiri dan muncul di layar satu sama lain melalui webcam. Anda dapat melihat dan mendengar satu sama lain secara real-time, berbagi dokumen di layar, dan berkolaborasi — semua tanpa harus meninggalkan rumah atau kantor.",
          },
          {
            type: "body",
            text: "Platform ini digunakan oleh jutaan organisasi di seluruh dunia untuk rapat tim, sesi pelatihan, webinar, dan percakapan satu lawan satu. Jika Anda memimpin tim yang tersebar di berbagai budaya atau lokasi, Zoom adalah salah satu alat terpenting dalam kotak alat Anda.",
          },
          {
            type: "tip",
            text: "Anda tidak perlu akun berbayar untuk bergabung dalam rapat Zoom. Paket gratis sudah cukup untuk sebagian besar peserta. Hanya orang yang menjadi tuan rumah (menjalankan) rapat yang perlu mempertimbangkan untuk meningkatkan paket.",
          },
        ],
      },
      {
        id: "p1-install",
        title: "Menginstal Zoom",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Untuk menggunakan Zoom di komputer Anda, Anda perlu menginstal aplikasi desktop Zoom. Ini adalah program kecil yang Anda unduh sekali dan akan tetap ada di komputer Anda. Langkah-langkah di bawah ini akan memandu Anda melakukannya.",
          },
          {
            type: "url",
            url: "https://zoom.us/download",
            label: "Halaman Unduh Zoom",
          },
          {
            type: "bullet",
            bold: "Kunjungi zoom.us/download",
            text: "Kunjungi zoom.us/download — buka tautan tersebut di browser web Anda (Chrome, Edge, atau Safari).",
          },
          {
            type: "bullet",
            bold: "Klik 'Unduh'",
            text: "Klik 'Unduh' di bawah bagian berlabel 'Zoom Desktop Client'. Ini adalah versi utama untuk komputer Anda.",
          },
          {
            type: "bullet",
            bold: "Jalankan file penginstal",
            text: "Jalankan file penginstal yang telah diunduh ke komputer Anda. Di Windows, file ini berformat .exe; di Mac, berformat .pkg. Klik dua kali file tersebut untuk memulai.",
          },
          {
            type: "bullet",
            bold: "Ikuti petunjuk di layar",
            text: "Ikuti petunjuk di layar untuk menyelesaikan instalasi. Anda mungkin diminta untuk mengizinkan aplikasi melakukan perubahan pada komputer Anda — klik Ya atau Izinkan.",
          },
          {
            type: "bullet",
            bold: "Buka Zoom",
            text: "Buka Zoom dari desktop atau folder aplikasi Anda. Anda akan melihat layar masuk.",
          },
          {
            type: "screenshot",
            description: "Layar beranda aplikasi desktop Zoom setelah masuk — desain ulang 2026",
            imageUrl: IMG.desktop,
          },
        ],
      },
      {
        id: "p1-signin",
        title: "Masuk",
        blocks: [
          {
            type: "body",
            text: "Setelah Zoom terinstal, Anda perlu masuk untuk mengidentifikasi diri Anda. Ini seperti masuk ke email Anda — Anda menggunakan nama pengguna (alamat email Anda) dan kata sandi.",
          },
          {
            type: "body",
            text: "Buka Zoom dan klik 'Masuk'. Anda memiliki tiga opsi: masuk dengan akun Zoom Anda, masuk dengan Google, atau gunakan SSO (Single Sign-On) jika organisasi Anda menyediakannya.",
          },
          {
            type: "note",
            text: "Jika organisasi Anda menggunakan SSO, tanyakan kepada departemen TI Anda mengenai domain perusahaan Anda. Domain tersebut akan terlihat seperti 'yourcompany.zoom.us'. Jika Anda tidak yakin, gunakan email dan kata sandi kerja biasa Anda terlebih dahulu.",
          },
          {
            type: "tip",
            text: "Jika Anda belum pernah menggunakan Zoom sebelumnya, klik 'Daftar Gratis' di situs web Zoom untuk membuat akun gratis menggunakan alamat email Anda. Seluruh proses ini memakan waktu sekitar dua menit.",
          },
        ],
      },
      {
        id: "p1-plans",
        title: "Paket Gratis vs. Paket Berbayar",
        blocks: [
          {
            type: "body",
            text: "Zoom menawarkan paket gratis dan beberapa opsi berbayar. Bagi kebanyakan orang yang bergabung atau menyelenggarakan rapat kecil, paket gratis sudah lebih dari cukup. Berikut ini yang perlu Anda ketahui:",
          },
          {
            type: "bullet",
            text: "Paket gratis memungkinkan pertemuan satu lawan satu tanpa batas dan tanpa batasan waktu.",
          },
          {
            type: "bullet",
            text: "Pertemuan grup (3 orang atau lebih) pada paket gratis dibatasi hingga 40 menit. Setelah 40 menit, pertemuan akan berakhir secara otomatis.",
          },
          {
            type: "bullet",
            text: "Paket berbayar (mulai dari sekitar $15/bulan) menghapus batasan 40 menit dan menambahkan fitur seperti perekaman cloud dan webinar.",
          },
          {
            type: "tip",
            text: "Jika Anda adalah peserta yang bergabung dalam rapat orang lain, Anda tidak perlu khawatir tentang paket mereka — cukup bergabung saja. Batas waktu hanya berlaku bagi penyelenggara.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p1-c1", text: "Saya telah menginstal aplikasi desktop Zoom di komputer saya", type: "implemented" },
      { id: "p1-c2", text: "Saya dapat masuk dan melihat layar beranda Zoom", type: "implemented" },
      { id: "p1-c3", text: "Saya memahami apa itu Zoom dan mengapa digunakan", type: "understood" },
      { id: "p1-c4", text: "Saya memahami perbedaan antara paket Zoom gratis dan berbayar", type: "understood" },
    ],
  },

  {
    number: 2,
    title: "Bergabung dalam Rapat",
    subtitle: "Ikuti rapat apa pun dengan percaya diri — dengan audio, video, dan etiket yang tepat",
    whatYouWillLearn: [
      "Apa itu tautan rapat dan di mana menemukannya",
      "Cara bergabung dalam rapat melalui tautan atau ID Rapat",
      "Cara mengatur audio dan video sebelum masuk",
      "Apa itu ruang tunggu dan bagaimana cara kerjanya",
      "Etika dasar rapat bagi peserta",
    ],
    sections: [
      {
        id: "p2-what-is-link",
        title: "Apa itu Tautan Rapat?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Ketika seseorang menyelenggarakan rapat Zoom, Zoom secara otomatis membuat tautan unik untuk rapat tersebut. Tautan inilah yang Anda gunakan untuk 'masuk' ke ruang virtual.",
          },
          {
            type: "body",
            text: "Tuan rumah (orang yang memimpin rapat) akan mengirimkan tautan ini kepada Anda sebelumnya — biasanya melalui email atau sebagai bagian dari undangan kalender. Tautan tersebut terlihat seperti ini:",
          },
          {
            type: "note",
            text: "Contoh tautan rapat: https://zoom.us/j/98765432100?pwd=abc123XYZ — Anda akan menerima tautan ini melalui email atau undangan kalender. Cukup klik tautan tersebut dan Zoom akan terbuka secara otomatis.",
          },
          {
            type: "body",
            text: "Anda tidak perlu mengingat atau mengetik tautan tersebut — cukup klik tautan tersebut saat waktunya tiba. Biarkan email atau undangan kalender tetap terbuka sebelum rapat agar Anda dapat menemukan tautan tersebut dengan cepat.",
          },
        ],
      },
      {
        id: "p2-join-link",
        title: "Bergabung melalui Tautan",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Ini adalah cara paling umum untuk bergabung dalam rapat Zoom. Penyelenggara akan mengirimkan tautan kepada Anda — biasanya melalui email atau undangan kalender — dan Anda cukup mengkliknya.",
          },
          {
            type: "bullet",
            bold: "Klik tautan rapat",
            text: "Klik tautan rapat yang dikirimkan kepada Anda melalui email atau undangan kalender. Browser web Anda akan terbuka.",
          },
          {
            type: "bullet",
            bold: "Buka dengan Zoom",
            text: "Buka dengan Zoom — browser Anda akan menampilkan pop-up yang menanyakan cara membuka tautan. Klik 'Buka Zoom' atau 'Mulai Rapat'. Jika Anda tidak melihat pop-up ini, cari pesan kecil berwarna abu-abu di bagian atas atau bawah browser Anda.",
          },
          {
            type: "bullet",
            bold: "Uji audio dan video Anda",
            text: "Uji audio dan video Anda — layar pratinjau akan muncul sebelum Anda masuk. Anda akan melihat diri Anda di kamera dan dapat memeriksa apakah mikrofon Anda berfungsi. Klik 'Gabung' saat Anda siap.",
          },
          {
            type: "bullet",
            bold: "Masuk ke ruang tunggu",
            text: "Masuk ke ruang tunggu — Anda mungkin melihat layar yang bertuliskan 'Tunggu sebentar, tuan rumah rapat akan segera mengizinkan Anda masuk.' Ini normal. Tuan rumah akan mengizinkan Anda masuk saat sudah siap.",
          },
          {
            type: "screenshot",
            description: "Zoom Gallery View — tampilan rapat setelah Anda masuk",
            imageUrl: IMG.gallery,
          },
        ],
      },
      {
        id: "p2-join-id",
        title: "Bergabung melalui ID Rapat",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Terkadang, alih-alih tautan, Anda akan menerima ID Rapat — angka yang terdiri dari 9 atau 11 digit. Anda dapat menggunakannya untuk bergabung langsung dari dalam aplikasi Zoom.",
          },
          {
            type: "bullet",
            bold: "Buka Zoom",
            text: "Buka Zoom di komputer Anda dan klik tombol 'Gabung' di layar beranda.",
          },
          {
            type: "bullet",
            bold: "Masukkan ID Rapat",
            text: "Masukkan ID Rapat — ketikkan angka 9 atau 11 digit dari undangan Anda, lalu ketikkan nama tampilan Anda (nama yang akan dilihat orang lain dalam rapat).",
          },
          {
            type: "bullet",
            bold: "Masukkan kode sandi",
            text: "Masukkan kode sandi jika diperlukan — beberapa rapat memiliki kode sandi untuk keamanan. Kode sandi tersebut akan tercantum dalam undangan yang sama dengan ID Rapat.",
          },
          {
            type: "bullet",
            bold: "Klik Join",
            text: "Klik Join dan tunggu hingga tuan rumah mengizinkan Anda masuk.",
          },
        ],
      },
      {
        id: "p2-etiquette",
        title: "Etika Rapat",
        blocks: [
          {
            type: "body",
            text: "Bergabung dalam rapat Zoom mirip seperti memasuki ruang rapat profesional — cara Anda hadir sangatlah penting. Berikut adalah beberapa kebiasaan sederhana yang akan memberikan kesan baik dan membantu rapat berjalan lancar.",
          },
          { type: "bullet", text: "Bergabunglah beberapa menit lebih awal untuk menguji koneksi Anda dan memastikan audio dan video Anda berfungsi." },
          { type: "bullet", text: "Matikan mikrofon Anda saat masuk — kecuali jika Anda adalah satu-satunya pembicara. Suara latar belakang (lalu lintas, anak-anak, kipas angin) sangat mengganggu orang lain." },
          { type: "bullet", text: "Gunakan latar belakang yang netral dan rapi atau atur latar belakang virtual jika lingkungan Anda berantakan atau mengganggu." },
          { type: "bullet", text: "Lihatlah kamera saat berbicara, bukan gambar diri Anda di layar. Hal ini menciptakan kontak mata yang lebih baik dengan orang lain." },
          {
            type: "tip",
            text: "Jika lingkungan Anda berisik, matikan mikrofon Anda dan gunakan obrolan untuk berkontribusi dalam percakapan. Ketik pertanyaan atau komentar Anda di sana dan penyelenggara dapat membacakannya dengan lantang.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p2-c1", text: "Saya memahami apa itu tautan rapat dan di mana menemukannya", type: "understood" },
      { id: "p2-c2", text: "Saya tahu cara bergabung dalam rapat menggunakan tautan", type: "understood" },
      { id: "p2-c3", text: "Saya tahu cara bergabung menggunakan ID Rapat", type: "understood" },
      { id: "p2-c4", text: "Saya telah berhasil bergabung dalam setidaknya satu rapat Zoom", type: "implemented" },
      { id: "p2-c5", text: "Saya memahami etika dasar rapat sebagai peserta", type: "understood" },
    ],
  },

  {
    number: 3,
    title: "Menjadi Tuan Rumah Pertemuan Pertama Anda",
    subtitle: "Beralih dari peserta menjadi tuan rumah — jadwalkan, mulai, dan jalankan rapat dengan percaya diri",
    whatYouWillLearn: [
      "Perbedaan antara bergabung dan menjadi tuan rumah rapat",
      "Cara memulai rapat instan sekarang juga",
      "Cara menjadwalkan rapat terlebih dahulu dan membagikan tautannya",
      "Cara menggunakan kontrol utama tuan rumah selama rapat",
    ],
    sections: [
      {
        id: "p3-host-vs-participant",
        title: "Apa Artinya Menjadi Host?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Saat Anda menjadi tuan rumah rapat, Anda memegang kendali. Anda membuat ruang rapat, mengundang orang lain, dan mengontrol apa yang terjadi di dalamnya.",
          },
          {
            type: "body",
            text: "Sebagai tuan rumah, Anda memiliki wewenang khusus yang tidak dimiliki peserta: Anda dapat membisukan orang lain, mengeluarkan orang dari rapat, mengizinkan peserta masuk dari ruang tunggu, mengunci rapat setelah semua orang masuk, dan mengakhiri rapat untuk semua orang. Hal ini berbeda dengan menjadi peserta, di mana Anda hanya dapat mengontrol audio dan video Anda sendiri.",
          },
          {
            type: "tip",
            text: "Anda memerlukan akun Zoom untuk menjadi tuan rumah rapat. Anda tidak memerlukan akun untuk bergabung dengan rapat yang diselenggarakan oleh orang lain.",
          },
        ],
      },
      {
        id: "p3-instant",
        title: "Memulai Rapat Instan",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Rapat instan dimulai segera — berguna ketika Anda ingin melakukan panggilan cepat tanpa menjadwalkan apa pun sebelumnya.",
          },
          {
            type: "bullet",
            bold: "Buka Zoom",
            text: "Buka Zoom dan klik tombol 'Rapat Baru' berwarna oranye besar di layar beranda.",
          },
          {
            type: "bullet",
            bold: "Pilih pengaturan video Anda",
            text: "Pilih pengaturan video Anda — tentukan apakah ingin memulai dengan kamera menyala atau mati.",
          },
          {
            type: "bullet",
            bold: "Mulai rapat",
            text: "Mulai rapat dengan mengklik 'Mulai dengan Video' atau 'Mulai tanpa Video'. Anda sekarang menjadi tuan rumah di dalam ruang rapat yang kosong.",
          },
          {
            type: "bullet",
            bold: "Undang peserta",
            text: "Undang peserta dengan mengklik 'Peserta' di bilah alat, lalu 'Undang'. Anda dapat menyalin tautan rapat dan mengirimkannya melalui email, WhatsApp, atau cara lain.",
          },
          {
            type: "screenshot",
            description: "Panel Peserta Zoom — kontrol tuan rumah termasuk izinkan masuk, bisukan, dan hapus",
            imageUrl: IMG.hostControls,
          },
        ],
      },
      {
        id: "p3-schedule",
        title: "Menjadwalkan Rapat Lebih Awal",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Untuk rapat yang direncanakan, sebaiknya jadwalkan terlebih dahulu. Hal ini akan memberikan undangan kalender kepada peserta yang menyertakan tautan rapat, sehingga tidak ada yang perlu menanyakan detailnya kepada Anda pada hari itu.",
          },
          {
            type: "bullet",
            bold: "Klik 'Jadwalkan'",
            text: "Klik 'Jadwalkan' di layar beranda Zoom. Jendela penjadwalan akan terbuka.",
          },
          {
            type: "bullet",
            bold: "Tentukan detailnya",
            text: "Tentukan detailnya — beri topik pada rapat, pilih tanggal, waktu mulai, dan perkiraan durasi.",
          },
          {
            type: "bullet",
            bold: "Aktifkan ruang tunggu",
            text: "Aktifkan ruang tunggu — ini disarankan. Fitur ini memungkinkan Anda mengontrol siapa yang masuk daripada semua orang muncul sekaligus.",
          },
          {
            type: "bullet",
            bold: "Simpan dan bagikan",
            text: "Simpan dan bagikan — klik 'Simpan'. Zoom akan membuat acara kalender. Salin tautan rapat dari sana dan kirimkan ke peserta Anda.",
          },
        ],
      },
      {
        id: "p3-controls",
        title: "Kontrol Host Selama Rapat",
        blocks: [
          {
            type: "body",
            text: "Sebagai tuan rumah, Anda akan melihat bilah alat di bagian bawah layar selama rapat. Selain kontrol audio dan video Anda sendiri, Anda memiliki serangkaian alat khusus tuan rumah untuk mengelola ruang rapat.",
          },
          {
            type: "table",
            headers: ["Kontrol", "Fungsinya"],
            rows: [
              ["Bisukan Semua", "Menonaktifkan suara semua peserta sekaligus — berguna di awal pelatihan"],
              ["Kelola Peserta", "Lihat siapa saja yang ada di rapat; bisukan atau keluarkan peserta"],
              ["Masukkan dari Ruang Tunggu", "Masukkan peserta yang sedang menunggu di luar"],
              ["Kunci Rapat", "Mencegah siapa pun yang baru bergabung setelah grup Anda penuh"],
              ["Akhiri Rapat", "Akhiri untuk semua orang, atau tinggalkan rapat sambil tetap menjalankannya"],
            ],
          },
          {
            type: "tip",
            text: "Kunci rapat setelah semua peserta yang diharapkan telah bergabung. Hal ini mencegah tamu yang tidak diundang masuk dan melindungi privasi sesi Anda.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p3-c1", text: "Saya memahami perbedaan antara menjadi tuan rumah dan bergabung dalam rapat", type: "understood" },
      { id: "p3-c2", text: "Saya telah berhasil memulai rapat instan", type: "implemented" },
      { id: "p3-c3", text: "Saya telah menjadwalkan rapat dan membagikan tautannya kepada seseorang", type: "implemented" },
      { id: "p3-c4", text: "Saya tahu cara menggunakan kontrol tuan rumah utama", type: "understood" },
    ],
  },

  {
    number: 4,
    title: "Pengaturan Audio dan Video",
    subtitle: "Tampil dengan suara yang jernih dan penampilan yang profesional — setiap kali Anda muncul di layar",
    whatYouWillLearn: [
      "Cara memilih mikrofon dan speaker yang tepat",
      "Cara menguji audio Anda sebelum rapat",
      "Cara menggunakan latar belakang virtual",
      "Cara menyesuaikan kualitas video dan tampilan Anda",
    ],
    sections: [
      {
        id: "p4-why-settings",
        title: "Mengapa Pengaturan Audio dan Video Penting",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Kualitas audio yang buruk adalah alasan utama mengapa rapat Zoom terasa menjengkelkan. Jika orang lain tidak dapat mendengar Anda dengan jelas — atau jika suara latar mengganggu — hal ini akan memengaruhi seluruh kelompok.",
          },
          {
            type: "body",
            text: "Meluangkan 5 menit untuk mengatur pengaturan Anda sebelum rapat pertama akan menyelamatkan Anda dari momen canggung di tengah panggilan. Anda hanya perlu melakukannya sekali, dan Zoom akan mengingat pilihan Anda.",
          },
        ],
      },
      {
        id: "p4-audio",
        title: "Mengatur Mikrofon dan Speaker Anda",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Pengaturan audio Zoom memungkinkan Anda memilih mikrofon dan speaker yang akan digunakan, serta menguji apakah keduanya berfungsi dengan benar. Akses pengaturan tersebut melalui ikon roda gigi di layar beranda Zoom.",
          },
          {
            type: "bullet",
            bold: "Buka Pengaturan",
            text: "Buka Pengaturan dengan mengklik ikon roda gigi di pojok kanan atas layar beranda Zoom.",
          },
          {
            type: "bullet",
            bold: "Buka Audio",
            text: "Buka Audio dengan memilih 'Audio' dari menu sebelah kiri.",
          },
          {
            type: "bullet",
            bold: "Pilih mikrofon Anda",
            text: "Pilih mikrofon Anda dari menu tarik-turun 'Mikrofon'. Jika Anda menggunakan headset atau mikrofon USB eksternal, pilih di sini. Jika tidak ada yang terdaftar, mikrofon bawaan akan digunakan.",
          },
          {
            type: "bullet",
            bold: "Pilih speaker Anda",
            text: "Pilih speaker Anda dari menu tarik-turun 'Speaker'. Pilih headphone, speaker, atau speaker bawaan tergantung pada apa yang Anda gunakan.",
          },
          {
            type: "bullet",
            bold: "Uji keduanya",
            text: "Uji keduanya dengan mengklik 'Uji Speaker' dan 'Uji Mikrofon'. Untuk uji speaker, Anda akan mendengar nada pendek. Untuk uji mikrofon, bicara dan perhatikan bilah level input bergerak.",
          },
          {
            type: "screenshot",
            description: "Pengaturan Zoom: Tab Audio — mikrofon, speaker, dan tombol uji",
            imageUrl: IMG.audio,
          },
        ],
      },
      {
        id: "p4-video",
        title: "Pengaturan Video",
        blocks: [
          {
            type: "body",
            text: "Kualitas video yang baik dimulai dari lingkungan Anda — perbaikan terbesar yang dapat Anda lakukan adalah pencahayaan. Posisikan diri Anda sehingga cahaya jatuh ke wajah Anda dari depan, bukan dari belakang (yang membuat Anda terlihat seperti siluet).",
          },
          {
            type: "screenshot",
            description: "Pengaturan Zoom: Tab Video — HD, perbaiki penampilan, dan opsi cahaya redup",
            imageUrl: IMG.video,
          },
          { type: "bullet", text: "Aktifkan video 'HD' di Pengaturan → Video untuk gambar yang lebih tajam dan jelas." },
          { type: "bullet", text: "'Perbaiki penampilan saya' menambahkan filter pelembut yang halus — berguna dalam pencahayaan yang terang atau keras." },
          { type: "bullet", text: "'Sesuaikan untuk cahaya redup' berguna jika ruangan Anda gelap. Fitur ini mencerahkan gambar secara otomatis." },
          {
            type: "tip",
            text: "Pencahayaan terbaik adalah jendela atau lampu meja yang berada tepat di depan Anda. Bahkan lampu cincin yang murah (tersedia dengan harga di bawah $20) dapat membuat perbedaan signifikan pada seberapa profesional penampilan Anda di depan kamera.",
          },
        ],
      },
      {
        id: "p4-backgrounds",
        title: "Latar Belakang Virtual",
        blocks: [
          {
            type: "body",
            text: "Latar belakang virtual menggantikan latar belakang asli Anda dengan gambar atau video pilihan Anda. Ini sangat berguna saat Anda bekerja dari ruangan yang berantakan, kafe yang ramai, atau tempat mana pun yang tidak ingin Anda tunjukkan kepada orang lain.",
          },
          {
            type: "body",
            text: "Untuk mengatur latar belakang virtual: buka Pengaturan → Latar Belakang & Efek. Anda dapat memilih dari opsi bawaan Zoom (latar belakang buram, pemandangan kantor) atau mengunggah gambar Anda sendiri — misalnya, branding organisasi Anda atau warna netral sederhana.",
          },
          {
            type: "note",
            text: "Latar belakang virtual bekerja paling baik saat pencahayaan bagus dan ada dinding polos di belakang Anda. Dalam pencahayaan yang buruk, deteksi tepi Zoom menjadi tidak akurat — kepala Anda mungkin tampak mengambang atau menghilang di tepi. Layar hijau (sepotong kain hijau sederhana yang digantung di belakang Anda) menyelesaikan masalah ini sepenuhnya.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p4-c1", text: "Saya telah memilih dan menguji mikrofon serta speaker saya di Pengaturan Zoom", type: "implemented" },
      { id: "p4-c2", text: "Saya telah mengatur pengaturan video saya untuk kualitas yang baik", type: "implemented" },
      { id: "p4-c3", text: "Saya memahami bagaimana pencahayaan memengaruhi kualitas video saya", type: "understood" },
      { id: "p4-c4", text: "Saya tahu cara mengatur latar belakang virtual", type: "understood" },
    ],
  },

  {
    number: 5,
    title: "Berbagi Layar",
    subtitle: "Tampilkan layar, jendela tertentu, atau presentasi — tanpa kebingungan",
    whatYouWillLearn: [
      "Apa itu berbagi layar dan kapan menggunakannya",
      "Cara membagikan seluruh layar atau satu jendela",
      "Cara membagikan presentasi dalam mode tayangan slide",
      "Cara menambahkan anotasi saat berbagi",
      "Cara menghentikan berbagi layar dengan rapi",
    ],
    sections: [
      {
        id: "p5-what-is-sharing",
        title: "Apa itu Berbagi Layar?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Berbagi layar memungkinkan Anda menampilkan apa yang ada di layar komputer Anda kepada semua orang dalam rapat — secara real-time.",
          },
          {
            type: "body",
            text: "Ini adalah salah satu fitur paling berguna di Zoom. Daripada mencoba menjelaskan sesuatu secara lisan, Anda bisa menampilkan dokumen, situs web, spreadsheet, atau presentasi. Semua orang akan melihat layar Anda seolah-olah mereka sedang melihat dari balik bahu Anda.",
          },
          {
            type: "tip",
            text: "Sebelum membagikan layar Anda, tutup tab browser pribadi, email, atau dokumen apa pun yang tidak ingin dilihat orang lain. Sangat mudah untuk secara tidak sengaja mengungkapkan sesuatu yang tidak ingin Anda bagikan.",
          },
        ],
      },
      {
        id: "p5-start-share",
        title: "Memulai Berbagi Layar",
        procedural: true,
        blocks: [
          {
            type: "bullet",
            bold: "Klik 'Bagikan Layar'",
            text: "Klik 'Bagikan Layar' — tombol hijau di bilah alat bagian bawah selama rapat.",
          },
          {
            type: "bullet",
            bold: "Pilih apa yang akan dibagikan",
            text: "Pilih apa yang akan dibagikan — jendela akan muncul menampilkan opsi Anda: seluruh layar, jendela aplikasi tertentu yang terbuka, atau papan tulis.",
          },
          {
            type: "bullet",
            bold: "Centang 'Bagikan suara'",
            text: "Centang 'Bagikan suara' jika Anda membagikan video atau klip audio. Cari kotak centang 'Bagikan suara komputer' di bagian bawah jendela berbagi dan centang kotak tersebut.",
          },
          {
            type: "bullet",
            bold: "Klik Bagikan",
            text: "Klik Bagikan untuk memulai. Garis tepi hijau akan muncul di sekitar layar Anda untuk mengonfirmasi bahwa Anda sedang berbagi. Orang lain kini dapat melihat semua yang Anda lihat.",
          },
          {
            type: "screenshot",
            description: "Berbagi layar Zoom sedang berlangsung — garis tepi hijau terlihat, bilah alat mengambang di atas",
            imageUrl: IMG.toolbar,
          },
        ],
      },
      {
        id: "p5-present",
        title: "Berbagi Presentasi",
        blocks: [
          {
            type: "body",
            text: "Untuk membagikan presentasi PowerPoint atau Keynote: buka file tersebut di komputer Anda terlebih dahulu, lalu mulai berbagi. Di jendela berbagi, pilih jendela presentasi yang spesifik (bukan seluruh layar Anda). Dengan cara ini, peserta hanya akan melihat slide Anda dan bukan bagian lain dari desktop Anda.",
          },
          {
            type: "body",
            text: "Mulai tayangan slide seperti biasa dari dalam PowerPoint atau Keynote — peserta akan melihat slide Anda dalam layar penuh. Anda mengontrol slide dari keyboard atau mouse seperti biasa.",
          },
          {
            type: "tip",
            text: "Selalu bagikan jendela tertentu, bukan seluruh layar Anda. Hal ini melindungi privasi Anda dan mencegah gangguan — peserta tidak perlu melihat bilah tugas, pemberitahuan, atau tab lain yang terbuka.",
          },
        ],
      },
      {
        id: "p5-annotate",
        title: "Memberi Anotasi Saat Berbagi",
        blocks: [
          {
            type: "body",
            text: "Saat berbagi layar, Anda dapat menggambar langsung di atas apa yang Anda tampilkan — berguna untuk menyoroti informasi penting atau memandu peserta melalui dokumen langkah demi langkah.",
          },
          {
            type: "body",
            text: "Untuk mengakses alat anotasi: arahkan kursor mouse ke bagian atas layar saat berbagi. Sebuah bilah alat mengambang akan muncul. Klik 'Anotasi' untuk membuka panel menggambar.",
          },
          { type: "bullet", text: "Alat pena — menggambar atau menggarisbawahi langsung di layar Anda." },
          { type: "bullet", text: "Spotlight — menampilkan lingkaran yang mengikuti kursor Anda, menunjuk ke apa yang Anda lihat." },
          { type: "bullet", text: "Hapus — menghapus semua anotasi sekaligus." },
          {
            type: "note",
            text: "Peserta juga dapat membuat anotasi jika Anda mengizinkannya. Untuk mencegah orang lain menggambar di layar Anda, klik 'Anotasi' di bilah alat, lalu 'Nonaktifkan Anotasi Peserta'.",
          },
        ],
      },
      {
        id: "p5-stop",
        title: "Menghentikan Bagikan",
        blocks: [
          {
            type: "body",
            text: "Untuk menghentikan berbagi, klik tombol merah 'Stop Share' di bilah alat hijau di bagian atas layar Anda. Garis tepi hijau akan menghilang dan peserta akan kembali melihat tampilan webcam Anda.",
          },
          {
            type: "tip",
            text: "Biasakan untuk menghentikan berbagi segera setelah Anda selesai. Seringkali kita lupa bahwa kita masih berbagi saat beralih ke jendela pribadi.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p5-c1", text: "Saya dapat membagikan layar saya selama rapat Zoom", type: "implemented" },
      { id: "p5-c2", text: "Saya tahu cara membagikan jendela tertentu, bukan seluruh layar", type: "understood" },
      { id: "p5-c3", text: "Saya bisa menggunakan alat anotasi saat berbagi", type: "understood" },
      { id: "p5-c4", text: "Saya selalu menghentikan berbagi saat sudah selesai", type: "understood" },
    ],
  },

  {
    number: 6,
    title: "Obrolan, Reaksi, dan Polling",
    subtitle: "Libatkan peserta Anda — jaga agar percakapan tetap hidup di luar mikrofon",
    whatYouWillLearn: [
      "Cara menggunakan panel obrolan dalam rapat",
      "Cara menggunakan reaksi emoji tanpa mengganggu",
      "Cara membuat dan meluncurkan jajak pendapat",
      "Cara menyimpan riwayat obrolan setelah rapat",
    ],
    sections: [
      {
        id: "p6-chat",
        title: "Obrolan Selama Rapat",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Panel obrolan adalah kotak teks di sisi layar Zoom Anda tempat peserta dapat mengetik pesan selama rapat — tanpa mengganggu siapa pun yang sedang berbicara.",
          },
          {
            type: "body",
            text: "Fitur ini sangat berguna untuk berbagi tautan, mengajukan pertanyaan saat mikrofon sedang digunakan, dan memungkinkan peserta yang lebih pendiam untuk berkontribusi. Peserta dapat mengirim pesan ke 'Semua Orang' (terlihat oleh semua) atau secara pribadi ke satu orang.",
          },
          {
            type: "body",
            text: "Untuk membuka obrolan: klik 'Obrolan' di bilah alat bagian bawah selama rapat. Sebuah panel akan terbuka di sisi kanan layar Anda.",
          },
          {
            type: "screenshot",
            description: "Panel Obrolan Zoom — pesan dari peserta dan balasan yang sedang diketik",
            imageUrl: IMG.chat,
          },
          {
            type: "tip",
            text: "Jika Anda adalah tuan rumah dan juga sedang mempresentasikan, tunjuk seorang co-host untuk memantau obrolan saat Anda berbicara. Sangat sulit untuk mempresentasikan dan memantau obrolan secara bersamaan.",
          },
        ],
      },
      {
        id: "p6-reactions",
        title: "Reaksi",
        blocks: [
          {
            type: "body",
            text: "Reaksi Zoom memungkinkan peserta merespons secara real-time tanpa perlu mengaktifkan mikrofon atau mengganggu alur percakapan. Reaksi ini berupa emoji kecil yang muncul sebentar di kotak video peserta.",
          },
          {
            type: "body",
            text: "Untuk mengirim reaksi: klik 'Reaksi' di bilah alat. Anda akan melihat pilihan emoji: jempol, tepuk tangan, hati, terkejut, dan lainnya. Ada juga tombol 'Angkat Tangan'.",
          },
          { type: "bullet", text: "Tangan terangkat — menandakan peserta ingin berbicara. Sebagai tuan rumah, Anda dapat melihat tangan yang terangkat di panel Peserta dan memanggil mereka secara berurutan." },
          { type: "bullet", text: "Jempol ke atas atau tepuk tangan — tanda persetujuan atau pengakuan cepat, tanpa mengganggu pembicara." },
          { type: "bullet", text: "Reaksi akan menghilang setelah beberapa detik, tetapi tangan terangkat tetap ada sampai tuan rumah menurunkannya atau peserta menurunkannya sendiri." },
          {
            type: "note",
            text: "Dorong peserta untuk menggunakan 'Angkat Tangan' daripada membuka mute untuk berbicara. Hal ini menjaga rapat tetap tertib, terutama dalam kelompok yang lebih besar.",
          },
        ],
      },
      {
        id: "p6-polls",
        title: "Jajak Pendapat",
        blocks: [
          {
            type: "body",
            text: "Jajak pendapat memungkinkan Anda mengajukan pertanyaan kepada peserta dan mengumpulkan jawaban mereka secara instan — dengan hasil yang ditampilkan langsung di layar. Fitur ini sangat cocok untuk pengambilan keputusan cepat, memeriksa pemahaman, atau membuka topik diskusi.",
          },
          {
            type: "body",
            text: "Untuk memulai jajak pendapat selama rapat: klik 'Jajak Pendapat/Kuis' di bilah alat. Pilih jajak pendapat yang sudah disiapkan dan klik 'Mulai'. Peserta akan melihat pertanyaan dan pilihan jawaban di layar mereka. Hasilnya muncul secara real time.",
          },
          {
            type: "url",
            url: "https://zoom.us/meeting",
            label: "Portal Web Zoom — buat polling sebelum rapat Anda",
          },
          {
            type: "tip",
            text: "Buat polling Anda terlebih dahulu melalui portal web Zoom, di bawah pengaturan rapat Anda. Mencoba membuat polling secara langsung selama rapat saat peserta sedang menunggu dapat menimbulkan stres — persiapkanlah terlebih dahulu.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p6-c1", text: "Saya tahu cara membuka panel obrolan dalam rapat", type: "understood" },
      { id: "p6-c2", text: "Saya dapat menggunakan reaksi dan memahami fitur Angkat Tangan", type: "understood" },
      { id: "p6-c3", text: "Saya telah membuat atau menggunakan jajak pendapat dalam rapat Zoom", type: "implemented" },
    ],
  },

  {
    number: 7,
    title: "Ruang Diskusi",
    subtitle: "Bagi kelompok Anda menjadi percakapan yang lebih kecil — dan satukan kembali",
    whatYouWillLearn: [
      "Apa itu ruang breakout dan kapan menggunakannya",
      "Cara membuat dan menugaskan peserta ke ruang",
      "Cara mengirim pesan ke semua ruang sekaligus",
      "Cara menutup ruang dan mengumpulkan semua orang kembali",
    ],
    sections: [
      {
        id: "p7-what",
        title: "Apa itu Ruang Diskusi?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Ruang diskusi memungkinkan Anda membagi peserta rapat menjadi kelompok-kelompok kecil yang terpisah — masing-masing dalam sesi video pribadi — dan kemudian mengumpulkan semua orang kembali ke rapat utama setelah kerja kelompok selesai.",
          },
          {
            type: "body",
            text: "Bayangkan seperti latihan di kelas: guru (host) mengumpulkan seluruh kelompok untuk pelajaran, kemudian membagi mereka ke dalam kelompok diskusi yang lebih kecil, lalu memanggil semua orang kembali untuk melaporkan temuan mereka. Semua ini terjadi di dalam Zoom tanpa ada yang perlu keluar atau bergabung kembali.",
          },
          {
            type: "body",
            text: "Ruang Breakout sangat ideal untuk: diskusi kelompok kecil, kegiatan lokakarya, latihan pelatihan, brainstorming tim, dan kapan pun Anda ingin orang-orang berinteraksi dalam jumlah yang lebih kecil sebelum melaporkan kembali ke seluruh kelompok.",
          },
          {
            type: "url",
            url: "https://zoom.us/profile/setting",
            label: "Pengaturan Akun Zoom — aktifkan ruang breakout di sini",
          },
          {
            type: "tip",
            text: "Ruang breakout harus diaktifkan di pengaturan akun Zoom Anda sebelum digunakan pertama kali (Dalam Rapat (Lanjutan) → Ruang breakout). Anda hanya perlu melakukan ini sekali.",
          },
        ],
      },
      {
        id: "p7-create",
        title: "Membuat dan Membuka Ruang Breakout",
        procedural: true,
        blocks: [
          {
            type: "bullet",
            bold: "Klik 'Ruang Diskusi'",
            text: "Klik 'Ruang Diskusi' di bilah alat rapat di bagian bawah layar Anda. Anda harus menjadi tuan rumah untuk melihat opsi ini.",
          },
          {
            type: "bullet",
            bold: "Tentukan jumlah ruang",
            text: "Tentukan jumlah ruang — tentukan berapa banyak grup yang ingin Anda buat. Zoom mendukung hingga 50 ruang.",
          },
          {
            type: "bullet",
            bold: "Tetapkan peserta",
            text: "Tetapkan peserta — pilih cara Zoom mendistribusikan orang: Otomatis (acak), Manual (Anda memilih siapa yang masuk ke mana), atau Biarkan peserta memilih ruangannya sendiri.",
          },
          {
            type: "bullet",
            bold: "Klik Buat",
            text: "Klik Buat — ruang-ruang tersebut telah disiapkan tetapi belum dibuka. Anda dapat memeriksa siapa yang ada di setiap ruang dan menyesuaikan jika diperlukan.",
          },
          {
            type: "bullet",
            bold: "Klik Buka Semua Ruang",
            text: "Klik Buka Semua Ruang untuk mengundang peserta masuk. Setiap orang akan menerima undangan di layar mereka untuk bergabung dengan ruang yang telah ditetapkan.",
          },
          {
            type: "screenshot",
            description: "Panel Ruang Diskusi Zoom — ruang yang dibuat dengan peserta yang ditetapkan",
            imageUrl: IMG.breakout,
          },
        ],
      },
      {
        id: "p7-manage",
        title: "Mengelola Ruang Breakout",
        blocks: [
          {
            type: "body",
            text: "Selama ruang-ruang tersebut terbuka, Anda — sebagai tuan rumah — tetap berada di sesi utama. Anda dapat mengunjungi ruang mana pun, mengirim pesan ke semua grup, atau mengatur timer.",
          },
          { type: "bullet", text: "Klik 'Kirim pesan' untuk mengetik teks yang akan muncul di semua ruang secara bersamaan — berguna untuk peringatan seperti '5 menit lagi'." },
          { type: "bullet", text: "Klik 'Gabung' di samping nama ruangan mana pun untuk mengunjungi grup tersebut dan memeriksa kemajuan mereka." },
          { type: "bullet", text: "Atur timer hitung mundur — ketika waktu habis, ruang-ruang akan ditutup secara otomatis dan peserta akan kembali ke sesi utama." },
          {
            type: "bullet",
            text: "Klik 'Tutup Semua Ruang' untuk memberi peringatan 60 detik kepada peserta sebelum mereka dikembalikan ke rapat utama.",
          },
          {
            type: "note",
            text: "Peserta dapat meninggalkan ruang breakout dan kembali ke sesi utama kapan saja dengan mengklik 'Leave Breakout Room' di bilah alat mereka. Mereka tidak perlu menunggu Anda menutup ruang-ruang tersebut.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p7-c1", text: "Saya memahami apa itu ruang breakout dan kapan menggunakannya", type: "understood" },
      { id: "p7-c2", text: "Saya telah membuat dan membuka ruang diskusi dalam rapat", type: "implemented" },
      { id: "p7-c3", text: "Saya tahu cara mengirim pesan ke semua ruang dan menutupnya", type: "understood" },
    ],
  },

  {
    number: 8,
    title: "Merekam Rapat",
    subtitle: "Rekam sesi Anda agar tidak ada yang terlewatkan — dan lindungi privasi semua orang",
    whatYouWillLearn: [
      "Cara memulai dan menghentikan perekaman",
      "Perbedaan antara perekaman lokal dan di cloud",
      "Cara menemukan dan membagikan rekaman Anda setelah rapat",
      "Tanggung jawab hukum dan etika Anda saat merekam",
    ],
    sections: [
      {
        id: "p8-why-record",
        title: "Mengapa Merekam Rapat?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Merekam rapat Zoom menghasilkan file video dari semua yang terjadi — video, audio, berbagi layar, dan obrolan — sehingga peserta dapat meninjaunya nanti.",
          },
          {
            type: "body",
            text: "Hal ini sangat berguna untuk sesi pelatihan (peserta dapat menonton ulang sesuai kecepatan mereka sendiri), keputusan penting (Anda memiliki catatan siapa yang setuju dengan apa), dan anggota tim yang tidak dapat hadir secara langsung.",
          },
        ],
      },
      {
        id: "p8-record",
        title: "Memulai Perekaman",
        procedural: true,
        blocks: [
          {
            type: "bullet",
            bold: "Klik 'Rekam'",
            text: "Klik 'Rekam' di bilah alat bagian bawah selama rapat. Hanya tuan rumah (atau peserta yang telah diberi izin oleh tuan rumah) yang dapat memulai perekaman.",
          },
          {
            type: "bullet",
            bold: "Pilih tempat penyimpanan",
            text: "Pilih tempat penyimpanan — klik 'Rekam di Komputer Ini' untuk menyimpan file ke hard drive Anda (tersedia di semua paket), atau 'Rekam ke Cloud' untuk menyimpan secara online (memerlukan paket berbayar).",
          },
          {
            type: "bullet",
            bold: "Periksa indikator REC",
            text: "Periksa indikator REC — titik merah 'REC' akan muncul di sudut kiri atas rapat untuk semua orang. Ini menandakan perekaman sedang aktif dan memberi tahu semua peserta bahwa mereka sedang direkam.",
          },
          {
            type: "bullet",
            bold: "Jeda atau hentikan kapan saja",
            text: "Jeda atau hentikan kapan saja menggunakan kontrol perekaman di bilah alat. Menjeda akan membuat file rekaman tetap terbuka; menghentikan akan menutupnya.",
          },
          {
            type: "screenshot",
            description: "Rapat Zoom dengan perekaman aktif — indikator REC merah dan notifikasi perekaman",
            imageUrl: IMG.recording,
          },
        ],
      },
      {
        id: "p8-after",
        title: "Menemukan Rekaman Anda Setelah Rapat",
        blocks: [
          {
            type: "body",
            text: "Setelah rapat berakhir, Zoom memproses rekaman dan mengonversinya menjadi file video MP4. Proses ini mungkin memakan waktu beberapa menit — jangan tutup Zoom segera setelah rapat berakhir atau proses tersebut mungkin terganggu.",
          },
          {
            type: "body",
            text: "Rekaman lokal secara default disimpan di folder Documents/Zoom. Anda dapat membuka folder ini langsung dari Zoom: klik 'Meetings' di navigasi kiri, lalu tab 'Recorded'.",
          },
          {
            type: "url",
            url: "https://zoom.us/recording",
            label: "Rekaman Cloud Zoom — akses rekaman tersimpan cloud Anda di sini",
          },
          {
            type: "body",
            text: "Rekaman cloud (paket berbayar) tersedia di portal web Zoom. Anda dapat membagikan tautan untuk menonton langsung dari sana tanpa perlu mengirim file video berukuran besar.",
          },
          {
            type: "tip",
            text: "Untuk sesi pelatihan, merekam ke cloud dan membagikan tautannya adalah pilihan yang paling nyaman. Peserta dapat menonton kembali bagian tertentu sesuai keinginan mereka tanpa Anda perlu mengirim file video berukuran besar.",
          },
        ],
      },
      {
        id: "p8-consent",
        title: "Persetujuan Perekaman — Tanggung Jawab Anda",
        blocks: [
          {
            type: "body",
            text: "Sebelum merekam rapat apa pun, Anda harus memberi tahu semua peserta. Ini merupakan persyaratan hukum di banyak negara dan juga masalah penghormatan dasar.",
          },
          {
            type: "warning",
            text: "Di banyak negara dan wilayah, merekam percakapan tanpa persetujuan semua peserta adalah tindakan ilegal. Selalu umumkan perekaman secara lisan di awal rapat. Zoom memang menampilkan pemberitahuan otomatis saat perekaman dimulai, tetapi pengumuman lisan juga diharapkan.",
          },
          { type: "bullet", text: "Beritahukan di awal: 'Saya akan merekam sesi ini.' Berikan waktu sejenak kepada peserta untuk menyadari hal ini." },
          { type: "bullet", text: "Tawarkan opsi kepada peserta untuk mematikan kamera mereka jika mereka tidak ingin muncul dalam rekaman." },
          { type: "bullet", text: "Jangan membagikan rekaman secara publik atau kepada pihak ketiga tanpa sepengetahuan dan persetujuan semua peserta." },
        ],
      },
    ],
    endChecklist: [
      { id: "p8-c1", text: "Saya tahu cara memulai dan menghentikan perekaman lokal", type: "understood" },
      { id: "p8-c2", text: "Saya tahu di mana menemukan rekaman saya setelah pertemuan berakhir", type: "implemented" },
      { id: "p8-c3", text: "Saya memahami tanggung jawab saya untuk memberi tahu peserta sebelum merekam", type: "understood" },
    ],
  },

  {
    number: 9,
    title: "Zoom untuk Pelatihan dan Webinar",
    subtitle: "Pimpin pengalaman belajar yang menarik, menginspirasi, dan berkesan",
    whatYouWillLearn: [
      "Perbedaan utama antara rapat Zoom dan webinar",
      "Cara menyusun sesi pelatihan Zoom",
      "Cara menggunakan Zoom Whiteboard untuk pembelajaran kolaboratif",
      "Cara mengelola kelompok besar tanpa kehilangan kendali",
    ],
    sections: [
      {
        id: "p9-meeting-vs-webinar",
        title: "Rapat vs. Webinar — Mana yang Anda Butuhkan?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Zoom menawarkan dua format berbeda untuk mempertemukan orang-orang: Rapat dan Webinar. Keduanya terlihat serupa tetapi cara kerjanya sangat berbeda — memahami perbedaannya akan membantu Anda memilih alat yang tepat.",
          },
          {
            type: "body",
            text: "Dalam Rapat, setiap peserta dapat melihat dan mendengar satu sama lain, berinteraksi dengan bebas, dan menyalakan kamera mereka. Dalam Webinar, hanya pembawa acara dan panelis yang ditunjuk yang terlihat — audiens menonton dan mendengarkan, tetapi tidak dapat menyalakan kamera atau berbicara kecuali diberi izin.",
          },
          {
            type: "table",
            headers: ["Fitur", "Rapat", "Webinar"],
            rows: [
              ["Peserta dapat menggunakan video/audio", "Ya", "Hanya tuan rumah dan panelis"],
              ["Peserta dapat melihat satu sama lain", "Ya", "Tidak"],
              ["Jumlah peserta maksimum", "Hingga 1.000", "Hingga 50.000"],
              ["Cocok untuk", "Panggilan tim, sesi pelatihan", "Presentasi besar, siaran"],
              ["Harga", "Termasuk dalam semua paket", "Hanya tersedia sebagai add-on berbayar"],
            ],
          },
          {
            type: "tip",
            text: "Untuk sebagian besar sesi pelatihan kepemimpinan (di bawah 100 orang), rapat Zoom standar lebih cocok daripada webinar. Suasana rapat terasa lebih personal dan partisipatif — peserta dapat mengajukan pertanyaan secara lisan, berinteraksi satu sama lain, dan menggunakan ruang breakout.",
          },
        ],
      },
      {
        id: "p9-structure",
        title: "Menyusun Sesi Pelatihan",
        blocks: [
          {
            type: "body",
            text: "Menjalankan sesi pelatihan di Zoom membutuhkan struktur yang lebih terencana daripada sesi tatap muka. Tanpa isyarat fisik (mengangkat tangan, percakapan sampingan), Anda perlu menyisipkan momen-momen keterlibatan yang eksplisit.",
          },
          { type: "bullet", bold: "Buka 5 menit lebih awal", text: "Buka 5 menit lebih awal — mulailah rapat sebelum peserta tiba. Sambut peserta saat mereka bergabung dan lakukan pemeriksaan teknis singkat." },
          { type: "bullet", bold: "Tetapkan ekspektasi sejak awal", text: "Tetapkan ekspektasi sejak awal — beritahu peserta kapan harus menggunakan obrolan, kapan boleh bertanya, apakah akan menggunakan ruang diskusi kecil, dan apakah sesi ini direkam." },
          { type: "bullet", bold: "Variasikan format", text: "Variasikan format setiap 15–20 menit — padukan presentasi dengan diskusi, polling, dan ruang breakout. Mendengarkan secara pasif selama lebih dari 20 menit dapat menyebabkan ketidakaktifan." },
          { type: "bullet", bold: "Sebutkan nama", text: "Sebutkan nama saat memanggil peserta. 'Aisha, apa pendapatmu tentang poin itu?' menciptakan koneksi dan membantu orang merasa diperhatikan dalam kelompok besar." },
          { type: "bullet", bold: "Akhiri dengan langkah-langkah selanjutnya yang jelas", text: "Akhiri dengan langkah-langkah selanjutnya yang jelas — apa yang harus dilakukan peserta sebelum sesi berikutnya? Tuliskan di obrolan dan bagikan sebagai ringkasan setelah panggilan." },
        ],
      },
      {
        id: "p9-whiteboard",
        title: "Menggunakan Papan Tulis Zoom",
        blocks: [
          {
            type: "body",
            text: "Zoom Whiteboard adalah kanvas digital bersama yang dapat digambar oleh semua peserta secara bersamaan dan real-time. Fitur ini ideal untuk sesi brainstorming, peta pikiran, latihan visual, dan aktivitas apa pun di mana Anda ingin kelompok berkontribusi ide secara visual.",
          },
          {
            type: "body",
            text: "Untuk membuka papan tulis: klik 'Bagikan Layar' di bilah alat → pilih 'Papan Tulis'. Kanvas akan muncul untuk semua orang. Peserta dapat menambahkan catatan tempel, menggambar bentuk, menulis teks, dan menghubungkan ide — semuanya secara bersamaan.",
          },
          {
            type: "screenshot",
            description: "Zoom Whiteboard — peta pikiran kolaboratif dengan alat anotasi",
            imageUrl: IMG.whiteboard,
          },
          {
            type: "url",
            url: "https://whiteboard.zoom.us",
            label: "Papan Tulis Zoom — akses papan tulis tersimpan dan templat",
          },
          {
            type: "note",
            text: "Zoom Whiteboard yang telah ditingkatkan mencakup templat siap pakai untuk retrospektif, peta pikiran, dan papan perencanaan — tersedia pada paket berbayar. Setelah sesi, papan tulis dapat diekspor sebagai gambar atau PDF dan dibagikan kepada peserta.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p9-c1", text: "Saya memahami kapan harus menggunakan Meeting versus Webinar", type: "understood" },
      { id: "p9-c2", text: "Saya dapat menyusun sesi pelatihan Zoom secara efektif", type: "understood" },
      { id: "p9-c3", text: "Saya pernah menggunakan Zoom Whiteboard dalam sesi", type: "implemented" },
    ],
  },

  {
    number: 10,
    title: "Keamanan dan Privasi",
    subtitle: "Jaga keamanan rapat Anda — tanpa tamu tak diundang, tanpa kejutan",
    whatYouWillLearn: [
      "Apa itu 'Zoom-bombing' dan bagaimana mencegahnya",
      "Cara menggunakan kode akses dan ruang tunggu secara bersamaan",
      "Bagaimana mengelola apa yang boleh dilakukan peserta",
      "Apa yang harus dilakukan jika rapat terganggu",
    ],
    sections: [
      {
        id: "p10-zoommodbombing",
        title: "Apa itu Zoom-Bombing?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "'Zoom-bombing' mengacu pada orang-orang yang tidak diundang yang ikut serta dalam rapat Zoom dan mengganggu jalannya rapat — terkadang dengan konten yang menyinggung atau tidak pantas.",
          },
          {
            type: "body",
            text: "Masalah ini menjadi luas ketika orang-orang membagikan tautan rapat Zoom secara publik di media sosial. Sejak itu, Zoom telah menambahkan fitur keamanan yang kuat untuk mencegah hal ini, tetapi Anda perlu mengaktifkannya — fitur-fitur tersebut tidak semuanya aktif secara default.",
          },
        ],
      },
      {
        id: "p10-prevent",
        title: "Mencegah Tamu Tak Diundang",
        blocks: [
          {
            type: "body",
            text: "Inilah kebiasaan keamanan terpenting yang harus diikuti oleh setiap tuan rumah. Atur pengaturan ini sebelum rapat publik pertama Anda dan Anda akan terlindungi.",
          },
          { type: "bullet", text: "Selalu aktifkan kode sandi rapat. Atur ini saat menjadwalkan rapat — kode sandi ini akan disertakan secara otomatis dalam tautan rapat yang Anda bagikan." },
          { type: "bullet", text: "Aktifkan ruang tunggu agar Anda dapat melihat dan menyetujui setiap peserta sebelum mereka masuk." },
          { type: "bullet", text: "Jangan pernah memposting tautan rapat Anda secara publik di media sosial atau forum publik. Bagikan tautan tersebut hanya kepada orang-orang yang telah Anda undang secara langsung." },
          { type: "bullet", text: "Kunci rapat setelah semua peserta yang diharapkan telah bergabung (Keamanan → Kunci Rapat). Peserta baru akan ditolak." },
          {
            type: "warning",
            text: "Jangan gunakan ID Rapat Pribadi (PMI) Anda untuk rapat publik atau rapat besar. PMI Anda adalah tautan permanen yang tidak berubah — jika pernah dibagikan secara luas, siapa pun yang memiliki tautan tersebut dapat mencoba bergabung dengan rapat Anda kapan saja.",
          },
          {
            type: "screenshot",
            description: "Panel Keamanan Zoom — ruang tunggu, kunci rapat, dan kontrol izin peserta",
            imageUrl: IMG.security,
          },
        ],
      },
      {
        id: "p10-permissions",
        title: "Mengelola Apa yang Dapat Dilakukan Peserta",
        blocks: [
          {
            type: "body",
            text: "Sebagai tuan rumah, Anda yang menentukan apa yang boleh dilakukan peserta selama pertemuan. Klik 'Keamanan' di bilah alat selama pertemuan untuk mengaktifkan atau menonaktifkan izin ini kapan saja.",
          },
          {
            type: "table",
            headers: ["Izin", "Default", "Direkomendasikan untuk pelatihan"],
            rows: [
              ["Bagikan Layar", "Hanya tuan rumah", "Hanya tuan rumah — mencegah berbagi yang tidak disengaja"],
              ["Obrolan", "Semua orang", "Semua orang — penting untuk pertanyaan"],
              ["Ganti nama sendiri", "Aktif", "Nonaktif — mencegah kebingungan dengan nama anonim"],
              ["Mengaktifkan suara mereka", "Aktif", "Mati — gunakan Angkat Tangan sebagai gantinya"],
              ["Mulai Video", "Aktif", "Aktif — dorong penggunaan kamera"],
            ],
          },
        ],
      },
      {
        id: "p10-disruption",
        title: "Jika Pertemuan Terganggu",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Jika seseorang masuk ke pertemuan Anda dan mulai mengganggu, bertindaklah dengan cepat dan tenang. Langkah-langkah ini akan menghentikan masalah dalam hitungan detik.",
          },
          {
            type: "bullet",
            bold: "Bungkam semua peserta segera",
            text: "Bungkam semua peserta segera — buka Peserta → Bungkam Semua. Ini akan membungkam pengganggu dan semua orang lainnya.",
          },
          {
            type: "bullet",
            bold: "Hapus pengganggu",
            text: "Hapus pengganggu dengan mengklik kanan nama mereka di panel Peserta → Hapus. Peserta yang dihapus tidak dapat bergabung kembali ke rapat yang sama.",
          },
          {
            type: "bullet",
            bold: "Kunci rapat segera",
            text: "Kunci rapat segera — klik Keamanan → Kunci Rapat. Tidak ada orang yang tidak diundang yang dapat masuk.",
          },
          {
            type: "bullet",
            bold: "Laporkan jika perlu",
            text: "Laporkan jika perlu — gunakan Keamanan → Laporkan untuk menandai pengguna tersebut ke tim Kepercayaan & Keamanan Zoom, terutama jika perilakunya kasar atau melanggar hukum.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p10-c1", text: "Saya selalu menggunakan kode sandi dan ruang tunggu untuk rapat saya", type: "implemented" },
      { id: "p10-c2", text: "Saya memahami izin peserta apa saja yang dapat saya kendalikan", type: "understood" },
      { id: "p10-c3", text: "Saya tahu apa yang harus dilakukan jika rapat terganggu", type: "understood" },
      { id: "p10-c4", text: "Saya tidak pernah membagikan PMI saya untuk rapat umum", type: "understood" },
    ],
  },

  {
    number: 11,
    title: "Pengaturan Zoom dan Tips Produktivitas",
    subtitle: "Sesuaikan pengaturan Anda dan bekerja lebih cerdas — bukan sekadar terhubung",
    whatYouWillLearn: [
      "Pengaturan Zoom penting yang perlu dikonfigurasi sekali",
      "Pintasan keyboard penting untuk bekerja lebih cepat",
      "Tips untuk mengelola beberapa panggilan Zoom dalam satu hari kerja",
      "Cara menghubungkan Zoom dengan kalender Anda",
    ],
    sections: [
      {
        id: "p11-settings",
        title: "Pengaturan Utama yang Harus Dikonfigurasi Sekali",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Zoom memiliki banyak pengaturan, tetapi beberapa perubahan sederhana — yang dilakukan sekali saja — akan membuat setiap rapat di masa mendatang berjalan lebih lancar. Inilah pengaturan yang dikonfigurasi oleh pengguna Zoom berpengalaman pada hari pertama.",
          },
          { type: "bullet", bold: "Matikan mikrofon saat masuk", text: "Matikan mikrofon saat masuk — buka Pengaturan → Audio → centang 'Matikan mikrofon saya saat bergabung dalam rapat'. Ini mencegah Anda secara tidak sengaja menyiarkan suara latar belakang saat pertama kali bergabung." },
          { type: "bullet", bold: "Bergabung dengan video mati", text: "Bergabung dengan video mati — buka Pengaturan → Video → centang 'Matikan video saya saat bergabung dengan rapat'. Ini memberi Anda waktu sejenak untuk memeriksa penampilan Anda sebelum tampil secara langsung." },
          { type: "bullet", bold: "Aktifkan pembaruan otomatis", text: "Aktifkan pembaruan otomatis — pastikan Zoom selalu diperbarui secara otomatis. Patch keamanan dan fitur baru dirilis secara berkala, dan aplikasi yang sudah ketinggalan zaman dapat menyebabkan masalah koneksi." },
          { type: "bullet", bold: "Atur nama tampilan Anda", text: "Atur nama tampilan Anda menjadi 'Nama Depan Nama Belakang' atau 'Nama Depan Nama Belakang | Peran' (misalnya, 'Ana Lima | Manajer Proyek') untuk kejelasan profesional dalam rapat yang lebih besar." },
          {
            type: "screenshot",
            description: "Panel Pengaturan Zoom — default audio dikonfigurasi untuk penggunaan profesional",
            imageUrl: IMG.audio,
          },
        ],
      },
      {
        id: "p11-shortcuts",
        title: "Pintasan Keyboard",
        blocks: [
          {
            type: "body",
            text: "Pintasan keyboard memungkinkan Anda mengontrol Zoom tanpa melepaskan tangan dari keyboard atau mencari tombol — berguna saat Anda sedang berbicara atau mempresentasikan.",
          },
          {
            type: "table",
            headers: ["Pintasan (Mac / Windows)", "Tindakan"],
            rows: [
              ["Cmd+Shift+A / Alt+A", "Menonaktifkan atau mengaktifkan mikrofon"],
              ["Cmd+Shift+V / Alt+V", "Mulai atau hentikan video Anda"],
              ["Cmd+Shift+S / Alt+S", "Mulai atau hentikan berbagi layar"],
              ["Cmd+Shift+H / Alt+H", "Tampilkan atau sembunyikan panel obrolan"],
              ["Cmd+Shift+M / Alt+M", "Bisukan semua peserta (hanya tuan rumah)"],
              ["Spasi (tahan)", "Buka mute sementara — lepaskan tombol untuk mengaktifkan mute kembali"],
            ],
          },
          {
            type: "tip",
            text: "Pintasan tombol spasi (tekan untuk bicara) adalah salah satu yang paling berguna di Zoom. Tahan tombol spasi untuk mengaktifkan mikrofon, sampaikan komentar singkat, lalu lepaskan untuk mematikan mikrofon kembali. Jauh lebih cepat daripada mengklik tombol mikrofon.",
          },
        ],
      },
      {
        id: "p11-calendar",
        title: "Menghubungkan Zoom ke Kalender Anda",
        blocks: [
          {
            type: "body",
            text: "Zoom dapat terhubung langsung ke Google Calendar, Outlook, atau Apple Calendar. Setelah terhubung, Anda dapat menjadwalkan rapat Zoom dari dalam aplikasi kalender Anda dan bergabung dengan rapat hanya dengan satu klik langsung dari acara kalender.",
          },
          {
            type: "body",
            text: "Untuk mengatur integrasi: untuk Google Calendar, instal add-on Zoom dari Google Workspace Marketplace. Untuk Outlook, instal plug-in Zoom dari Microsoft AppSource store.",
          },
          {
            type: "note",
            text: "Plug-in Zoom Outlook menambahkan tombol 'Jadwalkan Rapat' langsung di dalam Outlook — alur kerja paling efisien jika Outlook adalah alat utama Anda. Satu klik akan membuat acara kalender dengan tautan rapat Zoom yang sudah terisi.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p11-c1", text: "Saya telah mengatur pengaturan default audio dan video Zoom saya (mute saat masuk, video mati saat masuk)", type: "implemented" },
      { id: "p11-c2", text: "Saya mengetahui setidaknya 3 pintasan keyboard Zoom yang akan saya gunakan secara rutin", type: "understood" },
      { id: "p11-c3", text: "Saya telah menghubungkan Zoom ke kalender saya", type: "implemented" },
      { id: "p11-c4", text: "Saya merasa percaya diri menggunakan Zoom untuk rapat profesional dan sesi pelatihan", type: "understood" },
    ],
  },
];
