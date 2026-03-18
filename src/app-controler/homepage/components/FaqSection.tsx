import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n/t";
import { HelpCircle } from "lucide-react";
import { FAQS } from "../contants";
import Link from "next/link";

type LangKey = "vi" | "en" | "zh" | "ko";

export function FaqSection({
  lang,
}: {
  lang: LangKey;
}) {
  return (
    <section id="faq" className="py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-600">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
            {t(lang, "section.faq.title")}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl">{t(lang, "section.faq.desc")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FAQS.map((x,index) => (
            <Link href='/faq' key={index}>
              <Card
                key={x.qKey}
                className="rounded-3xl border-none shadow-md hover:shadow-xl transition-shadow duration-300 p-2"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      Q
                    </span>
                    {t(lang, x.qKey as any)}
                  </CardTitle>
                  <CardDescription className="text-slate-500 font-medium pl-9 leading-relaxed">
                    {t(lang, x.aKey as any)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
