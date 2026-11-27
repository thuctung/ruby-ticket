import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
  const { imageUrl, siteCode, filePath }: any = await request.json();

  if (!filePath) {
    throw new Error("Invalid image URL");
  }

  const { error: storageError } = await supabaseAdmin.storage
    .from(DB_TABLE_NAME.STORAGE_IMAGE)
    .remove([filePath]);

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const { error: dbError } = await supabaseAdmin
    .from(DB_TABLE_NAME.LINK_IMAGE_SITE)
    .delete()
    .eq("site_code", siteCode)
    .eq("url", imageUrl);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ data: true }, { status: 200 });
}
