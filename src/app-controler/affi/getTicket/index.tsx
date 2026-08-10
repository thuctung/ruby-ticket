"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { formatVND } from "@/lib/money";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import {
  TicketResultQRType,
  TicketSubmitAgentType,
  ParamCreateTicketAgentType,
  SubmitSelectTicket,
  TicketReponseType,
  ProductSubmitType,
} from "@/types/ticket";
import {
  createOrderTicket,
  createTemplateTicketThanTaiMountain,
  getStatusProfile,
  getTicketFromSunGroup,
  updateOrderAndBalaceInSystem,
  updateStatusOrderFail,
  updateSuccessOrder,
} from "./api";
import { useCommonStore } from "@/stores/useCommonStore";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import { downloadTicketPDF, generateThirdPartyCode, rebuildDataTicket } from "@/helpers/ticket";
import { toast } from "react-toastify";
import { senTicketToMail } from "@/app-controler/checkout-client/api";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { ACC_STATUS, ERROR_MESSAGE, SITE_CODES, SITE_SUB_GROUP } from "@/commons/constant";
import { BOOKING_FORM_TYPE } from "@/components/GetTicketForm/constants";
import GetTicketForm from "@/components/GetTicketForm";
import { PayloadUdateOrderBalanceType, SendTicketInSystemMailType } from "./type";
import { KEY_MODIFY_DATA } from "../stats/contants";

export default function GetTicketPageControler() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { setToastMessage }: CommonType | any = useCommonStore.getState();
  const { setProfile }: CommonType | any = useProfileStore.getState();

  const [location, setLocation] = useState(SITE_CODES.BANAHILL);

  const updateBalaceProfile = (totalMoney: number) => {
    const currentBalance = profile.balance - totalMoney;
    setProfile({
      ...profile,
      balance: currentBalance,
    });
    return currentBalance;
  };

  const handleValidBeforeByTicket = async (values: SubmitSelectTicket) => {
    let result = true;
    const { totalMoney, products } = values;
    if (totalMoney > profile.balance) {
      setToastMessage("Số dư không đủ!!");
      result = false;
    } else if (profile && products.length) {
      const status = await getStatusProfile(profile.user_id);
      if (status !== ACC_STATUS.APPROVED) {
        result = false;
        setToastMessage("Bạn đã bị khóa tài khoản, vui lòng liên hệ quản trị viên để được hỗ trợ");
      }
    } else {
      result = false;
    }
    return result;
  };

  const handleByTicketSunWorld = async (
    order_id: string,
    thirdPartyNumber: string,
    values: SubmitSelectTicket
  ) => {
    const { products, totalMoney, date_use, haveFOC, callback } = values;

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
        const result: TicketResultQRType[] | any = rebuildDataTicket(tickets, order_id, date_use);

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

        updateBalaceProfile(totalMoney);

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
        if (callback) callback(true);
      } else {
        updateStatusOrderFail(order_id, ERROR_MESSAGE.SUN_WORLD_TICKET);
        setToastMessage("Không tạo được vé!");
        if (callback) callback(false);
      }
    } else {
      if (callback) callback(false);
    }
  };

  const handleBuyTicketInSystem = async (
    order_id: string,
    products: ProductSubmitType[],
    thirdPartyNumber: string,
    dateUse: string,
    totalMoney: number,
    callback?: Function
  ) => {
    if (profile.email && profile.phone) {
      const payload: SendTicketInSystemMailType = {
        orderCode: thirdPartyNumber,
        dateUse,
        email: profile.email,
        phone: profile.phone,
        listTicket: products.map((item) => ({ name: item.productsName, quantity: item.quantity })),
      };
      const data = await createTemplateTicketThanTaiMountain(payload);

      if (data) {
        const payloadUpdate: PayloadUdateOrderBalanceType = {
          balance: updateBalaceProfile(totalMoney),
          user_id: profile.user_id,
          order_id,
          description: "",
          status: KEY_MODIFY_DATA.SUCCESS,
          orderCode: thirdPartyNumber,
          amount: totalMoney,
        };
        updateOrderAndBalaceInSystem(payloadUpdate);
        toast.success("Đặt vé thành công");
        if (callback) callback(true);
      } else {
        updateStatusOrderFail(order_id, ERROR_MESSAGE.ERROR_SYSTEM_CREATE_TICKET);
        if (callback) callback(false);
      }
    }
  };

  const handleBuyTicketAff = async (values: SubmitSelectTicket) => {
    const validByTicket = await handleValidBeforeByTicket(values);

    if (validByTicket) {
      const { products, totalMoney, date_use, siteCode, in_system, callback } = values;
      const items: TicketSubmitAgentType[] = products.map((item) => ({
        quantity: item.quantity,
        price: Number(item.unitPrice),
        product_code: item.productCode,
        product_name: item.productsName,
        date_use: date_use,
      }));

      const thirdPartyNumber = generateThirdPartyCode(in_system);
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

      if (in_system) {
        if (siteCode === "NUITHANTAI") {
          // TODO
          handleBuyTicketInSystem(
            order_id,
            products,
            thirdPartyNumber,
            date_use,
            totalMoney,
            callback
          );
        } else {
          setToastMessage("Chưa mở bán ở địa điểm này!");
        }
      } else {
        handleByTicketSunWorld(order_id, thirdPartyNumber, values);
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

          <GetTicketForm onBuyTicket={handleBuyTicketAff} formType={BOOKING_FORM_TYPE.AFFILATE} />
        </CardContent>
      </Card>
    </div>
  );
}
