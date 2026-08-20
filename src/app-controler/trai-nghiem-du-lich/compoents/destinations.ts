export type Destination = {
  id: number;
  name: string;
  region: string;
  price: string;
  rating: string;
  tag: string;
  desc: string;
  img: string;
};

export const DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: "Vịnh Hạ Long",
    region: "Quảng Ninh",
    price: "890.000",
    rating: "4.9",
    tag: "Di sản thiên nhiên",
    desc: "Hàng nghìn đảo đá vôi nhô lên giữa làn nước ngọc bích, di sản thế giới được UNESCO công nhận.",
    img: "https://loremflickr.com/600/450/halongbay,karst/all?lock=101",
  },
  {
    id: 2,
    name: "Phố cổ Hội An",
    region: "Quảng Nam",
    price: "450.000",
    rating: "4.8",
    tag: "Phố cổ đèn lồng",
    desc: "Những con phố vàng rực đèn lồng, mái ngói rêu phong bên dòng sông Thu Bồn êm đềm.",
    img: "https://loremflickr.com/600/450/hoian,lantern/all?lock=102",
  },
  {
    id: 3,
    name: "Đà Lạt mộng mơ",
    region: "Lâm Đồng",
    price: "620.000",
    rating: "4.7",
    tag: "Cao nguyên se lạnh",
    desc: "Thành phố ngàn hoa với khí hậu ôn đới quanh năm, đồi thông và những căn biệt thự cổ.",
    img: "https://loremflickr.com/600/450/dalat,pinehill/all?lock=103",
  },
  {
    id: 4,
    name: "Ruộng bậc thang Sa Pa",
    region: "Lào Cai",
    price: "750.000",
    rating: "4.9",
    tag: "Núi rừng Tây Bắc",
    desc: "Những thửa ruộng bậc thang uốn lượn ôm lấy bản làng dưới chân dãy Hoàng Liên Sơn.",
    img: "https://loremflickr.com/600/450/sapa,terracedfields/all?lock=104",
  },
  {
    id: 5,
    name: "Đảo ngọc Phú Quốc",
    region: "Kiên Giang",
    price: "1.250.000",
    rating: "4.8",
    tag: "Biển đảo",
    desc: "Bãi cát trắng mịn, nước biển trong xanh và những buổi hoàng hôn đẹp bậc nhất Việt Nam.",
    img: "https://loremflickr.com/600/450/phuquoc,beach/all?lock=105",
  },
  {
    id: 6,
    name: "Cố đô Huế",
    region: "Thừa Thiên Huế",
    price: "380.000",
    rating: "4.6",
    tag: "Kinh thành cổ",
    desc: "Hoàng thành trầm mặc bên dòng sông Hương, dấu ấn vàng son của triều Nguyễn xưa.",
    img: "https://loremflickr.com/600/450/hue,citadel/all?lock=106",
  },
];
