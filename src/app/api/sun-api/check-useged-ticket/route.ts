import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";
import { CheckStatusTicketType } from "@/app-controler/admin/sun-world-booking/type";

export async function POST(req: Request) {
  try {
    const payload: CheckStatusTicketType = await req.json();
    const { data }: any = await sunWorldApi.post("/ota/ticket/usage-status", payload);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
