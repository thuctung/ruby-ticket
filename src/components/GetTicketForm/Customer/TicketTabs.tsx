import { Baby, PersonStanding, Ticket, Users } from "lucide-react";
import { PRODUCT_TYPE } from "../constants";
import { BEST_SELLER } from "@/commons/constant";

const ICONS = {
  ["ADULT"]: Users,
  ["CHILD"]: Baby,
  ["SENIORS"]: PersonStanding,
  ["ALL"]: Ticket,
};

interface Props {
  active: string;
  formType: string;
  listType: string[];
  onChange: (key: string) => void;
}

export default function TicketTabs({ active, onChange, listType, formType }: Props) {
  const listTab = [
    {
      key: "",
      label: "Tất cả",
      icon: Ticket,
    },
  ];
  listType.forEach((item) => {
    if (item !== "ALL" && item !== BEST_SELLER) {
      listTab.push({
        key: item,
        label: PRODUCT_TYPE[item as keyof typeof PRODUCT_TYPE] || item,
        icon: ICONS[item as keyof typeof ICONS] || Ticket,
      });
    }
  });

  return (
    <div className="flex flex-wrap gap-2.5">
      {listTab.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
