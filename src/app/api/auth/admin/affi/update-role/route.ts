import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { ROLES } from "@/commons/constant";

export async function POST(request: Request) {
    const
               { data, error } = await supabaseAdmin.auth.admin.updateUserById('9776ca75-ca0e-4942-83d7-b8586c87f60e', {
               app_metadata
                   : { role:ROLES.AFFILIATE }
           })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

   return NextResponse.json({ data:{}}, { status: 200 });
}