"use client";

import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n/t";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const lang = useLang();

  return (
    <footer className="mt-auto border-t border-slate-900/10 bg-slate-950 text-slate-100">
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600" />
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl bg-white p-2 shadow-sm">
                <Image
                  src="/logo1.png"
                  alt="Ruby Travel"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-extrabold text-white">{t(lang, "brand.name")}</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200">
                  Ruby Travel
                </div>
              </div>
            </Link>

            <div className="text-sm text-slate-300 leading-relaxed">
              Vé du lịch Đà Nẵng, xuất vé nhanh, nhận QR tức thì.
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Hỗ trợ nhanh trong giờ hành chính
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-extrabold text-white">Liên hệ</div>
            <div className="space-y-3 text-sm text-slate-200">
              <a
                href="tel:0705551668"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm hover:border-blue-300/30 hover:bg-white/10 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-rose-500/15 text-rose-300 flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Hotline
                  </div>
                  <div className="font-semibold text-white">0705551668</div>
                </div>
              </a>

              <a
                href="mailto:rubytravel@gmail.com"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm hover:border-blue-300/30 hover:bg-white/10 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-blue-500/15 text-blue-200 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Email
                  </div>
                  <div className="font-semibold text-white">rubytravel@gmail.com</div>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-200 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Địa điểm
                  </div>
                  <div className="font-semibold text-white">
                    72 Hoàng Văn Thái, Hòa Khánh, Đà Nẵng
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-extrabold text-white">Liên kết nhanh</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <a
                href="/checkout"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 shadow-sm hover:border-blue-300/30 hover:bg-white/10 transition-colors"
              >
                Mua vé
              </a>
              <a
                href="/affiliate"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 shadow-sm hover:border-blue-300/30 hover:bg-white/10 transition-colors"
              >
                Affiliate
              </a>
              <a
                href="#experiences"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 shadow-sm hover:border-blue-300/30 hover:bg-white/10 transition-colors"
              >
                Trải nghiệm
              </a>
              <a
                href="/thanh-tuu"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 shadow-sm hover:border-blue-300/30 hover:bg-white/10 transition-colors"
              >
                Thành tựu
              </a>
              <a
                href="/faq"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 shadow-sm hover:border-blue-300/30 hover:bg-white/10 transition-colors"
              >
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
