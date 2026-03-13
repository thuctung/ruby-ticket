import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import axios from "axios";

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


export const sv_AddProfile = async (body: any) => {
    try {
        const res = await axios.post('/api/auth/register', body);
        console.log('res',res)
        return res
    } catch (e) {

    }
    const { fullName, phone, email, username, address, password } = body;

    // const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    //     email,
    //     password,
    //     email_confirm: true,
    //     user_metadata: {
    //         full_name: fullName,
    //     },
    // });

    // if (createErr) {
    //     console.log('created',created);

    // }
    //     console.log('created',created);

}