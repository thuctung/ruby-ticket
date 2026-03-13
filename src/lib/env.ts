import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),

  APP_URL: z.string().url(),
  TICKET_QR_SECRET: z.string().min(16),

  VNPAY_TMN_CODE: z.string().min(1),
  VNPAY_HASH_SECRET: z.string().min(1),
  VNPAY_URL: z.string().url(),
  VNPAY_RETURN_URL: z.string().url(),
  VNPAY_IPN_URL: z.string().url(),
});

export const env = schema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,

  APP_URL: process.env.APP_URL,
  TICKET_QR_SECRET: process.env.TICKET_QR_SECRET,

  VNPAY_TMN_CODE: process.env.VNPAY_TMN_CODE,
  VNPAY_HASH_SECRET: process.env.VNPAY_HASH_SECRET,
  VNPAY_URL: process.env.VNPAY_URL,
  VNPAY_RETURN_URL: process.env.VNPAY_RETURN_URL,
  VNPAY_IPN_URL: process.env.VNPAY_IPN_URL,
});
