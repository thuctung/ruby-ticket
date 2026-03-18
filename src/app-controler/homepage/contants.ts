import { ExperienceCard } from "@/types";

export const FAQS = [
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


export const EXPERIENCES: ExperienceCard[] = [
  {
    key: "BANA",
    nameKey: "product.bana.name",
    taglineKey: "product.bana.tagline",
    badgeKey: "product.bana.badge",
    image1: "bana1.jpg",
    image2: "bana2.jpg",
    color: "from-amber-500 to-orange-600",
    category: "Theme Park",
  },
  {
    key: "VINPER",
    nameKey: "product.vinpearl.name",
    taglineKey: "product.vinpearl.tagline",
    badgeKey: "product.vinpearl.badge",
    image1: "namha1.jpg",
    image2: "namha2.jpg",
    color: "from-blue-500 to-cyan-600",
    category: "Water Park",
  },
  {
    key: "KWHOIAN",
    nameKey: "product.hoian.name",
    taglineKey: "product.hoian.tagline",
    badgeKey: "product.hoian.badge",
    image1: "hoian1.jpg",
    image2: "hoian2.jpg",
    color: "from-rose-500 to-pink-600",
    category: "Show",
  },
  {
    key: "NUITHANTAI",
    nameKey: "product.nuiThanTai.name",
    taglineKey: "product.nuiThanTai.tagline",
    badgeKey: "product.nuiThanTai.badge",
    image1: "thantai1.jpg",
    image2: "thantai2.jpg",
    color: "from-emerald-500 to-teal-600",
    category: "Hot Spring",
  },
  {
    key: "DUTHUYEN",
    nameKey: "product.cruise.name",
    taglineKey: "product.cruise.tagline",
    badgeKey: "product.cruise.badge",
    image1: "duthuyen1.jpg",
    image2: "duthuyen2.jpg",
    color: "from-indigo-500 to-blue-600",
    category: "River Cruise",
  },
] as const;