import { MenuMgtType } from "@/types";
import { LocationType, PersonType, TicketType } from "@/types/ticket";

export const ACC_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  SUSPENDED: "suspended",
};

export const TYPE_TRANSACTION = {
  ADD: "add",
  PAID: "PAID",
  TICKET_BUY: "ticket_buy",
};

export const ROLES = {
  CUSTOMER: "customer",
  AFFILIATE: "affiliate",
  ADMIN: "admin",
};

export const TOPUPS_STATUS = {
  PENDING: "pending",
  APPROVED: "completed",
  REJECTED: "rejected",
};

export const LIMIT_TABLE = 20;

export const SIDEBAR_ADMIN: MenuMgtType[] = [
  {
    link: "/admin/affiliates",
    lable: "Affiliate",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    link: "/admin/pricing",
    lable: "Quản lý giá vé",
    icon: "M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  {
    link: "/admin/topup-mgt",
    lable: "Quản lý nạp tiền",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    link: "/admin/inventory",
    lable: "Nhập vé",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h2a2 2 0 000-4H9z",
  },
  { link: "/admin/stats", lable: "Thống kê", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
];

export const SIDEBAR_AFF: MenuMgtType[] = [
  {
    link: "/affiliate/topup",
    lable: "Nạp tiền",
    icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    link: "/affiliate/get-ticket",
    lable: "Rút vé",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h2a2 2 0 000-4H9z",
  },
  { link: "/affiliate/stats", lable: "Thống kê", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  {
    link: "/affiliate/transaction",
    lable: "Lịch sử giao dịch",
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export const DB_TABLE_NAME = {
  TOPUPS: "topups",
  PROFILES: "profiles",
  VIEW_PROFILE_TOPUP: "topups_with_profiles",
  FUC_UPADTE_STAUS_BALANCE: "approve_topup",
  AFF_APPLICATION: "affiliate_applications",
  TICKET_TYPES: "ticket_types",
  TICKET_TICKET_VARIANT: "ticket_variants",
  VIEW_TICET_VARIANTS_AND_CATEGORY: "ticket_variants_and_category",
  FUNC_BY_TICKET: "buy_tickets_final",
  LOCATIONS: "locations",
  WALLET_TRANSACTION: "wallet_transactions",
  PROMOTION: "promotion",
  AGENT_PRICE: "agent_prices",
  PROMOTION_PRICE: "promotion_price",
  PROMOTION_LOCATION: "promotion_location",
  ORDERS: "orders",
  VIEW_TICET_SALE: "view_sale_history",
  FUNC_AFF_ADD_MONEY: "handle_topup_webhook",
};

export const BANK_INFO = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME,
  bankNum: process.env.NEXT_PUBLIC_BANK_NUM,
  bankAccName: process.env.NEXT_PUBLIC_BANK_ACC_NAME,
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};

export const AGENT_CODE = {
  CUSTOMER: "customer",
  LEVEL_1: "level_1",
  LEVEL_2: "level_2",
};

export const TYPE_TRANSFER = {
  CUSTOMER: "CMT",
  AFF: "AFF",
};

export const MENUS = [
  {
    link: "/#experiences",
    name: "Trải nghiệm",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    link: "/checkout",
    name: "Mua vé tham quan",
    icon: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z",
  },
  {
    link: "/thanh-tuu",
    name: "Thành tựu",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h2a2 2 0 000-4H9z",
  },

  {
    link: "/faq",
    name: "Hỏi đáp (FAQ)",
    icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];
