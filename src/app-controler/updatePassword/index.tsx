"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useTranslation } from "@/lib/i18n/client";

/* ---------- Icons ---------- */
const Icon = ({ d, className = "h-5 w-5" }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const ICONS = {
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeOff:
    "M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert:
    "M12 8v4m0 4h.01M10.3 3.9L2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
};

/* ---------- Password field ---------- */
function PasswordField({
  id,
  label,
  value,
  onChange,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-400">
          <Icon d={ICONS.lock} className="h-[18px] w-[18px]" />
        </span>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="new-password"
          required
          aria-invalid={invalid}
          className={`w-full rounded-xl border bg-gray-50/60 py-3 pl-11 pr-11 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
            invalid
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-gray-200 focus:border-[#9b111e] focus:ring-[#9b111e]/10"
          }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-2 my-auto flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          tabIndex={-1}
        >
          <Icon d={show ? ICONS.eyeOff : ICONS.eye} className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Main ---------- */
export default function UpdatePassword() {
  const router = useRouter();
  const supabaseClient = useMemo(() => createSupabaseBrowserClient(), []);
  const { lng } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const initSession = async () => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    if (!access_token || !refresh_token) return;

    await supabaseClient.auth.setSession({ access_token, refresh_token });
  };

  useEffect(() => {
    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Yêu cầu mật khẩu */
  const rules = [
    { label: "Ít nhất 8 ký tự", ok: password.length >= 8 },
    { label: "Có chữ hoa và chữ thường", ok: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "Có ít nhất 1 chữ số", ok: /\d/.test(password) },
    { label: "Có ký tự đặc biệt", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = rules.filter((r) => r.ok).length;
  const strength = [
    { text: "", bar: "bg-gray-200", color: "text-gray-400" },
    { text: "Yếu", bar: "bg-rose-400", color: "text-rose-500" },
    { text: "Trung bình", bar: "bg-amber-400", color: "text-amber-600" },
    { text: "Khá", bar: "bg-lime-500", color: "text-lime-600" },
    { text: "Mạnh", bar: "bg-emerald-500", color: "text-emerald-600" },
  ][password ? score || 1 : 0];

  const mismatch = confirmPass.length > 0 && password !== confirmPass;
  const canSubmit = password.length >= 8 && password === confirmPass && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPass) {
      setErrorMsg("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    await initSession();
    const { error } = await supabaseClient.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-28">
      {/* Nền trang trí: gradient thuần, không blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(600px circle at 10% 10%, rgba(155,17,30,0.10), transparent 60%), radial-gradient(700px circle at 90% 100%, rgba(253,164,175,0.28), transparent 60%), linear-gradient(135deg, #fff1f2, #ffffff 50%, #ffe4e6)",
        }}
      />
      {/* Nền trang trí */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-rose-50 via-white to-rose-100/60" />
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-[#9b111e]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />

      <div className="w-full max-w-[440px]">
        <div className="rounded-3xl border border-white bg-white/90 p-8 shadow-xl shadow-rose-900/10 ring-1 ring-rose-100 backdrop-blur sm:p-10">
          {done ? (
            /* ---------- Thành công ---------- */
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                <Icon d={ICONS.check} className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Đổi mật khẩu thành công</h1>
              <p className="mt-2 text-sm text-gray-500">Đang chuyển bạn về trang đăng nhập...</p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-6 rounded-xl bg-[#9b111e] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7f0e18]"
              >
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            /* ---------- Form ---------- */
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c8102e] to-[#7f0e18] text-white shadow-lg shadow-[#9b111e]/30">
                  <Icon d={ICONS.lock} className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Cập nhật mật khẩu
                </h1>
                <p className="mt-1.5 text-sm text-gray-500">
                  Tạo mật khẩu mới để bảo vệ tài khoản của bạn
                </p>
              </div>

              <div className="space-y-5">
                <PasswordField
                  id="password"
                  label="Mật khẩu mới"
                  value={password}
                  onChange={setPassword}
                />

                {/* Độ mạnh + checklist */}
                {password && (
                  <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-1 gap-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i <= score ? strength.bar : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`w-20 text-right text-xs font-semibold ${strength.color}`}>
                        {strength.text}
                      </span>
                    </div>

                    <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {rules.map((r) => (
                        <li
                          key={r.label}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${
                            r.ok ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full ${
                              r.ok ? "bg-emerald-100" : "bg-gray-200"
                            }`}
                          >
                            {r.ok && <Icon d={ICONS.check} className="h-3 w-3" />}
                          </span>
                          {r.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <PasswordField
                    id="confirmPassword"
                    label="Nhập lại mật khẩu"
                    value={confirmPass}
                    onChange={setConfirmPass}
                    invalid={mismatch}
                  />
                  {mismatch && (
                    <p className="mt-1.5 text-xs font-medium text-rose-600">
                      Mật khẩu nhập lại chưa khớp
                    </p>
                  )}
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  >
                    <Icon d={ICONS.alert} className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#b3122a] to-[#8a0f1c] py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#9b111e]/25 transition hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#9b111e]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  {loading && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeOpacity=".3"
                        strokeWidth="3"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          )}
        </div>

        {!done && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Nhớ mật khẩu rồi?{" "}
            <a href="/login" className="font-semibold text-[#9b111e] hover:underline">
              Quay lại đăng nhập
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
