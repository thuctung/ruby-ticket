"use client";
import { useEffect, useState } from "react";
import { Save, Search, MapPin, Users, ChevronRight, Info } from "lucide-react";
import { SearchButton } from "@/components/ui/customs/searchButton";
import { AGENT_TYPE, LIST_PRICE_TYPE, PRICE_TYPE } from "./constant";
import {
  getAgentType,
  getPromoByLocation,
  getTicketAgent,
  getTicketPromotion,
  getTicketPublic,
  updatePriceAgent,
  updatePricePrmotion,
  updatePricePublic,
} from "./api";
import { AgentType, CommonType } from "@/types";
import { SelectBox } from "@/components/ui/customs/selectBox";
import { LocationType, ProductType, PromotionType } from "@/types/ticket";
import { getLocation } from "@/app-controler/affi/getTicket/api";
import { get, isEmpty } from "lodash";
import { formatVND } from "@/helpers/money";
import { useCommonStore } from "@/stores/useCommonStore";

export default function PricingPageControler() {
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [priceType, setPriceType] = useState(PRICE_TYPE.WEBSITE);

  const [agentType, setAgentType] = useState(AGENT_TYPE.LEVEL_1);
  const [listAgentType, setListAgentType] = useState<AgentType[]>([]);

  const [location, setLocation] = useState("BANA");
  const [locationList, setLocationList] = useState<LocationType[]>([]);

  const [listPrice, setListPrice] = useState<Map<string, ProductType>>();

  const [promoList, setPromoList] = useState<PromotionType[]>([]);
  const [promo, setPromo] = useState("");

  const fetchAgentType = async () => {
    const data = await getAgentType();
    if (data?.length) {
      setListAgentType(data);
    }
  };

  const handleChangePrice = (itemCode: string, value: number) => {
    const newItem = listPrice?.get(itemCode);
    if (newItem) {
      newItem.price = value;
      listPrice?.set(itemCode, newItem);
      const newMap = new Map(listPrice);
      setListPrice(newMap);
    }
  };

  const handleGetLocation = async () => {
    const resLocation = await getLocation();
    if (resLocation) {
      setLocationList(resLocation);
    }
  };

  const handleSearchPrice = async () => {
    let data = null;
    switch (priceType) {
      case PRICE_TYPE.WEBSITE: {
        data = await getTicketPublic(location);
        break;
      }
      case PRICE_TYPE.NORMAL: {
        if (agentType) {
          data = await getTicketAgent(location, agentType);
        }
        break;
      }
      case PRICE_TYPE.PROMOTION: {
        data = await getTicketPromotion(location, agentType, promo);
        break;
      }
    }
    if (data) {
      const mapPrice: any = new Map(data.map((item: any) => [item.code, item]));
      setListPrice(mapPrice);
    }
  };

  const handleChangeLocation = (locationCode: string) => {
    setLocation(locationCode);
  };

  const handleSavePrice = async () => {
    if (listPrice && !isEmpty(listPrice)) {
      let data = null;
      const listItemPrice = Array.from(listPrice).map(([code, item]) => item);
      switch (priceType) {
        case PRICE_TYPE.WEBSITE: {
          data = await updatePricePublic(listItemPrice);
          break;
        }
        case PRICE_TYPE.NORMAL: {
          const list = listItemPrice.map((item) => ({
            agent_code: item.agent_code,
            ticket_variant_code: item.ticket_type_code,
            price: item.price,
          }));
          // data = await updatePriceAgent(list);
          break;
        }
        case PRICE_TYPE.PROMOTION: {
          const list: any = listItemPrice.map((item: any) => ({
            price: item.price,
            promo_code: item.promo_code,
            agent_level_code: item.agent_level_code,
            ticket_variant_code:item.ticket_variant_code
          }));
          data = await updatePricePrmotion(list);
          break;
        }
      }

      if (data) {
        const newMap = new Map();
        setListPrice(newMap);
      }
    }
  };

  const fetchPromoLocation = async () => {
    const data = await getPromoByLocation(location);
    if (data && data.length) {
      setPromoList(data);
      setPromo(get(data, [0, "code"]));
    } else {
      setPromoList([]);
      setPromo("");
      setToastMessage("Chưa có khuyến mãi cho địa điểm này");
    }
  };

  useEffect(() => {
    if (location && priceType === PRICE_TYPE.PROMOTION) {
      fetchPromoLocation();
    }
  }, [location, priceType]);

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
              <SelectBox onChange={(value) => handleChangeLocation(value)} value={location}>
                {locationList.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </SelectBox>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Loại giá</label>
            <div className="relative">
              <SelectBox onChange={(value) => setPriceType(value)} value={priceType}>
                {LIST_PRICE_TYPE.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.name}
                  </option>
                ))}
              </SelectBox>
            </div>
          </div>
          {priceType === PRICE_TYPE.PROMOTION && promoList.length ? (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Tên khuyến mãi</label>
              <SelectBox onChange={(value) => setPromo(value)} value={promo}>
                {promoList.map((item) => (
                  <option value={item.code} key={item.code}>
                    {item.promo_name}
                  </option>
                ))}
              </SelectBox>
            </div>
          ) : null}

          {priceType !== PRICE_TYPE.WEBSITE ? (
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
          ) : null}
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <SearchButton onClick={handleSearchPrice} />
          </div>
        </div>
      </div>

      {/* SECTION 2: DANH SÁCH VÉ & EDIT GIÁ */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Danh sách loại vé</h3>
          </div>
          <button
            onClick={handleSavePrice}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm font-semibold"
          >
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>

        <div className="table-wrapper">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Tên loại vé</th>
                {priceType !== PRICE_TYPE.WEBSITE ? (
                  <th className="px-6 py-4 font-semibold">Giá gốc</th>
                ) : null}

                <th className="px-6 py-4 font-semibold w-64">Giá bán</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {Array.from(listPrice ?? new Map()).map(([code, priceItem]) => (
                <tr key={priceItem.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                      {priceItem.ticket_name}
                    </div>
                  </td>
                  {priceType !== PRICE_TYPE.WEBSITE ? (
                    <td className="px-6 py-5">
                      <span className="text-slate-400 line-through text-sm">
                        {formatVND(priceItem.base_price)} đ
                      </span>
                    </td>
                  ) : null}
                  <td className="px-6 py-5">
                    <div className="relative group/input">
                      <input
                        type="number"
                        value={priceItem.price}
                        onChange={(e) => handleChangePrice(priceItem.code, Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 pr-10"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-medium">
                        đ
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEmpty(listPrice) && (
          <div className="p-20 text-center space-y-3">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Search size={32} />
            </div>
            <p className="text-slate-500">Chưa có thông tin, vui lòng nhấn Tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  );
}
