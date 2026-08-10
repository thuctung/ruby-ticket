import { CustomerInfoErrors, CustomerInfoType } from "./type";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+84)\d{9,10}$/;

export function validateCustomerInfo(info: CustomerInfoType): CustomerInfoErrors {
  const errors: CustomerInfoErrors = {};

  if (!info.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên";
  }

  if (!info.email.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!EMAIL_REGEX.test(info.email.trim())) {
    errors.email = "Email không hợp lệ";
  }

  if (!info.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại";
  } else if (!PHONE_REGEX.test(info.phone.trim())) {
    errors.phone = "Số điện thoại không hợp lệ";
  }

  return errors;
}
