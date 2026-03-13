import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

// Service-role client (server-only). Never import this in client components.
export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);
