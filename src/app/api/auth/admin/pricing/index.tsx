"use client";
import { useEffect, useState } from "react";
import { Save, Search, MapPin, Users, ChevronRight, Info } from "lucide-react";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { ResetButton } from "@/components/ui/customs/ressetButton";
import { AGENT_TYPE } from "./constant";
import { getAgentType, getTicketPublic } from "./api";
import { AgentType } from "@/types";
import { SelectBox } from "@/components/ui/customs/selectBox";
import { LocationType } from "@/types/ticket";
import { getLocation } from "@/app-controler/affi/getTicket/api";

export default function PricingPageControler() {
  const [userType, setUserType] = useState("khach_le");

  const [agentType, setAgentType] = useState(AGENT_TYPE.WEBSITE);
  const [listAgentType, setListAgentType] = useState<AgentType[]>([]);

  const [agencyLevel, setAgencyLevel] = useState("1");
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState<LocationType[]>([]);

  // Dữ liệu mẫu - Thực tế bạn sẽ fetch từ Supabase
  const ticketList = [
    { id: 1, name: "Vé Cáp treo Bà Nà - Người lớn", originalPrice: 900000, currentPrice: 850000 },
    { id: 2, name: "Vé Cáp treo Bà Nà - Trẻ em", originalPrice: 750000, currentPrice: 700000 },
    { id: 3, name: "Buffet Trưa Arapang", originalPrice: 350000, currentPrice: 320000 },
  ];

  const fetchAgentType = async () => {
    const data = await getAgentType();
    if (data?.length) {
      setListAgentType(data);
    }
  };

  const handleGetLocation = async () => {
    const resLocation = await getLocation();
    if (resLocation) {
      setLocationList(resLocation);
    }
  };

  const fetchTicketPublic = async (locationCode: string) => {
    const data = await getTicketPublic(locationCode);
  };

  const handleChangeLocation = (locationCode: string) => {
    setLocation(locationCode);
    fetchTicketPublic(locationCode);
  };

  useEffect(() => {
    fetchAgentType();
    handleGetLocation();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Users size={20} />
          </div>
          <h2 className="font-bold text-xl">Cấu hình đối tượng & Địa điểm</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chọn Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Địa điểm</label>
            <div className="relative">
              <SelectBox onChange={(value) => handleChangeLocation(value)} value={agentType}>
                {locationList.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </SelectBox>
            </div>
          </div>
          {/* Chọn đối tượng */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Loại đối tượng</label>
            <SelectBox onChange={(value) => setAgentType(value)} value={agentType}>
              {listAgentType.map((item) => (
                <option value={item.code} key={item.code}>
                  {item.name}
                </option>
              ))}
            </SelectBox>
          </div>
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <SearchButton onClick={() => console.log("ok")} />
            <ResetButton onClick={() => console.log("ok")} />
          </div>
        </div>
      </div>

      {/* SECTION 2: DANH SÁCH VÉ & EDIT GIÁ */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Danh sách loại vé</h3>
            <p className="text-xs text-slate-500 mt-1">
              Đang chỉnh sửa giá cho:{" "}
              <span className="text-blue-600 font-medium">
                {userType} {userType === "dai_ly" && `- Cấp ${agencyLevel}`}
              </span>
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm font-semibold">
            <Save size={18} />
            Lưu tất cả thay đổi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Tên loại vé</th>
                <th className="px-6 py-4 font-semibold">Giá gốc (Tham khảo)</th>
                <th className="px-6 py-4 font-semibold w-64">Giá áp dụng cho đối tượng</th>
                <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ticketList.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                      {ticket.name}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-slate-400 line-through text-sm">
                      {ticket.originalPrice.toLocaleString()} đ
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="relative group/input">
                      <input
                        type="number"
                        defaultValue={ticket.currentPrice}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 pr-10"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">
                        đ
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đang bán
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ticketList.length === 0 && (
          <div className="p-20 text-center space-y-3">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-500">Vui lòng chọn địa điểm để xem danh sách vé</p>
          </div>
        )}
      </div>
    </div>
  );
}
