import { CustomerInfoType } from "@/app-controler/buy-ticket/type";

export type CustomerErrors = Partial<Record<keyof CustomerInfoType, string>>;

// Số di động Việt Nam: 0xxxxxxxxx, 84xxxxxxxxx hoặc +84xxxxxxxxx (đầu số 3,5,7,8,9)
const VN_PHONE_RE = /^(0|\+?84)(3|5|7|8|9)\d{8}$/;

// Số quốc tế theo E.164: bắt đầu bằng "+", mã quốc gia không bắt đầu bằng 0, tổng 8-15 chữ số
const INTL_PHONE_RE = /^\+[1-9]\d{7,14}$/;

// Dùng chung cho client (hiện lỗi) và server (chặn dữ liệu sai)
export function validateCustomer(c: Partial<CustomerInfoType> | null | undefined): CustomerErrors {
  const errors: CustomerErrors = {};
  const name = (c?.fullname ?? "").trim();
  const email = (c?.email ?? "").trim();
  // Bỏ khoảng trắng, dấu chấm, gạch ngang, ngoặc đơn
  const phone = (c?.phone ?? "").replace(/[\s.\-()]/g, "");

  if (name.length < 2) errors.fullname = "cart.full_name_required";

  if (!email) errors.email = "cart.email_required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "cart.invalid_email_format";

  if (!phone) errors.phone = "cart.phone_number_required";
  else if (!VN_PHONE_RE.test(phone) && !INTL_PHONE_RE.test(phone))
    errors.phone = "cart.phone_number_example";
  return errors;
}
