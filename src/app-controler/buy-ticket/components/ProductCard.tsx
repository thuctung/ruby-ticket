"use client";

import { stepBtn } from "@/components/ui/const-class";
import { formatVND } from "@/lib/money";
import { CategorySubmitType, ProductBanaType } from "@/types/ticket";
import { useState } from "react";
import CartIcon from "./CartIcon";
import { useCartStore } from "@/stores/useCartStore";
import { Clock3, Flower2, Minus, Music, Plus, Soup, Sparkles, TramFront } from "lucide-react";
import { BADGE_STYLES, getCategaryItem, getImageProduct, styleBtnAddCard } from "../contants";
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
    <div className="group relative isolate mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* Background */}
      {bgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-[0.5] transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-white/95 via-white/95 to-orange-50/70"
      />

      {/* Accent line */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#f26b1d] to-orange-300 opacity-80" />

      <div className="flex flex-col gap-5 p-4 pl-5 sm:p-5 sm:pl-6 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT: Ticket information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {product.multiple > 1 && (
              <span className="rounded-md bg-pink-50 px-2 py-1 text-xs font-semibold text-pink-600">
                {t("buyticket.ticket_multiple")}: {product.multiple}
              </span>
            )}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              BADGE_STYLES[product.personType] || BADGE_STYLES["DEFAULT"]
            }`}
          >
            {get(getCategaryItem(product.personType, lisCategory), lng) ||
              getCategaryItem(product.personType, lisCategory)?.name}
          </span>
          <h3 className="mt-2 font-display text-lg font-bold uppercase leading-snug text-slate-900 sm:text-xl">
            {product.name}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {product.restaurantName && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">
                <Soup size={14} />
                {product.restaurantName}
              </span>
            )}
            {(product.openTime || product.closeTime) && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Clock3 size={14} className="text-orange-500" />
                <span>
                  {product.openTime || "--:--"}
                  {" - "}
                  {product.closeTime || "--:--"}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Price and actions */}
        <div className="flex shrink-0 flex-col gap-4 border-t border-slate-200/70 pt-4 lg:min-w-[290px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          {/* Price */}
          <div className="flex items-end justify-between gap-3 lg:justify-end">
            <div className="lg:text-right">
              <p className="text-xs font-medium text-slate-500">
                {t("buyticket.public_price", "Giá vé")}
              </p>

              <p className="mt-0.5 font-display text-2xl font-extrabold tracking-tight text-[#e5252a] sm:text-3xl">
                {formatVND(product.pinalPrice || 0)}
              </p>

              {hasDiscount && (
                <p className="mt-1 text-xs font-medium text-slate-400 line-through">
                  {t("buyticket.public_price", "Giá công bố")}: {formatVND(product.publicPrice)}
                </p>
              )}
            </div>
          </div>

          {/* Quantity and cart */}
          <div className="flex items-center gap-2">
            {/* Quantity stepper */}
            <div className="flex h-11 shrink-0 items-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                aria-label="Giảm số lượng"
                disabled={!tampQty}
                onClick={handleDecrease}
                className="flex h-full w-9 items-center justify-center rounded-l-xl text-slate-500 transition hover:bg-slate-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:text-slate-300"
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
                className="h-full w-10 bg-transparent text-center text-sm font-bold text-slate-900 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <button
                type="button"
                aria-label="Tăng số lượng"
                disabled={tampQty >= maxQty}
                onClick={handleIncrease}
                className="flex h-full w-9 items-center justify-center rounded-r-xl text-slate-500 transition hover:bg-slate-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddCart}
              disabled={tampQty <= 0}
              className={styleBtnAddCard}
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
