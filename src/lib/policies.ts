import { COMPANY_INFO } from "@/commons/constant";

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  updatedAt: string;
  sections: { heading: string; paragraphs?: string[]; bullets?: string[] }[];
};

export const policies: Policy[] = [
  {
    slug: "bao-mat",
    title: "homepage.footer.privacy",
    summary: "privacy.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "privacy.sections.0.heading",
        paragraphs: ["privacy.sections.0.paragraphs.0", "privacy.sections.0.paragraphs.1"],
      },
      {
        heading: "privacy.sections.1.heading",
        bullets: [
          "privacy.sections.1.items.0",
          "privacy.sections.1.items.1",
          "privacy.sections.1.items.2",
          "privacy.sections.1.items.3",
        ],
      },
      {
        heading: "privacy.sections.2.heading",
        bullets: [
          "privacy.sections.2.items.0",
          "privacy.sections.2.items.1",
          "privacy.sections.2.items.2",
          "privacy.sections.2.items.3",
          "privacy.sections.2.items.4",
        ],
      },
      {
        heading: "privacy.sections.3.heading",

        paragraphs: ["privacy.sections.3.paragraphs.0", "privacy.sections.3.paragraphs.1"],
      },
      {
        heading: "privacy.sections.4.heading",
        paragraphs: ["privacy.sections.3.paragraphs.0", "privacy.sections.3.paragraphs.1"],
      },
      {
        heading: "privacy.sections.5.heading",
        paragraphs: ["privacy.sections.5.paragraphs.0", "privacy.sections.5.paragraphs.1"],
      },
      {
        heading: "privacy.sections.6.heading",
        paragraphs: ["privacy.sections.6.paragraphs.0"],
      },
      {
        heading: "privacy.sections.7.heading",
        paragraphs: [
          "privacy.sections.7.paragraphs.0",
          "privacy.sections.7.company",
          "privacy.sections.7.address",
        ],
      },
    ],
  },
  {
    slug: "giai-quyet-khieu-nai",
    title: "homepage.footer.complaints",
    summary: "complaint.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "complaint.sections.0.heading",
        paragraphs: ["complaint.sections.0.paragraphs.0"],
      },
      {
        heading: "complaint.sections.1.heading",
        bullets: [
          "complaint.sections.1.items.0",
          "complaint.sections.1.items.1",
          "complaint.sections.1.items.2",
          "complaint.sections.1.items.3",
        ],
      },
      {
        heading: "complaint.sections.2.heading",
        bullets: [
          "complaint.sections.2.items.0",
          "complaint.sections.2.items.1",
          "complaint.sections.2.items.2",
          "complaint.sections.2.items.3",
        ],
      },
      {
        heading: "complaint.sections.3.heading",
        paragraphs: ["complaint.sections.3.paragraphs.0"],
      },
      {
        heading: "complaint.sections.4.heading",
        paragraphs: ["complaint.sections.4.paragraphs.0", "complaint.sections.4.paragraphs.1"],
      },
    ],
  },
  {
    slug: "gia",
    title: "homepage.footer.pricing",
    summary: "price.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "price.sections.0.heading",
        paragraphs: ["price.sections.0.paragraphs.0", "price.sections.0.paragraphs.1"],
      },
      {
        heading: "price.sections.1.heading",
        paragraphs: ["price.sections.1.paragraphs.0", "price.sections.1.paragraphs.1"],
      },
      {
        heading: "price.sections.2.heading",
        paragraphs: ["price.sections.2.paragraphs.0", "price.sections.2.paragraphs.1"],
      },
      {
        heading: "price.sections.3.heading",
        paragraphs: ["price.sections.3.paragraphs.0", "price.sections.3.paragraphs.1"],
      },
    ],
  },
  {
    slug: "thanh-toan",
    title: "homepage.footer.payment",
    summary: "payment.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "payment.sections.0.heading",
        paragraphs: ["payment.sections.0.paragraphs.0", "payment.sections.0.paragraphs.1"],
      },
      {
        heading: "payment.sections.1.heading",
        bullets: [
          "payment.sections.1.bullets.0",
          "payment.sections.1.bullets.1",
          "payment.sections.1.bullets.2",
          "payment.sections.1.bullets.3",
        ],
      },
      {
        heading: "payment.sections.2.heading",
        bullets: [
          "payment.sections.2.bullets.0",
          "payment.sections.2.bullets.1",
          "payment.sections.2.bullets.2",
          "payment.sections.2.bullets.3",
        ],
      },
      {
        heading: "payment.sections.3.heading",
        paragraphs: ["payment.sections.3.paragraphs.0", "payment.sections.3.paragraphs.1"],
      },
      {
        heading: "payment.sections.4.heading",
        paragraphs: ["payment.sections.4.paragraphs.0"],
      },
    ],
  },
  {
    slug: "dieu-kien-dich-vu",
    title: "homepage.footer.serviceConditions",
    summary: "condition.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "condition.sections.0.heading",
        bullets: [
          "condition.sections.0.bullets.0",
          "condition.sections.0.bullets.1",
          "condition.sections.0.bullets.2",
        ],
      },
      {
        heading: "condition.sections.1.heading",
        bullets: [
          "condition.sections.1.bullets.0",
          "condition.sections.1.bullets.1",
          "condition.sections.1.bullets.2",
          "condition.sections.1.bullets.3",
        ],
      },
      {
        heading: "condition.sections.2.heading",
        paragraphs: ["condition.sections.2.paragraphs.0", "condition.sections.2.paragraphs.1"],
      },
      {
        heading: "condition.sections.3.heading",
        paragraphs: ["condition.sections.3.paragraphs.0", "condition.sections.3.paragraphs.1"],
      },
      {
        heading: "condition.sections.4.heading",
        bullets: [
          "condition.sections.4.bullets.0",
          "condition.sections.4.bullets.1",
          "condition.sections.4.bullets.2",
          "condition.sections.4.bullets.3",
        ],
      },
    ],
  },
  {
    slug: "doi-tra-hoan-tien",
    title: "homepage.footer.refund",
    summary: "refund.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "refund.sections.0.heading",
        paragraphs: ["refund.sections.0.paragraphs.0", "refund.sections.0.paragraphs.1"],
      },
      {
        heading: "refund.sections.1.heading",
        bullets: [
          "refund.sections.1.bullets.0",
          "refund.sections.1.bullets.1",
          "refund.sections.1.bullets.2",
        ],
      },
      {
        heading: "refund.sections.2.heading",
        paragraphs: [
          "refund.sections.2.paragraphs.0",
          "refund.sections.2.paragraphs.1",
          "refund.sections.2.paragraphs.2",
        ],
      },
      {
        heading: "refund.sections.3.heading",
        paragraphs: [
          "refund.sections.3.paragraphs.0",
          "refund.sections.3.paragraphs.1",
          "refund.sections.3.paragraphs.2",
        ],
      },
      {
        heading: "refund.sections.4.heading",
        bullets: [
          "refund.sections.4.bullets.0",
          "refund.sections.4.bullets.1",
          "refund.sections.4.bullets.2",
          "refund.sections.4.bullets.3",
        ],
      },
      {
        heading: "refund.sections.5.heading",
        paragraphs: ["refund.sections.5.paragraphs.0", "refund.sections.5.paragraphs.1"],
      },
      {
        heading: "refund.sections.6.heading",
        bullets: [
          "refund.sections.6.bullets.0",
          "refund.sections.6.bullets.1",
          "refund.sections.6.bullets.2",
          "refund.sections.6.bullets.3",
        ],
      },
    ],
  },
  {
    slug: "ho-tro",
    title: "homepage.footer.support",
    summary: "support.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "support.sections.0.heading",
        paragraphs: ["support.sections.0.paragraphs.0"],
      },
      {
        heading: "support.sections.1.heading",
        bullets: [
          "support.sections.1.bullets.0",
          "support.sections.1.bullets.1",
          "support.sections.1.bullets.2",
          "support.sections.1.bullets.3",
        ],
      },
      {
        heading: "support.sections.2.heading",
        paragraphs: ["support.sections.2.paragraphs.0"],
      },
      {
        heading: "support.sections.3.heading",
        paragraphs: ["support.sections.3.paragraphs.0"],
      },
    ],
  },
  {
    slug: "thong-tin-chu-so-huu",
    title: "homepage.footer.ownership",
    summary: "ownership.summary",
    updatedAt: COMPANY_INFO.updatedAt,
    sections: [
      {
        heading: "ownership.sections.0.heading",
        paragraphs: ["ownership.sections.0.paragraphs.0", "ownership.sections.0.paragraphs.1"],
        bullets: [
          "ownership.sections.0.bullets.0",
          "ownership.sections.0.bullets.1",
          "ownership.sections.0.bullets.2",
          "ownership.sections.0.bullets.3",
          "ownership.sections.0.bullets.4",
          "ownership.sections.0.bullets.5",
        ],
      },
      {
        heading: "ownership.sections.1.heading",
        bullets: [
          "ownership.sections.1.bullets.0",
          "ownership.sections.1.bullets.1",
          "ownership.sections.1.bullets.2",
        ],
      },
      {
        heading: "ownership.sections.2.heading",
        paragraphs: ["ownership.sections.2.paragraphs.0"],
        bullets: [
          "ownership.sections.2.bullets.0",
          "ownership.sections.2.bullets.1",
          "ownership.sections.2.bullets.2",
        ],
      },
      {
        heading: "ownership.sections.3.heading",
        paragraphs: ["ownership.sections.3.paragraphs.0", "ownership.sections.3.paragraphs.1"],
      },
      {
        heading: "ownership.sections.4.heading",
        paragraphs: ["ownership.sections.4.paragraphs.0", "ownership.sections.4.paragraphs.1"],
      },
      {
        heading: "ownership.sections.5.heading",
        paragraphs: ["ownership.sections.5.paragraphs.0"],
      },
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((policy) => policy.slug === slug);
}
