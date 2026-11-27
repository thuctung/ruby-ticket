import { STATUS_COMMON_TYPE } from "@/commons/constant";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useProfileStore } from "@/stores/useProfileStore";

type LoginParamType = {
  email: string;
  password: string;
};
const { setProfile, setErrorMessage, setLoading }: any = useProfileStore.getState();
export const sv_Login = async ({ email, password }: LoginParamType) => {
  try {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage("Tài khoản hoặc mật khẩu không đúng");
      return;
    }
    if (data.user) {
      const { profile, error: profileError } = await sv_getCurrentProfile(data.user.id);
      if (profileError) {
        setErrorMessage("profileError.message");
        return;
      }
      if (profile.status !== STATUS_COMMON_TYPE.APPROVED) {
        setErrorMessage("Tài khoản chưa được kích hoạt");
        return;
      }
      setProfile(profile);
      return profile;
    }
    return;
  } finally {
    setLoading(false);
  }
};

export const sv_getCurrentProfile = async (userId: string): Promise<any> => {
  const supabase = createSupabaseBrowserClient();
  try {
    setLoading(true);
    const { data: profile, error: error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (profile) {
      setProfile(profile);
    }
    return { profile, error };
  } catch (e) {
  } finally {
    setLoading(false);
  }
};
