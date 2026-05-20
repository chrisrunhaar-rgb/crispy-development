import { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { generateResourceArticleSchema, generateResourceBreadcrumbSchema, generateResourceMetadata, generateFAQSchema } from "@/lib/seo-utils";
import Breadcrumb from "@/components/Breadcrumb";
import RelatedResources from "@/components/RelatedResources";
import KaruniaClient from "./KaruniaClient";

export const dynamic = "force-dynamic";

const RESOURCE_SLUG = "karunia-rohani";

const faqItems = [
  {
    question: "Apa itu karunia rohani dan mengapa penting bagi pemimpin Kristen?",
    answer: "Karunia rohani adalah kemampuan yang diberikan oleh Roh Kudus kepada setiap orang percaya untuk membangun tubuh Kristus dan menggenapi misi Allah di dunia. Paulus menulis dalam 1 Korintus 12 bahwa karunia-karunia ini beragam tetapi berasal dari satu Roh, dan bahwa setiap anggota tubuh memiliki fungsi yang diperlukan oleh keseluruhan. Bagi pemimpin Kristen, memahami karunia rohani membantu mereka melayani dari kekuatan sejati, membangun tim yang saling melengkapi, dan mendelegasikan pekerjaan dengan bijak. Karunia rohani bukan tentang prestise pribadi, melainkan tentang kontribusi bagi komunitas.",
  },
  {
    question: "Apa perbedaan antara daftar karunia rohani dalam 1 Korintus 12, Roma 12, dan Efesus 4?",
    answer: "Alkitab memberikan setidaknya tiga daftar utama karunia rohani. Pertama, 1 Korintus 12 berfokus pada karunia yang beroperasi dalam ibadah jemaat seperti bahasa roh, nubuat, dan penyembuhan. Kedua, Roma 12 menekankan karunia yang lebih praktis seperti mengajar, memberi, memimpin, dan menunjukkan belas kasihan. Ketiga, Efesus 4 memperkenalkan karunia jabatan pelayanan (rasul, nabi, penginjil, gembala, pengajar). Gordon Fee menunjukkan bahwa daftar-daftar ini tidak dimaksudkan sebagai katalog lengkap tetapi sebagai contoh representatif dari berbagai cara Roh bekerja.",
  },
  {
    question: "Bagaimana konteks budaya mempengaruhi bagaimana karunia rohani diekspresikan?",
    answer: "Ekspresi karunia rohani sangat dipengaruhi oleh konteks budaya setempat. Nubuat dalam budaya lisan berkontek-tinggi seperti banyak komunitas di Afrika, Asia, dan kepulauan Pasifik sering disampaikan melalui narasi, puisi, atau perkataan langsung yang bersifat komunal, berbeda dengan ekspresi nubuat dalam budaya Barat yang cenderung lebih individual dan tertulis. Karunia belas kasihan mungkin diekspresikan melalui kehadiran fisik dan gotong royong dalam budaya kolektif. Pemimpin perlu belajar membaca karunia dalam kerangka budaya mereka sendiri.",
  },
  {
    question: "Apakah asesmen karunia rohani bisa diandalkan sebagai satu-satunya panduan untuk pelayanan?",
    answer: "Asesmen karunia rohani adalah alat bantu yang berguna tetapi bukan satu-satunya penentu arah pelayanan. Asesmen ini membantu seseorang merefleksikan pola pelayanan, minat, dan di mana mereka merasakan kegembiraan saat melayani. Namun, karunia sejati juga diakui oleh komunitas iman, dikonfirmasi melalui buah pelayanan nyata, dan dikembangkan melalui praktik dan pemuridan. Jemaat yang sehat menggunakan asesmen sebagai titik awal percakapan, bukan sebagai keputusan akhir tentang peran seseorang.",
  },
  {
    question: "Bagaimana menghindari perdebatan karismatik vs. sesasionis yang tidak produktif dalam konteks Indonesia?",
    answer: "Perdebatan antara karismatik dan sesasionis berakar kuat dalam sejarah teologi Barat dan sering diimpor ke konteks Indonesia tanpa mempertimbangkan tradisi lokal. Pendekatan yang lebih bijak adalah bertanya: apa yang Alkitab ajarkan, apa yang komunitas iman lokal sudah alami, dan bagaimana karunia ini membangun tubuh Kristus secara konkret di konteks ini? Gordon Fee menekankan bahwa pengalaman Paulus tentang Roh dalam 1 Korintus adalah norma biblika, bukan pengecualian. Pemimpin lintas budaya perlu menghargai tradisi lokal sebelum menerapkan kategori teologis impor.",
  },
  {
    question: "Bagaimana karunia rohani berhubungan dengan kepemimpinan dalam konteks pelayanan lintas budaya?",
    answer: "Dalam konteks pelayanan lintas budaya, pemahaman karunia rohani sangat penting karena membantu pemimpin menghindari dua jebakan umum: pertama, memaksakan model pelayanan yang sesuai dengan karunia mereka sendiri tetapi tidak cocok dengan budaya setempat, dan kedua, mengabaikan karunia yang sudah ada dalam komunitas lokal. Paulus dalam Efesus 4 menggambarkan tujuan karunia sebagai pembangunan seluruh tubuh. Pekerja lintas budaya yang efektif belajar mengidentifikasi dan memperkuat karunia yang sudah ada dalam komunitas tuan rumah.",
  },
];

export const metadata = generateResourceMetadata(RESOURCE_SLUG);

export default async function ResourcePage(props: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const savedResources = (user?.user_metadata?.saved_resources ?? []) as string[];
  const isSaved = savedResources.includes(RESOURCE_SLUG);
  const isLoggedIn = !!user;
  const karuniaTopGifts = (user?.user_metadata?.karunia_top_gifts ?? null) as string[] | null;
  const karuniaScores = (user?.user_metadata?.karunia_scores ?? null) as Record<string, number> | null;

  const breadcrumbSchema = generateResourceBreadcrumbSchema(RESOURCE_SLUG);

  return (
    <>
      <Script
        id={`breadcrumb-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Script
        id={`article-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateResourceArticleSchema(RESOURCE_SLUG)),
        }}
      />
      <Script
        id={`faq-${RESOURCE_SLUG}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(faqItems)),
        }}
      />
      <Script
        id="kr-ga-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.gtag?.('event', 'resource_viewed', { resource: '${RESOURCE_SLUG}', category: 'assessments' });`,
        }}
      />

      <div className="bg-gray-50 border-b border-gray-200 py-3 sticky top-0 z-10">
        <div className="container-wide">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Resources", href: "/resources" },
              { label: "Spiritual Gifts" },
            ]}
          />
        </div>
      </div>

      <KaruniaClient
        isSaved={isSaved}
        isLoggedIn={isLoggedIn}
        karuniaTopGifts={karuniaTopGifts}
        karuniaScores={karuniaScores}
      />

      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container-wide">
          <RelatedResources slug="karunia-rohani" />
        </div>
      </div>
    </>
  );
}
