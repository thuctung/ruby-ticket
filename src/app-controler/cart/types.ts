import { ProductSubmitType } from "@/types/ticket";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number; // percent: 0-100, fixed: VND
  label: string;
};

export type PaymentMethodId = "qr" | "card" | "momo";

// Kết quả server trả về sau khi tạo đơn
export type CreatedOrder = {
  orderCode: string; // mã thanh toán duy nhất: dùng làm nội dung chuyển khoản / mã tham chiếu cổng thanh toán
  amount: number;
};

export type GetTicketCustomerType = {
  currentOrderData: any;
  productSelected: ProductSubmitType[];
  email: string;
  route: AppRouterInstance;
  showLoading?: boolean;
  callback?: Function;
};
