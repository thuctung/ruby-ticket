import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";

export async function GET(req: Request) {
  try {
    const { data }: any = await sunWorldApi.get("/ota/account/balance");
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
