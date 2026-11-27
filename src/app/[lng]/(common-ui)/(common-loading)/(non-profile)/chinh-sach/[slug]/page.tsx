import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, policies } from "@/lib/policies";
import { COMPANY_INFO } from "@/commons/constant";
import { getTranslation } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string; lng: string }> };
export const dynamic = "force-static";

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lng } = await params;
  const { t } = await getTranslation(lng);
  const policy = getPolicy(slug);
  if (!policy) return { title: "Không tìm thấy chính sách | Ruby Travel" };

  return {
    title: `${t(policy.title)} | Ruby Travel`,
    description: policy.summary,
  };
}

export default async function PolicyDetailPage({ params }: Props) {
  const { slug, lng } = await params;
  const { t } = await getTranslation(lng);
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <main className="min-h-screen bg-[#FDF4F6] text-[#2B0A12]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10">
          {/* ===== Cột trái: điều hướng giữa các chính sách ===== */}
          <aside className="order-2 rounded-3xl border border-[#F0CBD3] bg-white p-5 lg:sticky lg:top-8 lg:order-1">
            <h2 className="font-semibold">{t("privacy.support.title")}</h2>
            <nav aria-label="Danh sách chính sách" className="mt-3 space-y-1">
              {policies
                .filter((item) => item.slug !== policy.slug)
                .map((item) => (
                  <Link
                    key={item.slug}
                    href={`/chinh-sach/${item.slug}`}
                    className="block rounded-xl border-l-4 border-transparent px-3 py-2 text-sm leading-6 text-[#6B3B46] transition-colors hover:border-[#9B1030] hover:bg-[#FDF4F6] hover:text-[#9B1030] focus-visible:border-[#9B1030] focus-visible:bg-[#FDF4F6] focus-visible:text-[#9B1030] focus-visible:outline-none"
                  >
                    {t(item.title)}
                  </Link>
                ))}
            </nav>
            <Link
              href="/chinh-sach"
              className="mt-4 inline-flex items-center gap-2 border-t border-dashed border-[#F0CBD3] pt-4 text-sm font-semibold text-[#9B1030] hover:text-[#7E0C27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030]"
            >
              {t("privacy.breadcrumb")} <span aria-hidden="true">→</span>
            </Link>
          </aside>

          {/* ===== Cột phải: tiêu đề + nội dung ===== */}
          <div className="order-1 min-w-0 lg:order-2">
            <header className="relative overflow-hidden rounded-3xl bg-[#5C0A1B] p-7 text-white sm:p-10">
              <GemFacets className="pointer-events-none absolute -bottom-20 -right-14 h-72 w-72 text-[#9B1030]" />

              <div className="relative">
                <Link
                  href="/chinh-sach"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#F3DDB0] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3DDB0]"
                >
                  <span aria-hidden="true">←</span> {t("privacy.breadcrumb")}
                </Link>
                <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                  {t(policy.title)}
                </h1>
                <p className="mt-4 max-w-2xl leading-7 text-white/75">{t(policy.summary)}</p>
                <p className="mt-6 inline-block rounded-full border border-[#F3DDB0]/40 px-3.5 py-1 text-xs text-[#F3DDB0]">
                  {t("privacy.update")}: {policy.updatedAt}
                </p>
              </div>
            </header>

            <article className="mt-6 rounded-3xl border border-[#F0CBD3] bg-white px-5 py-8 sm:px-10 sm:py-10">
              <div className="max-w-3xl space-y-10">
                {policy.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="border-l-4 border-[#9B1030] pl-3 text-lg font-semibold leading-7">
                      {t(section.heading)}
                    </h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-3 text-[15px] leading-7 text-[#5E3540]">
                        {t(paragraph, { email: COMPANY_INFO.email, phone: COMPANY_INFO.hotline })}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#5E3540] marker:text-[#9B1030]">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>
                            {t(bullet, {
                              email: COMPANY_INFO.email,
                              phone: COMPANY_INFO.hotline,
                              brand: COMPANY_INFO.brand,
                              taxCode: COMPANY_INFO.taxCode,
                              personHost: COMPANY_INFO.personHost,
                              domain: COMPANY_INFO.domain,
                            })}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              <div className="mt-12 max-w-3xl rounded-2xl border border-dashed border-[#9B1030]/40 bg-[#FDF4F6] p-5">
                <p className="font-semibold text-[#5C0A1B]">{t("privacy.support.title")}</p>
                <p className="mt-1.5 text-sm leading-6 text-[#5E3540]">
                  {t("privacy.support.description", {
                    phone: COMPANY_INFO.hotline,
                    email: COMPANY_INFO.email,
                  })}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}

/** Hoạ tiết các mặt cắt viên ngọc, trang trí cho khối tiêu đề. */
function GemFacets({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M60 20h80l40 50-80 110L20 70z" opacity="0.55" />
      <path d="M60 20 100 70 140 20z" opacity="0.5" />
      <path d="M20 70h160L100 180z" opacity="0.35" />
    </svg>
  );
}
