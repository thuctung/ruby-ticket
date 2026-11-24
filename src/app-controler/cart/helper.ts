import { PayloadGetTicketSunType } from "../buy-ticket/type";
import {
  getTicketSunWorld,
  senMailOrderProductInSystem,
  updateStatusOrder,
} from "../checkout-client/api";
import { downloadTicketPDF } from "@/helpers/ticket";
import { GetTicketCustomerType } from "./types";
import { SendTicketInSystemMailType } from "../affi/getTicket/type";
import { ProductSubmitType } from "@/types/ticket";
import { SITE_CODES, STATUS_COMMON_TYPE } from "@/commons/constant";
import { createTemplateTicketThanTaiMountain } from "../affi/getTicket/api";
import { toast } from "react-toastify";

export const getTicketForCustomer = async ({
  currentOrderData,
  productSelected,
  email,
  route,
  callback,
  showLoading = true,
}: GetTicketCustomerType) => {
  const { orderCode, orderId, dateUse } = currentOrderData;
  const paramGetTicket: PayloadGetTicketSunType = {
    orderCode,
    productSelected,
    orderId,
    dateUse,
    customerEmail: email,
  };

  const { customerTickets } = await getTicketSunWorld(paramGetTicket, showLoading);

  if (customerTickets?.length) {
    await downloadTicketPDF(customerTickets, []);
    if (callback) {
      callback();
    }
    route.push(`/order-success/${currentOrderData.thirdPartyNum}`);
  }
};

export const PRODUCT_SELECTED_LOCALE = "PRODUCT_SELECTED_LOCALE";

export const sendMailTicketInSystem = async (orderData: any, callback: Function) => {
  const { siteCode, orderId, dateUse, formData, thirdPartyNum, siteName, products, paymentCode } =
    orderData;
  const payload: SendTicketInSystemMailType = {
    orderCode: thirdPartyNum,
    dateUse,
    email: formData.email,
    phone: formData.phone,
    fullName: formData.fullname,
    paymentCode,
    siteName,
    listTicket: products.map((item: ProductSubmitType) => ({
      name: item.productsName,
      quantity: item.quantity,
    })),
  };

  const senTicket =
    siteCode === SITE_CODES.NUITHANTAI
      ? createTemplateTicketThanTaiMountain
      : senMailOrderProductInSystem;

  const data = await senTicket(payload);
  const payloadUpdate = {
    orderId: orderId,
    status_payment: STATUS_COMMON_TYPE.SUCCESS,
    status: STATUS_COMMON_TYPE.ERROR,
    description: "Lỗi đặt vé từ khách lẻ",
  };
  if (data) {
    payloadUpdate.status = STATUS_COMMON_TYPE.SUCCESS;
    payloadUpdate.description = "";
    toast.success("Đặt vé thành công");
    if (callback) {
      callback();
    }
  } else {
    toast.error("Có lỗi xảy ra, liên hệ để được hỗ trợ");
  }
  updateStatusOrder(payloadUpdate);
};
