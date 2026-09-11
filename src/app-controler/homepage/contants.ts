import { ExperienceCard } from "@/types";

export const FAQS = [
  {
    q: `home.faq.questions.0.question`,
    a: `home.faq.questions.0.answer`,
  },
  {
    q: `home.faq.questions.1.question`,
    a: `home.faq.questions.1.answer`,
  },
  {
    q: `home.faq.questions.2.question`,
    a: `home.faq.questions.2.answer`,
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
    content: "Ứng dụng dễ dùng. Có gì thắc mắc nhắn hỏi cũng được trả lời rất nhanh.",
  },
  {
    name: "Hoàng Anh Tuấn",
    location: "Bình Dương",
    avatar: "/avatar_08.png",
    content: "So sánh giá với vài nơi khác thì đây vẫn là rẻ , lại còn có nhiều ưu đãi combo vé ",
  },
  {
    name: "Ngô Thị Kim Ngân",
    location: "Vũng Tàu",
    avatar: "/avatar_09.png",
    content: "Hệ thống xác nhận  nhanh. Chuyến đi Bà Nà của gia đình mình diễn ra suôn sẻ.",
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
    key: "BNC",
    nameKey: "home.experiences.banaHills",
    taglineKey: "home.experiences.descriptions.themePark",
    badgeKey: "home.experiences.top",
    image1: "bana1.jpg",
    image2: "bana2.jpg",
    color: "from-amber-500 to-orange-600",
    category: "home.experiences.themePark",
    alt: "Cáp treo Bà Nà Hills",
  },
  {
    key: "VINPER",
    nameKey: "home.experiences.vinpearlNamHoiAn",
    taglineKey: "home.experiences.descriptions.waterPark",
    badgeKey: "home.experiences.hot",
    image1: "namha1.jpg",
    image2: "namha2.jpg",
    color: "from-blue-500 to-cyan-600",
    category: "home.experiences.waterPark",
    alt: "Vinpearl Nam Hội An",
  },
  {
    key: "KWHOIAN",
    nameKey: "home.experiences.kyUcHoiAn",
    taglineKey: "home.experiences.descriptions.show",
    badgeKey: "home.experiences.mustSee",
    image1: "hoian1.jpg",
    image2: "hoian2.jpg",
    color: "from-rose-500 to-pink-600",
    category: "home.experiences.show",
    alt: "Hội An Ancient Town",
  },
  {
    key: "NUITHANTAI",
    nameKey: "home.experiences.nuiThanTai",
    taglineKey: "home.experiences.descriptions.hotSpring",
    badgeKey: "home.experiences.relax",
    image1: "thantai1.jpg",
    image2: "thantai2.jpg",
    color: "from-emerald-500 to-teal-600",
    category: "home.experiences.hotSpring",
    alt: "Núi Thần Tài",
  },
  {
    key: "DUTHUYEN",
    nameKey: "home.experiences.duThuyenSongHan",
    taglineKey: "home.experiences.descriptions.riverCruise",
    badgeKey: "home.experiences.chill",
    image1: "duthuyen1.jpg",
    image2: "duthuyen2.jpg",
    color: "from-indigo-500 to-blue-600",
    category: "home.experiences.riverCruise",
    alt: "Du thuyền sông Hàn",
  },
  {
    key: "MIKAZUKI",
    nameKey: "home.experiences.mikazuki",
    taglineKey: "home.experiences.descriptions.mikazuki",
    badgeKey: "home.experiences.top",
    image1: "mikazuki1.webp",
    image2: "mikazuki2.webp",
    color: "from-indigo-500 to-blue-600",
    category: "home.experiences.mikazuki",
    alt: "Mikazuki",
  },
] as const;
