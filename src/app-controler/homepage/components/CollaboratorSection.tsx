import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n/t";
import { CreditCard, Star } from "lucide-react";

type LangKey = "vi" | "en" | "zh" | "ko";

export function CollaboratorSection({ lang }: { lang: LangKey }) {
  return (
    <section id="collaborator" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 -z-10" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
              {t(lang, "section.affiliate.title")}
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              {t(lang, "section.affiliate.desc")}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                asChild
              >
                <a href="/register">Đăng ký làm Affiliate</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 hover:bg-slate-50"
                asChild
              >
                <a href="#faq">{t(lang, "cta.viewQuestions")}</a>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 bg-slate-50 p-4">
              <CardHeader>
                <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  {t(lang, "section.affiliate.cards.sell.title")}
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium leading-relaxed">
                  {t(lang, "section.affiliate.cards.sell.desc")}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-200/50 bg-white p-4">
              <CardHeader>
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  {t(lang, "section.affiliate.cards.wallet.title")}
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium leading-relaxed">
                  {t(lang, "section.affiliate.cards.wallet.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg inline-block">
                  {t(lang, "section.affiliate.cards.wallet.note")}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

