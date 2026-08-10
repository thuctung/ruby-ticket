import { Trophy, Crown, Sparkles } from "lucide-react";
import Image from "next/image";

const HIGHLIGHTS = [
  { icon: Trophy, label: "Cáp treo đạt 2 kỷ lục thế giới" },
  { icon: Crown, label: "Khung cảnh tuyệt đẹp" },
  { icon: Sparkles, label: "Nhiều trải nghiệm hấp dẫn" },
];

export default function Hero() {
  return (
    <section className="relative h-[340px] w-full overflow-hidden sm:h-[380px]">
      <Image
        src="/cau-rong.png"
        alt="Ruby Travel"
        width={900}
        height={400}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Khám phá Du lịch Đà Nẵng
        </h1>
        <p className="mt-3 max-w-md text-lg text-white/90">
          Thiên đường giải trí và nghỉ dưỡng đẳng cấp
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/25"
            >
              <Icon size={16} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
