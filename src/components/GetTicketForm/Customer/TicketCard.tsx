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
import Image from "next/image";

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

  const featues = ticket?.site?.code === "BNC" ? ftBaNA : ftNTT;

  const getBgImg = (personType: string, siteCode: string) => {
    if (siteCode === "BNC") {
      switch (personType) {
        case "ADULT":
          return "/ba-na-lon.jpg";
        case "SENIOR":
          return "/ba-na-gia.jpg";
        case "CHILD":
          return "/ba-na-nho.jpg";
        default:
          return "/bana2.jpg";
      }
    } else {
      return "nui-than-tai-3.webp";
    }
  };
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 shadow-sm">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getBgImg(ticket.personType, ticket?.site?.code)})`,
        }}
      />

      {/* Overlay giúp text rõ hơn */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/30" />

      {/* Content */}
      <div className="relative p-5 bg-[#ffffff9c]">
        {/* Header */}
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
                <p className="text-[#f33131f0]" key={idx}>
                  - {line}
                </p>
              ))}
          </div>
        ) : null}
        {/* Bottom */}
        <div className="mt-5 flex items-center justify-between gap-4">
          {/* Features */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {featues.map((feature) => {
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
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-2 py-1.5 shadow-sm backdrop-blur-md">
            <button
              aria-label="Giảm số lượng"
              onClick={() => setQty(ticket.code, (quantities ?? 0) - 1)}
              disabled={quantities === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30"
            >
              <Minus size={14} />
            </button>

            <span className="w-5 text-center text-sm font-bold text-gray-900">
              {quantities ?? 0}
            </span>

            <button
              aria-label="Tăng số lượng"
              onClick={() => setQty(ticket.code, (quantities ?? 0) + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
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
