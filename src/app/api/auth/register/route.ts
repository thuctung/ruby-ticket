import { NextResponse } from "next/server";

import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabase/server";

const schema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(8).max(15),
  email: z.string().trim().email(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9._-]+$/)
    .optional()
    .nullable(),
  address: z.string().trim().min(5),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "INVALID_INPUT", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { fullName, phone, email, username, address, password } = parsed.data;

    // Create user
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (createErr) {
      return NextResponse.json(
        { ok: false, error: "AUTH_CREATE_USER_FAILED", message: createErr.message },
        { status: 400 }
      );
    }
    console.log('user',created)
    const user = created.user;
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "AUTH_CREATE_USER_FAILED", message: "No user returned" },
        { status: 400 }
      );
    }

    // Insert profile (service role bypasses RLS)
    console.log( fullName, phone, email, username, address, password)
    const { error: profileErr } = await supabaseAdmin.from("profiles").insert({
      user_id: user.id,
      email,
      username: username || null,
      full_name: fullName,
      phone,
      address,
      role: "affiliate",
      status: "pending",
    });

    if (profileErr) {
      return NextResponse.json(
        { ok: false, error: "PROFILE_INSERT_FAILED", message: profileErr.message },
        { status: 500 }
      );
    }

    // Insert affiliate application
    const { error: appErr } = await supabaseAdmin.from("affiliate_applications").insert({
      user_id: user.id,
      full_name: fullName,
      phone,
      email,
      address,
      status: "pending",
    });

    if (appErr) {
      return NextResponse.json(
        { ok: false, error: "APPLICATION_INSERT_FAILED", message: appErr.message },
        { status: 500 }
      );
    }

    // Optionally auto-sign-in client after server-side registration
    // We'll just return ok and let client sign in.
    return NextResponse.json({ ok: true, userId: user.id });
  } catch (e) {
    const err = e as { message?: string };
    return NextResponse.json(
      { ok: false, error: "UNKNOWN", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
