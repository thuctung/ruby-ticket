import { Plane } from "lucide-react";

export function RouteDecor({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 460 260" preserveAspectRatio="xMaxYMid meet" className={className}>
      {/* đường bay */}
      <path
        d="M24 210 C 120 215, 150 120, 245 128 S 370 70, 410 48"
        fill="none"
        stroke="#fff"
        strokeOpacity=".45"
        strokeWidth="2"
        strokeDasharray="3 9"
        strokeLinecap="round"
      />
      {/* điểm đi / điểm dừng */}
      <circle cx="24" cy="210" r="6" fill="#fe9614" />
      <circle cx="24" cy="210" r="12" fill="none" stroke="#fe9614" strokeOpacity=".5" />
      <circle cx="245" cy="128" r="4.5" fill="#fff" fillOpacity=".7" />
      {/* máy bay */}
      <Plane x={398} y={18} width={44} height={44} stroke="#fe9614" fill="#fe9614" strokeWidth={1.5} />
    </svg>
  );
}
