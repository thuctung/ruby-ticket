import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HoverImage from "@/components/ui/hover-image";
import { ChevronRight } from "lucide-react";
import { PHONE_ADMIN } from "@/commons/constant";
import { get } from "lodash";
import { SiteType } from "@/app-controler/admin/site/type";
import { getTranslation } from "@/lib/i18n";
import { getCategoryText } from "../contants";
import { formatVND } from "@/lib/money";

export async function ExperiencesSection({ sites, lng }: { sites: SiteType[]; lng: string }) {
  const { t } = await getTranslation(lng);

  return (
    <section id="experiences" className="py-24 bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
            {t("homepage.featuredExperiences")}
          </h2>
          <div className="mt-2 mx-auto w-12 h-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((item) => (
            <Card
              key={item.code}
              className="group overflow-hidden rounded-[2rem] border-none shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-56 relative overflow-hidden">
                <div
                  className={`absolute top-4 left-4 z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg bg-gradient-to-r ${getCategoryText(item.code).color}`}
                >
                  {getCategoryText(item.code).text}
                </div>
                <HoverImage
                  alt={item.name}
                  image={get(item, ["link_image_site", 0, "url"])}
                  hoverImage={get(item, ["link_image_site", 1, "url"])}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {get(item, lng, item.name) || item.name}
                  </CardTitle>
                </div>
                <CardDescription className="font-medium text-slate-500 italic">
                  {get(item, `description_${lng}`) || item?.description_vi}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                      {t("homepage.startingFrom")}
                    </div>
                    <div className="text-xl font-extrabold text-blue-600">
                      {formatVND(item.pre_price)}
                    </div>
                  </div>
                  <Button
                    asChild
                    className="rounded-xl bg-red-400 hover:bg-green-600 px-6 transition-colors"
                  >
                    {item.status ? (
                      <a
                        href={`/mua-ve-tham-quan?site=${item.code}`}
                        className="flex items-center gap-2"
                      >
                        {t("homepage.buyNow")}
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <a href={`tel:${PHONE_ADMIN}`} className="flex items-center gap-2">
                        {t("homepage.contact")}
                      </a>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
