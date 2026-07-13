import Link from "next/link";

export default function TopAgencySection() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl">
          <div className="grid items-center gap-10 ">
            {/* Content */}
            <div className="p-8 md:p-12">
              <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
                Top 10 - 2026
              </span>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Với nhiều năm kinh nghiệm trong lĩnh vực du lịch và vé tham quan, Ruby Travel đã
                đồng hành cùng hàng nghìn du khách khám phá Bà Nà Hills. Chúng tôi cam kết cung cấp
                vé chính hãng, hỗ trợ nhanh chóng và mang đến trải nghiệm đặt vé thuận tiện nhất.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="text-3xl font-bold text-amber-600">10.000+</div>
                  <div className="mt-1 text-sm text-slate-600">Khách hàng phục vụ</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="text-3xl font-bold text-amber-600">24/7</div>
                  <div className="mt-1 text-sm text-slate-600">Hỗ trợ khách hàng</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="text-3xl font-bold text-amber-600">100%</div>
                  <div className="mt-1 text-sm text-slate-600">Vé điện tử chính hãng</div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="text-3xl font-bold text-amber-600">4.9★</div>
                  <div className="mt-1 text-sm text-slate-600">Đánh giá hài lòng</div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-8 block w-[200px] float-right  rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition bg-[#E0115F] hover:bg-[#C00F4E] "
              >
                Đặt vé Bà Nà Hills
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
