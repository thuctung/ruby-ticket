import { Baby, PersonStanding, Ticket, Users } from "lucide-react";
import { BEST_SELLER } from "@/commons/constant";
import { BOOKING_FORM_TYPE, PRODUCT_TYPE } from "@/components/GetTicketForm/constants";
import { useTranslation } from "@/lib/i18n/client";
import { CategorySubmitType } from "@/types/ticket";
import { getCategaryItem } from "../contants";
import { get } from "lodash";

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
  lisCategory: CategorySubmitType[];
  onChange: (key: string) => void;
}

export default function TicketTabs({ active, lisCategory, onChange, listType, formType }: Props) {
  const { t, lng } = useTranslation();
  const listTab = [
    {
      key: "",
      label: t("common.label.all"),
      icon: Ticket,
    },
  ];
  listType.forEach((item) => {
    const getCategotyIem = getCategaryItem(item, lisCategory);
    if (item) {
      if (formType === BOOKING_FORM_TYPE.AFFILATE) {
        listTab.push({
          key: item,
          label: PRODUCT_TYPE[item as keyof typeof PRODUCT_TYPE] || item,
          icon: ICONS[item as keyof typeof ICONS] || Ticket,
        });
      } else if (item !== BEST_SELLER) {
        listTab.push({
          key: item,
          label: get(getCategotyIem, lng, getCategotyIem?.name || item),
          icon: ICONS[item as keyof typeof ICONS] || Ticket,
        });
      }
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
