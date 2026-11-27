import LazyImage from "@/components/ui/lazy-image";
import { getTranslation } from "@/lib/i18n";
import { formatVND } from "@/lib/money";
import { SiteExperienceType } from "@/types/ticket";
import { get } from "lodash";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PHONE_ADMIN } from "@/commons/constant";

export const getBgImg = (siteCode: string) => {
  switch (siteCode) {
    case "BNC": {
      return "/bana1.jpg";
    }
    case "SWV": {
      return "/vungtau1.jpg";
    }
    case "MAKAZUKI": {
      return "/mikazuki1.webp";
    }
    case "HTI": {
      return "/honthom1.jpg";
    }
    case "SBD": {
      return "/baden2.jpg";
    }
    case "FSS": {
      return "/fansipan1.jpeg";
    }
    case "CONGTROI": {
      return "/congtroi.jpg";
    }
    case "NUITHANTAI": {
      return "/nui-than-tai-3.webp";
    }
    case "DUTHUYEN": {
      return "/duthuyen1.jpg";
    }
    case "SCB": {
      return "/catba.webp";
    }
    case "VIN_NAMHOIAN": {
      return "/namha1.jpg";
    }
    case "SWS": {
      return "/samson.jpeg";
    }
    case "KWHOIAN": {
      return "/hoian2.jpg";
    }
    case "SWN": {
      return "/namha2.jpg";
    }
    case "HLS": {
      return "/halong2.jpg";
    }
    default: {
      return "/bana2.jpg";
    }
  }
};

export default async function SiteCard({ site, lng }: { site: SiteExperienceType; lng: string }) {
  const { t } = await getTranslation(lng);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-ruby-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ruby-300 hover:shadow-xl hover:shadow-ruby-900/10 focus-within:ring-2 focus-within:ring-ruby-600">
      <div className="relative aspect-[4/3] overflow-hidden bg-ruby-100">
        <LazyImage
          alt={site.name}
          src={get(site, ["link_image_site", 0, "url"])}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          wrapperClassName="h-full"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/0 to-black/10 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Location */}
        <span className="absolute left-3 top-3 z-20 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 px-2 py-1 text-xs font-bold text-white shadow-md shadow-orange-400/30">
          {get(site, ["location", lng]) || site.location?.name}
        </span>

        {/* Buy button */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          {site.status ? (
            <Link
              href={`/mua-ve-tham-quan?site=${site.code}`}
              className="inline-flex translate-y-4 items-center gap-2 rounded-full bg-ruby-600 px-6 py-3 text-sm font-bold text-white opacity-0 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105 hover:bg-ruby-700 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
            >
              {t("homepage.buyNow")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              href={`tel:${PHONE_ADMIN}`}
              className="inline-flex translate-y-4 items-center gap-2 rounded-full bg-ruby-600 px-6 py-3 text-sm font-bold text-white opacity-0 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105 hover:bg-ruby-700 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
            >
              {t("homepage.contact")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="text-lg font-semibold leading-snug text-ruby-950 transition-colors group-hover:text-ruby-700">
            {get(site, lng, site.name)}
          </h2>
        </div>

        <p className="text-sm text-ruby-800/70">{get(site, `description_${lng}`, "")}</p>

        <div className="mt-auto flex items-baseline justify-between border-t border-ruby-100 pt-3">
          <span className="text-sm text-ruby-800/70">{t("homepage.startingFrom")}</span>
          <span className="text-lg font-bold text-ruby-700">{formatVND(site.pre_price)}</span>
        </div>
      </div>
    </article>
  );
}
