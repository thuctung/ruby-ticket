import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const { orderCode } = body;
    const { data }: any = await sunWorldApi.get("/ota/order/get", {
      params: {
        lang: "vi",
        orderCode,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
