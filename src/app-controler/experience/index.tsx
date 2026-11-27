import { SiteExperienceType, SiteType } from "@/types/ticket";
import SiteCard from "./components/site-card";
import { getTranslation } from "@/lib/i18n";

type ExperienceControllerProps = {
  sites: SiteExperienceType[];
  lng: string;
};

const ExperienceController = async ({ sites, lng }: ExperienceControllerProps) => {
  const list = sites;
  const { t } = await getTranslation(lng);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#7f1232] via-[#a51d43] to-[#d94343]">
        {/* Background decoration */}
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {t("buyticket.hero_description")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-left backdrop-blur-sm">
                <p className="text-lg font-bold text-amber-300">{t("buyticket.good_prices")}</p>
                <p className="text-xs text-white/70">{t("buyticket.good_prices_description")}</p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-left backdrop-blur-sm">
                <p className="text-lg font-bold text-amber-300">{t("buyticket.fast_booking")}</p>
                <p className="text-xs text-white/70">{t("buyticket.fast_booking_description")}</p>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-left backdrop-blur-sm">
                <p className="text-lg font-bold text-amber-300">{t("buyticket.convenient")}</p>
                <p className="text-xs text-white/70">{t("buyticket.convenient_description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách địa điểm */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list?.map((site) => (
            <SiteCard key={site.code} site={site} lng={lng} />
          ))}
        </div>
      </section>
    </>
  );
};

export default ExperienceController;
