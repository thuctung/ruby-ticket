import { supabaseAdmin } from "@/lib/supabase/server";
import {
  AGENT,
  DB_TABLE_NAME,
  END_DATE_GMT7,
  LIMIT_TABLE,
  START_DATE_GMT7,
} from "@/commons/constant";
import { SearchTicketSalePayload } from "@/types";

export async function POST(req: Request) {
  const body: SearchTicketSalePayload = await req.json();
  const { currentPage, user_id, from, to, status, siteCode } = body;

  const fromIdx = (currentPage - 1) * LIMIT_TABLE;
  const toIdx = fromIdx + LIMIT_TABLE - 1;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.ORDERS)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(fromIdx, toIdx);

  query = query.eq("payment_method", AGENT);

  if (user_id) {
    query = query.eq("user_id", user_id);
  }
  if (siteCode) {
    query = query.eq("site_code", siteCode);
  }

  if (status) {
    query = query.eq("status", status);
  }
  if (from) {
    query = query.gte("created_at", `${from}${START_DATE_GMT7}`);
  }

  if (to) {
    query = query.lte("created_at", `${to}${END_DATE_GMT7}`);
  }

  const { data, count, error } = await query;

  return Response.json({
    data,
    totalPages: Math.ceil((count || 0) / LIMIT_TABLE),
    currentPage,
  });
}
