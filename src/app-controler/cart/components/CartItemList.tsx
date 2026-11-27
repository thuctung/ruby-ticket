"use client";

import { Minus, Plus, Trash2, Ticket } from "lucide-react";
import Link from "next/link";
import { ProductInCartType } from "@/types/ticket";
import { formatVND } from "@/lib/money";
import { useCartStore } from "@/stores/useCartStore";
import { CommonType } from "@/types";
import { useCommonStore } from "@/stores/useCommonStore";
import { useTranslation } from "@/lib/i18n/client";

const STUB_GRADIENTS = [
  "bg-gradient-to-br from-[#0f766e] to-[#34d399]",
  "bg-gradient-to-br from-[#f97316] to-[#fbbf24]",
  "bg-gradient-to-br from-[#14532d] to-[#4ade80]",
];

type Props = {
  items: ProductInCartType[];
};

type CartItemProps = {
  item: ProductInCartType;
  idx: number;
};
const MAX = 99;
const MIN = 0;

const CartItem = ({ item, idx }: CartItemProps) => {
  const { t } = useTranslation();
  const { product, quantity } = item;
  const step = Math.max(1, item.product.multiple || 1);
  const maxQty = Math.floor(MAX / step) * step;
  const normalize = (n: number) => {
    const snapped = Math.round(n / step) * step;
    return Math.min(maxQty, Math.max(MIN, snapped));
  };

  const { showConfirm }: CommonType | any = useCommonStore.getState();

  const { addItem, removeItem } = useCartStore((s) => s);

  const onIncrease = () => {
    const value = normalize(quantity + step);
    addItem({ product, quantity: value });
  };

  const onDecrease = () => {
    const value = normalize(quantity - step);
    addItem({ product, quantity: value });
  };

  const onRemove = () => {
    showConfirm({
      message: t("cart.confirm_delete_ticket"),
      textOk: t("common.label.delete"),
      okFunc: () => removeItem(item.product.code),
    });
  };

  return (
    <li
      key={item.product.code}
      className="relative flex rounded-2xl bg-white shadow-[0_12px_32px_-16px_rgba(28,91,65,0.35)] ring-1 ring-slate-900/5"
    >
      <div
        className={`flex w-14 shrink-0 items-center sm:w-24 justify-center rounded-l-2xl bg-gradient-to-br bg-cover bg-center ${
          STUB_GRADIENTS[idx % STUB_GRADIENTS.length]
        }`}
      >
        <Ticket className="h-6 w-6 text-white/90 sm:h-8 sm:w-8" />
      </div>

      <div aria-hidden className="my-3 border-l-2 border-dashed border-slate-200" />

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-2 font-semibold leading-snug bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              {item.product.name}
            </p>
            <p className="w-full  text-[12px] ">{item.product.restaurantName || ""}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Xóa ${item.product.name}`}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#fe9614]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="inline-flex items-center rounded-full border border-slate-200">
            <button
              type="button"
              onClick={onDecrease}
              disabled={item.quantity <= 1}
              aria-label="Giảm số lượng"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              aria-label="Tăng số lượng"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="ml-auto text-right">
            <p className="text-[15px] font-bold text-[#1c5b41] tabular-nums sm:text-base">
              {formatVND((item.product.pinalPrice || 0) * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-slate-400 tabular-nums">
                {formatVND(item.product.pinalPrice || 0)}/{t("cart.ticket")}
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export function CartItemList({ items }: Props) {
  const { t } = useTranslation();
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <Ticket className="h-10 w-10 text-slate-300" />
        <p className="font-semibold text-slate-700">{t("cart.empty_cart")}</p>
        <p className="text-sm text-slate-500">{t("cart.empty_cart_description")}</p>
        <Link
          href="/mua-ve-tham-quan"
          className="mt-2 rounded-full bg-[#1c5b41] px-5 py-2 text-sm font-semibold text-white hover:bg-[#164a35]"
        >
          {t("cart.buy_tickets_now")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <CartItem item={item} key={idx} idx={idx} />
        ))}
      </ul>
    </>
  );
}
