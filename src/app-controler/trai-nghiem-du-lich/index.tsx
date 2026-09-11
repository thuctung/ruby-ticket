import { Destination } from "./compoents/destinations";
import DestinationCard from "./compoents/DestinationCard";
import { SiteType } from "../admin/site/type";

const DestinationsPageController = ({ sites }: { sites: SiteType[] | null }) => {
  const handleBuy = (place: Destination) => {};

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink px-6 pb-20 pt-14">
      {/* Nội dung nằm trên lớp bản đồ */}
      <div className="relative z-10">
        {/* Hero */}
        <div className="mx-auto mb-12 max-w-6xl border-b border-gold/25 pb-8">
          <div className="mb-3.5 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-gold before:h-px before:w-7 before:bg-gold">
            Vé tham quan • Việt Nam
          </div>
          <h1 className="mb-3.5 font-display text-[38px] font-semibold leading-[1.02] text-paper sm:text-5xl lg:text-6xl">
            Những chặng đường đáng nhớ
            <br />
            khắp dải đất hình chữ S
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-paper/65">
            Chọn điểm đến, xem chi tiết hành trình và giữ vé chỉ trong một cú chạm — mỗi tấm vé dưới
            đây là một cánh cửa mở ra một vùng đất.
          </p>
        </div>

        {/* Lưới card */}
        <div className="mx-auto grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-7">
          {sites &&
            sites.map((place: any, index: number) => (
              <DestinationCard
                key={index}
                place={place}
                onDetail={() => console.log("")}
                onBuy={handleBuy}
              />
            ))}
        </div>
      </div>
    </main>
  );
};
export default DestinationsPageController;
