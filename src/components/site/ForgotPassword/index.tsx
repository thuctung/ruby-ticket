"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword({
  openForgotPass,
  setOpen,
}: {
  openForgotPass: boolean;
  setOpen: any;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const supabaseClient = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error }: any = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email to reset password.");
    }
    setLoading(false);
  };

  return (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 border border-slate-50 animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Quên mật khẩu?</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Đừng lo lắng, hãy nhập email của bạn và chúng tôi sẽ gửi link khôi phục.
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn..."
              className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500/10 focus:bg-white p-4 rounded-2xl outline-none transition-all font-medium text-slate-700"
            />
            {message ? <p className="text-sm text-destructive  mt-4">{message}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 cursor-pointer"
            >
              Gửi link khôi phục
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-slate-400 hover:text-slate-600 font-bold text-sm py-2 cursor-pointer transition-colors text-end"
            >
              Quay lại đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
