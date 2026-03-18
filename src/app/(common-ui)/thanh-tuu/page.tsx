import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BadgeCheck,
  ChevronRight,
  Handshake,
  Mountain,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Thành tựu | Ruby Travel",
  description:
    "Ruby Travel tự hào nằm trong Top 20 doanh số Bà Nà toàn quốc và là đại lý uy tín của Vinpearl. Đặt vé nhanh, nhận QR tức thì.",
};

const achievements = [
  {
    title: "Top 20 doanh số Bà Nà toàn quốc",
    desc: "Hiệu suất bán hàng ổn định, quy trình xuất vé nhanh và tỉ lệ phản hồi hỗ trợ cao.",
    icon: Mountain,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  {
    title: "Đại lý uy tín của Vinpearl",
    desc: "Nguồn vé rõ ràng, đối soát minh bạch, hỗ trợ đại lý nhanh chóng khi phát sinh.",
    icon: BadgeCheck,
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  {
    title: "Xuất vé QR tức thì",
    desc: "Mua xong nhận QR ngay, tiện lợi cho khách lẻ và tối ưu thao tác cho cộng tác viên.",
    icon: Sparkles,
    color: "text-emerald-700",
    bg: "bg-emerald-100",
  },
  {
    title: "Đồng hành cùng cộng tác viên",
    desc: "Chính sách rõ ràng, công cụ quản lý thuận tiện, hỗ trợ onboarding nhanh.",
    icon: Handshake,
    color: "text-violet-700",
    bg: "bg-violet-100",
  },
] as const;

const reasons = [
  {
    title: "Giá tốt – nguồn vé uy tín",
    desc: "Giá cạnh tranh theo từng đối tượng, nguồn vé minh bạch.",
    icon: Award,
  },
  {
    title: "Thao tác đơn giản",
    desc: "Chọn điểm đến, chọn ngày, nhập số lượng và nhận QR ngay.",
    icon: TrendingUp,
  },
  {
    title: "Hỗ trợ nhanh",
    desc: "Đội ngũ hỗ trợ phản hồi nhanh, hướng dẫn rõ ràng.",
    icon: ShieldCheck,
  },
  {
    title: "Cơ hội kiếm thêm thu nhập",
    desc: "Trở thành cộng tác viên/đại lý để nhận chính sách hấp dẫn.",
    icon: Users,
  },
] as const;

export default function ThanhTuuPage() {
  return (
    <main className="min-h-screen bg-background text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 to-background">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/70 via-violet-200/60 to-pink-200/60 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-emerald-200/60 via-cyan-200/50 to-blue-200/60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <Badge className="bg-white/80 text-slate-700 hover:bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm">
                Ruby Travel • Đà Nẵng
              </Badge>

              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                Thành tựu tạo niềm tin,
                <span className="block bg-gradient-to-r from-blue-700 via-violet-700 to-pink-700 bg-clip-text text-transparent">
                  trải nghiệm tạo khác biệt
                </span>
              </h1>

              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                Ruby Travel tự hào nằm trong <span className="font-bold text-slate-900">Top 20 doanh số Bà Nà toàn quốc</span>{" "}
                và là <span className="font-bold text-slate-900">đại lý uy tín của Vinpearl</span>. Chúng tôi tối ưu quy trình để
                khách hàng đặt vé nhanh, nhận QR tức thì; cộng tác viên bán dễ, quản lý gọn.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 shadow-lg shadow-blue-200"
                  asChild
                >
                  <Link href="/checkout" className="inline-flex items-center gap-2">
                    Đặt vé ngay
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-900 px-6 shadow-sm"
                  asChild
                >
                  <Link href="/register" className="inline-flex items-center gap-2">
                    Trở thành cộng tác viên
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2.5rem] border border-slate-200 bg-white/80 p-6 shadow-2xl shadow-slate-200">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-2xl bg-white p-2 shadow-sm">
                    <Image src="/logo1.png" alt="Ruby Travel" fill className="object-contain" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">Ruby Travel</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Uy tín • Nhanh • Rõ ràng
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {achievements.slice(0, 4).map((x) => (
                    <div key={x.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${x.bg} ${x.color}`}>
                        <x.icon className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-extrabold text-slate-900">{x.title}</div>
                      <div className="mt-1 text-xs text-slate-600 leading-relaxed">{x.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {reasons.map((x) => (
              <Card key={x.title} className="rounded-3xl border-slate-200 bg-white shadow-md hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <x.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base font-extrabold">{x.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 leading-relaxed">{x.desc}</CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-[2.5rem] border border-slate-200 bg-gradient-to-r from-blue-50 via-violet-50 to-pink-50 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="text-2xl font-extrabold text-slate-900">
                  Sẵn sàng trải nghiệm?{" "}
                  <ChevronRight className="inline-block h-5 w-5 align-[-2px] text-blue-600 mx-1" />
                  đặt vé
                </div>
                <div className="text-sm text-slate-600">
                  Chọn điểm đến, chọn ngày và nhận QR tức thì. Hoặc đăng ký làm cộng tác viên để bắt đầu kiếm thêm thu nhập.
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 px-6 shadow-lg shadow-blue-200"
                  asChild
                >
                  <Link href="/checkout" className="inline-flex items-center gap-2">
                    Mua vé ngay
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50 px-6 shadow-sm"
                  asChild
                >
                  <Link href="/register" className="inline-flex items-center gap-2">
                    Đăng ký đại lý
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

