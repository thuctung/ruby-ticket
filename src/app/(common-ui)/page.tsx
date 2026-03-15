"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/site/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { t } from "@/lib/i18n/t";
import { useLang } from "@/lib/useLang";
import Image from "next/image";
import HoverImage from "@/components/ui/hover-image";

const highlights = [
  {
    titleKey: "home.highlights.fast.title",
    descKey: "home.highlights.fast.desc",
  },
  {
    titleKey: "home.highlights.qr.title",
    descKey: "home.highlights.qr.desc",
  },
  {
    titleKey: "home.highlights.pricing.title",
    descKey: "home.highlights.pricing.desc",
  },
  {
    titleKey: "home.highlights.agent.title",
    descKey: "home.highlights.agent.desc",
  },
] as const;

const danangExperiences = [
  {
    key: "bana",
    nameKey: "product.bana.name",
    taglineKey: "product.bana.tagline",
    badgeKey: "product.bana.badge",
    image1: 'bana1.jpg',
    image2: 'bana2.jpg'
  },
  {
    key: "vinpearl",
    nameKey: "product.vinpearl.name",
    taglineKey: "product.vinpearl.tagline",
    badgeKey: "product.vinpearl.badge",
    image1: 'namha1.jpg',
    image2: 'namha2.jpg'

  },
  {
    key: "hoian-memories",
    nameKey: "product.hoian.name",
    taglineKey: "product.hoian.tagline",
    badgeKey: "product.hoian.badge",
    image1: 'hoian1.jpg',
    image2: 'hoian2.jpg'

  },
  {
    key: "nui-than-tai",
    nameKey: "product.nuiThanTai.name",
    taglineKey: "product.nuiThanTai.tagline",
    badgeKey: "product.nuiThanTai.badge",
    image1: 'thantai1.jpg',
    image2: 'thantai2.jpg'


  },
  {
    key: "cruise",
    nameKey: "product.cruise.name",
    taglineKey: "product.cruise.tagline",
    badgeKey: "product.cruise.badge",
    image1: 'duthuyen1.jpg',
    image2: 'duthuyen2.jpg'


  },
] as const;

const faqs = [
  {
    qKey: "section.faq.items.needAccount.q",
    aKey: "section.faq.items.needAccount.a",
  },
  {
    qKey: "section.faq.items.chooseDate.q",
    aKey: "section.faq.items.chooseDate.a",
  },
  {
    qKey: "section.faq.items.payment.q",
    aKey: "section.faq.items.payment.a",
  },
  {
    qKey: "section.faq.items.agent.q",
    aKey: "section.faq.items.agent.a",
  },
] as const;

export default function Home() {
  const lang = useLang();

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <section className="relative overflow-hidden bg-[#0043ff21]">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-180px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200 via-blue-200 to-violet-200 blur-3xl opacity-70" />
          <div className="absolute -bottom-24 -right-24 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-violet-200 via-fuchsia-200 to-pink-200 blur-3xl opacity-60" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {t(lang, "hero.pill")}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              {t(lang, "hero.title1")}
              <span className="block bg-gradient-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent">
                {t(lang, "hero.title2")}
              </span>
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {t(lang, "hero.desc")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <a href="/checkout">{t(lang, "cta.buyNow")}</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#experiences">{t(lang, "cta.viewExperiences")}</a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base">
                    {t(lang, "home.feature.noLogin.title")}
                  </CardTitle>
                  <CardDescription>
                    {t(lang, "home.feature.noLogin.desc")}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base">
                    {t(lang, "home.feature.instantQR.title")}
                  </CardTitle>
                  <CardDescription>
                    {t(lang, "home.feature.instantQR.desc")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Right visual */}
          <div className="relative">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">
                      {t(lang, "hero.cardTitle")}
                    </CardTitle>
                    <CardDescription>{t(lang, "hero.cardDesc")}</CardDescription>
                  </div>
                  <Badge variant="outline">{t(lang, "hero.city")}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {danangExperiences.slice(0, 4).map((x) => (
                  <a
                    key={x.key}
                    href={`/checkout?product=${x.key}`}
                    className="flex items-center justify-between rounded-xl border bg-muted/20 p-4 hover:bg-muted/30"
                  >
                    <div>
                      <div className="font-medium">{t(lang, x.nameKey)}</div>
                      <div className="text-sm text-muted-foreground">
                        {t(lang, x.taglineKey)}
                      </div>
                    </div>
                    {x.key === 'bana' ?
                      <Badge>{t(lang, x.badgeKey)}</Badge>
                      : null}
                  </a>
                ))}

                <div className="pt-2">
                  <Button className="w-full" size="lg" asChild>
                    <a href="/checkout">{t(lang, "cta.goToCheckout")}</a>
                  </Button>
                  <div className="mt-2 text-center text-xs text-muted-foreground">
                    {t(lang, "hero.miniPill")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section id="experiences" className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">
              {t(lang, "section.experiences.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t(lang, "section.experiences.desc")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {danangExperiences.map((x) => (
              <Card key={x.key} className="rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">{t(lang, x.nameKey)}</CardTitle>
                    <Badge>{t(lang, x.badgeKey)}</Badge>
                  </div>
                  <CardDescription>{t(lang, x.taglineKey)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className=" h-28 w-full  rounded-xl relative overflow-hidden" >
                    <HoverImage
                      image={`/${x.image1}`}
                      hoverImage={`/${x.image2}`}
                      className="h-28"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="text-muted-foreground">
                        {t(lang, "section.experiences.priceFrom")}
                      </div>
                      <div className="font-semibold">xxx.xxxđ</div>
                    </div>
                    <Button asChild>
                      <a href={`/checkout?product=${x.key}`}>
                        {t(lang, "cta.chooseDateBuy")}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborator */}
      <section id="collaborator" className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div>
            <h2 className="text-2xl font-semibold">
              {t(lang, "section.affiliate.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(lang, "section.affiliate.desc")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  {t(lang, "section.affiliate.cards.sell.title")}
                </CardTitle>
                <CardDescription>
                  {t(lang, "section.affiliate.cards.sell.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href="/register">Đăng ký làm Affiliate</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#faq">{t(lang, "cta.viewQuestions")}</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  {t(lang, "section.affiliate.cards.wallet.title")}
                </CardTitle>
                <CardDescription>
                  {t(lang, "section.affiliate.cards.wallet.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {t(lang, "section.affiliate.cards.wallet.note")}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div>
            <h2 className="text-2xl font-semibold">{t(lang, "section.faq.title")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(lang, "section.faq.desc")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {faqs.map((x) => (
              <Card key={x.qKey} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">{t(lang, x.qKey)}</CardTitle>
                  <CardDescription>{t(lang, x.aKey)}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
