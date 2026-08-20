"use client";

import { useEffect, useRef, useState } from "react";
import { Ticket } from "lucide-react";
import { DESTINATIONS, Destination } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import DetailModal from "@/components/DetailModal";

export default function DestinationsPage() {
  const [selected, setSelected] = useState<Destination | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBuy = (place: Destination) => {
    setToast(`Đã thêm vé "${place.name}" vào giỏ hàng`);
    setSelected(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-ink px-6 pb-20 pt-14 [background-image:radial-gradient(circle_at_15%_20%,rgba(201,162,39,0.08),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(47,111,94,0.12),transparent_45%)]">
      {/* Hero */}
      <div className="mx-auto mb-12 max-w-5xl border-b border-gold/25 pb-8">
        <div className="mb-3.5 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-gold before:h-px before:w-7 before:bg-gold">
          Vé tham quan • Việt Nam
        </div>
        <h1 className="mb-3.5 font-display text-[38px] font-semibold leading-[1.02] text-paper sm:text-5xl lg:text-6xl">
          Những chặng đường <em className="italic text-gold">đáng nhớ</em>
          <br />
          khắp dải đất hình chữ S
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-paper/65">
          Chọn điểm đến, xem chi tiết hành trình và giữ vé chỉ trong một cú
          chạm — mỗi tấm vé dưới đây là một cánh cửa mở ra một vùng đất.
        </p>
      </div>

      {/* Lưới card */}
      <div className="mx-auto grid max-w-5xl grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-7">
        {DESTINATIONS.map((place) => (
          <DestinationCard
            key={place.id}
            place={place}
            onDetail={setSelected}
            onBuy={handleBuy}
          />
        ))}
      </div>

      <DetailModal
        place={selected}
        onClose={() => setSelected(null)}
        onBuy={handleBuy}
      />

      {toast && (
        <div className="fixed bottom-7 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-full border border-gold bg-ink px-5 py-3 text-[13.5px] font-medium text-paper shadow-[0_14px_30px_rgba(0,0,0,0.4)]">
          <Ticket size={15} strokeWidth={2.5} />
          {toast}
        </div>
      )}
    </main>
  );
}
