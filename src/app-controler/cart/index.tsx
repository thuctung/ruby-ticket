"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Plus, ShoppingCart, Ticket } from "lucide-react";
import dayjs from "dayjs";

import { useCartStore } from "@/stores/useCartStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType, QRBankResponseType } from "@/types";
import { formatVND } from "@/lib/money";
import { useCommonStore } from "@/stores/useCommonStore";
import { getCodeTopup } from "@/helpers/genCode";
import {
  DB_TABLE_NAME,
  ERROR_MESSAGE,
  getSideItem,
  SITE_CODES,
  STATUS_COMMON_TYPE,
  TYPE_TRANSFER,
} from "@/commons/constant";
import { generateThirdPartyCode } from "@/helpers/ticket";
import { ProductSubmitType, TicketReponseType, TicketResultQRType } from "@/types/ticket";
import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import { getBankInfo } from "@/helpers/getQRBank";
import { useTranslation } from "@/lib/i18n/client";

import { CartItemList } from "./components/CartItemList";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentMethods } from "./components/PaymentMethods";
import { RouteDecor } from "./components/RouteDecor";
import { Coupon, PaymentMethodId, CreatedOrder } from "./types";
import { CustomerForm } from "./components/CustomerForm";
import { validateCustomer } from "./components/customer";
import {
  cancleBooking,
  customerCreateOrder,
  customerCreateOrderTicket,
  senMailOrderProductInSystem,
  updateStatusOrder,
} from "../checkout-client/api";
import { ClientOrderItem, CustomerOrderType } from "../checkout-client/type";

import BankTransferQR from "../affi/topup/components/qrToBank";
import { paymentMomo, paymentOnePay } from "./apis";
import { getTicketForCustomer, PRODUCT_SELECTED_LOCALE, sendMailTicketInSystem } from "./helper";
import { SendTicketInSystemMailType } from "../affi/getTicket/type";
import { createTemplateTicketThanTaiMountain } from "../affi/getTicket/api";

const initOrderData = {
  dateUse: "",
  orderCode: "",
  orderId: "",
  siteCode: "",
  thirdPartyNum: "",
  formData: {},
  in_system: false,
};

export default function CartController() {
  const clientSupbase = createSupabaseBrowserClient();
  const { t } = useTranslation();

  const { items, siteCode, formData, siteList, customerInfo, getSites, setCustomerInfo } =
    useCartStore((s) => s);

  const itemsCart = Array.from(items?.values?.() ?? []);
  const timeCancelOrderRef = useRef<NodeJS.Timeout | null>(null);
  const chanenSupbase = useRef<any>(null);

  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { showConfirm }: CommonType | any = useCommonStore.getState();

  const subTotal = itemsCart.reduce((sum, t) => {
    let price = t.product.pinalPrice || 0;
    return sum + price * (t.quantity ?? 0);
  }, 0);

  const [qrPaymant, setQRPayment] = useState<QRBankResponseType>({
    qr: "",
    code: "",
    amount: 0,
  });
  const [openQR, setOpenQR] = useState(false);

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [payment, setPayment] = useState<PaymentMethodId | null>("qr");
  const [submitted, setSubmitted] = useState(false);
  const route = useRouter();
  const [order, setOrder] = useState<CreatedOrder | null>(null); // chỉ dùng cho chuyển khoản QR
  const [submitting, setSubmitting] = useState(false);
  const [currentOrderData, setCurrentOrderData] = useState<any>(initOrderData);
  const [productSelected, setProductSelected] = useState<ProductSubmitType[]>([]);

  const currentSite = useMemo(() => getSideItem(siteCode, siteList), [siteCode, siteList]);

  useEffect(() => {
    getSites();
  }, [getSites]);

  useEffect(() => {
    if (profile.email) {
      const { full_name, email, phone } = profile;
      setCustomerInfo({
        fullname: full_name || "",
        email: email,
        phone: phone || "",
      });
    }
  }, [profile.email]);

  const totalPayment = useMemo(() => {
    return subTotal;
  }, [subTotal, coupon]);

  const applyCoupon = (code: string) => {
    const found = false;
    if (!found) {
      setCoupon(null);
      setCouponError(t("cart.invalid_or_expired_coupon"));
      return;
    }
    setCoupon(found);
    setCouponError("");
  };
  const removeCoupon = () => {
    setCoupon(null);
    setCouponError("");
  };

  const customerErrors = useMemo(() => validateCustomer(customerInfo), [customerInfo]);
  const canCheckout = itemsCart.length > 0 && !!payment && !submitting;

  const backToBuyTicket = () => {
    route.push("/mua-ve-tham-quan");
  };

  const cancleOrderTimeout = async (
    orderId: string,
    desc = ERROR_MESSAGE.PAYMENT_TIMEOUT,
    showMesage = true
  ) => {
    await updateStatusOrder({
      orderId: orderId,
      status: STATUS_COMMON_TYPE.CANCELED,
      description: desc,
      status_payment: STATUS_COMMON_TYPE.ERROR,
    });
    if (timeCancelOrderRef.current) {
      clearTimeout(timeCancelOrderRef.current);
      timeCancelOrderRef.current = null;
    }
    setCurrentOrderData(initOrderData);

    if (showMesage) {
      toast.error("cart.order_cancelled_payment_timeout");
    }
    handleDoneQR();
  };

  const handleBuyTicket = async () => {
    const paymentCode = getCodeTopup(TYPE_TRANSFER.CUSTOMER);

    const in_system = currentSite?.in_system || false;
    const thirdPartyNum = generateThirdPartyCode(in_system);
    const { email, phone, fullname } = customerInfo;
    let passProcess = true;
    let dataOrderSunWorld: TicketReponseType | any = {};
    let site_code = formData.site_code || currentSite?.code || "";
    let site_name = currentSite?.name || "";

    const products = itemsCart.map((item) => {
      site_code = item.product.site_code;
      site_name = item.product.site?.name || "";
      const itemSubmit: ProductSubmitType = {
        productCode: item.product.code,
        siteCode: site_code,
        siteName: site_name,
        quantity: item.quantity,
        usageDate: item.product?.pricePolicy?.usageDate || "",
        usageDateTo: item.product?.pricePolicy?.validDateTo || "",
        performanceId: item.product?.performances?.[0]?.performanceId || "",
        productsName: item.product.name,
        publicPrice: item.product.publicPrice,
        unitPrice: item.product.pinalPrice || 0,
        restaurantName: item.product?.restaurantName || "",
        personType: item.product.personType,
        time: `${item.product.openTime || ""}-${item.product.closeTime || ""}`,
      };
      return itemSubmit;
    });
    setProductSelected(products);

    const paramCreateOrder: CustomerOrderType = {
      email,
      phone,
      fullname,
      products,
      thirdPartyNumber: thirdPartyNum,
    };

    // STEP 1: CREATE ORDER WITH SUN WORLD
    if (!in_system) {
      dataOrderSunWorld = await customerCreateOrder(paramCreateOrder);
      if (!dataOrderSunWorld) {
        passProcess = false;
      }
    }
    // SUCCESS OF SUN WORLD
    const orderCode = dataOrderSunWorld.orderCode || thirdPartyNum;
    const dataSubmit: ClientOrderItem = {
      userEmail: email,
      totalAmount: totalPayment,
      dateUse: dayjs(formData.date_use, BASIC_DATE_FORMAT).format(SERVER_DATE_FORMAT),
      phone,
      fullname: fullname,
      thirdPartyNum,
      listTicketSubmit: products,
      siteCode: site_code,
      paymentType: payment!,
      paymentCode,
      orderCode, // in system use thirdPartyNum for ordercde
    };
    const orderID = await customerCreateOrderTicket(dataSubmit);

    if (orderID) {
      switch (payment) {
        case "momo": {
          localStorage.setItem(PRODUCT_SELECTED_LOCALE, JSON.stringify(products));
          handlePayMomo(orderCode);
          break;
        }
        case "card": {
          handleOnePay(orderCode, paymentCode);
          break;
        }
        default: {
          const qrLink = getBankInfo(totalPayment, paymentCode);
          setQRPayment({
            qr: qrLink,
            code: paymentCode,
            amount: totalPayment,
          });
          setOpenQR(true);
          setCurrentOrderData({
            orderCode: dataOrderSunWorld.orderCode,
            products,
            orderId: orderID,
            dateUse: formData.date_use,
            siteCode,
            formData,
            thirdPartyNum,
            in_system,
            paymentCode,
            siteName: site_name,
          });
        }
      }

      // CANCLE ORDER TIMEOUT :
      timeCancelOrderRef.current = setTimeout(() => cancleOrderTimeout(orderID), 10 * 60 * 1000); // 10m
    }
  };

  const handleOnePay = async (orderCode: string, paymentCode: string) => {
    const { payment_url } = await paymentOnePay(orderCode, paymentCode);
    if (payment_url) {
      window.location.href = payment_url;
    } else {
      toast.error("Không tạo được thanh toán");
    }
  };

  const handlePayMomo = async (orderCode: string) => {
    const { payUrl } = await paymentMomo(orderCode, totalPayment);
    if (payUrl) {
      window.location.href = payUrl;
    } else {
      toast.error("Không tạo được thanh toán");
    }
  };

  const getTicketSuccess = async () => {
    handleDoneQR();
    if (timeCancelOrderRef.current) {
      clearTimeout(timeCancelOrderRef.current);
      timeCancelOrderRef.current = null;
    }
    const { in_system } = currentOrderData;
    if (in_system) {
      await sendMailTicketInSystem(currentOrderData, () => {
        setCurrentOrderData(initOrderData);
      });
      return;
    } else {
      await getTicketForCustomer({
        currentOrderData,
        productSelected,
        email: customerInfo.email,
        route,
        callback: () => setCurrentOrderData(initOrderData),
      });
    }
  };

  const handleCheckout = () => {
    const firstInvalid = (["fullname", "email", "phone"] as const).find((k) => customerErrors[k]);

    if (firstInvalid) {
      setSubmitted(true);
      document.getElementById(`customer-${firstInvalid}`)?.focus();
      return;
    }

    showConfirm({
      message: t("cart.confirm_ticket_purchase"),
      okFunc: handleBuyTicket,
      textOk: t("cart.agree"),
    });
  };

  const handleDoneQR = () => {
    setOpenQR(false);
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
            if (payload.new.status_payment === STATUS_COMMON_TYPE.SUCCESS) {
              toast.success(t("cart.payment_success"));
              clientSupbase.removeChannel(chanenSupbase.current);
              getTicketSuccess();
            } else if (payload.new.status_payment === STATUS_COMMON_TYPE.ERROR) {
              toast.error(t("cart.payment_failed"));
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

  const buttonLabel = submitting
    ? t("cart.processing")
    : order
      ? t("cart.i_have_transferred")
      : `${t("cart.payment")} ${itemsCart.length > 0 ? formatVND(totalPayment) : ""}`;

  return (
    <div className="min-h-screen bg-[#f3f6f4]">
      <section className="relative overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-[#b3122b] to-[#6b0f1f] pb-24 pt-8 shadow-lg shadow-[#6b0f1f]/30 sm:pb-28 md:pb-32 md:pt-14">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: "url(/bana/cauvang.webp)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#5a0a18]/95 via-[#9b1328]/80 to-[#b3122b]/40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,170,150,0.32),transparent_45%)]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/15 to-transparent"
        />

        <RouteDecor className="pointer-events-none absolute right-0 top-0 h-full w-[300px] opacity-30 sm:w-[460px] sm:opacity-100" />

        <div className="relative mx-auto max-w-6xl px-4 md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner ring-1 ring-white/30 backdrop-blur-sm md:h-12 md:w-12">
              <ShoppingCart size={22} aria-hidden="true" />
            </span>
            <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
              {t("cart.cart")}
            </h1>
          </div>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm text-white/90 ring-1 ring-white/30 backdrop-blur-sm md:text-base">
            <Ticket size={16} className="text-[#ffd27a]" aria-hidden="true" />
            {itemsCart.length > 0
              ? `${itemsCart.length} ${t("cart.tickets_awaiting_payment")}`
              : t("cart.no_tickets_selected")}
          </p>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 pb-24 sm:-mt-20 md:-mt-24 md:px-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <section aria-label="Vé đã chọn">
              <CartItemList items={itemsCart} />
              <div className="flex justify-end">
                <button
                  onClick={backToBuyTicket}
                  className="
                group mt-3 inline-flex items-center gap-1.5
                rounded-full px-4 py-2
                bg-gradient-to-r from-teal-600 to-emerald-400
                text-sm font-semibold text-white
                shadow-md shadow-emerald-600/25
                transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/40 hover:brightness-105
                active:translate-y-0 active:scale-95
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                >
                  <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                  {t("cart.buy_more_tickets")}
                </button>
              </div>
            </section>
            <CustomerForm errors={customerErrors} showAllErrors={submitted} />
            <OrderSummary
              subtotal={subTotal}
              discount={0}
              total={totalPayment}
              appliedCoupon={coupon}
              couponError={couponError}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
            />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <PaymentMethods value={payment} onChange={setPayment} order={order} />
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout}
              className="w-full rounded-full bg-gradient-to-r from-[#e5252a] to-[#ff6b6b] py-3.5 text-base font-bold text-white  transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {buttonLabel}
            </button>
          </aside>
        </div>
      </main>
      {openQR && (
        <BankTransferQR
          dataQR={qrPaymant}
          isOpen={openQR}
          onDone={handleDoneQR}
          onCancle={handleCancleBooking}
          mesage={t("cart.please_wait_during_payment")}
        />
      )}
    </div>
  );
}
