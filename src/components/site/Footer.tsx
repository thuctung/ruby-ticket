"use client";

import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n/t";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const lang = useLang();

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 text-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">RubyTravel </h4>
            <p className="text-neutral-400 leading-relaxed">
              Hệ thống phân phối và bán vé điện tử khu vui chơi du lịch hàng đầu.
            </p>
          </div>
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">Liên Kết</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Dịch vụ
                </a>
              </li>
              <li>
                <a href="#sites" className="hover:text-white transition-colors">
                  Khu du lịch
                </a>
              </li>
              <li>
                <a href="#agent" className="hover:text-white transition-colors">
                  Đại lý
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">Chính Sách</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Quy trình hoàn tiền
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-base font-bold mb-4 tracking-wider">Liên Hệ</h4>
            <p className="leading-relaxed">
              Hotline: <span className="text-white">0705 551 668</span>
              <br />
              Email: <span className="text-white">rubytraveldanang@gmail.com</span>
            </p>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-neutral-900 text-xs text-neutral-600">
          <p>&copy; 2026 Ruby Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
