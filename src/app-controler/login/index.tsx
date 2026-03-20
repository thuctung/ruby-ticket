"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACC_STATUS, ROLES } from "@/commons/constant";
import { ProfileStoteType, useProfileStore } from "@/stores/useProfileStore";
import ForgotPassword from "@/components/site/ForgotPassword";
import { sv_Login } from "./api";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [openForgotPass, setOpenForgotpass] = useState(false);

  const { profile, errorMessage, isLogin }: ProfileStoteType = useProfileStore(
    (state: any) => state
  );

  const handleAfterLogin = () => {
    if (profile.role === ROLES.ADMIN) {
      router.push("/admin");
    } else if (profile.status === ACC_STATUS.APPROVED) {
      router.push("/affiliate");
    }
  };

  useEffect(() => {
    if (profile.role) {
      handleAfterLogin();
    }
  }, [profile]);

  const signIn = async () => {
    sv_Login({
      email,
      password,
    });
  };

  const closeDialog = (value: boolean) => {
    setOpenForgotpass(value);
  };

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-white p-10 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Chào mừng trở lại</h1>
            <p className="text-slate-500 font-medium">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {/* Form Section */}
          <form className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="email@domain.com"
                  className="w-full bg-slate-100/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100/50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
                />
              </div>
            </div>
            {errorMessage ? <p className="text-sm text-destructive  mt-4">{errorMessage}</p> : null}
            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
                disabled={isLogin}
                onClick={signIn}
              >
                {isLogin ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <button
                className="w-full bg-white border border-slate-200 hover:border-blue-200 text-slate-600 font-bold py-4 rounded-2xl transition-all hover:bg-blue-50/50"
                onClick={() => router.push("/register")}
              >
                Đăng ký làm Affiliate
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="flex items-center justify-between px-2 pt-4">
            <a
              className="text-sm cursor-pointer font-bold text-blue-600 hover:text-blue-700 transition-colors"
              onClick={() => router.push("/")}
            >
              Trang chủ
            </a>
            <a
              onClick={() => closeDialog(true)}
              className="cursor-pointer text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>
        </div>
      </div>
      {openForgotPass && <ForgotPassword openForgotPass={openForgotPass} setOpen={closeDialog} />}
    </main>
  );
}
