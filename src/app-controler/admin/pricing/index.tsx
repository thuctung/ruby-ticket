"use client";
import { useEffect, useState } from "react";
import { Save, Users } from "lucide-react";
import { createAgentPrice, getListPriceBySiteCode, updateAgentPrice } from "./api";
import { AgentType, CommonType } from "@/types";
import { SelectBox } from "@/components/ui/customs/selectBox";
import { SideSunGroupType } from "@/types/ticket";
import { useCommonStore } from "@/stores/useCommonStore";
import { getSiteListSun } from "@/components/GetTicketSunGroupForm/api";
import { ButtonCommon } from "@/components/ui/customs/buttonCommon";
import CreatePriceForm from "./components/create-price";
import { getListAgent } from "../agent-mgt/api";
import { AgentPriceSubmitType, AgentPriceType } from "./type";
import { CUSTOMER } from "@/commons/constant";

export default function PricingPageControler() {
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [listPrice, setListPrice] = useState<AgentPriceType[]>([]);

  const [siteSunGroup, setSiteSunGroup] = useState<SideSunGroupType[]>([]);

  const [siteSunCode, setSiteSunCode] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const [agentList, setAgentList] = useState<AgentType[]>([]);

  const getSiteSunGroup = async () => {
    const data = await getSiteListSun();
    if (data) {
      setSiteSunGroup(data);
    }
  };

  const handleSearch = async () => {
    const { data } = await getListPriceBySiteCode(siteSunCode);
    if (data) {
      setListPrice(data);
    }
  };

  const fetchListAgent = async () => {
    const { data } = await getListAgent({
      searchValue: {},
      currentPage: 1,
    });
    if (data?.length) {
      setAgentList(data);
    }
  };

  const handleCreatePrice = async (value: AgentPriceSubmitType) => {
    const { data } = await createAgentPrice(value);
    if (data.id) {
      handleSearch();
    }
  };

  useEffect(() => {
    getSiteSunGroup();
    fetchListAgent();
  }, []);

  const handleChangePrice = (value: string, index: number) => {
    const itemUpdate = listPrice[index];
    const newItem = { ...itemUpdate, price: Number(value) };
    const newList = [...listPrice];
    newList[index] = newItem;
    setListPrice(newList);
  };

  const handleSavePrice = async () => {
    const data = await updateAgentPrice(listPrice);
    if (data) {
      setListPrice([]);
    }
  };

  const getSiteName = (siteCode: string) => {
    return siteSunGroup.find((item) => item.code === siteCode)?.name || "";
  };

  const getLevelName = (siteCode: string) => {
    return agentList.find((item) => item.code === siteCode)?.name || "";
  };

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
              <SelectBox
                firstOption
                onChange={(value) => setSiteSunCode(value)}
                value={siteSunCode}
              >
                {siteSunGroup.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </SelectBox>
            </div>
          </div>
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <ButtonCommon onClick={handleSearch} title="Search" />
            <ButtonCommon onClick={() => setOpenForm(true)} title="Tạo mới" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Danh sách loại vé</h3>
          </div>
          <button
            onClick={handleSavePrice}
            disabled={listPrice.length === 0}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm font-semibold"
          >
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Địa điểm</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4 w-48 text-right">Giá cộng thêm (VND)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700 font-medium">
              {listPrice.map((price, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  {/* Cột địa điểm */}
                  <td className="py-4 px-4 text-slate-900">{getSiteName(price.site_code)}</td>

                  {/* Cột phân cấp/loại */}
                  <td className="py-4 px-4 text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-xs font-mono">
                      {getLevelName(price.agent_code)}
                    </span>
                  </td>

                  {/* Cột Input giá tiền */}
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <input
                        type="number"
                        min={0}
                        value={price.price}
                        className="w-28 text-right bg-transparent border-none outline-none font-semibold text-slate-800"
                        placeholder="0"
                        onChange={(e) => handleChangePrice(e.target.value, index)}
                      />
                      <span className="text-xs text-slate-400">
                        {price.agent_code === CUSTOMER ? "%" : "đ"}
                      </span>
                    </div>
                    {price.agent_code === CUSTOMER ? (
                      <div>
                        <span className="text-[red] text-xs">Phần trăm giảm trên giá công bố</span>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreatePriceForm
        agentList={agentList}
        listSide={siteSunGroup}
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreatePrice}
      />
    </div>
  );
}
