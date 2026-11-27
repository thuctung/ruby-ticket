import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const deployHook = process.env.VERCEL_DEPLOY_HOOK || "";

    if (!deployHook) {
      return NextResponse.json({ message: "Lỗi chưa config server" }, { status: 500 });
    }
    const { data } = await axios.post(deployHook);

    return NextResponse.json({
      success: true,
      message: "Hệ thống đang build",
      deployment: data,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Có lỗi xảy ra" }, { status: 500 });
  }
}
