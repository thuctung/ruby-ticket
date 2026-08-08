"use client";

import { useState } from "react";

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
import { toast } from "react-toastify";
import { senTicketToMail } from "@/app-controler/checkout-client/api";
import { getTicketFOCAndCutomer } from "@/app-controler/checkout-client/contants";
import { ACC_STATUS, SITE_CODES, SITE_SUB_GROUP } from "@/commons/constant";
import { BOOKING_FORM_TYPE } from "@/components/GetTicketForm/constants";
import GetTicketForm from "@/components/GetTicketForm";
import { generateBookingVoucher } from "@/helpers/e-voucher";

export default function GetTicketPageControler() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { setToastMessage }: CommonType | any = useCommonStore.getState();
  const { setProfile }: CommonType | any = useProfileStore.getState();

  const [location, setLocation] = useState(SITE_CODES.BANAHILL);

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
    if (order_id) {
      const { products, totalMoney, date_use, haveFOC } = values;

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
  };

  const handleBuyTicketInSystem = async (order_id: string) => {
    // send mail to admin & user
    // generateBookingVoucher({
    //   orderCode: "26RUBYASSJ2424",
    //   // parkName: "CÔNG VIÊN SKN NÚI THẦN TÀI",
    //   packageName: "ALL GÓI TÍCH LỘC",
    //   nationality: "Tất cả",
    //   nationalityEn: "All nationality",
    //   date: "2024-09-25",
    //   leadTraveler: "khánh",
    //   phone: "0987468718",
    //   note: "đn",
    //   adults: 7,
    //   kids: 5,
    //   openingHours: "08:30 - 17:30",
    //   openingHoursEn: "Opening hours: 08:30 - 17:30",
    //   bungalowNote: "Quy định sử dụng tối đa 8 khách/ căn (Nếu quý khách có máu cần)",
    //   buffetTime: "10h30 - 14h00",
    //   buffetTimeEn: "Buffet lunch time is from 10:30 a.m. - 2:00 p.m",
    //   importantNotes: [
    //     {
    //       vi: "Quý khách vui lòng bảo mật QR code.Vé đã mua không thể hoàn hủy và chỉ có giá trị sử dụng 1 lần.",
    //       en: "Please keep the QR code secure. Purchased tickets cannot be refunded and are only valid for one-time use.",
    //     },
    //     {
    //       vi: "Mẫu e-voucher phải giữ nguyên định dạng của Asia. Mọi thay đổi và chỉnh sửa đều không được chấp nhận để sử dụng dịch vụ.",
    //       en: "The e-voucher form must maintain Asia's format. Any changes and modifications are not acceptable for use of the service.",
    //     },
    //     {
    //       vi: "Vui lòng đến quầy vé Công viên và trình vé điện tử đã mua để đổi vé vào cửa.",
    //     },
    //   ],
    //   includes: [
    //     { vi: "Phí vào cửa phổ thông.", en: "General admission fee." },
    //     { vi: "Ăn Buffet trưa/ Set menu.", en: "Eat buffet lunch/ Set menu." },
    //   ],
    //   hotline: "0905154351",
    //   email: "ctyasiagroup@gmail.com",
    //   listTicket: [
    //     {
    //       name: "Vé A người lớn",
    //       quantity: 1,
    //     },
    //     {
    //       name: "Vé A người lớn",
    //       quantity: 1,
    //     },
    //     {
    //       name: "Vé A người lớn",
    //       quantity: 1,
    //     },
    //     {
    //       name: "Vé A người lớn",
    //       quantity: 1,
    //     },
    //     {
    //       name: "Vé A người lớn",
    //       quantity: 1,
    //     },
    //   ],
    // });
  };

  const handleBuyTicketAff = async (values: SubmitSelectTicket) => {
    handleBuyTicketInSystem("SSDF");
    return;
    const validByTicket = await handleValidBeforeByTicket(values);

    if (validByTicket) {
      const { products, totalMoney, date_use, siteCode, in_system } = values;

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

      if (in_system) {
        if (siteCode === "NUITHANTAI") {
          // TODO
          handleBuyTicketInSystem(order_id);
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

          <GetTicketForm
            location={location}
            onBuyTicket={handleBuyTicketAff}
            formType={BOOKING_FORM_TYPE.AFFILATE}
          />
        </CardContent>
      </Card>
    </div>
  );
}
