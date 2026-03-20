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
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const LIMIT_TABLE = 20;

export const SIDEBAR_ADMIN: MenuMgtType[] = [
  { link: "/admin/affiliates", lable: "Affiliate" },
  { link: "/admin/pricing", lable: "Quản lý giá vé" },
  { link: "/admin/topup-mgt", lable: "Quản lý nạp tiền" },
  { link: "/admin/inventory", lable: "Nhập vé" },
  { link: "/admin/stats", lable: "Thống kê" },
];

export const SIDEBAR_AFF: MenuMgtType[] = [
  { link: "/affiliate/topup", lable: "Nạp tiền" },
  { link: "/affiliate/get-ticket", lable: "Rút vé" },
  { link: "/affiliate/stats", lable: "Thống kê" },
  { link: "/affiliate/transaction", lable: "Lịch sử giao dịch" },
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
