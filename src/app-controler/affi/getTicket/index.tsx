"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatVND } from "@/lib/money";
import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n/t";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import {
  LocationType,
  TicketByLocationType,
  ProductType,
  ResultTicketSlectedType,
  TicketResultQRType,
  ItemSelectType,
} from "@/types/ticket";
import { createOrderTicket, getLocation, getProducts, getTicletByLocation } from "./api";
import { sv_getCurrentProfile } from "@/app-controler/login/api";
import { useCommonStore } from "@/stores/useCommonStore";
import TicketResultQR from "./components/TicketResultQR";
import { BASIC_DATE_FORMAT, formatVNTime } from "@/helpers/dateTime";
import dayjs from "dayjs";

export default function GetTicketPageControler() {
  const lang = useLang();
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [discount, setDiscount] = useState(0);
  const [locationList, setLocationList] = useState<LocationType[]>([]);
  const [location, setLocation] = useState("BANA");
  const [dateUse, setDateUse] = useState<Date>(new Date());
  const [ticketLocation, setTicketLocation] = useState<TicketByLocationType[]>([]);
  const [productFilter, setProductFilter] = useState<any[]>([]);
  const [ticketType, setTicetType] = useState<string>("");
  const [ticketCategory, setTicketCategory] = useState<any>({});
  const [openQR, setOpenQR] = useState(false);
  const [resultTicketQR, setTicketResultQR] = useState<TicketResultQRType[]>([]);

  const locationName = useMemo(
    () => locationList.find((item) => item.code === location)?.name || "",
    [location, locationList]
  );

  const onCloseQR = () => {
    setOpenQR(false);
    setTicketCategory({});
  };

  const handleGetLocation = useCallback(async () => {
    const resLocation = await getLocation();
    setLocationList(resLocation);
  }, []);

  const handleGetTicketType = useCallback(async (locCode: string) => {
    const data: TicketByLocationType[] | any = await getTicletByLocation(locCode);
    if (data?.length) {
      setTicketLocation(data);
      setTicetType(data[0].code);
    }
  }, []);

  const handleGetProduct = useCallback(async (tType: string) => {
    const data: any[] = await getProducts(tType);
    setProductFilter(data || []);
  }, []);

  useEffect(() => {
    handleGetLocation();
  }, [handleGetLocation]);

  useEffect(() => {
    if (location) {
      handleGetTicketType(location);
    }
  }, [location, handleGetTicketType]);

  useEffect(() => {
    if (ticketType) {
      handleGetProduct(ticketType);
    }
    setTicketCategory({});
  }, [ticketType, handleGetProduct]);

  const updateCategoryNum = (key: string, value: number) => {
    setTicketCategory((pre: any) => ({ ...pre, [key]: value }));
  };

  const handleChangeLocation = (locationCode: string) => {
    setLocation(locationCode);
    setTicketCategory({});
  };

  const sumMoneyTicket = (): ResultTicketSlectedType => {
    const result: ResultTicketSlectedType = {
      listItemSelect: [],
      total: 0,
    };
    const listKey = Object.keys(ticketCategory);

    listKey.forEach((keyCategory: string) => {
      const count = ticketCategory[keyCategory] || 0;
      if (count > 0) {
        const product: any = productFilter.find((item: any) => item.category_code === keyCategory);
        if (product) {
          const price = product.price;
          const money = price * count;

          result.listItemSelect.push({
            name: product.ticket_name,
            total: money,
            quantity: count,
            id: product.id,
            code: product.code,
          });
          result.total += money;
        }
      }
    });
    return result;
  };

  const resultTicketSelect: ResultTicketSlectedType = useMemo(
    () => sumMoneyTicket(),
    [ticketCategory, productFilter]
  );

  const finalMoenyToPay = useMemo(() => {
    if (discount) {
      return resultTicketSelect.total - resultTicketSelect.total * discount;
    }
    return resultTicketSelect.total;
  }, [resultTicketSelect, discount]);

  const checkBalance = async () => {
    if (profile?.balance < finalMoenyToPay) {
      setToastMessage("Số dư hiện tại không đủ !");
      return false;
    }
    return true;
  };

  const handlPayment = async () => {
    if (!dateUse) {
      setToastMessage("Vui lòng chọn ngày");
      return;
    }
    if (!finalMoenyToPay) return;

    const resultBalance = await checkBalance();
    if (resultBalance) {
      const data = await createOrderTicket(
        profile.user_id,
        resultTicketSelect.listItemSelect,
        finalMoenyToPay,
        formatVNTime(dateUse, "YYYY-MM-DD")
      );

      if (data?.success) {
        setTicketResultQR(data?.tickets);
        sv_getCurrentProfile(profile.user_id);
        setOpenQR(true);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Rút vé / Xuất vé (trừ tiền ví)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Số dư ví</div>
            <div className="text-lg font-semibold">
              {profile.balance ? formatVND(profile.balance) : 0}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Điểm đến</Label>
              <Select value={location} onValueChange={(v) => handleChangeLocation(v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t(lang, "checkout.switcher.title")} />
                </SelectTrigger>
                <SelectContent>
                  {locationList.map((location: LocationType) => (
                    <SelectItem key={location.code} value={location.code}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t(lang, "checkout.form.date")}</Label>
              <DatePicker
                selected={dateUse}
                onChange={(date: Date | null) => date && setDateUse(date)}
                dateFormat="dd/MM/yyyy"
                className=" w-full rounded-md border bg-background px-3 text-sm"
                minDate={new Date()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t(lang, "checkout.form.ticketType")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {ticketLocation.map((item: TicketByLocationType) => (
                <Button
                  key={item.code}
                  type="button"
                  variant={ticketType === item.code ? "default" : "outline"}
                  onClick={() => {
                    setTicetType(item.code);
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
            <div>
              <div className="font-medium">{t(lang, "checkout.form.centralTitle")}</div>
              <div className="text-sm text-muted-foreground">
                {t(lang, "checkout.form.centralDesc")}
              </div>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={discount > 0}
              onChange={(e) => setDiscount(e.target.checked ? 0.1 : 0)} // Assume 10% discount for central
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="font-medium">{t(lang, "checkout.form.qtyTitle")}</div>
              <div className="text-sm text-muted-foreground">
                {t(lang, "checkout.form.qtyDesc")}
              </div>
            </div>

            <div
              className={`grid grid-cols-1 gap-4 ${productFilter.length >= 3 ? "sm:grid-cols-3" : productFilter.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
            >
              {productFilter.map((item: any) => {
                const price = item.price;

                return (
                  <div key={item.id} className="space-y-2 border p-3 rounded-xl">
                    <div className="flex justify-between items-center">
                      <Label className="font-bold">{item.category_name}</Label>
                      <span className="text-xs text-blue-600 font-medium">{formatVND(price)}</span>
                    </div>
                    <Input
                      name={item.category_code}
                      type="number"
                      min={0}
                      max={200}
                      value={ticketCategory[item.category_code] || 0}
                      onChange={(e) =>
                        updateCategoryNum(item.category_code, Number(e.target.value))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="font-medium">{formatVND(resultTicketSelect.total)}</span>
              </div>
              {resultTicketSelect.listItemSelect.map((item: ItemSelectType, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium">{formatVND(item.total)}</span>
                </div>
              ))}

              {discount ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Khuyến mãi : {discount * 100}%</span>
                  <span className="font-medium">
                    {formatVND(resultTicketSelect.total - resultTicketSelect.total * discount)}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-semibold">Tổng</span>
                <span className="font-semibold">{formatVND(finalMoenyToPay)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-end">
            <Button
              disabled={profile?.balance < finalMoenyToPay}
              onClick={handlPayment}
              size="lg"
              className="w-full sm:w-auto rounded-xl px-10"
            >
              {profile?.balance < finalMoenyToPay ? "Số dư không đủ" : "Xuất vé"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {openQR && (
        <TicketResultQR
          tickets={resultTicketQR}
          onClose={onCloseQR}
          location={locationName}
          dateUse={dayjs(dateUse).format(BASIC_DATE_FORMAT)}
        />
      )}
    </div>
  );
}
