"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getPriceBuyAgentLevel,
  getProductBySiteSun,
  getProductionInSystem,
  getSiteByStatus,
} from "./api";
import {
  ProductSubmitType,
  ResultListProductType,
  SiteType,
  SubmitSelectTicket,
} from "@/types/ticket";

import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { getPriceAgentAndMultiple, BOOKING_FORM_TYPE } from "./constants";
import AffilateBookingForm from "./AffilateForm";
import CustomerBookingForm from "./CustomerForm";
import { useProfileStore } from "@/stores/useProfileStore";
import { ProfileType } from "@/types";
import { get } from "lodash";
import { CUSTOMER, SITE_CODES } from "@/commons/constant";
import { useSearchParams } from "next/navigation";

const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);
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

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const [listSite, setListSides] = useState<SiteType[]>([]);
  const [siteCode, setSiteCode] = useState("");
  const [exportGuideTicket, setExportGuideTicket] = useState(false);

  const [listProduct, setListProductSun] = useState<ResultListProductType[]>([]);

  const [agentPrice, setAgentPrice] = useState(0);

  const [formData, setFormData] = useState<any>(initFormValues);

  const sideName = useMemo(() => {
    if (listSite.length && siteCode) {
      return listSite.find((item) => item.code === siteCode)?.name || "";
    }
    return "";
  }, [listSite, siteCode]);

  const selectedLines = useMemo(() => {
    const listProductSeletect = listProduct.flatMap((item) => item.ticket);
    return listProductSeletect.filter((t) => (quantities[t.code] ?? 0) > 0);
  }, [listProduct, quantities]);

  const totalTickets = selectedLines.reduce((sum, t) => sum + (quantities[t.code] ?? 0), 0);

  const total = selectedLines.reduce((sum, t) => {
    let price = getPriceAgentAndMultiple(t, formType, agentPrice);

    return sum + price * (quantities[t.code] ?? 0);
  }, 0);

  const setQty = (key: string, next: number) => {
    setQuantities((q) => ({ ...q, [key]: next }));
  };

  const setFieldFormData = (key: string, val: any, needCalPrice = false) => {
    setFormData((p: any) => ({ ...p, [key]: val }));
  };

  const fetchPriceAgentLevel = async (sideCode: string, level: string) => {
    const data = await getPriceBuyAgentLevel(sideCode, level);
    const price = get(data, "price", 0) || 0;
    setAgentPrice(price);
  };

  const getSiteActive = async () => {
    const data = await getSiteByStatus(true);
    if (data?.length) {
      setListSides(data);
    }
  };

  const fetchProductBySite = async (siteCode: string) => {
    if (listSite.length) {
      let data: any = [];
      if (siteCode === SITE_CODES.BANAHILL) {
        data = await getProductBySiteSun(
          siteCode,
          dayjs(formData.date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT)
        );
      } else {
        data = await getProductionInSystem(siteCode);
      }

      if (data) {
        setListProductSun(data);
      }
    }
  };

  const handleBuyTicket = () => {
    const products: ProductSubmitType[] = selectedLines.map((item) => {
      const priceSell = getPriceAgentAndMultiple(item, formType, agentPrice);

      return {
        productCode: item.code,
        siteCode: siteCode,
        quantity: quantities[item.code],
        usageDate: item?.pricePolicy?.usageDate || "",
        usageDateTo: item?.pricePolicy?.validDateTo || "",
        performanceId: item?.performances?.[0]?.performanceId || "",
        productsName: item.name,
        publicPrice: item.publicPrice,
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
    });
  };

  useEffect(() => {
    if (siteCode) {
      let level = "";
      if (BOOKING_FORM_TYPE.AFFILATE === formType && profile?.agent_level) {
        level = profile?.agent_level;
      } else if (BOOKING_FORM_TYPE.CUSTOMER) {
        level = CUSTOMER;
      }
      if (level) fetchPriceAgentLevel(siteCode, level);
      setQuantities({});
    }
  }, [siteCode, profile.agent_level, formType, formData.date_use]);

  useEffect(() => {
    if (siteCode) {
      fetchProductBySite(siteCode);
    }
  }, [siteCode]);

  useEffect(() => {
    if (productURL && listSite.length) {
      setSiteCode(productURL);
    }
  }, [productURL, listSite]);

  useEffect(() => {
    getSiteActive();
  }, []);

  const commonProps = {
    agentPrice,
    formType,
    siteCode,
    listSite,
    formData,
    listProduct,
    quantities,
    totalTickets,
    total,
    sideName,
    selectedLines,
    exportGuideTicket,
    setExportGuideTicket,
    handleBuyTicket,
    setFieldFormData,
    setQty,
    setSiteCode,
  };

  return formType === BOOKING_FORM_TYPE.AFFILATE ? (
    <AffilateBookingForm {...commonProps} />
  ) : (
    <CustomerBookingForm {...commonProps} />
  );
}
