import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { t } from "@/lib/i18n/t";
import {
  ChevronRight,
  MapPin,
  QrCode,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ExperienceCard, LangKey, LocationCard } from "@/types";

type HeroSectionProps = {
  lang: LangKey;
  topPicks: ExperienceCard[];

}

export function HeroSection({
  lang,
  topPicks,
}: HeroSectionProps) {
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
              <CardContent className="space-y-4 p-6 bg-white">
                {topPicks.map((x) => (
                  <a
                    key={x.key}
                    href={`/checkout?product=${x.key}`}
                    className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/30 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-xl bg-gradient-to-br ${x.color} flex items-center justify-center text-white shadow-sm`}
                      >
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {t(lang, x.nameKey)}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {t(lang, x.taglineKey)}
                        </div>
                      </div>
                    </div>
                    {x.key === "BANA" ? (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                        {t(lang, x.badgeKey)}
                      </Badge>
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    )}
                  </a>
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
