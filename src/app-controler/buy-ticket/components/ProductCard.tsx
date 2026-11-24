"use client";

import { stepBtn } from "@/components/ui/const-class";
import { formatVND } from "@/lib/money";
import { CategorySubmitType, ProductBanaType } from "@/types/ticket";
import { useState } from "react";
import CartIcon from "./CartIcon";
import { useCartStore } from "@/stores/useCartStore";
import { Flower2, Minus, Music, Plus, Soup, Sparkles, TramFront } from "lucide-react";
import { BADGE_STYLES, getCategaryItem, getImageProduct } from "../contants";
import ProductDetailModal from "./ProdcutDetail";
import { useTranslation } from "@/lib/i18n/client";
import { get } from "lodash";
import ImageWithFallback from "@/components/ui/ImageFallback";

const FEATURE_ICONS = {
  garden: Flower2,
  cable: TramFront,
  wheel: Sparkles, // thay bằng icon vòng quay của bạn
  show: Music,
};

type Props = {
  product: ProductBanaType;
  quantity: number;
  lisCategory: CategorySubmitType[];
};
const MAX = 99;
const MIN = 0;
export default function ProductCard({ product, quantity, lisCategory }: Props) {
  const { t, lng } = useTranslation();

  const setCartItems = useCartStore((s) => s.addItem);
  const [tampQty, setTempQty] = useState(quantity);

  const step = Math.max(1, product.multiple || 1);
  const maxQty = Math.floor(MAX / step) * step;

  const normalize = (n: number) => {
    const snapped = Math.round(n / step) * step;
    return Math.min(maxQty, Math.max(MIN, snapped));
  };

  const handleAddCart = () => {
    if (tampQty > 0) {
      setCartItems({ product, quantity: tampQty });
    }
  };

  const handleIncrease = () => setTempQty((prev) => normalize(prev + step));

  const handleDecrease = () => setTempQty((prev) => normalize(prev - step));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setTempQty(Number.isNaN(value) ? 0 : Math.min(MAX, Math.max(MIN, value)));
  };
  const handleInputBlur = () => setTempQty((prev) => normalize(prev));
  const hasDiscount =
    product.publicPrice && product.pinalPrice && product.publicPrice > product.pinalPrice;
  const bgImage = "/bana/cauvang.webp";

  return (
    <div className="group relative mb-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#f26b1d]/40 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* Ảnh nền + lớp sương trắng */}
      {bgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/60 transition-opacity duration-500 group-hover:opacity-80"
      />

      <div className="relative flex flex-col gap-4 p-5 md:flex-row md:items-stretch md:justify-between md:gap-6">
        {/* ───────── Trái: tên, nhãn ───────── */}
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="font-display text-xl font-bold uppercase leading-tight text-slate-900">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-lg px-3 py-1 text-sm font-semibold ${
                BADGE_STYLES[product.personType] || BADGE_STYLES["DEFAULT"]
              }`}
            >
              {get(getCategaryItem(product.personType, lisCategory), lng) ||
                getCategaryItem(product.personType, lisCategory)?.name}
            </span>

            {product.restaurantName && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[#22acf9]">
                <Soup color="#22acf9" size={16} />
                {product.restaurantName}
              </span>
            )}
          </div>

          {product.multiple > 1 && (
            <p className="mt-2 text-xs font-medium text-[#ff006c]">
              {t("buyticket.ticket_multiple")}: {product.multiple}
            </p>
          )}
        </div>

        {/* ───────── Phải: giá + (số lượng & thêm giỏ) ───────── */}
        <div className="flex w-full shrink-0 flex-col gap-3 md:w-auto md:items-end">
          {/* Giá */}
          <div className="text-left md:text-right">
            <p className="font-display text-2xl font-bold leading-tight text-[#e5252a]">
              {formatVND(product.pinalPrice || 0)}
            </p>
            {hasDiscount && (
              <p className="mt-0.5 text-sm text-[#b4234a] line-through">
                {t("buyticket.public_price", "Giá công bố")}: {formatVND(product.publicPrice)}
              </p>
            )}
          </div>

          {/* Hành động: mobile xếp dọc, từ sm trở lên cùng 1 hàng */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {/* Stepper dạng viên thuốc */}
            <div className="flex w-full items-center justify-between rounded-full bg-white px-1.5 py-1 shadow-md ring-1 ring-slate-100 sm:w-auto sm:justify-start">
              <button
                type="button"
                aria-label="Giảm số lượng"
                disabled={!tampQty}
                onClick={handleDecrease}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={maxQty}
                aria-label="Số lượng"
                value={tampQty}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="h-8 w-12 bg-transparent text-center text-base font-semibold text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Tăng số lượng"
                disabled={tampQty >= maxQty}
                onClick={handleIncrease}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Nút thêm giỏ: luôn hiện, mờ đi khi số lượng = 0 */}
            <button
              type="button"
              onClick={handleAddCart}
              disabled={tampQty <= 0}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#f26b1d] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e05f14] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none disabled:active:scale-100 sm:w-auto"
            >
              {t("buyticket.add_to_cart")}
              <CartIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
