import { ACC_STATUS } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useProfileStore } from "@/stores/useProfileStore";
import { sv_getCurrentProfile } from "./profiles";

type LoginParamType = {
    email: string,
    password: string,
}

export const sv_Login = async ({ email, password, }: LoginParamType) => {
    const { setProfile, setErrorMessage, setLoading }: any = useProfileStore.getState();
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