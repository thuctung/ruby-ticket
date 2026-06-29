"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-6 font-sans">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-400 mb-4 tracking-tight leading-none">
          Error 404
        </h1>
        <p className="text-slate-400 text-base leading-relaxed mb-10">
          URL bạn truy cập không còn ở đây nữa — có thể đã bị xóa, đổi tên, hoặc chưa bao giờ tồn
          tại.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all duration-150 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_28px_rgba(59,130,246,0.6)]"
          >
            ← Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-blue-800/60 hover:border-blue-600/80 text-slate-300 hover:text-white font-semibold text-sm transition-all duration-150 bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-sm"
          >
            Quay lại trang trước
          </button>
        </div>

        {/* Footer hint */}
        <p className="mt-12 text-slate-600 text-xs font-mono">HTTP 404 · Page not found</p>
      </div>
    </main>
  );
}
