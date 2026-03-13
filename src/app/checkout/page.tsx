import CheckoutPageClient from "@/app/checkout/CheckoutPageClient";
import { productKeySchema } from "@/lib/products";

export default async function CheckoutPage({
  searchParams,
}: {
  // Next 16+ may pass searchParams as a Promise (sync-dynamic-apis)
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const raw = sp?.product;
  const product = Array.isArray(raw) ? raw[0] : raw;
  const parsed = productKeySchema.safeParse(product ?? "bana");
  const productKey = parsed.success ? parsed.data : "bana";

  return <CheckoutPageClient productKey={productKey} />;
}
