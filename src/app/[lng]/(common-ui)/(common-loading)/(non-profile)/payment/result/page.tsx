import { redirect } from "next/navigation";
import { verifyMomoSignature, type MomoParams } from "@/lib/momo";
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

  if (!sp.orderId || !sp.signature || !verifyMomoSignature(sp)) {
    redirect(`/${lng}/order-failed?reason=invalid`);
  }
  if (sp.resultCode !== "0") {
    redirect(`/${lng}/order-failed?reason=${sp.resultCode}`);
  }
  const orderCode = sp.orderId.slice(0, sp.orderId.lastIndexOf("_"));
  return <ProcessPaymentMomo orderCode={orderCode} amount={Number(sp.amount)} />;
}
