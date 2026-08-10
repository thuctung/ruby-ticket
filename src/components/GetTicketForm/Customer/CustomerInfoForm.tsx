"use client";

import { Mail, Phone, User } from "lucide-react";
import { CustomerInfoType, CustomerInfoErrors } from "./type";

type CustomerInfoFormProps = {
  value: CustomerInfoType;
  errors: CustomerInfoErrors;
  onChange: (key: string, value: string) => void;
};

export default function CustomerInfoForm({ value, errors, onChange }: CustomerInfoFormProps) {
  const handleField =
    (field: keyof CustomerInfoType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(field, e.target.value);
    };

  return (
    <section className=" mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-100  bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900">Thông tin liên hệ</h2>
        <p className="mt-1 text-sm text-gray-500">Vé điện tử sẽ được gửi đến email dưới.</p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="fullname" className="mb-2 block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 `}>
              <User size={18} className="shrink-0 text-gray-400" />
              <input
                id="fullname"
                type="text"
                placeholder="Nguyễn Văn A"
                value={value.fullname}
                onChange={handleField("fullname")}
                className="w-full bg-transparent text-[15px] font-medium text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 `}>
              <Mail size={18} className="shrink-0 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="ban@email.com"
                value={value.email}
                onChange={handleField("email")}
                className="w-full bg-transparent text-[15px] font-medium text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 `}>
              <Phone size={18} className="shrink-0 text-gray-400" />
              <input
                id="phone"
                type="tel"
                placeholder="0912 345 678"
                value={value.phone}
                onChange={handleField("phone")}
                className="w-full bg-transparent text-[15px] font-medium text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
