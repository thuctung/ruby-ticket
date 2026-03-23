import z from "zod";

export const profilSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(8, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+ ]+$/, "SĐT chỉ nên gồm số, dấu + và khoảng trắng"),
});

export const passwordSchema = z.object({
  old: z.string().trim().min(1, "Mật khẩu không được để trống"),
  newPass: z.string().trim().min(8, "Mật khẩu ít nhất 8 kí tự"),
});
