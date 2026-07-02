import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../contants";
import Image from "next/image";

const CARDS_PER_VIEW = 2; // số card hiển thị cùng lúc (desktop)
const AUTO_SLIDE_INTERVAL = 2000;

const Feedback = () => {
  // Nhân đôi mảng để tạo hiệu ứng loop vô hạn mượt
  const slides = [...TESTIMONIALS, ...TESTIMONIALS];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    }, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Khi chạy hết mảng gốc, nhảy về đầu không có transition (tạo cảm giác loop vô hạn)
  useEffect(() => {
    if (currentIndex === TESTIMONIALS.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 700); // khớp với thời gian transition bên dưới
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // Bật lại transition ở frame kế tiếp sau khi đã "nhảy" về 0
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => setIsTransitioning(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  const activeDot = currentIndex % TESTIMONIALS.length;
  return (
    <section className="w-full py-16 bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
            Trải Nghiệm Khách Hàng
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-3 rounded-full" />
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className={`flex ${
              isTransitioning ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * (100 / CARDS_PER_VIEW)}%)`,
            }}
          >
            {slides.map((t, i) => (
              <div key={i} className="w-full sm:w-1/2 flex-shrink-0 px-3">
                <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <p className="font-bold text-neutral-900">{t.name}</p>
                      <p className="text-sm text-neutral-400">{t.location}</p>
                    </div>
                  </div>
                  <p className="italic text-neutral-600 leading-relaxed">"{t.content}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-8">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeDot
                  ? "bg-blue-600 w-6"
                  : "bg-neutral-300 w-1.5 hover:bg-neutral-400"
              }`}
              aria-label={`Chuyển đến đánh giá ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;
