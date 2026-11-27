"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Soup, X } from "lucide-react";
import { ProductBanaType } from "@/types/ticket";
import { getGuideByProductCode } from "@/app-controler/affi/getTicket/components/constants";

type Props = {
  product: ProductBanaType;
  onClose: () => void;
};

export default function ProductDetailModal({ product, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const texts = getGuideByProductCode(product.site_code, product.code);
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className="relative flex  w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="relative  w-full shrink-0">
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-black shadow transition hover:bg-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung cuộn được */}
        <div className="flex-1 overflow-y-auto p-5">
          <h3 className="font-display text-xl font-bold uppercase leading-snug">{product.name}</h3>

          {product.restaurantName ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-[#22acf9]">
              <Soup size={18} />
              {product.restaurantName}
            </p>
          ) : (
            <p className="mt-1.5 text-sm font-semibold text-[#5ae444]">Vé thường</p>
          )}

          <dl className="mt-4 divide-y divide-black/5 rounded-2xl border border-black/10">
            {texts.map((note, index) => (
              <div key={index} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="text-black/50">{note}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>,
    document.body
  );
}
