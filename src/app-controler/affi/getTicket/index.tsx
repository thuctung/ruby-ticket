"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import "react-datepicker/dist/react-datepicker.css";

import { formatVND } from "@/lib/money";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import {
  LocationType,
  TicketResultQRType,
  DataFormTicketSubmit,
  TicketSubmitAgentType,
  ParamCreateTicketAgentType,
  ResumSelectedType,
} from "@/types/ticket";
import { createOrderTicket, getLocation } from "./api";
import { useCommonStore } from "@/stores/useCommonStore";
import TicketResultQR from "./components/TicketResultQR";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import { CheckoutForm } from "@/app-controler/checkout-client/components/CheckoutForm";
import { AGENT_CODE } from "@/commons/constant";
import { get } from "lodash";
import { LodingMessage } from "@/components/ui/loading-message";

export default function GetTicketPageControler() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { setToastMessage }: CommonType | any = useCommonStore.getState();
  const { setProfile }: CommonType | any = useProfileStore.getState();

  const [locationList, setLocationList] = useState<LocationType[]>([]);
  const [location, setLocation] = useState("BANA");
  const [openQR, setOpenQR] = useState(false);
  const [resultTicketQR, setTicketResultQR] = useState<TicketResultQRType[]>([]);

  const [loadingMessageGetTicket, setLoadingMessageGetTicket] = useState("");

  const locationName = useMemo(
    () => locationList.find((item) => item.code === location)?.name || "",
    [location, locationList]
  );

  const onCloseQR = () => {
    setOpenQR(false);
  };

  const handleGetLocation = useCallback(async () => {
    const resLocation = await getLocation();
    if (resLocation) {
      setLocationList(resLocation);
    }
  }, []);

  useEffect(() => {
    handleGetLocation();
  }, [handleGetLocation]);

  const handleChangeLocation = (locationCode: string) => {
    setLocation(locationCode);
  };

  const handleGetTicket = (listTicket: ResumSelectedType[]) => {
    setLoadingMessageGetTicket("Đang xử lý vé...");
    setTimeout(() => {
      const data: TicketResultQRType[] =
        listTicket.flatMap((item) => {
          return Array.from({ length: item.numerTicet }, () => ({
            ticket_variant_code: item.ticket_variant_code,
            ticket_name: item.ticketName,
            ticket_code: "DSSDFSDF",
            dateUse: item.date_use,
          }));
        }) || [];
      setTicketResultQR(data);
      setOpenQR(true);
      setLoadingMessageGetTicket("");
    }, 5000);
  };

  const handleFormSubmit = async (values: DataFormTicketSubmit) => {
    const { total_amount, listTicket, date_use } = values;
    if (total_amount > profile.balance) {
      setToastMessage("Số dư không đủ!!");
      return;
    }
    if (profile) {
      const items: TicketSubmitAgentType[] = listTicket.map((item) => ({
        ticket_variant_code: item.ticket_variant_code,
        quantity: item.numerTicet,
        price: Number(item.finalprice),
      }));
      const params: ParamCreateTicketAgentType = {
        items,
        user_id: profile.user_id || "",
        date_use: dayjs(date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT),
        email: profile.email || "",
        total_amount,
      };
      const data = await createOrderTicket(params);
      if (data) {
        const currentBalance = get(data, "remaining_balance") || profile.balance - total_amount;
        setProfile({
          ...profile,
          balance: currentBalance,
        });
        handleGetTicket(listTicket);
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
          <CheckoutForm
            onSubmit={handleFormSubmit}
            onChangeLocation={handleChangeLocation}
            agentCode={AGENT_CODE.LEVEL_1}
            location={location}
            locations={locationList}
          />
        </CardContent>
      </Card>

      {openQR && (
        <TicketResultQR tickets={resultTicketQR} onClose={onCloseQR} location={locationName} />
      )}
      <LodingMessage
        loading={Boolean(loadingMessageGetTicket)}
        messsage={loadingMessageGetTicket}
      />
    </div>
  );
}
