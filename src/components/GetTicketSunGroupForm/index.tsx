"use client";

import { useEffect, useMemo, useState } from "react";
import { Fraunces, Be_Vietnam_Pro } from "next/font/google";
import {
  getAllSite,
  getPriceBuyAgentLevel,
  getProductBySiteSun,
  getProductionInSystem,
  getSiteListSun,
} from "./api";
import {
  ProductSubmitType,
  ResultListProductType,
  SideSunGroupType,
  SubmitSelectTicket,
} from "@/types/ticket";

import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { getPriceAgentAndMultiple, SUN_BOOKING_FORM_TYPE } from "./constants";
import AffilateBookingForm from "./AffilateForm";
import CustomerBookingForm from "./CustomerForm";
import { useProfileStore } from "@/stores/useProfileStore";
import { ProfileType } from "@/types";
import { get } from "lodash";
import { CUSTOMER, SITE_CODES } from "@/commons/constant";

const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);
const initFormValues = {
  email: "",
  phone: "",
  fullname: "",
  date_use: toDate,
  description: "",
};

type GetTicketSunGroupFormprops = {
  location: string;
  onBuyTicket: (productsSubmit: SubmitSelectTicket) => void;
  formType: string;
};

export default function GetTicketSunGroupForm({
  location,
  onBuyTicket,
  formType = SUN_BOOKING_FORM_TYPE.AFFILATE,
}: GetTicketSunGroupFormprops) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const [listSideSunGroup, setListSideSungroup] = useState<SideSunGroupType[]>([]);
  const [siteSunCode, setSideSunCode] = useState("");
  const [exportGuideTicket, setExportGuideTicket] = useState(false);

  const [listProductSun, setListProductSun] = useState<ResultListProductType[]>([]);

  const [agentPrice, setAgentPrice] = useState(0);

  const [formData, setFormData] = useState<any>(initFormValues);

  const sideName = useMemo(() => {
    if (listSideSunGroup.length && siteSunCode) {
      return listSideSunGroup.find((item) => item.code === siteSunCode)?.name || "";
    }
    return "";
  }, [listSideSunGroup, siteSunCode]);

  const selectedLines = useMemo(() => {
    const listProduct = listProductSun.flatMap((item) => item.ticket);
    return listProduct.filter((t) => (quantities[t.code] ?? 0) > 0);
  }, [listProductSun, quantities]);

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

  const getAllLocations = async () => {
    const data = await getAllSite();

    if (data?.length) {
      setListSideSungroup(data);
    }
  };

  const fetchProductBySite = async (siteCode: string) => {
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
  };

  const handleBuyTicket = () => {
    const products: ProductSubmitType[] = selectedLines.map((item) => {
      const priceSell = getPriceAgentAndMultiple(item, formType, agentPrice);

      return {
        productCode: item.code,
        siteCode: siteSunCode,
        quantity: quantities[item.code],
        usageDate: item?.pricePolicy?.usageDate || "",
        usageDateTo: item?.pricePolicy?.validDateTo || "",
        performanceId: item?.performances?.[0]?.performanceId || "",
        productsName: item.name,
        publicPrice: item.publicPrice,
        unitPrice: priceSell,
        restaurantName: item?.restaurantName || "",
        siteName: item?.site?.name || siteSunCode,
        personType: item.personType,
        time: `${item?.openTime || ""}-${item?.closeTime || ""}`,
      };
    });

    onBuyTicket({
      products: products,
      totalMoney: total,
      date_use: formData.date_use,
      siteCode: siteSunCode,
      formData: formData,
      haveFOC: exportGuideTicket,
    });
  };

  useEffect(() => {
    if (siteSunCode) {
      let level = "";
      if (SUN_BOOKING_FORM_TYPE.AFFILATE === formType && profile?.agent_level) {
        level = profile?.agent_level;
      } else if (SUN_BOOKING_FORM_TYPE.CUSTOMER) {
        level = CUSTOMER;
      }
      if (level) fetchPriceAgentLevel(siteSunCode, level);
      fetchProductBySite(siteSunCode);
      setQuantities({});
    }
  }, [siteSunCode, profile.agent_level, formType, formData.date_use]);

  useEffect(() => {
    getAllLocations();
  }, []);

  const commonProps = {
    agentPrice,
    formType,
    siteSunCode,
    listSideSunGroup,
    formData,
    listProductSun,
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
    setSideSunCode,
  };

  return formType === SUN_BOOKING_FORM_TYPE.AFFILATE ? (
    <AffilateBookingForm {...commonProps} />
  ) : (
    <CustomerBookingForm {...commonProps} />
  );
}
