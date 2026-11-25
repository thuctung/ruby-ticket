import { COMPANY_INFO } from "@/commons/constant";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";

export default async function CompanyOwnerInfo({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    COMPANY_INFO.address
  )}`;

  const rows: { label: string; value: string; mono?: boolean }[] = [
    { label: "homepage.tax_code", value: COMPANY_INFO.taxCode, mono: true },
    { label: "homepage.representative", value: COMPANY_INFO.personHost },
    { label: "homepage.position", value: t("homepage.director") },
  ];

  return (
    <section className="bg-[#FDF4F6] px-4 py-12 text-[#2B0A12] sm:px-6 sm:py-16 lg:px-8">
      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#F0CBD3] bg-white lg:grid lg:grid-cols-[2fr_3fr]"
        aria-labelledby="owner-info-title"
        role="group"
      >
        {/* ===== Trái: tên đơn vị và thương hiệu ===== */}
        <div className="relative overflow-hidden bg-[#5C0A1B] p-7 text-white sm:p-10">
          <GemFacets className="pointer-events-none absolute -bottom-16 -right-14 h-64 w-64 text-[#9B1030]" />

          <div className="relative">
            <span className="block h-1 w-12 rounded-full bg-[#F3DDB0]" aria-hidden="true" />
            <h2
              id="owner-info-title"
              className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {t("homepage.footer.ownership")}
            </h2>
            <p className="mt-6 text-sm text-white/70">{t("homepage.company_name")}</p>
            <p className="mt-1 text-lg font-semibold leading-snug text-[#F3DDB0] sm:text-xl">
              {COMPANY_INFO.legalName}
            </p>
            <p className="mt-5 inline-block rounded-full border border-[#F3DDB0]/40 px-3.5 py-1 text-sm">
              {t("homepage.brand")}:<span className="font-semibold"> {COMPANY_INFO.brand}</span>
            </p>
            <p className="mt-1 text-lg text-right mt-5 font-semibold leading-snug text-[#F3DDB0] sm:text-xl">
              Hotline: {COMPANY_INFO.hotline}
            </p>
          </div>
        </div>

        {/* ===== Phải: chi tiết pháp lý ===== */}
        <dl className="divide-y divide-[#F7DDE3] px-6 sm:px-10">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4"
            >
              <dt className="text-sm text-[#8A5A66]">{t(row.label)}</dt>
              <dd className={`font-semibold ${row.mono ? "font-mono tracking-wide" : ""}`}>
                {row.value}
              </dd>
            </div>
          ))}

          <div className="grid gap-1 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4">
            <dt className="text-sm text-[#8A5A66]"> {t("homepage.business_address")}</dt>
            <dd>
              <address className="font-semibold not-italic leading-7">
                {COMPANY_INFO.address}
              </address>
              <Link
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#9B1030] underline-offset-4 hover:text-[#7E0C27] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030]"
              >
                {t("homepage.view_on_map")} <span aria-hidden="true">→</span>
              </Link>
            </dd>
          </div>
        </dl>
      </div>
    </section>
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
