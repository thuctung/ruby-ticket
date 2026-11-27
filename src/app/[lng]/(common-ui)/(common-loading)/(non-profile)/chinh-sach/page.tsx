import type { Metadata } from "next";
import Link from "next/link";
import { policies } from "@/lib/policies";
import { COMPANY_INFO } from "@/commons/constant";
import { getTranslation } from "@/lib/i18n";

/**
 * Ruby Travel palette (arbitrary values của Tailwind):
 *  ruby       #9B1030  – màu thương hiệu chính
 *  ruby-deep  #5C0A1B  – nền panel giới thiệu
 *  ruby-soft  #F7DDE3  – đường kẻ nhẹ
 *  ruby-line  #F0CBD3  – viền
 *  blush      #FDF4F6  – nền trang
 *  champagne  #F3DDB0  – điểm nhấn phụ
 */

export const metadata: Metadata = {
  title: "Chính sách & Điều khoản | Ruby Travel",
  description:
    "Các chính sách bảo mật, giá vé, thanh toán, cung cấp dịch vụ, đổi trả, hoàn tiền và hỗ trợ khách hàng tại Ruby Travel.",
};

const supportItems = [
  { label: "Hotline", value: COMPANY_INFO.hotline, href: null, icon: "☎" },
  { label: "Email", value: COMPANY_INFO.email, href: null, icon: "✉" },
  { label: "Zalo", value: "Chat với Ruby Travel", href: COMPANY_INFO.zaloUrl, icon: "Z" },
  { label: "Facebook", value: "Nhắn tin Facebook", href: COMPANY_INFO.facebookUrl, icon: "f" },
];

export default async function PolicyIndexPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  return (
    <main className="min-h-screen bg-[#FDF4F6] text-[#2B0A12]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-10">
          {/* ===== Cột trái: giới thiệu, đứng yên khi cuộn danh sách ===== */}
          <aside className="relative overflow-hidden rounded-3xl bg-[#5C0A1B] p-7 text-white sm:p-9 lg:sticky lg:top-8">
            <GemFacets className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 text-[#9B1030]" />

            <div className="relative">
              <span className="block h-1 w-12 rounded-full bg-[#F3DDB0]" aria-hidden="true" />
              <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {t("homepage.policy.policy_title")}
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/75">
                {t("homepage.policy.policy_description")}
              </p>

              <div className="mt-8 border-t border-dashed border-[#F3DDB0]/40 pt-6">
                <p className="font-semibold"> {t("homepage.policy.order_support_title")}</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  {t("homepage.policy.order_support_description")}
                </p>
                <Link
                  href="/chinh-sach/giai-quyet-khieu-nai"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F3DDB0] px-5 py-2.5 text-sm font-semibold text-[#5C0A1B] transition-colors hover:bg-[#EBCF96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3DDB0]"
                >
                  {t("homepage.policy.view_support_guide")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </aside>

          <section aria-labelledby="policy-list-title">
            <ul className="divide-y divide-[#F7DDE3] overflow-hidden rounded-3xl border border-[#F0CBD3] bg-white">
              {policies.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`/chinh-sach/${policy.slug}`}
                    className="group flex items-center gap-4 border-l-4 border-transparent px-5 py-5 transition-colors hover:border-[#9B1030] hover:bg-[#FDF4F6] focus-visible:border-[#9B1030] focus-visible:bg-[#FDF4F6] focus-visible:outline-none sm:px-7"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold leading-snug">
                        {t(policy.title)}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F0CBD3] text-[#9B1030] transition-colors group-hover:border-[#9B1030] group-hover:bg-[#9B1030] group-hover:text-white group-focus-visible:border-[#9B1030] group-focus-visible:bg-[#9B1030] group-focus-visible:text-white"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ===== Dải hỗ trợ trực tuyến: trải ngang cuối trang ===== */}
        <section
          className="mt-10 rounded-3xl border border-[#F0CBD3] bg-white p-6 sm:p-8 lg:mt-14"
          aria-labelledby="support-title"
        >
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="support-title" className="text-xl font-semibold">
              {t("homepage.policy.support_title")}
            </h2>
            <p className="text-sm text-[#7A4753]"> {t("homepage.policy.support_description")}</p>
          </div>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {supportItems.map((item) => (
              <li key={item.label} className="flex items-start gap-3 rounded-2xl bg-[#FDF4F6] p-4">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9B1030] text-base font-bold text-white"
                >
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-[#8A5A66]">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-sm font-semibold text-[#2B0A12] underline-offset-4 hover:text-[#9B1030] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="break-all text-sm font-semibold">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

/** Hoạ tiết các mặt cắt viên ngọc, trang trí cho panel ruby. */
function GemFacets({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M60 20h80l40 50-80 110L20 70z" opacity="0.55" />
      <path d="M60 20 100 70 140 20z" opacity="0.5" />
      <path d="M20 70h160L100 180z" opacity="0.35" />
    </svg>
  );
}
