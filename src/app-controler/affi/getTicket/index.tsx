"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { formatVND } from "@/lib/money";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import {
  SiteType,
  TicketResultQRType,
  TicketSubmitAgentType,
  ParamCreateTicketAgentType,
  SubmitSelectTicket,
  TicketReponseType,
  ProductSubmitType,
} from "@/types/ticket";
import {
  createOrderTicket,
  getStatusProfile,
  getTicketFromSunGroup,
  updateStatusOrderFail,
  updateSuccessOrder,
} from "./api";
import { useCommonStore } from "@/stores/useCommonStore";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import { downloadTicketPDF, generateThirdPartyCode, rebuildDataTicket } from "@/helpers/ticket";
import GetTicketSunGroupForm from "@/components/GetTicketSunGroupForm";
import { SUN_BOOKING_FORM_TYPE } from "@/components/GetTicketSunGroupForm/constants";
import { toast } from "react-toastify";
import { senTicketToMail } from "@/app-controler/checkout-client/api";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { ACC_STATUS, SITE_SUB_GROUP } from "@/commons/constant";

export default function GetTicketPageControler() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { setToastMessage }: CommonType | any = useCommonStore.getState();
  const { setProfile }: CommonType | any = useProfileStore.getState();

  const [location, setLocation] = useState("BNC");

  const handleBuyTicketAff = async (values: SubmitSelectTicket) => {
    const { products, totalMoney, date_use, siteCode, haveFOC } = values;
    if (totalMoney > profile.balance) {
      setToastMessage("Số dư không đủ!!");
      return;
    }

    if (profile && products.length) {
      // check status profile
      const status = await getStatusProfile(profile.user_id);

      if (status === ACC_STATUS.APPROVED) {
        const items: TicketSubmitAgentType[] = products.map((item) => ({
          quantity: item.quantity,
          price: Number(item.unitPrice),
          product_code: item.productCode,
          product_name: item.productsName,
          date_use: date_use,
        }));

        const thirdPartyNumber = generateThirdPartyCode();
        const params: ParamCreateTicketAgentType = {
          items,
          user_id: profile.user_id || "",
          date_use: dayjs(date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT),
          email: profile.email || "",
          total_amount: totalMoney,
          side_code: siteCode,
          thirdPartyNumber,
        };

        const order_id = await createOrderTicket(params);

        if (order_id) {
          const tickets: TicketReponseType | undefined = await getTicketFromSunGroup(
            products,
            thirdPartyNumber,
            {
              email: profile.email,
              fullname: profile.full_name,
              phone: profile.phone,
            }
          );

          if (tickets) {
            const result: TicketResultQRType[] | any = rebuildDataTicket(
              tickets,
              order_id,
              date_use
            );

            const addPublicPrice = result.map((item: TicketResultQRType) => {
              const ticketItemSelect = products.find(
                (proSelect) => item.productCode === proSelect.productCode
              );

              return {
                ...item,
                publicPrice: ticketItemSelect?.publicPrice || 0,
                siteName: SITE_SUB_GROUP[item.siteCode as keyof typeof SITE_SUB_GROUP] || "",
                restaurantName: ticketItemSelect?.restaurantName,
                personType: ticketItemSelect?.personType,
                time: ticketItemSelect?.time,
              };
            });

            const { focTickets, customerTickets } = getTicketFOCAndCutomer(addPublicPrice);

            await downloadTicketPDF(customerTickets, haveFOC ? focTickets : []);

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
            toast.success(`Rút vé thành công`);

            senTicketToMail({
              email: profile.email || "",
              customerTickets,
              focTickets: haveFOC ? focTickets : [],
              orderCode: tickets.orderCode,
            });
          } else {
            updateStatusOrderFail(order_id);
            setToastMessage("Không tạo được vé!");
          }
        }
      } else {
        setToastMessage("Bạn đã bị khóa tài khoản, vui lòng liên hệ quản trị viên để được hỗ trợ");
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Rút vé (trừ tiền ví)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile.role !== "admin" && (
            <>
              <div className="flex items-center justify-end">
                <div className="text-sm text-muted-foreground mr-2">Số dư: </div>
                <div className="text-lg font-semibold">
                  {profile.balance ? formatVND(profile.balance) : 0}
                </div>
              </div>
              <Separator />
            </>
          )}

          <GetTicketSunGroupForm
            location={location}
            onBuyTicket={handleBuyTicketAff}
            formType={SUN_BOOKING_FORM_TYPE.AFFILATE}
          />
        </CardContent>
      </Card>
    </div>
  );
}
