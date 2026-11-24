export type Ticket = {
  id: string;
  eventName: string;
  ticketType: string;
  date: string; // ISO string
  venue: string;
  seat?: string;
  holderName?: string;
  price: number;
};

export type Order = {
  code: string;
  status: "paid";
  paidAt: string; // ISO string
  customer: { name: string; email: string; phone?: string };
  tickets: Ticket[];
  total: number;
};

/**
 * Lấy đơn hàng theo order code.
 * Trả về null nếu không tìm thấy (404) hoặc code không hợp lệ.
 * TODO: thay URL bằng API thật của bạn.
 */
export async function getOrder(code: string): Promise<Order | null> {
  if (!/^[A-Za-z0-9_-]{4,40}$/.test(code)) return null;

  // Dữ liệu demo để xem giao diện: /order/success?code=DEMO123
  if (!process.env.API_URL) {
    return code === "DEMO123" ? demoOrder : null;
  }

  const res = await fetch(`${process.env.API_URL}/orders/${encodeURIComponent(code)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Order API error: ${res.status}`);
  return (await res.json()) as Order;
}

const demoOrder: Order = {
  code: "DEMO123",
  status: "paid",
  paidAt: "2026-11-13T09:30:00+07:00",
  customer: {
    name: "Nguyễn Minh Anh",
    email: "minhanh@example.com",
    phone: "0901 234 567",
  },
  tickets: [
    {
      id: "T-0001",
      eventName: "Đêm nhạc Hội An",
      ticketType: "Vé VIP",
      date: "2026-12-20T19:30:00+07:00",
      venue: "Nhà hát Hội An",
      seat: "A12",
      holderName: "Nguyễn Minh Anh",
      price: 850000,
    },
    {
      id: "T-0002",
      eventName: "Đêm nhạc Hội An",
      ticketType: "Vé VIP",
      date: "2026-12-20T19:30:00+07:00",
      venue: "Nhà hát Hội An",
      seat: "A13",
      holderName: "Trần Quốc Bảo",
      price: 850000,
    },
  ],
  total: 1700000,
};
