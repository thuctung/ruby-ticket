import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Clock, Ticket, Mountain, Flame, Sparkles, Car, CalendarDays } from "lucide-react";
import { SITE_CODES } from "@/commons/constant";

// ============================================================
// SEO METADATA
// ============================================================
const SITE_URL = "https://example.com"; // TODO: đổi thành domain thật
const PAGE_PATH = "/nui-than-tai-da-nang";
const PAGE_TITLE = "Núi Thần Tài Đà Nẵng: Cẩm nang du lịch A-Z (2026)";
const PAGE_DESCRIPTION =
  "Khám phá Núi Thần Tài Đà Nẵng - công viên suối khoáng nóng giữa núi rừng Bà Nà Núi Chúa: giá vé, đường đi, thời điểm lý tưởng và các trải nghiệm không thể bỏ lỡ.";
const OG_IMAGE = `${SITE_URL}/images/nui-than-tai-og.jpg`; // TODO: thay ảnh thật

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "núi thần tài đà nẵng",
    "suối khoáng nóng núi thần tài",
    "du lịch đà nẵng",
    "công viên khoáng nóng đà nẵng",
    "giá vé núi thần tài",
  ],
  alternates: {
    canonical: `${SITE_URL}${PAGE_PATH}`,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}${PAGE_PATH}`,
    siteName: "Cẩm Nang Du Lịch Đà Nẵng",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Núi Thần Tài Đà Nẵng",
      },
    ],
    locale: "vi_VN",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================
// STRUCTURED DATA (JSON-LD) — giúp Google hiểu đây là địa điểm du lịch
// ============================================================
function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Núi Thần Tài Đà Nẵng",
    alternateName: "Công viên suối khoáng nóng Núi Thần Tài",
    description: PAGE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Thôn Phú Túc, xã Hòa Phú",
      addressLocality: "Huyện Hòa Vang, Đà Nẵng",
      addressCountry: "VN",
    },
    url: `${SITE_URL}${PAGE_PATH}`,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

// ============================================================
// DATA
// ============================================================
const highlights = [
  {
    icon: Flame,
    title: "Tắm khoáng nóng tự nhiên",
    desc: "Ngâm mình trong các bể khoáng nóng lộ thiên giữa rừng núi, tốt cho sức khỏe và thư giãn tinh thần.",
  },
  {
    icon: Mountain,
    title: "Động Long Tiên",
    desc: "Hang động mô phỏng truyền thuyết Con Rồng Cháu Tiên với rồng ba đầu phun nước xuống dòng suối.",
  },
  {
    icon: Sparkles,
    title: "Đền Thần Tài",
    desc: "Khu tâm linh với tượng Thần Tài lớn cùng hàng trăm pho tượng nhỏ, nơi du khách cầu tài lộc, may mắn.",
  },
  {
    icon: Ticket,
    title: "Công viên nước & trò chơi",
    desc: "Khu vui chơi giải trí với trượt nước, hồ bơi và nhiều hoạt động dành cho cả gia đình.",
  },
];

const infoCards = [
  {
    icon: MapPin,
    label: "Vị trí",
    value:
      "Thôn Phú Túc, xã Hòa Phú, huyện Hòa Vang, TP. Đà Nẵng — cách trung tâm khoảng 30km về phía Tây.",
  },
  {
    icon: CalendarDays,
    label: "Thời điểm lý tưởng",
    value: "Tháng 4 đến tháng 9. Nhờ nằm trên đồi cao, khí hậu ở đây mát mẻ quanh năm.",
  },
  {
    icon: Car,
    label: "Cách di chuyển",
    value:
      "Từ trung tâm Đà Nẵng đi theo hướng Bà Nà - Suối Mơ, mất khoảng 45-60 phút bằng xe máy, ô tô hoặc taxi.",
  },
  {
    icon: Clock,
    label: "Thời gian tham quan",
    value:
      "Nên dành trọn 1 ngày để trải nghiệm đầy đủ các dịch vụ tắm khoáng, tham quan và vui chơi.",
  },
];

// ============================================================
// PAGE COMPONENT
// ============================================================
export default function NuiThanTaiPage() {
  return (
    <>
      <JsonLd />

      <main className="min-h-screen bg-[#FAF7EE] text-[#1C2620]">
        {/* Hero */}
        <section className="relative flex h-[60vh] min-h-[420px] w-full items-end overflow-hidden">
          <Image
            src="/thantai1.jpg"
            alt="Toàn cảnh Núi Thần Tài Đà Nẵng với suối khoáng nóng giữa rừng núi"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-10 text-white">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/80">
              Đà Nẵng · Việt Nam
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Núi Thần Tài Đà Nẵng
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
              Công viên suối khoáng nóng giữa lòng khu bảo tồn Bà Nà Núi Chúa — nơi thiên nhiên và
              trải nghiệm nghỉ dưỡng hòa làm một.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/mua-ve-tham-quan?product=${SITE_CODES.NUITHANTAI}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D9A441] px-6 py-3 text-sm font-semibold text-[#1C2620] shadow-lg transition-colors hover:bg-[#E5B458]"
              >
                <Ticket className="h-4 w-4" />
                Mua vé ngay
              </a>
              <a
                href="#huong-dan-di-chuyen"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Xem hướng dẫn di chuyển
              </a>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="mx-auto max-w-4xl px-6 py-12">
          {/* Intro */}
          <section className="prose prose-neutral max-w-none">
            <p className="text-lg leading-relaxed text-[#3A473E]">
              Bên cạnh Ngũ Hành Sơn và Bà Nà Hills, Núi Thần Tài đang dần trở thành một điểm đến
              được yêu thích khi du khách ghé thăm Đà Nẵng. Đây là một ngọn núi thuộc khu bảo tồn
              thiên nhiên Bà Nà Núi Chúa, được đưa vào khai thác du lịch từ năm 2016 với tên gọi đầy
              đủ là Công viên suối khoáng nóng Núi Thần Tài. Không khí trong lành, mạch nước khoáng
              nóng tự nhiên cùng cảnh quan núi rừng nguyên sơ là những gì làm nên sức hút riêng của
              nơi này.
            </p>
          </section>

          {/* Quick info grid */}
          <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {infoCards.map((item) => (
              <div
                key={item.label}
                className="flex gap-4 rounded-xl border border-[#DCD6C2] bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0EBDD] text-[#8A6D3B]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1C2620]">{item.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#6E7C73]">{item.value}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Highlights */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-[#1C2620]">Những trải nghiệm không thể bỏ lỡ</h2>
            <p className="mt-2 text-[#6E7C73]">
              Núi Thần Tài mang đến sự kết hợp giữa nghỉ dưỡng, tâm linh và vui chơi giải trí — phù
              hợp cho cả gia đình, nhóm bạn hay các cặp đôi.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#DCD6C2] bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C2620] text-[#FAF7EE]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1C2620]">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#6E7C73]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Directions */}
          <section id="huong-dan-di-chuyen" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold text-[#1C2620]">Hướng dẫn di chuyển</h2>
            <p className="mt-3 leading-relaxed text-[#3A473E]">
              Từ trung tâm thành phố Đà Nẵng, du khách đi theo hướng đường Điện Biên Phủ, qua Quốc
              lộ 1A rồi rẽ vào tuyến Bà Nà - Suối Mơ / Hoàng Văn Thái. Cung đường khá bằng phẳng và
              dễ đi, phù hợp để tự lái xe máy, ô tô hoặc đặt taxi. Nếu không muốn tự di chuyển, bạn
              cũng có thể đặt tour trọn gói có xe đưa đón từ trung tâm thành phố.
            </p>
          </section>

          {/* Buy ticket CTA */}
          <section
            id="mua-ve"
            className="mt-14 scroll-mt-24 rounded-2xl border border-[#DCD6C2] bg-white p-8 text-center shadow-sm"
          >
            <Ticket className="mx-auto h-8 w-8 text-[#D9A441]" />
            <h2 className="mt-3 text-2xl font-bold text-[#1C2620]">Sẵn sàng cho chuyến đi?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6E7C73]">
              Đặt vé trước để tiết kiệm thời gian xếp hàng và có mức giá tốt nhất khi đến Núi Thần
              Tài.
            </p>

            <a
              href={`/mua-ve-tham-quan?product=${SITE_CODES.NUITHANTAI}`}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1C2620] px-8 py-3.5 text-sm font-semibold text-[#FAF7EE] shadow-md transition-colors hover:bg-[#2B3A31]"
            >
              <Ticket className="h-4 w-4" />
              Mua vé ngay
            </a>

            <p className="mt-3 text-xs text-[#9CA69B]">
              Giá vé được cập nhật theo thời điểm đặt — kiểm tra chi tiết ở bước thanh toán.
            </p>
          </section>

          {/* Tips */}
          <section className="mt-14 rounded-2xl bg-[#1C2620] p-8 text-[#FAF7EE]">
            <h2 className="text-xl font-bold">Lưu ý nhỏ trước khi đi</h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#D8D2C0]">
              <li>
                • Mang theo đồ bơi, khăn tắm nếu muốn trải nghiệm tắm khoáng nóng và khu vui chơi
                nước.
              </li>
              <li>
                • Giá vé và các gói dịch vụ có thể thay đổi theo thời gian — nên kiểm tra thông tin
                mới nhất trước khi khởi hành.
              </li>
              <li>
                • Nên đi vào buổi sáng để có trọn thời gian tham quan và tránh nắng gắt buổi trưa.
              </li>
              <li>
                • Thời tiết trên núi mát hơn trung tâm thành phố, nên mang theo áo khoác mỏng vào
                sáng sớm hoặc chiều tối.
              </li>
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}
