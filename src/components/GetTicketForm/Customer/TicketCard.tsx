import { CATEGORY_STYLES } from "./type";
import { formatVND } from "@/helpers/money";
import { ProductBanaType } from "@/types/ticket";
import React, { useState } from "react";
import { getPriceAgentAndMultiple, PRODUCT_TYPE } from "../constants";

import { featues, FEATURE_ICON_BANA, getBgImg } from "./constants";
import { ChevronDown, Compass, Minus, Plus } from "lucide-react";

interface Props {
  ticket: ProductBanaType;
  quantities: number;
  agentPrice: number;
  formType: string;
  setQty: (code: string, next: number) => void;
}

const TicketCard = React.memo(({ ticket, setQty, quantities, formType, agentPrice }: Props) => {
  const style = CATEGORY_STYLES[ticket.personType] || {
    badgeBg: "bg-green-100",
    badgeText: "text-green-500",
    iconBg: "bg-green-400",
  };
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const bgImage = getBgImg(ticket.personType, ticket?.site_code);

  const handleChangeQuantity = (ticket: ProductBanaType, value: number, input = false) => {
    let num = quantities ?? 0;
    if (ticket.multiple > 1) {
      num += value;
    } else if (input) {
      num = value;
    } else {
      num += value;
    }
    setQty(ticket.code, num);
  };
  return (
    <div
      className={` relative overflow-hidden rounded-2xl border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 sm:flex-row ${bgImage ? "border-white/60 shadow-sm" : " border-gray-100 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_60%,#eff6ff_100%)] shadow-sm "}  `}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/30" />

      <div className={`relative p-5  ${bgImage ? "bg-[#ffffff9c]" : ""}`}>
        <div className=" flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div className="min-w-0">
            <h3 className="text-lg font-bold leading-tight text-gray-900">{ticket.name}</h3>

            <span
              className={`mt-1.5 inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${style.badgeBg} ${style.badgeText}`}
            >
              {PRODUCT_TYPE[ticket.personType as keyof typeof PRODUCT_TYPE] || ticket.personType}
            </span>
          </div>

          <div className="shrink-0 text-right flex flex-col-reverse items-start md:flex-col md:items-end">
            <div className="text-lg font-bold text-red-600 sm:text-xl">
              {formatVND(getPriceAgentAndMultiple(ticket, formType, agentPrice))}
            </div>
            <div className="mt-0.5 text-xs font-medium text-[#862a42] line-through">
              Giá công bố:{" "}
              {formatVND(
                ticket.multiple ? ticket.publicPrice / ticket.multiple : ticket.publicPrice
              )}
            </div>
            {ticket.multiple > 1 ? (
              <p className="text-sm text-[red] leading-snug">{`Số vé phải là bội của: ${ticket.multiple}`}</p>
            ) : null}
          </div>
        </div>
        {ticket.description ? (
          <button
            type="button"
            onClick={() => toggleExpand(ticket.code)}
            className="mt-1 flex items-center gap-1 text-xs font-medium text-[#6E7C73] transition-colors hover:text-[#C81418]"
          >
            Xem chi tiết
            <ChevronDown
              className={`h-3 w-3 transition-transform ${
                expandedItems.has(ticket.code) ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : null}
        {expandedItems.has(ticket.code) && ticket.description ? (
          <div className="mt-2 space-y-1 text-xs leading-relaxed text-[#432020f0]">
            {ticket.description
              .split("/n")
              .filter(Boolean)
              .map((line, idx) => (
                <p className="text-[#432020f0]" key={idx}>
                  - {line.replace(/\/n/g, "")}
                </p>
              ))}
          </div>
        ) : null}
        {/* Bottom */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {featues(ticket?.site?.code || ticket?.site_code).map((feature) => {
              const Icon = FEATURE_ICON_BANA[feature] ?? Compass;
              return (
                <span
                  key={feature}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600"
                >
                  <Icon size={14} strokeWidth={2} className="text-emerald-500" />
                  {feature}
                </span>
              );
            })}
          </div>

          {/* Quantity */}
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-1.5 py-1.5 shadow-sm backdrop-blur-md">
            <button
              aria-label="Giảm số lượng"
              onClick={() => handleChangeQuantity(ticket, -ticket.multiple)}
              disabled={!quantities}
              className="flex h-5 w-6 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30"
            >
              <Minus size={14} />
            </button>

            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={quantities ?? 0}
              disabled={ticket.multiple > 1}
              onChange={(e) => handleChangeQuantity(ticket, Number(e.target.value) || 0, true)}
              aria-label={`Số lượng ${ticket.name}`}
              className="h-5 w-8  text-center text-sm font-semibold text-[#1C2620] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <button
              aria-label="Tăng số lượng"
              onClick={() => handleChangeQuantity(ticket, ticket.multiple)}
              className="flex h-5 w-6 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
export default TicketCard;
