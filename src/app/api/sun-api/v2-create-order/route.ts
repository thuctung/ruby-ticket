import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";
import { CreateOrderSunGroupPayload } from "@/app-controler/affi/getTicket/type";

export async function POST(req: Request) {
  try {
    const body: CreateOrderSunGroupPayload = await req.json();

    const { data }: any = await sunWorldApi.post(`/v2/order/create`, body);

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
