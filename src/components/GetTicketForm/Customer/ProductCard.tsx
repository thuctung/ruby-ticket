"use client";

import { stepBtn } from "@/components/ui/const-class";
import { formatVND } from "@/lib/money";
import { AgentPriceType, ProductBanaType } from "@/types/ticket";
import PinIcon from "./components/PinIcon";
import { useState } from "react";
import CartIcon from "./components/CartIcon";
import { getPriceAgentAndMultiple } from "../constants";
import { useCartStore } from "@/stores/useCartStore";
import { ROLES } from "@/commons/constant";

type Props = {
  quantities: number;
  product: ProductBanaType;
  mapAgentPrice: Map<string, AgentPriceType>;
  agentPriceDefault: number;
  setQty: (code: string, next: number) => void;
};

export default function ProductCard({
  product,
  quantities,
  setQty,
  mapAgentPrice,
  agentPriceDefault,
}: Props) {
  const max = 99;
  const setCartItems = useCartStore((s) => s.addItem); // JUST FOR CUSTOMER FORM

  const [tampQty, setTempQty] = useState(quantities || 0);

  const handleAddCart = () => {
    if (tampQty > 0) {
      setQty(product.code, tampQty);
      setCartItems({ product, quantity: tampQty });
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-lg shadow-ink/10 md:flex-row md:gap-5 md:p-4">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl md:aspect-auto md:min-h-[240px] md:w-72 lg:w-80">
        <img
          src="/banner-moonprice.png"
          alt={product.name}
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3.5 py-1.5 font-display text-sm font-bold text-ink shadow">
          {product.personType}
        </span>

        <span className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1 text-sm font-medium text-white hover:underline focus-visible:outline-none focus-visible:underline">
          Tìm hiểu thêm
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4 md:px-0 md:py-1">
        <h3 className="font-display text-lg font-bold uppercase leading-snug md:text-xl">
          {product.name}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-ink/60">
          <PinIcon />
          <span className="text-sm">{product.restaurantName}</span>
        </p>

        <div className="mt-auto">
          {/* Giá + số lượng */}
          <div className="mt-2 flex items-center justify-between gap-4 md:mt-4">
            <div>
              <p className="text-sm text-ink/45 line-through">{formatVND(product.publicPrice)}</p>

              <p className="font-display text-xl font-bold text-[#e5252a]">
                {formatVND(
                  getPriceAgentAndMultiple(
                    product,
                    ROLES.CUSTOMER,
                    mapAgentPrice,
                    agentPriceDefault
                  )
                )}
              </p>
            </div>

            <div className="flex items-center overflow-hidden rounded-lg border border-ink/15">
              <button
                type="button"
                aria-label="Giảm số lượng"
                className={stepBtn}
                disabled={!tampQty}
                onClick={() => setTempQty((pre) => (pre > 0 ? pre - product.multiple : pre))}
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={max}
                aria-label="Số lượng"
                value={tampQty}
                onChange={(e) => setTempQty(parseInt(e.target.value, 10) || 0)}
                className="h-9 w-12 text-center text-base font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Tăng số lượng"
                className={stepBtn}
                disabled={quantities >= max}
                onClick={() => setTempQty((pre) => (pre < max ? pre + product.multiple : pre))}
              >
                +
              </button>
            </div>
          </div>

          {/* Hành động */}
          <div className="mt-4 flex justify-end md:max-w-md">
            <button
              type="button"
              onClick={handleAddCart}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#f2a21d] bg-white px-3 py-3 font-semibold text-[#f26b1d] transition hover:bg-orange-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50"
            >
              <CartIcon />
              Thêm giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
