"use client";

import { useEffect, useMemo, useState } from "react";
import { Fraunces, Be_Vietnam_Pro } from "next/font/google";
import { getProductBySiteSun, getSiteListSun } from "./api";
import {
  ProductSubmitType,
  ResultListProductType,
  SideSunGroupType,
  SubmitSelectTicket,
} from "@/types/ticket";

import dayjs from "dayjs";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { SUN_BOOKING_FORM_TYPE } from "./constants";
import AffilateBookingForm from "./AffilateForm";
import CustomerBookingForm from "./CustomerForm";

const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);
const initFormValues = {
  email: "",
  phone: "",
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

  const [listSideSunGroup, setListSideSungroup] = useState<SideSunGroupType[]>([]);
  const [siteSunCode, setSideSunCode] = useState("");

  const [listProductSun, setListProductSun] = useState<ResultListProductType[]>([]);

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
    const price = formType === SUN_BOOKING_FORM_TYPE.CUSTOMER ? t.publicPrice : t.unitPrice;
    return sum + price * (quantities[t.code] ?? 0);
  }, 0);

  const setQty = (key: string, next: number) => {
    setQuantities((q) => ({ ...q, [key]: Math.max(0, Math.min(20, next)) }));
  };

  const setFieldFormData = (key: string, val: any, needCalPrice = false) => {
    setFormData((p: any) => ({ ...p, [key]: val }));
  };

  const fetchSiteSunGroup = async () => {
    const data = await getSiteListSun();
    if (data?.length) {
      setListSideSungroup(data);
    }
  };

  const fetchProductBySite = async (siteSunCode: string) => {
    const data: any = await getProductBySiteSun(
      siteSunCode,
      dayjs(formData.date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT)
    );
    if (data?.length) {
      console.log(data);
      setListProductSun(data);
    }
  };

  const handleBuyTicket = () => {
    const products: ProductSubmitType[] = selectedLines.map((item) => ({
      productCode: item.code,
      siteCode: siteSunCode,
      quantity: quantities[item.code],
      usageDate: item.pricePolicy.usageDate,
      usageDateTo: item.pricePolicy.validDateTo,
      performanceId: item.performances.performanceId,
      productsName: item.name,
      unitPrice: item.unitPrice,
    }));
    onBuyTicket({
      products: products,
      totalMoney: total,
      date_use: formData.date_use,
      siteCode: siteSunCode,
      formData: formData,
    });
  };

  useEffect(() => {
    if (siteSunCode) {
      fetchProductBySite(siteSunCode);
    }
  }, [siteSunCode]);

  useEffect(() => {
    if (location) {
      switch (location) {
        case "BANA": {
          fetchSiteSunGroup();
          break;
        }
        default:
      }
    }
  }, [location]);

  return formType === SUN_BOOKING_FORM_TYPE.AFFILATE ? (
    <AffilateBookingForm
      siteSunCode={siteSunCode}
      setSideSunCode={setSideSunCode}
      listSideSunGroup={listSideSunGroup}
      setFieldFormData={setFieldFormData}
      formData={formData}
      listProductSun={listProductSun}
      setQty={setQty}
      quantities={quantities}
      totalTickets={totalTickets}
      total={total}
      sideName={sideName}
      selectedLines={selectedLines}
      handleBuyTicket={handleBuyTicket}
    />
  ) : (
    <CustomerBookingForm
      siteSunCode={siteSunCode}
      setSideSunCode={setSideSunCode}
      listSideSunGroup={listSideSunGroup}
      setFieldFormData={setFieldFormData}
      formData={formData}
      listProductSun={listProductSun}
      setQty={setQty}
      quantities={quantities}
      totalTickets={totalTickets}
      total={total}
      sideName={sideName}
      selectedLines={selectedLines}
      handleBuyTicket={handleBuyTicket}
    />
  );
}
