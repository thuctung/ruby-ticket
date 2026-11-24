import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolicy, policies } from "@/lib/policies";
import { COMPANY_INFO } from "@/commons/constant";
import { getTranslation } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string; lng: string }> };
export const dynamic = "force-static";
export const dynamicParams = false;

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
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 lg:px-8">
          <Link
            href="/chinh-sach"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            <span aria-hidden="true">←</span> {t("privacy.breadcrumb")}
          </Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t(policy.title)}
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">{t(policy.summary)}</p>
          <p className="mt-5 text-xs text-slate-400">
            {t("privacy.update")}: {policy.updatedAt}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-8">
        <article className="rounded-2xl border border-slate-200 bg-white px-5 py-7 shadow-sm sm:px-8">
          <div className="space-y-8">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-bold leading-7 text-slate-900">{t(section.heading)}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-7 text-slate-600">
                    {t(paragraph, { email: COMPANY_INFO.email, phone: COMPANY_INFO.hotline })}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600 marker:text-amber-500">
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

          <div className="mt-10 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{t("privacy.support.title")}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {t("privacy.support.description", {
                phone: COMPANY_INFO.hotline,
                email: COMPANY_INFO.email,
              })}
            </p>
          </div>
        </article>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">{t("privacy.support.title")}</h2>
          <nav aria-label="Danh sách chính sách" className="mt-3 space-y-1">
            {policies
              .filter((item) => item.slug !== policy.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/chinh-sach/${item.slug}`}
                  className="block rounded-lg px-3 py-2 text-sm leading-6 text-slate-600 transition hover:bg-rose-50 hover:text-amber-700"
                >
                  {t(item.title)}
                </Link>
              ))}
          </nav>
          <Link
            href="/chinh-sach"
            className="mt-4 inline-flex text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            {t("privacy.breadcrumb")} →
          </Link>
        </aside>
      </div>
    </main>
  );
}
