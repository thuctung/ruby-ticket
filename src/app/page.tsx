const features = [
  {
    title: "Mua vé nhanh trong 1 phút",
    desc: "Chọn ngày đi, chọn loại vé, nhập email + SĐT, thanh toán VNPAY là xong.",
  },
  {
    title: "Nhận mã vé QR qua email",
    desc: "Sau khi thanh toán thành công, hệ thống phát hành vé và gửi QR tự động.",
  },
  {
    title: "Đại lý (Agent) nạp ví trước",
    desc: "Agent được admin duyệt, nạp tiền ví để xuất vé nhanh cho khách.",
  },
  {
    title: "Giá linh hoạt theo sự kiện",
    desc: "Admin cập nhật giá chính/khuyến mãi, hỗ trợ checkbox “người miền Trung”.",
  },
];

const sampleTickets = [
  {
    name: "Combo Vé",
    badge: "Phổ biến",
    items: ["Người lớn", "Người già", "Trẻ em"],
  },
  {
    name: "Vé Cáp",
    badge: "Tiện lợi",
    items: ["Người lớn", "Người già", "Trẻ em"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top bar */}
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600" />
            <div className="leading-tight">
              <div className="font-semibold">Travel Tickets</div>
              <div className="text-xs text-gray-500">MVP bán vé du lịch</div>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
            <a className="hover:text-gray-900" href="#tickets">
              Vé
            </a>
            <a className="hover:text-gray-900" href="#how">
              Cách hoạt động
            </a>
            <a className="hover:text-gray-900" href="#agent">
              Đại lý
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#tickets"
              className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Xem vé
            </a>
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Mua ngay
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-160px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200 via-violet-200 to-pink-200 blur-3xl opacity-70" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              MVP đang build — thanh toán VNPAY trước
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Bán vé du lịch online —
              <span className="block bg-gradient-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent">
                nhanh, gọn, có QR
              </span>
            </h1>
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              Khách lẻ không cần đăng nhập. Chỉ cần chọn ngày đi, chọn loại vé,
              nhập email + SĐT và thanh toán. Vé QR sẽ được gửi tự động qua email.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#tickets"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Xem loại vé
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-lg border px-5 py-3 text-sm font-medium hover:bg-gray-50"
              >
                Cách hoạt động
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
              <div className="rounded-xl border bg-white p-4">
                <div className="font-semibold">Giá linh hoạt</div>
                <div className="text-gray-600">Giá chính/khuyến mãi + miền Trung</div>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <div className="font-semibold">Agent wallet</div>
                <div className="text-gray-600">Nạp ví trước, xuất vé nhanh</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Demo checkout (mock)</div>
                  <div className="text-xs text-gray-500">UI preview</div>
                </div>
                <div className="rounded-full border px-2 py-1 text-xs text-gray-600">
                  VNPAY
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-3">
                    <div className="text-xs text-gray-500">Ngày đi</div>
                    <div className="mt-1 text-sm font-medium">Chọn ngày</div>
                  </div>
                  <div className="rounded-xl border p-3">
                    <div className="text-xs text-gray-500">Loại vé</div>
                    <div className="mt-1 text-sm font-medium">Combo / Vé cáp</div>
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Số lượng</div>
                  <div className="mt-1 text-sm text-gray-700">
                    Người lớn • Người già • Trẻ em
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-3">
                  <div className="text-sm">
                    <div className="font-medium">Checkbox</div>
                    <div className="text-xs text-gray-500">Người miền Trung</div>
                  </div>
                  <div className="h-6 w-10 rounded-full bg-gray-200 p-1">
                    <div className="h-4 w-4 rounded-full bg-white shadow" />
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-xs text-gray-500">Liên hệ</div>
                  <div className="mt-1 text-sm text-gray-700">Email + SĐT</div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">1.200.000đ</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Khuyến mãi</span>
                    <span className="font-medium">-100.000đ</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
                    <span className="font-semibold">Tổng</span>
                    <span className="font-semibold">1.100.000đ</span>
                  </div>
                </div>

                <button className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800">
                  Thanh toán VNPAY
                </button>

                <div className="text-center text-xs text-gray-500">
                  Sau khi thanh toán: phát hành vé + gửi QR qua email
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">Cách hệ thống hoạt động</h2>
              <p className="mt-2 text-sm text-gray-600">
                Thiết kế để ship MVP nhanh, sau này mở rộng connect đối tác.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border p-6">
                <div className="text-base font-semibold">{f.title}</div>
                <div className="mt-2 text-sm text-gray-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticket types */}
      <section id="tickets" className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Loại vé</h2>
            <p className="text-sm text-gray-600">
              Demo UI. Dữ liệu thật sẽ lấy từ Supabase.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {sampleTickets.map((t) => (
              <div key={t.name} className="rounded-2xl border bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{t.name}</div>
                  <div className="rounded-full bg-gray-900 px-3 py-1 text-xs text-white">
                    {t.badge}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  {t.items.map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      {i}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm">
                    <div className="text-gray-500">Giá từ</div>
                    <div className="font-semibold">xxx.xxxđ</div>
                  </div>
                  <a
                    href="#cta"
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Chọn vé
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent */}
      <section id="agent" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-2xl border bg-gradient-to-br from-white to-gray-50 p-8">
            <h2 className="text-2xl font-semibold">Dành cho đại lý (Agent)</h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Agent đăng ký tài khoản → gửi yêu cầu làm agent → admin duyệt → nạp ví
              trước → xuất vé cho khách nhanh, hệ thống tự gửi QR qua email.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row" id="cta">
              <button className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800">
                Đăng ký Agent (sắp có)
              </button>
              <button className="rounded-lg border px-5 py-3 text-sm font-medium hover:bg-gray-50">
                Liên hệ hợp tác
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-gray-600">
          <div>© {new Date().getFullYear()} Travel Tickets</div>
          <div className="text-xs">Powered by Next.js • Supabase • VNPAY • Resend</div>
        </div>
      </footer>
    </main>
  );
}
