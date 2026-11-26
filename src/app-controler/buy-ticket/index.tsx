"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useTranslation } from "@/lib/i18n/client";

import {
  AgentPriceType,
  CategorySubmitType,
  ProductBanaType,
  ResultListProductType,
  SiteType,
} from "@/types/ticket";
import { ProfileType } from "@/types";
import { getSideItem, ROLES, SITE_CODES } from "@/commons/constant";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { useProfileStore } from "@/stores/useProfileStore";
import { useCartStore } from "@/stores/useCartStore";
import {
  getPriceBuyAgentLevel,
  getProductBySiteSun,
  getProductionInSystem,
} from "@/components/GetTicketForm/api";
import { getPriceAgentAndMultiple } from "@/components/GetTicketForm/constants";
import { geNoteSiteCode } from "@/components/GetTicketForm/Customer/constants";
import { getOrder } from "@/components/GetTicketForm/Affilate/constants";

import Hero from "./components/Hero";
import { FormDataType } from "./type";
import SearchBar from "./components/SearchBar";
import TicketTabs from "./components/TicketTabs";
import { AlertCircle } from "lucide-react";
import ProductCard from "./components/ProductCard";
import SummaryCustomer from "./components/SumaryCustomer";
import { get } from "lodash";
import { getListAgentPriceDefaultBySite, getListCategory } from "./apis";
import { mapAgentPriceByProductCode } from "./contants";

export default function BuyTicketController() {
  const { t, lng } = useTranslation();
  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const searchParams = useSearchParams();
  const siteURL = searchParams.get("site");

  const {
    siteList,
    formData,
    siteCode,
    items,
    getSites,
    clear: clearCart,
    setFormData,
  } = useCartStore((s) => s);

  const [listProduct, setListProductSun] = useState<ResultListProductType[]>([]);
  const [agentPriceDefault, setAgentPriceDefault] = useState(0);
  const [mapAgentPrice, setMapAgentPrice] = useState<Map<string, AgentPriceType>>(new Map());
  const [listCategory, setListCategory] = useState<CategorySubmitType[]>([]);
  const [filter, setFilter] = useState("");

  // true ngay nếu URL không có site; nếu có thì chờ áp xong mới cho phép fetch
  const [urlApplied, setUrlApplied] = useState(!siteURL);
  // chỉ nhận kết quả của request mới nhất
  const productReqIdRef = useRef(0);

  const currentSite: SiteType | null = useMemo(
    () => getSideItem(formData.site_code, siteList),
    [siteList, formData.site_code]
  );

  // Dùng giá trị nguyên thủy làm deps cho effect, tránh chạy lại vì đổi reference
  const siteReady = !!currentSite;
  const inSystem = currentSite?.in_system;
  const priceLevel = profile?.email ? ROLES.REGISTER : ROLES.CUSTOMER;

  const [tickets, personTypes] = useMemo(() => {
    let listTicket: ProductBanaType[] = [];
    const listPersonType: string[] = [];
    listProduct.forEach((item) => {
      listTicket = listTicket.concat([...item.ticket]);
      listPersonType.push(item.personType);
    });
    listTicket = listTicket.map((items) => ({
      ...items,
      pinalPrice: getPriceAgentAndMultiple(items, ROLES.CUSTOMER, mapAgentPrice, agentPriceDefault),
    }));
    return [listTicket.sort((a, b) => (a.order ?? 1) - (b.order ?? 1)), listPersonType];
  }, [listProduct, mapAgentPrice, agentPriceDefault]);

  const listProductFilter = useMemo(() => {
    let result: ProductBanaType[] = [];
    if (!filter) {
      result = tickets;
    } else {
      result = tickets.filter((item) => item.personType === filter);
    }
    if (formData.site_code === SITE_CODES.BANAHILL) {
      return [...result].sort((a, b) => getOrder(a?.id || 1) - getOrder(b?.id || 1));
    }
    return result;
  }, [filter, tickets, formData.site_code]);

  const fetchProductBySite = async (code: string) => {
    if (!code) return;
    const reqId = ++productReqIdRef.current;

    let data: any = [];
    if (currentSite && currentSite.company_code === "SUNWORLD") {
      data = await getProductBySiteSun(
        code,
        dayjs(formData.date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT)
      );
    } else {
      data = await getProductionInSystem(code);
    }

    // Đã có request mới hơn thì bỏ kết quả cũ
    if (reqId !== productReqIdRef.current) return;
    setListProductSun(data || []);
  };

  const fetchCategory = async () => {
    const data = await getListCategory(false);
    if (data?.data) {
      setListCategory(data.data);
    }
  };

  const onChangeFormData = (key: keyof FormDataType, value: string) => {
    // Chỉ xoá giỏ hàng khi đổi site, không xoá khi đổi field khác (vd: ngày)
    if (key === "site_code" && value !== formData.site_code) {
      clearCart();
    }
    setFormData({ ...formData, [key]: value });
  };

  // Chỉ dùng cho nút "Tìm kiếm" (người dùng chủ động)
  const handleSearch = () => {
    fetchProductBySite(formData.site_code);
    clearCart();
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    getSites();
  }, [getSites]);

  useEffect(() => {
    if (urlApplied || !siteList.length) return;

    if (siteURL && getSideItem(siteURL, siteList)) {
      if (siteURL !== formData.site_code) {
        clearCart();
        setFormData({ ...formData, site_code: siteURL });
      }
    }
    setUrlApplied(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlApplied, siteList, siteURL]);

  useEffect(() => {
    if (!urlApplied || !formData.site_code || !siteReady) return;
    fetchProductBySite(formData.site_code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlApplied, formData.site_code, siteReady, inSystem]);

  useEffect(() => {
    if (!urlApplied || !formData.site_code) return;
    let cancelled = false;

    (async () => {
      const [priceDefault, agentPrice]: any = await Promise.all([
        getListAgentPriceDefaultBySite(formData.site_code, priceLevel),
        getPriceBuyAgentLevel(formData.site_code, priceLevel),
      ]);
      if (cancelled) return;
      setMapAgentPrice(mapAgentPriceByProductCode(agentPrice));
      setAgentPriceDefault(priceDefault);
    })();

    return () => {
      cancelled = true;
    };
  }, [urlApplied, formData.site_code, priceLevel]);

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="min-h-screen  bg-[#FDF4F6]">
        <Hero />
        <div className=" mx-auto max-w-7xl  sm:px-6 lg:px-8">
          <SearchBar
            formData={formData}
            siteList={siteList}
            onChangeFormData={onChangeFormData}
            onSearch={handleSearch}
          />
          {listProductFilter.length > 0 && (
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                <div>
                  <div className="mt-4">
                    <TicketTabs
                      lisCategory={listCategory}
                      formType={ROLES.CUSTOMER}
                      active={filter}
                      onChange={setFilter}
                      listType={personTypes}
                    />
                  </div>

                  <div className="mt-5 flex flex-col gap-4">
                    <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3.5 text-sm text-amber-700">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium">{geNoteSiteCode(siteCode)}</p>
                        <p className="mt-0.5 text-amber-600/90">{t("buyticket.identity_notice")}</p>
                      </div>
                    </div>
                    {listProductFilter.map((ticket) => (
                      <ProductCard
                        lisCategory={listCategory}
                        key={ticket.code}
                        product={ticket}
                        quantity={items?.get(ticket?.code)?.quantity || 0}
                      />
                    ))}
                  </div>
                </div>
                <SummaryCustomer siteName={get(currentSite, lng, currentSite?.name) || ""} />
              </div>
            </main>
          )}
        </div>
      </div>
    </main>
  );
}
