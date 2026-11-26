import { redirect } from "next/navigation";
import { type MomoParams } from "@/lib/momo";
import ProcessPaymentMomo from "@/app-controler/process-payment-momo";

export default async function PaymentResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ lng: string }>;
  searchParams: Promise<MomoParams>;
}) {
  const { lng } = await params;
  const sp = await searchParams;

  if (sp.payment !== "success") {
    redirect(`/${lng}/order-failed?reason=${sp.order_code}`);
  }

  const orderCode = sp.order_code || "";
  const amount = sp.amount || "";
  return <ProcessPaymentMomo orderCode={orderCode} amount={Number(amount)} />;
}
