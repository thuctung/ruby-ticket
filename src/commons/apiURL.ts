export const GET_PRICE_AGENT = "/api/auth/admin/price/get-price";

export const GET_ORDER_HISTORY = "/api/auth/affiliate/stats/order-history";

export const GET_ORDER_DETAIL = "/api/auth/affiliate/stats/order-detail";

export const GET_PRODUCT_CATEGORY = "/api/auth/admin/ticket-price/get-category";

export const REGISTER_AFFILIATE = "/api/auth/register";

export const GET_LIST_AFFILIATE = "/api/auth/admin/affi/getlist";

export const ADD_MONEY_FOR_STAFF = "/api/auth/admin/affi/add-money";

export const UPDATE_AFFILIATE_STATUS = "/api/auth/admin/affi/update-status";

export const UPDATE_AFFILIATE_ROLE = "/api/auth/admin/affi/update-role";

export const FORGOT_PASSWORD = "/api/auth/forgot-password";

export const GET_QR_TOPUP = "/api/auth/topup";

export const GET_LIST_TOPUP_MGT = "/api/auth/admin/topup-mgt/get-list";

export const UPDATE_STATUS_TOPUP_MGT = "/api/auth/admin/topup-mgt/update-status";

export const CREATE_ORDER_TICKET = "/api/auth/affiliate/get-ticket/create-order";

export const SEND_MAIL_TICKET_NUI_THAN_TAI =
  "/api/auth/affiliate/get-ticket/send-mail-nui-than-tai";

export const GET_TRANSACTION = "/api/auth/affiliate/transaction/get-transaction";

export const GET_LIST_PRICING = "/api/auth/admin/pricing/get-list";

export const GET_AGENT_LIST = "/api/auth/admin/agents/get-list";

export const CREATE_EDIT_AGENT = "/api/auth/admin/agents/create";

export const DELETE_AGENT = "/api/auth/admin/agents/delete";

export const GET_AGENT_PRICE = "/api/auth/admin/products/get-agent-price";

export const CREATE_AGENT_PRICE = "/api/auth/admin/price/create";

export const UPDATE_AGENT_PRICE = "/api/auth/admin/price/update";

export const GET_HOME_HIGHLIGHTS = "/api/public/home/highlights";

export const GET_ORDER_DETAIL_BY_CODE = "/api/public/order-success/get-order-detail";

export const CLIENT_CREATE_ORDER_TICKET = "/api/public/checkout";

export const CLIENT_UPDATE_STATUS_ORDER_ERROR = "/api/public/update-status-order";

export const SEND_MAIL_TICKET_IN_SYSTEM = "/api/public/send-mail-ticket-in-system";

export const GET_REFUND_SUMMARY_AFF = "/api/auth/affiliate/stats/get-refund-ticket";

export const COUNT_TICKET_SALE = "/api/auth/affiliate/stats/count-ticket";

export const UPDATE_PROFILE = "/api/auth/affiliate/profile/update";

export const AFF_GET_STATUS = "/api/auth/affiliate/profile/get-status";

export const CHANGE_PASSWORD = "/api/auth/affiliate/profile/change-password";

export const GET_ADMIN_REPORT = "/api/auth/admin/history/get-report";

export const COUNT_REPORT = "/api/auth/admin/history/count-report";

export const EXPORT_EXCEL = "/api/auth/admin/history/export-excel";

export const GET_ALL_AFFILATE = "/api/auth/admin/history/get-all-affilate";

export const GET_PROFILE_BY_ORDER = "/api/auth/admin/history/get-info-by-order";

export const ADMIN_GET_SALE_SUMARY = "/api/auth/admin/stats/sumary-email";

export const ADMIN_UPDATE_STATUS_TOPUP = "/api/webhook/sepay";

export const SUN_BOOKING_CANCLE = "/api/sun-api/booking-cancel";

export const GET_PRODUCT_IN_SYSTEM = "/api/auth/products";

export const GET_SITE_BY_STATUS = "/api/auth/admin/sites/get-site-by-status";

export const REBUILD_SERVER = "/api/auth/admin/sites/rebuild-server";

export const GET_SITE_BY_FORM_TYPE = "/api/auth/admin/sites/get-site-by-form-type";

export const GET_ALL_SITE = "/api/auth/admin/sites/get-all-site";

export const UPDATE_SITE = "/api/auth/admin/sites/update-site";

export const GET_PROD = "/api/auth/admin/sites/update-site";

export const GET_PRODUCT_PARAMS = "/api/auth/admin/ticket-price/get-products";

export const UPDATE_PRODUCT = "/api/auth/admin/products/update";

export const DELETE_PRODUCT = "/api/auth/admin/ticket-price/delete-product";

export const UPDATE_PRODUCT_PRICES = "/api/auth/admin/products/sync-product/update-price";

export const UPDATE_AGENT_PRICE_AND_TYPE = "/api/auth/admin/products/update-price-agent";

export const GET_PRODUCT_FILTER = "/api/auth/admin/products/get-list-filter";

export const GET_PRICE_AGENT_DEFAULT = "/api/auth/admin/products/get-agent-price-default";

export const UPDATE_PRICE_AGENT_DEFAULT = "/api/auth/admin/products/update-agent-price-default";

export const GET_CATEGORY = "/api/auth/admin/category/get-list";

// REFUND TICKET HISTORY
export const RH_GET_ORDER_BY_THIRD_PARTY = "/api/auth/admin/refun-ticket/get-order-by-third";

export const RH_SAVE_REFUND_HISTORY = "/api/auth/admin/refun-ticket/save-history";

export const RH_GET_REFUND_HISTORY = "/api/auth/admin/refun-ticket/get-history";

export const RH_GET_PROFILE_BY_EMAIL = "/api/auth/admin/refun-ticket/get-profile";

export const RH_UPDAE_BALANCE_HISTORY = "/api/auth/admin/refun-ticket/return-money-aff";

export const RH_UPDATE_ORDER_ITEM_CANCLE = "/api/auth/admin/refun-ticket/update-oder-item-cancel";

export const RH_GET_PRICE_ORDER_ITEM = "/api/auth/admin/refun-ticket/get-price-order-item";

// Sun API
export const LOGIN_SUN_SYSTEM = "/api/auth/affiliate/get-ticket/login-sun-system";

export const SUN_GET_SITE_LIST = "/api/sun-api/get-site";

export const SUN_GET_PRODOCT_LIST = "/api/sun-api/get-products";

export const SUN_GET_BALANCE = "/api/sun-api/get-balance";

export const SUN_GET_ORDER = "/api/sun-api/get-order";

export const SUN_V2_CREATE_ORDER = "/api/sun-api/v2-create-order";

export const SUN_TICKET_LISTING = "/api/sun-api/ticket-listing";

export const SUN_BOOKING_CREATE = "/api/sun-api/booking-create";

export const SUN_BOOKING_CONFIRM = "/api/sun-api/booking-confirm";

export const SUN_GET_CHARGE_REFUND = "/api/sun-api/check-charge-refund";

export const SUN_REFUND_TICKET = "/api/sun-api/refund-ticket";

export const SUN_CHECK_USEGE_TICKET = "/api/sun-api/check-useged-ticket";

// mOMO

export const CREATE_PAYMENT_WITH_MOMO = "/api/momo/create";
export const CREATE_PAYMENT_WITH_ONE_PAY = "/api/one-pay/create";

export const ORDER_ITEM_AFTER_PAYMENT = "/api/public/get-order-detail";
export const CUSTOMER_CLAIM_ORDER = "/api/public/claim-order";
export const UPDATE_PAYMENT_STATUS = "/api/public/update-payment-status";
