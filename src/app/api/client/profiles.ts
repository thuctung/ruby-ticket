import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const sv_getCurrentProfile = async (userId: string): Promise<any> => {
    const supabase = createSupabaseBrowserClient();
    try {
        const { data: profile, error: error } = await supabase
            .from("profiles")
            .select("*",)
            .eq("user_id", userId)
            .single();
        return { profile, error }
    } catch (e) {
    }
}

