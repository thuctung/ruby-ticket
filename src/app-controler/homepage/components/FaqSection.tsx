import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n/t";
import { HelpCircle } from "lucide-react";
import { FAQS } from "../contants";
import Link from "next/link";
import { useState } from "react";

type LangKey = "vi" | "en" | "zh" | "ko";

export function FaqSection({ lang }: { lang: LangKey }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-12 relative after:content-[''] after:block after:w-14 after:h-1 after:bg-blue-600 after:mx-auto after:mt-3 after:rounded-full">
          Câu Hỏi Thường Gặp
        </h2>
        <div className="border-t border-neutral-100 divide-y divide-neutral-100">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left py-2 font-semibold text-base sm:text-lg text-neutral-800 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`text-xl font-light text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-45 text-blue-600" : ""}`}
                  >
                    ＋
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out text-sm text-neutral-500 leading-relaxed ${
                    isOpen ? "max-h-40 mt-3 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
