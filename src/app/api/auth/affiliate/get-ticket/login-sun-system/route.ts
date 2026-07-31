import { env } from "@/lib/env";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const params = new URLSearchParams();

    params.append("client_id", env.SUN_CLIENT_ID);
    params.append("client_secret", env.SUN_CLIENT_SECRET);
    params.append("grant_type", "client_credentials");
    params.append("scope", env.SUN_SCOPE);

    const { data } = await axios.post(env.SUN_AUTHEN_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch token" }, { status: 500 });
  }
}
