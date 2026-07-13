"use client";

import { Banner } from "./components/banner";
import TravelServices from "./components/TravelServices";
import { ExperiencesSection } from "./components/ExperiencesSection";
import { EXPERIENCES } from "./contants";
import { CollaboratorSection } from "./components/CollaboratorSection";
import Feedback from "./components/Feedback";
import { FaqSection } from "./components/FaqSection";

type LocationRow = {
  code?: string;
  name?: string;
  pre_price?: number | string;
  status?: boolean;
};

export default function HomePage({ locations }: { locations: LocationRow[] }) {
  const lang = "vi";

  const locationCards = () => {
    const list = locations
      .map((item) => {
        const code = String(item.code);
        const exp = EXPERIENCES.find((e) => e.key === code);
        if (!exp) return null;
        const price = Number(item.pre_price ?? 0) || 0;
        return {
          id: code,
          code,
          name: item.name || "",
          pre_price: price,
          exp,
          status: item.status,
        };
      })
      .filter(Boolean) as Array<{
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
      <Banner />

      <TravelServices />

      <ExperiencesSection
        lang={lang}
        locationCards={locationCards()}
        fallbackExperiences={EXPERIENCES}
      />
      {/* <TopPartnersSection /> */}
      <Feedback />
      <CollaboratorSection lang={lang} />
      <FaqSection lang={lang} />
    </div>
  );
}
