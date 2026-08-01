import { NextResponse } from "next/server";
import sunWorldApi from "@/axios/sunworldApi";

export async function GET(request: Request) {
  const { data }: any = await sunWorldApi.get(`/ota/site/listing`, {
    params: {
      lang: "vi",
    },
  });

  return NextResponse.json(data, { status: 200 });
}
