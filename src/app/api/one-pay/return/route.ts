import { NextRequest, NextResponse } from "next/server";

import { getOnePayParams } from "@/lib/onepay";
import { processOnePayResult } from "@/lib/onepay-callback";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const params = getOnePayParams(request.nextUrl.searchParams);

  const result = await processOnePayResult(params);

  const resultUrl = new URL(process.env.ONEPAY_RESULT_URL!);

  if (result.order_code) {
    resultUrl.searchParams.set("order_code", result.order_code);
  }

  resultUrl.searchParams.set("payment", result.success ? "success" : "failed");

  if (result.response_code) {
    resultUrl.searchParams.set("response_code", result.response_code);
  }

  console.log("resultUrl", resultUrl);

  return NextResponse.redirect(resultUrl);
}
