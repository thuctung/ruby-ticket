import type { Metadata } from "next";
import Link from "next/link";
import { policies } from "@/lib/policies";
import { COMPANY_INFO } from "@/commons/constant";
import { getTranslation } from "@/lib/i18n";

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
    <main className="min-h-screen bg-stone-50" style={pageDots}>
      <section className="relative overflow-hidden bg-stone-900" style={heroDots}>
        <TicketShape className="pointer-events-none absolute -right-8 top-8 hidden w-72 rotate-6 text-yellow-400/20 md:block lg:right-16" />
        <TicketShape className="pointer-events-none absolute bottom-4 right-60 hidden w-40 -rotate-12 text-white/10 lg:block" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <span className="block h-1 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Chính sách &amp; Điều khoản
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-300">
            Các thông tin và quy định áp dụng khi khách hàng tìm kiếm, đặt mua và sử dụng vé du lịch
            tại Ruby Travel. Vui lòng đọc kỹ trước khi thực hiện giao dịch.
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-3" style={tearEdge} aria-hidden="true" />
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <section aria-labelledby="policy-list-title">
          <div className="mb-5">
            <h2 id="policy-list-title" className="text-xl font-bold text-stone-900">
              Nội dung chính sách
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {policies.map((policy, index) => (
              <Link
                key={policy.slug}
                href={`/chinh-sach/${policy.slug}`}
                className="group relative flex min-h-36 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-yellow-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                <span className="flex w-14 shrink-0 items-center justify-center bg-yellow-50 text-base font-bold text-yellow-700 transition group-hover:bg-yellow-400 group-hover:text-stone-900">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 left-[calc(3.5rem-0.625rem+1px)] h-5 w-5 rounded-full border border-stone-200 bg-stone-50 group-hover:border-yellow-400"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2.5 left-[calc(3.5rem-0.625rem+1px)] h-5 w-5 rounded-full border border-stone-200 bg-stone-50 group-hover:border-yellow-400"
                />

                <span className="min-w-0 flex-1 border-l-2 border-dashed border-stone-200 p-5">
                  <span className="block font-semibold leading-6 text-stone-900">
                    {t(policy.title)}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-stone-500">
                    {policy.summary}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yellow-700 group-hover:text-yellow-800">
                    Xem chi tiết <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-xl">
                💬
              </span>
              <div>
                <h2 className="font-bold text-stone-900">Hỗ trợ trực tuyến</h2>
                <p className="text-sm text-stone-500">Ruby Travel luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {supportItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 border-t border-dashed border-stone-200 pt-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-sm font-bold text-stone-600">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-sm font-semibold text-stone-800 hover:text-yellow-700"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="break-all text-sm font-semibold text-stone-800">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-5 shadow-sm">
            <span
              aria-hidden="true"
              className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-yellow-200 bg-stone-50"
            />
            <span
              aria-hidden="true"
              className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-yellow-200 bg-stone-50"
            />
            <TicketShape className="pointer-events-none absolute -bottom-4 -right-6 w-32 rotate-12 text-yellow-400/30" />

            <div className="relative rounded-xl border border-dashed border-yellow-400/70 px-4 py-4">
              <p className="text-base font-bold text-stone-900">Cần hỗ trợ đơn hàng?</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Chuẩn bị mã đơn hàng và thông tin đặt vé để Ruby Travel hỗ trợ nhanh hơn.
              </p>
              <Link
                href="/chinh-sach/giai-quyet-khieu-nai"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Xem cách gửi yêu cầu <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

const pageDots = {
  backgroundImage: "radial-gradient(#e7e5e4 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

const tearEdge = {
  backgroundImage: "radial-gradient(circle at 10px 100%, #fafaf9 7px, transparent 7.5px)",
  backgroundSize: "20px 12px",
  backgroundRepeat: "repeat-x",
};

const heroDots = {
  backgroundImage: "radial-gradient(rgba(250,204,21,0.12) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

function TicketShape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 110" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14 4h192a10 10 0 0 1 10 10v22a14 14 0 0 0 0 28v32a10 10 0 0 1-10 10H14A10 10 0 0 1 4 96V64a14 14 0 0 0 0-28V14A10 10 0 0 1 14 4Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M156 10v90" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 6" />
    </svg>
  );
}
