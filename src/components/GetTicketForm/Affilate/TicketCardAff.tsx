import React from "react";

import { formatVND } from "@/helpers/money";
import { AgentPriceType, ProductBanaType } from "@/types/ticket";
import { getPriceAgentAndMultiple, PRODUCT_TYPE } from "../constants";
import { CATEGORY_STYLES } from "../Customer/type";

import { Minus, Plus } from "lucide-react";

interface Props {
  ticket: ProductBanaType;
  quantities: number;
  mapAgentPrice: Map<string, AgentPriceType>;
  formType: string;
  agentPriceDefault: number;
  setQty: (code: string, next: number) => void;
}

const TicketCard = React.memo(
  ({ ticket, setQty, quantities, formType, mapAgentPrice, agentPriceDefault }: Props) => {
    const style = CATEGORY_STYLES[ticket.personType] || {
      badgeBg: "bg-green-100",
      badgeText: "text-green-500",
      iconBg: "bg-green-400",
    };

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
        className={` relative overflow-hidden mb-2 rounded-2xl border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 sm:flex-row  border-gray-100 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_60%,#eff6ff_100%)] shadow-sm  `}
      >
        <div className="absolute inset-0 bg-cover bg-center" />

        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/30" />

        <div className={`relative p-5  bg-[#ffffff9c]`}>
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
              <div className="text-lg font-bold text-[#2d8020] sm:text-xl">
                {formatVND(
                  getPriceAgentAndMultiple(ticket, formType, mapAgentPrice, agentPriceDefault)
                )}
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

          {/* Bottom */}
          <div className="mt-5 flex items-center justify-end gap-4">
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
  }
);
export default TicketCard;
