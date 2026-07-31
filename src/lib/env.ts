import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),

  APP_URL: z.string().url(),
  TICKET_QR_SECRET: z.string().min(16),

  SUN_CLIENT_ID: z.string().min(1),
  SUN_CLIENT_SECRET: z.string().min(1),
  SEA_PAY_SECRET_KEY: z.string().min(1),
  SEND_MAIL_KEY: z.string().min(1),
  SUN_AUTHEN_URL: z.string().min(1),
  SUN_SCOPE: z.string().min(1),
});

export const env = schema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,

  APP_URL: process.env.APP_URL,
  TICKET_QR_SECRET: process.env.TICKET_QR_SECRET,

  SUN_CLIENT_ID: process.env.SUN_CLIENT_ID,
  SUN_CLIENT_SECRET: process.env.SUN_CLIENT_SECRET,
  SUN_AUTHEN_URL: process.env.SUN_AUTHEN_URL,
  SUN_SCOPE: process.env.SUN_SCOPE,

  SEA_PAY_SECRET_KEY: process.env.SEA_PAY_SECRET_KEY,

  SEND_MAIL_KEY: process.env.SEND_MAIL_KEY,
});

export const profileSchema = z.object({
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
