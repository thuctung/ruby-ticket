import { ExperienceCard } from "@/types";

export const FAQS = [
  {
    q: "Sau khi thanh toán thành công, tôi nhận vé bằng cách nào?",
    a: "Mã vé điện tử (QR Code) sẽ được gửi tự động qua Email và Số điện thoại (Zalo/SMS) bạn đã đăng ký trong vòng 1-3 phút sau khi hệ thống ghi nhận thanh toán thành công.",
  },
  {
    q: "Tôi có thể đổi hoặc hoàn trả vé đã mua không?",
    a: 'Chính sách đổi trả phụ thuộc vào quy định riêng của từng khu du lịch. Vui lòng kiểm tra kỹ phần "Điều kiện vé" trước khi thanh toán hoặc liên hệ Hotline để được hỗ trợ cụ thể.',
  },
  {
    q: "Đại lý có cần cam kết doanh số tháng không?",
    a: "Chúng tôi có nhiều cấp bậc đại lý từ CTV tự do không áp doanh số đến đại lý kim cương. Hãy để lại thông tin tại form đăng ký, chuyên viên sẽ tư vấn gói phù hợp cho bạn.",
  },
];
export const TESTIMONIALS = [
  {
    name: "Nguyễn Thu Hà",
    location: "Hà Nội",
    avatar: "/avatar_01.png",
    content:
      "Đặt vé qua hệ thống rất nhanh. Mình mua ngay cổng soát vé Bà Nà vẫn nhận được mã QR sau 1 phút, không cần xếp hàng mua vé giấy.",
  },
  {
    name: "Trần Hoàng Minh",
    location: "TP. Hồ Chí Minh",
    avatar: "/avatar_02.png",
    content:
      "Giao diện trực quan, giá vé luôn được chiết khấu tốt hơn mua trực tiếp. Sẽ tiếp tục ủng hộ hệ thống trong các chuyến đi tới.",
  },
  {
    name: "Lê Thị Mai",
    location: "Đà Nẵng",
    avatar: "/avatar_03.png",
    content:
      "Đội ngũ hỗ trợ nhiệt tình, đổi lịch vé dễ dàng khi có thay đổi kế hoạch. Trải nghiệm mua vé rất chuyên nghiệp.",
  },
  {
    name: "Phạm Văn Đức",
    location: "Cần Thơ",
    avatar: "/avatar_04.png",
    content:
      "Lần đầu đưa cả gia đình đi Vinpearl mà đặt vé online tiện thế này thì quá yên tâm. Giá tốt hơn hẳn so với mua tại quầy.",
  },
  {
    name: "Đỗ Thị Ngọc Anh",
    location: "Hải Phòng",
    avatar: "/avatar_05.png",
    content:
      "Thanh toán xong là có vé ngay trong email, không cần in ra cũng vào cổng được. Rất phù hợp cho người hay đi công tác kết hợp du lịch.",
  },
  {
    name: "Vũ Quang Huy",
    location: "Nha Trang",
    avatar: "/avatar_06.png",
    content:
      "Mình đặt vé Núi Thần Tài cho nhóm bạn 8 người, hệ thống xử lý số lượng lớn vẫn mượt, không bị lỗi hay chậm trễ gì cả.",
  },
  {
    name: "Bùi Thị Thanh Trúc",
    location: "Huế",
    avatar: "/avatar_07.png",
    content:
      "Ứng dụng dễ dùng, mẹ mình lớn tuổi mà vẫn tự đặt vé được cho cả nhà. Có gì thắc mắc nhắn hỏi cũng được trả lời rất nhanh.",
  },
  {
    name: "Hoàng Anh Tuấn",
    location: "Bình Dương",
    avatar: "/avatar_08.png",
    content:
      "So sánh giá với vài nơi khác thì đây vẫn là rẻ nhất, lại còn có nhiều ưu đãi combo vé + khách sạn khá hời.",
  },
  {
    name: "Ngô Thị Kim Ngân",
    location: "Vũng Tàu",
    avatar: "/avatar_09.png",
    content:
      "Đặt vé buổi tối mà sáng hôm sau đi liền vẫn kịp, hệ thống xác nhận cực nhanh. Chuyến đi Bà Nà của gia đình mình diễn ra suôn sẻ.",
  },
  {
    name: "Trịnh Minh Khoa",
    location: "Đồng Nai",
    avatar: "/avatar_10.png",
    content:
      "Là người hay đi du lịch nhiều nơi, mình đánh giá đây là một trong những nền tảng đặt vé mượt và đáng tin cậy nhất hiện nay.",
  },
];
export const EXPERIENCES: ExperienceCard[] = [
  {
    key: "BANA",
    nameKey: "product.bana.name",
    taglineKey: "product.bana.tagline",
    badgeKey: "product.bana.badge",
    image1: "bana1.jpg",
    image2: "bana2.jpg",
    color: "from-amber-500 to-orange-600",
    category: "Theme Park",
  },
  {
    key: "VINPER",
    nameKey: "product.vinpearl.name",
    taglineKey: "product.vinpearl.tagline",
    badgeKey: "product.vinpearl.badge",
    image1: "namha1.jpg",
    image2: "namha2.jpg",
    color: "from-blue-500 to-cyan-600",
    category: "Water Park",
  },
  {
    key: "KWHOIAN",
    nameKey: "product.hoian.name",
    taglineKey: "product.hoian.tagline",
    badgeKey: "product.hoian.badge",
    image1: "hoian1.jpg",
    image2: "hoian2.jpg",
    color: "from-rose-500 to-pink-600",
    category: "Show",
  },
  {
    key: "NUITHANTAI",
    nameKey: "product.nuiThanTai.name",
    taglineKey: "product.nuiThanTai.tagline",
    badgeKey: "product.nuiThanTai.badge",
    image1: "thantai1.jpg",
    image2: "thantai2.jpg",
    color: "from-emerald-500 to-teal-600",
    category: "Hot Spring",
  },
  {
    key: "DUTHUYEN",
    nameKey: "product.cruise.name",
    taglineKey: "product.cruise.tagline",
    badgeKey: "product.cruise.badge",
    image1: "duthuyen1.jpg",
    image2: "duthuyen2.jpg",
    color: "from-indigo-500 to-blue-600",
    category: "River Cruise",
  },
  {
    key: "MIKAZUKI",
    nameKey: "product.mikayuki.name",
    taglineKey: "product.mikayuki.tagline",
    badgeKey: "product.mikayuki.badge",
    image1: "mikazuki1.webp",
    image2: "mikazuki2.webp",
    color: "from-indigo-500 to-blue-600",
    category: "Mikayuki",
  },
] as const;
