import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

const policies1 = [
  { title: "homepage.footer.privacy", href: "/chinh-sach/bao-mat" },
  {
    title: "homepage.footer.pricing",
    href: "/chinh-sach/gia",
  },
  {
    title: "homepage.footer.serviceConditions",
    href: "/chinh-sach/dieu-kien-dich-vu",
  },

  { title: "homepage.footer.payment", href: "/chinh-sach/thanh-toan" },
  {
    title: "homepage.footer.refund",
    href: "/chinh-sach/doi-tra-hoan-tien",
  },
];

const policies2 = [
  {
    title: "homepage.footer.complaints",
    href: "/chinh-sach/giai-quyet-khieu-nai",
  },
  {
    title: "homepage.footer.support",
    href: "/chinh-sach/ho-tro",
  },
  {
    title: "homepage.footer.ownership",
    href: "/chinh-sach/thong-tin-chu-so-huu",
  },
];

export default async function Footer({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng);

  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-white">
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-amber-300/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16">
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight text-white transition hover:text-amber-300"
            >
              <span>Ruby Travel</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-emerald-50/70">
              {t("homepage.footer.description")}
            </p>
          </div>

          {/* Chính sách */}
          <div>
            <h3 className="mb-5 text-base font-bold text-white">
              {t("homepage.footer.policies_title")}
            </h3>

            <ul className="space-y-3">
              {policies1.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-emerald-50/70 transition-colors duration-200 hover:text-amber-300"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-300/50 transition-colors group-hover:bg-amber-300" />
                    {t(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="mb-5 text-base font-bold text-white">
              {t("homepage.footer.customer_support")}
            </h3>

            <ul className="space-y-3">
              {policies2.map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-emerald-50/70 transition-colors duration-200 hover:text-amber-300"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-300/50 transition-colors group-hover:bg-amber-300" />
                    {t(item.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 md:mt-12">
          <div className="flex flex-col items-center justify-center gap-3 text-center text-xs text-emerald-50/55 sm:flex-row sm:text-left">
            <p>{t("homepage.footer.copyright")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
