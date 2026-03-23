"use client";
import { BASIC_DATE_FORMAT, dayjsEx } from "@/helpers/dateTime";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import { isEmpty } from "lodash";
import { User, Lock, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { passwordSchema, profilSchema } from "./contants";
import { changePassword, updateProfile } from "./api";
import { useCommonStore } from "@/stores/useCommonStore";

export default function AffProfilePageController() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const { setProfile }: any = useProfileStore.getState();
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [formForfile, setFormProfile] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [password, setPassword] = useState({
    old: "",
    newPass: "",
    confirm: "",
  });

  const onChangeValue = (key: string, value: string) => {
    setFormProfile((pre: any) => ({ ...pre, [key]: value }));
  };

  const handleUpdateProfile = async () => {
    const result = profilSchema.safeParse(formForfile);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
    } else {
      const { full_name, phone, address, user_id } = formForfile;
      const data = await updateProfile({
        full_name,
        phone,
        address,
        user_id,
      });
      if (data) {
        setProfile(data?.data);
        setErrors({});
        setToastMessage("Cập nhật thông tin thành công");
      }
    }
  };

  const onChangPass = (key: string, value: string) => {
    setPassword((pre) => ({ ...pre, [key]: value }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    const { old, newPass, confirm } = password;

    const resultPass = passwordSchema.safeParse(password);

    if (!resultPass.success) {
      const fieldErrors: Record<string, string> = {};
      resultPass.error.issues.forEach((issue) => {
        fieldErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (newPass !== confirm) {
      setToastMessage("Mật khẩu xác nhận không khớp!");
      setErrors({});
      return;
    }

    if (profile.email) {
      const data = await changePassword(newPass, old, profile.email);

      if (data) {
        setToastMessage("Đổi mật khẩu thành công!");
        setPassword({
          old: "",
          newPass: "",
          confirm: "",
        });
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(profile)) {
      setFormProfile(profile);
    }
  }, [profile]);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <div className="w-full flex h-full rounded-full bg-gray-200 overflow-hidden border-2 border-blue-500">
                <img src={`https://ui-avatars.com/api/?name=${profile.username}`} alt="Avatar" />
              </div>
            </div>
            <h2 className="font-semibold text-lg">{formForfile.full_name}</h2>
            <p className="text-sm text-gray-500 text-center">
              Thành viên từ: {dayjsEx(profile.created_at).format(BASIC_DATE_FORMAT)}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold">
            <User size={20} />
            <h3>Thông tin cá nhân</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Họ tên</label>
              <input
                type="text"
                value={formForfile?.full_name || ""}
                onChange={(e) => onChangeValue("full_name", e.target.value)}
                className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="09xx xxx xxx"
                  value={formForfile?.phone || ""}
                  onChange={(e) => onChangeValue("phone", e.target.value)}
                  className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập địa chỉ của bạn"
                value={formForfile?.address || ""}
                onChange={(e) => onChangeValue("address", e.target.value)}
                className="w-full pl-10 p-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Lưu thay đổi
          </button>

          {/* Section 2: Đổi mật khẩu */}
          <div className="flex items-center gap-2 mb-2 text-red-600 font-semibold">
            <Lock size={20} />
            <h3>Đổi mật khẩu</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={password.old}
                onChange={(e) => onChangPass("old", e.target.value)}
                className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
              {errors.old && <p className="text-sm text-destructive">{errors.old}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <input
                  type="password"
                  value={password.newPass}
                  onChange={(e) => onChangPass("newPass", e.target.value)}
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
                {errors.newPass && <p className="text-sm text-destructive">{errors.newPass}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  value={password.confirm}
                  onChange={(e) => onChangPass("confirm", e.target.value)}
                  className="w-full p-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Cập nhật mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}
