import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, CreditCard, QrCode, FileCheck2, UserPlus, ShieldCheck, Wallet } from "lucide-react"

export default function FAQPage() {
  const booking = [
    {
      q: "Tôi đặt vé như thế nào?",
      a: "Vào trang Mua vé, chọn điểm đến, loại vé và ngày sử dụng. Nhập số lượng và thông tin liên hệ, bấm Xuất vé để nhận QR ngay.",
      icon: FileCheck2,
    },
    {
      q: "Tôi nhận vé ở đâu?",
      a: "Sau khi thanh toán thành công, hệ thống gửi mã QR trên màn hình và email. Bạn có thể dùng trực tiếp mã QR để qua cổng.",
      icon: QrCode,
    },
    {
      q: "Tôi có thể thanh toán bằng cách nào?",
      a: "Đại lý thanh toán bằng số dư ví nội bộ. Khách lẻ có thể thanh toán theo hướng dẫn tùy điểm bán (chuyển khoản, ví điện tử...).",
      icon: CreditCard,
    },
    {
      q: "Hủy/đổi vé được không?",
      a: "Chính sách hủy/đổi phụ thuộc điểm đến. Vui lòng liên hệ hỗ trợ trước ngày sử dụng để được hướng dẫn chi tiết.",
      icon: ShieldCheck,
    },
  ]

  const agency = [
    {
      q: "Làm thế nào để trở thành đại lý?",
      a: "Vào mục Đăng ký/Trang Cộng tác viên và gửi thông tin. Bộ phận kinh doanh sẽ duyệt hồ sơ và kích hoạt tài khoản đại lý.",
      icon: UserPlus,
    },
    {
      q: "Cơ chế ví và nạp tiền ra sao?",
      a: "Mỗi đại lý có ví riêng. Bạn nạp tiền qua mục Nạp tiền, sau khi duyệt số dư sẽ tăng và dùng để xuất vé.",
      icon: Wallet,
    },
    {
      q: "Chiết khấu và hạn mức thế nào?",
      a: "Tùy cấp đại lý (Cấp 1, Cấp 2) sẽ có mức giá/chiết khấu khác nhau và có thể được cấp hạn mức theo thỏa thuận hợp đồng.",
      icon: ShieldCheck,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-b from-blue-50/60 to-background py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2 text-blue-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Câu hỏi thường gặp</h1>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="rounded-3xl shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Đặt vé và thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                    <div className="mb-2 flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-blue-600" />
                      <div className="font-semibold">{item.q}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.a}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Trở thành đại lý</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agency.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border p-4 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors">
                    <div className="mb-2 flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-emerald-600" />
                      <div className="font-semibold">{item.q}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.a}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}

