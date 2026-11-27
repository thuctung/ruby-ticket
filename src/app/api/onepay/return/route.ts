import { NextRequest, NextResponse } from "next/server";

import { getOnePayParams } from "@/lib/onepay";
import { processOnePayResult } from "@/lib/onepay-callback";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const params = getOnePayParams(request.nextUrl.searchParams);
  console.log("params", params);
  const result = await processOnePayResult(params);
  console.log("result", result);

  const resultUrl = new URL(process.env.ONEPAY_RESULT_URL!);

  if (result.order_code) {
    resultUrl.searchParams.set("order_code", result.order_code);
  }

  resultUrl.searchParams.set("payment", result.success ? "success" : "failed");

  if (result.response_code) {
    resultUrl.searchParams.set("response_code", result.response_code);
  }
  if (result.amount !== undefined && result.amount !== null) {
    resultUrl.searchParams.set("amount", String(result.amount));
  }

  return NextResponse.redirect(resultUrl);
}
