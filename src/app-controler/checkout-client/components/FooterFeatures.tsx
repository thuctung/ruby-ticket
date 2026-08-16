import { BadgeCheck, HeadphonesIcon, RotateCcw, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Giá tốt ",
    desc: "Giá ưu đãi so với thị trường",
  },
  {
    icon: ShieldCheck,
    title: "Vé chính hãng",
    desc: "Đảm bảo vé từ đối tác chính thức",
  },
  {
    icon: ShieldCheck,
    title: "An toàn & Bảo mật",
    desc: "Thông tin được bảo mật tuyệt đối",
  },
  {
    icon: HeadphonesIcon,
    title: "Hỗ trợ tận tâm",
    desc: "Đội ngũ hỗ trợ chuyên nghiệp",
  },
];

export default function FooterFeatures() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Icon size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
