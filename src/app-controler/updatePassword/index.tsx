"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Footer from "@/components/site/Footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import Header from "@/components/site/Header";

export default function UpdatePassword() {
  const [confirmPass, setConfirmPass] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const supabaseClient = createSupabaseBrowserClient();

  const handleSubmit = async () => {
    if (password !== confirmPass) {
      setErrorMsg("Passwords do not match");
    } else {
      setLoading(true);
      initSession();
      const { error } = await supabaseClient.auth.updateUser({
        password,
      });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message);
      } else {
        alert("Password updated successfully");
        window.location.href = "/login";
      }
    }
  };

  const initSession = async () => {
    const hash = window.location.hash;

    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) return;

    await supabaseClient.auth.setSession({
      access_token,
      refresh_token,
    });
  };

  useEffect(() => {
    initSession();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-white text-foreground">
      <Header />
      <main className="flex flex-1 items-start justify-center px-4 pt-32">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
            <h1 className="mb-6 text-xl font-bold text-gray-900">Cập nhật mật khẩu</h1>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-900">
                Mật khẩu mới
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Nhập lại mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                autoComplete="new-password"
                required
              />
            </div>

            {errorMsg && <p className="text-sm font-medium text-red-600">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </main>
  );
}
