"use client";

import { Banner } from "./components/banner";
import TravelServices from "./components/TravelServices";
import { ExperiencesSection } from "./components/ExperiencesSection";
import { EXPERIENCES } from "./contants";
import { CollaboratorSection } from "./components/CollaboratorSection";
import Feedback from "./components/Feedback";
import { FaqSection } from "./components/FaqSection";
import { SiteType } from "@/types/ticket";

export default function HomePage({ sites }: { sites: SiteType[] }) {
  const lang = "vi";

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
          name: item.name || "",
          pre_price: price,
          exp,
          status: item.status,
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
      <Banner />

      <TravelServices />

      <ExperiencesSection lang={lang} sidseCard={sideCard()} fallbackExperiences={EXPERIENCES} />
      {/* <TopPartnersSection /> */}
      <Feedback />
      <CollaboratorSection lang={lang} />
      <FaqSection lang={lang} />
    </div>
  );
}
