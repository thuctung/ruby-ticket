"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getListAgentPriceDefaultBySite,
  getPriceBuyAgentLevel,
  getProductBySiteSun,
  getProductionInSystem,
  getSiteByFormType,
} from "./api";
import {
  AgentPriceType,
  ProductSubmitType,
  ResultListProductType,
  SiteType,
  SubmitSelectTicket,
} from "@/types/ticket";

import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { getPriceAgentAndMultiple, BOOKING_FORM_TYPE, toDate } from "./constants";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import { useSearchParams } from "next/navigation";
import AffilateBooking from "./Affilate";
import { useCommonStore } from "@/stores/useCommonStore";
import { useCartStore } from "@/stores/useCartStore";
import { ROLES } from "@/commons/constant";
import { mapAgentPriceByProductCode } from "@/app-controler/buy-ticket/contants";

const initFormValues = {
  email: "",
  phone: "",
  fullname: "",
  date_use: toDate,
  description: "",
};

type GetTicketFormProps = {
  onBuyTicket: (productsSubmit: SubmitSelectTicket) => void;
  formType: string;
};

export default function GetTicketForm({
  onBuyTicket,
  formType = BOOKING_FORM_TYPE.AFFILATE,
}: GetTicketFormProps) {
  const searchParams = useSearchParams();
  const productURL = searchParams.get("product");
  const { setGlobalLoading }: CommonType | any = useCommonStore.getState();
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const clearCart = useCartStore((s) => s.clear);

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [listSite, setListSides] = useState<SiteType[]>([]);
  const [siteCode, setSiteCode] = useState("");
  const [exportGuideTicket, setExportGuideTicket] = useState(false);

  const [loading, setLoading] = useState(false);

  const [listProduct, setListProductSun] = useState<ResultListProductType[]>([]);

  const [agentPriceDefault, setAgentPriceDefault] = useState(0);

  const [mapAgentPrice, setMapAgentPrice] = useState<Map<string, AgentPriceType>>(new Map());

  const [formData, setFormData] = useState<any>(initFormValues);

  const currentSite: SiteType | undefined = useMemo(() => {
    if (listSite.length && siteCode) {
      return listSite.find((item) => item.code === siteCode);
    }
  }, [listSite, siteCode]);

  const selectedLines = useMemo(() => {
    const listProductSeletect = listProduct.flatMap((item) => item.ticket);
    return listProductSeletect.filter((t) => (quantities[t.code] ?? 0) > 0);
  }, [listProduct, quantities]);

  const totalTickets = selectedLines.reduce((sum, t) => sum + (quantities[t.code] ?? 0), 0);

  const total = selectedLines.reduce((sum, t) => {
    let price = getPriceAgentAndMultiple(t, formType, mapAgentPrice, agentPriceDefault);

    return sum + price * (quantities[t.code] ?? 0);
  }, 0);

  const setQty = useCallback(
    (key: string, next: number) => {
      setQuantities((q) => ({ ...q, [key]: next }));
    },
    [setQuantities]
  );

  const setFieldFormData = (key: string, val: any, needCalPrice = false) => {
    setFormData((p: any) => ({ ...p, [key]: val }));
  };

  const fetchPriceAgentLevelAndProducts = async (sideCode: string, level: string) => {
    setGlobalLoading(true);

    const [priceDefault, agentPrice, product]: any = await Promise.all([
      getListAgentPriceDefaultBySite(sideCode, level),
      getPriceBuyAgentLevel(sideCode, level),
      fetchProductBySite(siteCode),
    ]);

    const mapAgentPrice = mapAgentPriceByProductCode(agentPrice);
    setMapAgentPrice(mapAgentPrice);
    setAgentPriceDefault(priceDefault);
    setGlobalLoading(false);
  };

  const getSiteActive = async () => {
    const data = await getSiteByFormType(formType);
    if (data?.length) {
      setListSides(data);
    }
  };

  const fetchProductBySite = async (siteCode: string) => {
    setQuantities({});
    if (currentSite) {
      let data: any = [];
      if (!currentSite.in_system) {
        data = await getProductBySiteSun(
          siteCode,
          dayjs(formData.date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT)
        );
      } else {
        data = await getProductionInSystem(siteCode);
      }
      if (data) {
        setListProductSun(data);
      } else {
        setListProductSun([]);
      }
    }
  };

  const onCloseLoading = (result: boolean) => {
    if (result) {
      setQuantities({});
    }
    setLoading(false);
  };
  const handleBuyTicket = () => {
    setLoading(true);
    const products: ProductSubmitType[] = selectedLines.map((item) => {
      const priceSell = getPriceAgentAndMultiple(item, formType, mapAgentPrice, agentPriceDefault);
      const publicPrice =
        item.multiple > 1 ? Math.ceil(item.publicPrice / item.multiple) : item.publicPrice;
      return {
        productCode: item.code,
        siteCode: siteCode,
        quantity: quantities[item.code],
        usageDate: item?.pricePolicy?.usageDate || "",
        usageDateTo: item?.pricePolicy?.validDateTo || "",
        performanceId: item?.performances?.[0]?.performanceId || "",
        productsName: item.name,
        publicPrice: publicPrice,
        unitPrice: priceSell,
        restaurantName: item?.restaurantName || "",
        siteName: item?.site?.name || siteCode,
        personType: item.personType,
        time: `${item?.openTime || ""}-${item?.closeTime || ""}`,
      };
    });
    const in_system = listSite.find((item) => item.code === siteCode)?.in_system || false;

    onBuyTicket({
      products: products,
      totalMoney: total,
      date_use: formData.date_use,
      siteCode: siteCode,
      formData: formData,
      haveFOC: exportGuideTicket,
      in_system,
      siteName: currentSite?.name || "",
      callback: onCloseLoading,
    });
  };

  useEffect(() => {
    if (siteCode) {
      let level = "";
      if (BOOKING_FORM_TYPE.AFFILATE === formType && profile?.agent_level) {
        level = profile?.agent_level;
      } else if (BOOKING_FORM_TYPE.CUSTOMER) {
        level = ROLES.CUSTOMER;
      }
      if (level) fetchPriceAgentLevelAndProducts(siteCode, level);
      setQuantities({});
      clearCart();
    }
  }, [siteCode, profile.agent_level, formType, formData.date_use]);

  useEffect(() => {
    if (productURL && listSite.length) {
      setSiteCode(productURL);
    }
  }, [productURL, listSite]);

  useEffect(() => {
    getSiteActive();
  }, []);

  useEffect(() => {
    clearCart();
  }, []);

  const commonProps = {
    formType,
    siteCode,
    listSite,
    formData,
    listProduct,
    quantities,
    totalTickets,
    total,
    siteName: currentSite?.name || "",
    selectedLines,
    exportGuideTicket,
    loading,
    mapAgentPrice,
    agentPriceDefault,
    agentPrice: 0,
    setExportGuideTicket,
    handleBuyTicket,
    setFieldFormData,
    setQty,
    setSiteCode,
  };

  return <AffilateBooking {...commonProps} />;
}
