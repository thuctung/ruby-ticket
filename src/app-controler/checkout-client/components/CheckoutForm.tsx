"use client";

import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataFormTicketSubmit,
  LocationType,
  PriceCustomerType,
  ProductType,
  PromotionType,
  ResumSlectedType,
  TicketByLocationType,
} from "@/types/ticket";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/lib/money";
import { t } from "@/lib/i18n/t";
import { useLang } from "@/lib/useLang";
import { getPriceCustomer, getPromotionByLocation, getTicketType, getTicketVariant } from "../api";
import DatePickerCustom from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { isEmpty } from "lodash";
import { checkoutSchema } from "../contants";

type CheckoutFormProps = {
  productKey: string;
  location: string;
  locations: LocationType[];
  agentCode?: string;
  onChangeLocation: (value: string) => void;
  onSubmit: (values: any) => void;
};

const toDate = dayjs(new Date()).format(BASIC_DATE_FORMAT);

const initFormValues = {
  email: "",
  phone: "",
  date_use: toDate,
  description: "",
};

export function CheckoutForm({
  onSubmit,
  onChangeLocation,
  location,
  locations,
  agentCode = "customer",
}: CheckoutFormProps) {
  const lang = useLang();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [ticketTypes, setTicketTypes] = useState<TicketByLocationType[]>([]);
  const [ticketTypeCode, setTickeTypeCode] = useState("");

  const [ticketVariants, setTicketVariants] = useState<ProductType[]>([]);
  const [countTicketSelected, setCountTicketSelected] = useState<any>({});

  const [promotionList, setPromotionList] = useState<PromotionType[]>([]);
  const [isPromo, setIsPromo] = useState<any>({});

  const [formData, setFormData] = useState<any>(initFormValues);

  const [totalMoney, setTotalMoney] = useState(0);
  const [resumSelected, setResumeSelected] = useState<ResumSlectedType[]>([]);

  const [loadingGetPice, setLodingPrice] = useState(false);

  const locationNameSelected = locations?.find((l) => l.code === location)?.name || "";

  const setIsPromoSelected = (code: string, val: boolean) => {
    setIsPromo((p: any) => ({ [code]: val })); // chỉ đc áp dụng 1 ctrinh khuyến mãi
  };

  const setTicKetSelected = (code: string, val: any) => {
    setCountTicketSelected((p: any) => ({ ...p, [code]: val }));
  };

  const setFieldFormData = (key: string, val: any, needCalPrice = false) => {
    setFormData((p: any) => ({ ...p, [key]: val }));
  };

  const calMoney = (mapPriceSelect: Map<string, number>) => {
    const res: any = [];
    let totalMoney = 0;
    if (!isEmpty(mapPriceSelect)) {
      mapPriceSelect.keys().forEach((key: string) => {
        const numerTicet = countTicketSelected[key] ?? 0;
        const priceTicket = mapPriceSelect.get(key) ?? 0;
        const totalPriceTicket = numerTicet * priceTicket;
        const ticketVariant = ticketVariants.find((t) => t.code === key);
        console.log(ticketVariant);
        totalMoney += totalPriceTicket;

        const result = {
          base_price: ticketVariant?.price || 0,
          finalprice: priceTicket,
          totalPriceTicket,
          ticketName: ticketVariant?.ticket_name || "",
          numerTicet,
          ticket_variant_code: key,
        };
        res.push(result);
      });
    }
    setResumeSelected(res);
    setTotalMoney(totalMoney);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      console.log(result.error.format());
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
    } else {
      const submit: DataFormTicketSubmit = {
        total_amount: totalMoney,
        formData,
        listTicket: resumSelected,
        locationNameSelected,
      };
      onSubmit(submit);
      setErrors({});
    }
  };

  // fetch data
  const getPriceTicet = async () => {
    let promo = "";
    if (!isEmpty(isPromo)) {
      Object.keys(isPromo).forEach((key) => {
        if (isPromo[key]) {
          promo = key;
        }
      });
    }
    const listTicketCode = Object.keys(countTicketSelected).filter(
      (key) => countTicketSelected[key] > 0
    );

    if (listTicketCode.length) {
      setLodingPrice(true);
      const data = await getPriceCustomer(listTicketCode, promo, agentCode);
      if (data) {
        const priceMap: Map<string, number> = new Map(
          data.map((item: PriceCustomerType) => [item.ticket_variant_code, item.price])
        );
        calMoney(priceMap);
      }
      setLodingPrice(false);
    } else {
      setResumeSelected([]);
      setTotalMoney(0);
    }
  };

  const fetchPromotion = async () => {
    const data = await getPromotionByLocation(location);
    if (data) {
      setPromotionList(data);
    }
  };

  const fetchTicketTypeByLocation = async () => {
    const data = await getTicketType(location);
    if (data) {
      setTicketTypes(data);
      setTickeTypeCode(data[0].code);
    }
  };

  const fetchTicketVariant = async () => {
    const data = await getTicketVariant(ticketTypeCode);
    if (data) {
      console.log("data", data);
      setTicketVariants(data);
    }
  };

  useEffect(() => {
    if (location) {
      fetchTicketTypeByLocation();
      fetchPromotion();
    }
  }, [location]);

  useEffect(() => {
    if (ticketTypeCode) {
      fetchTicketVariant();
    }
  }, [ticketTypeCode]);

  useEffect(() => {
    getPriceTicet();
  }, [isPromo, countTicketSelected]);

  useEffect(() => {
    setTotalMoney(0);
    setResumeSelected([]);
    setCountTicketSelected({});
    setIsPromo({});
  }, [location, ticketTypeCode]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3 rounded-2xl shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-xl font-extrabold">
              {t(lang, "checkout.form.title")}
            </CardTitle>
            <Badge variant="outline" className="rounded-full">
              {t(lang, "checkout.form.vnpay")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {/* Date + product */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">{t(lang, "checkout.switcher.title")}</div>
                <Select value={location} onValueChange={(value) => onChangeLocation(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t(lang, "checkout.switcher.title")} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              <Label>{t(lang, "checkout.form.date")}</Label>
              <DatePickerCustom
                value={formData.date_use}
                onChange={(val: any) => setFieldFormData("date_use", val)}
                minDate={toDate}
                name="date_use"
                id="date_use"
              />
            </div>
          </div>

          {ticketTypes?.length ? (
            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.ticketType")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {ticketTypes.map((opt) => (
                  <Button
                    key={opt.code}
                    type="button"
                    variant={ticketTypeCode === opt.code ? "default" : "outline"}
                    className="rounded-xl"
                    onClick={() => setTickeTypeCode(opt.code)}
                  >
                    {opt.name}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Quantities */}
          <div className="space-y-3">
            <div>
              <div className="font-medium">{t(lang, "checkout.form.qtyTitle")}</div>
              <div className="text-sm text-muted-foreground">
                {t(lang, "checkout.form.qtyDesc")}
              </div>
            </div>

            <div
              className={`grid grid-cols-1 gap-4 ${
                ticketVariants.length >= 3
                  ? "sm:grid-cols-3"
                  : ticketVariants.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-1"
              }`}
            >
              {ticketVariants.map((item) => (
                <div className="space-y-2" key={item.code}>
                  <Label htmlFor={item.code}>{item.category_name}</Label>
                  <Input
                    id={item.code}
                    inputMode="numeric"
                    type="number"
                    min={0}
                    max={99}
                    value={countTicketSelected[item.code] ?? 0}
                    onChange={(e) => setTicKetSelected(item.code, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {promotionList.length ? (
            <div className=" rounded-xl border bg-muted/20 p-4">
              {promotionList.map((p) => (
                <div key={p.code} className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{p.promo_name}</p>
                    <span className="text-xs italic">
                      Chú ý:Giá vé áp dụng cho {p.promo_name}, vui lòng xuất căn cước khi vào cổng.
                    </span>
                  </div>
                  <input
                    aria-label="isCentralRegion"
                    type="checkbox"
                    className="h-5 w-5"
                    checked={isPromo[p.code] || false}
                    onChange={(e) => setIsPromoSelected(p.code, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          ) : null}
          <Separator />

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t(lang, "checkout.form.email")}</Label>
              <Input
                id="email"
                onChange={(e) => setFieldFormData("email", e.target.value)}
                placeholder="email@domain.com"
                value={formData.email}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t(lang, "checkout.form.phone")}</Label>
              <Input
                id="phone"
                onChange={(e) => setFieldFormData("phone", e.target.value)}
                placeholder="09xxxxxxxx"
                value={formData.phone}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">{t(lang, "checkout.form.note")}</Label>
            <Textarea
              id="description"
              placeholder={t(lang, "checkout.form.notePlaceholder")}
              value={formData.description}
              onChange={(e) => setFieldFormData("description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="lg:col-span-2 lg:sticky lg:top-24 rounded-2xl shadow-md relative">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-extrabold">
            {t(lang, "checkout.summary.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm pt-0">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t(lang, "checkout.summary.destination")}</span>
            <span className="font-medium">{locationNameSelected}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t(lang, "checkout.summary.date")}</span>
            <span className="font-medium">{formData.date_use}</span>
          </div>

          <Separator />

          {resumSelected.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-medium">{item.ticketName}</span>
                </div>
                <span className="text-sm ">{item.numerTicet}</span>
              </div>
              <div className="flex items-center justify-between ">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Giá công bố</span>
                </div>
                <span className="text-sm line-through text-gray-500">
                  {formatVND(item.base_price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Khuyến mãi</span>
                </div>
                <span className="text-sm ">{formatVND(item.finalprice)}</span>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold">Tổng cộng</span>
            <span className="text-base font-semibold">{formatVND(totalMoney)}</span>
          </div>

          <Button
            type="button"
            className="w-full rounded-xl"
            size="lg"
            disabled={totalMoney === 0 || loadingGetPice}
            onClick={handleSubmit}
          >
            Thanh toán {formatVND(totalMoney)}
          </Button>

          {loadingGetPice && (
            <div className="absolute inset-0 grid place-items-center bg-white/50">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
