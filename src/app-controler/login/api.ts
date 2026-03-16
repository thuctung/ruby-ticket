import { ACC_STATUS } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useProfileStore } from "@/stores/useProfileStore";

type LoginParamType = {
    email: string,
    password: string,
}
 const { setProfile, setErrorMessage, setLoading }: any = useProfileStore.getState();
export const sv_Login = async ({ email, password, }: LoginParamType) => {
    try {
        setLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setErrorMessage(error.message);
            return;
        }
        if (data.user) {
            const {  profile, error: profileError } = await sv_getCurrentProfile(data.user.id)
            if (profileError) {
                setErrorMessage(profileError.message);
                return;
            }
            if (profile.status !== ACC_STATUS.APPROVED) {
                setErrorMessage('Tài khoản chưa được kích hoạt');
                return;
            }
            setProfile(profile)
        }

    } finally {
        setLoading(false);
    }

}

export const sv_getCurrentProfile = async (userId: string): Promise<any> => {
    const supabase = createSupabaseBrowserClient();
    try {
        setLoading(true);
        const { data: profile, error: error } = await supabase
            .from("profiles")
            .select("*",)
            .eq("user_id", userId)
            .single();
        return { profile, error }
    } catch (e) {

    }finally{
        setLoading(false);
        
    }
}
