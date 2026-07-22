import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HoverImage from "@/components/ui/hover-image";
import { t } from "@/lib/i18n/t";
import { ChevronRight } from "lucide-react";
import { ExperienceCard, SideCard } from "@/types";

type LangKey = "vi" | "en" | "zh" | "ko";

export function ExperiencesSection({
  lang,
  sidseCard,
  fallbackExperiences,
}: {
  lang: LangKey;
  sidseCard: SideCard[];
  fallbackExperiences: ExperienceCard[];
}) {
  const displayPrice = (price: number) => {
    if (!price) return "xxx.xxxđ";

    const abs = Math.abs(price);
    const firstDigit = String(abs)[0] ?? "x";

    if (abs >= 1_000_000) return `${firstDigit}xx.xxx.xxxđ`;
    if (abs >= 100_000) return `${firstDigit}xx.xxxđ`;
    return `${firstDigit}đ`;
  };
  return (
    <section id="experiences" className="py-24 bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
            {t(lang, "section.experiences.title")}
          </h2>
          <p className="text-lg text-slate-500">{t(lang, "section.experiences.desc")}</p>
          <div className="mt-2 mx-auto w-12 h-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500" />
        </div>

        {sidseCard.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sidseCard.map((item) => (
              <Card
                key={item.id}
                className="group overflow-hidden rounded-[2rem] border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-56 relative overflow-hidden">
                  <div
                    className={`absolute top-4 left-4 z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg bg-gradient-to-r ${item.exp.color}`}
                  >
                    {item.exp.category}
                  </div>
                  <HoverImage
                    image={`/${item.exp.image1}`}
                    hoverImage={`/${item.exp.image2}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.name || t(lang, item.exp.nameKey)}
                    </CardTitle>
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none font-bold rounded-lg">
                      {t(lang, item.exp.badgeKey)}
                    </Badge>
                  </div>
                  <CardDescription className="font-medium text-slate-500 italic">
                    {t(lang, item.exp.taglineKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {t(lang, "section.experiences.priceFrom")}
                      </div>
                      <div className="text-xl font-extrabold text-blue-600">
                        {displayPrice(item.pre_price)}
                      </div>
                    </div>
                    <Button
                      asChild
                      className="rounded-xl bg-red-400 hover:bg-green-600 px-6 transition-colors"
                    >
                      {item.status ? (
                        <a
                          href={`/checkout?product=${item.code}`}
                          className="flex items-center gap-2"
                        >
                          Mua Ngay
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      ) : (
                        <a href="tel:0705551668" className="flex items-center gap-2">
                          Liên hệ
                        </a>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {fallbackExperiences.map((x) => (
              <Card
                key={x.key}
                className="group overflow-hidden rounded-[2rem] border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-56 relative overflow-hidden">
                  <div
                    className={`absolute top-4 left-4 z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg bg-gradient-to-r ${x.color}`}
                  >
                    {x.category}
                  </div>
                  <HoverImage
                    image={`/${x.image1}`}
                    hoverImage={`/${x.image2}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {t(lang, x.nameKey)}
                    </CardTitle>
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none font-bold rounded-lg">
                      {t(lang, x.badgeKey)}
                    </Badge>
                  </div>
                  <CardDescription className="font-medium text-slate-500 italic">
                    {t(lang, x.taglineKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {t(lang, "section.experiences.priceFrom")}
                      </div>
                      <div className="text-xl font-extrabold text-blue-600">xxx.xxxđ</div>
                    </div>
                    <Button
                      asChild
                      className="rounded-xl bg-slate-900 hover:bg-blue-600 px-6 transition-colors"
                    >
                      <a href={`/checkout?product=${x.key}`} className="flex items-center gap-2">
                        Mua Ngay
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
