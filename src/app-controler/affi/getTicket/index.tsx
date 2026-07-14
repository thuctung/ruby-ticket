"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { formatVND } from "@/lib/money";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import {
  LocationType,
  TicketResultQRType,
  TicketSubmitAgentType,
  ParamCreateTicketAgentType,
  SubmitSelectTicket,
  TicketReponseType,
} from "@/types/ticket";
import {
  createOrderTicket,
  getLocation,
  getTicketFromSunGroup,
  loginSunSystem,
  updateStatusOrderFail,
  updateSuccessOrder,
} from "./api";
import { useCommonStore } from "@/stores/useCommonStore";
import TicketResultQR from "./components/TicketResultQR";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import { CheckoutForm } from "@/app-controler/checkout-client/components/CheckoutForm";
import { AGENT_CODE } from "@/commons/constant";
import { get } from "lodash";
import { LodingMessage } from "@/components/ui/loading-message";
import { Button } from "@/components/ui/button";
import SunGroupBooking from "./components/SunGroupBooking";

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

  const handleBuyTicketAff = async (values: SubmitSelectTicket) => {
    const { products, totalMoney, date_use } = values;
    if (totalMoney > profile.balance) {
      setToastMessage("Số dư không đủ!!");
      return;
    }

    if (profile) {
      const items: TicketSubmitAgentType[] = products.map((item) => ({
        quantity: item.quantity,
        price: Number(item.unitPrice),
        product_code: item.productCode,
        product_name: item.productsName,
        date_use: date_use,
      }));

      const params: ParamCreateTicketAgentType = {
        items,
        user_id: profile.user_id || "",
        date_use: dayjs(date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT),
        email: profile.email || "",
        total_amount: totalMoney,
      };

      const order_id = await createOrderTicket(params);

      if (order_id) {
        const tickets: TicketReponseType | undefined = await getTicketFromSunGroup(products);
        if (tickets) {
          const result: TicketResultQRType[] | any = tickets.items.flatMap((item) =>
            item.tickets.map((ticketChild) => ({
              productName: item.productName,
              productCode: item.productCode,
              siteCode: item.siteCode,
              unitPrice: item.unitPrice,
              productGroup: item.productGroup,
              isFaceIdRequired: item.isFaceIdRequired,

              ticketNumber: ticketChild.ticketNumber,
              validDateFrom: ticketChild.validDateFrom,
              validDateTo: ticketChild.validDateTo,
              status: ticketChild.status,
              verifyCode: ticketChild.verifyCode,
              orderCode: tickets.orderCode,
              orderId: order_id,
              date_use,
            }))
          );
          setTicketResultQR(result);
          setOpenQR(true);

          const currentBalance = profile.balance - totalMoney;
          setProfile({
            ...profile,
            balance: currentBalance,
          });
          updateSuccessOrder({
            orderCode: tickets.orderCode,
            tickets: result,
            referenceCode: tickets.referenceCode,
            orderId: order_id,
          });
        } else {
          updateStatusOrderFail(order_id);
        }
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
          <div className="flex items-center justify-end">
            <div className="text-sm text-muted-foreground mr-2">Số dư: </div>
            <div className="text-lg font-semibold">
              {profile.balance ? formatVND(profile.balance) : 0}
            </div>
          </div>
          <Separator />
          {/* <CheckoutForm
            onSubmit={handleFormSubmit}
            onChangeLocation={handleChangeLocation}
            agentCode={AGENT_CODE.LEVEL_1}
            location={location}
            locations={locationList}
          /> */}
          <SunGroupBooking location="BANA" onBuyTicket={handleBuyTicketAff} />
        </CardContent>
      </Card>

      <Button onClick={() => loginSunSystem()}>lOGIN</Button>

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
