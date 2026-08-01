import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";

export async function POST(req: Request) {
  try {
    const body: any = await req.json();

    const { data }: any = await sunWorldApi.post(`/v2/order/create`, body);

    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
