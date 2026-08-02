import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import axios from "axios";
import { env } from "@/lib/env";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function getValidSunworldToken() {
  const { data } = await supabaseAdmin
    .from(DB_TABLE_NAME.SYSTEM_SETTINGS)
    .select("*")
    .eq("key", "sunworld_token")
    .single();

  const now = Math.floor(Date.now() / 1000); // convert to seconds
  if (!data || !data.value || data.expires_at - now < 60) {
    return await refreshSunworldToken();
  }

  return data.value;
}

export async function refreshSunworldToken() {
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

  if (data) {
    supabaseAdmin.from(DB_TABLE_NAME.SYSTEM_SETTINGS).upsert({
      key: "sunworld_token",
      value: data.access_token,
      expires_at: data.expires_on,
    });
    return data.access_token;
  }
  return null;
}
