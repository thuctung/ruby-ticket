import CheckoutControlerPage from "@/app-controler/checkout-client";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary" />}>
      <CheckoutControlerPage />
    </Suspense>
  );
}
