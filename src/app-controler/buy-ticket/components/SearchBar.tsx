"use client";

import DatePickerCustom from "@/components/ui/date-picker";
import DropdownSearch from "@/components/ui/dropdown-search";
import { SiteType } from "@/types/ticket";
import { Info, Search } from "lucide-react";
import { useMemo } from "react";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { FormDataType } from "../type";
import { useTranslation } from "@/lib/i18n/client";
import { get } from "lodash";

type SearchBarProp = {
  siteList: SiteType[];
  formData: FormDataType;
  onChangeFormData: (key: keyof FormDataType, value: string) => void;
  onSearch: () => void;
};
export const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);

export default function SearchBar({
  formData,
  siteList,
  onChangeFormData,
  onSearch,
}: SearchBarProp) {
  const { t, lng } = useTranslation();
  const lisStateCover = useMemo(
    () => siteList.map((item) => ({ value: item.code, label: get(item, lng) || item.name })),
    [siteList]
  );

  return (
    <section className="relative z-10 mx-auto -mt-16 ">
      <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("buyticket.select_park")}
            </label>
            <DropdownSearch
              options={lisStateCover}
              value={formData.site_code}
              onChange={(value: string) => onChangeFormData("site_code", value)}
              placeholder={t("buyticket.search_placeholder")}
              searchPlaceholder={t("buyticket.search_placeholder")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("buyticket.usage_date")}
            </label>
            <DatePickerCustom
              name="date_use"
              id="date_use"
              value={formData.date_use}
              onChange={(value: any) => onChangeFormData("date_use", value)}
              minDate={toDate}
              className="shadow-none border border-gray-200 h-12 rounded-xl"
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-red-700 md:h-[50px]"
            onClick={onSearch}
          >
            <Search size={18} />
            {t("buyticket.search")}
          </button>
        </div>

        <div className="mt-5 flex items-start gap-2 text-sm text-gray-500">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span> {t("buyticket.select_correct_usage_date")}</span>
        </div>
      </div>
    </section>
  );
}
