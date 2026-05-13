"use client";

import { useState } from "react";
import { z } from "zod";

import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { REGISTER_AFFILIATE } from "@/commons/apiURL";

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Vui lòng nhập họ và tên"),
    phone: z
      .string()
      .trim()
      .min(8, "SĐT quá ngắn")
      .max(15, "SĐT quá dài")
      .regex(/^[0-9+ ]+$/, "SĐT chỉ nên gồm số, dấu + và khoảng trắng"),
    email: z.string().trim().email("Email không hợp lệ"),
    username: z
      .string()
      .trim()
      .min(3, "Username tối thiểu 3 ký tự")
      .max(30, "Username tối đa 30 ký tự")
      .regex(/^[a-zA-Z0-9._-]+$/, "Username chỉ gồm chữ/số và . _ -")
      .optional()
      .or(z.literal("")),
    address: z.string().trim().min(5, "Vui lòng nhập địa chỉ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    passwordConfirm: z.string().min(8, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["passwordConfirm"],
  });

type Values = z.infer<typeof schema>;

export default function RegisterPage() {
  const [values, setValues] = useState<Values>({
    fullName: "",
    phone: "",
    email: "",
    username: "",
    address: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof Values>(key: K, val: Values[K]) =>
    setValues((p) => ({ ...p, [key]: val }));

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const parsed = schema.safeParse(values);
      if (!parsed.success) {
        const map: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const k = issue.path[0] ? String(issue.path[0]) : "form";
          if (!map[k]) map[k] = issue.message;
        }
        setErrors(map);
        return;
      }

      setErrors({});

      const res = await fetch(REGISTER_AFFILIATE, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          email: parsed.data.email,
          username: parsed.data.username?.trim() ? parsed.data.username.trim() : null,
          address: parsed.data.address,
          password: parsed.data.password,
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok || !json.ok) {
        setError(json.message ?? "Đăng ký thất bại");
        return;
      }

      // Let the user login after registration.
      alert("Đã đăng ký. Vui lòng đăng nhập và đợi admin duyệt.");
      setValues({
        fullName: "",
        phone: "",
        email: "",
        username: "",
        address: "",
        password: "",
        passwordConfirm: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <div className="mx-auto w-full max-w-2xl flex-1 p-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Đăng ký cộng tác viên (Affiliate)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-gray-900">Đăng ký cộng tác viên</h1>
              <p className="text-sm text-gray-400 mt-1">
                Sau khi gửi, tài khoản sẽ ở trạng thái{" "}
                <span className="font-semibold text-gray-600">pending</span> và chờ admin duyệt.
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <input
                  type="text"
                  name="fullName"
                  value={values.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[#f0f4fb] rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <input
                  type="tel"
                  id="phone"
                  value={values.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="09xxxxxxxx"
                  className="w-full bg-[#f0f4fb] rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full bg-[#f0f4fb] rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="username">Username (tuỳ chọn)</Label>
                <input
                  type="text"
                  name="username"
                  value={values.username ?? ""}
                  onChange={(e) => setField("username", e.target.value)}
                  placeholder="vd: tung.nguyen"
                  className="w-full bg-[#f0f4fb] rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <input
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  className="w-full bg-[#f0f4fb] rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <input
                  id="password"
                  type="password"
                  value={values.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f0f4fb] rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Nhập lại mật khẩu</Label>
                <input
                  id="passwordConfirm"
                  type="password"
                  value={values.passwordConfirm}
                  onChange={(e) => setField("passwordConfirm", e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f0f4fb] rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
                {errors.passwordConfirm && (
                  <p className="text-sm text-destructive">{errors.passwordConfirm}</p>
                )}
              </div>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting}
              onClick={submit}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-xl py-3 mt-2 transition-colors duration-150 shadow-md shadow-blue-200"
            >
              {submitting ? "Đang gửi..." : "Gửi đăng ký"}
            </button>

            {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
