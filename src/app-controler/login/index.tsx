"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { STATUS_COMMON_TYPE, ROLES } from "@/commons/constant";
import { ProfileStoteType, useProfileStore } from "@/stores/useProfileStore";
import ForgotPassword from "@/components/site/ForgotPassword";
import { sv_Login } from "./api";
import Link from "next/link";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openForgotPass, setOpenForgotpass] = useState(false);
  const { setErrorMessage }: any = useProfileStore.getState();
  const [loading, setLoading] = useState(false);

  const { errorMessage, isLogin }: ProfileStoteType = useProfileStore((state: any) => state);

  const signIn = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập thông tin");
      return;
    }
    if (isLogin) return;
    setLoading(true);
    const user: any = await sv_Login({
      email,
      password,
    });
    if (user) {
      if (user.role === ROLES.ADMIN) {
        router.push("/admin");
      } else if (user.status === STATUS_COMMON_TYPE.APPROVED) {
        router.push("/affiliate");
      }
    } else {
      setLoading(false);
    }
  };

  const closeDialog = (value: boolean) => {
    setOpenForgotpass(value);
  };
  useEffect(() => {
    setErrorMessage("");
  }, [email, password]);

  return (
    <main className="min-h-screen bg-white text-[#2B0A12] lg:grid lg:grid-cols-2">
      {/* ===== Trái: panel thương hiệu ===== */}
      <section className="relative overflow-hidden bg-[#5C0A1B] px-6 py-10 text-white sm:px-10 lg:flex lg:min-h-screen lg:flex-col lg:justify-between lg:p-14">
        <GemFacets className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 text-[#9B1030] lg:h-[420px] lg:w-[420px]" />

        <div className="relative flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-white p-2">
            <Image src="/logo.png" alt="Ruby Travel" fill className="object-contain p-1" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Ruby Travel</span>
        </div>

        <div className="relative mt-8 lg:mt-0">
          <span className="block h-1 w-12 rounded-full bg-[#F3DDB0]" aria-hidden="true" />
          <p className="mt-5 max-w-sm text-2xl font-semibold leading-snug sm:text-3xl lg:text-4xl">
            Chào mừng bạn quay lại!
          </p>
        </div>
      </section>

      {/* ===== Phải: biểu mẫu đăng nhập ===== */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:py-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Chào mừng trở lại</h1>
            <p className="text-[#7A4753]">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form className="space-y-6" onSubmit={signIn}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="email@domain.com"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-[#9B1030]/70 transition-colors hover:text-[#9B1030] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#9B1030]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

            <div className="space-y-3">
              <button
                disabled={isLogin || loading}
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#9B1030] text-sm font-semibold text-white transition-colors hover:bg-[#7E0C27] active:bg-[#5C0A1B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2Icon size={16} className="animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>

              <Link
                href="/dang-ky-dai-ly"
                className="block w-full rounded-full border border-[#9B1030]/40 py-3 text-center text-sm font-semibold text-[#9B1030] transition-colors hover:border-[#9B1030] hover:bg-[#F7DDE3]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030]"
              >
                Đăng ký làm Affiliate
              </Link>
            </div>
          </form>

          <div className="flex items-center justify-between border-t border-dashed border-[#F0CBD3] pt-5 text-sm">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="font-semibold text-[#9B1030] underline-offset-4 hover:text-[#7E0C27] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030]"
            >
              Trang chủ
            </button>
            <button
              type="button"
              onClick={() => closeDialog(true)}
              className="font-medium text-[#7A4753] underline-offset-4 hover:text-[#2B0A12] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9B1030]"
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>
      </section>

      {openForgotPass && <ForgotPassword openForgotPass={openForgotPass} setOpen={closeDialog} />}
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#F0CBD3] bg-[#FDF4F6] px-4 py-3.5 text-[#2B0A12] placeholder:text-[#B58A95] outline-none transition focus:border-[#9B1030] focus:bg-white focus:ring-2 focus:ring-[#9B1030]/25";

function GemFacets({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M60 20h80l40 50-80 110L20 70z" opacity="0.55" />
      <path d="M60 20 100 70 140 20z" opacity="0.5" />
      <path d="M20 70h160L100 180z" opacity="0.35" />
    </svg>
  );
}
