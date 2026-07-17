"use client";

import { useEffect, useRef, useState } from "react";
import {
  customerCreateOrder,
  customerCreateOrderTicket,
  getTicketSunWorld,
  updatePaymentSuccess,
  updateStatusGetTicketFinal,
  updateStatusOrder,
} from "./api";
import { SubmitSelectTicket, TicketReponseType, TicketResultQRType } from "@/types/ticket";
import BankTransferQR from "../affi/topup/components/qrToBank";
import { getBankInfo } from "@/helpers/getQRBank";
import { QRBankResponseType } from "@/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { DB_TABLE_NAME, ERROR_MESSAGE, TYPE_TRANSFER } from "@/commons/constant";
import TicketResultQR from "../affi/getTicket/components/TicketResultQR";
import { LodingMessage } from "@/components/ui/loading-message";
import { getCodeTopup } from "@/helpers/genCode";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import GetTicketSunGroupForm from "@/components/GetTicketSunGroupForm";
import { SUN_BOOKING_FORM_TYPE } from "@/components/GetTicketSunGroupForm/constants";
import { ClientOrderItem, CustomerBuyFilnalType, CustomerOrderType } from "./type";
import { generateThirdPartyCode, rebuildDataTicket } from "@/helpers/ticket";
import { toast } from "react-toastify";
import { KEY_MODIFY_DATA } from "../affi/stats/contants";

let timeout: any = null;

let timeCancelOrder: any = null;

const initOrderData = {
  dateUse: "",
  orderCode: "",
  orderId: "",
};

export default function CheckoutControlerPage() {
  const clientSupbase = createSupabaseBrowserClient();

  const [loadingMessage, setLoadingMessage] = useState("");

  const [openQR, setOpenQR] = useState(false);
  const [openDownloadTicke, setOpenDownloadTicket] = useState(false);

  const chanenSupbase = useRef<any>(null);

  const [currentOrderData, setCurrentOrderData] = useState(initOrderData);

  const [ticketResult, setTicketResult] = useState<TicketResultQRType[]>([]);

  const [qrPaymant, setQRPayment] = useState<QRBankResponseType>({
    qr: "",
    code: "",
    amount: 0,
  });

  const handleDoneQR = () => {
    setOpenQR(false);
  };

  const cancleOrderTimeout = async (orderId: string) => {
    await updateStatusOrder({
      orderId: orderId,
      status: KEY_MODIFY_DATA.CANCEL,
      description: ERROR_MESSAGE.PAYMENT_TIMEOUT,
      status_payment: KEY_MODIFY_DATA.ERROR,
    });
    setCurrentOrderData(initOrderData);
    clearTimeout(timeCancelOrder);
    handleDoneQR();
    toast.error("Đơn hàng đã hủy do hết thời gian thanh toán");
  };

  const demoPaymentSuccess = (paymentCode: string) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      updatePaymentSuccess(paymentCode);
    }, 5000);
  };

  const handleBuyTicket = async (values: SubmitSelectTicket) => {
    const { formData, totalMoney, siteCode, products, date_use } = values;
    const paymentCode = getCodeTopup(TYPE_TRANSFER.CUSTOMER);
    const thirdPartyNum = generateThirdPartyCode();
    const { email, phone, fullname }: any = formData;

    const paramCreateOrder: CustomerOrderType = {
      email,
      phone,
      fullname,
      products,
      thirdPartyNumber: thirdPartyNum,
    };
    // STEP 1: CREATE ORDER WITH SUN WORLD
    const dataOrderSunWorld: TicketReponseType = await customerCreateOrder(paramCreateOrder);

    // SUCCESS OF SUN WORLD
    if (dataOrderSunWorld) {
      // STEP 2: SAVE ORDER IN DATABASE WITH STATUS "pending" (WAIT PAYMENT)
      const dataSubmit: ClientOrderItem = {
        userEmail: email,
        totalAmount: totalMoney,
        dateUse: dayjs(date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT),
        phone,
        fullname: fullname,
        thirdPartyNum,
        listTicketSubmit: products,
        siteCode,
        paymentCode,
      };

      const orderID = await customerCreateOrderTicket(dataSubmit);

      // CREATE ORDER SUCCESS: SHOW QR PAYMENT AND LISTEN PAYMENT CHANNEL (chanenSupbase.current)
      if (orderID) {
        const qrLink = getBankInfo(totalMoney, paymentCode);
        setQRPayment({
          qr: qrLink,
          code: paymentCode,
          amount: totalMoney,
        });
        setOpenQR(true);

        setCurrentOrderData({
          orderCode: dataOrderSunWorld.orderCode,
          orderId: orderID,
          dateUse: date_use,
        });

        //demo
        demoPaymentSuccess(paymentCode);

        // CANCLE ORDER TIMEOUT :
        timeCancelOrder = setTimeout(() => cancleOrderTimeout(orderID), 10000);
      }
    }
  };

  const getTicketSuccess = async () => {
    handleDoneQR();
    clearTimeout(timeout);
    clearTimeout(timeCancelOrder);

    const { orderCode, orderId, dateUse } = currentOrderData;
    const ticketSuccess: TicketReponseType = await getTicketSunWorld(orderCode);

    const payloadFinal: CustomerBuyFilnalType = {
      isError: true,
      orderCode: orderCode,
      orderId: orderId,
    };
    if (ticketSuccess) {
      // succes step: update status order and show ticket PDF
      const result: TicketResultQRType[] | any = rebuildDataTicket(ticketSuccess, orderId, dateUse);
      payloadFinal.tickets = result;
      payloadFinal.isError = false;
      payloadFinal.referenceCode = ticketSuccess.referenceCode;
    } else {
      payloadFinal.description = ERROR_MESSAGE.SUN_WORLD_TICKET;
    }
    await updateStatusGetTicketFinal(payloadFinal);
  };

  useEffect(() => {
    if (qrPaymant?.code) {
      chanenSupbase.current = clientSupbase
        .channel(`check-payment-${qrPaymant.code}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: DB_TABLE_NAME.ORDERS,
            filter: `payment_code=eq.${qrPaymant.code}`,
          },
          (payload) => {
            if (payload.new.status_payment === KEY_MODIFY_DATA.SUCCESSS) {
              toast.success("Thanh toán thành công!");
              clientSupbase.removeChannel(chanenSupbase.current);
              getTicketSuccess();
            } else if (payload.new.status_payment === KEY_MODIFY_DATA.ERROR) {
              toast.error("Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ");
              handleDoneQR();
            }
          }
        )
        .subscribe((status, err) => {
          // Kỳ vọng: "SUBSCRIBED"
          // Nếu là "CHANNEL_ERROR", "TIMED_OUT" -> có vấn đề (thường do RLS hoặc realtime chưa bật)
        });

      return () => {
        clientSupbase.removeChannel(chanenSupbase.current);
      };
    }
  }, [qrPaymant?.code]);

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <section className="relative bg-gradient-to-b from-blue-50/70 to-background">
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 pt-12 pb-20 px-4">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-20 w-48 h-48 bg-blue-400 rounded-full blur-2xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <nav className="flex items-center gap-2 text-blue-100 text-sm mb-4">
              <span className="hover:underline cursor-pointer">Trang chủ</span>
              <span>/</span>
              <span className="hover:underline cursor-pointer">Vé tham quan</span>
              <span>/</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Đặt vé Sun World
                  </h1>
                  <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-md uppercase">
                    Best Seller
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-blue-50">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Xác nhận tức thì</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">Thanh toán bảo mật</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white hidden md:block">
                <p className="text-xs text-blue-200 uppercase font-bold mb-1">Hỗ trợ 24/7</p>
                <p className="text-lg font-bold">
                  Hotline: <a href="tel:0705551668">0705551668</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl p-2 md:p-4">
            <GetTicketSunGroupForm
              location="BANA"
              onBuyTicket={handleBuyTicket}
              formType={SUN_BOOKING_FORM_TYPE.CUSTOMER}
            />
          </div>
        </div>
      </section>
      {openQR && (
        <BankTransferQR
          dataQR={qrPaymant}
          isOpen={openQR}
          onDone={handleDoneQR}
          mesage="Vui lòng đợi khi thanh toán và không tắt trình duyệt"
        />
      )}

      {openDownloadTicke && (
        <TicketResultQR
          tickets={ticketResult}
          location={""}
          onClose={() => setOpenDownloadTicket(false)}
        />
      )}
      <LodingMessage loading={Boolean(loadingMessage)} messsage={loadingMessage} />
    </main>
  );
}
