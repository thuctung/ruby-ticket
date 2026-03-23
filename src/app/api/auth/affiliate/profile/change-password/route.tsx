import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export async function POST(req: Request) {
  const body: any = await req.json();
  const { password, oldPassword, email } = body;
  const supabase = createSupabaseBrowserClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: oldPassword,
  });

  if (signInError) {
    return Response.json({ error: "Mật khẩu cũ không đúng!" });
  }

  const { data, error: updateError } = await supabase.auth.updateUser({ password });

  if (updateError) {
    return Response.json({ error: "Không thể cập nhật mật khẩu" });
  }
  return Response.json({ data });
}
