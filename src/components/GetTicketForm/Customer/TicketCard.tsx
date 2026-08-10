import { CATEGORY_STYLES, Ticket } from "./type";
import { formatVND } from "@/helpers/money";
import { ProductBanaType } from "@/types/ticket";
import React, { useEffect, useState } from "react";
import { getPriceAgentAndMultiple, PRODUCT_TYPE } from "../constants";

import {
  CircleUser,
  Minus,
  Plus,
  DoorOpen,
  CableCar,
  Compass,
  UtensilsCrossed,
  Landmark,
  Waves,
  Snowflake,
  CloudSun,
  FerrisWheel,
  Flower2,
  Camera,
  TreePine,
  Music,
  Gamepad2,
  Bike,
  Sunrise,
  Moon,
  Coffee,
  Gift,
  ParkingCircle,
  Bus,
  Users,
  Baby,
  Tent,
  MapPin,
  Sparkles,
  ChevronDown,
} from "lucide-react";

const ftBaNA = ["Vườn hoa", "Cáp treo khứ hồi", "Vòng quay", "Biểu diễn"];
const ftNTT = ["Vào cổng", "Tham quan", "Đền thờ", "Trượt ván"];

const FEATURE_ICON_BANA: Record<string, React.ElementType> = {
  "Vào cổng": DoorOpen,
  "Cáp treo khứ hồi": CableCar,
  "Tham quan": Compass,
  "Trượt tuyết": Snowflake,
  "Săn mây": CloudSun,
  "Vòng quay": FerrisWheel,
  "Vườn hoa": Flower2,
  "Biểu diễn": Music,
  "Trải nghiệm đặc biệt": Sparkles,
  "Đền thờ": Landmark,
  "Tắm khoáng": Waves,
  "Trượt ván": Bike,
  "Rừng thông": TreePine,
};

interface Props {
  ticket: ProductBanaType;
  quantities: number;
  agentPrice: number;
  formType: string;
  setQty: (code: string, next: number) => void;
}

const TicketCard = React.memo(({ ticket, setQty, quantities, formType, agentPrice }: Props) => {
  const style = CATEGORY_STYLES[ticket.personType] || {
    badgeBg: "bg-green-50",
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

  const featues = ticket?.site?.code === "BNC" ? ftBaNA : ftNTT;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_60%,#eff6ff_100%)] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 sm:flex-row">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{ticket.name}</h3>
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
            <div className="mt-0.5 text-xs font-medium text-[#8e8e8e] line-through">
              Giá công bố: {formatVND(ticket.publicPrice)}
            </div>
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
          <div className="mt-2 max-w-md space-y-1 text-xs leading-relaxed text-[#6E7C73]">
            {ticket.description
              .split("\n")
              .filter(Boolean)
              .map((line, idx) => (
                <p key={idx}>- {line}</p>
              ))}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between">
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {featues.map((feature) => {
              const Icon = FEATURE_ICON_BANA[feature] ?? Compass;
              return (
                <span key={feature} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Icon size={14} className="text-green-500" />
                  {feature}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 py-1.5">
            <button
              aria-label="Giảm số lượng"
              onClick={() => setQty(ticket.code, (quantities ?? 0) - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30"
              disabled={quantities === 0}
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center text-sm font-semibold text-gray-900">
              {quantities ?? 0}
            </span>
            <button
              aria-label="Tăng số lượng"
              onClick={() => setQty(ticket.code, (quantities ?? 0) + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
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
