import z from "zod";

export const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

export const checkoutSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  phone: z
    .string()
    .trim()
    .min(8, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+ ]+$/, "SĐT chỉ nên gồm số, dấu + và khoảng trắng"),
  note: z.string().max(500).optional().or(z.literal("")),
});

export const PROMOTION_TYPE = {
  PERCENT: "percent",
  PRICE: "price",
};

export const PROMOTION_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};
