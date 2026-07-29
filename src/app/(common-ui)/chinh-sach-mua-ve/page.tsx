// File: app/chinh-sach-ve/page.tsx
// Next.js (App Router) + Tailwind CSS
// Yêu cầu: Tailwind CSS đã cấu hình trong project (v3.3+ để hỗ trợ arbitrary value cho font-family)

// ---------- Dữ liệu nội dung ----------
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

const refundTiers = [
  {
    window: "Trước 7 ngày",
    percent: "100%",
    note: "Trừ phí dịch vụ & phí thanh toán không hoàn lại",
    stamp: "HOÀN 100%",
    tone: "ink" as const,
  },
  {
    window: "3 – 7 ngày",
    percent: "50%",
    note: "Áp dụng cho vé đã xác nhận qua email",
    stamp: "HOÀN 50%",
    tone: "brass" as const,
  },
  {
    window: "Dưới 72 giờ",
    percent: "0%",
    note: "Trừ trường hợp sự kiện bị hoãn/huỷ bởi ban tổ chức",
    stamp: "KHÔNG HOÀN",
    tone: "stamp" as const,
  },
];

const purchaseSteps = [
  {
    title: "Chọn sự kiện & hạng vé",
    detail:
      "Xem sơ đồ chỗ ngồi, hạng vé và số lượng còn lại theo thời gian thực trước khi thêm vào giỏ hàng.",
  },
  {
    title: "Thanh toán",
    detail:
      "Hỗ trợ thẻ ATM nội địa, Visa/Mastercard, MoMo, ZaloPay và chuyển khoản ngân hàng. Giao dịch được mã hoá theo chuẩn PCI-DSS.",
  },
  {
    title: "Nhận vé điện tử",
    detail:
      "Vé QR được gửi ngay vào email và mục “Vé của tôi” sau khi thanh toán thành công, không cần in.",
  },
  {
    title: "Vào cổng sự kiện",
    detail:
      "Xuất trình mã QR cùng giấy tờ tuỳ thân trùng khớp thông tin đặt vé (áp dụng với vé có định danh).",
  },
];

const nonRefundable = [
  "Vé đã sử dụng hoặc mã QR đã được quét check-in tại sự kiện.",
  "Vé thuộc chương trình khuyến mãi/flash sale có ghi chú “không áp dụng đổi trả”.",
  "Yêu cầu hoàn tiền do nhập sai thông tin cá nhân từ phía người mua.",
  "Vé nghi ngờ mua qua kênh không chính thức hoặc có dấu hiệu gian lận thanh toán.",
];

const faqs = [
  {
    q: "Sự kiện bị hoãn thì vé của tôi xử lý thế nào?",
    a: "Vé giữ nguyên giá trị cho ngày tổ chức mới. Nếu không thể tham dự ngày mới, bạn có thể yêu cầu hoàn 100% giá trị vé trong vòng 14 ngày kể từ thông báo hoãn.",
  },
  {
    q: "Tôi có thể đổi sang hạng vé khác không?",
    a: "Có. Đổi hạng vé được áp dụng đến 48 giờ trước sự kiện, phụ thu phần chênh lệch (nếu có) và phí xử lý 20.000đ/vé, tuỳ theo số lượng chỗ còn trống.",
  },
  {
    q: "Thời gian xử lý hoàn tiền mất bao lâu?",
    a: "7–14 ngày làm việc kể từ khi yêu cầu được duyệt, tiền được hoàn về đúng phương thức thanh toán ban đầu.",
  },
  {
    q: "Vé mua hộ hoặc chuyển nhượng có được hoàn không?",
    a: "Chính sách hoàn/đổi áp dụng cho chủ tài khoản đã mua vé ban đầu, không áp dụng với vé đã chuyển nhượng cho người khác.",
  },
];

// ---------- Component phụ ----------

function StampBadge({ label, tone }: { label: string; tone: "ink" | "brass" | "stamp" }) {
  const toneClasses = {
    ink: "border-[#16213E] text-[#16213E]",
    brass: "border-[#8a6d10] text-[#8a6d10]",
    stamp: "border-[#A63D2F] text-[#A63D2F]",
  }[tone];

  return (
    <div
      className={`inline-flex -rotate-6 select-none items-center justify-center rounded-full border-[3px] px-4 py-2 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest opacity-90 mix-blend-multiply ${toneClasses}`}
      style={{ borderStyle: "double" }}
    >
      {label}
    </div>
  );
}

function PerforationDivider() {
  return (
    <div className="relative my-0 h-0 w-full">
      <div className="absolute left-1/2 top-0 h-6 w-6 -translate-x-[calc(50%+9999px)] rounded-full" />
      <div
        aria-hidden
        className="absolute left-[-14px] top-0 h-7 w-7 -translate-y-1/2 rounded-full bg-[#F6F1E4]"
      />
      <div
        aria-hidden
        className="absolute right-[-14px] top-0 h-7 w-7 -translate-y-1/2 rounded-full bg-[#F6F1E4]"
      />
      <div className="absolute left-3 right-3 top-0 -translate-y-1/2 border-t-2 border-dashed border-[#D8CFB8]" />
    </div>
  );
}

function TicketCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-visible rounded-[6px] border border-[#D8CFB8] bg-[#FBF8F0] shadow-[0_1px_0_rgba(22,33,62,0.04)]">
      <div className="px-6 pt-6 sm:px-10 sm:pt-8">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.25em] text-[#A63D2F]">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold italic text-[#16213E] sm:text-3xl">
          {title}
        </h2>
      </div>
      <div className="mt-6">
        <PerforationDivider />
      </div>
      <div className="px-6 pb-8 pt-6 sm:px-10 sm:pb-10">{children}</div>
    </section>
  );
}

// ---------- Trang chính ----------

export default function TicketPolicyPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen bg-[#EFE9D8] font-[family-name:var(--font-body)] text-[#16213E]`}
    >
      <div className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        {/* HERO — trình bày như mặt trước của một tấm vé lớn */}
        <div className="relative overflow-visible rounded-[8px] border border-[#16213E]/20 bg-[#16213E] px-6 py-10 text-[#F6F1E4] shadow-[0_20px_50px_-20px_rgba(22,33,62,0.5)] sm:px-12 sm:py-14">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="mt-4 max-w-lg font-[family-name:var(--font-display)] text-4xl font-semibold italic leading-tight sm:text-5xl">
                Chính sách mua vé &amp; hoàn trả
              </h1>
            </div>
          </div>

          <div className="mt-10 border-t-2 border-dashed border-[#F6F1E4]/25 pt-6" />

          <div className="flex flex-wrap gap-3">
            <StampBadge label="Hoàn tiền linh hoạt" tone="brass" />
            <StampBadge label="Đổi vé trong 48h" tone="ink" />
            <StampBadge label="Hỗ trợ 24/7" tone="stamp" />
          </div>

          {/* lỗ đục hai bên vé */}
          <div className="pointer-events-none absolute left-0 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EFE9D8]" />
          <div className="pointer-events-none absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#EFE9D8]" />
        </div>

        {/* MUA VÉ */}
        <div className="mt-10">
          <TicketCard eyebrow="Phần 01 · Trước sự kiện" title="Chính sách mua vé">
            <ol className="space-y-6">
              {purchaseSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#A63D2F]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-semibold text-[#16213E]">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#3A4568]">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-md border border-[#D8CFB8] bg-[#F6F1E4] p-4 text-sm leading-relaxed text-[#3A4568]">
              <p>
                <span className="font-semibold text-[#16213E]">Lưu ý giá vé:</span> Giá hiển thị đã
                bao gồm thuế VAT, chưa bao gồm phí dịch vụ và phí xử lý thanh toán, được thể hiện
                riêng tại bước xác nhận đơn hàng. Mỗi tài khoản giới hạn tối đa 6 vé cho mỗi sự
                kiện.
              </p>
            </div>
          </TicketCard>
        </div>

        {/* HOÀN & ĐỔI VÉ */}
        <div className="mt-8">
          <TicketCard eyebrow="Phần 02 · Sau khi đặt vé" title="Đổi &amp; hoàn vé">
            <p className="text-sm leading-relaxed text-[#3A4568]">
              Mức hoàn tiền phụ thuộc vào thời điểm bạn gửi yêu cầu, tính theo khoảng cách đến thời
              gian bắt đầu sự kiện:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {refundTiers.map((tier) => (
                <div
                  key={tier.window}
                  className="flex flex-col items-start gap-3 rounded-md border border-[#D8CFB8] bg-[#F6F1E4] p-5"
                >
                  <StampBadge label={tier.stamp} tone={tier.tone} />
                  <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[#16213E]">
                    {tier.percent}
                  </p>
                  <p className="text-sm font-semibold text-[#16213E]">{tier.window}</p>
                  <p className="text-xs leading-relaxed text-[#3A4568]">{tier.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold italic text-[#16213E]">
                  Sự kiện bị huỷ hoặc hoãn
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3A4568]">
                  Hoàn 100% giá trị vé, không trừ phí dịch vụ, hoặc giữ vé cho ngày tổ chức mới theo
                  lựa chọn của bạn. Thông báo và hướng dẫn được gửi qua email trong vòng 48 giờ kể
                  từ quyết định của ban tổ chức.
                </p>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold italic text-[#16213E]">
                  Trường hợp không áp dụng hoàn tiền
                </h3>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[#3A4568]">
                  {nonRefundable.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#A63D2F]">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-dashed border-[#D8CFB8] pt-6">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold italic text-[#16213E]">
                Cách gửi yêu cầu
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3A4568]">
                Vào mục “Vé của tôi” → chọn vé cần xử lý → “Yêu cầu hoàn/đổi vé” → nêu lý do và gửi.
                Bạn sẽ nhận email xác nhận trong 24 giờ và kết quả xử lý trong 7–14 ngày làm việc.
              </p>
            </div>
          </TicketCard>
        </div>

        {/* FAQ */}
        <div className="mt-8">
          <TicketCard eyebrow="Phần 03 · Giải đáp nhanh" title="Câu hỏi thường gặp">
            <div className="divide-y divide-dashed divide-[#D8CFB8]">
              {faqs.map((item) => (
                <details key={item.q} className="group py-4 first:pt-0 last:pb-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#16213E] outline-none focus-visible:ring-2 focus-visible:ring-[#A63D2F] focus-visible:ring-offset-2">
                    <span>{item.q}</span>
                    <span className="font-[family-name:var(--font-mono)] text-lg text-[#A63D2F] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#3A4568]">{item.a}</p>
                </details>
              ))}
            </div>
          </TicketCard>
        </div>
      </div>
    </div>
  );
}
