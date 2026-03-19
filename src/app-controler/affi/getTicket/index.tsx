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
import { CheckoutForm } from "@/app-controler/checkout-client/components/CheckoutForm";
import { AGENT_CODE } from "@/commons/constant";

export default function GetTicketPageControler() {
  const lang = useLang();
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [locationList, setLocationList] = useState<LocationType[]>([]);
  const [location, setLocation] = useState("BANA");
  const [dateUse, setDateUse] = useState<Date>(new Date());
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

  useEffect(() => {
    handleGetLocation();
  }, [handleGetLocation]);

  const handleChangeLocation = (locationCode: string) => {
    setLocation(locationCode);
  };

  const onSubmit = (values: any) => {};

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
          <CheckoutForm
            onSubmit={onSubmit}
            onChangeLocation={handleChangeLocation}
            agentCode={AGENT_CODE.LEVEL_1}
            location={location}
            locations={locationList}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-end">
            <Button
              disabled={profile?.balance < 0}
              size="lg"
              className="w-full sm:w-auto rounded-xl px-10"
            >
              {profile?.balance < 0 ? "Số dư không đủ" : "Xuất vé"}
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
