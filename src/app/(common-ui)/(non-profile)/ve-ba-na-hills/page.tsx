import { SITE_CODES } from "@/commons/constant";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Bà Nà Hills | Cầu Vàng, Làng Pháp & Fantasy Park - Sun World",
  description:
    "Khám phá Bà Nà Hills - Cầu Vàng, Làng Pháp cổ tích, Fantasy Park, cáp treo kỷ lục thế giới. Đặt vé ngay hôm nay.",
  keywords: [
    "vé bà nà",
    "vé bà nà hills",
    "mua vé bà nà online",
    "du lịch bà nà hills",
    "vé điện tử bà nà hills",
    "giá vé bà nà hills",
    "bà nà hills ticket",
    "bà nà hills entrance fee",
  ],
};

type Stop = {
  code: string;
  name: string;
  tagline: string;
  desc: string;
  image?: string;
  icon: "cablecar" | "bridge" | "village" | "park" | "wine" | "pagoda" | "garden";
};

const stops: Stop[] = [
  {
    code: "GA ĐI",
    name: "Cáp treo Bà Nà",
    tagline: "Kỷ lục Guinness thế giới",
    desc: "Hệ thống cáp treo một dây dài nhất và có độ cao chênh lệch lớn nhất thế giới, đưa bạn xuyên qua rừng nguyên sinh và biển mây trong khoảng 20 phút.",
    image: "/bana/captreo.jpg",
    icon: "cablecar",
  },
  {
    code: "1.414M",
    name: "Cầu Vàng",
    tagline: "Biểu tượng của Bà Nà Hills",
    desc: "Cây cầu dài 150 mét được nâng đỡ bởi đôi bàn tay đá khổng lồ phủ rêu phong, uốn lượn giữa mây trời - điểm check-in nổi tiếng nhất Việt Nam.",
    image: "/bana/cauvang.webp",
    icon: "bridge",
  },
  {
    code: "GA MORIN",
    name: "Làng Pháp",
    tagline: "Một góc châu Âu giữa lòng Đà Nẵng",
    desc: "Ngôi làng cổ tích tái hiện kiến trúc Pháp thế kỷ 19 với quảng trường đá, nhà thờ cổ, đài phun nước và các tòa lâu đài phủ rêu trong sương.",
    image: "/bana/langphap.jpg",
    icon: "village",
  },
  {
    code: "B1 - B3",
    name: "Fantasy Park",
    tagline: "Công viên trong nhà lớn nhất Việt Nam",
    desc: "Ba tầng trò chơi bất tận: tàu lượn, rạp chiếu phim 4D/5D, bảo tàng sáp và khu trò chơi arcade cho cả gia đình.",
    image: "/bana/fantasy-park.jpg",
    icon: "park",
  },
  {
    code: "1923",
    name: "Hầm rượu Debay",
    tagline: "Dấu tích Pháp cổ duy nhất còn lại",
    desc: "Hầm rượu khoét sâu vào lòng núi từ thời Pháp thuộc, giữ nhiệt độ mát tự nhiên quanh năm để ủ những chai vang quý.",
    image: "/bana/ham-ruou-debay-ba-na-hills.jpg",

    icon: "wine",
  },
];

function StopIcon({ type }: { type: Stop["icon"] }) {
  const common = "w-7 h-7 stroke-brass";
  switch (type) {
    case "cablecar":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.6">
          <path d="M2 5h20" strokeLinecap="round" />
          <path d="M7 5v3M17 5v3" strokeLinecap="round" />
          <rect x="5.5" y="8" width="4.5" height="4" rx="0.8" />
          <rect x="14" y="8" width="4.5" height="4" rx="0.8" />
          <path d="M4 20l3.5-8M20 20l-3.5-8" strokeLinecap="round" />
        </svg>
      );
    case "bridge":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.6">
          <path d="M3 17c3-6 6-9 9-9s6 3 9 9" strokeLinecap="round" />
          <path d="M2 20h20" strokeLinecap="round" />
          <path d="M8 20l1.5-4M16 20l-1.5-4" strokeLinecap="round" />
        </svg>
      );
    case "village":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.6">
          <path d="M4 20V11l4-3 4 3v9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13 20v-6l4-3 4 3v6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 20h20" strokeLinecap="round" />
          <path d="M15.5 8V5h1.5" strokeLinecap="round" />
        </svg>
      );
    case "park":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.6">
          <circle cx="12" cy="9" r="4" />
          <path d="M4 21c1-4 4-6 8-6s7 2 8 6" strokeLinecap="round" />
          <path d="M12 5V3" strokeLinecap="round" />
        </svg>
      );
    case "wine":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.6">
          <path d="M7 3h10l-1 8a4 4 0 01-8 0L7 3z" strokeLinejoin="round" />
          <path d="M12 15v6M8 21h8" strokeLinecap="round" />
        </svg>
      );
    case "pagoda":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} strokeWidth="1.6">
          <path d="M12 2l2 3H10l2-3z" />
          <path d="M5 8h14l-2 3H7L5 8z" />
          <path d="M4 21l2-8h12l2 8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 11v10" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Vé Bà Nà Hills",
    offers: {
      "@type": "Offer",
      price: "900000",
      priceCurrency: "VND",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main>
        {/* HERO */}
        <section className="relative h-[100svh] w-full overflow-hidden">
          <Image
            src="/bana/banner.webp"
            alt="Cầu Vàng Bà Nà Hills giữa biển mây"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-fog-gradient bg-[#41242430]" />

          {/* Bảng độ cao - chi tiết đặc trưng của trạm núi */}
          <div className="absolute top-24 right-6 md:right-12  text-brassLight text-right">
            <div className="text-xs tracking-[0.3em] text-brass">ĐỘ CAO</div>
            <div className="text-2xl md:text-3xl">1.414M</div>
          </div>

          <div className="absolute bottom-0 inset-x-0 px-6 md:px-12 pb-16 md:pb-20">
            <div className="max-w-6xl mx-auto text-[white]">
              <p className=" text-xs md:text-sm tracking-[0.35em] text-brass mb-4">
                SUN WORLD · ĐÀ NẴNG, VIỆT NAM
              </p>
              <h1 className="font-display text-5xl md:text-8xl leading-[0.95] text-mist mb-6">
                Bà Nà
                <br />
                <span className="text-brassLight">Hills</span>
              </h1>
              <p className="max-w-lg text-stone md:text-lg mb-8">
                Một hành trình từ chân núi lên tới mây - qua cáp treo kỷ lục, Cầu Vàng huyền thoại
                và ngôi làng Pháp cổ tích trên đỉnh Chúa.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`/checkout?product=${SITE_CODES.BANAHILL}`}
                  className="bg-brass hover:bg-brassLight text-pineDeep font-semibold px-7 py-3.5 rounded-sm transition-colors bg-[#ee3d8e]"
                >
                  Vé Bà Nà Hills
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* GIỚI THIỆU */}
        <section className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className=" text-xs tracking-[0.3em] text-brass mb-5">GIỚI THIỆU</p>
          <h2 className="font-display text-3xl md:text-4xl text-mist mb-6">
            Nơi mây, núi và cổ tích Pháp gặp nhau
          </h2>
          <p className="text-stone leading-relaxed md:text-lg">
            Nằm trên dãy Trường Sơn, cách trung tâm Đà Nẵng khoảng 25km, Bà Nà Hills được người Pháp
            phát hiện từ năm 1919 và biến thành chốn nghỉ dưỡng trên núi. Ngày nay, nơi đây là một
            quần thể du lịch trải dài từ chân núi lên tới đỉnh Chúa cao 1.489 mét, nơi bạn có thể
            chạm mây, đi giữa kiến trúc châu Âu và chiêm ngưỡng cây cầu vàng nổi tiếng khắp thế
            giới.
          </p>
        </section>

        {/* HÀNH TRÌNH LÊN MÂY */}
        <section id="hanh-trinh" className="relative max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <p className=" text-xs tracking-[0.3em] text-brass mb-5">HÀNH TRÌNH LÊN MÂY</p>
            <h2 className="font-display text-3xl md:text-4xl text-mist">
              6 điểm dừng chân không thể bỏ lỡ
            </h2>
          </div>

          <div className="relative">
            {/* đường cáp treo dọc */}
            <div className="cable-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] hidden md:block" />

            <div className="space-y-10 md:space-y-0">
              {stops.map((stop, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div
                    key={stop.name}
                    className={`md:grid md:grid-cols-2 md:gap-10 items-center ${
                      i > 0 ? "md:mt-2" : ""
                    }`}
                  >
                    <div className={isEven ? "md:order-1" : "md:order-2"}>
                      <div
                        className={`rounded-md overflow-hidden border border-brass/20 bg-pineDeep/40 ${
                          stop.image ? "" : "aspect-[4/3] flex items-center justify-center"
                        }`}
                      >
                        {stop.image ? (
                          <div className="relative aspect-[4/3]">
                            <Image src={stop.image} alt={stop.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 py-10">
                            <span className="w-14 h-14 rounded-full border border-brass/40 flex items-center justify-center">
                              <StopIcon type={stop.icon} />
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`relative py-8 md:py-0 ${
                        isEven ? "md:order-2 md:pl-10" : "md:order-1 md:pr-10 md:text-right"
                      }`}
                    >
                      {/* điểm mốc trên đường cáp treo */}
                      <span className="hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brass border-2 border-pine left-1/2 -translate-x-1/2" />

                      <p className=" text-xs tracking-[0.25em] text-brass mb-2">{stop.code}</p>
                      <h3 className="font-display text-2xl md:text-3xl text-mist mb-1">
                        {stop.name}
                      </h3>
                      <p className="text-brassLight text-sm mb-3">{stop.tagline}</p>
                      <p className="text-stone leading-relaxed max-w-md md:ml-auto">{stop.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* VÉ */}
        <section id="ve" className="relative py-24 px-6">
          <div className="max-w-4xl mx-auto bg-pineDeep border border-brass/25 rounded-md px-8 py-14 md:px-14 text-center">
            <p className=" text-xs tracking-[0.3em] text-brass mb-5">ĐẶT VÉ</p>
            <h2 className="font-display text-3xl md:text-4xl text-mist mb-4">
              Sẵn sàng chạm vào mây?
            </h2>
            <p className="text-stone max-w-xl mx-auto mb-10">
              Vé đã bao gồm cáp treo khứ hồi và toàn bộ các điểm tham quan: Cầu Vàng, Làng Pháp,
              Fantasy Park, hầm rượu Debay và chùa Linh Ứng.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-left">
              {[
                ["Cáp treo", "Khứ hồi kỷ lục thế giới"],
                ["Cầu Vàng", "Không giới hạn lượt vào"],
                ["Fantasy Park", "Toàn bộ trò chơi tầng B1–B3"],
                ["Làng Pháp", "Tham quan tự do cả ngày"],
              ].map(([title, desc]) => (
                <div key={title} className="border-l border-brass/30 pl-3">
                  <p className="font-display text-mist text-sm mb-1">{title}</p>
                  <p className="text-stone text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <a
              href={`/checkout?product=${SITE_CODES.BANAHILL}`}
              className="bg-brass hover:bg-brassLight text-[white] font-semibold px-7 py-3.5 rounded-sm transition-colors bg-[#ee3d8e]"
            >
              Mua vé ngay
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
