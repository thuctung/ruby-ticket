import { NextRequest, NextResponse } from "next/server";

import { getOnePayParams } from "@/lib/onepay";
import { processOnePayResult } from "@/lib/onepay-callback";

export const runtime = "nodejs";

async function handleIPN(request: NextRequest, params: Record<string, string>) {
  const result = await processOnePayResult(params);

  if (!result.success && result.error) {
    return new NextResponse("responsecode=0&desc=invalid", { status: 400 });
  }

  return new NextResponse("responsecode=1&desc=confirm-success", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export async function GET(request: NextRequest) {
  const params = getOnePayParams(request.nextUrl.searchParams);

  return handleIPN(request, params);
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  let searchParams: URLSearchParams;

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const body = await request.text();
    searchParams = new URLSearchParams(body);
  } else {
    searchParams = request.nextUrl.searchParams;
  }

  const params = getOnePayParams(searchParams);

  return handleIPN(request, params);
}
