"use client";
import { Metadata } from "next";

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
      .regex(/^[0-9+ ]+$/, "SĐT chỉ nên gồm số"),
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
    <main className="bg-[#FDF4F6] text-[#2B0A12]">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-10">
          {/* ===== Trái: giới thiệu, đứng yên khi cuộn form ===== */}
          <aside className="relative overflow-hidden rounded-3xl bg-[#5C0A1B] p-7 text-white sm:p-9 lg:sticky lg:top-8">
            <GemFacets className="pointer-events-none absolute -bottom-16 -right-14 h-64 w-64 text-[#9B1030]" />
            <div className="relative">
              <span className="block h-1 w-12 rounded-full bg-[#F3DDB0]" aria-hidden="true" />
              <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight">
                Đăng ký cộng tác viên
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/75">
                Trở thành cộng tác viên của Ruby Travel để nhận chính sách ưu đãi hấp dẫn, xuất vé
                QR tức thì và quản lý đơn hàng gọn gàng.
              </p>
            </div>
          </aside>

          {/* ===== Phải: biểu mẫu ===== */}
          <section className="rounded-3xl border border-[#F0CBD3] bg-white p-6 sm:p-9">
            <fieldset className="space-y-4">
              <legend className="mb-1 text-lg font-semibold">Thông tin liên hệ</legend>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  id="fullName"
                  label="Họ và tên"
                  value={values.fullName}
                  onChange={(v) => setField("fullName", v)}
                  placeholder="Nguyễn Văn A"
                  error={errors.fullName}
                  className="md:col-span-2"
                />
                <Field
                  id="phone"
                  type="tel"
                  label="Số điện thoại"
                  value={values.phone}
                  onChange={(v) => setField("phone", v)}
                  placeholder="09xxxxxxxx"
                  error={errors.phone}
                />
                <Field
                  id="email"
                  type="email"
                  label="Email"
                  value={values.email}
                  onChange={(v) => setField("email", v)}
                  placeholder="email@domain.com"
                  error={errors.email}
                />
                <Field
                  id="address"
                  label="Địa chỉ"
                  value={values.address}
                  onChange={(v) => setField("address", v)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                  error={errors.address}
                  className="md:col-span-2"
                />
              </div>
            </fieldset>

            <fieldset className="mt-8 space-y-4 border-t border-dashed border-[#F0CBD3] pt-8">
              <legend className="mb-1 text-lg font-semibold">Tài khoản đăng nhập</legend>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  id="username"
                  label="Username (tuỳ chọn)"
                  value={values.username ?? ""}
                  onChange={(v) => setField("username", v)}
                  placeholder="vd: tung.nguyen"
                  error={errors.username}
                  className="md:col-span-2"
                />
                <Field
                  id="password"
                  type="password"
                  label="Mật khẩu"
                  value={values.password}
                  onChange={(v) => setField("password", v)}
                  placeholder="••••••••"
                  error={errors.password}
                />
                <Field
                  id="passwordConfirm"
                  type="password"
                  label="Nhập lại mật khẩu"
                  value={values.passwordConfirm}
                  onChange={(v) => setField("passwordConfirm", v)}
                  placeholder="••••••••"
                  error={errors.passwordConfirm}
                />
              </div>
            </fieldset>

            {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              onClick={submit}
              className="mt-6 w-full rounded-full bg-[#9B1030] py-3.5 font-semibold text-white transition-colors hover:bg-[#7E0C27] active:bg-[#5C0A1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Đang gửi..." : "Gửi đăng ký"}
            </button>

            {errors.form && <p className="mt-3 text-sm text-destructive">{errors.form}</p>}
          </section>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#F0CBD3] bg-[#FDF4F6] px-4 py-3 text-sm text-[#2B0A12] placeholder:text-[#B58A95] outline-none transition focus:border-[#9B1030] focus:ring-2 focus:ring-[#9B1030]/25 aria-[invalid=true]:border-destructive";

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Hoạ tiết các mặt cắt viên ngọc, trang trí cho panel ruby. */
function GemFacets({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M60 20h80l40 50-80 110L20 70z" opacity="0.55" />
      <path d="M60 20 100 70 140 20z" opacity="0.5" />
      <path d="M20 70h160L100 180z" opacity="0.35" />
    </svg>
  );
}
