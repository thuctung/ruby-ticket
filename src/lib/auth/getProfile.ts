import { createSupabaseServerClient } from "@/lib/supabase/server-ssr";

export type Profile = {
  user_id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: "customer" | "affiliate" | "admin";
  status: "pending" | "approved" | "suspended";
};

export async function getCurrentProfile() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null as const, profile: null as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "user_id,email,username,full_name,phone,address,role,status"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  return { user, profile: (profile as Profile | null) ?? null };
}
