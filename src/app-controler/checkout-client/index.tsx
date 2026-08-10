"use client";

import { useEffect, useRef, useState } from "react";
import {
  cancleBooking,
  customerCreateOrder,
  customerCreateOrderTicket,
  getTicketSunWorld,
  senTicketToMail,
  updateStatusGetTicketFinal,
  updateStatusOrder,
} from "./api";
import {
  ProductSubmitType,
  SubmitSelectTicket,
  TicketReponseType,
  TicketResultQRType,
} from "@/types/ticket";
import BankTransferQR from "../affi/topup/components/qrToBank";
import { getBankInfo } from "@/helpers/getQRBank";
import { CommonType, QRBankResponseType } from "@/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  DB_TABLE_NAME,
  ERROR_MESSAGE,
  PAYMENT_STATUS,
  SITE_CODES,
  TYPE_TRANSFER,
} from "@/commons/constant";
import { LodingMessage } from "@/components/ui/loading-message";
import { getCodeTopup } from "@/helpers/genCode";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import { ClientOrderItem, CustomerBuyFilnalType, CustomerOrderType } from "./type";
import { downloadTicketPDF, generateThirdPartyCode, rebuildDataTicket } from "@/helpers/ticket";
import { toast } from "react-toastify";
import { KEY_MODIFY_DATA } from "../affi/stats/contants";
import { useCommonStore } from "@/stores/useCommonStore";
import { getTicketFOCAndCutomer } from "./contants";
import GetTicketForm from "@/components/GetTicketForm";
import { BOOKING_FORM_TYPE } from "@/components/GetTicketForm/constants";
import { SendTicketInSystemMailType } from "../affi/getTicket/type";
import { createTemplateTicketThanTaiMountain } from "../affi/getTicket/api";
import FooterFeatures from "./components/FooterFeatures";
import Hero from "./components/Hero";

const initOrderData = {
  dateUse: "",
  orderCode: "",
  orderId: "",
  siteCode: "",
  thirdPartyNum: "",
  formData: {},
  in_system: false,
};

export default function CheckoutControlerPage() {
  const clientSupbase = createSupabaseBrowserClient();
  const timeCancelOrderRef = useRef<NodeJS.Timeout | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { showConfirm }: CommonType | any = useCommonStore.getState();

  const [openQR, setOpenQR] = useState(false);

  const chanenSupbase = useRef<any>(null);

  const [currentOrderData, setCurrentOrderData] = useState<any>(initOrderData);

  const [customerEmail, setCustomerEmail] = useState("");

  const [productSelected, setProductSelected] = useState<ProductSubmitType[]>([]);

  const [qrPaymant, setQRPayment] = useState<QRBankResponseType>({
    qr: "",
    code: "",
    amount: 0,
  });

  const handleDoneQR = () => {
    setOpenQR(false);
  };

  const cancleOrderTimeout = async (
    orderId: string,
    desc = ERROR_MESSAGE.PAYMENT_TIMEOUT,
    showMesage = true
  ) => {
    await updateStatusOrder({
      orderId: orderId,
      status: KEY_MODIFY_DATA.CANCEL,
      description: desc,
      status_payment: KEY_MODIFY_DATA.ERROR,
    });
    if (timeCancelOrderRef.current) {
      clearTimeout(timeCancelOrderRef.current);
      timeCancelOrderRef.current = null;
    }
    setCurrentOrderData(initOrderData);

    if (showMesage) {
      setLoadingMessage("");
      toast.error("Đơn hàng đã hủy do hết thời gian thanh toán");
    }
    handleDoneQR();
  };

  const confirmBuyTicket = (values: SubmitSelectTicket) => {
    showConfirm({
      message: "Thông tin mua vé đã đúng, xác nhận mua vé?",
      okFunc: async () => handleBuyTicket(values),
      textOk: "Mua",
    });
  };

  const handleBuyTicket = async (values: SubmitSelectTicket) => {
    const { formData, totalMoney, siteCode, products, date_use, in_system } = values;
    const paymentCode = getCodeTopup(TYPE_TRANSFER.CUSTOMER);
    const thirdPartyNum = generateThirdPartyCode(in_system);
    const { email, phone, fullname }: any = formData;
    setProductSelected(products);
    setCustomerEmail(email);

    const paramCreateOrder: CustomerOrderType = {
      email,
      phone,
      fullname,
      products,
      thirdPartyNumber: thirdPartyNum,
    };
    let passProcess = true;
    let dataOrderSunWorld: TicketReponseType | any = {};
    if (siteCode === SITE_CODES.BANAHILL) {
      // STEP 1: CREATE ORDER WITH SUN WORLD
      dataOrderSunWorld = await customerCreateOrder(paramCreateOrder);
      if (!dataOrderSunWorld) {
        passProcess = false;
      }
    }

    // SUCCESS OF SUN WORLD
    if (passProcess) {
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
        orderCode: dataOrderSunWorld.orderCode || thirdPartyNum, // in system user thirdPartyNum for ordercde
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
          products,
          orderId: orderID,
          dateUse: date_use,
          siteCode,
          formData,
          thirdPartyNum,
          in_system,
          paymentCode,
        });

        // CANCLE ORDER TIMEOUT :
        timeCancelOrderRef.current = setTimeout(() => cancleOrderTimeout(orderID), 10 * 60 * 1000); // 10m
      }
    }
  };

  const sendMailTicketInSystem = async (
    orderId: string,
    products: ProductSubmitType[],
    thirdPartyNumber: string,
    dateUse: string,
    formData: any,
    paymentCode: string
  ) => {
    const payload: SendTicketInSystemMailType = {
      orderCode: thirdPartyNumber,
      dateUse,
      email: formData.email,
      phone: formData.phone,
      paymentCode,
      listTicket: products.map((item) => ({ name: item.productsName, quantity: item.quantity })),
    };
    const data = await createTemplateTicketThanTaiMountain(payload);

    const payloadUpdate = {
      orderId: orderId,
      status_payment: PAYMENT_STATUS.SUCCESS,
      status: KEY_MODIFY_DATA.ERROR,
      description: "Lỗi đặt vé từ khách lẻ",
    };
    if (data) {
      payloadUpdate.status = KEY_MODIFY_DATA.SUCCESS;
      payloadUpdate.description = "";
      toast.success("Đặt vé thành công");
    } else {
      toast.error("Có lỗi xảy ra, liên hệ để được hỗ trợ");
    }
    updateStatusOrder(payloadUpdate);
  };

  const getTicketSuccess = async () => {
    handleDoneQR();
    if (timeCancelOrderRef.current) {
      clearTimeout(timeCancelOrderRef.current);
      timeCancelOrderRef.current = null;
    }

    const {
      orderCode,
      orderId,
      dateUse,
      in_system,
      thirdPartyNum,
      formData,
      products,
      paymentCode,
    } = currentOrderData;
    if (in_system) {
      sendMailTicketInSystem(orderId, products, thirdPartyNum, dateUse, formData, paymentCode);
      return;
    }

    const ticketSuccess: TicketReponseType = await getTicketSunWorld(orderCode);

    const payloadFinal: CustomerBuyFilnalType = {
      isError: true,
      orderCode: orderCode,
      orderId: orderId,
    };

    if (ticketSuccess) {
      // succes step: update status order
      const result: TicketResultQRType[] | any = rebuildDataTicket(ticketSuccess, orderId, dateUse);

      const formatTickets = result.map((item: TicketResultQRType) => {
        const ticketItemSelect = productSelected.find(
          (proSelect) => item.productCode === proSelect.productCode
        );
        return {
          ...item,
          publicPrice: ticketItemSelect?.publicPrice || 0,
          siteName: ticketItemSelect?.siteName || "",
          restaurantName: ticketItemSelect?.restaurantName,
          personType: ticketItemSelect?.personType,
          time: ticketItemSelect?.time,
        };
      });

      payloadFinal.tickets = result;
      payloadFinal.isError = false;
      payloadFinal.referenceCode = ticketSuccess.referenceCode;

      const { customerTickets } = getTicketFOCAndCutomer(formatTickets);
      // SEND TICKET TO MAIL AND DOWN FILE PDF
      await senTicketToMail({
        email: customerEmail,
        customerTickets,
        focTickets: [],
        orderCode,
      });
      downloadTicketPDF(customerTickets, []);
      toast.success(`Vé đã được gửi qua email: ${customerEmail}`);
      // reset data
      setProductSelected([]);
      setCustomerEmail("");
      setCurrentOrderData(initOrderData);
    } else {
      payloadFinal.description = ERROR_MESSAGE.SUN_WORLD_TICKET;
      toast.error("Có lỗi xảy ra, vui lòng liên hệ để được hỗ trợ");
    }
    await updateStatusGetTicketFinal(payloadFinal);
  };

  const handleCancleBooking = async () => {
    await cancleBooking(currentOrderData.orderCode);
    cancleOrderTimeout(currentOrderData.orderId, ERROR_MESSAGE.USER_CANCLE, false);
    handleDoneQR();
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
            if (payload.new.status_payment === KEY_MODIFY_DATA.SUCCESS) {
              toast.success("Thanh toán thành công!");
              clientSupbase.removeChannel(chanenSupbase.current);
              getTicketSuccess();
            } else if (payload.new.status_payment === KEY_MODIFY_DATA.ERROR) {
              toast.error("Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ");
              handleDoneQR();
            }
          }
        )
        .subscribe((status, err) => {});

      return () => {
        clientSupbase.removeChannel(chanenSupbase.current);
      };
    }
  }, [qrPaymant?.code]);

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="min-h-screen bg-[#f7f7f8]">
        <Hero />
        <GetTicketForm onBuyTicket={confirmBuyTicket} formType={BOOKING_FORM_TYPE.CUSTOMER} />
        <FooterFeatures />
      </div>
      {openQR && (
        <BankTransferQR
          dataQR={qrPaymant}
          isOpen={openQR}
          onDone={handleDoneQR}
          onCancle={handleCancleBooking}
          mesage="Vui lòng đợi khi thanh toán và không tắt trình duyệt"
        />
      )}
      <LodingMessage loading={Boolean(loadingMessage)} messsage={loadingMessage} />
    </main>
  );
}
