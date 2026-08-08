import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";

export async function POST(req: Request) {
  try {
    const body: any = await req.json();
    const { siteCodes, date } = body;
    const { data }: any = await sunWorldApi.get(`/ota/product/listing`, {
      params: {
        lang: "vi",
        siteCodes,
        date,
        page: 1,
        per_page: 100,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
