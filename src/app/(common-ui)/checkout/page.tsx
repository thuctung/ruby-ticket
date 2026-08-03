import CheckoutControlerPage from "@/app-controler/checkout-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vé Bà Nà Hills 2026 Giá Mới Nhất",
  description: "Mua vé Bà Nà Hills online giá tốt, nhận vé điện tử ngay sau thanh toán.",
  keywords: [
    "vé bà nà",
    "vé bà nà hills",
    "mua vé bà nà online",
    "du lịch bà nà hills",
    "vé điện tử bà nà hills",
    "giá vé bà nà hills",
    "bà nà hills ticket",
    "bà nà hills entrance fee",
  ],
};
export default function CheckoutPage() {
  return <CheckoutControlerPage />;
}
