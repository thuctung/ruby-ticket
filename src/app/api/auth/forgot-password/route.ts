import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
    const {
        email
    } = await request.json();
    console.log(email)
    const{error} :any= supabaseAdmin.auth.resetPasswordForEmail(email, );

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: {} }, { status: 200 });
}