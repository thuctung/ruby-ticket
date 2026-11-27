import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  BadgeCheck,
  ChevronRight,
  Handshake,
  Mountain,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { getTranslation } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Thành tựu | Ruby Travel",
  description:
    "Ruby Travel tự hào nằm trong Top 10 doanh số Bà Nà toàn quốc và là đại lý uy tín của Vinpearl. Đặt vé nhanh, nhận QR tức thì.",
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

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3DDB0]";

export default async function ThanhTuuPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  const achievements = [
    {
      title: "trophy.achievement_bana_title",
      desc: "trophy.achievement_bana_description",
      icon: Mountain,
    },
    {
      title: "trophy.achievement_vinpearl_title",
      desc: "trophy.achievement_vinpearl_description",
      icon: BadgeCheck,
    },
    {
      title: "trophy.achievement_qr_title",
      desc: "trophy.achievement_qr_description",
      icon: Sparkles,
    },
    {
      title: "trophy.achievement_affiliate_title",
      desc: "trophy.achievement_affiliate_description",
      icon: Handshake,
    },
  ] as const;

  const reasons = [
    {
      title: "trophy.competitive_prices_title",
      desc: "trophy.competitive_prices_description",
      icon: Award,
    },
    {
      title: "trophy.easy_process_title",
      desc: "trophy.easy_process_description",
      icon: TrendingUp,
    },
    {
      title: "trophy.fast_support_title",
      desc: "trophy.fast_support_description",
      icon: ShieldCheck,
    },
    {
      title: "trophy.extra_income_title",
      desc: "trophy.extra_income_description",
      icon: Users,
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#FDF4F6] text-[#2B0A12]">
      {/* ===== Hero: nền ruby đậm, bên phải là khối nổi bật Top 10 ===== */}
      <section className="relative overflow-hidden rounded-b-[2.5rem] bg-[#5C0A1B] text-white">
        <GemFacets className="pointer-events-none absolute -bottom-24 -right-16 h-[420px] w-[420px] text-[#9B1030]" />

        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
            <div className="space-y-6">
              <Badge className="rounded-full border border-[#F3DDB0]/40 bg-transparent px-4 py-1.5 text-[#F3DDB0] shadow-none hover:bg-transparent">
                Ruby Travel • Đà Nẵng
              </Badge>

              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                {t("trophy.achievement_title")}
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                {t("trophy.achievement_description")}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className={`h-12 rounded-full bg-[#F3DDB0] px-6 font-semibold text-[#5C0A1B] shadow-none hover:bg-[#EBCF96] ${focusRing}`}
                  asChild
                >
                  <Link href="/mua-ve-tham-quan" className="inline-flex items-center gap-2">
                    {t("trophy.book_now")}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`h-12 rounded-full border-[#F3DDB0]/50 bg-transparent px-6 text-white shadow-none hover:bg-white/10 hover:text-white ${focusRing}`}
                  asChild
                >
                  <Link href="/dang-ky-dai-ly" className="inline-flex items-center gap-2">
                    {t("trophy.become_affiliate")}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-[#F3DDB0]/30 bg-white/5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-white p-2">
                  <Image src="/logo.png" alt="Ruby Travel" fill className="object-contain p-1" />
                </div>
                <div>
                  <p className="font-semibold">Ruby Travel</p>
                  <p className="text-sm text-white/70"> {t("trophy.trust_fast_convenient")}</p>
                </div>
              </div>

              <p className="mt-8 text-6xl font-bold leading-none text-[#F3DDB0] sm:text-7xl">
                {t("trophy.top_10")}
              </p>
              <p className="mt-3 text-white/80"> {t("trophy.top_10_description")}</p>

              <div className="mt-6 flex items-center gap-3 border-t border-dashed border-[#F3DDB0]/40 pt-5">
                <BadgeCheck className="h-5 w-5 shrink-0 text-[#F3DDB0]" aria-hidden="true" />
                <p className="text-sm font-medium">{t("trophy.vinpearl_trusted_agent")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Thành tựu: lưới 2x2 liền khối, ngăn bằng đường kẻ mảnh ===== */}
      <section
        className="mx-auto max-w-6xl px-6 py-14 md:py-16"
        aria-labelledby="achievements-title"
      >
        <h2 id="achievements-title" className="text-2xl font-semibold md:text-3xl">
          {t("trophy.outstanding_achievements")}
        </h2>

        <ul className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-[#F0CBD3] bg-[#F0CBD3] sm:grid-cols-2">
          {achievements.map((x) => (
            <li key={x.title} className="flex gap-4 bg-white p-6 sm:p-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#9B1030] text-white">
                <x.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold leading-snug">{t(x.title)}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[#7A4753]">{t(x.desc)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Lý do chọn + lời kêu gọi hành động ===== */}
      <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-20">
        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start lg:gap-10">
          <aside className="relative order-2 overflow-hidden rounded-3xl bg-[#5C0A1B] p-7 text-white sm:p-9 lg:sticky lg:top-8 lg:order-1">
            <GemFacets className="pointer-events-none absolute -bottom-16 -right-14 h-64 w-64 text-[#9B1030]" />
            <div className="relative">
              <span className="block h-1 w-12 rounded-full bg-[#F3DDB0]" aria-hidden="true" />
              <h2 className="mt-6 text-2xl font-semibold leading-tight">
                {t("trophy.ready_to_experience")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/75">
                {t("trophy.ready_to_experience_description")}
              </p>

              <div className="mt-7 flex flex-col gap-3">
                <Button
                  size="lg"
                  className={`h-12 rounded-full bg-[#F3DDB0] px-6 font-semibold text-[#5C0A1B] shadow-none hover:bg-[#EBCF96] ${focusRing}`}
                  asChild
                >
                  <Link href="/mua-ve-tham-quan" className="inline-flex items-center gap-2">
                    {t("trophy.book_now")}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`h-12 rounded-full border-[#F3DDB0]/50 bg-transparent px-6 text-white shadow-none hover:bg-white/10 hover:text-white ${focusRing}`}
                  asChild
                >
                  <Link href="/dang-ky-dai-ly" className="inline-flex items-center gap-2">
                    {t("trophy.become_affiliate")}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </aside>

          <div className="order-1 min-w-0 lg:order-2">
            <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
              {" "}
              {t("trophy.why_choose_title")}
            </h2>
            <ul className="divide-y divide-[#F7DDE3] overflow-hidden rounded-3xl border border-[#F0CBD3] bg-white">
              {reasons.map((x) => (
                <li key={x.title} className="flex items-start gap-4 p-5 sm:p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F7DDE3] text-[#9B1030]">
                    <x.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold leading-snug">{t(x.title)}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-[#7A4753]">{t(x.desc)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

/** Hoạ tiết các mặt cắt viên ngọc, trang trí cho các khối ruby. */
function GemFacets({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M60 20h80l40 50-80 110L20 70z" opacity="0.55" />
      <path d="M60 20 100 70 140 20z" opacity="0.5" />
      <path d="M20 70h160L100 180z" opacity="0.35" />
    </svg>
  );
}
