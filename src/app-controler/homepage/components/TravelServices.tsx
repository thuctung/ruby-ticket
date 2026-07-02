"use client";

import { useState } from "react";

const services = [
  {
    id: "tour-khach-doan",
    label: "Tour",
    highlight: "KHÁCH ĐOÀN",
    href: null,
    color: "#f59e0b",
    gradient: "from-amber-500 to-yellow-400",
    bg: "bg-amber-50",
    border: "border-amber-200",
    ring: "ring-amber-400",
    text: "text-amber-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Group of people */}
        <circle cx="24" cy="14" r="5" fill="currentColor" />
        <path
          d="M14 38c0-5.523 4.477-10 10-10s10 4.477 10 10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="11" cy="17" r="4" fill="currentColor" opacity="0.6" />
        <path
          d="M3 38c0-4.418 3.582-8 8-8"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="37" cy="17" r="4" fill="currentColor" opacity="0.6" />
        <path
          d="M45 38c0-4.418-3.582-8-8-8"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Flag */}
        <path d="M24 28 L24 22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <rect x="24" y="20" width="7" height="4" rx="1" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "combo-du-lich",
    label: "Combo",
    highlight: "DU LỊCH",
    href: null,
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-400",
    bg: "bg-pink-50",
    border: "border-pink-200",
    ring: "ring-pink-400",
    text: "text-pink-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Suitcase */}
        <rect
          x="10"
          y="18"
          width="28"
          height="22"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="17"
          y="13"
          width="14"
          height="7"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <line x1="10" y1="27" x2="38" y2="27" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="27" x2="24" y2="40" stroke="currentColor" strokeWidth="1.5" />
        {/* Compass rose on suitcase */}
        <circle
          cx="18"
          cy="33"
          r="4"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          fill="none"
        />
        <path d="M18 30 L18 36 M15 33 L21 33" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        {/* Stars */}
        <path
          d="M35 22 L35.7 24.3 L38 24.3 L36.2 25.7 L36.9 28 L35 26.6 L33.1 28 L33.8 25.7 L32 24.3 L34.3 24.3 Z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>
    ),
  },
  {
    id: "ve-vui-choi",
    label: "Vé",
    highlight: "VUI CHƠI GIẢI TRÍ",
    href: "",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "ring-emerald-400",
    text: "text-emerald-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Ferris wheel */}
        <circle cx="24" cy="20" r="13" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="24" cy="20" r="3" fill="currentColor" />
        {/* Spokes */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 24 + 13 * Math.sin(rad);
          const y2 = 20 - 13 * Math.cos(rad);
          return (
            <line
              key={i}
              x1="24"
              y1="20"
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="1.2"
              opacity="0.6"
            />
          );
        })}
        {/* Gondolas */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 24 + 13 * Math.sin(rad);
          const cy = 20 - 13 * Math.cos(rad);
          return <circle key={i} cx={cx} cy={cy} r="2.5" fill="currentColor" opacity="0.8" />;
        })}
        {/* Ground */}
        <line
          x1="16"
          y1="33"
          x2="32"
          y2="33"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line x1="24" y1="33" x2="24" y2="40" stroke="currentColor" strokeWidth="2" />
        {/* Ticket star */}
        <path
          d="M38 8 L39 11 L42 11 L39.5 13 L40.5 16 L38 14.2 L35.5 16 L36.5 13 L34 11 L37 11 Z"
          fill="currentColor"
          opacity="0.8"
        />
      </svg>
    ),
  },
  {
    id: "giat-say",
    label: "Dịch Vụ",
    highlight: "GIẶT SẤY",
    href: null,
    color: "#0ea5e9",
    gradient: "from-sky-500 to-cyan-400",
    bg: "bg-sky-50",
    border: "border-sky-200",
    ring: "ring-sky-400",
    text: "text-sky-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Washing machine body */}
        <rect
          x="8"
          y="6"
          width="32"
          height="36"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        {/* Control panel */}
        <circle cx="14" cy="11" r="1.5" fill="currentColor" />
        <circle cx="19" cy="11" r="1.5" fill="currentColor" opacity="0.6" />
        {/* Drum */}
        <circle cx="24" cy="27" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle
          cx="24"
          cy="27"
          r="7"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        {/* Water swirl / bubbles inside drum */}
        <path
          d="M20 25c1.5-2 5-2 6 0s-1 4-3 4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="29" cy="23" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="31" cy="27" r="0.8" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "thue-xe-may",
    label: "Dịch Vụ",
    highlight: "THUÊ XE MÁY",
    href: null,
    color: "#ef4444",
    gradient: "from-red-500 to-orange-400",
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "ring-red-400",
    text: "text-red-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Wheels */}
        <circle cx="12" cy="35" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="36" cy="35" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Body frame */}
        <path
          d="M12 35 L20 22 L28 22 L36 35"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 22 L24 14 L31 14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Seat */}
        <path
          d="M22 22 L30 22"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Handlebar */}
        <path
          d="M31 14 L35 12 M31 14 L35 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Headlight */}
        <circle cx="24" cy="14" r="1.3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "spa-massage",
    label: "Spa",
    highlight: "MASSAGE",
    href: "",
    color: "#06b6d4",
    gradient: "from-cyan-500 to-teal-400",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    ring: "ring-cyan-400",
    text: "text-cyan-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Lotus flower */}
        <ellipse
          cx="24"
          cy="32"
          rx="6"
          ry="10"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        />
        <ellipse
          cx="24"
          cy="32"
          rx="6"
          ry="10"
          transform="rotate(45 24 32)"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />
        <ellipse
          cx="24"
          cy="32"
          rx="6"
          ry="10"
          transform="rotate(-45 24 32)"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          opacity="0.6"
        />
        <ellipse
          cx="24"
          cy="32"
          rx="6"
          ry="10"
          transform="rotate(90 24 32)"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          opacity="0.3"
        />
        {/* Steam */}
        <path
          d="M18 14 Q20 10 18 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M24 12 Q26 8 24 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M30 14 Q32 10 30 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>
    ),
  },
  {
    id: "ve-may-bay",
    label: "Vé",
    highlight: "MÁY BAY",
    href: "",
    color: "#3b82f6",
    gradient: "from-blue-500 to-indigo-400",
    bg: "bg-blue-50",
    border: "border-blue-200",
    ring: "ring-blue-400",
    text: "text-blue-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Airplane */}
        <path
          d="M42 14 L30 26 L34 42 L30 40 L24 30 L14 36 L15 40 L11 38 L10 32 L6 24 L10 22 L13 26 L22 18 L16 6 L20 4 L28 18 L42 14 Z"
          fill="currentColor"
          opacity="0.85"
        />
        {/* Clouds */}
        <ellipse cx="8" cy="14" rx="4" ry="2.5" fill="currentColor" opacity="0.2" />
        <ellipse cx="12" cy="13" rx="3" ry="2" fill="currentColor" opacity="0.2" />
        <ellipse cx="36" cy="38" rx="3.5" ry="2" fill="currentColor" opacity="0.2" />
        <ellipse cx="40" cy="37" rx="2.5" ry="1.8" fill="currentColor" opacity="0.2" />
      </svg>
    ),
  },
  {
    id: "dat-xe",
    label: "Đặt",
    highlight: "XE",
    href: "",
    color: "#f97316",
    gradient: "from-orange-500 to-amber-400",
    bg: "bg-orange-50",
    border: "border-orange-200",
    ring: "ring-orange-400",
    text: "text-orange-600",
    icon: (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Car body */}
        <rect
          x="5"
          y="24"
          width="38"
          height="14"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        {/* Car roof */}
        <path d="M12 24 L16 14 L32 14 L36 24" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Windows */}
        <path d="M17 24 L19 16 L29 16 L31 24" fill="currentColor" opacity="0.2" />
        <line
          x1="24"
          y1="14"
          x2="24"
          y2="24"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
        />
        {/* Wheels */}
        <circle cx="14" cy="38" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="14" cy="38" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="34" cy="38" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="34" cy="38" r="2" fill="currentColor" opacity="0.5" />
        {/* Headlight */}
        <rect x="5" y="28" width="4" height="3" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="39" y="28" width="4" height="3" rx="1" fill="currentColor" opacity="0.7" />
        {/* Road dots */}
        <line
          x1="8"
          y1="43"
          x2="14"
          y2="43"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.3"
        />
        <line
          x1="22"
          y1="43"
          x2="28"
          y2="43"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.3"
        />
        <line
          x1="36"
          y1="43"
          x2="42"
          y2="43"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.3"
        />
      </svg>
    ),
  },
];

export default function TravelServices() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="travel-services" className="w-full pt-20 py-10 px-4">
      {/* Section header */}
      <div className="text-center mb-8">
        <h2
          className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900"
          style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        >
          Khám phá dịch vụ
        </h2>
        <div className="mt-2 mx-auto w-12 h-1 rounded-full bg-gradient-to-r from-sky-400 to-violet-500" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {services.map((s) => {
          const isHovered = hovered === s.id;
          const Tag = s.href ? "a" : "button";
          const extraProps = s.href
            ? { href: s.href, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Tag
              key={s.id}
              {...(extraProps as any)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              className={[
                "group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none no-underline",
                s.bg,
                s.border,
                isHovered
                  ? `shadow-lg ring-2 ${s.ring} -translate-y-1 scale-[1.03]`
                  : "shadow-sm hover:shadow-md",
              ].join(" ")}
              style={{ transition: "all 0.25s cubic-bezier(.4,0,.2,1)" }}
            >
              {/* Icon container */}
              <div
                className={[
                  "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                  s.text,
                  isHovered ? "scale-110" : "",
                ].join(" ")}
                style={{
                  background: isHovered
                    ? `linear-gradient(135deg, ${s.color}22, ${s.color}11)`
                    : `${s.color}18`,
                  boxShadow: isHovered ? `0 4px 20px ${s.color}33` : "none",
                }}
              >
                <div className="w-8 h-8">{s.icon}</div>

                {/* Animated ring on hover */}
                {isHovered && (
                  <span
                    className="absolute inset-0 rounded-2xl animate-ping opacity-20"
                    style={{ backgroundColor: s.color }}
                  />
                )}
              </div>

              {/* Text */}
              <div className="text-center leading-tight">
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
                  {s.label}
                </span>
                <span
                  className={[
                    "block text-sm font-black uppercase tracking-tight transition-colors duration-200",
                    isHovered ? s.text : "text-gray-700",
                  ].join(" ")}
                >
                  {s.highlight}
                </span>
              </div>

              {/* Bottom accent bar */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300"
                style={{
                  width: isHovered ? "60%" : "0%",
                  background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                }}
              />

              {/* External link indicator */}
              {s.href && (
                <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity duration-200">
                  <svg
                    className="w-3 h-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
              )}
            </Tag>
          );
        })}
      </div>
    </section>
  );
}
