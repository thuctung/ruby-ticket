"use client";

import { Banner } from "./components/banner";
import TravelServices from "./components/TravelServices";
import { ExperiencesSection } from "./components/ExperiencesSection";
import { EXPERIENCES } from "./contants";
import { CollaboratorSection } from "./components/CollaboratorSection";
import Feedback from "./components/Feedback";
import { FaqSection } from "./components/FaqSection";
import { SiteType } from "@/types/ticket";
import { LangKey } from "@/types";
import { t } from "@/lib/i18n/t";

export default function HomePage({ sites, locale }: { sites: SiteType[]; locale: LangKey }) {
  const sideCard: any = () => {
    const list = sites
      .map((item) => {
        const code = String(item.code);
        const exp = EXPERIENCES.find((e) => e.key === code);
        if (!exp) return null;
        const price = Number(item.pre_price ?? 0) || 0;
        return {
          id: code,
          code,
          name: t(locale, exp.nameKey) || "",
          pre_price: price,
          exp,
          status: item.status,
          category: t(locale, exp.category) || "",
        };
      })
      .filter(Boolean) as unknown as Array<{
      id: string;
      code: string;
      name: string;
      pre_price: number;
      exp: (typeof EXPERIENCES)[number];
      status: boolean;
    }>;
    return list;
  };

  return (
    <div className="bg-white text-neutral-900 antialiased font-sans selection:bg-blue-500 selection:text-white">
      <Banner lang={locale} />

      <TravelServices lang={locale} />

      <ExperiencesSection lang={locale} sidseCard={sideCard()} fallbackExperiences={EXPERIENCES} />
      {/* <TopPartnersSection /> */}
      <Feedback lang={locale} />
      <CollaboratorSection lang={locale} />
      <FaqSection lang={locale} />
    </div>
  );
}
