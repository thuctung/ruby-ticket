import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n/t";
import { ChevronRight, MapPin, QrCode, ShieldCheck, Star } from "lucide-react";
import { ExperienceCard, LangKey, LocationCard } from "@/types";
import Link from "next/link";

type HeroSectionProps = {
  lang: LangKey;
  topPicks: ExperienceCard[];
};

export function HeroSection({ lang, topPicks }: HeroSectionProps) {
  const locationItems = [
    {
      name: "Bà Nà Hills",
      desc: "Cáp treo • Cầu Vàng • khu vui chơi",
      type: "TOP",
      iconPath:
        "M3 13V9l4-3 5 3v4l-4 3-5-3zm0 0l4-3.333L12 13M12 9l4 3.333M16 13v4l-4 3-5-3V13m16.5-6.5a1 1 0 11-2 0 1 1 0 012 0zm0 0v10m-2 0a1 1 0 112 0 1 1 0 01-2 0z",
      color: "bg-orange-50 text-orange-600",
      titleColor: "text-blue-700",
      link: "/checkout?product=BANA",
    },
    {
      name: "Vinpearl",
      desc: "Resort & trải nghiệm giải trí",
      iconPath:
        "M20 7v10m-4-3h4m0-7a3 3 0 013 3v4a3 3 0 01-3 3M4 17V7a3 3 0 013-3h10a3 3 0 013 3v10m-7-5h3a3 3 0 013 3v4a3 3 0 01-3 3H7a3 3 0 01-3-3v-4a3 3 0 013-3h3",
      color: "bg-blue-50 text-blue-600",
      link: "/checkout?product=VINPER",
    },
    {
      name: "Ký ức Hội An",
      desc: "Show diễn buổi tối đáng xem",
      iconPath:
        "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      color: "bg-pink-50 text-pink-600",
      link: "/checkout?product=KWHOIAN",
    },
    {
      name: "Núi Thần Tài",
      desc: "Tắm khoáng • nghỉ dưỡng trong ngày",
      iconPath:
        "M13.5 13a4.5 4.5 0 01-9 0v-2.25l-2.25.75L0 9l4.5-1.5 4.5 1.5-2.25 2.25v2.25a2.25 2.25 0 004.5 0v-2.25l-2.25.75L6.75 9l4.5-1.5L15 9l-2.25 2.25v2.25a2.25 2.25 0 004.5 0v-2.25l-2.25.75L15 9l4.5-1.5 4.5 1.5-2.25 2.25v2.25a4.5 4.5 0 01-9 0v-2.25l-2.25.75L11.25 9l4.5-1.5L18 9l-2.25 2.25v2.25z",
      color: "bg-emerald-50 text-emerald-600",
      link: "/checkout?product=NUITHANTAI",
    },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-background pt-10 pb-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-blue-200/30 blur-[100px] animate-pulse" />
        <div className="absolute right-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-purple-200/30 blur-[80px]" />
        <div className="absolute left-[30%] bottom-[-10%] h-[350px] w-[350px] rounded-full bg-pink-100/40 blur-[90px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              {t(lang, "hero.pill")}
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                <span className="text-slate-900">{t(lang, "hero.title1")}</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent pb-2">
                  {t(lang, "hero.title2")}
                </span>
              </h1>
              <p className="max-w-[540px] text-lg leading-relaxed text-slate-600 md:text-xl">
                {t(lang, "hero.desc")}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                asChild
              >
                <a href="/checkout" className="inline-flex items-center gap-2">
                  {t(lang, "cta.buyNow")}
                  <ChevronRight className="h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-2xl border-2 hover:bg-slate-50 transition-all"
                asChild
              >
                <a href="#experiences">{t(lang, "cta.viewExperiences")}</a>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm backdrop-blur-sm hover:shadow-md transition-shadow">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {t(lang, "home.feature.noLogin.title")}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {t(lang, "home.feature.noLogin.desc")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm backdrop-blur-sm hover:shadow-md transition-shadow">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {t(lang, "home.feature.instantQR.title")}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {t(lang, "home.feature.instantQR.desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto w-full max-w-[480px]">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-blue-100 to-purple-100 blur-2xl opacity-50" />
            <Card className="relative overflow-hidden border-none shadow-2xl shadow-blue-200/50 rounded-[2rem]">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 pb-6 pt-8">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold text-slate-900">
                      {t(lang, "hero.cardTitle")}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {t(lang, "hero.cardDesc")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-white text-blue-600 border border-blue-100 px-3 py-1 rounded-full font-bold"
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {t(lang, "hero.city")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 bg-white">
                {locationItems.map((item, idx) => (
                  <Link href={item.link} key={idx}>
                    <div
                      className={`w-full max-w-2xl bg-white rounded-[2rem] p-3 flex items-center gap-5 cursor-pointer transition-all duration-300 group ${idx === 0 ? "border border-blue-200" : "border border-slate-100"}`}
                    >
                      <div
                        className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 shadow-sm ${item.color} group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-slate-100`}
                      >
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={item.iconPath}
                          />
                        </svg>
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h3
                            className={`text-xl font-bold tracking-tight ${item.titleColor || "text-slate-800"}`}
                          >
                            {item.name}
                          </h3>
                          {item.type && (
                            <span className="px-3 py-1 text-xs font-black bg-amber-100 text-amber-700 rounded-full uppercase tracking-widest">
                              {item.type}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div
                        className={`p-1.5 rounded-full transition-all duration-300 ${idx === 0 ? "bg-blue-100/50 text-blue-500" : "text-slate-300 opacity-30 group-hover:opacity-100 group-hover:translate-x-1"}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}

                <div className="pt-4">
                  <Button
                    className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black shadow-lg shadow-slate-200 font-bold"
                    size="lg"
                    asChild
                  >
                    <a href="/checkout">{t(lang, "cta.goToCheckout")}</a>
                  </Button>
                  <div className="mt-4 text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {t(lang, "hero.miniPill")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
