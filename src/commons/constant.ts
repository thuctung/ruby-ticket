import { MenuMgtType } from "@/types";
import {
  Compass,
  Sparkles,
  Ticket,
  Award,
  HelpCircle,
  Store,
  ChevronRight,
  X,
  Plane,
} from "lucide-react";

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

export const LIMIT_TABLE = 10;

export const SIDEBAR_ADMIN: MenuMgtType[] = [
  {
    link: "/admin/affiliates",
    lable: "Quản lý đại lý",
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
  // {
  //   link: "/admin/inventory",
  //   lable: "Nhập vé",
  //   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h2a2 2 0 000-4H9z",
  // },
  { link: "/admin/stats", lable: "Thống kê", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  {
    link: "/admin/agents",
    lable: "Quản lí cấp bậc",
    icon: "M12 3a2 2 0 1 0 0 4a2 2 0 1 0 0 -4M12 7v3M6 10h12M6 10v3M18 10v3M6 16a2 2 0 1 0 0 4a2 2 0 1 0 0 -4M18 16a2 2 0 1 0 0 4a2 2 0 1 0 0 -4",
  },
  {
    link: "/admin/user-mgt",
    lable: "Quản lí user",
    icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0a4 4 0 1 1 8 0M16 11l2 2 4-4",
  },
  {
    link: "/admin/ticket-status",
    lable: "Thông tin vé",
    icon: "M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
  },
  {
    link: "/admin/history",
    lable: "Lịch sử rút vé",
    icon: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2",
  },
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
  {
    link: "/affiliate/ticket-status",
    lable: "Tra cứu vé",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 000 4h2a2 2 0 000-4H9z",
  },
  {
    link: "/affiliate/profile",
    lable: "Thông tin",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
];

export const DB_TABLE_NAME = {
  TOPUPS: "topups",
  PROFILES: "profiles",
  VIEW_PROFILE_TOPUP: "topups_with_profiles",
  VIEW_ADMIN_REPORT: "admin_order_report",
  FUC_UPADTE_STAUS_BALANCE: "approve_topup",
  FUC_CUSTOMER_BUY_TICKET: "customer_buy_ticket",
  AFF_APPLICATION: "affiliate_applications",
  TICKET_TYPES: "ticket_types",
  TICKET_TICKET_VARIANT: "ticket_variants",
  VIEW_TICET_VARIANTS_AND_CATEGORY: "ticket_variants_and_category",
  LOCATIONS: "locations",
  WALLET_TRANSACTION: "wallet_transactions",
  PROMOTION: "promotion",
  AGENT_PRICE: "agent_prices",
  PROMOTION_PRICE: "promotion_price",
  PROMOTION_LOCATION: "promotion_location",
  ORDERS: "orders",
  ORDERS_ITEMS: "order_items",
  VIEW_TICET_SALE: "view_sale_history",
  FUNC_AFF_ADD_MONEY: "handle_topup_webhook",
  AGENTS: "agents",
  FUNC_CREATE_ORDER_PENDING: "create_order_pending",
  FUNC_COMPLETE_ORDER: "complete_order",
  FUNC_GET_AGENT_SALE_SUMARY: "get_agent_sale_summary",
  FUNC_GET_ALL_SALE_SUMARY: "get_all_sale_summary",
};

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const BANK_INFO = {
  bankName: process.env.NEXT_PUBLIC_BANK_NAME,
  bankNum: process.env.NEXT_PUBLIC_BANK_NUM,
  bankAccName: process.env.NEXT_PUBLIC_BANK_ACC_NAME,
};

export const SUN_GROUP = {
  swgSubscriptionKey: process.env.NEXT_PUBLIC_SUN_SWG_SUBSCRIPTION_KEY || "",
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
    link: "/#travel-services",
    name: "Khám phá dịch vụ",
    icon: Compass,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    link: "/#experiences",
    name: "Trải nghiệm",
    icon: Sparkles,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    link: "/checkout",
    name: "Mua vé tham quan",
    icon: Ticket,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    link: "/thanh-tuu",
    name: "Thành tựu",
    icon: Award,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },

  {
    link: "/faq",
    name: "Hỏi đáp (FAQ)",
    icon: HelpCircle,
    iconBg: "bg-gray-50",
    iconColor: "text-gray-600",
  },
  {
    link: "/register",
    name: "Đăng ký đại lý",
    icon: Store,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export const SITE_SUB_GROUP = {
  HLS: "SUN WORLD HẠ LONG",
  BNC: "SUN WORLD BÀ NÀ HILLS",
  SBD: "SUN WORLD BADEN",
  FSS: "SUN WORLD FANSIPAN",
  SWS: "SUN WORLD SAM SON",
  SWN: "SUN WORLD HA NAM",
  SCB: "SUN WORLD CAT BA",
};

export const LOCAL_SUN_TOKEN = "sun_access_token";

export const CUSTOMER = "customer";
export const AGENT = "agent";

export const PersonType = {
  [CUSTOMER]: "Khách lẻ",
  [AGENT]: "Đại lý",
};

export const END_DATE_GMT7 = "T23:59:59+07:00";
export const START_DATE_GMT7 = "T00:00:00+07:00";

export const ERROR_MESSAGE = {
  SUN_WORLD_TICKET: "Lỗi xuất vé từ Sun world",
  PAYMENT_TIMEOUT: "Hết thời gian thanh toán",
};
