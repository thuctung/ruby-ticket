import { t } from "@/lib/i18n/t";
import type { LucideIcon } from "lucide-react";
import {
  QrCode,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
type LangKey = "vi" | "en" | "zh" | "ko";

type HighlightItem = {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
};

export type { HighlightItem };


const highlights: HighlightItem[] = [
  {
    titleKey: "home.highlights.fast.title",
    descKey: "home.highlights.fast.desc",
    icon: Zap,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    titleKey: "home.highlights.qr.title",
    descKey: "home.highlights.qr.desc",
    icon: QrCode,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    titleKey: "home.highlights.pricing.title",
    descKey: "home.highlights.pricing.desc",
    icon: Ticket,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    titleKey: "home.highlights.agent.title",
    descKey: "home.highlights.agent.desc",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
] as const;

export function HighlightsSection({
  lang,
}: {
  lang: LangKey;
}) {
  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((h, i) => (
            <div key={i} className="group relative">
              <div
                className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${h.bgColor} ${h.color} transition-transform group-hover:scale-110 duration-300`}
              >
                <h.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                {t(lang, h.titleKey as any)}
              </h3>
              <p className="text-slate-500 leading-relaxed">{t(lang, h.descKey as any)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

