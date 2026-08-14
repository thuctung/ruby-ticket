import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const SITE_URL = "https://www.rubytraveldanang.com";
const PAGE_PATH = "/kham-pha-du-thuyen-song-han";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Du Thuyền Sông Hàn Đà Nẵng | Ngắm Cầu Rồng Phun Lửa Về Đêm",
  description:
    "Đặt vé du thuyền sông Hàn Đà Nẵng: ngắm Cầu Rồng phun lửa, dạo trên sông về đêm, tiệc buffet hải sản và nhạc sống. Khởi hành mỗi tối, đặt vé online chỉ trong 1 phút.",
  keywords: [
    "du thuyền sông hàn",
    "du thuyền đà nẵng",
    "du thuyền ngắm cầu rồng",
    "vé du thuyền sông hàn",
    "tour sông hàn về đêm",
    "cầu rồng đà nẵng",
  ],
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: PAGE_PATH,
    siteName: "Du Thuyền Sông Hàn",
    title: "Du Thuyền Sông Hàn Đà Nẵng | Ngắm Cầu Rồng Phun Lửa Về Đêm",
    description:
      "Một đêm trên sông Hàn: Cầu Rồng phun lửa, ánh đèn thành phố, tiệc tối và nhạc sống. Đặt vé ngay.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Nội dung trang ───────────────────────────────────────────────────────
const highlights = [
  {
    title: "Cầu Rồng phun lửa",
    desc: "Thuyền dừng đúng điểm ngắm đẹp nhất khi Cầu Rồng phun lửa, phun nước mỗi tối cuối tuần.",
  },
  {
    title: "Tiệc buffet hải sản",
    desc: "Hải sản tươi Đà Nẵng, món Việt và món Á, phục vụ ngay trên boong khi thuyền lướt qua thành phố.",
  },
  {
    title: "Nhạc sống & Múa nghệ thuật",
    desc: "Ban nhạc acoustic và DJ mở màn khi trời tối, biến hành trình thành một buổi tiệc trên sông.",
  },
  {
    title: "Toàn cảnh skyline",
    desc: "Ngắm trọn ánh đèn hai bờ sông Hàn, cầu Rồng, cầu Trần Thị Lý và cầu Thuận Phước từ mặt nước.",
  },
];

const itinerary = [
  {
    time: "18:00",
    title: "Đón khách tại bến thuyền",
    desc: "Check-in, nhận vé và chỗ ngồi, chào đón bằng nước chào mừng.",
  },
  {
    time: "18:30",
    title: "Khởi hành ngắm hoàng hôn",
    desc: "Thuyền rời bến, ánh hoàng hôn buông trên sông Hàn.",
  },
  {
    time: "19:15",
    title: "Trình diễn Cầu Rồng phun lửa",
    desc: "Thuyền neo tại điểm ngắm đẹp nhất, hoà cùng màn trình diễn ánh sáng.",
  },
  {
    time: "19:45",
    title: "Tiệc tối & nhạc sống",
    desc: "Buffet hải sản, nhạc acoustic, không gian lãng mạn trên boong.",
  },
  {
    time: "20:45",
    title: "Cập bến, kết thúc hành trình",
    desc: "Thuyền quay về bến, tiễn khách và hẹn gặp lại.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "Du Thuyền Sông Hàn Đà Nẵng",
  description:
    "Hành trình du thuyền ngắm Cầu Rồng phun lửa trên sông Hàn, kèm tiệc buffet hải sản và nhạc sống, khởi hành mỗi tối tại Đà Nẵng.",
  touristType: "Khách du lịch",
  itinerary: itinerary.map((s) => s.title),
  offers: {
    "@type": "Offer",
    priceCurrency: "VND",
    price: "450000",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/checkout?product=DUTHUYEN`,
  },
  provider: {
    "@type": "Organization",
    name: "Du Thuyền Sông Hàn",
    url: SITE_URL,
  },
};

// ── Component ────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <div className={`font-body bg-[#0B1D33] text-[#EDE7D6]`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-lg tracking-wide text-[#F4A340]">
          Sông Hàn <span className="text-[#EDE7D6]">by night</span>
        </span>
        <Link
          href="/checkout?product=DUTHUYEN"
          className="rounded-full border border-[#F4A340]/60 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#F4A340] transition hover:bg-[#F4A340] hover:text-[#0B1D33]"
        >
          Mua vé
        </Link>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        <Image
          src="/banner-song-han.jpeg"
          alt="Cầu Rồng Đà Nẵng thắp sáng về đêm nhìn từ sông Hàn"
          className="object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D33] via-[#0B1D33]/70 to-[#0B1D33]/20" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 sm:px-10">
          <p className="font-display text-sm uppercase tracking-[0.35em] text-[#F4A340]">
            Du thuyền sông Hàn · Đà Nẵng
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Một đêm trên sông Hàn, ánh rồng thắp sáng cả bầu trời
          </h1>
          <p className="mt-5 max-w-xl text-base text-[#C9D6E3] sm:text-lg">
            Lướt trên mặt nước sông Hàn khi Cầu Rồng phun lửa, thành phố lên đèn và bữa tiệc hải sản
            đang chờ trên boong thuyền.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/checkout?product=DUTHUYEN"
              className="rounded-full bg-[#F4A340] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-[#0B1D33] shadow-[0_0_25px_rgba(244,163,64,0.45)] transition hover:shadow-[0_0_40px_rgba(244,163,64,0.7)]"
            >
              Mua vé ngay
            </Link>
            <a
              href="#lich-trinh"
              className="text-sm font-medium text-[#EDE7D6]/80 underline underline-offset-4 hover:text-[#F4A340]"
            >
              Xem lịch trình
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0E243D]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4 sm:px-10">
          {[
            ["90 phút", "Thời lượng hành trình"],
            ["Mỗi tối", "Khởi hành đều đặn"],
            ["4.8/5", "Đánh giá khách hàng"],
            ["Miễn phí", "Đón tại bến trung tâm"],
          ].map(([big, small]) => (
            <div key={small}>
              <p className="font-display text-2xl text-[#F4A340]">{big}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-[#C9D6E3]">{small}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Vì sao chọn du thuyền sông Hàn
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {highlights.map((h, i) => (
            <div
              key={h.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#F4A340]/40"
            >
              <span className="font-display text-sm text-[#F4A340]">0{i + 1}</span>
              <h3 className="mt-2 font-display text-xl">{h.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C9D6E3]">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="lich-trinh" className="bg-[#0E243D] py-20">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Lịch trình một đêm trên sông
          </h2>
          <ol className="mt-10 space-y-8 border-l border-white/15 pl-6">
            {itinerary.map((step) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#F4A340]" />
                <p className="font-display text-sm text-[#F4A340]">{step.time}</p>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-[#C9D6E3]">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#0E243D] to-[#0B1D33] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Sẵn sàng cho một đêm trên sông Hàn?
          </h2>
          <p className="mt-4 text-[#C9D6E3]">
            Vé từ <span className="font-display text-2xl text-[#F4A340]">180.000đ</span> / khách —
            nhạc sống và toàn bộ hành trình 90 phút.
          </p>
          <Link
            href="/checkout?product=DUTHUYEN"
            className="mt-8 inline-block rounded-full bg-[#F4A340] px-10 py-4 text-sm font-semibold uppercase tracking-widest text-[#0B1D33] shadow-[0_0_25px_rgba(244,163,64,0.45)] transition hover:shadow-[0_0_40px_rgba(244,163,64,0.7)]"
          >
            Mua vé ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
