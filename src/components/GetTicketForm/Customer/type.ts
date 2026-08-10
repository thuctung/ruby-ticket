import { PersonType } from "@/commons/constant";

export interface Ticket {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  qty: number;
}

export const CATEGORY_STYLES: Record<
  string,
  { badgeBg: string; badgeText: string; iconBg: string }
> = {
  ["ADULT"]: {
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
    iconBg: "bg-blue-500",
  },
  ["CHILD"]: {
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-500",
    iconBg: "bg-orange-400",
  },
  ["SENIORS"]: {
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-600",
    iconBg: "bg-purple-500",
  },
};

export type CustomerInfoType = {
  fullname: string;
  email: string;
  phone: string;
  date_use: string;
  description: string;
};

export interface CustomerInfoErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}
