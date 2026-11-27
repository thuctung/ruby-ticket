export type Ticket = {
  id: number;
  site_name: string;
  code: string;
  name: string;
  public_price: number;
  unit_price: number;
  agent_price: number | null; // giá đại lý, null = dùng giá mặc định của site
  in_system: boolean; // vé còn xuất hiện trong API Sunworld
};

export type SearchFilters = { site: string; product: string };

export const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " đ";
