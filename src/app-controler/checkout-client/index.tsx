"use client";

import { useLang } from "@/lib/useLang";
import { CheckoutForm } from "./components/CheckoutForm";
import { useEffect, useState } from "react";
import { getLocationClient, getQRPaymentClient } from "./api";
import { DataFormTicketSubmit, LocationType, TicketResultQRType } from "@/types/ticket";
import { useSearchParams } from "next/navigation";
import BankTransferQR from "../affi/topup/components/qrToBank";
import { getBankInfo } from "@/helpers/getQRBank";
import { get } from "lodash";
import { CommonType, QRBankResponseType } from "@/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCommonStore } from "@/stores/useCommonStore";
import { DB_TABLE_NAME, PAYMENT_STATUS } from "@/commons/constant";
import TicketResultQR from "../affi/getTicket/components/TicketResultQR";
import { LodingMessage } from "@/components/ui/loading-message";

export default function CheckoutControlerPage() {
  const lang = useLang();
  const clientSupbase = createSupabaseBrowserClient();
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "BANA";

  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [locationList, setLocationList] = useState<LocationType[]>([]);
  const [loactionKey, setLocationKey] = useState(product);

  const [loadingMessage, setLoadingMessage] = useState("");

  const [openQR, setOpenQR] = useState(false);
  const [openDownloadTicke, setOpenDownloadTicket] = useState(false);

  const [itemTicketOrder, setItemTicketOrder] = useState<DataFormTicketSubmit | null>(null);

  const [ticketResult, setTicketResult] = useState<TicketResultQRType[]>([]);

  const [qrPaymant, setQRPayment] = useState<QRBankResponseType>({
    qr: "",
    code: "",
    amount: 0,
    orderId: "",
  });

  const fetchLoction = async () => {
    const data: any = await getLocationClient();
    setLocationList(data);
  };

  const onChangeLocation = (value: string) => {
    setLocationKey(value);
  };

  const handleDoneQR = () => {
    setOpenQR(false);
  };

  const handleSubmitTicket = async (values: DataFormTicketSubmit) => {
    setItemTicketOrder(values);
    const { formData, total_amount } = values;
    const { email, phone, description }: any = formData;
    const data = await getQRPaymentClient({
      user_email: email,
      total_amount,
      phone: phone,
      description: description,
    });
    const result = get(data, "data", {});
    const { paymentContent, orderId } = result;
    if (paymentContent) {
      const qrLink = getBankInfo(total_amount, paymentContent);
      setQRPayment({
        qr: qrLink,
        code: paymentContent,
        amount: total_amount,
        orderId,
      });
      setOpenQR(true);
    }
  };

  const getTicketData = () => {
    try {
      const data: TicketResultQRType[] =
        itemTicketOrder?.listTicket.map((item) => ({
          ticket_variant_code: item.ticket_variant_code,
          ticket_name: item.ticketName,
          ticket_code: "DSSDFSDF",
          dateUse: item.date_use,
        })) || [];
      setTicketResult(data);
      setOpenDownloadTicket(true);
      handleDoneQR();
      setLoadingMessage("");
    } catch (e) {
      setLoadingMessage("");
      setToastMessage("Có lỗi xảy ra! Vui lòng liên hệ bộ phận hỗ trợ");
    }
  };

  useEffect(() => {
    fetchLoction();
  }, []);

  useEffect(() => {
    if (qrPaymant?.code) {
      const channel = clientSupbase
        .channel("check-payment")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: DB_TABLE_NAME.ORDERS,
            filter: `payment_code=eq.${qrPaymant.code}`,
          },
          (payload) => {
            if (payload.new.status === PAYMENT_STATUS.COMPLETED) {
              setLoadingMessage("Thanh toán thành công!, đang xử lý vé...");
              getTicketData();
            } else if (payload.new.status === PAYMENT_STATUS.FAILED) {
              setToastMessage("Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ");
              handleDoneQR();
            }
          }
        )
        .subscribe();

      return () => {
        clientSupbase.removeChannel(channel);
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
                    Đặt vé tham quan
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
            <CheckoutForm
              location={loactionKey}
              locations={locationList}
              onChangeLocation={onChangeLocation}
              onSubmit={handleSubmitTicket}
            />
          </div>
        </div>
      </section>
      {openQR && (
        <BankTransferQR
          dataQR={qrPaymant}
          isOpen={openQR}
          onDone={handleDoneQR}
          mesage="Vui lòng đợi khi thanh toán và không tắt cửa sổ này"
        />
      )}

      {openDownloadTicke && (
        <TicketResultQR
          tickets={ticketResult}
          location={itemTicketOrder?.locationNameSelected || ""}
          onClose={() => setOpenDownloadTicket(false)}
        />
      )}
      <LodingMessage loading={Boolean(loadingMessage)} messsage={loadingMessage} />
    </main>
  );
}
