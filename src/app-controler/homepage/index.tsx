"use client";

import { Banner } from "./components/banner";
import TravelServices from "./components/TravelServices";
import { ExperiencesSection } from "./components/ExperiencesSection";
import { EXPERIENCES } from "./contants";
import { CollaboratorSection } from "./components/CollaboratorSection";
import Feedback from "./components/Feedback";
import { FaqSection } from "./components/FaqSection";
import TopPartnersSection from "./components/TopPartners";

type LocationRow = {
  code?: string;
  name?: string;
  pre_price?: number | string;
};

export default function HomePage({ locations }: { locations: LocationRow[] }) {
  const lang = "vi";
  console.log("locations", locations);

  const locationCards = () => {
    const list = locations
      .map((x) => {
        const code = String(x.code);
        const exp = EXPERIENCES.find((e) => e.key === code);
        if (!exp) return null;
        const price = Number(x.pre_price ?? 0) || 0;
        return {
          id: code,
          code,
          name: x.name || "",
          pre_price: price,
          exp,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      code: string;
      name: string;
      pre_price: number;
      exp: (typeof EXPERIENCES)[number];
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
