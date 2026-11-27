import { ExperienceCard } from "@/types";

export const FAQS = [
  {
    q: "homepage.faq.0.q",
    a: "homepage.faq.0.a",
  },
  {
    q: "homepage.faq.1.q",
    a: "homepage.faq.1.a",
  },
  {
    q: "homepage.faq.2.q",
    a: "homepage.faq.2.a",
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

export const getCategoryText = (siteCode: string) => {
  switch (siteCode) {
    case "BNC":
      return {
        text: "Theme Park",
        color: "from-amber-500 to-orange-600",
      };
    case "VINPER":
      return {
        text: "Water Park",
        color: "from-blue-500 to-cyan-600",
      };
    case "KWHOIAN":
      return {
        text: "Show",
        color: "from-rose-500 to-pink-600",
      };
    case "DUTHUYEN":
      return {
        text: "River Cruise",
        color: "from-blue-500 to-cyan-600",
      };
    default:
      return {
        text: "Discovery",
        color: "from-indigo-500 to-blue-600",
      };
  }
};
