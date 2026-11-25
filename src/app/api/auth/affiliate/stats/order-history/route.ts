import { supabaseAdmin } from "@/lib/supabase/server";
import {
  DB_TABLE_NAME,
  END_DATE_GMT7,
  LIMIT_TABLE,
  ROLES,
  START_DATE_GMT7,
} from "@/commons/constant";

export async function POST(req: Request) {
  const { currentPage, searchValue }: any = await req.json();
  const { email, status, siteCode, from, to } = searchValue;
  const fromIdx = (currentPage - 1) * LIMIT_TABLE;
  const toIdx = fromIdx + LIMIT_TABLE - 1;

  let query = supabaseAdmin
    .from(DB_TABLE_NAME.VIEW_TICKET_SALE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(fromIdx, toIdx);

  query = query.eq("payment_method", ROLES.AFFILIATE);

  if (email) {
    query = query.eq("user_email", email);
  }
  if (siteCode) {
    query = query.eq("site_code", siteCode);
  }
  console.log("status", status);
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
