import ProcessPaymentMomo from "@/app-controler/process-payment-momo";
import { get } from "lodash";
import { redirect } from "next/navigation";

export default async function PaymentResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ lng: string }>;
  searchParams: Promise<any>;
}) {
  const { lng } = await params;
  const sp = await searchParams;
  console.log("sp", sp);

  const payment = get(sp, "payment", "");
  const orderCode = get(sp, "vpc_OrderInfo", "");
  const amount = get(sp, "vpc_Amount", 0);

  const isSuccess = payment === "success";

  if (!isSuccess) {
    redirect(`/${lng}/order-failed?reason=${sp.resultCode}`);
  }
  return <ProcessPaymentMomo orderCode={orderCode} amount={Number(amount)} />;
}
