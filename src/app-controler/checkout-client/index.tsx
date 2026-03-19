"use client";

import { useLang } from "@/lib/useLang";
import { CheckoutForm } from "./components/CheckoutForm";
import { t } from "@/lib/i18n/t";
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
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";

export default function CheckoutControlerPage() {
  const lang = useLang();
  const clientSupbase = createSupabaseBrowserClient();
  const searchParams = useSearchParams();
  const product = searchParams.get("product") || "BANA";

  const { setToastMessage, setGlobalLoading }: CommonType | any = useCommonStore.getState();

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
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {t(lang, "checkout.title")}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{t(lang, "checkout.subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 p-6">
        <CheckoutForm
          location={loactionKey}
          productKey={loactionKey}
          locations={locationList}
          onChangeLocation={onChangeLocation}
          onSubmit={handleSubmitTicket}
        />
      </section>
      {openQR && <BankTransferQR dataQR={qrPaymant} isOpen={openQR} onDone={handleDoneQR} />}

      {openDownloadTicke && (
        <TicketResultQR
          tickets={ticketResult}
          location={itemTicketOrder?.locationNameSelected || ""}
          dateUse={dayjs(itemTicketOrder?.formData?.date_use).format(BASIC_DATE_FORMAT) || ""}
          onClose={() => setOpenDownloadTicket(false)}
        />
      )}
      <LodingMessage loading={Boolean(loadingMessage)} messsage={loadingMessage} />
    </main>
  );
}
