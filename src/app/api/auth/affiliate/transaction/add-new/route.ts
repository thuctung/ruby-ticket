import { NextResponse } from "next/server";


import { supabaseAdmin } from "@/lib/supabase/server";
import { DB_TABLE_NAME } from "@/commons/constant";

export async function POST(request: Request) {
    const {
        user_id,
        amount,
        payment_code
    } = await request.json();
    const { error }: any = await supabaseAdmin.from(DB_TABLE_NAME.WALLET_TRANSACTION)
        .insert({
            user_id,
            amount,
            type: 'add',
            description: payment_code
        })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: {} }, { status: 200 });
}