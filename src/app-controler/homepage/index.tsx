

import { useLang } from "@/lib/useLang";

import { HeroSection } from "./components/HeroSection";
import { HighlightsSection} from "./components/HighlightsSection";
import { ExperiencesSection } from "./components/ExperiencesSection";
import { CollaboratorSection } from "./components/CollaboratorSection";
import { FaqSection } from "./components/FaqSection";
import { EXPERIENCES } from "./contants";

type LocationRow = {
  code?: string;
  name?: string;
  pre_price?: number | string;
};

const LOCATION_CODE_TO_PRODUCT_KEY: Record<string, (typeof EXPERIENCES)[number]["key"]> = {
  BANA: "bana",
  VINPER: "vinpearl",
  KWHOIAN: "hoian-memories",
  NUITHANTAI: "nui-than-tai",
  DUTHUYEN: "cruise",
};

export default function HomePage({ locations }: { locations: LocationRow[] }) {
  const lang = 'vi';

  const topPicks = EXPERIENCES.slice(0, 4)

  const locationCards = () => {
    const list = (locations || [])
      .filter((x) => Boolean(x?.code))
      .map((x) => {
        const code = String(x.code);
        const productKey = LOCATION_CODE_TO_PRODUCT_KEY[code];
        const exp = EXPERIENCES.find((e) => e.key === productKey);
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

    return list
  }

  console.log('locationCards',locationCards())

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <HeroSection lang={lang} topPicks={topPicks} />
      <ExperiencesSection
        lang={lang}
        locationCards={locationCards()}
        fallbackExperiences={EXPERIENCES}
      />
      <HighlightsSection lang={lang}  />
      <CollaboratorSection lang={lang} />
      <FaqSection lang={lang}  />
    </main>
  );
}

